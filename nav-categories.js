(() => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const groups = [...nav.querySelectorAll('.nav-group')];
  const closeGroups = except => groups.forEach(group => {
    if (group !== except) group.open = false;
  });
  groups.forEach(group => group.addEventListener('toggle', () => {
    if (group.open) closeGroups(group);
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-group') || event.target.closest('.nav-submenu a')) closeGroups();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = groups.find(group => group.open && group.contains(document.activeElement));
    if (!open) return;
    event.preventDefault();
    event.stopPropagation();
    open.open = false;
    open.querySelector('summary').focus();
  }, true);
})();
