'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Lista de Termos Biológicos
const BASE_TERMS = [
    "Mitochondria", "Ribosome", "Nucleus", "Cytoplasm", "Membrane",
    "Lysosome", "Golgi", "Endoplasmic", "Vacuole", "Chloroplast",
    "DNA", "RNA", "CRISPR", "Enzyme", "Protein",
    "Lipid", "Carbohydrate", "Glucose", "ATP", "ADP",
    "Neuron", "Axon", "Synapse", "Dendrite", "Myelin",
    "Hemoglobin", "Leukocyte", "Platelet", "Plasma", "Antibody",
    "Antigen", "Virus", "Bacteria", "Fungi", "Mitosis"
];
const BIO_TERMS = [...BASE_TERMS, ...BASE_TERMS];

const ZaeonBiologyRoom = () => {
    const { t } = useTranslation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); // Referência para o tamanho do container pai

    // --- 1. CONFIGURAÇÃO INICIAL ---
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // --- 2. AÇÃO DO BOTÃO "UNDERSTOOD" ---
    const handleUnderstood = () => {
        setIsModalOpen(false);
    };

    // --- 3. BIO-PHYSICS ENGINE (DNA 3D Fluido) ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        // Mouse relativo ao canvas, não à tela inteira
        let mouse = { x: -1000, y: -1000 };
        const interactionRadius = 300;

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };
        const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };

        // Adiciona listeners no container ou janela, mas calcula relativo ao canvas
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseout', handleMouseLeave);

        const resize = () => {
            // Ajusta o canvas para o tamanho do elemento pai (Container do Lounge), não da janela
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };
        
        // ResizeObserver é melhor que window.resize para elementos internos
        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(container);
        resize();

        const SPACING = 50; 
        const TOTAL_HEIGHT = BIO_TERMS.length * SPACING; 

        class Molecule {
            text: string;
            y: number;
            strand: 1 | 2;
            x: number = 0;
            scale: number = 1;
            opacity: number = 1;
            color: string;
            baseX: number = 0;

            constructor(text: string, startY: number, strand: 1 | 2) {
                this.text = text;
                this.y = startY;
                this.strand = strand;
                this.color = strand === 1 ? '#10B981' : '#06b6d4';
            }

            update(canvasW: number, speed: number) {
                this.y -= speed;
                if (this.y < -100) {
                    this.y += TOTAL_HEIGHT;
                }

                const helixRadius = 140;
                const helixCenter = canvasW * 0.5; // Centralizado no container
                const frequency = 0.005; 

                const angle = (this.y * frequency) + (this.strand === 1 ? 0 : Math.PI);
                this.baseX = helixCenter + Math.cos(angle) * helixRadius;
                const baseZ = Math.sin(angle);

                let targetScale = 0.6 + (baseZ + 1) * 0.25;
                let targetOpacity = 0.4 + (baseZ + 1) * 0.4;

                const dx = mouse.x - this.baseX;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let targetX = this.baseX;

                if (dist < interactionRadius && dist > 0) {
                    const pullStrength = Math.pow(1 - dist / interactionRadius, 2);
                    const maxPullDistance = 60;
                    const offsetX = (dx / dist) * pullStrength * maxPullDistance;
                    targetX = this.baseX + offsetX;
                    targetScale = Math.min(targetScale * 1.2, 1.5);
                    targetOpacity = 1;
                }

                if (this.x === 0) this.x = this.baseX;

                this.x += (targetX - this.x) * 0.1;
                this.scale += (targetScale - this.scale) * 0.1;
                this.opacity += (targetOpacity - this.opacity) * 0.1;
            }

            draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
                let displayColor = this.color;
                let textColor = isDark ? '#ffffff' : '#1f2937';

                if (!isDark) {
                    displayColor = this.strand === 1 ? '#059669' : '#0891b2';
                }

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(this.scale, this.scale);

                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, Math.PI * 2);
                ctx.fillStyle = displayColor;
                ctx.globalAlpha = this.opacity;
                ctx.fill();

                if (isDark) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = displayColor;
                }

                ctx.fillStyle = textColor;
                ctx.globalAlpha = this.opacity;
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, 15, 0);

                ctx.restore();
            }
        }

        const molecules: Molecule[] = [];

        BIO_TERMS.forEach((term, i) => {
            const strand = i % 2 === 0 ? 1 : 2;
            const startY = canvas.height + (i * SPACING);
            molecules.push(new Molecule(term, startY, strand));
        });

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Verifica o tema procurando a classe 'dark' no html ou body
            const isDarkNow = document.documentElement.classList.contains('dark');

            const drawStrand = (strandNum: 1 | 2) => {
                const strandMols = molecules.filter(m => m.strand === strandNum).sort((a, b) => a.y - b.y);

                ctx.beginPath();
                ctx.strokeStyle = isDarkNow
                    ? (strandNum === 1 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(6, 182, 212, 0.4)')
                    : (strandNum === 1 ? 'rgba(5, 150, 105, 0.3)' : 'rgba(8, 145, 178, 0.3)');

                ctx.lineWidth = isDarkNow ? 5 : 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                if (strandMols.length > 0) {
                    let started = false;

                    for (let i = 0; i < strandMols.length - 1; i++) {
                        const curr = strandMols[i];
                        const next = strandMols[i+1];

                        if (Math.abs(curr.y - next.y) < SPACING * 2.5) {
                            if (!started) {
                                ctx.moveTo(curr.x, curr.y);
                                started = true;
                            }
                            const midX = (curr.x + next.x) / 2;
                            const midY = (curr.y + next.y) / 2;
                            ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
                            ctx.quadraticCurveTo(midX, midY, next.x, next.y);
                        } else {
                            started = false; 
                        }
                    }
                }
                ctx.stroke();
            };

            molecules.forEach(m => m.update(canvas.width, 1.2));

            drawStrand(1);
            drawStrand(2);

            molecules.sort((a, b) => a.scale - b.scale);
            molecules.forEach(m => m.draw(ctx, isDarkNow));

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseout', handleMouseLeave);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        // FIX: w-full h-full (não w-screen), rounded para encaixar, relative para conter children
        <div 
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden font-mono transition-colors duration-500 rounded-[2.5rem]
            bg-gray-100 
            dark:bg-[linear-gradient(to_bottom_right,_#065f46_0%,_#022c22_60%,_#000000_100%)]
        `}>

            {/* CAMADA 2: CANVAS (Z-0 para ficar atrás do modal mas dentro do container) */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-auto" />

            {/* CAMADA 3: MODAL INFORMATIVO (Absolute ao invés de Fixed para ficar dentro do módulo) */}
            <AnimatePresence>
                {isLoaded && isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 z-30 flex items-center justify-center bg-black/40"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 10 }}
                            className={`w-full max-w-[400px] m-4 relative
                            bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-green-900 shadow-2xl dark:shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)]
                            `}
                        >
                            {/* Top Bar (Visual Técnico) */}
                            <div className="border-b p-3 flex items-center justify-between select-none bg-green-900/5 dark:bg-green-900/20 border-green-800/10 dark:border-green-800/50">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-green-500">
                                    <Activity size={12} />
                                    <span>PROTOCOL_V2</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 border animate-pulse rounded-full bg-green-500 border-green-400"></div>
                                    <div className="w-2 h-2 border rounded-full border-green-800/30"></div>
                                </div>
                            </div>

                            {/* Corpo */}
                            <div className="p-8 relative overflow-hidden">
                                {/* Scanline Effect Sutil */}
                                <div className="absolute inset-0 bg-[length:100%_4px] pointer-events-none z-0 opacity-0 dark:opacity-20
                                     bg-[linear-gradient(rgba(16,185,129,0)_50%,rgba(16,185,129,0.1)_50%)]"></div>

                                <div className="relative z-10 flex flex-col gap-6">
                                    {/* Header do Aviso */}
                                    <div className="border-l-4 pl-4 py-1 border-yellow-500 dark:border-yellow-600">
                                        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-gray-800 dark:text-white">
                                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                            Usage Guidelines
                                        </h2>
                                        <p className="text-[10px] mt-1 uppercase tracking-[0.2em] text-gray-400 dark:text-green-500/60 font-bold">
                                            Restricted Environment
                                        </p>
                                    </div>

                                    {/* Texto Informativo */}
                                    <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-green-900/10 p-5 border border-gray-100 dark:border-green-800/30 rounded-sm">
                                        <p className="mb-3 font-bold text-gray-800 dark:text-green-400 uppercase tracking-wide text-[10px]">Attention, Researcher.</p>
                                        <p className="mb-3">
                                            You are entering a specialized study zone. To maintain the integrity of the data stream, please ensure all queries are strictly related to:
                                        </p>
                                        <ul className="space-y-1.5 list-none">
                                            {['Biology & Ecosystems', 'Medicine & Pathology', 'Health Sciences'].map((item) => (
                                                <li key={item} className="flex items-center gap-2 text-[11px] font-mono text-gray-500 dark:text-green-300">
                                                    <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Botão de Ação */}
                                    <button
                                        onClick={handleUnderstood}
                                        className="w-full py-4 text-xs font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 group duration-300 border
                                        bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900
                                        dark:bg-green-950/30 dark:border-green-800/50 dark:text-green-400 dark:hover:bg-green-900/50 dark:hover:text-white dark:hover:border-green-500"
                                    >
                                        <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Understood
                                    </button>
                                </div>
                            </div>

                            {/* Rodapé Técnico */}
                            <div className="border-t p-2 flex justify-between text-[8px] uppercase tracking-widest bg-gray-50 dark:bg-black/80 border-gray-100 dark:border-green-900/30 text-gray-400 dark:text-green-800/60 font-mono">
                                <span>SECURE_CHANNEL_ESTABLISHED</span>
                                <span>ID: BIO-8821</span>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ZaeonBiologyRoom;