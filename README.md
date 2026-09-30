# Runable Plugins Website

Static website prototype. Plugins is the default page; Canvas and Chat are retained at `/canvas.html` and `/chat.html`.

## Run locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. Deploy the `dist/` directory on any static host; no build is required.

## Features

- Animated connector hero with video background and interactive plugin mention input.
- Four light-themed feature cards with blur entrances and hover-only looping animations.
- A scrolling directory of 120 local app logos.
- Subtle two-color backgrounds with ordered dither texture.
- FAQs, pricing, cloud closing section, and footer.
- Responsive layouts and reduced-motion support.

The chat, connection statuses, and workflows are demonstrations, not live integrations. The illustrative logo directory does not verify product support for every app. Pricing is a static snapshot. Account and plan links lead to Runable.

## Files

- `dist/index.html` and `dist/plugins.html`: synchronized Plugins entry points.
- `dist/plugins.css` and `dist/plugins.js`: hero and navigation.
- `dist/plugins-composer.js`: sample prompts and plugin selection.
- `dist/plugins-connectors.css` and `dist/plugins-connectors.js`: feature cards.
- `dist/plugins-bottom.css` and `dist/features-pricing.js`: bottom sections and billing toggle.
- `dist/assets/`: local images, video, fonts, and logos. Logo source manifests are included under `assets/plugins/`.
