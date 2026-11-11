// A small SVG timeline: no library, assets, or continuous animation loop.
(() => {
  const grid = document.querySelector('#about .values-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.value-card')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 1020px)');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('values-connection');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<path class="values-track"/><path class="values-progress" pathLength="1"/>';
  grid.prepend(svg);
  const paths = [...svg.children];
  let points = [], frame = 0, visible = false;
  const reached = new Set();
  function measure() {
    points = cards.map(card => {
      const icon = card.querySelector('.value-symbol');
      return { x: card.offsetLeft + icon.offsetLeft + icon.offsetWidth / 2,
        y: card.offsetTop + icon.offsetTop + icon.offsetHeight / 2 };
    });
    svg.setAttribute('viewBox', `0 0 ${grid.clientWidth} ${grid.clientHeight}`);
    paths.forEach(path => path.setAttribute('d', points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')));
    schedule();
  }
  function update() {
    frame = 0;
    if (!points.length) return;
    const top = grid.getBoundingClientRect().top;
    const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, narrow.matches
      ? (innerHeight * .68 - top - points[0].y) / Math.max(1, points.at(-1).y - points[0].y)
      : (innerHeight * .85 - top) / (innerHeight * .45)));
    paths[1].style.strokeDashoffset = String(1 - progress);
    cards.forEach((card, index) => {
      const active = progress >= index / (cards.length - 1) && (progress > 0 || reduced.matches);
      card.classList.toggle('value-reached', active);
      if (active && !reached.has(card) && !reduced.matches) {
        reached.add(card);
        card.querySelector('.value-symbol svg').animate?.([
          { transform: 'scale(.8) rotate(-12deg)' },
          { transform: 'scale(1.12) rotate(5deg)', offset: .6 },
          { transform: 'scale(1) rotate(0)' },
        ], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    });
  }
  function schedule() { if (!frame && (visible || reduced.matches)) frame = requestAnimationFrame(update); }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) { measure(); schedule(); }
  }, { rootMargin: '80px' });
  observer.observe(grid);
  const resize = new ResizeObserver(measure);
  resize.observe(grid);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  reduced.addEventListener('change', () => {
    if (reduced.matches) cards.forEach(card => card.querySelector('.value-symbol svg').getAnimations().forEach(a => a.cancel()));
    measure(); update();
  });
  document.fonts?.ready.then(measure);
  measure();
})();

// No render loop: the network responds only to pointer, focus, and selection events.
(() => {
  const network = document.querySelector('.mission-network');
  if (!network) return;
  const nodes = [...network.querySelectorAll('[data-mission-node]')];
  const links = [...network.querySelectorAll('[data-connects]')];
  let selected = null;
  const name = node => node?.dataset.missionNode;
  function highlight(node) {
    nodes.forEach(item => item.classList.toggle('is-active', item === node));
    links.forEach(link => link.classList.toggle('is-connected', !!node && link.dataset.connects.split(' ').includes(name(node))));
  }
  function restingNode() {
    return nodes.find(node => node === document.activeElement) || selected;
  }
  nodes.forEach(node => {
    node.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') highlight(node); });
    node.addEventListener('pointerleave', () => highlight(restingNode()));
    node.addEventListener('focus', () => highlight(node));
    node.addEventListener('blur', () => highlight(selected));
    node.addEventListener('click', () => {
      selected = selected === node ? null : node;
      nodes.forEach(item => item.setAttribute('aria-pressed', String(item === selected)));
      highlight(selected);
    });
  });
  network.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    selected = null;
    nodes.forEach(node => node.setAttribute('aria-pressed', 'false'));
    highlight(null);
  });
})();

// One short stroke on entry. The finished underline is the no-JS/reduced-motion default.
(() => {
  const heading = document.querySelector('.about-headline');
  if (!heading || !heading.querySelector('.pencil-underline')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  heading.classList.add('underline-pending');
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    heading.classList.remove('underline-pending');
    heading.classList.add('underline-drawn');
    observer.disconnect();
  }, { threshold: .35 });
  observer.observe(heading);
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    heading.classList.remove('underline-pending', 'underline-drawn');
  });
})();
