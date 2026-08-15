# Image generation prompts

Built-in ImageGen was used. All assets share these fixed constraints: original premium anime-inspired editorial style; the same approachable 28-year-old Japanese man representing 流夢; natural short black hair, warm dark eyes, navy shirt and studio headphones; midnight navy and amber palette; large low-detail copy-safe areas; no words, numbers, logos, UI, watermark, medical cues, host-club styling or sexualized presentation unless the asset is explicitly a deterministic HTML-rendered promotional graphic.

- `hero-night-radio.webp`: Roomu in a quiet midnight radio studio, character lower right, large dark headline area upper left.
- `goodnight-seven-minutes.webp`: two unbranded phones, abstract seven-segment timer ring, meeting audio waves and mutual heart-shaped light, no copied app interface.
- `room-listening.webp`: Roomu listening attentively in an armchair, warm ivory copy-safe area on the left.
- `experience-books-office.webp`: unbranded communication books, blank notebook, headphones and reflections of multiple workplaces, no qualification implications.
- `phone-safe.webp`: Roomu on a private audio call, blank phone, clock and subtle safety motif, warm left-side copy area.
- `final-call.webp`: the same studio before dawn, Roomu calmly smiling, dark upper-left headline area and clear CTA space.
- `woman-before-call.webp`: Premium anime-inspired cinematic editorial illustration of an adult Japanese woman alone in a calm apartment at night, holding a phone loosely near her chest before making a call; tired and hesitant but safe, relatable and dignified; warm lamp, navy shadows, subtle rain reflections, reassuring atmosphere; vertical 9:16 mobile composition; no text, logos, UI, watermark, tears, medical cues, sexualization or horror.
- `woman-after-call.webp`: Premium anime-inspired cinematic editorial illustration of the same adult Japanese woman after a reassuring late-night phone conversation, resting by a window with a softened expression and a warm mug nearby; quiet relief rather than exaggerated happiness; pre-dawn navy and amber light, safe intimate apartment, vertical 9:16 mobile composition; no text, logos, UI, watermark, medical cues or sexualization.

## 2026-08-15 additions

- `goodnight-themes-v2.webp`: Keep the established midnight room and 流夢 character on the lower right. Preserve the amber segmented ring, but place four immediately recognizable, text-free pictograms inside it: a heart for love, a briefcase for work and career, two people with a speech bubble for relationships, and a cup with a speech bubble for casual conversation. No words, logos, app UI or medical symbols.
- `profile-icon-v2.png`: Close-up square portrait of the same 流夢 character, centered for a circular crop, relaxed eye contact, subtle smile, navy shirt, warm amber edge light, dark radio-room background, no text or props crossing the face.
- `service-portrait-v2.png`: Square portrait of the same character on the right side with a dark navy copy-safe area on the left, desk microphone and warm night-room light, no text or logos.

`coconala-service-main-v2.png` is a deterministic 1220 x 1016 listing image rendered from `coconala-card.html`. It uses `service-portrait-v2.png` and keeps the Japanese title, character face, four self-reported metrics and 500円/分 notation in separate safe areas.

`coconala-profile-cover-v2.png` is a deterministic 2560 x 840 profile cover rendered from `coconala-profile-cover.html`. It uses `service-portrait-v2.png`, the activity name `流夢 るうむ`, the Japanese reassurance copy and four conversation themes. The copy and face do not overlap.
