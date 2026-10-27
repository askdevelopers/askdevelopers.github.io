import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; z: number; hot: boolean };

const NODE_COUNT = 380;
const LINK_DISTANCE = 0.26;

/** Fibonacci-distributed points on a unit sphere, with a few "hot" nodes that glow. */
function buildSphere(): { nodes: Node[]; links: [number, number][] } {
  const nodes: Node[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    nodes.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, hot: i % 17 === 0 });
  }
  const links: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;
      if (dx * dx + dy * dy + dz * dz < LINK_DISTANCE * LINK_DISTANCE) links.push([i, j]);
    }
  }
  return { nodes, links };
}

/** Rotating 3D network sphere drawn on canvas — the hero centerpiece. */
export function NeuralSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { nodes, links } = buildSphere();
    const projected = nodes.map(() => ({ x: 0, y: 0, z: 0 }));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let angle = 0.6;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
      const ay = angle + tilt.x * 0.6;
      const ax = -0.35 + tilt.y * 0.4;
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const x1 = n.x * cosY - n.z * sinY;
        const z1 = n.x * sinY + n.z * cosY;
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = n.y * sinX + z1 * cosX;
        const scale = 2.6 / (2.6 + z2);
        projected[i].x = cx + x1 * radius * scale;
        projected[i].y = cy + y2 * radius * scale;
        projected[i].z = z2;
      }

      ctx.lineWidth = 0.7;
      for (const [a, b] of links) {
        const pa = projected[a];
        const pb = projected[b];
        const depth = (2 - (pa.z + pb.z)) / 4; // 0 (back) .. 1 (front)
        ctx.strokeStyle = `rgba(${Math.round(110 + 60 * depth)}, ${Math.round(120 - 20 * depth)}, 255, ${0.05 + depth * 0.32})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      for (let i = 0; i < nodes.length; i++) {
        const p = projected[i];
        const depth = (1 - p.z) / 2;
        if (nodes[i].hot) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12 * depth + 4);
          g.addColorStop(0, `rgba(167, 139, 250, ${0.85 * depth})`);
          g.addColorStop(1, 'rgba(167, 139, 250, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 12 * depth + 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = nodes[i].hot ? `rgba(255,255,255,${0.4 + depth * 0.6})` : `rgba(157, 180, 255, ${0.15 + depth * 0.75})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (nodes[i].hot ? 2.2 : 1.2) * (0.6 + depth), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      angle += 0.0022;
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      tilt.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      tilt.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (reduceMotion) {
      draw();
    } else {
      window.addEventListener('pointermove', onPointer, { passive: true });
      io = new IntersectionObserver(([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible) raf = requestAnimationFrame(loop);
      });
      io.observe(canvas);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
