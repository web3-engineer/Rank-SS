"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";

// --- CONTEÚDO (ZAEON MANIFESTO) ---
const MANIFESTO_PAGES = [
  {
    title: "ZAEON MANIFESTO",
    subtitle: "Preamble: Education as a Living System",
    content: [
      "Learning breaks when it becomes bureaucratic. Students drown in deadlines, unclear expectations, and fragmented tools. Teachers drown in admin work.",
      "**Zaeon** exists to simplify that chaos: AI Agents guide learners step-by-step, while educators gain a lightweight command center to manage academic workflows at scale.",
      "This is not “AI as a shortcut.” It is AI as a coach: helping students build real skills, track progress, and transform effort into measurable growth.",
      "Zaeon turns learning into progression: missions, feedback loops, skill ranks (F → SS), and adaptive challenges — a system where motivation is engineered, not hoped for.",
    ],
  },
  {
    title: "GAMIFIED LEARNING",
    subtitle: "From Confusion to Progress",
    content: [
      "Zaeon treats learning like a progression system: skills improve through missions, practice loops, and visible ranks.",
      "AI Agents break large tasks into smaller steps: read → outline → draft → revise → submit — then they measure performance and suggest the next challenge.",
      "Feedback is not generic. It is rubric-aligned, actionable, and continuous — so improvement is predictable instead of random.",
      "The goal is simple: build disciplined, independent students who understand the academic process and can replicate it.",
    ],
  },
  {
    title: "ACADEMIC PRODUCTION",
    subtitle: "Create Documents in Real Time",
    content: [
      "Zaeon is a live academic studio. Students can produce documents in real time while learning — with structure, templates, and agent guidance.",
      "Write essays, reports, abstracts, proposals, and full theses in one workflow — from the first idea to the final submission.",
      "Collaboration is built-in: co-writing, revision cycles, and clear versioning make teamwork easier for students and research groups.",
      "The platform supports academic clarity: argument structure, citation organization, and revisions that actually converge to a final result.",
    ],
  },
  {
    title: "ACADEMIC ADMINISTRATION",
    subtitle: "Made Easy for Teachers & Researchers",
    content: [
      "Teachers shouldn’t spend more time managing documents than teaching. Researchers shouldn’t spend more time coordinating than researching.",
      "Zaeon provides a lightweight academic operations layer: assignments, submissions, review cycles, rubrics, and progress tracking — all connected to the learning system.",
      "AI Agents help standardize evaluation, generate feedback drafts, and highlight patterns across a class — without replacing the educator’s judgment.",
      "The result: less bureaucracy, faster cycles, clearer expectations, and better academic outcomes.",
    ],
  },
];

// --- COMPONENTE: BOTÃO DE VOLTAR ---
const BackButton = () => (
  <Link href="/" className="fixed top-6 left-6 z-50 group">
    <motion.div
      whileHover={{ scale: 1.1, x: -5 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:border-cyan-400 group-hover:text-cyan-400 transition-colors shadow-lg"
    >
      <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
    </motion.div>
  </Link>
);

// --- COMPONENTE: FUNDO SIMPLES (STARS) ---
const SimpleStarBackground = () => (
  <div className="absolute inset-0 z-0 bg-[#030014] overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.05)_0%,_transparent_50%)] animate-pulse" style={{ animationDuration: '4s' }}></div>
    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-cyan-900/10 to-transparent"></div>
  </div>
);

// --- COMPONENTE: BOTÃO HOLOGRÁFICO ---
const HoloButton = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.05, backgroundColor: "rgba(34, 211, 238, 0.1)" } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`relative group px-4 py-2 rounded-lg border border-cyan-500/20 bg-black/40 backdrop-blur-md transition-all flex items-center gap-2 ${
      disabled ? "opacity-30 cursor-not-allowed" : "hover:border-cyan-400/50 text-cyan-400"
    }`}
  >
    {children}
  </motion.button>
);

// --- COMPONENTE: O "TABLET" COM O MANIFESTO ---
const ZaeonManifesto = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const pages = MANIFESTO_PAGES;
  const current = pages[currentPage];

  const paginate = (newDirection: number) => {
    if (currentPage + newDirection < 0 || currentPage + newDirection >= pages.length) return;
    setDirection(newDirection);
    setCurrentPage(currentPage + newDirection);
  };

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    }),
  };

  const renderContent = (paragraph: string, idx: number) => {
    // Renderiza negrito (**text**)
    const htmlContent = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300 font-bold">$1</strong>');
    
    return (
      <p
        key={idx}
        className="mb-4 last:mb-0"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  return (
    <div className={`relative w-full max-w-3xl h-[80vh] max-h-[800px] flex flex-col rounded-[24px] border transition-colors duration-500 shadow-2xl backdrop-blur-xl z-20 ${
        isDarkMode 
        ? "bg-[#0a0a0a]/80 border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.1)]" 
        : "bg-white/90 border-slate-200 shadow-xl"
    }`}>
      
      {/* HEADER DO TABLET */}
      <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? "bg-cyan-400 shadow-[0_0_8px_currentColor]" : "bg-blue-500"}`} />
            <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isDarkMode ? "text-cyan-400" : "text-slate-500"}`}>
                System Briefing // ZAEON
            </span>
        </div>
        <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-slate-100 text-slate-700"}`}
        >
            {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 relative overflow-hidden p-8 md:p-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 p-8 md:p-12 overflow-y-auto custom-scrollbar"
          >
            <div className="max-w-2xl mx-auto">
                <h1 className={`text-3xl md:text-5xl font-black mb-2 uppercase tracking-tight leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {current.title}
                </h1>
                
                <div className={`h-1 w-16 mt-6 mb-8 rounded-full ${isDarkMode ? "bg-cyan-500" : "bg-blue-500"}`} />
                
                <h2 className={`text-sm font-bold mb-8 uppercase tracking-widest ${isDarkMode ? "text-cyan-500" : "text-blue-600"}`}>
                    {current.subtitle}
                </h2>

                <div className={`text-base md:text-lg leading-relaxed font-light font-mono ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {current.content.map((p, i) => renderContent(p, i))}
                </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER / CONTROLES */}
      <div className={`p-6 border-t flex items-center justify-between ${isDarkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-slate-50/50"}`}>
        <HoloButton onClick={() => paginate(-1)} disabled={currentPage === 0}>
          <ChevronLeftIcon className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-widest uppercase hidden md:inline">PREV</span>
        </HoloButton>

        <div className="flex gap-2">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentPage 
                ? (isDarkMode ? "bg-cyan-400 w-6" : "bg-blue-600 w-6") 
                : (isDarkMode ? "bg-white/20" : "bg-slate-300")
              }`}
            />
          ))}
        </div>

        <HoloButton onClick={() => paginate(1)} disabled={currentPage === pages.length - 1}>
          <span className="text-[10px] font-bold tracking-widest uppercase hidden md:inline">NEXT</span>
          <ChevronRightIcon className="w-4 h-4" />
        </HoloButton>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function AboutPage() {
  return (
    <div className="relative w-full h-screen bg-[#030014] font-sans overflow-hidden flex flex-col">
      <BackButton />
      <SimpleStarBackground />
      
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <ZaeonManifesto />
      </div>

      {/* Global Styles para Scrollbar customizada dentro do componente */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </div>
  );
}