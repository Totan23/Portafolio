// ============================================================
// BACKGROUND VISUAL SYSTEM
// Constellation particles + floating geometric shapes + parallax
// ============================================================

// ---- 1. PARTICLE CONSTELLATION (Canvas fixed background) ----
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(init) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : -5;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = Math.random() * 0.15 + 0.05;
      this.r  = Math.random() * 1.2 + 0.4;
      this.base_opacity = Math.random() * 0.35 + 0.1;
      this.opacity = this.base_opacity;
      // Mostly cyan, some purple
      this.cyan = Math.random() > 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion (very subtle)
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += (dx / dist) * 0.4;
        this.y += (dy / dist) * 0.4;
      }

      if (this.y > canvas.height + 5) this.reset(false);
      if (this.x < -5)  this.x = canvas.width  + 5;
      if (this.x > canvas.width  + 5) this.x = -5;
    }
    draw() {
      const color = this.cyan ? '0, 212, 255' : '124, 58, 237';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 90);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < maxDist * maxDist) {
          const dist = Math.sqrt(dist2);
          const alpha = (1 - dist / maxDist) * 0.09;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrame = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    init();
    animate();
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  init();
  animate();
})();


// ---- 2. FLOATING GEOMETRIC SHAPES (parallax on scroll) ----
(function initFloatingShapes() {
  const shapeDefs = [
    // { type, size, left%, top%, speedY, drift, color, opacity, delay }
    { type: 'ring',     size: 320, left: 8,  top: 18,  speedY: 0.07, drift: 20, color: '0,212,255',   opacity: 0.04, delay: 0   },
    { type: 'hexagon',  size: 200, left: 82, top: 12,  speedY: 0.05, drift: 15, color: '0,212,255',   opacity: 0.045, delay: 2  },
    { type: 'ring',     size: 180, left: 88, top: 55,  speedY: 0.11, drift: 25, color: '124,58,237',  opacity: 0.05, delay: 1   },
    { type: 'triangle', size: 160, left: 15, top: 68,  speedY: 0.09, drift: 18, color: '124,58,237',  opacity: 0.04, delay: 3   },
    { type: 'ring',     size: 440, left: 50, top: 95,  speedY: 0.03, drift: 10, color: '0,212,255',   opacity: 0.025,delay: 0   },
    { type: 'hexagon',  size: 120, left: 6,  top: 48,  speedY: 0.13, drift: 22, color: '124,58,237',  opacity: 0.05, delay: 4   },
    { type: 'triangle', size: 90,  left: 72, top: 82,  speedY: 0.08, drift: 16, color: '0,212,255',   opacity: 0.04, delay: 2   },
    { type: 'ring',     size: 250, left: 40, top: 40,  speedY: 0.06, drift: 12, color: '124,58,237',  opacity: 0.03, delay: 5   },
  ];

  // Inject CSS for shapes
  const style = document.createElement('style');
  style.textContent = `
    #bg-shapes {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .bgs-wrap {
      position: absolute;
      will-change: transform;
    }
    .bgs-inner {
      transform: translate(-50%, -50%);
    }
    .bgs-ring {
      border-radius: 50%;
      border: 1px solid currentColor;
      width: 100%;
      height: 100%;
    }
    .bgs-inner svg {
      display: block;
    }
    ${shapeDefs.map((s, i) => `
    .bgs-wrap:nth-child(${i + 1}) .bgs-inner {
      animation: bgsDrift${i % 4} ${14 + i * 2.5}s ${s.delay}s ease-in-out infinite;
    }`).join('')}
    @keyframes bgsDrift0 {
      0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
      50%       { transform: translate(-50%, calc(-50% - 20px)) rotate(60deg); }
    }
    @keyframes bgsDrift1 {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50%       { transform: translate(-50%, calc(-50% + 18px)) scale(1.06) rotate(-45deg); }
    }
    @keyframes bgsDrift2 {
      0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
      33%       { transform: translate(calc(-50% + 15px), calc(-50% - 12px)) rotate(120deg); }
      66%       { transform: translate(calc(-50% - 15px), calc(-50% + 8px)) rotate(240deg); }
    }
    @keyframes bgsDrift3 {
      0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
      50%       { transform: translate(-50%, calc(-50% - 25px)) scale(0.93) rotate(180deg); }
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'bg-shapes';
  document.body.insertBefore(container, document.getElementById('bg-canvas').nextSibling);

  shapeDefs.forEach((s) => {
    const wrap = document.createElement('div');
    wrap.className = 'bgs-wrap';
    wrap.style.cssText = `left:${s.left}%;top:${s.top}%;width:${s.size}px;height:${s.size}px;opacity:${s.opacity};color:rgba(${s.color},1);`;
    wrap.dataset.speed = s.speedY;

    const inner = document.createElement('div');
    inner.className = 'bgs-inner';
    inner.style.cssText = `width:${s.size}px;height:${s.size}px;`;

    if (s.type === 'ring') {
      const ring = document.createElement('div');
      ring.className = 'bgs-ring';
      inner.appendChild(ring);
    } else if (s.type === 'hexagon') {
      inner.innerHTML = `<svg viewBox="0 0 100 100" width="${s.size}" height="${s.size}" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="none" stroke="rgba(${s.color},1)" stroke-width="0.8"/>
      </svg>`;
    } else if (s.type === 'triangle') {
      inner.innerHTML = `<svg viewBox="0 0 100 100" width="${s.size}" height="${s.size}" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,3 97,95 3,95" fill="none" stroke="rgba(${s.color},1)" stroke-width="0.8"/>
      </svg>`;
    }

    wrap.appendChild(inner);
    container.appendChild(wrap);
  });

  // Smooth parallax on scroll
  let currentY = 0;
  let targetY  = 0;
  let rafId;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateParallax() {
    targetY = window.scrollY;
    currentY = lerp(currentY, targetY, 0.08);

    document.querySelectorAll('.bgs-wrap').forEach(el => {
      const speed = parseFloat(el.dataset.speed);
      el.style.transform = `translateY(${currentY * speed}px)`;
    });

    rafId = requestAnimationFrame(updateParallax);
  }

  updateParallax();
})();


// ---- 3. HERO CURSOR GLOW (mouse follow) ----
(function initCursorGlow() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.4s ease, top 0.4s ease;
    z-index: 0;
    opacity: 0;
    transition: left 0.3s ease, top 0.3s ease, opacity 0.5s ease;
  `;
  hero.style.position = 'relative';
  hero.appendChild(glow);

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    glow.style.left    = (e.clientX - rect.left)  + 'px';
    glow.style.top     = (e.clientY - rect.top)   + 'px';
    glow.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
})();


// ---- 4. SECTION AMBIENT GLOW (changes color as you scroll) ----
(function initSectionGlow() {
  const glowEl = document.createElement('div');
  glowEl.id = 'ambient-glow';
  glowEl.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    transition: background 1.2s ease;
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,255,0.04) 0%, transparent 60%);
  `;
  document.body.insertBefore(glowEl, document.body.firstChild);

  const sectionColors = {
    hero:     'rgba(0,212,255,0.04)',
    about:    'rgba(0,212,255,0.035)',
    projects: 'rgba(124,58,237,0.04)',
    skills:   'rgba(0,212,255,0.04)',
    timeline: 'rgba(124,58,237,0.035)',
    contact:  'rgba(124,58,237,0.05)',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const col = sectionColors[id] || sectionColors.hero;
        glowEl.style.background =
          `radial-gradient(ellipse 80% 50% at 50% -10%, ${col} 0%, transparent 65%)`;
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
})();
