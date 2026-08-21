'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './LaptopReveal.module.css';
import ScreenContent from './ScreenContent';

type LaptopRevealProps = {
  /** Contenido que va dentro de la pantalla. Si no se provee, se renderiza
   *  un dashboard placeholder. */
  children?: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function LaptopReveal({
  children,
  title = 'Construido para mostrar tu trabajo.',
  subtitle = '// scroll para abrir',
}: LaptopRevealProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const laptopRef = useRef<HTMLDivElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const screenContentRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const laptop = laptopRef.current;
    const lid = lidRef.current;
    const cover = coverRef.current;
    const content = screenContentRef.current;
    const glow = glowRef.current;
    const shadow = shadowRef.current;
    if (!section || !laptop || !lid || !cover || !content) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Mapping del spec del usuario a valores CSS:
    //   "lid rotates from 0° (closed) to -100° (open with overshoot)"
    // CSS con pivot en la base del lid:
    //   rotateX(-90°)  → tapa lying flat (closed)
    //   rotateX(+10°)  → tapa upright con 10° de back-lean (open + overshoot)
    // Diferencia total: 100° — coincide con el spec.
    const LID_CLOSED = -90;
    const LID_OPEN = 10;

    // ===== Reduced motion: salta al estado final =====
    if (prefersReduced) {
      gsap.set(laptop, { rotateX: 8, scale: 1 });
      gsap.set(lid, { rotateX: LID_OPEN });
      gsap.set(cover, { opacity: 0 });
      gsap.set(content, { opacity: 1 });
      if (shadow) gsap.set(shadow, { scale: 1.35, opacity: 0.7 });
      return;
    }

    // ===== Mobile: sin pin, abre con fade-in ligero =====
    if (isMobile) {
      gsap.set(laptop, { rotateX: 0, scale: 1 });
      gsap.set(lid, { rotateX: LID_OPEN });
      gsap.set(cover, { opacity: 0 });
      const fade = gsap.fromTo(
        content,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        },
      );
      return () => {
        fade.scrollTrigger?.kill();
        fade.kill();
      };
    }

    // ===== Desktop: animación scrubbed con pin =====
    gsap.set(laptop, { rotateX: 8, scale: 1 });
    gsap.set(lid, { rotateX: LID_CLOSED });
    gsap.set(cover, { opacity: 1 });
    gsap.set(content, { opacity: 0 });
    if (glow) gsap.set(glow, { opacity: 0 });
    if (shadow) gsap.set(shadow, { scale: 1, opacity: 0.5 });

    // will-change SOLO durante la animación
    laptop.style.willChange = 'transform';
    lid.style.willChange = 'transform';

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 0–60% — apertura del lid + sombra crece y se difumina
    tl.to(lid, { rotateX: LID_OPEN, ease: 'power2.inOut', duration: 0.6 }, 0);
    tl.to(cover, { opacity: 0, ease: 'power1.out', duration: 0.4 }, 0.15);
    if (shadow) {
      tl.to(shadow, { scale: 1.5, opacity: 0.78, ease: 'power2.inOut', duration: 0.6 }, 0);
    }

    // 50–80% — la pantalla se enciende con glow azul/blanco que aparece y se va
    if (glow) {
      tl.to(glow, { opacity: 0.95, ease: 'power2.out', duration: 0.18 }, 0.5);
      tl.to(glow, { opacity: 0, ease: 'power1.out', duration: 0.18 }, 0.68);
    }
    tl.to(content, { opacity: 1, ease: 'power2.out', duration: 0.3 }, 0.5);

    // 80–100% — zoom-in sutil hacia la pantalla
    tl.to(laptop, { scale: 1.15, ease: 'power2.inOut', duration: 0.2 }, 0.8);

    // Limpia will-change cuando la animación ya pasó
    const cleanupWillChange = () => {
      if (laptop) laptop.style.willChange = '';
      if (lid) lid.style.willChange = '';
    };
    tl.scrollTrigger?.eventCallback('onLeave', cleanupWillChange);
    tl.scrollTrigger?.eventCallback('onLeaveBack', cleanupWillChange);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      cleanupWillChange();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full min-h-screen flex items-center justify-center overflow-hidden ${styles.heroBg}`}
    >
      {/* Copy del hero */}
      <div className="absolute inset-x-0 top-10 md:top-16 z-10 text-center px-6 pointer-events-none">
        <p className={`${styles.eyebrow} text-xs uppercase tracking-[0.22em] opacity-60`}>
          {subtitle}
        </p>
        <h1 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#192632] max-w-2xl mx-auto leading-tight">
          {title}
        </h1>
      </div>

      {/* Stage 3D */}
      <div className={styles.perspectiveStage}>
        <div ref={shadowRef} className={styles.laptopShadow} aria-hidden="true" />
        <div ref={laptopRef} className={styles.laptop}>
          {/* Lid (rotates around bottom edge / hinge) */}
          <div ref={lidRef} className={styles.laptopLid}>
            {/* Cara exterior: tapa de aluminio con marca minimalista. */}
            <div ref={coverRef} className={styles.lidCover} aria-hidden="true">
              <div className={styles.lidBrand} />
              <div className={styles.lidLine} />
            </div>
            {/* Cara interior: pantalla con notch + content slot. */}
            <div className={styles.lidScreen}>
              <div className={styles.notch} aria-hidden="true">
                <div className={styles.notchCam} />
              </div>
              <div ref={glowRef} className={styles.screenGlow} aria-hidden="true" />
              <div ref={screenContentRef} className={styles.screenContent}>
                {children ?? <ScreenContent />}
              </div>
            </div>
          </div>

          {/* Base (chassis con teclado y trackpad) */}
          <div className={styles.laptopBase}>
            <div className={styles.hinge} aria-hidden="true" />
            <div className={styles.keyboard} aria-hidden="true" />
            <div className={styles.trackpad} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
