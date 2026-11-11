#!/usr/bin/env bash
# GitHub Actions rebuilds only the added visual enhancements.
set -euo pipefail
cd "$(dirname "$0")/../.."
node .github/scripts/build-opportunities.mjs
node .github/scripts/check-opportunities-fit.mjs
npm ci --prefix .github/image-tools --ignore-scripts --no-audit --no-fund
node .github/scripts/build-images.cjs
python3 .github/scripts/check-images.py
node .github/scripts/check-globe-startup.mjs
npm exec --yes --package=esbuild@0.28.2 -- esbuild \
  graphics-worker.js edge-decorations.js --bundle --format=esm \
  --minify --target=es2022 --outdir=assets/runtime \
  --entry-names='[name]' --chunk-names='shared-[hash]' --legal-comments=linked
npm exec --yes --package=esbuild@0.28.2 -- esbuild \
  observatory-loader.js --bundle --minify --format=esm --target=es2022 \
  --outfile=observatory-entry.js
node --experimental-vm-modules .github/scripts/check-effects-build.mjs
cat motion.css polish.css observatory.css | \
  npm exec --yes --package=esbuild@0.28.2 -- esbuild \
  --loader=css --minify --target=es2022 > enhancements.css
python3 .github/scripts/embed-home-startup.py
python3 .github/scripts/check-home-startup.py
