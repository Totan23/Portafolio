/* =========================================================
   PORTFOLIO 2026 — Jonathan Pizzurro
   Inspired by lukebaffait.fr
   Lenis 1.1.14 + GSAP ScrollTrigger · scrubbed scroll
   ========================================================= */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // 1. LENIS + GSAP ScrollTrigger sync (exact pattern requested)
  // ============================================================
  let lenis = null;
  function initLenis() {
    if (typeof Lenis === 'undefined' || prefersReduced) return;

    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothWheel: true,
      smoothTouch: false,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.defaults({ scroller: document.body });
    }
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ============================================================
  // 2. CUSTOM CURSOR (mix-blend-mode difference, lerp 0.1)
  // ============================================================
  // Custom cursor removido — usamos el cursor nativo del sistema.
  function initCursor() { /* noop */ }

  // ============================================================
  // 3. ANCHOR SCROLL (vía Lenis)
  // ============================================================
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 20;
        if (lenis) {
          lenis.scrollTo(top, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
        } else {
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================================
  // 4. HERO ENTRANCE — "J" sola, después el resto letra por letra
  // ============================================================
  function playHeroIntro() {
    const charJ = document.getElementById('charJ');
    const restName = document.getElementById('restName');
    const heroDesc = document.getElementById('heroDesc');
    const heroBottom = document.getElementById('heroBottom');
    if (!charJ || !restName) return;

    // Split "onathan Pizzurro ." en chars, preservando el span .dot
    const splitInto = (root) => {
      const chars = [];
      Array.from(root.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text) return;
          const frag = document.createDocumentFragment();
          [...text].forEach((ch) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch === ' ' ? ' ' : ch;
            frag.appendChild(span);
            chars.push(span);
          });
          root.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // .dot u otros span: wrap entero como un char
          const span = document.createElement('span');
          span.className = 'char';
          span.appendChild(node.cloneNode(true));
          root.replaceChild(span, node);
          chars.push(span);
        }
      });
      return chars;
    };

    const restChars = splitInto(restName);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // J sola primero
    tl.to(charJ, { opacity: 1, y: 0, duration: 0.55 });

    // 0.3s después, resto letra por letra
    tl.to(restChars, {
      opacity: 1, y: 0,
      duration: 0.5,
      stagger: 0.04,
    }, '+=0.15');

    // 0.8s después del nombre: descripción
    if (heroDesc) {
      tl.to(heroDesc, { opacity: 1, y: 0, duration: 0.8 }, '+=0.15');
    }
    if (heroBottom) {
      tl.to(heroBottom, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
    }
  }

  // ============================================================
  // 5. HERO PARALLAX SCRUBBED — nombre y 0 → -150
  // ============================================================
  function initHeroParallax() {
    if (typeof ScrollTrigger === 'undefined' || prefersReduced) return;
    const hero = document.querySelector('.hero');
    const heroInner = document.querySelector('.hero-inner');
    if (!hero || !heroInner) return;

    gsap.fromTo(heroInner,
      { y: 0 },
      {
        y: -150,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  }

  // ============================================================
  // 6. SECTION TITLES — slide-up + fade (one-shot, GPU-friendly).
  //    Antes era clip-path scrub que forzaba repaint cada tick. El nuevo
  //    approach usa transform + opacity (compositor-only) y toggleActions
  //    para que solo dispare una vez al entrar.
  // ============================================================
  function initSectionTitlesClip() {
    if (typeof ScrollTrigger === 'undefined' || prefersReduced) return;
    document.querySelectorAll('.section-title').forEach((title) => {
      gsap.set(title, { y: 40, opacity: 0 });
      gsap.to(title, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }

  // ============================================================
  // 7. STATS COUNTER — cuenta desde 0 al entrar
  // ============================================================
  function initStatsCounter() {
    if (typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.floor(obj.val) + suffix; },
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  // ============================================================
  // 8. PROJECTS WHEEL — cylindrical 3D carousel
  //    Drag horizontally · inertia · snap · click active → modal
  // ============================================================
  const PROJECT_DATA = {
    lowtech: {
      num: '/01',
      title: 'Lowtech — Chatbot Multicanal',
      year: 'Ene 2026 → presente',
      role: 'Node.js · Meta API · Claude Haiku · Whisper · Supabase · Railway',
      desc: 'Chatbot informativo 24/7 para WhatsApp, Instagram y Facebook de un cliente del sector hotelero. Un único motor conversacional sirve los tres canales desde la API oficial de Meta.',
      problem: 'El cliente recibía un alto volumen de consultas repetitivas a través de varias redes sociales y necesitaba responder fuera de jornada laboral. La gestión manual generaba demoras, respuestas inconsistentes y pérdida de oportunidades comerciales.',
      highlights: [
        'Integración con la API oficial de Meta vía webhooks (WhatsApp Business, IG Messaging, FB Messenger)',
        'Procesamiento de mensajes de voz con Whisper (OpenAI) para transcribir audios entrantes',
        'Motor conversacional con Claude Haiku para respuestas contextuales',
        'Persistencia en Supabase (PostgreSQL) y deploy continuo en Railway',
      ],
      tags: ['Node.js', 'Meta API', 'Claude Haiku', 'Whisper', 'Supabase', 'Railway'],
      visual: 'proj-lowtech',
      visualHTML: '<span class="bubble b1"></span><span class="bubble b2"></span><span class="bubble b3"></span><span class="bubble b4"></span><span class="bubble b5"></span>',
    },
    lowtechsales: {
      num: '/02',
      title: 'Lowtech — Chatbot de Ventas + Diseños IA',
      year: 'Jul → Ago 2026',
      role: 'Node.js · Meta API · Claude · OpenAI (imágenes) · Supabase',
      desc: 'Chatbot de ventas multicanal con un generador de diseños por IA integrado: crea bocetos de prendas a partir de lo que pide el cliente, y suma un dashboard administrativo para gestionar mensajes e inventario.',
      problem: 'El cliente necesitaba vender por WhatsApp, Instagram y Messenger y, además, mostrar propuestas de diseño de prendas al instante. Hacerlo de forma manual era lento y no escalaba con el volumen de conversaciones.',
      highlights: [
        'Motor conversacional con Claude (Anthropic) integrado vía la API de Meta (WhatsApp, Instagram, Messenger)',
        'Generación de bocetos de diseño con IA usando la API de OpenAI a partir de las solicitudes del cliente',
        'Dashboard administrativo conectado a Supabase (PostgreSQL) para gestionar conversaciones e inventario',
        'Un solo servicio unifica ventas, atención y generación de diseños en los tres canales',
      ],
      tags: ['Node.js', 'Meta API', 'Claude', 'OpenAI', 'Supabase', 'Dashboard'],
      visual: 'proj-lowtechsales',
      visualHTML: '<div class="ls-canvas"><span class="ls-tee"></span><span class="ls-sweep"></span></div><span class="ls-spark s1">✦</span><span class="ls-spark s2">✦</span><span class="ls-spark s3">✦</span>',
    },
    bankbot: {
      num: '/03',
      title: 'BankBot P2P',
      year: 'Dic 2025 → Mar 2026',
      role: 'Python · Selenium · Web Scraping · Claude Code',
      desc: 'Bot en Python que automatiza el ciclo completo de compras y ventas en Binance P2P: detecta órdenes, valida titularidad bancaria, ejecuta transferencias en banca en línea y reenvía el comprobante por WhatsApp.',
      problem: 'Los vendedores P2P en Venezuela enfrentan pérdidas operativas por el proceso manual: leer la orden, acceder al banco, transferir, enviar el comprobante. No existía una solución confiable para automatizar el ciclo sin intervención humana.',
      highlights: [
        'Selectores CSS específicos por banco y por etapa del flujo (login, monto, confirmación, comprobante)',
        'Módulos independientes por banco: Mercantil, Banesco, BBVA Provincial, Bancamiga',
        'Validación automática del nombre del comprador contra el titular bancario',
        'Logs detallados + screenshots por paso para auditoría',
      ],
      tags: ['Python', 'Selenium', 'webdriver-manager', 'Binance P2P', 'Claude Code'],
      visual: 'proj-bankbot',
      visualHTML: '<div class="term-line"><span class="prompt">$</span><span class="cmd">scrape --binance p2p</span></div><div class="term-line out"><span class="prompt">›</span> connected to Mercantil</div><div class="term-line out"><span class="prompt">›</span> order #4827 detected</div><div class="term-line out ok"><span class="prompt">›</span> transfer sent</div><div class="term-line"><span class="prompt">$</span><span class="cmd cursor-blink">_</span></div>',
    },
    subastalo: {
      num: '/04',
      title: 'Subástalo',
      year: 'Oct 2025 → Dic 2025',
      role: 'React Native · Expo · Firebase · Realtime DB',
      desc: 'Plataforma venezolana de subastas en tiempo real. Los usuarios crean subastas de cualquier producto y participan como compradores dentro de un entorno seguro con verificación entre partes.',
      problem: 'El comercio P2P en Venezuela carecía de una plataforma móvil local con un sistema de subastas confiable. Las alternativas internacionales no contemplaban el contexto económico ni operativo del país.',
      highlights: [
        'Subastas en tiempo real con Firebase Realtime Database',
        'Autenticación segura con Firebase Auth',
        'iOS y Android desde una sola base de código con Expo',
        'Mecanismos de verificación entre compradores y vendedores',
      ],
      tags: ['React Native', 'Expo', 'Firebase', 'Realtime DB', 'JavaScript'],
      visual: 'proj-subastalo',
      visualHTML: '<div class="phone"><div class="phone-bar"></div><div class="phone-card c1"></div><div class="phone-card c2"></div><div class="phone-card c3"></div><div class="phone-cta"></div></div>',
    },
    pagoland: {
      num: '/05',
      title: 'Pagoland',
      year: 'Mar 2024 — Ago 2025',
      role: 'Swift · UIKit · CoreNFC · Auto Layout',
      desc: 'App iOS para pagos NFC en cantinas escolares venezolanas. Los estudiantes adquieren productos mediante tecnología NFC, eliminando efectivo y promoviendo educación financiera desde temprana edad.',
      problem: 'Las cantinas escolares operaban exclusivamente con efectivo, generando colas, errores de cambio y riesgos de seguridad. No existía una solución tecnológica adaptada al contexto local que aprovechara NFC en iOS.',
      highlights: [
        'Pagos NFC sin contacto con CoreNFC de Apple',
        'UIKit + Auto Layout construidos desde cero',
        'AVFoundation para feedback audiovisual en transacciones',
        'Persistencia de wallet con CoreData',
      ],
      tags: ['Swift', 'UIKit', 'CoreNFC', 'Auto Layout', 'AVFoundation', 'CoreData', 'Xcode'],
      visual: 'proj-pagoland',
      visualHTML: '<span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span><span class="ring r4"></span><span class="nfc-core">NFC</span>',
    },
    saec: {
      num: '/06',
      title: 'S.A.E.C.',
      year: 'Jun — Dic 2024',
      role: 'Swift · UIKit · CoreData · Microsoft Copilot',
      desc: 'App iOS diseñada para estudiantes de la UNIMET. Permite registrar y visualizar el progreso académico a lo largo de la carrera con estadísticas detalladas por materia y trimestre.',
      problem: 'Los estudiantes no contaban con una herramienta centralizada para monitorear su progreso académico. Los registros se mantenían manualmente o dispersos en múltiples plataformas.',
      highlights: [
        'Registro de materias por trimestre con estado (aprobada, reprobada, en curso)',
        'Dashboard de estadísticas con gráficas trimestrales',
        'Persistencia local con CoreData (offline)',
        'UI nativa UIKit + Auto Layout + Interface Builder',
      ],
      tags: ['Swift', 'UIKit', 'CoreData', 'Auto Layout', 'Interface Builder', 'Xcode'],
      visual: 'proj-saec',
      visualHTML: '<span class="bar bar1"></span><span class="bar bar2"></span><span class="bar bar3"></span><span class="bar bar4"></span><span class="bar bar5"></span><span class="bar bar6"></span><span class="bar bar7"></span>',
    },
    hackathon: {
      num: '/07',
      title: 'Hackatón Vibecoding VE',
      year: '2025 · Top 10',
      role: 'Equipo de 4 personas · App móvil',
      desc: 'Primer hackatón de Vibecoding en Venezuela, patrocinado por Yummy, Cashea y Slash. Top 10 con una app móvil con potencial real de producción construida bajo condiciones reales de tiempo y trabajo en equipo.',
      problem: 'Demostrar que la metodología vibecoding puede producir software funcional con calidad de producción en una ventana de tiempo limitada, trabajando colaborativamente con asistentes IA como Claude Code.',
      highlights: [
        'Equipo de 4 personas bajo condiciones reales de tiempo limitado',
        'App móvil funcional con potencial real de producción',
        'Sponsors: Yummy, Cashea, Slash',
        'Reconocimiento Top 10 nacional',
      ],
      tags: ['Mobile', 'Vibecoding', 'Top 10', 'Equipo', 'Claude Code'],
      visual: 'proj-hack',
      visualHTML: '<span class="podium pod1"></span><span class="podium pod2"></span><span class="podium pod3"></span><span class="hack-tag">#TOP</span><span class="hack-num">10</span>',
    },
  };

  // ============================================================
  // 8. PROJECTS — cinta horizontal de iPhones que fluye continuamente
  //    (como el marquee del stack pero más lenta). Se pausa cuando el
  //    cursor está sobre cualquier iPhone. El item que pasa por el centro
  //    se considera "activo" para el contador y el botón Ver más.
  // ============================================================
  function initWheel() {
    const stage = document.getElementById('wheelStage');
    const inner = document.getElementById('wheelInner');
    if (!stage || !inner) return;

    const items = Array.from(inner.querySelectorAll('.wheel-item'));
    const N = items.length;
    if (N === 0) return;

    let offset = 0;            // offset global de la cinta en px
    let paused = false;
    let dragging = false;
    let pendingDrag = false;
    let pointerStartX = 0;
    let dragStartOffset = 0;
    const SPEED = 32;          // px/segundo — velocidad de flujo (muy lento)

    const counter = document.getElementById('wheelActive');
    const totalEl = document.getElementById('wheelTotal');
    if (totalEl) totalEl.textContent = String(N).padStart(2, '0');

    function getConfig() {
      const w = window.innerWidth;
      if (w < 700) return { spacing: 220, tilt: 30, recede: 70 };
      return { spacing: 340, tilt: 28, recede: 110 };
    }
    let cfg = getConfig();

    function applyLayout() {
      const totalW = N * cfg.spacing;
      let activeI = 0;
      let activeMin = Infinity;

      items.forEach((item, i) => {
        // Posición de la cinta (wrap circular alrededor del centro)
        let pos = (i * cfg.spacing - offset) % totalW;
        if (pos > totalW / 2)  pos -= totalW;
        if (pos < -totalW / 2) pos += totalW;

        const dist = pos / cfg.spacing;
        const absDist = Math.abs(dist);

        const tiltY = Math.max(-cfg.tilt, Math.min(cfg.tilt, -dist * cfg.tilt));
        const tz = -Math.min(absDist, 1.5) * cfg.recede;
        const opacity = absDist > 1.7 ? 0 : Math.max(0.22, 1 - absDist * 0.48);

        item.style.transform =
          `translate3d(${pos}px, 0, ${tz}px) rotateY(${tiltY}deg)`;
        item.style.opacity = String(opacity);
        item.style.zIndex = String(100 - Math.round(absDist * 10));

        if (absDist < activeMin) {
          activeMin = absDist;
          activeI = i;
        }
      });

      items.forEach((it, i) => it.classList.toggle('active', i === activeI));
      if (counter) counter.textContent = String(activeI + 1).padStart(2, '0');
    }

    // Flujo continuo via gsap ticker. Solo corre cuando el stage está visible
    // en el viewport — ahorra CPU significativo cuando estás en otra sección.
    let inView = true;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => { inView = entries[0].isIntersecting; },
        { rootMargin: '100px' }
      );
      io.observe(stage);
    }
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((_t, delta) => {
        if (!inView || paused || dragging) return;
        offset += (SPEED * delta) / 1000;
        applyLayout();
      });
    }

    // ---- Hover sobre CUALQUIER iPhone pausa ----
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => { paused = true; });
      item.addEventListener('mouseleave', () => { paused = false; });
    });

    // ---- Drag horizontal manual ----
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('[data-open-modal]')) return;
      pendingDrag = true;
      dragging = false;
      pointerStartX = e.clientX;
      dragStartOffset = offset;
    });
    stage.addEventListener('pointermove', (e) => {
      if (!pendingDrag) return;
      const dx = e.clientX - pointerStartX;
      if (!dragging) {
        if (Math.abs(dx) < 6) return;
        dragging = true;
        stage.classList.add('dragging');
        try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      }
      offset = dragStartOffset - dx;
      applyLayout();
    });
    function endDrag(e) {
      pendingDrag = false;
      dragging = false;
      stage.classList.remove('dragging');
      try { stage.releasePointerCapture && stage.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', endDrag);

    // ---- CTA "Ver más" abre modal del item al que pertenece ----
    items.forEach((item) => {
      const cta = item.querySelector('[data-open-modal]');
      if (cta) {
        cta.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          openModal(item.dataset.key);
        });
      }
    });

    // ---- Nav buttons: empujan la cinta una unidad ----
    const prev = document.getElementById('wheelPrev');
    const next = document.getElementById('wheelNext');
    function nudge(dir) {
      if (typeof gsap === 'undefined') {
        offset += dir * cfg.spacing;
        applyLayout();
        return;
      }
      // Tween suave para el "empujón" manual
      const targetOffset = offset + dir * cfg.spacing;
      gsap.to({ v: offset }, {
        v: targetOffset,
        duration: 0.85,
        ease: 'power3.out',
        onUpdate() { offset = this.targets()[0].v; applyLayout(); },
      });
    }
    if (prev) prev.addEventListener('click', () => nudge(-1));
    if (next) next.addEventListener('click', () => nudge(1));

    // ---- Keyboard ----
    window.addEventListener('keydown', (e) => {
      const overlay = document.getElementById('modalOverlay');
      if (overlay && overlay.classList.contains('open')) return;
      if (e.key === 'ArrowLeft')  nudge(-1);
      if (e.key === 'ArrowRight') nudge(1);
      if (e.key === 'Enter') {
        // Abre el item actualmente centrado
        const active = items.find(it => it.classList.contains('active'));
        if (active) openModal(active.dataset.key);
      }
    });

    // ---- Resize ----
    window.addEventListener('resize', () => { cfg = getConfig(); applyLayout(); });

    applyLayout();
  }

  // ============================================================
  // 8b. MODAL — abre con datos del proyecto seleccionado
  // ============================================================
  let modalCloseHandler = null;
  function openModal(key) {
    const data = PROJECT_DATA[key];
    if (!data) return;
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modal');
    const visualEl = document.getElementById('modalVisual');
    if (!overlay || !modal) return;

    document.getElementById('modalNum').textContent   = data.num;
    document.getElementById('modalYear').textContent  = data.year;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalRole').textContent  = data.role;
    document.getElementById('modalDesc').textContent  = data.desc;
    document.getElementById('modalProblem').textContent = data.problem;

    const hlEl = document.getElementById('modalHighlights');
    hlEl.innerHTML = data.highlights.map((h) => `<li>${h}</li>`).join('');

    const tagsEl = document.getElementById('modalTags');
    tagsEl.innerHTML = data.tags.map((t) => `<span class="tag">${t}</span>`).join('');

    visualEl.innerHTML = `<div class="wi-visual ${data.visual}">${data.visualHTML}</div>`;

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(modal,
      { opacity: 0, scale: 0.94, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.08 }
    );

    if (!modalCloseHandler) {
      modalCloseHandler = true;
      const close = document.getElementById('modalClose');
      if (close) close.addEventListener('click', closeModal);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
      });
    }
  }

  function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modal');
    if (!overlay) return;
    gsap.to(modal, { opacity: 0, scale: 0.94, y: 10, duration: 0.3, ease: 'power2.in' });
    gsap.to(overlay, {
      opacity: 0, duration: 0.35, delay: 0.05, ease: 'power2.in',
      onComplete: () => {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }
    });
  }

  // ============================================================
  // 9. CONTACT — scale 0.8 → 1 SCRUBBED
  // ============================================================
  function initContactScale() {
    if (typeof ScrollTrigger === 'undefined' || prefersReduced) return;
    const intro = document.getElementById('contactIntro');
    if (!intro) return;
    gsap.fromTo(intro,
      { scale: 0.8, opacity: 0.5 },
      {
        scale: 1, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1,
        },
      }
    );
  }

  // ============================================================
  // 10. TRAYECTORIA — cada item translateX(-30) → 0 stagger + scrub
  // ============================================================
  function initTrayectoriaStagger() {
    if (typeof ScrollTrigger === 'undefined') return;
    const list = document.getElementById('trayecList');
    if (!list) return;
    const items = list.querySelectorAll('.trayec-entry');

    items.forEach((item) => {
      gsap.fromTo(item,
        { x: -24, opacity: 0 },
        {
          x: 0, opacity: 1,
          ease: 'power2.out',
          duration: 0.5,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  // ============================================================
  // 10b. LAPTOP — MacBook que entra CERRADA y se abre con el scroll.
  //  - Estado inicial: laptop en 3/4 (rotateX 14°), tapa flat (rotateX -90°)
  //    con cara exterior de aluminio visible sobre el bezel.
  //  - Scroll: laptop se endereza y tapa se levanta a 0°. El aluminio
  //    fade-out reveal del bezel, y al final la pantalla se enciende.
  //  - Pin del stage durante toda la animación para que no se pase de largo.
  // ============================================================
  function initLaptopOpen() {
    if (typeof ScrollTrigger === 'undefined' || prefersReduced) return;
    const stage = document.getElementById('laptopStage');
    const laptop = document.getElementById('laptop');
    const lid   = document.getElementById('laptopLid');
    const lidCover = document.getElementById('lidCover');
    const content = document.getElementById('screenContent');
    if (!stage || !lid || !laptop) return;

    // Mobile: sin 3D, tapa abierta directamente
    if (window.matchMedia('(max-width: 800px)').matches) {
      gsap.set(laptop, { rotationX: 0 });
      gsap.set(lid, { rotationX: 0 });
      if (lidCover) gsap.set(lidCover, { opacity: 0 });
      if (content) gsap.set(content, { opacity: 1 });
      return;
    }

    // Estado inicial: laptop en vista 3/4 desde arriba + tapa cerrada (lid en
    // -90° lying flat) + cara exterior aluminio visible + screen content off.
    gsap.set(laptop, { rotationX: 14 });
    gsap.set(lid, { rotationX: -90 });
    if (lidCover) gsap.set(lidCover, { opacity: 1 });
    if (content) gsap.set(content, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=140%',
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Apertura: la tapa rota desde -90° (cerrada) hasta 0° (vertical),
    // la laptop se endereza ligeramente, el aluminio se desvanece y al final
    // la pantalla se enciende.
    tl.to(laptop, { rotationX: 0, ease: 'power2.inOut', duration: 1 }, 0)
      .to(lid,    { rotationX: 0, ease: 'power2.inOut', duration: 1 }, 0);
    if (lidCover) {
      tl.to(lidCover, { opacity: 0, ease: 'power1.out', duration: 0.3 }, 0.35);
    }
    if (content) {
      tl.to(content, { opacity: 1, ease: 'power1.out', duration: 0.2 }, 0.78);
    }
  }

  // ============================================================
  // 11. MARQUEE — GSAP ticker, dos filas opuestas, pausa al hover
  // ============================================================
  function initMarquee() {
    if (typeof gsap === 'undefined') return;
    const rows = document.querySelectorAll('[data-marquee]');
    rows.forEach((row) => {
      const track = row.querySelector('[data-marquee-track]');
      if (!track) return;

      const originals = Array.from(track.children).map((c) => c.cloneNode(true));
      track.innerHTML = '';
      for (let i = 0; i < 3; i++) originals.forEach((node) => track.appendChild(node.cloneNode(true)));

      const dir = parseFloat(row.dataset.dir) || 1;
      const speed = 32;
      const blockWidth = track.scrollWidth / 3;
      let x = dir === 1 ? 0 : -blockWidth;
      let paused = false;
      let inView = true;

      // Pausa cuando la fila está fuera de viewport
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => { inView = entries[0].isIntersecting; },
          { rootMargin: '50px' }
        );
        io.observe(row);
      }

      row.addEventListener('mouseenter', () => { paused = true; });
      row.addEventListener('mouseleave', () => { paused = false; });

      gsap.set(track, { x });
      gsap.ticker.add((_t, delta) => {
        if (paused || !inView) return;
        x -= (dir * speed * delta) / 1000;
        if (dir === 1  && x <= -blockWidth) x += blockWidth;
        if (dir === -1 && x >= 0)           x -= blockWidth;
        gsap.set(track, { x });
      });
    });
  }

  // ============================================================
  // 12. NAV — transparente siempre (Luke no cambia al scroll).
  //          Solo mantenemos el smooth scroll de anchors.
  // ============================================================

  // ============================================================
  // BOOT
  // ============================================================
  function boot() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initLenis();
    initCursor();
    initAnchorScroll();

    // Hero
    playHeroIntro();
    initHeroParallax();

    // Sections
    initSectionTitlesClip();
    initStatsCounter();
    initWheel();
    initLaptopOpen();
    initContactScale();
    initTrayectoriaStagger();
    initMarquee();

    // Refresh ScrollTrigger varias veces (post fonts/layout)
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 400);
      setTimeout(() => ScrollTrigger.refresh(), 1200);
      window.addEventListener('load', () => ScrollTrigger.refresh());
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
