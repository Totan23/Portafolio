// ============================================================
// NAVBAR: scroll effect + mobile menu
// ============================================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============================================================
// SCROLL REVEAL (Intersection Observer)
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for grid children
        const delay = entry.target.dataset.index
          ? parseInt(entry.target.dataset.index) * 100
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// SKILL BARS: animate on visibility
// ============================================================
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.animation = 'none';
          bar.offsetHeight; // reflow
          bar.style.animation = 'fillBar 1.5s ease-out forwards';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// ============================================================
// SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================================
// MODAL: project case studies
// ============================================================
const projectsOrder = ['pagoland', 'saec', 'subastalo', 'bankbot'];

const modalData = {
  pagoland: {
    title: 'Pagoland',
    icon: '💳',
    iconClass: 'pagoland',
    platform: 'iOS · Swift · CoreNFC · Mar 2024 — Ago 2025',
    shortPlatform: 'iOS · Swift',
    shortYear: 'Mar 2024 — Ago 2025',
    shortDesc: 'Cantina escolar digital con pagos NFC sin efectivo para colegios venezolanos.',
    desc: 'Aplicación iOS desarrollada para modernizar los pagos dentro de instituciones educativas venezolanas. Los estudiantes adquieren alimentos y productos mediante tecnología NFC, eliminando el uso de efectivo y promoviendo una experiencia de educación financiera desde temprana edad.',
    problem: 'Las cantinas escolares en Venezuela operaban exclusivamente con efectivo, generando colas, errores de cambio y riesgos de seguridad. No existía una solución tecnológica adaptada al contexto local que aprovechara la tecnología NFC presente en los dispositivos iOS.',
    highlights: [
      'Pagos NFC rápidos y sin contacto usando CoreNFC de Apple',
      'Interfaces nativas construidas desde cero con UIKit y Auto Layout',
      'AVFoundation para feedback audiovisual en las transacciones',
      'Microsoft Copilot integrado en el flujo de desarrollo para acelerar entregas',
      'Diseño mobile-first adaptable a todos los modelos de iPhone',
      'Gestión de estado de wallet con persistencia CoreData',
    ],
    tags: ['Swift', 'CoreNFC', 'UIKit', 'Auto Layout', 'AVFoundation', 'CoreData', 'Xcode', 'Microsoft Copilot'],
    images: [],
  },
  saec: {
    title: 'S.A.E.C.',
    icon: '📊',
    iconClass: 'saec',
    shortPlatform: 'iOS · Swift',
    shortYear: 'Jun — Dic 2024',
    shortDesc: 'Visualización y seguimiento del avance académico universitario en iOS.',
    images: [
      'assets/SAEC_IMG/119787A8-A2F8-41C4-B228-F0F831254C50.jpg',
      'assets/SAEC_IMG/5f96f1f4-bcbc-4e72-9819-e21f668f12c1.jpg',
      'assets/SAEC_IMG/723EF09E-8DF7-4089-A028-D0930CFA4438.jpg',
      'assets/SAEC_IMG/84fb3a40-9d81-44fc-a916-db801230b1a8.JPG',
    ],
    platform: 'iOS · Swift · UIKit · Jun — Dic 2024',
    desc: 'Aplicación iOS diseñada para estudiantes de la Universidad Metropolitana de Caracas, que permite registrar y visualizar el progreso académico a lo largo de la carrera, con estadísticas detalladas de rendimiento por materia y trimestre.',
    problem: 'Los estudiantes de la UNIMET no contaban con una herramienta centralizada para monitorear su progreso académico. Los registros se mantenían de forma manual o dispersa en múltiples plataformas, lo que dificultaba la planificación semestral y la toma de decisiones académicas.',
    highlights: [
      'Registro de materias por trimestre con estado (aprobada, reprobada, en curso)',
      'Dashboard de estadísticas con gráficas de rendimiento trimestral',
      'Persistencia local con CoreData para uso sin conexión',
      'UI nativa con UIKit, Auto Layout e Interface Builder',
      'Microsoft Copilot como asistente de desarrollo durante todo el proyecto',
      'Soporte para todos los modelos de iPhone con diseño adaptativo',
    ],
    tags: ['Swift', 'UIKit', 'CoreData', 'Auto Layout', 'Interface Builder', 'Xcode', 'Microsoft Copilot'],
  },
  subastalo: {
    title: 'Subastalo',
    icon: '🔨',
    iconClass: 'subastalo',
    shortPlatform: 'React Native · Expo',
    shortYear: 'Oct 2025 — Presente',
    shortDesc: 'Comercio P2P por subastas en tiempo real con verificación de usuarios.',
    images: [
      'assets/Subastalo_IMG/IMG_6987.jpg',
      'assets/Subastalo_IMG/IMG_7038.jpg',
      'assets/Subastalo_IMG/IMG_7041.jpg',
      'assets/Subastalo_IMG/IMG_7051.jpg',
    ],
    platform: 'React Native · Expo · Firebase · Oct 2025 — Presente',
    desc: 'Plataforma venezolana de subastas en tiempo real. Los usuarios pueden crear subastas de cualquier tipo de producto y participar como compradores dentro de un entorno seguro, respaldado por mecanismos de verificación que garantizan la confianza entre las partes.',
    problem: 'El comercio entre particulares en Venezuela carecía de una plataforma móvil local con un sistema de subastas confiable. Las alternativas existentes eran internacionales y no contemplaban el contexto económico ni operativo del país.',
    highlights: [
      'Subastas en tiempo real con Firebase Realtime Database',
      'Autenticación segura con Firebase Auth',
      'UI cross-platform iOS y Android desde una sola base de código (Expo)',
      'Mecanismos de verificación de vendedores y compradores',
      'Claude Code como herramienta central en el flujo de desarrollo',
      'Notificaciones y actualizaciones de pujas en tiempo real',
    ],
    tags: ['React Native', 'Expo', 'Firebase', 'Realtime DB', 'Auth', 'JavaScript', 'Claude Code'],
  },
  bankbot: {
    title: 'BankBot P2P',
    icon: '🤖',
    iconClass: 'bankbot',
    shortPlatform: 'Python · Selenium',
    shortYear: '2025',
    shortDesc: 'Bot automatizado de Binance P2P que procesa transferencias bancarias combinando web scraping e integración con APIs.',
    images: [],
    platform: 'Python · Selenium · Web Scraping · CLI',
    desc: 'Herramienta de automatización para operaciones de Binance P2P en Venezuela. El sistema detecta nuevas órdenes, valida la identidad de la contraparte, ejecuta transferencias bancarias directamente en los portales de banca en línea (Mercantil, Banesco, BBVA Provincial y Bancamiga) combinando web scraping con Selenium e integración con APIs, y notifica automáticamente el pago al comprador. Todo el flujo se gestiona desde la terminal.',
    problem: 'Los vendedores P2P en Venezuela enfrentan pérdidas operativas debido al proceso manual: leer la orden, acceder al banco, realizar la transferencia y enviar el comprobante. No existía una solución confiable capaz de automatizar el ciclo completo de transacción sin intervención humana.',
    highlights: [
      'Scraper de Binance P2P con Selenium que detecta nuevas órdenes en tiempo real',
      'Uso de selectores CSS específicos por banco y por etapa del flujo (login, selección de cuenta, monto, confirmación, comprobante) para que el bot sepa exactamente qué elemento leer o accionar en cada página',
      'Validación automática del nombre del comprador contra el titular de la cuenta bancaria',
      'Módulos independientes por banco: Mercantil, Banesco, BBVA Provincial y Bancamiga',
      'Ejecución de transferencias reales combinando scraping de la banca en línea e integración con APIs',
      'Gestión multi-ventana con WindowManager para operar Binance y el banco en paralelo',
      'Captura y reenvío automático del comprobante por WhatsApp al comprador',
      'Persistencia de órdenes procesadas (processed_order_ids.json) para evitar duplicados',
      'Logs detallados y screenshots de cada paso para auditoría y debugging',
      'Flujo 100% en terminal con salida limpia: warnings/errores a consola, detalle en archivo',
    ],
    tags: ['Python', 'Selenium', 'Web Scraping', 'CLI', 'webdriver-manager', 'Binance P2P', 'Automatización'],
  },
};

const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose   = document.getElementById('modalClose');

function openProjectsList() {
  const cardsHTML = projectsOrder.map(key => {
    const d = modalData[key];
    return `
      <button class="project-list-card" onclick="openModal('${key}')">
        <div class="project-list-icon ${d.iconClass}">${d.icon}</div>
        <div class="project-list-body">
          <span class="project-list-platform">${d.shortPlatform} · ${d.shortYear}</span>
          <h3 class="project-list-title">${d.title}</h3>
          <p class="project-list-desc">${d.shortDesc}</p>
        </div>
        <span class="project-list-arrow">→</span>
      </button>
    `;
  }).join('');

  modalContent.innerHTML = `
    <span class="modal-platform">Proyectos</span>
    <h2>Casos de estudio</h2>
    <p>Selecciona un proyecto para ver detalles, stack y galería.</p>
    <div class="projects-list">${cardsHTML}</div>
  `;

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openModal(key) {
  const data = modalData[key];
  if (!data) return;

  const tagsHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const highlightsHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

  const images = data.images || [];
  let galleryHTML = '';
  if (images.length > 0) {
    galleryHTML = '<div class="modal-gallery">';
    for (let i = 0; i < images.length; i++) {
      galleryHTML += `<div class="modal-gallery-item" onclick="openLightbox('${images[i]}')"><img src="${images[i]}" alt="${data.title} ${i + 1}" loading="lazy"/></div>`;
    }
    galleryHTML += '</div>';
  }
  const galleryHeading = images.length > 0 ? '<h4>Galería</h4>' : '';

  modalContent.innerHTML = `
    <button class="modal-back" onclick="openProjectsList()">← Volver a proyectos</button>
    <span class="modal-platform">${data.platform}</span>
    <h2>${data.title}</h2>
    <p>${data.desc}</p>
    ${galleryHeading}
    ${galleryHTML}
    <h4>Problema resuelto</h4>
    <p>${data.problem}</p>
    <h4>Características principales</h4>
    <ul>${highlightsHTML}</ul>
    <h4>Stack tecnológico</h4>
    <div class="tag-list">${tagsHTML}</div>
  `;

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ============================================================
// CV LANGUAGE MODAL
// ============================================================
const cvModalOverlay = document.getElementById('cvModalOverlay');
const cvModalClose   = document.getElementById('cvModalClose');

function openCvModal() {
  cvModalOverlay.classList.add('open');
  cvModalOverlay.setAttribute('aria-hidden', 'false');
}
function closeCvModal() {
  cvModalOverlay.classList.remove('open');
  cvModalOverlay.setAttribute('aria-hidden', 'true');
}
cvModalClose.addEventListener('click', closeCvModal);
cvModalOverlay.addEventListener('click', (e) => {
  if (e.target === cvModalOverlay) closeCvModal();
});

// ============================================================
// LIGHTBOX: image preview
// ============================================================
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxClose   = document.getElementById('lightboxClose');

function openLightbox(src) {
  lightboxImg.src = src;
  lightboxOverlay.classList.add('open');
  lightboxOverlay.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightboxOverlay.classList.remove('open');
  lightboxOverlay.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}

lightboxOverlay.addEventListener('click', (e) => {
  if (e.target === lightboxOverlay || e.target === lightboxImg) closeLightbox();
});
lightboxClose.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (lightboxOverlay.classList.contains('open')) closeLightbox();
  else if (cvModalOverlay.classList.contains('open')) closeCvModal();
  else closeModal();
});

// ============================================================
// ACTIVE NAV LINK on scroll
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--text-primary)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => activeObserver.observe(s));

// ============================================================
// COPY EMAIL TO CLIPBOARD
// ============================================================
function copyEmail() {
  const email = 'jonathanpizzurro@gmail.com';
  const btn  = document.getElementById('copyEmailBtn');
  const text = document.getElementById('copyEmailText');
  const icon = document.getElementById('copyIcon');

  const showCopied = () => {
    icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
    text.textContent = '¡Copiado!';
    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    btn.style.boxShadow  = '0 8px 30px rgba(16,185,129,0.4)';
    setTimeout(() => {
      icon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>';
      text.textContent = email;
      btn.style.background = '';
      btn.style.boxShadow  = '';
    }, 2000);
  };

  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showCopied(); } catch (_) {}
    document.body.removeChild(ta);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(showCopied).catch(fallback);
  } else {
    fallback();
  }
}

console.log('Jonathan Pizzurro Portfolio — Loaded ✅');
