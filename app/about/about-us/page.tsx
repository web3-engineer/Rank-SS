"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  CpuChipIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

/**
 * ✅ Rank SS version:
 * - Removed all blockchain/crypto content and sections
 * - Replaced “Zaeon” mentions with “Rank SS”
 * - Kept only AI Agents + gamified learning + academic production + academic administration
 */

// --- SECTION 1: MANIFESTO (education + agents + real-time production) ---
const MANIFESTO_PAGES = [
  {
    title: "RANK SS MANIFESTO",
    subtitle: "Preamble: Education as a Living System",
    content: [
      "Learning breaks when it becomes bureaucratic. Students drown in deadlines, unclear expectations, and fragmented tools. Teachers drown in admin work. Researchers drown in formatting, coordination, and review cycles.",
      "Rank SS exists to simplify that chaos: AI Agents guide learners step-by-step, while educators gain a lightweight command center to manage academic workflows at scale.",
      "This is not “AI as a shortcut.” It is AI as a coach: helping students build real skills, track progress, and transform effort into measurable growth.",
      "Rank SS turns learning into progression: missions, feedback loops, skill ranks (F → SS), and adaptive challenges — a system where motivation is engineered, not hoped for.",
      "Students don’t just learn here — they produce. Rank SS is built for real-time academic production: drafting, revising, collaborating, and submitting documents in one continuous workflow.",
    ],
  },
  {
    title: "CHAPTER I: GAMIFIED LEARNING",
    subtitle: "From Confusion to Progress (F → SS)",
    content: [
      "Rank SS treats learning like a progression system: skills improve through missions, practice loops, and visible ranks.",
      "AI Agents break large tasks into smaller steps: read → outline → draft → revise → submit — then they measure performance and suggest the next challenge.",
      "Feedback is not generic. It is rubric-aligned, actionable, and continuous — so improvement is predictable instead of random.",
      "The goal is simple: build disciplined, independent students who understand the academic process and can replicate it.",
    ],
  },
  {
    title: "CHAPTER II: ACADEMIC PRODUCTION",
    subtitle: "Create Documents in Real Time",
    content: [
      "Rank SS is a live academic studio. Students can produce documents in real time while learning — with structure, templates, and agent guidance.",
      "Write essays, reports, abstracts, proposals, research notes, and full theses in one workflow — from the first idea to the final submission.",
      "Collaboration is built-in: co-writing, revision cycles, and clear versioning make teamwork easier for students and research groups.",
      "The platform supports academic clarity: argument structure, citation organization, and revisions that actually converge to a final result.",
    ],
  },
  {
    title: "CHAPTER III: ACADEMIC ADMINISTRATION",
    subtitle: "Made Easy for Teachers & Researchers",
    content: [
      "Teachers shouldn’t spend more time managing documents than teaching. Researchers shouldn’t spend more time coordinating than researching.",
      "Rank SS provides a lightweight academic operations layer: assignments, submissions, review cycles, rubrics, and progress tracking — all connected to the learning system.",
      "AI Agents help standardize evaluation, generate feedback drafts, and highlight patterns across a class — without replacing the educator’s judgment.",
      "The result: less bureaucracy, faster cycles, clearer expectations, and better academic outcomes.",
    ],
  },
];

// --- BG images (kept) ---
const BG_IMAGES = ["/assets/hero.png", "/assets/hero2.png", "/assets/hero3.png", "/assets/hero4.png", "/assets/hero5.png"];
const GLITCH_DURATION_MS = 800;
const BG_CHANGE_INTERVAL_MS = 5000;

// --- Back button ---
const BackButton = () => (
  <Link href="/" className="fixed top-6 left-6 z-50 group">
    <motion.div
      whileHover={{ scale: 1.1, x: -5 }}
      whileTap={{ scale: 0.95 }}
      className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:border-cyan-400 group-hover:text-cyan-400 transition-colors shadow-lg"
    >
      <ArrowLeftIcon className="w-6 h-6" />
    </motion.div>
  </Link>
);

// --- Section separator (cleaned label) ---
const SectionSeparator = () => (
  <div className="relative w-full h-24 flex items-center justify-center z-40 bg-[#030014] overflow-hidden">
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
    <div className="absolute w-6 h-6 border border-cyan-500/50 rotate-45 flex items-center justify-center bg-[#030014] z-10 box-content p-1">
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
    </div>
    <div className="absolute top-1/2 left-[20%] w-20 h-[1px] bg-cyan-900/50 -translate-y-2" />
    <div className="absolute top-1/2 right-[20%] w-20 h-[1px] bg-cyan-900/50 translate-y-2" />
    <div className="absolute bottom-2 text-[8px] font-mono text-cyan-900 tracking-[0.5em] uppercase">
      Section Partition // Rank SS
    </div>
  </div>
);

// --- Background glitcher (kept) ---
const BackgroundGlitcher = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setBgIndex((prev) => (prev + 1) % BG_IMAGES.length), GLITCH_DURATION_MS / 2);
      setTimeout(() => setIsGlitching(false), GLITCH_DURATION_MS);
    }, BG_CHANGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const glitchVariants = {
    hidden: { opacity: 0, x: 0, y: 0 },
    visible: {
      opacity: [0, 1, 1, 0],
      x: [0, -10, 10, -5, 5, 0],
      y: [0, 5, -5, 2, -2, 0],
      skewX: [0, 5, -5, 2, 0],
      transition: {
        duration: GLITCH_DURATION_MS / 1000,
        ease: "linear",
        times: [0, 0.1, 0.9, 1],
      },
    },
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <motion.div
        key={bgIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <Image
          src={BG_IMAGES[bgIndex]}
          alt="Rank SS Background"
          fill
          className="object-cover md:object-contain object-right opacity-90 transition-opacity duration-500"
          quality={100}
          priority
        />
      </motion.div>

      <AnimatePresence>
        {isGlitching && (
          <>
            <motion.div
              variants={glitchVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute inset-0 mix-blend-screen opacity-80 pointer-events-none"
              style={{ filter: "hue-rotate(90deg)" }}
            >
              <Image
                src={BG_IMAGES[(bgIndex + 1) % BG_IMAGES.length]}
                alt="glitch r"
                fill
                className="object-cover md:object-contain object-right translate-x-2"
              />
            </motion.div>

            <motion.div
              variants={glitchVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute inset-0 mix-blend-screen opacity-80 pointer-events-none"
              style={{ filter: "hue-rotate(-90deg)" }}
            >
              <Image src={BG_IMAGES[bgIndex]} alt="glitch b" fill className="object-cover md:object-contain object-right -translate-x-2" />
            </motion.div>

            <motion.div
              initial={{ top: "-100%" }}
              animate={{ top: "200%" }}
              transition={{ duration: 0.3, repeat: 3 }}
              className="absolute inset-0 w-full h-[20px] bg-white/20 backdrop-blur-md z-10 pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-[#030014] via-[#030014]/30 to-transparent z-20" />
    </div>
  );
};

// --- Holo button (kept) ---
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
    whileHover={!disabled ? { scale: 1.05, boxShadow: "0 0 15px rgba(34, 211, 238, 0.6)" } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`relative group px-4 py-2 rounded-lg overflow-hidden border border-cyan-500/30 bg-black/40 backdrop-blur-md transition-all ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:border-cyan-400"
    }`}
  >
    <motion.div
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="absolute left-0 right-0 h-[2px] bg-cyan-400/30 w-full -z-10 pointer-events-none"
    />
    <div className="relative z-10 text-cyan-300 flex items-center justify-center">{children}</div>
  </motion.button>
);

// --- PDA / Tech book (kept, but label + content aligned) ---
interface PDAProps {
  pages: typeof MANIFESTO_PAGES;
  label?: string;
}

const TechManifestoPDA = ({ pages, label = "Rank SS Docs" }: PDAProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const paginate = (newDirection: number) => {
    if (currentPage + newDirection < 0 || currentPage + newDirection >= pages.length) return;
    setDirection(newDirection);
    setCurrentPage(currentPage + newDirection);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      rotateY: dir > 0 ? 45 : -45,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 100, damping: 20 },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      rotateY: dir < 0 ? 45 : -45,
      scale: 0.9,
      transition: { duration: 0.3 },
    }),
  };

  const containerTheme = isDarkMode ? "bg-blue-950/30 border-cyan-500/30" : "bg-white/80 border-slate-300";
  const pageTheme = isDarkMode
    ? "bg-blue-950/50 text-cyan-50 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
    : "bg-[#f4f4f9] text-slate-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] border border-slate-200";

  const titleColor = isDarkMode ? "text-white" : "text-black";
  const subtitleColor = isDarkMode ? "text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" : "text-blue-600";

  const current = pages[currentPage];

  const renderContent = (paragraph: string, idx: number) => {
    if (paragraph.startsWith("- ")) {
      return (
        <li key={idx} className="ml-4 list-disc marker:text-cyan-500 pl-2">
          <span
            dangerouslySetInnerHTML={{
              __html: paragraph.replace("- ", "").replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>'),
            }}
          />
        </li>
      );
    }

    return (
      <p
        key={idx}
        dangerouslySetInnerHTML={{
          __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>'),
        }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className={`relative w-full max-w-2xl h-[85vh] max-h-[1000px] rounded-[2.5rem] border-2 backdrop-blur-xl overflow-hidden flex flex-col transition-colors duration-500 z-30 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ${containerTheme}`}
    >
      {isDarkMode && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-[2rem] border-2 border-cyan-400/30 pointer-events-none -z-10 blur-sm"
        />
      )}

      {/* Header */}
      <div className={`flex-none flex items-center justify-between p-6 border-b z-20 relative ${isDarkMode ? "border-cyan-500/20" : "border-slate-200"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${isDarkMode ? "bg-cyan-400" : "bg-blue-500"}`} />
          <span className={`text-xs uppercase tracking-widest font-bold ${isDarkMode ? "text-cyan-400" : "text-slate-500"}`}>{label}</span>
        </div>
        <HoloButton onClick={toggleTheme}>{isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}</HoloButton>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden perspective-1000">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`absolute inset-4 md:inset-6 rounded-2xl overflow-y-auto overflow-x-hidden flex flex-col justify-start pt-8 px-6 md:px-10 pb-32 transition-colors duration-500 ${pageTheme}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="relative z-10 mb-8">
              <h1 className={`text-3xl md:text-5xl font-black mb-2 uppercase tracking-tight leading-tight transition-colors duration-500 ${titleColor}`}>
                {current.title}
              </h1>
              <div className={`h-1 w-20 mt-4 rounded-full ${isDarkMode ? "bg-cyan-500" : "bg-blue-500"}`} />
            </div>

            <h2 className={`text-lg font-bold mb-8 uppercase tracking-widest ${subtitleColor}`}>{current.subtitle}</h2>

            <div className="space-y-6 text-lg md:text-xl leading-relaxed font-light font-mono pb-10">
              {current.content.map((p, i) => renderContent(p, i))}
            </div>

            <div className={`mt-auto pt-10 text-xs font-bold ${isDarkMode ? "text-cyan-600" : "text-slate-400"}`}>
              PAGE {currentPage + 1} / {pages.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className={`flex-none p-6 border-t flex items-center justify-between z-20 relative ${isDarkMode ? "border-cyan-500/20 bg-black/40" : "border-slate-200 bg-slate-50"}`}>
        <HoloButton onClick={() => paginate(-1)} disabled={currentPage === 0}>
          <ChevronLeftIcon className="w-6 h-6" />
          <span className="ml-2 text-xs font-bold hidden md:inline tracking-widest uppercase">Prev</span>
        </HoloButton>

        <div className="flex gap-2">
          {pages.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: i === currentPage ? (isDarkMode ? "#22d3ee" : "#3b82f6") : isDarkMode ? "#164e63" : "#cbd5e1",
                scale: i === currentPage ? 1.2 : 1,
              }}
              className="w-2 h-2 rounded-full transition-colors"
            />
          ))}
        </div>

        <HoloButton onClick={() => paginate(1)} disabled={currentPage === pages.length - 1}>
          <span className="mr-2 text-xs font-bold hidden md:inline tracking-widest uppercase">Next</span>
          <ChevronRightIcon className="w-6 h-6" />
        </HoloButton>
      </div>
    </motion.div>
  );
};

// --- Mechanical arm gadgets (kept, texts aligned to Rank SS) ---
interface MechanicalArmData {
  id: string;
  label: string;
  items: Array<{
    label: string;
    score?: number;
    rank?: string;
    type: "good" | "bad" | "improve";
  }>;
}

const MechanicalArmGadget = ({
  data,
  isOpen,
  onToggle,
}: {
  data: MechanicalArmData;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const tray1Variants = {
    closed: { x: 0, opacity: 0, scale: 0.8, pointerEvents: "none" as const },
    open: { x: -230, opacity: 1, scale: 1, pointerEvents: "auto" as const, transition: { type: "spring", stiffness: 120, damping: 15 } },
  };

  const tray2Variants = {
    closed: { x: 0, y: 0, opacity: 0, scale: 0.8, pointerEvents: "none" as const },
    open: { x: -230, y: 85, opacity: 1, scale: 1, pointerEvents: "auto" as const, transition: { type: "spring", stiffness: 120, damping: 15, delay: 0.1 } },
  };

  const getBarColor = (type: string) => (type === "good" ? "bg-emerald-400" : type === "bad" ? "bg-red-500" : "bg-yellow-400");
  const getRankColor = (type: string) => (type === "good" ? "text-cyan-300" : type === "bad" ? "text-red-500" : "text-yellow-400");

  return (
    <div className="relative mb-6 z-50 flex justify-end">
      {/* Tray 1 */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={tray1Variants}
        className="absolute top-0 left-0 w-48 border p-3 rounded-lg backdrop-blur-xl origin-left z-40 bg-black/90 border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute top-1/2 -left-6 w-6 h-[1px] bg-cyan-500/50" />

        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-cyan-500">{data.items[0].label}</span>
          <CpuChipIcon className="w-3 h-3 text-cyan-200" />
        </div>

        <div className="h-1 w-full bg-blue-900/30 rounded overflow-hidden relative">
          <motion.div className={`h-full ${getBarColor(data.items[0].type)}`} initial={{ width: 0 }} animate={{ width: isOpen ? `${data.items[0].score}%` : 0 }} transition={{ duration: 1, delay: 0.2 }} />
        </div>

        <div className="flex justify-between mt-1 text-[9px] font-mono text-gray-400">
          <span>SCORE</span>
          <span className="text-white">{data.items[0].score}%</span>
        </div>
      </motion.div>

      {/* Tray 2 */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={tray2Variants}
        className="absolute top-0 left-0 w-48 border p-3 rounded-lg backdrop-blur-xl origin-left z-50 bg-black/90 border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute -top-[85px] left-6 w-[1px] h-[85px] bg-cyan-500/20" />

        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-cyan-500">EVALUATION</span>
          <span className={`text-xl font-black italic ${getRankColor(data.items[0].type)}`}>{data.items[0].rank}</span>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[8px] py-1 text-cyan-200 hover:text-white uppercase transition-colors rounded">
            Details
          </button>
          <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[8px] py-1 text-red-300 hover:text-white uppercase transition-colors rounded">
            Reset
          </button>
        </div>
      </motion.div>

      {/* Hub */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.15, boxShadow: "0 0 25px rgba(34, 211, 238, 0.6)" }}
        whileTap={{ scale: 0.95 }}
        className={`relative z-[60] w-12 h-12 rounded-lg border flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
          isOpen ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : "bg-black/60 border-gray-700 hover:border-cyan-400 hover:bg-cyan-900/20"
        }`}
      >
        <div className={`w-3 h-3 rounded-full ${isOpen ? "bg-cyan-400 animate-ping" : "bg-gray-500"}`} />
        <span className="absolute -bottom-4 right-0 text-[9px] font-mono text-cyan-500/70 whitespace-nowrap">{data.label}</span>
      </motion.button>
    </div>
  );
};

// --- Agents section (copy aligned to README) ---
const AgentSection = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const gadgets: MechanicalArmData[] = [
    { id: "g1", label: "LOGIC", items: [{ label: "Reasoning", score: 92, rank: "SS", type: "good" }] },
    { id: "g2", label: "WRITE", items: [{ label: "Academic Writing", score: 85, rank: "S", type: "good" }] },
    { id: "g3", label: "FOCUS", items: [{ label: "Discipline", score: 45, rank: "C", type: "bad" }] },
    { id: "g4", label: "RESEARCH", items: [{ label: "Method & Sources", score: 78, rank: "A", type: "improve" }] },
  ];

  return (
    <section className="sticky top-0 h-screen w-full flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 lg:p-24 overflow-hidden z-10 border-t border-gray-900">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/agents.png" alt="Rank SS Agents" fill className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/30 to-[#030014]/10" />
      </div>

      {/* Left */}
      <div className="relative z-10 w-full lg:w-auto lg:max-w-sm mb-16 lg:mb-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderColor: "rgba(34, 211, 238, 0.5)",
            boxShadow: "0 0 30px rgba(34, 211, 238, 0.15)",
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-[1.5rem] bg-black/20 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all"
        >
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 mb-4 drop-shadow-md group-hover:to-cyan-300 transition-all">
            GAMIFIED<br />AI COACH
          </h2>

          <p className="text-sm text-white font-light leading-relaxed mb-4 group-hover:text-cyan-50 transition-colors">
            In <strong className="text-cyan-400 font-bold">Rank SS</strong>, AI Agents guide learning through missions and evaluate progress using clear rubrics and feedback loops.
          </p>

          <p className="text-xs text-white font-mono leading-relaxed border-l border-cyan-500/50 pl-3 group-hover:border-cyan-400 transition-colors">
            Every interaction can improve a skill. Ranks go from F to SS — learning becomes visible progression, not guesswork.
          </p>
        </motion.div>
      </div>

      {/* Right */}
      <div className="relative z-10 w-full lg:w-auto flex flex-col items-end gap-4 pr-4 lg:pr-8">
        <div className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-[0.3em] mb-4 text-right border-b border-cyan-900/30 pb-2 w-40">
          Student Progress
        </div>

        {gadgets.map((g, idx) => (
          <motion.div key={g.id} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
            <MechanicalArmGadget data={g} isOpen={openId === g.id} onToggle={() => toggle(g.id)} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- MAIN PAGE (removed blockchain section entirely) ---
export default function TechnicalAboutPage() {
  return (
    <div className="relative w-full bg-[#030014] font-sans overflow-x-hidden">
      <BackButton />

      {/* Section 1: PDA */}
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center bg-[#030014] z-20">
        <BackgroundGlitcher />
        <div className="relative z-30 flex-1 flex items-center justify-start p-6 md:p-12 lg:p-24">
          <TechManifestoPDA pages={MANIFESTO_PAGES} label="Rank SS Field Notes" />
        </div>
      </div>

      <SectionSeparator />

      {/* Section 2: Agents */}
      <AgentSection />

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}