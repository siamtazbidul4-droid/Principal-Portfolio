import React, { useEffect, useRef } from 'react';

/**
 * Premium, dependency-free canvas celebration burst.
 *
 * Design goals:
 * - Triggered ONLY by a change of the `trigger` nonce (the caller increments it after a
 *   confirmed successful submission). Rendering this component never fires the effect.
 * - Fully self-contained: an isolated fixed overlay canvas with `pointer-events: none`, so it
 *   cannot shift layout or block interaction.
 * - Runs a single rAF loop that terminates when the animation is done, then cancels the frame
 *   and clears the canvas. Cancels on unmount too, so no animation loop or memory leaks remain.
 * - Respects `prefers-reduced-motion` (renders nothing and schedules nothing).
 */
interface SuccessCanvasEffectProps {
  /** Increment this value to fire a burst. 0 / unchanged = idle (no effect, no loop). */
  trigger: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  life: number;
  maxLife: number;
  shape: 'ribbon' | 'dot';
}

// Luxury palette derived from the portfolio's gold accent.
const PALETTE = ['#C9A769', '#E4CE9A', '#F5F5F2', '#B89658', '#D4B77C'];

const DURATION_MS = 2200;
const PARTICLE_COUNT = 110;

export function SuccessCanvasEffect({ trigger }: SuccessCanvasEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    // Nothing to do until a real trigger arrives.
    if (!trigger) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Origin: top-center, near where the success message appears.
    const originX = width / 2;
    const originY = height * 0.32;

    // Build a fresh particle set for this burst.
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.2 + Math.random() * 6.5;
      const maxLife = 0.6 + Math.random() * 0.4;
      return {
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        size: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        life: 0,
        maxLife,
        shape: Math.random() > 0.45 ? 'ribbon' : 'dot',
      };
    });

    const start = performance.now();

    const render = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION_MS, 1);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      let anyVisible = false;

      for (const p of particlesRef.current) {
        // Normalized life (0..1) across the full burst window.
        const localLife = progress / p.maxLife;
        if (localLife >= 1) continue;
        anyVisible = true;

        // Gentle gravity + horizontal air drag for an organic fall.
        p.vy += 0.14 * progress;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const alpha = 1 - localLife;
        ctx.save();
        ctx.globalAlpha = Math.max(alpha, 0);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'ribbon') {
          ctx.fillRect(-p.size, -p.size * 0.35, p.size * 2, p.size * 0.7);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (progress < 1 && anyVisible) {
        frameRef.current = requestAnimationFrame(render);
      } else {
        // Animation complete — stop the loop and clear all pixels.
        ctx.clearRect(0, 0, width, height);
        particlesRef.current = [];
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(render);

    // Cleanup: cancel any in-flight frame when the effect re-triggers or unmounts.
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      ctx.clearRect(0, 0, width, height);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  );
}
