import { EducationalTopic, SimulationTask } from "./types";

export const EDUCATIONAL_TOPICS: EducationalTopic[] = [
  {
    id: "energy",
    title: "The Silent Grid",
    subtitle: "Sustaining the digital demand",
    iconName: "Zap",
    impactMetric: "1,000+ TWh",
    metricLabel: "Projected global AI energy consumption by 2026",
    summary: "AI workloads run on hyper-scale clusters requiring uninterrupted, high-baseload power, forcing many regions to prolong their reliance on fossil-fuel power plants.",
    details: [
      "Generative AI queries consume up to 10 to 15 times more energy than a traditional Google search engine index retrieval.",
      "The massive continuous electricity draw puts intense pressure on localized regional utility grids, occasionally triggering seasonal power warnings in tech hubs.",
      "Sourcing 24/7 power has led to partnerships with aging nuclear and natural gas plants, offsetting global green energy transition timelines."
    ],
    colorTheme: "border-amber-500/30 text-amber-400 bg-amber-950/10"
  },
  {
    id: "water",
    title: "Evaporative Thirst",
    subtitle: "Boiling away our fresh reservoirs",
    iconName: "Droplet",
    impactMetric: "500 ml",
    metricLabel: "Water consumed per standard 20-30 token prompt exchange",
    summary: "High-density GPU architectures generate immense thermal output, requiring evaporative cooling towers that release millions of gallons of clean municipal water daily.",
    details: [
      "To prevent processor thermal throttling, data centers boil away local river water or drinking reservoirs, transforming critical water tables into vapor.",
      "Power grids themselves consume substantial water during thermal power generation, creating a secondary, indirect water footprint.",
      "Data centers are often built in drought-prone areas, straining local agrarian communities and inflating municipal water tariffs."
    ],
    colorTheme: "border-cyan-500/30 text-cyan-400 bg-cyan-950/10"
  },
  {
    id: "ewaste",
    title: "Rare Earth Exhaustion",
    subtitle: "Accelerated obsolescence cycles",
    iconName: "Cpu",
    impactMetric: "2-3 Years",
    metricLabel: "Average operational lifespan of a cutting-edge GPU cluster",
    summary: "The global AI race demands continuous performance leaps, resulting in a hyper-aggressive replacement cycle of custom silicon and toxic e-waste.",
    details: [
      "Hardware manufacturing requires high-purity quartz, cobalt, lithium, and rare earth minerals extracted via destructive open-cast mining.",
      "The carbon-heavy manufacturing process of a single GPU chip can exceed the operational carbon footprint it will ever emit during its lifetime.",
      "Decommissioned servers generate hazardous electronic waste containing lead, mercury, and toxic brominated flame retardants that seep into groundwater."
    ],
    colorTheme: "border-emerald-500/30 text-emerald-400 bg-emerald-950/10"
  },
  {
    id: "ecosystem",
    title: "Ecosystem Fractures",
    subtitle: "Displacing local microclimates",
    iconName: "Leaf",
    impactMetric: "3-5x",
    metricLabel: "Increase in local river temperature near water-discharge centers",
    summary: "Mega data center development disrupts local ecosystems by clearing expansive arable lands, radiating background heat, and introducing massive noise levels.",
    details: [
      "Vast tracts of agricultural land are clear-cut to install server campuses, disrupting crucial ecological corridors and wildlife migration paths.",
      "Constant industrial hum from thousands of high-velocity server fans induces localized acoustic pollution, disorienting nesting birds and small mammals.",
      "Discharging warm cooling-water back into local streams can induce thermal shock in aquatic species, depleting dissolved oxygen levels."
    ],
    colorTheme: "border-rose-500/30 text-rose-400 bg-rose-950/10"
  }
];

export const SIMULATION_TASKS: SimulationTask[] = [
  {
    id: "prompt",
    name: "Draft 1 Email with LLM",
    category: "text",
    description: "Generating a quick 150-word formal email response using a standard frontier language model.",
    energyWh: 0.35,
    waterMl: 2.1,
    carbonG: 0.15,
    eWasteMg: 0.02,
    scaleLabel: "Single Action"
  },
  {
    id: "image",
    name: "Generate 1 High-Res Image",
    category: "image",
    description: "Sustaining a multi-second diffusion process on standard resolution (1024x1024) with 30-50 steps.",
    energyWh: 4.8,
    waterMl: 24.5,
    carbonG: 2.01,
    eWasteMg: 0.22,
    scaleLabel: "Single Action"
  },
  {
    id: "video",
    name: "Generate 5-Second Video Clip",
    category: "video",
    description: "Synthesizing frame-by-frame consistent video loops utilizing transformer-diffusion networks.",
    energyWh: 38.5,
    waterMl: 120.0,
    carbonG: 16.1,
    eWasteMg: 1.85,
    scaleLabel: "Single Action"
  },
  {
    id: "translation",
    name: "Translate a 200-Page Document",
    category: "text",
    description: "Batch processing massive text streams for multi-lingual structural alignment.",
    energyWh: 75.0,
    waterMl: 260.0,
    carbonG: 31.5,
    eWasteMg: 3.5,
    scaleLabel: "Document Batch"
  },
  {
    id: "finetune",
    name: "Fine-tune LLM on Custom Dataset",
    category: "code",
    description: "Updating weights of a 7B-parameter open-source model using parameter-efficient fine-tuning (LoRA) for 2 hours.",
    energyWh: 2200.0,
    waterMl: 7800.0,
    carbonG: 924.0,
    eWasteMg: 110.0,
    scaleLabel: "Developer Run"
  },
  {
    id: "megatraining",
    name: "Pre-train Next-Gen Frontier LLM",
    category: "code",
    description: "Continuous matrix operations across 25,000 state-of-the-art GPUs for 90 days straight.",
    energyWh: 15400000000, // Wh = 15.4 GWh
    waterMl: 54000000000, // 54M Liters
    carbonG: 6468000000,  // 6,468 Metric Tons CO2
    eWasteMg: 770000000,  // 770 kg GPU decay
    scaleLabel: "Industrial Training"
  }
];
