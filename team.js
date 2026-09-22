(function () {
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
  }

  function cardHtml(member, showSocials) {
    const photo = member.photo_url
      ? `<img class="member-photo" src="${escapeHtml(member.photo_url)}" alt="${escapeHtml(member.name)}" loading="lazy">`
      : '';
    const socials =
      showSocials
        ? `<p class="member-socials">
            ${member.instagram_url ? `<a href="${escapeHtml(member.instagram_url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(member.name)} on Instagram"><i class="icon-instagram"></i></a>` : ''}
            ${member.linkedin_url ? `<a href="${escapeHtml(member.linkedin_url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(member.name)} on LinkedIn"><i class="icon-linkedin">in</i></a>` : ''}
          </p>`
        : '';
    return `<article class="team-card reveal">${photo}<h3 class="display">${escapeHtml(member.name)}</h3><p class="member-role">${escapeHtml(member.role)}</p>${socials}</article>`;
  }

  function renderGrid(elId, members, showSocials) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = members.length
      ? members.map((m) => cardHtml(m, showSocials)).join('')
      : '<p class="team-empty mono">No members added yet.</p>';
  }

  async function loadTeam() {
    try {
      const res = await fetch('/api/team');
      if (!res.ok) throw new Error('Failed to load team');
      const members = await res.json();
      renderGrid('team-grid-council', members.filter((m) => m.category === 'council'), true);
      renderGrid('team-grid-advisory', members.filter((m) => m.category === 'advisory'), false);
    } catch (err) {
      console.error(err);
    }
  }

  document.addEventListener('DOMContentLoaded', loadTeam);
})();
