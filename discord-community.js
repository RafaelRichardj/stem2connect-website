(() => {
  const panel = document.querySelector('.discord-community');
  const total = panel?.querySelector('.discord-community-total');
  const count = total?.querySelector('[data-discord-member-count]');
  if (!panel || !total || !count) return;

  const loadCount = async () => {
    try {
      const response = await fetch('https://discord.com/api/v10/invites/ZMa5pZWHcY?with_counts=true', { credentials: 'omit' });
      if (!response.ok) return;
      const data = await response.json();
      if (data.guild?.id !== '1366082247601422437' || !Number.isSafeInteger(data.approximate_member_count) || data.approximate_member_count < 0) return;
      count.textContent = new Intl.NumberFormat().format(data.approximate_member_count);
      total.hidden = false;
    } catch (_) {
      // The Discord widget and join link remain available if the count cannot load.
    }
  };

  if (!('IntersectionObserver' in window)) {
    loadCount();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    loadCount();
  }, { rootMargin: '300px' });
  observer.observe(panel);
})();
