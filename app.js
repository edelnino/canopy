/* ============================================
   CANOPY MEMBRANE - APP.JS
   Interactive Portfolio + Full Functionality
   ============================================ */

'use strict';

// ─── DEFAULT PORTFOLIO DATA ───────────────────────────────────────────────────
const DEFAULT_PORTFOLIO = [
  {
    id: 1, title: 'Kanopi Membran Mall Summarecon',
    category: 'komersial', location: 'Tangerang', year: 2023,
    area: '1.200 m²', desc: 'Pemasangan kanopi membran PTFE untuk area parkir terbuka mall Summarecon, memberikan perlindungan premium dari sinar UV dan hujan.',
    image: 'assets/portfolio_1.png', visible: true, featured: true,
    tags: ['PTFE', 'Parkir', 'Komersial']
  },
  {
    id: 2, title: 'Shade Structure Kolam Renang Hotel',
    category: 'hospitality', location: 'Bali', year: 2023,
    area: '480 m²', desc: 'Pemasangan kanopi membran elegan di area kolam renang resort bintang 5 di Bali dengan desain yang harmonis dengan alam sekitar.',
    image: 'assets/portfolio_2.png', visible: true, featured: true,
    tags: ['Resort', 'Pool', 'Hospitality']
  },
  {
    id: 3, title: 'Atap Membran Area Parkir Stadion',
    category: 'olahraga', location: 'Jakarta', year: 2022,
    area: '3.500 m²', desc: 'Proyek kanopi membran skala besar untuk area parkir stadion nasional dengan bentang lebar tanpa kolom tengah.',
    image: 'assets/portfolio_3.png', visible: true, featured: false,
    tags: ['Stadion', 'Bentang Lebar', 'HDPE']
  },
  {
    id: 4, title: 'Carport Membran Rumah Mewah',
    category: 'residensial', location: 'BSD City', year: 2024,
    area: '120 m²', desc: 'Carport membran eksklusif untuk hunian mewah dengan desain modern minimalis yang mempercantik fasad rumah.',
    image: 'assets/portfolio_4.png', visible: true, featured: false,
    tags: ['Carport', 'Residensial', 'Custom']
  },
  {
    id: 5, title: 'Pergola Kafe & Restoran Outdoor',
    category: 'hospitality', location: 'Bandung', year: 2024,
    area: '280 m²', desc: 'Kanopi membran atmosferik untuk restoran outdoor modern, menggabungkan estetika dan fungsi sebagai peneduh prima.',
    image: 'assets/portfolio_5.png', visible: true, featured: false,
    tags: ['Kafe', 'Outdoor', 'Restoran']
  },
  {
    id: 6, title: 'Kanopi Taman Kota Jakarta',
    category: 'komersial', location: 'Jakarta Pusat', year: 2023,
    area: '650 m²', desc: 'Proyek ruang publik berupa kanopi membran ramah lingkungan untuk taman kota, menjadi ikon baru kawasan tersebut.',
    image: 'assets/portfolio_1.png', visible: true, featured: false,
    tags: ['Taman Kota', 'Publik', 'Hijau']
  },
  {
    id: 7, title: 'Lapangan Padel Indoor Membran',
    category: 'olahraga', location: 'Bogor', year: 2024,
    area: '320 m²', desc: 'Atap membran translucent untuk lapangan padel yang memaksimalkan cahaya alami sambil melindungi dari cuaca.',
    image: 'assets/portfolio_2.png', visible: true, featured: false,
    tags: ['Padel', 'Olahraga', 'Translucent']
  },
  {
    id: 8, title: 'Entrance Canopy Perkantoran',
    category: 'komersial', location: 'Jakarta Selatan', year: 2022,
    area: '200 m²', desc: 'Kanopi membran iconic sebagai entrance gedung perkantoran premium yang memberikan kesan pertama yang kuat.',
    image: 'assets/portfolio_3.png', visible: true, featured: false,
    tags: ['Office', 'Entrance', 'Premium']
  }
];

// ─── STATE ────────────────────────────────────────────────────────────────────
let state = {
  portfolio: [],
  settings: { columns: 3, itemsPerPage: 6 },
  filter: 'all',
  shownCount: 0,
  editingId: null,
  currentTags: [],
  currentImageData: null,
  lightboxIndex: 0,
  filteredItems: [],
  testimonialIndex: 0
};

// Load from localStorage or default
function loadData() {
  try {
    const saved = localStorage.getItem('cm_portfolio');
    const savedSettings = localStorage.getItem('cm_settings');
    state.portfolio = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO));
    if (savedSettings) state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
  } catch { state.portfolio = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO)); }
}

function saveData() {
  localStorage.setItem('cm_portfolio', JSON.stringify(state.portfolio));
  localStorage.setItem('cm_settings', JSON.stringify(state.settings));
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function categoryLabel(cat) {
  return { komersial: 'Komersial', residensial: 'Residensial', olahraga: 'Olahraga', hospitality: 'Hospitality' }[cat] || cat;
}

function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => {
    el.classList.add('hiding');
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

function generateId() { return Date.now() + Math.floor(Math.random() * 1000); }

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ─── HERO STATS COUNTER ───────────────────────────────────────────────────────
function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => observer.observe(n));
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function initReveal() {
  const revealEls = document.querySelectorAll(
    '.feature-card, .service-card, .about-feat, .process-step, .testimonial-card, .section-header'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
function getVisible() {
  return state.portfolio.filter(p => {
    if (!p.visible) return false;
    if (state.filter === 'all') return true;
    return p.category === state.filter;
  });
}

function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const loadMore = document.getElementById('btn-load-more');
  grid.style.gridTemplateColumns = `repeat(${state.settings.columns}, 1fr)`;

  state.filteredItems = getVisible();
  const perPage = state.settings.itemsPerPage || state.filteredItems.length;
  state.shownCount = Math.min(perPage, state.filteredItems.length);

  grid.innerHTML = '';
  state.filteredItems.forEach((item, idx) => {
    const card = createPortfolioCard(item, idx);
    card.classList.toggle('hidden', idx >= state.shownCount);
    grid.appendChild(card);
  });

  loadMore.style.display = state.shownCount < state.filteredItems.length ? 'inline-flex' : 'none';
}

function createPortfolioCard(item, idx) {
  const div = document.createElement('div');
  div.className = 'portfolio-card';
  div.dataset.id = item.id;
  div.dataset.idx = idx;

  div.innerHTML = `
    <div class="portfolio-img-wrap">
      <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='assets/portfolio_1.png'">
      <div class="portfolio-cat-badge">${categoryLabel(item.category)}</div>
      ${item.featured ? '<div class="portfolio-featured-badge">⭐ Unggulan</div>' : ''}
      <div class="portfolio-overlay">
        <div class="portfolio-overlay-actions">
          <button class="portfolio-action-btn view-btn" data-id="${item.id}">🔍 Lihat</button>
          <button class="portfolio-action-btn edit btn-edit-item" data-id="${item.id}">✏ Edit</button>
        </div>
      </div>
    </div>
    <div class="portfolio-info">
      <h3>${item.title}</h3>
      <div class="portfolio-meta">
        ${item.location ? `<span class="portfolio-meta-item">📍 ${item.location}</span>` : ''}
        ${item.year ? `<span class="portfolio-meta-item">📅 ${item.year}</span>` : ''}
        ${item.area ? `<span class="portfolio-meta-item">📐 ${item.area}</span>` : ''}
      </div>
    </div>
  `;

  // view lightbox
  div.querySelector('.view-btn').addEventListener('click', e => {
    e.stopPropagation();
    openLightbox(idx);
  });

  // edit
  div.querySelector('.btn-edit-item').addEventListener('click', e => {
    e.stopPropagation();
    openEditModal(item.id);
  });

  // click card = lightbox
  div.addEventListener('click', () => openLightbox(idx));

  return div;
}

function initFilterTabs() {
  document.getElementById('filter-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filter = btn.dataset.filter;
    renderPortfolio();
  });
}

function initLoadMore() {
  document.getElementById('btn-load-more').addEventListener('click', () => {
    const perPage = state.settings.itemsPerPage || 6;
    state.shownCount = Math.min(state.shownCount + perPage, state.filteredItems.length);
    const cards = document.querySelectorAll('#portfolio-grid .portfolio-card');
    cards.forEach((c, i) => c.classList.toggle('hidden', i >= state.shownCount));
    if (state.shownCount >= state.filteredItems.length) {
      document.getElementById('btn-load-more').style.display = 'none';
    }
  });
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function openLightbox(idx) {
  state.lightboxIndex = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const item = state.filteredItems[state.lightboxIndex];
  if (!item) return;
  document.getElementById('lightbox-img').src = item.image;
  document.getElementById('lightbox-title').textContent = item.title;
  document.getElementById('lightbox-meta').textContent =
    [item.location, item.year, item.area].filter(Boolean).join(' · ');
}

function initLightbox() {
  document.getElementById('lightbox-overlay').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);

  document.getElementById('lightbox-prev').addEventListener('click', () => {
    state.lightboxIndex = (state.lightboxIndex - 1 + state.filteredItems.length) % state.filteredItems.length;
    updateLightbox();
  });
  document.getElementById('lightbox-next').addEventListener('click', () => {
    state.lightboxIndex = (state.lightboxIndex + 1) % state.filteredItems.length;
    updateLightbox();
  });

  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-next').click();
  });
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('edit-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderModalList();
  activateTab('list');
}

function closeModal() {
  document.getElementById('edit-modal').classList.remove('open');
  document.body.style.overflow = '';
  resetForm();
}

function activateTab(name) {
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.modal-tab-content').forEach(c => {
    c.classList.toggle('active', c.id === `tab-content-${name}`);
  });
  if (name === 'list') renderModalList();
}

function initModal() {
  document.getElementById('btn-edit-portfolio').addEventListener('click', openModal);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('edit-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('edit-modal')) closeModal();
  });

  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  document.getElementById('btn-cancel-form').addEventListener('click', () => {
    resetForm();
    activateTab('list');
  });
}

// --- Render list ---
function renderModalList() {
  const list = document.getElementById('portfolio-list');
  if (!state.portfolio.length) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px">Belum ada item portofolio. Tambah yang pertama!</p>';
    return;
  }
  list.innerHTML = state.portfolio.map(item => `
    <div class="list-item" data-id="${item.id}">
      <img class="list-item-img" src="${item.image}" alt="${item.title}" onerror="this.src='assets/portfolio_1.png'">
      <div class="list-item-info">
        <div class="list-item-title">${item.title}</div>
        <div class="list-item-meta">
          <span class="cat-chip">${categoryLabel(item.category)}</span>
          ${item.location ? `<span>📍 ${item.location}</span>` : ''}
          ${item.year ? `<span>📅 ${item.year}</span>` : ''}
          ${!item.visible ? '<span style="color:#ef4444">Tersembunyi</span>' : ''}
          ${item.featured ? '<span style="color:#FFD700">⭐ Unggulan</span>' : ''}
        </div>
      </div>
      <div class="list-item-actions">
        <button class="list-action-btn move-up-btn" title="Pindah Atas" data-id="${item.id}">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/></svg>
        </button>
        <button class="list-action-btn move-down-btn" title="Pindah Bawah" data-id="${item.id}">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </button>
        <button class="list-action-btn edit-list-btn" title="Edit" data-id="${item.id}">
          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
        </button>
        <button class="list-action-btn toggle-vis-btn" title="${item.visible ? 'Sembunyikan' : 'Tampilkan'}" data-id="${item.id}">
          ${item.visible
            ? '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
            : '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>'
          }
        </button>
        <button class="list-action-btn danger delete-btn" title="Hapus" data-id="${item.id}">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  // Events
  list.querySelectorAll('.edit-list-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(+btn.dataset.id));
  });
  list.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteItem(+btn.dataset.id));
  });
  list.querySelectorAll('.toggle-vis-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleVisibility(+btn.dataset.id));
  });
  list.querySelectorAll('.move-up-btn').forEach(btn => {
    btn.addEventListener('click', () => moveItem(+btn.dataset.id, -1));
  });
  list.querySelectorAll('.move-down-btn').forEach(btn => {
    btn.addEventListener('click', () => moveItem(+btn.dataset.id, 1));
  });
}

function deleteItem(id) {
  if (!confirm('Hapus item ini dari portofolio?')) return;
  state.portfolio = state.portfolio.filter(p => p.id !== id);
  saveData();
  renderModalList();
  renderPortfolio();
  toast('Item dihapus', 'success');
}

function toggleVisibility(id) {
  const item = state.portfolio.find(p => p.id === id);
  if (!item) return;
  item.visible = !item.visible;
  saveData();
  renderModalList();
  renderPortfolio();
  toast(item.visible ? 'Item ditampilkan' : 'Item disembunyikan');
}

function moveItem(id, dir) {
  const idx = state.portfolio.findIndex(p => p.id === id);
  if (idx < 0) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= state.portfolio.length) return;
  [state.portfolio[idx], state.portfolio[newIdx]] = [state.portfolio[newIdx], state.portfolio[idx]];
  saveData();
  renderModalList();
  renderPortfolio();
}

// ─── EDIT FORM ────────────────────────────────────────────────────────────────
function openEditModal(id) {
  const item = state.portfolio.find(p => p.id === id);
  if (item) {
    state.editingId = id;
    fillForm(item);
  } else {
    state.editingId = null;
    resetForm();
  }
  openModal();
  activateTab('add');
}

function fillForm(item) {
  document.getElementById('form-id').value = item.id;
  document.getElementById('form-title').value = item.title || '';
  document.getElementById('form-category').value = item.category || '';
  document.getElementById('form-location').value = item.location || '';
  document.getElementById('form-year').value = item.year || '';
  document.getElementById('form-area').value = item.area || '';
  document.getElementById('form-desc').value = item.desc || '';
  document.getElementById('form-visible').checked = item.visible !== false;
  document.getElementById('form-featured').checked = !!item.featured;

  // Image
  if (item.image) {
    state.currentImageData = item.image;
    showPreview(item.image);
  } else {
    state.currentImageData = null;
    hidePreview();
  }

  // Tags
  state.currentTags = [...(item.tags || [])];
  renderTagsUI();
}

function resetForm() {
  state.editingId = null;
  state.currentTags = [];
  state.currentImageData = null;
  document.getElementById('edit-form').reset();
  document.getElementById('form-visible').checked = true;
  renderTagsUI();
  hidePreview();
}

function showPreview(src) {
  document.getElementById('upload-zone').style.display = 'none';
  document.getElementById('upload-preview').style.display = 'block';
  document.getElementById('preview-img').src = src;
}
function hidePreview() {
  document.getElementById('upload-zone').style.display = '';
  document.getElementById('upload-preview').style.display = 'none';
  document.getElementById('preview-img').src = '';
}

function renderTagsUI() {
  const list = document.getElementById('tags-list');
  list.innerHTML = state.currentTags.map(t => `
    <span class="tag-chip">${t}<button class="tag-remove" data-tag="${t}">×</button></span>
  `).join('');
  list.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentTags = state.currentTags.filter(t => t !== btn.dataset.tag);
      renderTagsUI();
    });
  });
}

function initForm() {
  // Upload zone
  const zone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('form-image');

  zone.addEventListener('click', () => fileInput.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  });
  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleImageFile(e.target.files[0]);
  });

  document.getElementById('remove-img').addEventListener('click', () => {
    state.currentImageData = null;
    fileInput.value = '';
    hidePreview();
  });

  // Tags input
  document.getElementById('tags-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = e.target.value.trim().replace(',', '');
      if (val && !state.currentTags.includes(val)) {
        state.currentTags.push(val);
        renderTagsUI();
      }
      e.target.value = '';
    }
  });

  // Form submit
  document.getElementById('edit-form').addEventListener('submit', e => {
    e.preventDefault();
    saveFormItem();
  });
}

function handleImageFile(file) {
  if (file.size > 5 * 1024 * 1024) { toast('File terlalu besar (maks 5MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    state.currentImageData = ev.target.result;
    showPreview(ev.target.result);
  };
  reader.readAsDataURL(file);
}

function saveFormItem() {
  const title = document.getElementById('form-title').value.trim();
  const category = document.getElementById('form-category').value;
  if (!title) { toast('Judul proyek wajib diisi', 'error'); return; }
  if (!category) { toast('Pilih kategori', 'error'); return; }

  const data = {
    id: state.editingId || generateId(),
    title,
    category,
    location: document.getElementById('form-location').value.trim(),
    year: +document.getElementById('form-year').value || null,
    area: document.getElementById('form-area').value.trim(),
    desc: document.getElementById('form-desc').value.trim(),
    image: state.currentImageData || 'assets/portfolio_1.png',
    visible: document.getElementById('form-visible').checked,
    featured: document.getElementById('form-featured').checked,
    tags: [...state.currentTags]
  };

  if (state.editingId) {
    const idx = state.portfolio.findIndex(p => p.id === state.editingId);
    if (idx >= 0) state.portfolio[idx] = data;
    toast('Proyek berhasil diperbarui ✅');
  } else {
    state.portfolio.unshift(data);
    toast('Proyek baru ditambahkan ✅');
  }

  saveData();
  renderPortfolio();
  resetForm();
  activateTab('list');
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function initSettings() {
  // Set initial radio
  const colRadio = document.querySelector(`input[name="columns"][value="${state.settings.columns}"]`);
  if (colRadio) colRadio.checked = true;

  document.querySelectorAll('input[name="columns"]').forEach(r => {
    r.addEventListener('change', () => {
      state.settings.columns = +r.value;
      saveData();
      renderPortfolio();
      toast(`Grid diubah ke ${r.value} kolom`);
    });
  });

  const ipp = document.getElementById('items-per-page');
  ipp.value = state.settings.itemsPerPage;
  ipp.addEventListener('change', () => {
    state.settings.itemsPerPage = +ipp.value;
    saveData();
    renderPortfolio();
    toast('Pengaturan disimpan');
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.portfolio, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'portofolio-canopy.json';
    a.click();
    toast('Data berhasil di-export');
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (!confirm('Reset semua data ke default? Perubahan akan hilang.')) return;
    state.portfolio = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO));
    saveData();
    renderPortfolio();
    renderModalList();
    toast('Data direset ke default');
  });
}

// ─── TESTIMONIAL SLIDER ───────────────────────────────────────────────────────
function initTestimonial() {
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('slider-dots');
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;

  // Create dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(idx) {
    state.testimonialIndex = (idx + total) % total;
    track.style.transform = `translateX(-${state.testimonialIndex * 100}%)`;
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === state.testimonialIndex));
  }

  document.getElementById('slide-prev').addEventListener('click', () => goTo(state.testimonialIndex - 1));
  document.getElementById('slide-next').addEventListener('click', () => goTo(state.testimonialIndex + 1));

  // Auto-slide
  let autoSlide = setInterval(() => goTo(state.testimonialIndex + 1), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => goTo(state.testimonialIndex + 1), 5000);
  });
}

// ─── SMOOTH SCROLL FOR NAV ────────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ─── ACTIVE NAV LINK ──────────────────────────────────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.style.fontWeight = a.getAttribute('href') === '#' + e.target.id ? '700' : '';
          a.style.color = a.getAttribute('href') === '#' + e.target.id ? '#fff' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ─── INIT ALL ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initNavbar();
  initCounters();
  initReveal();
  initFilterTabs();
  initLoadMore();
  renderPortfolio();
  initLightbox();
  initModal();
  initForm();
  initSettings();
  initTestimonial();
  initSmoothScroll();
  initActiveNav();

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });
});
