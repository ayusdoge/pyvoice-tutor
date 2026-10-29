import { LogicSynthesisResult, CodeLineExplanation } from '../types';
import { synthesizeOfflineLogic } from './logicEngine';
import { cleanSpokenTranscription } from './phoneticCleaner';

export function getActiveApiKey(): string {
  const localKey = localStorage.getItem('pyvoice_gemini_api_key');
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }
  return '';
}

export function saveApiKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem('pyvoice_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('pyvoice_gemini_api_key');
  }
}

export function getSelectedAiModel(): string {
  return localStorage.getItem('pyvoice_ai_model') || 'gemini-2.0-flash';
}

export function setSelectedAiModel(model: string): void {
  localStorage.setItem('pyvoice_ai_model', model);
}

export async function synthesizeVoiceLogic(rawSpokenQuery: string): Promise<LogicSynthesisResult> {
  const apiKey = getActiveApiKey();
  const selectedModel = getSelectedAiModel();

  // Apply phonetic cleaning for spoken speech/Hinglish
  const spokenQuery = cleanSpokenTranscription(rawSpokenQuery);

  // If no API key is provided, use the offline smart logic engine immediately
  if (!apiKey) {
    return synthesizeOfflineLogic(spokenQuery);
  }

  try {
    const prompt = `You are PyVoice Tutor, a state-of-the-art voice-first Python mentor designed for learners dictating programming logic using speech (via Wispr Flow).
The learner spoke: "${spokenQuery}".
Note: The speech may be conversational English or Hinglish (Hindi written in English alphabet, e.g., "bhai prime numbers find karne ka code bana do").

Generate a clean, beginner-friendly, runnable Python script that implements their spoken logic, along with an interactive line-by-line explanation.

Return ONLY a valid JSON object matching this schema:
{
  "title": "Short title of the program",
  "summary": "1-2 sentence description of what the logic does",
  "languageDetected": "english" | "hinglish" | "mixed",
  "tags": ["topic1", "topic2"],
  "sampleInput": "Sample inputs used",
  "expectedOutput": "Expected console output when executed",
  "code": "Full executable Python code here. Use clean indentation with \\n.",
  "explanations": [
    {
      "lineNumber": 1,
      "code": "code of this line",
      "spokenIntent": "what part of the learner's voice thought mapped here",
      "englishExplanation": "Simple plain English explanation for beginners",
      "hinglishExplanation": "Conversational friendly Hinglish explanation (e.g., 'Yahan hum loop chala rahe hain taaki har number check ho')",
      "keyConcept": "e.g., For Loop / List Append / Conditionals",
      "beginnerTip": "Optional pro-tip for new coders"
    }
  ]
}

Ensure the code is 100% executable without pip dependencies (standard library only) so it runs in browser WebAssembly (Pyodide). Do not wrap the JSON in markdown code blocks.`;

    // Attempt primary selected model (e.g. gemini-2.0-flash)
    let modelEndpoint = selectedModel;
    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    // If modelEndpoint fails, fallback to gemini-1.5-flash
    if (!response.ok && modelEndpoint !== 'gemini-1.5-flash') {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );
    }

    if (!response.ok) {
      console.warn('Gemini API call failed, falling back to offline engine:', response.status);
      return synthesizeOfflineLogic(spokenQuery);
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      return synthesizeOfflineLogic(spokenQuery);
    }

    const parsed = JSON.parse(rawContent);
    const result: LogicSynthesisResult = {
      title: parsed.title || 'Python Logic Walkthrough',
      summary: parsed.summary || 'Generated from your spoken dictation.',
      rawSpoken: spokenQuery,
      languageDetected: parsed.languageDetected || 'english',
      tags: parsed.tags || ['python', 'beginner'],
      sampleInput: parsed.sampleInput || '',
      expectedOutput: parsed.expectedOutput || '',
      code: parsed.code || '# Generated code\nprint("Hello from PyVoice")',
      explanations: (parsed.explanations || []).map((exp: any, index: number): CodeLineExplanation => ({
        lineNumber: exp.lineNumber || index + 1,
        code: exp.code || '',
        spokenIntent: exp.spokenIntent || '',
        englishExplanation: exp.englishExplanation || 'Executes this statement in Python.',
        hinglishExplanation: exp.hinglishExplanation || 'Ye statement run hota hai.',
        keyConcept: exp.keyConcept || 'Python Syntax',
        beginnerTip: exp.beginnerTip
      })),
      source: 'gemini-api'
    };

    return result;
  } catch (error) {
    console.error('Error in synthesizeVoiceLogic with API key:', error);
    return synthesizeOfflineLogic(spokenQuery);
  }
}
