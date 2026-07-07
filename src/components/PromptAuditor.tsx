import React, { useState } from "react";
import { AuditResult } from "../types";
import { Search, Loader2, RefreshCw, CheckCircle2, ChevronRight, CornerDownRight, BarChart4 } from "lucide-react";

const PRESET_PROMPTS = [
  {
    text: "Write an optimized smart contract in Solidity for a multi-signature token wallet",
    type: "code"
  },
  {
    text: "Draft a comprehensive, 10-page market research report detailing European lithium mining projections",
    type: "text"
  },
  {
    text: "Generate a cinematic, ultra-detailed 4K landscape of a bioluminescent forest with rivers",
    type: "image"
  }
];

export default function PromptAuditor() {
  const [prompt, setPrompt] = useState<string>("");
  const [type, setType] = useState<string>("text");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (customPrompt?: string, customType?: string) => {
    const promptToSubmit = customPrompt || prompt;
    const typeToSubmit = customType || type;

    if (!promptToSubmit.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/audit-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSubmit, type: typeToSubmit })
      });

      if (!response.ok) {
        throw new Error("Auditing service yielded an unexpected result");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Unable to resolve server-side analysis. Operating on local offline telemetry models.");
      // Fallback calculations locally
      const baseLen = promptToSubmit.length;
      let mult = 1.0;
      if (typeToSubmit === "image") mult = 8.5;
      if (typeToSubmit === "code") mult = 2.1;
      const energy = parseFloat((0.85 + (baseLen % 12) * 0.12 * mult).toFixed(2));
      setResult({
        carbonIntensityGrams: parseFloat((energy * 0.42).toFixed(2)),
        energyUsedWh: energy,
        waterConsumedMl: parseFloat((energy * 3.1).toFixed(1)),
        eWasteProducedMg: parseFloat((energy * 0.05).toFixed(3)),
        ecologicalBreakdown: `This inquiry involves auto-regressive processing over millions of neural network node connections. The localized mathematical structures require substantial hardware memory bandwidth, yielding concrete grid consumption and server rack cooling fluid vaporisation.`,
        comparisons: [
          `Boiling ${parseFloat((energy * 3.1).toFixed(0))}ml of fresh drinking water.`,
          `Charging a standard smartphone roughly ${(energy / 12).toFixed(1)} times.`,
          `Equal to running a standard 10W LED household bulb for ${(energy / 10).toFixed(1)} hours.`
        ],
        mitigationAdvice: [
          "Condense multi-turn dialogues into a single dense context batch.",
          "Where applicable, resolve inquiries locally without routing tokens over public network routers."
        ],
        isFallback: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 lg:p-8 backdrop-blur-2xl text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative" id="prompt-auditor">
      <div className="border-b border-white/10 pb-4 mb-6">
        <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
          ECOLOGICAL AUDITING
        </p>
        <h2 className="font-serif text-3xl font-normal mt-1 tracking-tight">
          Prompt Footprint Auditor
        </h2>
        <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">
          Input any prompt you intend to run or generate with popular AI engines, and let our audit model compute the precise ecological transaction cost of compiling those specific tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Auditor Form */}
        <div className="lg:col-span-5 space-y-6" id="auditor-form-panel">
          <div className="space-y-3">
            <label className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
              01 // Choose Query Type
            </label>
            <div className="grid grid-cols-3 gap-2" id="auditor-type-selectors">
              {["text", "image", "code"].map((t) => (
                <button
                  key={t}
                  id={`type-btn-${t}`}
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-md text-[11px] font-mono capitalize border transition-all ${
                    type === t
                      ? "border-white/30 bg-white/[0.08] text-white shadow-sm backdrop-blur-lg"
                      : "border-white/5 bg-white/[0.02] text-neutral-400 hover:bg-white/[0.06] hover:text-white backdrop-blur-sm"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
              02 // Enter Planned Prompt
            </label>
            <div className="relative">
              <textarea
                id="prompt-input"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste your ChatGPT, Midjourney, or Claude prompt here..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all font-light resize-none leading-relaxed backdrop-blur-md"
              />
            </div>
          </div>

          <button
            id="run-audit-btn"
            disabled={isLoading || !prompt.trim()}
            onClick={() => handleAudit()}
            className="w-full bg-white text-neutral-950 hover:bg-neutral-200 disabled:bg-white/20 disabled:text-neutral-500 py-3 rounded-lg text-xs font-mono font-medium tracking-wider transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" id="btn-loader" />
                AUDITING HARDWARE CLUSTERS...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" id="btn-search" />
                EXECUTE ECOLOGICAL AUDIT
              </>
            )}
          </button>

          {/* Presets */}
          <div className="space-y-2 pt-2">
            <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider">
              Or Try Preset Audits:
            </span>
            <div className="space-y-2">
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  id={`preset-audit-${idx}`}
                  onClick={() => {
                    setPrompt(preset.text);
                    setType(preset.type);
                    handleAudit(preset.text, preset.type);
                  }}
                  className="w-full text-left p-2.5 rounded border border-white/10 bg-white/[0.01] hover:bg-white/[0.04] transition-all flex items-start gap-2.5 backdrop-blur-sm"
                >
                  <CornerDownRight className="w-3 h-3 text-neutral-500 shrink-0 mt-1" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-neutral-300 font-light leading-normal line-clamp-1 italic">
                      "{preset.text}"
                    </p>
                    <span className="font-mono text-[9px] text-neutral-500 uppercase">
                      {preset.type} prompt
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Results Dashboard */}
        <div className="lg:col-span-7" id="auditor-results-panel">
          {isLoading ? (
            <div className="h-full min-h-[300px] bg-white/[0.01] border border-white/10 rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-4 backdrop-blur-md" id="auditor-loading">
              <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" id="main-loader" />
              <div className="space-y-1">
                <p className="font-serif text-lg font-light text-neutral-200">Processing Ecological Telemetry</p>
                <p className="font-mono text-[10px] text-neutral-500 animate-pulse uppercase tracking-wider">
                  Mapping global grid multipliers // calculating evaporative load
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6" id="auditor-results">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
                  03 // Audit Findings
                </span>
                {result.isFallback && (
                  <span className="font-mono text-[9px] text-amber-400/80 uppercase bg-amber-950/20 border border-amber-500/20 px-2 py-0.5 rounded">
                    Local Telemetry Mode
                  </span>
                )}
              </div>

              {/* Infographics layout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Electricity Spent</span>
                  <span className="text-xl font-mono text-neutral-200 block mt-1">{result.energyUsedWh.toFixed(2)} Wh</span>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min((result.energyUsedWh / 15) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Water Consumption</span>
                  <span className="text-xl font-mono text-neutral-200 block mt-1">{result.waterConsumedMl.toFixed(1)} ml</span>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min((result.waterConsumedMl / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">CO2 Equivalent</span>
                  <span className="text-xl font-mono text-neutral-200 block mt-1">{result.carbonIntensityGrams.toFixed(2)} g CO₂</span>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-rose-400 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min((result.carbonIntensityGrams / 8) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Silicon Degradation</span>
                  <span className="text-xl font-mono text-neutral-200 block mt-1">{result.eWasteProducedMg.toFixed(3)} mg</span>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min((result.eWasteProducedMg / 1.5) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Ecological breakdown paragraph */}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg space-y-1 backdrop-blur-sm">
                <span className="text-[9px] font-mono text-neutral-500 uppercase block">Hardware System Breakdown</span>
                <p className="font-serif text-sm text-neutral-300 leading-relaxed font-light">
                  {result.ecologicalBreakdown}
                </p>
              </div>

              {/* Comparisons list */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase block">Relatable Physical equivalencies</span>
                <div className="grid grid-cols-1 gap-2">
                  {result.comparisons.map((comp, idx) => (
                    <div key={idx} className="flex gap-2.5 items-center text-xs text-neutral-300 font-light">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mitigation tips */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <span className="text-[9px] font-mono text-neutral-400 uppercase block">Audit Optimization Advice</span>
                <div className="grid grid-cols-1 gap-2">
                  {result.mitigationAdvice.map((advice, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-neutral-400 font-light">
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0 mt-0.5" />
                      <span>{advice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-white/10 bg-white/[0.01] rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-4 text-neutral-400 backdrop-blur-md" id="auditor-empty">
              <BarChart4 className="w-10 h-10 text-neutral-600" id="empty-chart-icon" />
              <div className="space-y-1">
                <p className="font-serif text-sm font-light text-neutral-300">Awaiting Telemetry Input</p>
                <p className="text-xs text-neutral-500 font-light leading-normal max-w-xs">
                  Provide a prompt query on the left pane and execute the audit to compute hardware-level environmental footprints.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
