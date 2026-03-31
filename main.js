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
const modalData = {
  pagoland: {
    title: 'Pagoland',
    platform: 'iOS · Swift · CoreNFC · Mar 2024 — Ago 2025',
    desc: 'App iOS para modernizar los pagos dentro de colegios venezolanos. Funciona como una cantina digital: los estudiantes compran comida y productos mediante tecnología NFC, sin necesidad de efectivo. Promoviendo educación financiera desde temprana edad.',
    problem: 'Las cantinas escolares en Venezuela operaban exclusivamente con efectivo, generando colas, errores de cambio e inseguridad. No existía una solución tecnológica adaptada al contexto local con NFC.',
    highlights: [
      'Pagos NFC rápidos y sin contacto usando CoreNFC de Apple',
      'Interfaces nativas construidas desde cero con UIKit y Auto Layout',
      'AVFoundation para feedback audiovisual en las transacciones',
      'Microsoft Copilot integrado en el flujo de desarrollo para acelerar entregas',
      'Diseño mobile-first adaptable a todos los modelos de iPhone',
      'Gestión de estado de wallet con persistencia CoreData',
    ],
    tags: ['Swift', 'CoreNFC', 'UIKit', 'Auto Layout', 'AVFoundation', 'CoreData', 'Xcode', 'Microsoft Copilot'],
  },
  saec: {
    title: 'S.A.E.C.',
    platform: 'iOS · Swift · UIKit · Jun — Dic 2024',
    desc: 'App iOS para estudiantes de la Universidad Metropolitana de Caracas que les permite registrar y visualizar el progreso de sus materias a lo largo de la carrera, con estadísticas detalladas de rendimiento académico por trimestre.',
    problem: 'Los estudiantes de UNIMET no tenían una herramienta centralizada para seguir su progreso académico. Los registros eran manuales o dispersos en múltiples plataformas, dificultando la planificación semestral.',
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
    platform: 'React Native · Expo · Firebase · Oct 2025 — Presente',
    desc: 'App venezolana de subastas en tiempo real. Usuarios pueden crear subastas de cualquier tipo de producto y participar como compradores. Ofrece un entorno seguro con mecanismos de verificación que garantizan confianza entre las partes.',
    problem: 'El comercio entre personas en Venezuela carecía de una plataforma móvil local con sistema de subastas confiable. Las opciones existentes eran internacionales, sin soporte para el contexto económico del país.',
    highlights: [
      'Subastas en tiempo real con Firebase Realtime Database',
      'Autenticación segura con Firebase Auth',
      'UI cross-platform iOS y Android desde una sola base de código (Expo)',
      'Mecanismos de verificación de vendedores y compradores',
      'Cursor AI como herramienta central en el flujo de desarrollo',
      'Notificaciones y actualizaciones de pujas en tiempo real',
    ],
    tags: ['React Native', 'Expo', 'Firebase', 'Realtime DB', 'Auth', 'JavaScript', 'Cursor'],
  },
  portfolio: {
    title: 'Este Portafolio',
    platform: 'HTML5 · CSS3 · JavaScript Vanilla · 2025',
    desc: 'El sitio web que estás viendo ahora mismo. Diseñado y construido desde cero sin frameworks, sin librerías externas y sin generadores de CSS como Tailwind. Solo HTML semántico, CSS con variables y JavaScript nativo.',
    problem: 'Necesitaba un portafolio que demostrara tanto mis capacidades técnicas como mi estética de diseño. Los templates o generadores habrían ocultado mi criterio; construirlo desde cero lo exhibe.',
    highlights: [
      'Dark mode elegante con paleta de colores personalizada mediante CSS variables',
      'Glassmorphism en tarjetas con backdrop-filter y bordes semitransparentes',
      'Animaciones de scroll con Intersection Observer API (sin librerías externas)',
      'Barras de skill con animación CSS al entrar en viewport',
      'Navbar con efecto blur/frosted glass al hacer scroll',
      'Mobile-first responsive: funciona desde 320px hasta 4K',
      'Modales de caso de estudio con datos estructurados en JavaScript',
      'SEO básico con meta tags Open Graph',
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Intersection Observer', 'CSS Variables', 'Glassmorphism', 'Responsive', 'SEO'],
  },
};

const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose   = document.getElementById('modalClose');

function openModal(key) {
  const data = modalData[key];
  if (!data) return;

  const tagsHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const highlightsHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

  modalContent.innerHTML = `
    <span class="modal-platform">${data.platform}</span>
    <h2>${data.title}</h2>
    <p>${data.desc}</p>
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
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

console.log('Jonathan Pizzurro Portfolio — Loaded ✅');
