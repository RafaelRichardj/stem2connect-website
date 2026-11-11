// Keep editing the original assets and HTML src attributes. Build smaller
// browser-selected copies; never overwrite or remove an original image.
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const sharp = require('../image-tools/node_modules/sharp');

const root = path.resolve(__dirname, '../..');
const hash = data => createHash('sha256').update(data).digest('hex');
const profiles = {
  discord_red_symbol: { sizes: [96], display: 22 },
  discord_green_symbol: { sizes: [96], display: 22 },
  events_symbol: { sizes: [96], display: 22 },
  watch_symbol: { sizes: [96], display: 22 },
  sparkle_symbol: { sizes: [144], display: 42 },
  compass_symbol: { sizes: [144], display: 42 },
  growth_symbol: { sizes: [144], display: 42 },
  animal_welfare_webinar: { sizes: [224], display: 70 },
  "college_application_q&a": { sizes: [224], display: 70 },
  satvik_webinar: { sizes: [224], display: 70 },
  cryptology: { sizes: [224], display: 70 },
  spotlight_webinar_symbol: { sizes: [224], display: 70 },
  ai_webinar_symbol: { sizes: [224], display: 70 },
  hums_logo: { sizes: [256], display: 82, extension: 'jpg' },
  stemist_education_logo: { sizes: [192], display: 180 },
  ...Object.fromEntries(['andrea', 'anna', 'adelaide', 'bernice', 'rafael', 'rylan', 'hadia', 'arjun', 'aira', 'satvik', 'rudransh', 'cynthia']
    .map(name => [name, { sizes: [320, 480], display: 288, quality: 88,
      responsive: '(max-width: 600px) 124px, (max-width: 1000px) 42vw, 260px' }])),
  favicon: { sizes: [96], format: 'png' }
};
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
function setAttr(tag, name, value) {
  const pattern = new RegExp(`\\s${name}="[^"]*"`);
  const attribute = ` ${name}="${value}"`;
  return pattern.test(tag) ? tag.replace(pattern, attribute) : tag.replace(/\s*\/?>$/, end => attribute + end);
}

async function build() {
  await fs.mkdir(path.join(root, 'assets/optimized'), { recursive: true });
  const manifest = {};
  for (const [name, profile] of Object.entries(profiles)) {
    const source = `assets/${name}.${profile.extension || 'png'}`;
    const input = await fs.readFile(path.join(root, source));
    const metadata = await sharp(input).metadata();
    const candidates = [];
    for (const size of profile.sizes) {
      const image = sharp(input).autoOrient().resize({ width: size, height: size, fit: 'outside', withoutEnlargement: true });
      const format = profile.format || 'webp';
      const { data, info } = await (format === 'png'
        ? image.png({ compressionLevel: 9 })
        : image.webp(profile.quality
          ? { quality: profile.quality, effort: 6 }
          : { lossless: true, exact: true, effort: 6 })).toBuffer({ resolveWithObject: true });
      const output = `assets/optimized/${name}-${info.width}-${hash(data).slice(0, 12)}.${format}`;
      await fs.writeFile(path.join(root, output), data);
      candidates.push({ path: output, width: info.width, height: info.height, bytes: data.length });
    }
    manifest[source] = { sourceHash: hash(input), sourceBytes: input.length, width: metadata.width, height: metadata.height, display: profile.display, ...(profile.responsive ? { sizes: profile.responsive } : {}), candidates };
  }

  for (const page of ['index.html', 'hackathon/index.html', 'resources/index.html']) {
    const filename = path.join(root, page);
    const html = await fs.readFile(filename, 'utf8');
    const hero = html.indexOf('id="home"');
    const heroEnd = hero < 0 ? Infinity : html.indexOf('</section>', hero);
    const prefix = page === 'index.html' ? '' : '../';
    const updated = html.replace(/<img\b[^>]*>/g, (tag, offset) => {
      const source = attr(tag, 'src')?.replace(/^(?:\.\.\/|\/)/, '');
      const record = manifest[source];
      if (!record || source.endsWith('/favicon.png')) return tag;
      tag = setAttr(tag, 'srcset', record.candidates.map(c => `${prefix}${c.path} ${c.width}w`).join(', '));
      tag = setAttr(tag, 'sizes', record.sizes || `${record.display}px`);
      tag = setAttr(tag, 'width', record.width);
      tag = setAttr(tag, 'height', record.height);
      tag = setAttr(tag, 'decoding', 'async');
      tag = setAttr(tag, 'loading', offset > heroEnd ? 'lazy' : 'eager');
      const fallback = "this.removeAttribute('srcset');this.removeAttribute('sizes');";
      const oldError = attr(tag, 'onerror') || 'this.onerror=null;';
      if (!oldError.startsWith(fallback)) tag = setAttr(tag, 'onerror', fallback + oldError);
      return tag;
    }).replace(/<link\b[^>]*>/g, tag => {
      if (!['icon', 'shortcut icon'].includes(attr(tag, 'rel'))) return tag;
      const original = attr(tag, 'data-source-href') || attr(tag, 'href');
      if (!original?.endsWith('assets/favicon.png')) return tag;
      tag = setAttr(tag, 'data-source-href', original);
      return setAttr(tag, 'href', prefix + manifest['assets/favicon.png'].candidates[0].path);
    });
    await fs.writeFile(filename, updated);
  }
  await fs.writeFile(path.join(root, '.github/image-tools/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  const originals = Object.values(manifest).reduce((n, r) => n + r.sourceBytes, 0);
  const largest = Object.values(manifest).reduce((n, r) => n + r.candidates.at(-1).bytes, 0);
  console.log(`Image copies: ${originals.toLocaleString()} -> ${largest.toLocaleString()} bytes at the highest supplied resolution. Originals retained.`);
}
build().catch(error => { console.error(error); process.exitCode = 1; });
