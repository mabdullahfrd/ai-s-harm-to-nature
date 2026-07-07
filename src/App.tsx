import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Globe, HelpCircle, ArrowDown, Leaf, Info } from "lucide-react";
import EditorialPanel from "./components/EditorialPanel";
import InteractiveCalculator from "./components/InteractiveCalculator";
import PromptAuditor from "./components/PromptAuditor";

export default function App() {
  const [activeTab, setActiveTab] = useState<"pillars" | "simulator" | "auditor">("pillars");
  const videoRef = useRef<HTMLVideoElement>(null);
  const frostOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Setup video properties for smooth, high-performance forward playback
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    let rafId: number;

    const updateLoop = () => {
      if (!video) return;

      const t = video.currentTime;
      const d = video.duration;

      let opacity = 0;
      if (d && d > 0) {
        // We trigger a high-quality "frost blur transition" 0.8s before the video loops
        // and hold it/fade it out during the first 0.8s of the next loop cycle.
        const transitionWindow = 0.8; 
        if (t >= d - transitionWindow) {
          opacity = (t - (d - transitionWindow)) / transitionWindow;
        } else if (t <= transitionWindow) {
          opacity = 1 - (t / transitionWindow);
        }
      }

      // Bound opacity exactly between 0 and 1
      opacity = Math.max(0, Math.min(1, opacity));

      // Direct DOM manipulation for maximum 60FPS performance without React-state render lags
      if (frostOverlayRef.current) {
        frostOverlayRef.current.style.opacity = opacity.toString();
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    // Single click/touch fallback to ensure autoplay policy constraints are satisfied gracefully
    const startPlayback = () => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
      document.removeEventListener("click", startPlayback);
      document.removeEventListener("touchstart", startPlayback);
    };

    video.play()
      .then(() => {
        rafId = requestAnimationFrame(updateLoop);
      })
      .catch((err) => {
        console.log("Autoplay waiting for user gesture:", err);
        document.addEventListener("click", startPlayback);
        document.addEventListener("touchstart", startPlayback);
        rafId = requestAnimationFrame(updateLoop);
      });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", startPlayback);
      document.removeEventListener("touchstart", startPlayback);
    };
  }, []);

  const handleTabChange = (tab: "pillars" | "simulator" | "auditor") => {
    setActiveTab(tab);
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(() => {});
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "pillars":
        return <EditorialPanel key="pillars" />;
      case "simulator":
        return <InteractiveCalculator key="simulator" />;
      case "auditor":
        return <PromptAuditor key="auditor" />;
      default:
        return <EditorialPanel key="pillars" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0c110c] text-white font-sans overflow-x-hidden selection:bg-white selection:text-neutral-950" id="main-container">
      {/* Background Video with subtle overlay filters - Fixed to keep it still relative to scroll */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0" id="bg-video-container">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260520_111942_8fc50f9e-4dfd-45c1-81bb-d93342a23d87.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-95 transform-gpu"
          style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }}
        />
        {/* Seamless Frost Loop Overlay */}
        <div
          ref={frostOverlayRef}
          className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[24px] pointer-events-none"
          style={{ opacity: 0, willChange: "opacity" }}
        />
        {/* Lighter, softer vignette overlay so the video is clearly visible but white text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-neutral-950/30 to-neutral-950/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/50" />
        
        {/* Ambient lighting glows (Frosted Glass Theme) - Made more transparent */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-glow-green blur-[100px] opacity-40" />
        <div className="absolute top-[25%] right-[-10%] w-[70%] h-[70%] rounded-full bg-glow-amber blur-[120px] opacity-30" />
        <div className="absolute bottom-[-10%] left-[15%] w-[60%] h-[60%] rounded-full bg-glow-moss blur-[100px] opacity-40" />
      </div>

      {/* Main Container - Framed by a gentle moving transition */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col min-h-screen justify-between" id="content-overlay">
        {/* Header Section - Elegantly slides down */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-b border-white/10 pb-6 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6" 
          id="app-header"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-400">
              <Leaf className="w-3.5 h-3.5 text-emerald-500/80" id="leaf-header-icon" />
              <span className="font-mono text-[9px] tracking-widest uppercase text-emerald-400/80">
                A Systemic Ecological Investigation
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl md:text-3xl font-light tracking-tight text-neutral-100 flex items-center gap-3">
                AI & Nature's Cost
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav 
            className="flex bg-white/[0.03] p-1 rounded-lg border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]" 
            id="app-nav"
          >
            <button
              id="nav-btn-pillars"
              onClick={() => handleTabChange("pillars")}
              className={`px-4 py-2 rounded-md font-mono text-[10px] tracking-wider uppercase transition-all duration-300 relative ${
                activeTab === "pillars" ? "text-neutral-950" : "text-neutral-400 hover:text-white"
              }`}
            >
              {activeTab === "pillars" && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-white rounded-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 font-medium">01 // The Pillars</span>
            </button>
            <button
              id="nav-btn-simulator"
              onClick={() => handleTabChange("simulator")}
              className={`px-4 py-2 rounded-md font-mono text-[10px] tracking-wider uppercase transition-all duration-300 relative ${
                activeTab === "simulator" ? "text-neutral-950" : "text-neutral-400 hover:text-white"
              }`}
            >
              {activeTab === "simulator" && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-white rounded-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 font-medium">02 // Simulator</span>
            </button>
            <button
              id="nav-btn-auditor"
              onClick={() => handleTabChange("auditor")}
              className={`px-4 py-2 rounded-md font-mono text-[10px] tracking-wider uppercase transition-all duration-300 relative ${
                activeTab === "auditor" ? "text-neutral-950" : "text-neutral-400 hover:text-white"
              }`}
            >
              {activeTab === "auditor" && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-white rounded-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 font-medium">03 // Prompt Auditor</span>
            </button>
          </nav>
        </motion.header>

        {/* Hero Prose Area - Staggered entry */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-12 border-b border-white/5 pb-10 max-w-4xl" 
          id="hero-prose"
        >
          <div>
            <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase mb-3">
              THE PHYSICAL REALITY OF COGNITIVE COMPUTATION
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-neutral-100 leading-tight tracking-tight">
              Behind the frictionless facade of artificial intelligence lies a material world of gas grids, boiling river basins, and intensive silicon extraction.
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 text-neutral-400 text-xs font-light leading-relaxed">
              <span className="flex items-center gap-1.5 text-amber-500 font-mono text-[10px] uppercase tracking-wider bg-amber-950/20 border border-amber-500/20 px-2.5 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3" /> Critical Ecological Alert
              </span>
              <span>Every single token generated represents physical heat radiated, carbon released, and pure freshwater evaporated.</span>
            </div>
          </div>
        </motion.section>

        {/* Active Content Layout with AnimatePresence */}
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-grow mb-12" 
          id="main-content-view"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </motion.main>

        {/* Informative Footer */}
        <motion.footer 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" 
          id="app-footer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" id="live-indicator-dot" />
              <p className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
                System Active // Ecological Audit Model 2026
              </p>
            </div>
            <p className="text-[11px] text-neutral-500 font-light leading-normal max-w-md">
              A documentary investigation tracking generative computing's expansion across national power grids, local river cooling sheds, and toxic hardware lifecycles.
            </p>
          </div>

          <div className="flex gap-4 font-mono text-[10px] text-neutral-500" id="footer-system-telemetry">
            <div className="text-left">
              <span className="block text-neutral-400 uppercase">CONTAINER STATUS</span>
              <span>GRID STABILITY OK</span>
            </div>
            <div className="text-left border-l border-white/10 pl-4">
              <span className="block text-neutral-400 uppercase">EMISSIONS INDEX</span>
              <span>0.42g CO2/Wh avg</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
