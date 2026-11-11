"""Keep full-size source images out of the homepage's initial download budget."""
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[2]
manifest = json.loads((ROOT / '.github/image-tools/manifest.json').read_text())

class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.icons = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img':
            self.images.append(attrs)
        elif tag == 'link' and attrs.get('rel') in ('icon', 'shortcut icon'):
            self.icons.append(attrs)

for source, record in manifest.items():
    assert sha256((ROOT / source).read_bytes()).hexdigest() == record['sourceHash'], f'Stale optimized copy: {source}'
    for candidate in record['candidates']:
        file = ROOT / candidate['path']
        assert file.stat().st_size == candidate['bytes']
        assert sha256(file.read_bytes()).hexdigest()[:12] in file.name, f'Incorrect immutable filename: {file}'

eager = set()
for page in ('index.html', 'hackathon/index.html', 'resources/index.html'):
    parser = Images()
    parser.feed((ROOT / page).read_text())
    for icon in parser.icons:
        assert '/optimized/favicon-' in icon['href']
        assert icon['data-source-href'].endswith('assets/favicon.png')
    for img in parser.images:
        source = re.sub(r'^(?:\.\./|/)', '', img['src'])
        # Missing/invalid loading values are eager by default in browsers.
        is_eager = img.get('loading', '').lower() != 'lazy'
        if source not in manifest:
            if page == 'index.html' and is_eager:
                eager.add(source)
            continue
        record = manifest[source]
        expected = ', '.join(('' if page == 'index.html' else '../') + c['path'] + f" {c['width']}w" for c in record['candidates'])
        assert img['srcset'] == expected, f'Incorrect responsive sources: {source}'
        assert img['sizes'] == record.get('sizes', f"{record['display']}px")
        assert int(img['width']) == record['width'] and int(img['height']) == record['height']
        assert "removeAttribute('srcset')" in img['onerror'], f'Original fallback missing: {source}'
        if 'team-avatar' in img.get('class', '') or record['display'] in (70, 82):
            assert img['loading'] == 'lazy', f'Offscreen image must wait: {source}'
        if page == 'index.html' and is_eager:
            eager.add(record['candidates'][-1]['path'])

eager.add(manifest['assets/favicon.png']['candidates'][0]['path'])
initial_bytes = sum((ROOT / name).stat().st_size for name in eager)
max_copies = sum(record['candidates'][-1]['bytes'] for record in manifest.values())
assert initial_bytes < 120_000, f'Homepage eager image budget exceeded: {initial_bytes}'
assert max_copies < 1_200_000, f'Optimized image budget exceeded: {max_copies}'
print(f'Pass: initial image budget {initial_bytes:,} bytes; responsive sources, deferred photos, fallbacks and immutable filenames verified.')
