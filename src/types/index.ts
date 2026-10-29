export interface CodeLineExplanation {
  lineNumber: number;
  code: string;
  spokenIntent: string;
  englishExplanation: string;
  hinglishExplanation: string;
  keyConcept: string;
  beginnerTip?: string;
}

export interface LogicFlowStep {
  step: number;
  title: string;
  desc: string;
  icon?: string;
}

export interface LogicSynthesisResult {
  title: string;
  summary: string;
  rawSpoken: string;
  languageDetected: 'english' | 'hinglish' | 'mixed';
  code: string;
  explanations: CodeLineExplanation[];
  expectedOutput: string;
  sampleInput?: string;
  tags: string[];
  flowSteps?: LogicFlowStep[];
  source: 'gemini-api' | 'offline-engine' | 'preset';
}

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTimeMs: number;
}

export interface PresetPrompt {
  id: string;
  title: string;
  spokenQuery: string;
  badge: string;
  category: 'beginner' | 'numbers' | 'strings' | 'lists';
  language: 'Hinglish' | 'English';
  preview: string;
}
