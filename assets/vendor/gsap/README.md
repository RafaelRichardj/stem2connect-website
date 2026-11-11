# GSAP / ScrollTrigger 3.15.0

Self-hosted, pinned bundle from the official `gsap@3.15.0` npm package.
Exports only `gsap` (including CSSPlugin) and `ScrollTrigger`.
Copyright notices are retained inside the bundle.

Copyright (c) 2008-2026, GreenSock. All rights reserved.
License: https://gsap.com/standard-license
Source: https://www.npmjs.com/package/gsap/v/3.15.0

Built with esbuild 0.28.2 from these two exports:

```js
export { gsap } from 'gsap';
export { ScrollTrigger } from 'gsap/ScrollTrigger.js';
```

Build options: `--bundle --format=esm --minify --target=es2022 --legal-comments=inline`.

Only `hackathon-motion.js` imports this bundle. Reduced-motion and data-saving
visits skip the import entirely. No CDN or runtime package installation is used.
