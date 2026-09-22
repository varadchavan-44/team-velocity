(function () {
  function set(selector, value, isHtml) {
    const el = document.querySelector(`[data-content="${selector}"]`);
    if (!el || value == null) return;
    if (isHtml) el.innerHTML = value;
    else el.textContent = value;
  }

  async function loadContent() {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) throw new Error('Failed to load content');
      const data = await res.json();

      if (data.hero) {
        set('hero-eyebrow', data.hero.eyebrow);
        set('hero-heading', data.hero.heading_html, true);
        set('hero-subtext', data.hero.subtext);
      }
      if (data.update) {
        set('update-status', data.update.status_label);
        set('update-date', data.update.date_label);
        set('update-heading', data.update.heading_html, true);
        set('update-body', data.update.body);
      }
      if (data.partner) {
        set('partner-eyebrow', data.partner.eyebrow);
        set('partner-heading', data.partner.heading);
        set('partner-subtext', data.partner.subtext);
      }
    } catch (err) {
      console.error(err);
    }
  }

  document.addEventListener('DOMContentLoaded', loadContent);
})();
