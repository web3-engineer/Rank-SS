"use client";

import React, { useEffect, useRef, useState } from "react";

// --- CONFIGURAÇÕES VISUAIS ---
const PARTICLE_COUNT = 2200; 
const GLOBE_RADIUS_RATIO = 0.35; 
const SNAKE_THICKNESS = 60; 
const SNAKE_SPEED = 0.01;   

const COLORS = [
  "#22d3ee", "#0ea5e9", "#3b82f6", "#60a5fa", "#a5f3fc",
];

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  theta: number; 
  phi: number;   
  angle: number; 
  distance: number;
  // Propriedades do Grid
  gridX: number;
  gridY: number;
}

const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = 0, height = 0;
    
    let particles: Particle[] = [];
    let animationId: number;
    let time = 0;

    // Fases: 0=Globo, 1=Serpente, 2=Geometria, 3=Grid (GitHub style), 4=Explosão
    let phase = 0; 
    let phaseTimer = 0;

    const applyDPR = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      particles = [];
      const phiFactor = Math.PI * (3 - Math.sqrt(5)); 
      
      // Configuração para o Grid (44 colunas x 50 linhas = 2200)
      const cols = 50;
      const rows = 44;
      const spacing = 12; // Espaçamento entre os quadrados

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const y_pos = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
        
        // Cálculo da posição no Grid
        const col = i % cols;
        const row = Math.floor(i / cols);

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          color: COLORS[i % COLORS.length],
          theta: phiFactor * i, 
          phi: Math.acos(y_pos),
          angle: (i / PARTICLE_COUNT) * Math.PI * 25,
          distance: Math.sqrt(i / PARTICLE_COUNT),
          gridX: (col - cols / 2) * spacing,
          gridY: (row - rows / 2) * spacing,
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; 
      ctx.fillRect(0, 0, width, height);

      phaseTimer++;

      // Gerenciador de Tempo das Fases
      if (phase === 0 && phaseTimer > 300) { phase = 1; phaseTimer = 0; }
      else if (phase === 1 && phaseTimer > 360) { phase = 2; phaseTimer = 0; }
      else if (phase === 2 && phaseTimer > 400) { phase = 3; phaseTimer = 0; } // Transição para Grid
      else if (phase === 3 && phaseTimer > 450) { phase = 4; phaseTimer = 0; } // Transição para Explosão
      else if (phase === 4 && phaseTimer > 120) { phase = 0; phaseTimer = 0; }

      time += SNAKE_SPEED; 
      
      const centerX = width * 0.75; 
      const centerY = height * 0.5; 
      const globalCenterX = width * 0.5; // Centro real da tela para o grid
      const globeRadius = Math.min(width, height) * GLOBE_RADIUS_RATIO;

      particles.forEach((p, i) => {
        let targetX = p.x;
        let targetY = p.y;
        let scale = 1; 
        let isSquare = false;

        // --- FASE 0: GLOBO ORIGINAL ---
        if (phase === 0) {
          const rotationSpeed = time * 2;
          const sphereX = globeRadius * Math.sin(p.phi) * Math.cos(p.theta + rotationSpeed);
          const sphereZ = globeRadius * Math.sin(p.phi) * Math.sin(p.theta + rotationSpeed);
          const sphereY = globeRadius * Math.cos(p.phi);
          const perspective = 300 / (300 - sphereZ);
          scale = Math.max(0.1, perspective); 
          targetX = centerX + sphereX;
          targetY = centerY + sphereY;
        }

        // --- FASE 1: SERPENTE ---
        else if (phase === 1) {
          const lag = i * 0.002; 
          const t = time * 2 - lag;
          const wanderX = Math.cos(t) * (width * 0.4) + Math.sin(t * 2.1) * (width * 0.1);
          const wanderY = Math.sin(t * 1.3) * (height * 0.4) + Math.cos(t * 1.7) * (height * 0.1);
          const snakeCenterX = (width * 0.5) + wanderX;
          const snakeCenterY = (height * 0.5) + wanderY;
          const r = Math.random() * SNAKE_THICKNESS;
          const theta = Math.random() * Math.PI * 2;
          targetX = snakeCenterX + Math.cos(theta) * r;
          targetY = snakeCenterY + Math.sin(theta) * r;
        }

        // --- FASE 2: GEOMETRIA ---
        else if (phase === 2) {
          const shapeShift = Math.sin(phaseTimer * 0.03); 
          const spiralX = Math.cos(p.angle + time) * p.distance * globeRadius * 1.8;
          const spiralY = Math.sin(p.angle + time) * p.distance * globeRadius * 1.8;
          const k = 5, l = 0.5, geoR = globeRadius * 1.3;
          const geoX = geoR * ((1-k)*Math.cos(p.angle) + l*k*Math.cos((1-k)/k * p.angle));
          const geoY = geoR * ((1-k)*Math.sin(p.angle) - l*k*Math.sin((1-k)/k * p.angle));
          const lerp = (shapeShift + 1) / 2;
          targetX = centerX + (spiralX * (1 - lerp) + geoX * lerp);
          targetY = centerY + (spiralY * (1 - lerp) + geoY * lerp);
        }

        // --- FASE 3: GRID SYMMETRIC (GitHub Style) ---
        else if (phase === 3) {
          isSquare = true;
          targetX = globalCenterX + p.gridX;
          targetY = (height * 0.5) + p.gridY;
          
          // Efeito de pulso de brilho baseado na coluna
          const colIndex = i % 50;
          const pulse = Math.sin(time * 5 + colIndex * 0.2);
          scale = 0.8 + pulse * 0.2;
        }

        // --- FASE 4: EXPLOSÃO ---
        else if (phase === 4) {
           const dx = p.x - globalCenterX;
           const dy = p.y - (height * 0.5);
           const angle = Math.atan2(dy, dx);
           targetX = p.x + Math.cos(angle) * 15;
           targetY = p.y + Math.sin(angle) * 15;
        }

        const ease = (phase === 4) ? 1 : 0.08;
        p.x += (targetX - p.x) * ease;
        p.y += (targetY - p.y) * ease;

        ctx.beginPath();
        let alpha = phase === 0 ? (scale > 1 ? 1 : 0.3) : 0.8;

        if (isSquare) {
          // Desenho do Estilo GitHub com Blur/Glow
          const s = 8 * scale;
          
          // Camada de Blur (Sombra/Brilho externo)
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.4;
          ctx.fillRect(p.x - s/2, p.y - s/2, s, s);

          // Camada principal (Sharp)
          ctx.shadowBlur = 0;
          ctx.globalAlpha = alpha;
          ctx.fillRect(p.x - s/2, p.y - s/2, s, s);
        } else {
          // Círculo padrão para outras fases
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.globalAlpha = 1; 
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(draw);
    };

    applyDPR();
    initParticles();
    draw();

    const onResize = () => { applyDPR(); initParticles(); };
    window.addEventListener("resize", onResize);

    return () => { 
      cancelAnimationFrame(animationId); 
      window.removeEventListener("resize", onResize);
    };
  }, [mounted]);

  if (!mounted) return <div className="fixed inset-0 z-0 bg-black" />;

  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default ParticleSystem;