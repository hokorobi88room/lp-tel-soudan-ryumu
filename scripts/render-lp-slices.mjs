import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "assets", "lp-flat");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9300 + (process.pid % 300);
const sourceUrl = pathToFileURL(path.join(root, "lp-source.html")).href;

const slices = [
  ["header.hero", "01-hero.png"],
  ["section.empathy", "02-empathy.png"],
  ["section.proof", "03-proof.png"],
  ["section.promise", "04-promise.png"],
  ["section.topics", "05-topics.png"],
  ["section.experience", "06-experience.png"],
  ["section.after-call", "07-after-call.png"],
  ["section.steps", "08-steps.png"],
  ["section.boundaries", "09-boundaries.png"],
  ["section.faq", "10-faq.png"],
  ["section.final", "11-final.png"],
];

await mkdir(outputDir, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=/tmp/ryumu-lp-render-${process.pid}`,
  sourceUrl,
], { stdio: "ignore" });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTarget() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json`);
      const targets = await response.json();
      const target = targets.find((item) => item.type === "page");
      if (target) return target;
    } catch {
      // Chrome may still be starting.
    }
    await delay(100);
  }
  throw new Error("Chrome DevTools target did not become available.");
}

const target = await getTarget();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let requestId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  const id = ++requestId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 1000,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await send("Page.navigate", { url: sourceUrl });

  await send("Runtime.evaluate", {
    expression: `new Promise((resolve) => {
      if (document.readyState === "complete") resolve(true);
      else window.addEventListener("load", () => resolve(true), { once: true });
    })`,
    awaitPromise: true,
  });

  await send("Runtime.evaluate", {
    expression: `(async () => {
      document.documentElement.classList.add("render-flats");
      document.querySelectorAll("img").forEach((image) => {
        image.loading = "eager";
      });
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolve) => setTimeout(resolve, 300));
      window.scrollTo(0, 0);
      await document.fonts.ready;
      await Promise.all([...document.images].map(async (image) => {
        if (!image.complete) {
          await new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
            setTimeout(resolve, 10000);
          });
        }
        try { await image.decode(); } catch {}
      }));
      return true;
    })()`,
    awaitPromise: true,
  });

  const manifest = [];
  for (const [selector, filename] of slices) {
    const { result } = await send("Runtime.evaluate", {
      expression: `(() => {
        const element = document.querySelector(${JSON.stringify(selector)});
        if (!element) throw new Error("Missing selector: ${selector}");
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        };
      })()`,
      returnByValue: true,
    });
    const rect = result.value;
    const screenshot = await send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { ...rect, scale: 1 },
    });
    await writeFile(path.join(outputDir, filename), Buffer.from(screenshot.data, "base64"));
    manifest.push({ selector, filename, cssWidth: rect.width, cssHeight: rect.height });
  }
  await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
} finally {
  socket.close();
  chrome.kill("SIGTERM");
}

console.log(`Rendered ${slices.length} LP slices to ${outputDir}`);
