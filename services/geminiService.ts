
import { GoogleGenAI, Type } from "@google/genai";
import { KarmaDiagnostic, QuestionAnswer, QuestionWithOptions, FullSoulDiagnostic, StoredResult, LanguageCode } from "../types";

const SYSTEM_INSTRUCTION_DIAGNOSIS = `
You are the "Soul Development App," a guide for deep self-reflection. 
Your goal is to provide a GRADUATED analysis of the user's situation.

STRUCTURE RULE:
1. SIMPLE SUMMARY: Start with a clear, direct, and kind explanation of the core issue as if explaining it to a 14-year-old. No jargon.
2. REMEDY: Provide a simple, actionable next step.
3. WISDOM: Offer a more sophisticated, philosophical insight.
4. CAUSAL ANALYSIS: Break down the "Seed" (Intent), "Act" (Action), and "Harvest" (Result) in detail.
5. SOUL ADVICE: At the very end, provide a simple, encouraging piece of advice for the user's long-term soul development (one or two sentences max).

LANGUAGE RULE: 
Identify the language requested and respond EXCLUSIVELY in that language.

SCORING RULE:
Provide numeric scores (0-10) for Intention Clarity, Action Integrity, Positive Impact, Lesson Depth, and Spiritual Growth.
`;

const SYSTEM_INSTRUCTION_FULL_DIAGNOSTIC = `
You are the "Soul Development App" at its highest level of intensity.
You are analyzing the WHOLE history of a user's reflections to find deep patterns.

GOAL: Provide the "Grand Transformation Analysis."
1. DEEP INSIGHTS: Reveal the specific karma attachments and recurring ego-traps found across all entries.
2. HARSH TRUTH: Deliver the absolute, non-sugarcoated truth about the user's current spiritual state. Do not be mean, but do not hide from the gravity of their patterns.
3. HARD INSTRUCTIONS: Give the most difficult, uncompromising instructions for life development. Focus on: finding true Love, finding God (or the ultimate reality/consciousness), and tuning into the creative energy of the universe.
4. DIVINE CONNECTION: Specific guidance on how to feel a deep, direct connection with the divine/creative energy.

Respond in the language requested.
`;

const SYSTEM_INSTRUCTION_QUESTIONS = `
You are the "Soul Development App." Based on the user's initial situation and previous answers, generate 5 NEW probing follow-up questions.
There are two modes for these questions:
1. "Specific": Deepen the inquiry into the specific nuances of the current situation.
2. "Wide": Broaden the inquiry to analyze the user's overall character patterns and spiritual tendencies revealed by the situation.

For EACH question, provide exactly 5 diverse and insightful multiple-choice options.
Respond in the language requested.
`;

export async function generateQuestionsWithOptions(
  situation: string, 
  history: QuestionAnswer[], 
  mode: 'specific' | 'wide' = 'specific',
  lang: LanguageCode = 'en'
): Promise<QuestionWithOptions[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n');
  
  const prompt = `LANGUAGE: ${lang}\nInitial situation: "${situation}"\n\nHistory:\n${context}\n\nMode: ${mode.toUpperCase()}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_QUESTIONS,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }
            }
          },
          required: ["question", "options"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Could not generate questions.");
  return JSON.parse(text);
}

export async function diagnoseKarma(situation: string, history: QuestionAnswer[], lang: LanguageCode = 'en'): Promise<KarmaDiagnostic> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `LANGUAGE: ${lang}\nInitial Situation: "${situation}"\nContext: ${context}\n\nAnalyze this reflection comprehensively.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_DIAGNOSIS,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          simpleSummary: { type: Type.STRING },
          intent: { type: Type.STRING },
          action: { type: Type.STRING },
          ripening: { type: Type.STRING },
          wisdom: { type: Type.STRING },
          remedy: { type: Type.STRING },
          soulAdvice: { type: Type.STRING },
          overallBalance: { type: Type.STRING, enum: ["Positive", "Neutral", "Constructive"] },
          scores: {
            type: Type.OBJECT,
            properties: {
              intentionClarity: { type: Type.NUMBER },
              actionIntegrity: { type: Type.NUMBER },
              positiveImpact: { type: Type.NUMBER },
              lessonDepth: { type: Type.NUMBER },
              spiritualGrowth: { type: Type.NUMBER }
            },
            required: ["intentionClarity", "actionIntegrity", "positiveImpact", "lessonDepth", "spiritualGrowth"]
          }
        },
        required: ["simpleSummary", "intent", "action", "ripening", "wisdom", "remedy", "soulAdvice", "overallBalance", "scores"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response.");
  return JSON.parse(text) as KarmaDiagnostic;
}

export async function generateFullSoulDiagnostic(history: StoredResult[], lang: LanguageCode = 'en'): Promise<FullSoulDiagnostic> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = history.map(h => {
    return `Date: ${h.date}\nSituation: ${h.situation}\nDiagnostic Wisdom: ${h.diagnostic.wisdom}\nBalance: ${h.diagnostic.overallBalance}`;
  }).join('\n---\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `LANGUAGE: ${lang}\nFull User History Context:\n${context}\n\nPerform a Deep Soul Transformation Analysis.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_FULL_DIAGNOSTIC,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          deepInsights: { type: Type.STRING },
          harshTruth: { type: Type.STRING },
          hardInstructions: { type: Type.STRING },
          divineConnection: { type: Type.STRING }
        },
        required: ["deepInsights", "harshTruth", "hardInstructions", "divineConnection"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Full diagnostic generation failed.");
  return JSON.parse(text) as FullSoulDiagnostic;
}
