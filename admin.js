(function () {
  const loginView = document.getElementById('login-view');
  const appView = document.getElementById('app-view');

  // ---------- auth ----------

  async function checkAuth() {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (data.authenticated) {
      loginView.hidden = true;
      appView.hidden = false;
      loadMembers();
      loadContentForms();
    } else {
      loginView.hidden = false;
      appView.hidden = true;
    }
  }

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.hidden = true;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      errEl.textContent = data.error || 'Login failed';
      errEl.hidden = false;
      return;
    }
    document.getElementById('login-password').value = '';
    checkAuth();
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    checkAuth();
  });

  // ---------- tabs ----------

  document.querySelectorAll('.admin-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.admin-panel').forEach((p) => {
        p.hidden = p.dataset.panel !== target;
      });
    });
  });

  // ---------- team members ----------

  const memberForm = document.getElementById('member-form');
  const memberIdField = document.getElementById('member-id');
  const memberSubmitBtn = document.getElementById('member-submit-btn');
  const memberCancelBtn = document.getElementById('member-cancel-btn');
  const memberError = document.getElementById('member-error');
  const memberPhotoFile = document.getElementById('member-photo-file');
  const memberPhotoUrl = document.getElementById('member-photo-url');
  const memberPhotoPreview = document.getElementById('member-photo-preview');

  function resetMemberForm() {
    memberForm.reset();
    memberIdField.value = '';
    memberPhotoUrl.value = '';
    memberPhotoPreview.innerHTML = '';
    memberSubmitBtn.textContent = 'Add member';
    memberCancelBtn.hidden = true;
    memberError.hidden = true;
  }

  memberCancelBtn.addEventListener('click', resetMemberForm);

  async function uploadPhotoIfNeeded() {
    const file = memberPhotoFile.files[0];
    if (!file) return memberPhotoUrl.value || null;

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': file.type, 'x-filename': file.name },
      body: file,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Photo upload failed');
    }
    const data = await res.json();
    return data.url;
  }

  memberForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    memberError.hidden = true;

    let photoUrl;
    try {
      photoUrl = await uploadPhotoIfNeeded();
    } catch (err) {
      memberError.textContent = err.message;
      memberError.hidden = false;
      return;
    }

    const payload = {
      name: document.getElementById('member-name').value.trim(),
      role: document.getElementById('member-role').value.trim(),
      category: document.getElementById('member-category').value,
      instagram_url: document.getElementById('member-instagram').value.trim() || null,
      linkedin_url: document.getElementById('member-linkedin').value.trim() || null,
      sort_order: Number(document.getElementById('member-sort').value || 0),
      photo_url: photoUrl,
    };

    const id = memberIdField.value;
    const res = await fetch(id ? `/api/team/${id}` : '/api/team', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      memberError.textContent = data.error || 'Save failed';
      memberError.hidden = false;
      return;
    }

    resetMemberForm();
    loadMembers();
  });

  function fillMemberForm(m) {
    memberIdField.value = m.id;
    document.getElementById('member-name').value = m.name;
    document.getElementById('member-role').value = m.role;
    document.getElementById('member-category').value = m.category;
    document.getElementById('member-instagram').value = m.instagram_url || '';
    document.getElementById('member-linkedin').value = m.linkedin_url || '';
    document.getElementById('member-sort').value = m.sort_order || 0;
    memberPhotoUrl.value = m.photo_url || '';
    memberPhotoPreview.innerHTML = m.photo_url ? `<img src="${m.photo_url}" alt="">` : '';
    memberSubmitBtn.textContent = 'Save changes';
    memberCancelBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteMember(id) {
    if (!confirm('Remove this member?')) return;
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) {
      alert('Delete failed');
      return;
    }
    loadMembers();
  }

  function renderMemberRow(m) {
    const row = document.createElement('div');
    row.className = 'admin-member-row';
    row.innerHTML = `
      ${m.photo_url ? `<img src="${m.photo_url}" alt="">` : '<div style="width:48px;height:48px;border:1px solid var(--line);flex:none"></div>'}
      <div class="info"><b>${m.name}</b><span>${m.role}</span></div>
      <div class="actions">
        <button type="button" data-action="edit">Edit</button>
        <button type="button" data-action="delete" class="danger">Delete</button>
      </div>`;
    row.querySelector('[data-action="edit"]').addEventListener('click', () => fillMemberForm(m));
    row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteMember(m.id));
    return row;
  }

  async function loadMembers() {
    const res = await fetch('/api/team');
    const members = await res.json();

    const councilEl = document.getElementById('member-list-council');
    const advisoryEl = document.getElementById('member-list-advisory');
    councilEl.innerHTML = '';
    advisoryEl.innerHTML = '';

    members
      .filter((m) => m.category === 'council')
      .forEach((m) => councilEl.appendChild(renderMemberRow(m)));
    members
      .filter((m) => m.category === 'advisory')
      .forEach((m) => advisoryEl.appendChild(renderMemberRow(m)));
  }

  // ---------- homepage content ----------

  async function loadContentForms() {
    const res = await fetch('/api/content');
    const data = await res.json();
    document.querySelectorAll('.content-form').forEach((form) => {
      const key = form.dataset.key;
      const block = data[key] || {};
      Object.keys(block).forEach((field) => {
        const input = form.elements.namedItem(field);
        if (input) input.value = block[field] ?? '';
      });
    });
  }

  document.querySelectorAll('.content-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const key = form.dataset.key;
      const payload = {};
      new FormData(form).forEach((value, name) => {
        payload[name] = value;
      });

      const res = await fetch(`/api/content/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const savedNote = form.querySelector('.content-saved');
      if (!res.ok) {
        alert('Save failed');
        return;
      }
      savedNote.hidden = false;
      setTimeout(() => (savedNote.hidden = true), 2000);
    });
  });

  checkAuth();
})();
