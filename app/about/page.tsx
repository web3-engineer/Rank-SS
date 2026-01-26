"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import MacSplash from "@/components/ui/MacSplash";

// --- SCRAMBLE TEXT (mantido, simplificado) ---
const CHAR_POOL = ["紀", "律", "知", "識", "未", "来", "革", "新", "卓", "越", "智", "慧", "教", "育"];

function useScrambleText(targetText: string, start: boolean) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const stateRef = useRef<"idle" | "scrambling" | "resolving" | "holding">("idle");
  const lastStateChangeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(
    (ts: number) => {
      if (!start) return;
      if (!lastStateChangeRef.current) lastStateChangeRef.current = ts;

      const elapsed = ts - lastStateChangeRef.current;

      if (stateRef.current === "idle") {
        stateRef.current = "scrambling";
        lastStateChangeRef.current = ts;
      }

      if (stateRef.current === "scrambling") {
        if (elapsed >= 1400) {
          stateRef.current = "resolving";
          lastStateChangeRef.current = ts;
        } else {
          setDisplayText(
            targetText
              .split("")
              .map((c) => (c === " " ? " " : CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]))
              .join("")
          );
        }
      }

      if (stateRef.current === "resolving") {
        const progress = Math.min(elapsed / 900, 1);
        const resolved = targetText
          .split("")
          .map((char, i) =>
            i < Math.floor(targetText.length * progress)
              ? char
              : char === " "
                ? " "
                : CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]
          )
          .join("");

        setDisplayText(resolved);

        if (progress === 1) {
          stateRef.current = "holding";
          lastStateChangeRef.current = ts;
          setIsComplete(true);
        }
      }

      if (stateRef.current === "holding") {
        if (elapsed >= 1800) {
          stateRef.current = "scrambling";
          lastStateChangeRef.current = ts;
          setIsComplete(false);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [start, targetText]
  );

  useEffect(() => {
    if (start) rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, start]);

  return { displayText, isComplete };
}

// --- UI bits ---
function CyberTitle({
  mainText,
  secondaryText,
  scrollText,
  startAnimations,
}: {
  mainText: string;
  secondaryText: string;
  scrollText: string;
  startAnimations: boolean;
}) {
  const { displayText: sText, isComplete: sDone } = useScrambleText(secondaryText, startAnimations);
  const { displayText: mText, isComplete: mDone } = useScrambleText(mainText, startAnimations);

  return (
    <div className="text-center mb-16 relative z-20 min-h-[200px] flex flex-col justify-center">
      <h2 className="text-lg md:text-2xl font-medium tracking-[0.3em] mb-3 font-mono uppercase h-8">
        <span className={`${sDone ? "text-cyan-400/90" : "text-white/40"} transition-all duration-700`}>
          {sText}
        </span>
      </h2>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white font-mono uppercase h-24">
        <span className={`${mDone ? "text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]" : "text-white/20"}`}>
          {mText}
        </span>
      </h1>

      <div className="mt-10 flex flex-col items-center gap-3">
        <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.5em] animate-pulse">
          {scrollText}
        </span>
        <ChevronDownIcon className="w-5 h-5 text-cyan-500/70" />
      </div>
    </div>
  );
}

function TextBlock({
  children,
  align = "left",
  glow = "cyan",
  direction = "none",
  bg = "bg-black/70",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  glow?: "cyan" | "purple";
  direction?: "left" | "right" | "none";
  bg?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-15% 0px" });

  const alignClass =
    align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right ml-auto" : "items-center text-center mx-auto";

  const xInitial = direction === "left" ? -120 : direction === "right" ? 120 : 0;
  const yInitial = direction === "none" ? 45 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xInitial, y: yInitial }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: xInitial, y: yInitial }}
      transition={{ type: "spring", stiffness: 55, damping: 18 }}
      className={`flex flex-col ${alignClass} max-w-4xl w-full p-10 rounded-[2.5rem]
                  backdrop-blur-xl ${bg} border border-white/10 shadow-2xl relative overflow-hidden
                  ${glow === "cyan" ? "hover:border-cyan-500/40" : "hover:border-purple-500/40"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-black/20" />
      <div className="relative z-10 space-y-6 text-white leading-relaxed font-light text-lg md:text-xl">
        {children}
      </div>
    </motion.div>
  );
}

export default function AboutUsPage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !i18n.isInitialized) return <MacSplash minDurationMs={900} />;

  return (
    <div className="relative min-h-[220vh] bg-[#030014] overflow-hidden font-sans z-[200]">
      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="fixed top-28 left-10 z-[300] flex items-center gap-3 text-white/40 hover:text-cyan-400 group"
      >
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-xl bg-white/5 transition-all shadow-xl">
          <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-black opacity-0 group-hover:opacity-100 transition-all">
          {t("about.back")}
        </span>
      </button>

      {/* Background */}
      <div className="fixed inset-0 z-[190]">
        <Image
          src="/about/about-us-room.png"
          alt="Rank SS learning environment"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#030014] via-[#030014]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-[210] flex flex-col items-center pt-[32vh] pb-[28vh] px-6 gap-[16vh]">
        <CyberTitle
          startAnimations={true}
          secondaryText={t("about.title_secondary")}
          mainText={t("about.title_main")}
          scrollText={t("about.scroll_down")}
        />

        {/* Card 1 */}
        <TextBlock align="left" glow="cyan" bg="bg-black/80">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight uppercase flex items-center gap-4">
            <span className="w-2 h-10 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_18px_rgba(34,211,238,0.5)]" />
            {t("about.genesis.title")}
          </h2>
          <p className="font-medium text-white/95">{t("about.genesis.p1")}</p>
          <p className="text-white/80">
            {t("about.genesis.p2")}{" "}
            <span className="text-cyan-400 font-bold">{t("about.genesis.p2_highlight")}</span>
          </p>
        </TextBlock>

        {/* Card 2 */}
        <TextBlock align="right" glow="purple" direction="right" bg="bg-indigo-950/80">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight uppercase flex items-center justify-end gap-4">
            {t("about.mission.title")}
            <span className="w-2 h-10 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full shadow-[0_0_18px_rgba(168,85,247,0.5)]" />
          </h2>
          <p className="text-xl md:text-3xl font-extralight italic text-white drop-shadow-md">
            {t("about.mission.p1")}
          </p>
          <p className="text-base text-white/70 mt-4 leading-relaxed">{t("about.mission.p2")}</p>
        </TextBlock>

        {/* CTA */}
        <div className="text-center relative z-40 pb-[10vh]">
          <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter opacity-90">
            {t("about.cta.tour_title")}
          </h2>
          <button
            onClick={() => window.location.assign("/about/about-us")}
            className="group relative px-14 md:px-20 py-7 bg-black/40 border border-cyan-500/30 text-white font-black text-lg md:text-xl uppercase tracking-[0.3em] overflow-hidden hover:scale-105 transition-all duration-500 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/40 via-cyan-500/40 to-blue-600/40 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <span className="relative z-10 group-hover:text-cyan-100 transition-all">{t("about.cta.button_go")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}