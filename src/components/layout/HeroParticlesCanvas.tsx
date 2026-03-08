"use client";

import { animate } from "animejs";
import { useEffect, useRef } from "react";

import { useTheme } from "@/components/providers/ThemeProvider";

import styles from "@/styles/components/hero-section.module.css";

interface ParticleState {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  glow: number;
  driftX: number;
  driftY: number;
  scale: number;
  color: string;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getParticleCount(width: number) {
  if (width >= 1024) {
    return 80;
  }

  if (width >= 768) {
    return 50;
  }

  return 30;
}

function getPalette(theme: "dark" | "light") {
  if (theme === "light") {
    return [
      "100,116,139",
      "96,165,250",
      "167,139,250",
    ];
  }

  return [
    "255,255,255",
    "147,197,253",
    "196,181,253",
  ];
}

function createParticles(width: number, height: number, theme: "dark" | "light") {
  const palette = getPalette(theme);
  const opacityMax = theme === "dark" ? 0.6 : 0.5;
  const opacityMin = theme === "dark" ? 0.2 : 0.2;
  const count = getParticleCount(width);

  return Array.from({ length: count }, (_, index) => ({
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    radius: randomBetween(2, 6),
    opacity: randomBetween(opacityMin, opacityMax),
    glow: index % 8 === 0 ? randomBetween(12, 18) : randomBetween(theme === "dark" ? 6 : 8, theme === "dark" ? 12 : 14),
    driftX: randomBetween(-24, 24),
    driftY: randomBetween(-80, -24),
    scale: randomBetween(0.85, 1.3),
    color: palette[index % palette.length],
  })) satisfies ParticleState[];
}

export function HeroParticlesCanvas() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const animations: Array<{ cancel: () => void }> = [];
    let frameId = 0;
    let particles: ParticleState[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const radius = particle.radius * particle.scale;
        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          radius * 2.8,
        );

        gradient.addColorStop(0, `rgba(${particle.color}, ${particle.opacity})`);
        gradient.addColorStop(0.4, `rgba(${particle.color}, ${particle.opacity * 0.42})`);
        gradient.addColorStop(1, `rgba(${particle.color}, 0)`);

        context.beginPath();
        context.fillStyle = gradient;
        context.arc(particle.x, particle.y, radius * 2.8, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.fillStyle = `rgba(${particle.color}, ${Math.min(particle.opacity + 0.08, 0.72)})`;
        context.shadowBlur = particle.glow;
        context.shadowColor = `rgba(${particle.color}, ${particle.opacity * 0.55})`;
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      }

      frameId = window.requestAnimationFrame(draw);
    };

    const createAnimations = () => {
      animations.splice(0).forEach((animation) => animation.cancel());

      particles.forEach((particle) => {
        animations.push(
          animate(particle, {
            x: particle.x + randomBetween(-12, 12),
            y: particle.y + particle.driftY,
            scale: randomBetween(0.9, 1.45),
            opacity: randomBetween(theme === "dark" ? 0.22 : 0.2, theme === "dark" ? 0.62 : 0.54),
            duration: randomBetween(8000, 18000),
            delay: randomBetween(0, 1800),
            easing: "inOutSine",
            loop: true,
            alternate: true,
          }),
        );

        animations.push(
          animate(particle, {
            x: [
              particle.x + particle.driftX,
              particle.x - particle.driftX * 0.65,
              particle.x + particle.driftX * 0.35,
            ],
            duration: randomBetween(10000, 18000),
            easing: "inOutSine",
            loop: true,
            alternate: true,
          }),
        );
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;

      if (!parent) {
        return;
      }

      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      particles = createParticles(width, height, theme);

      if (!prefersReducedMotion) {
        createAnimations();
      }
    };

    resize();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={styles.particleCanvas} aria-hidden="true" />;
}
