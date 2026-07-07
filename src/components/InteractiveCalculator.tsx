import React, { useState, useMemo } from "react";
import { SIMULATION_TASKS } from "../data";
import { SimulationTask } from "../types";
import { Info, HelpCircle, Activity, Globe, Flame, CloudRain } from "lucide-react";

export default function InteractiveCalculator() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("image");
  const [multiplier, setMultiplier] = useState<number>(1000); // default 1000 runs

  const selectedTask = useMemo(() => {
    return SIMULATION_TASKS.find((t) => t.id === selectedTaskId) || SIMULATION_TASKS[1];
  }, [selectedTaskId]);

  // Calculations
  const totals = useMemo(() => {
    const energyWh = selectedTask.energyWh * multiplier;
    const waterMl = selectedTask.waterMl * multiplier;
    const carbonG = selectedTask.carbonG * multiplier;
    const eWasteMg = selectedTask.eWasteMg * multiplier;

    return {
      energy: energyWh,
      water: waterMl,
      carbon: carbonG,
      eWaste: eWasteMg,
      // Conversions/Comparisons
      phoneCharges: energyWh / 12, // approx 12 Wh to charge a phone
      carMiles: carbonG / 400, // approx 400g CO2 per mile driven in typical fossil car
      waterBottles: waterMl / 500, // 500ml water bottles
      treeDays: carbonG / 60, // A mature tree absorbs ~60g CO2 per day
      boilHours: energyWh / 1500 // 1.5kW kettle boiling time
    };
  }, [selectedTask, multiplier]);

  // Formatter utilities
  const formatEnergy = (wh: number) => {
    if (wh >= 1000000000) return `${(wh / 1000000000).toFixed(2)} GWh`;
    if (wh >= 1000000) return `${(wh / 1000000).toFixed(2)} MWh`;
    if (wh >= 1000) return `${(wh / 1000).toFixed(2)} kWh`;
    return `${wh.toFixed(1)} Wh`;
  };

  const formatWater = (ml: number) => {
    const liters = ml / 1000;
    if (liters >= 1000000) return `${(liters / 1000000).toFixed(2)} Million Liters`;
    if (liters >= 1000) return `${(liters / 1000).toFixed(2)} m³ (Thousand Liters)`;
    if (liters >= 1) return `${liters.toFixed(1)} Liters`;
    return `${ml.toFixed(0)} ml`;
  };

  const formatCarbon = (g: number) => {
    const kg = g / 1000;
    if (kg >= 1000) return `${(kg / 1000).toFixed(2)} Metric Tons`;
    if (kg >= 1) return `${kg.toFixed(1)} kg CO₂`;
    return `${g.toFixed(1)} g CO₂`;
  };

  const formatEWaste = (mg: number) => {
    const g = mg / 1000;
    if (g >= 1000) return `${(g / 1000).toFixed(2)} kg e-waste`;
    if (g >= 1) return `${g.toFixed(1)} g e-waste`;
    return `${mg.toFixed(2)} mg silicon wear`;
  };

  // Human friendly labels for multiplier
  const multiplierLabel = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(0)} Million times`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)} Thousand times`;
    return `${val} times`;
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 lg:p-8 backdrop-blur-2xl text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative" id="interactive-calculator">
      <div className="border-b border-white/10 pb-4 mb-6">
        <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
          FOOTPRINT SIMULATION MODEL
        </p>
        <h2 className="font-serif text-3xl font-normal mt-1 tracking-tight">
          Cumulative Impact Simulator
        </h2>
        <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">
          Select a common workload and scale the volume of occurrences to realize how small, frequent transactions compile into structural environmental footprints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step 1: Workload Config */}
        <div className="lg:col-span-5 space-y-6" id="calculator-config">
          <div className="space-y-3">
            <label className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
              01 // Choose AI Workload
            </label>
            <div className="grid grid-cols-1 gap-2" id="workload-list">
              {SIMULATION_TASKS.map((task) => (
                <button
                  key={task.id}
                  id={`calc-task-${task.id}`}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all relative ${
                    selectedTaskId === task.id
                      ? "border-white/30 bg-white/[0.08] text-white font-medium shadow-[0_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-lg"
                      : "border-white/5 bg-white/[0.02] text-neutral-300 hover:bg-white/[0.06] backdrop-blur-md"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif text-sm">{task.name}</span>
                    <span className="font-mono text-[9px] uppercase bg-white/10 px-2 py-0.5 rounded text-neutral-400">
                      {task.scaleLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light leading-normal line-clamp-1">
                    {task.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
                02 // Scale Transaction Volume
              </label>
              <span className="font-mono text-xs text-neutral-100 font-semibold bg-white/5 px-2.5 py-1 rounded border border-white/10">
                {multiplierLabel(multiplier)}
              </span>
            </div>

            {/* Visual range inputs */}
            <div className="space-y-2">
              <input
                type="range"
                id="multiplier-slider"
                min="1"
                max="100000"
                step="10"
                value={multiplier > 100000 ? 100000 : multiplier}
                onChange={(e) => setMultiplier(parseInt(e.target.value))}
                className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>1 Run</span>
                <span>10k Runs</span>
                <span>50k Runs</span>
                <span>100k Runs</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                id="preset-1"
                onClick={() => setMultiplier(1)}
                className={`px-3 py-1 rounded font-mono text-[10px] border transition-all ${
                  multiplier === 1 ? "bg-white text-neutral-950 border-white" : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                }`}
              >
                1 Run
              </button>
              <button
                id="preset-1000"
                onClick={() => setMultiplier(1000)}
                className={`px-3 py-1 rounded font-mono text-[10px] border transition-all ${
                  multiplier === 1000 ? "bg-white text-neutral-950 border-white" : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                }`}
              >
                1,000 Runs
              </button>
              <button
                id="preset-10000"
                onClick={() => setMultiplier(10000)}
                className={`px-3 py-1 rounded font-mono text-[10px] border transition-all ${
                  multiplier === 10000 ? "bg-white text-neutral-950 border-white" : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                }`}
              >
                10,000 Runs
              </button>
              <button
                id="preset-100000"
                onClick={() => setMultiplier(1000000)}
                className={`px-3 py-1 rounded font-mono text-[10px] border transition-all ${
                  multiplier === 1000000 ? "bg-white text-neutral-950 border-white" : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                }`}
              >
                1M Runs (Corporate Scale)
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Footprint Breakdown Metrics */}
        <div className="lg:col-span-7 bg-white/[0.01] border border-white/10 rounded-xl p-5 lg:p-6 space-y-6 flex flex-col justify-between backdrop-blur-md shadow-inner" id="calculator-metrics">
          <div className="space-y-4">
            <span className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
              03 // Compiled Footprint Metrics
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Carbon */}
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg shadow-sm backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300" id="carbon-box">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-neutral-400 font-light">Carbon Footprint</span>
                  <Flame className="w-4 h-4 text-rose-400" id="flame-icon" />
                </div>
                <p className="font-mono text-2xl font-normal text-neutral-100">{formatCarbon(totals.carbon)}</p>
                <p className="text-[11px] text-neutral-400 mt-1.5 font-light leading-normal">
                  Requires roughly <span className="text-rose-400 font-mono font-medium">{totals.carMiles.toFixed(1)} miles</span> of fossil-fuel car travel equivalent.
                </p>
              </div>

              {/* Energy */}
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg shadow-sm backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300" id="energy-box">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-neutral-400 font-light">Electricity Used</span>
                  <Activity className="w-4 h-4 text-amber-400" id="activity-icon" />
                </div>
                <p className="font-mono text-2xl font-normal text-neutral-100">{formatEnergy(totals.energy)}</p>
                <p className="text-[11px] text-neutral-400 mt-1.5 font-light leading-normal">
                  Enough to keep a 10W household lightbulb illuminated for <span className="text-amber-400 font-mono font-medium">{(totals.energy / 10).toFixed(1)} hours</span>.
                </p>
              </div>

              {/* Water */}
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg shadow-sm backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300" id="water-box">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-neutral-400 font-light">Freshwater Cooling</span>
                  <CloudRain className="w-4 h-4 text-cyan-400" id="rain-icon" />
                </div>
                <p className="font-mono text-2xl font-normal text-neutral-100">{formatWater(totals.water)}</p>
                <p className="text-[11px] text-neutral-400 mt-1.5 font-light leading-normal">
                  Equivalent to drinking <span className="text-cyan-400 font-mono font-medium">{totals.waterBottles.toFixed(1)}</span> standard 500ml mineral water bottles.
                </p>
              </div>

              {/* E-Waste */}
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg shadow-sm backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300" id="ewaste-box">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-neutral-400 font-light">Silicon Depreciation</span>
                  <Globe className="w-4 h-4 text-emerald-400" id="globe-icon" />
                </div>
                <p className="font-mono text-2xl font-normal text-neutral-100">{formatEWaste(totals.eWaste)}</p>
                <p className="text-[11px] text-neutral-400 mt-1.5 font-light leading-normal">
                  GPU structural material wear over hardware service lifetimes.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-lg flex items-start gap-3 mt-4 backdrop-blur-sm">
            <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" id="info-icon" />
            <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
              <span className="text-neutral-200 font-medium font-sans">The scaling effect:</span> Standard models process billions of automated API requests per second globally. A task that feels harmless in isolation emits thousands of tons of atmospheric carbon when deployed to consumer products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
