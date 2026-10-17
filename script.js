'use strict';

// Chemins depuis la racine du site, identiques sur l’accueil et les pages de projets.
// cover : image de couverture ; coverAlt : description de ce que montre l’image.
// video : fichier vidéo local facultatif (.mp4, .webm ou .ogv), jamais une page web.
// gallery : [{ src: 'assets/projects/cubik/detail.jpg', alt: 'Description précise', caption: '' }]
// Laissez les chemins vides tant que les médias ne sont pas disponibles.
const PROJECT_MEDIA = {
  "accueil": {
    "cover": "assets/projects/camera-car/web/vue-ensemble.jpg",
    "coverAlt": "Vue d’ensemble du bras articulé de CAMERA CAR monté à l’arrière d’un véhicule.",
    "video": "",
    "gallery": [],
    "position": "58% center"
  },
  "cubik": {
    "cover": "assets/projects/cubik/Screenshot 2026-10-17 183752.png",
    "coverAlt": "Structure noire du cube CUBIK incliné, avec une roue de réaction visible à l’intérieur.",
    "video": "",
    "gallery": [
      {
        "src": "assets/projects/cubik/Screenshot 2026-10-17 183810.png",
        "alt": "Cube CUBIK posé sur un coin sur une planche tenue par une personne.",
        "caption": "Démonstration du cube sur un support incliné."
      }
    ],
    "position": "57% center"
  },
  "slider": {
    "cover": "assets/projects/slider/Screenshot 2026-10-17 183633.png",
    "coverAlt": "Appareil photo Lumix installé sur la tête motorisée du slider, vu de face dans un atelier.",
    "video": "",
    "gallery": [
      {
        "src": "assets/projects/slider/Screenshot 2026-10-17 183654.png",
        "alt": "Vue arrière de l’appareil photo et de la tête motorisée sur le rail du slider.",
        "caption": "Vue arrière du montage et du rail motorisé."
      }
    ],
    "position": "50% center"
  },
  "camera-car": {
    "cover": "assets/projects/camera-car/web/vue-ensemble.jpg",
    "coverAlt": "Vue d’ensemble du bras articulé et du rail vertical de CAMERA CAR fixés à l’arrière d’un véhicule, avec un opérateur auprès de la caméra.",
    "video": "",
    "gallery": [
      {
        "src": "assets/projects/camera-car/web/bras-articule.jpg",
        "alt": "Détail des articulations en aluminium du bras, avec la caméra suspendue sous le stabilisateur.",
        "caption": "Le bras articulé et le support de caméra."
      },
      {
        "src": "assets/projects/camera-car/web/camera-stabilisee.jpg",
        "alt": "Caméra sur son stabilisateur au bout du bras articulé, avec un opérateur à côté.",
        "caption": "Réglage de la caméra sur son support stabilisé."
      },
      {
        "src": "assets/projects/camera-car/web/cartes-electroniques.jpg",
        "alt": "Deux cartes électroniques vertes : une carte équipée de boutons, potentiomètres et d’un module ESP32, et une carte nue.",
        "caption": "Les cartes électroniques du système."
      }
    ],
    "position": "53% center"
  },
  "foc": {
    "cover": "assets/projects/foc/Screenshot 2026-10-17 183953.png",
    "coverAlt": "Vue 3D de la carte électronique du contrôleur FOC, avec son module ESP32, ses condensateurs et ses connecteurs.",
    "video": "",
    "gallery": [
      {
        "src": "assets/projects/foc/Screenshot 2026-10-17 183918.png",
        "alt": "Vue du routage du circuit imprimé du contrôleur FOC dans KiCad, avec les pistes et les zones de cuivre.",
        "caption": "Routage du circuit imprimé sous KiCad."
      }
    ],
    "position": "50% center"
  },
  "cargo": {
    "cover": "",
    "coverAlt": "",
    "video": "",
    "gallery": [],
    "position": "center"
  },
  "boite-auto": {
    "cover": "assets/projects/boite-auto/shared image (24).jpg",
    "coverAlt": "Prototype imprimé en 3D de la boîte automatique, avec les engrenages et le mécanisme supérieur visibles dans son châssis noir.",
    "video": "",
    "gallery": [],
    "position": "50% 69%"
  }
};
const scriptLocation = document.currentScript?.src || new URL(document.body.dataset.project ? '../script.js' : 'script.js', document.baseURI).href;
const siteRoot = new URL('.', scriptLocation);
const localURL = path => new URL(path, siteRoot).href;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;
const mediaControllers = [];

// La copie accessible reste intacte ; chaque mot conserve sa largeur pendant le décryptage.
function initializeTileDescription(tile) {
  const text = tile.querySelector('.tile-scramble');
  if (!text) return;
  const description = text.textContent;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%+/?';
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let frame = null;
  let active = false;
  let hovered = false;
  let focused = false;
  function finish() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    text.textContent = description;
  }
  function reveal() {
    if (active) return;
    active = true;
    finish();
    if (reducedMotion.matches || !finePointer.matches) return;
    const words = [];
    let offset = 0;
    const fragment = document.createDocumentFragment();
    description.split(/(\s+)/u).forEach(word => {
      if (!word) return;
      if (/^\s+$/u.test(word)) fragment.append(document.createTextNode(word));
      else {
        const wrapper = document.createElement('span');
        wrapper.className = 'scramble-word';
        const source = document.createElement('span');
        source.className = 'scramble-word-source';
        source.textContent = word;
        const value = document.createElement('span');
        value.className = 'scramble-word-value';
        value.textContent = word;
        wrapper.append(source, value);
        fragment.append(wrapper);
        words.push({ value, word, offset });
      }
      offset += word.length;
    });
    text.replaceChildren(fragment);
    const start = performance.now() + 100;
    let lastUpdate = -Infinity;
    function update(now) {
      if (now < start) { frame = requestAnimationFrame(update); return; }
      const progress = Math.min((now - start) / 750, 1);
      if (progress === 1) { finish(); return; }
      if (now - lastUpdate >= 45) {
        const resolved = Math.floor(progress * description.length);
        words.forEach(({ value, word, offset }) => {
          value.textContent = Array.from(word, (character, index) => {
            if (offset + index < resolved || !/[\p{L}\p{N}]/u.test(character)) return character;
            const random = characters[Math.floor(Math.random() * characters.length)];
            return character === character.toLowerCase() ? random.toLowerCase() : random;
          }).join('');
        });
        lastUpdate = now;
      }
      frame = requestAnimationFrame(update);
    }
    frame = requestAnimationFrame(update);
  }
  function leave() {
    if (hovered || focused) return;
    active = false;
    finish();
  }
  tile.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || !finePointer.matches) return;
    hovered = true;
    reveal();
  });
  tile.addEventListener('pointerleave', () => { hovered = false; leave(); });
  tile.addEventListener('pointercancel', () => { hovered = false; leave(); });
  tile.addEventListener('focusin', () => { focused = true; reveal(); });
  tile.addEventListener('focusout', event => { focused = tile.contains(event.relatedTarget); leave(); });
  reducedMotion.addEventListener('change', finish);
  finePointer.addEventListener('change', finish);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
}
document.querySelectorAll('.project-tile').forEach(initializeTileDescription);

// Panneaux de l’accueil : dialogues natifs, Échap et restitution du focus.
const dialogs = [...document.querySelectorAll('.info-dialog')];
let lastTrigger = null;
function syncMedia() { mediaControllers.forEach(controller => controller.sync()); }
function panelForHash(hash) {
  const id = hash.slice(1) === 'competences' ? 'a-propos' : hash.slice(1);
  return dialogs.find(dialog => dialog.id === id);
}
function syncPanelFromHash() {
  const requested = panelForHash(window.location.hash);
  dialogs.forEach(dialog => { if (dialog.open && dialog !== requested) dialog.close(); });
  if (requested && !requested.open) {
    requested.showModal();
    requested.querySelector('h2').focus({ preventScroll: true });
    if (window.location.hash === '#competences') requested.querySelector('#competences').scrollIntoView();
  }
  document.body.classList.toggle('has-panel', Boolean(requested));
  syncMedia();
}
function closePanel() {
  dialogs.forEach(dialog => { if (dialog.open) dialog.close(); });
  document.body.classList.remove('has-panel');
  if (panelForHash(window.location.hash)) history.replaceState(null, '', window.location.pathname + window.location.search);
  if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
  syncMedia();
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-panel]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !panelForHash(link.hash)) return;
  event.preventDefault();
  lastTrigger = link;
  history.pushState(null, '', link.hash);
  syncPanelFromHash();
});
dialogs.forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', closePanel);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closePanel(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closePanel();
  });
});
window.addEventListener('hashchange', syncPanelFromHash);
window.addEventListener('popstate', syncPanelFromHash);
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

function projectPhotos(config) {
  const photos = config.cover ? [{ src: config.cover, alt: config.coverAlt || '' }] : [];
  photos.push(...(config.gallery || []).filter(photo => photo.src));
  return photos.filter((photo, index, all) => all.findIndex(other => other.src === photo.src) === index);
}
function loadImage(photo) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = async () => {
      try { if (image.decode) await image.decode(); resolve(image); }
      catch { reject(new Error('Image non décodable')); }
    };
    image.onerror = () => reject(new Error('Image indisponible'));
    image.src = localURL(photo.src);
  });
}

function createMediaController(panel, config) {
  const stage = panel.querySelector('.media-stage');
  const button = panel.querySelector('.media-toggle');
  const emptyTitle = panel.querySelector('.media-empty-title');
  const detail = panel.dataset.mediaMode === 'detail';
  const name = panel.dataset.mediaTitle || panel.dataset.media;
  const photos = projectPhotos(config);
  const videoPath = config.video && /\.(mp4|webm|ogv)$/i.test(new URL(config.video, siteRoot).pathname) ? config.video : '';
  const animated = !detail && Boolean(videoPath || photos.length > 1);
  let visible = false;
  let paused = reducedMotion.matches || Boolean(connection?.saveData);
  let explicitlyStarted = false;
  let initialized = false;
  let fallback = null;
  let video = null;
  let playPending = false;
  let timer = null;
  let nextSlideAt = 0;
  let slidePending = false;
  let photoIndex = 0;
  let activeSlot = 0;
  const slots = [];
  const status = document.createElement('p');
  status.className = 'media-status';
  status.setAttribute('role', 'status');
  status.hidden = true;
  panel.append(status);
  panel.style.setProperty('--media-position', config.position || 'center');
  button.hidden = !animated;

  function shouldRun() {
    return visible && !document.hidden && !document.querySelector('.info-dialog[open]') && !paused && (!reducedMotion.matches || explicitlyStarted);
  }
  function updateButton() {
    button.textContent = paused ? '▷' : 'Ⅱ';
    const label = (paused ? 'Lire' : 'Mettre en pause') + ' le média : ' + name;
    button.setAttribute('title', label);
    button.setAttribute('aria-label', label);
  }
  function showError(message) {
    status.textContent = message;
    status.hidden = false;
    paused = true;
    if (timer) { window.clearTimeout(timer); timer = null; }
    if (video) video.pause();
    updateButton();
  }
  async function initialize() {
    if (initialized) return;
    initialized = true;
    if (!photos.length) return;
    try {
      const image = await loadImage(photos[0]);
      image.className = 'media-fallback';
      image.alt = detail ? (photos[0].alt || name + ' — vue du projet') : '';
      stage.prepend(image);
      fallback = image;
      if (video) video.poster = image.src;
      if (emptyTitle) emptyTitle.hidden = true;
      if (!detail && !videoPath && photos.length > 1) {
        for (let index = 0; index < 2; index += 1) {
          const slot = document.createElement('img');
          slot.alt = '';
          slot.className = 'media-slide' + (index === 0 ? ' is-active' : '');
          if (index === 0) slot.src = image.src;
          stage.append(slot);
          slots.push(slot);
        }
      }
      sync();
    } catch {
      initialized = false;
      showError('Image indisponible. Le fond du projet reste affiché.');
    }
  }
  function scheduleSlide() {
    if (timer || slidePending || slots.length < 2 || !shouldRun()) return;
    if (!nextSlideAt) nextSlideAt = performance.now() + 5000;
    const nextIndex = (photoIndex + 1) % photos.length;
    // Précharger pendant la lecture de l’image courante, avant le prochain fondu.
    const nextImage = loadImage(photos[nextIndex]).catch(() => null);
    timer = window.setTimeout(async () => {
      timer = null;
      slidePending = true;
      try {
        const image = await nextImage;
        if (!shouldRun()) return;
        if (!image) throw new Error('Image indisponible');
        const nextSlot = 1 - activeSlot;
        slots[nextSlot].src = image.src;
        slots[nextSlot].classList.add('is-active');
        slots[activeSlot].classList.remove('is-active');
        activeSlot = nextSlot;
        photoIndex = nextIndex;
        do { nextSlideAt += 5000; } while (nextSlideAt <= performance.now());
      } catch { showError('Photo indisponible. La dernière image reste affichée.'); }
      finally { slidePending = false; scheduleSlide(); }
    }, Math.max(0, nextSlideAt - performance.now()));
  }
  function prepareVideo() {
    if (video) return;
    video = document.createElement('video');
    video.className = detail ? 'media-video detail-video' : 'media-video';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = !detail;
    video.controls = detail;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    if (detail) video.setAttribute('aria-label', 'Vidéo du projet ' + name);
    else video.setAttribute('aria-hidden', 'true');
    if (fallback) video.poster = fallback.src;
    // Le fichier vidéo n’est associé qu’à son premier passage visible.
    video.src = localURL(videoPath);
    video.addEventListener('playing', () => {
      if (!visible || document.hidden || (!detail && !shouldRun())) { video.pause(); return; }
      video.classList.add('is-playing');
      if (emptyTitle) emptyTitle.hidden = true;
      status.hidden = true;
    });
    video.addEventListener('error', () => {
      video.classList.remove('is-playing');
      video.hidden = true;
      if (emptyTitle && !fallback) emptyTitle.hidden = false;
      showError('Vidéo indisponible. La couverture ou le fond du projet reste affiché.');
    });
    stage.append(video);
  }
  function sync() {
    if (detail) {
      if (!visible || document.hidden) { if (video) video.pause(); return; }
      // Lecteur natif sur la page détaillée : démarrage uniquement par le visiteur.
      if (videoPath) prepareVideo();
      return;
    }
    if (!shouldRun()) {
      if (timer) { window.clearTimeout(timer); timer = null; }
      nextSlideAt = 0;
      if (video) video.pause();
      return;
    }
    if (videoPath) {
      prepareVideo();
      if (playPending || !video.paused) return;
      playPending = true;
      Promise.resolve(video.play()).then(() => {
        if (!shouldRun()) video.pause();
      }).catch(() => {
        if (!shouldRun()) return;
        video.classList.remove('is-playing');
        showError('Lecture automatique bloquée. Utilisez le bouton Lire le média.');
      }).finally(() => { playPending = false; });
    } else scheduleSlide();
  }
  button.addEventListener('click', () => {
    paused = !paused;
    explicitlyStarted = !paused;
    status.hidden = true;
    updateButton();
    if (!initialized) initialize();
    if (video?.error && !paused) { video.hidden = false; video.load(); }
    sync();
  });
  updateButton();
  return {
    panel,
    setVisible(value) { visible = value; if (visible) initialize(); sync(); },
    sync,
    reduce() {
      if (reducedMotion.matches || connection?.saveData) {
        paused = true;
        explicitlyStarted = false;
        if (video) video.pause();
        updateButton();
      }
      sync();
    }
  };
}

function fillGallery(config) {
  const section = document.querySelector('.project-gallery');
  if (!section) return;
  const grid = section.querySelector('.gallery-grid');
  const photos = (config.gallery || []).filter(photo => photo.src);
  if (!photos.length) return;
  section.hidden = false;
  photos.forEach(photo => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.alt = photo.alt || document.querySelector('.project-intro h1').textContent + ' — vue du projet';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 1600;
    image.height = 1000;
    image.addEventListener('load', () => {
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
      image.classList.add('is-loaded');
    });
    image.addEventListener('error', () => {
      figure.remove();
      if (!grid.children.length) section.hidden = true;
    });
    figure.append(image);
    if (photo.caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = photo.caption;
      figure.append(caption);
    }
    grid.append(figure);
    image.src = localURL(photo.src);
  });
}

document.querySelectorAll('[data-media]').forEach(panel => {
  const config = PROJECT_MEDIA[panel.dataset.media];
  if (config) mediaControllers.push(createMediaController(panel, config));
});
if ('IntersectionObserver' in window) {
  const byPanel = new Map(mediaControllers.map(controller => [controller.panel, controller]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => byPanel.get(entry.target).setVisible(entry.isIntersecting));
  }, { threshold: 0.05 });
  mediaControllers.forEach(controller => observer.observe(controller.panel));
} else {
  const updateVisibility = () => mediaControllers.forEach(controller => {
    const box = controller.panel.getBoundingClientRect();
    controller.setVisible(box.bottom > 0 && box.top < window.innerHeight);
  });
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  updateVisibility();
}
const pageProject = document.body.dataset.project;
if (pageProject && PROJECT_MEDIA[pageProject]) fillGallery(PROJECT_MEDIA[pageProject]);
document.addEventListener('visibilitychange', syncMedia);
reducedMotion.addEventListener('change', () => mediaControllers.forEach(controller => controller.reduce()));
connection?.addEventListener('change', () => mediaControllers.forEach(controller => controller.reduce()));
syncPanelFromHash();
