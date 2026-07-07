import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Droplet, Cpu, Leaf, ChevronRight, AlertTriangle } from "lucide-react";
import { EDUCATIONAL_TOPICS } from "../data";
import { EducationalTopic } from "../types";

export default function EditorialPanel() {
  const [selectedId, setSelectedId] = useState<string>("energy");

  const currentTopic = EDUCATIONAL_TOPICS.find((t) => t.id === selectedId) || EDUCATIONAL_TOPICS[0];

  const getIcon = (name: string, className: string) => {
    switch (name) {
      case "Zap":
        return <Zap className={className} id="icon-zap" />;
      case "Droplet":
        return <Droplet className={className} id="icon-droplet" />;
      case "Cpu":
        return <Cpu className={className} id="icon-cpu" />;
      case "Leaf":
        return <Leaf className={className} id="icon-leaf" />;
      default:
        return <Zap className={className} id="icon-default" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white" id="editorial-panel">
      {/* Sidebar - Topic Selectors */}
      <div className="lg:col-span-4 space-y-4" id="editorial-sidebar">
        <div className="border-b border-white/10 pb-4 mb-6">
          <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            ECOLOGICAL AUDITING
          </p>
          <h2 className="font-serif text-3xl font-normal mt-1 tracking-tight">
            The Pillars of Harm
          </h2>
        </div>

        <div className="space-y-2">
          {EDUCATIONAL_TOPICS.map((topic, idx) => {
            const isSelected = topic.id === selectedId;
            return (
              <button
                key={topic.id}
                id={`topic-btn-${topic.id}`}
                onClick={() => setSelectedId(topic.id)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 relative overflow-hidden flex items-center justify-between border ${
                  isSelected
                    ? "border-white/25 bg-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] backdrop-blur-xl"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-white/30">0{idx + 1}</span>
                  <div>
                    <h3 className="font-sans font-medium text-sm text-neutral-100">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1 font-light">
                      {topic.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getIcon(topic.iconName, `w-4 h-4 ${isSelected ? "text-white" : "text-neutral-400"}`)}
                  <ChevronRight className={`w-3 h-3 text-neutral-500 transition-transform ${isSelected ? "rotate-90 text-white" : ""}`} />
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-lg p-4 mt-6 shadow-inner">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" id="alert-icon" />
            <div>
              <h4 className="font-sans font-medium text-xs text-neutral-200">
                Hidden Infrastructures
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                Every calculation we execute triggers a complex global supply chain spanning rare-earth open-pit mines, local aquifers, and coal-fired high-baseload utility grids.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Display Panel */}
      <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-xl p-6 lg:p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden" id="editorial-main-panel">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTopic.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
            id={`editorial-content-${currentTopic.id}`}
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getIcon(currentTopic.iconName, "w-5 h-5 text-white/80")}
                <span className="font-mono text-xs tracking-wider uppercase text-neutral-400">
                  {currentTopic.subtitle}
                </span>
              </div>
              <h1 className="font-serif text-3xl lg:text-4xl font-normal tracking-tight text-neutral-100">
                {currentTopic.title}
              </h1>
            </div>

            {/* Impact Metric Hero */}
            <div className={`p-5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-inner shadow-black/20 ${currentTopic.colorTheme}`} id="impact-metric-box">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  CRITICAL THRESHOLD
                </span>
                <p className="font-serif text-3xl lg:text-4xl font-semibold tracking-tight leading-none">
                  {currentTopic.impactMetric}
                </p>
              </div>
              <div className="sm:max-w-xs text-left">
                <p className="text-xs font-light text-neutral-300 leading-relaxed">
                  {currentTopic.metricLabel}
                </p>
              </div>
            </div>

            {/* Summary */}
            <p className="font-serif text-lg text-neutral-200 leading-relaxed italic border-l-2 border-white/20 pl-4 py-1">
              "{currentTopic.summary}"
            </p>

            {/* Detailed Points */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h4 className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
                Systemic Ecological Impact
              </h4>
              <ul className="space-y-4">
                {currentTopic.details.map((detail, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-sm leading-relaxed text-neutral-300">
                    <span className="font-mono text-xs text-neutral-500 mt-1">0{idx + 1}.</span>
                    <span className="font-light">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footnote */}
        <div className="border-t border-white/10 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] text-neutral-500 font-mono" id="editorial-footer">
          <span>Source: IPCC & Independent Digital Infrastructure Audits</span>
          <span>Sustained Peak Thermal Density // AI-Grid Model</span>
        </div>
      </div>
    </div>
  );
}
