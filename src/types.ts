export interface AuditResult {
  carbonIntensityGrams: number;
  energyUsedWh: number;
  waterConsumedMl: number;
  eWasteProducedMg: number;
  ecologicalBreakdown: string;
  comparisons: string[];
  mitigationAdvice: string[];
  isFallback?: boolean;
}

export interface EducationalTopic {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  impactMetric: string;
  metricLabel: string;
  summary: string;
  details: string[];
  colorTheme: string; // Tailwind accent classes
}

export interface SimulationTask {
  id: string;
  name: string;
  category: "text" | "image" | "code" | "video";
  description: string;
  energyWh: number;
  waterMl: number;
  carbonG: number;
  eWasteMg: number;
  scaleLabel: string;
}
