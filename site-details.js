/* Lightweight section details: finite entrance animations and a local reading filter. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const details = [...document.querySelectorAll('.mini-lab, .invitation-card')];
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('detail-entered');
        observer.unobserve(entry.target);
      });
    }, { threshold: .22 });
    details.forEach(element => observer.observe(element));
    reduced.addEventListener('change', () => {
      if (reduced.matches) {
        observer.disconnect();
        details.forEach(element => element.classList.remove('detail-entered'));
      }
    });
  }

  const tools = document.querySelector('.reading-tools');
  const library = document.querySelector('.reading-library');
  if (!tools || !library) return;
  const input = tools.querySelector('input');
  const filters = [...tools.querySelectorAll('[data-topic-filter]')];
  const count = tools.querySelector('.reading-count');
  const empty = document.querySelector('.reading-empty');
  const cards = [...library.querySelectorAll('.publication-card')].map(element => ({
    element, topic: element.dataset.topic,
    text: element.textContent.toLocaleLowerCase().replace(/\s+/g, ' '),
  }));
  let topic = 'all';
  function filter() {
    const terms = input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    let found = 0;
    cards.forEach(card => {
      const visible = (topic === 'all' || card.topic === topic) && terms.every(term => card.text.includes(term));
      card.element.hidden = !visible;
      if (visible) found++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topicFilter === topic)));
    count.textContent = `${found} ${found === 1 ? 'read' : 'reads'}${topic === 'all' && !terms.length ? '' : ` of ${cards.length}`}`;
    empty.hidden = found !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { topic = button.dataset.topicFilter; filter(); }));
  input.addEventListener('input', filter);
  document.querySelector('[data-clear-reads]').addEventListener('click', () => {
    topic = 'all'; input.value = ''; filter(); input.focus();
  });
  tools.hidden = false;
  filter();
})();
