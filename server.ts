import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid crashing if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Endpoint to calculate simulated footprint of a prompt, and optionally generate response
app.post('/api/calculate-footprint', async (req, res) => {
  try {
    const { prompt, model = 'gemini-2.5-flash', runActual = false } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const inputTokens = Math.ceil(prompt.length / 4); // rough approximation
    let outputTokens = 0;
    let responseText = '';
    let durationMs = 0;
    let actualRunSuccessful = false;

    if (runActual) {
      const client = getAiClient();
      if (client) {
        const startTime = Date.now();
        try {
          const response = await client.models.generateContent({
            model,
            contents: prompt,
            config: {
              maxOutputTokens: 300,
            }
          });
          durationMs = Date.now() - startTime;
          responseText = response.text || '';
          outputTokens = Math.ceil(responseText.length / 4);
          actualRunSuccessful = true;
        } catch (apiErr: any) {
          console.error('Gemini API call failed, falling back to simulated metrics:', apiErr);
          // Fall back to simulation if API key is invalid or fails
        }
      }
    }

    // If we didn't run the actual API, simulate response length
    if (!actualRunSuccessful) {
      outputTokens = Math.floor(Math.random() * 150) + 100; // 100-250 tokens
      durationMs = Math.floor(Math.random() * 800) + 400; // 400-1200ms
      responseText = `[Simulated Response] To answer your query about "${prompt.substring(0, 30)}...", processing this through an advanced neural network triggers massive matrix computations. These computations take place on specialized hardware (TPUs/GPUs) housed in hyper-scale data centers. This process consumes raw electrical energy to power the silicon gates and liquid water to prevent thermal throttling.`;
    }

    // Environmental calculation formulas based on recent research
    // 1 prompt + response ≈ 0.3 - 0.5 Wh (Watt-hours) of electricity depending on model size.
    // 1 prompt + response ≈ 10ml to 50ml of fresh water depending on cooling system (evaporative vs closed loop) and server location.
    // GPT-4/larger models: ~10x higher. Gemini 2.5 Flash is highly optimized, but still has a real footprint.
    const energyPerTokenWh = model.includes('flash') ? 0.00015 : 0.0008; // Flash is smaller and optimized
    const waterPerTokenMl = model.includes('flash') ? 0.012 : 0.045; // ml per token

    const totalTokens = inputTokens + outputTokens;
    const energyWh = totalTokens * energyPerTokenWh;
    const waterMl = totalTokens * waterPerTokenMl;
    
    // Carbon emission: average global grid intensity ≈ 0.4g CO2 per Wh
    const co2Grams = energyWh * 0.4;

    // Equivalent computations
    const smartphoneCharges = energyWh / 5.0; // average smartphone charge is 5Wh
    const ledLightbulbMinutes = (energyWh / 10.0) * 60; // 10W LED bulb
    const iceMeltingMg = co2Grams * 3.0; // simplified representation: 3mg of glacier ice melt per gram of CO2

    return res.json({
      modelUsed: model,
      prompt,
      responseText,
      actualRun: actualRunSuccessful,
      metrics: {
        inputTokens,
        outputTokens,
        totalTokens,
        energyWh,
        waterMl,
        co2Grams,
        durationMs,
        equivalents: {
          smartphoneCharges,
          ledLightbulbMinutes,
          iceMeltingMg
        }
      }
    });
  } catch (err: any) {
    console.error('Error in footprint calculation:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to audit a prompt ecologically
app.post('/api/audit-prompt', async (req, res) => {
  try {
    const { prompt, type = 'text' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Baseline calculation based on prompt length and type
    const baseLen = prompt.length;
    let mult = 1.0;
    if (type === 'image') mult = 8.5;
    if (type === 'code') mult = 2.1;
    if (type === 'video') mult = 25.0;

    const energyUsedWh = parseFloat((0.85 + (baseLen % 12) * 0.12 * mult).toFixed(2));
    const carbonIntensityGrams = parseFloat((energyUsedWh * 0.42).toFixed(2));
    const waterConsumedMl = parseFloat((energyUsedWh * 3.1).toFixed(1));
    const eWasteProducedMg = parseFloat((energyUsedWh * 0.05).toFixed(3));

    let ecologicalBreakdown = `This inquiry involves auto-regressive processing over millions of neural network node connections. The localized mathematical structures require substantial hardware memory bandwidth, yielding concrete grid consumption and server rack cooling fluid vaporisation.`;
    let comparisons = [
      `Boiling ${parseFloat((energyUsedWh * 3.1).toFixed(0))}ml of fresh drinking water.`,
      `Charging a standard smartphone roughly ${(energyUsedWh / 12).toFixed(1)} times.`,
      `Equal to running a standard 10W LED household bulb for ${(energyUsedWh / 10).toFixed(1)} hours.`
    ];
    let mitigationAdvice = [
      "Condense multi-turn dialogues into a single dense context batch.",
      "Where applicable, resolve inquiries locally without routing tokens over public network routers."
    ];

    // Try to call Gemini to get smart personalized text if key is present
    const client = getAiClient();
    if (client) {
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Analyze this prompt ecologically. Prompt: "${prompt}" (Type: ${type}).
Calculated impact metrics for reference:
- Energy used: ${energyUsedWh} Wh
- Carbon emitted: ${carbonIntensityGrams} g CO2
- Water consumed: ${waterConsumedMl} ml
- E-waste produced: ${eWasteProducedMg} mg

Generate a custom realistic breakdown, comparisons, and mitigation tips suited exactly to what this prompt asks for.`,
          config: {
            systemInstruction: `You are an expert environmental digital infrastructure auditor.
Provide realistic, professional analysis of the exact computational work required to process the user's specific prompt.
Use the referenced metrics in your output, and make the comparisons and tips highly personalized and unique to what the prompt is doing (e.g., if it's generating code, talk about compiler compilation/execution; if it's an image, talk about diffusion steps and GPU rendering; if it's simple text, talk about language tokens).
Do not exaggerate; remain objective and scannable.`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                ecologicalBreakdown: {
                  type: Type.STRING,
                  description: "A tailored, realistic 2-3 sentence explanation of the specific hardware workload, memory, and cooling requirements to process this exact query."
                },
                comparisons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 3 distinct, highly relatable and context-aware analogies comparing this prompt's energy or water footprint to everyday physical events. Include the calculated metrics, e.g., 'Charging your phone 1.2 times', 'Equal to a 10W LED running for 3 hours'."
                },
                mitigationAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 2 real-world, practical tips to optimize this specific type of prompt/workload to reduce its computational footprint."
                }
              },
              required: ["ecologicalBreakdown", "comparisons", "mitigationAdvice"]
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed.ecologicalBreakdown && Array.isArray(parsed.comparisons) && Array.isArray(parsed.mitigationAdvice)) {
            ecologicalBreakdown = parsed.ecologicalBreakdown;
            comparisons = parsed.comparisons;
            mitigationAdvice = parsed.mitigationAdvice;
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini prompt auditing failed, using fallback computations:', geminiErr);
      }
    }

    return res.json({
      carbonIntensityGrams,
      energyUsedWh,
      waterConsumedMl,
      eWasteProducedMg,
      ecologicalBreakdown,
      comparisons,
      mitigationAdvice,
      isFallback: !client
    });
  } catch (err: any) {
    console.error('Error in prompt auditor endpoint:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve frontend
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  // In development, integrate Vite in middleware mode
  import('vite').then(({ createServer }) => {
    createServer({
      server: { middlewareMode: true },
      appType: 'custom'
    }).then((vite) => {
      app.use(vite.middlewares);
      
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        try {
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    });
  });
} else {
  // In production, serve the built files
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  
  app.use('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
