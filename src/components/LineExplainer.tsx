import React, { useState } from 'react';
import { Lightbulb, MessageSquare, ArrowLeft, ArrowRight, BookOpen, Volume2, VolumeX, GitFork, FileQuestion } from 'lucide-react';
import { CodeLineExplanation, LogicFlowStep } from '../types';
import { ttsService } from '../services/ttsService';

interface LineExplainerProps {
  explanations: CodeLineExplanation[];
  activeLineNumber: number | null;
  onSelectLine: (lineNumber: number) => void;
  languageMode: 'english' | 'hinglish' | 'both';
  totalLines: number;
  flowSteps?: LogicFlowStep[];
}

export const LineExplainer: React.FC<LineExplainerProps> = ({
  explanations,
  activeLineNumber,
  onSelectLine,
  languageMode,
  totalLines,
  flowSteps,
}) => {
  const [activeTab, setActiveTab] = useState<'line' | 'flow' | 'cheatsheet'>('line');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // If no line selected, pick the first explained line or line 1
  const currentExplanation =
    explanations.find((e) => e.lineNumber === activeLineNumber) || explanations[0];

  const currentIndex = explanations.findIndex((e) => e.lineNumber === currentExplanation?.lineNumber);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < explanations.length - 1;

  const goToPrev = () => {
    if (hasPrev) {
      ttsService.stop();
      setIsSpeaking(false);
      onSelectLine(explanations[currentIndex - 1].lineNumber);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      ttsService.stop();
      setIsSpeaking(false);
      onSelectLine(explanations[currentIndex + 1].lineNumber);
    }
  };

  const handleReadAloud = (text: string, isHinglish: boolean) => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      ttsService.speak(text, isHinglish, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 flex flex-col justify-between h-full space-y-4">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('line')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'line'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Line Breakdown
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === 'flow'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Logic Flow</span>
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === 'cheatsheet'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Cheat-Sheet</span>
          </button>
        </div>

        {/* Stepper only visible on Line tab */}
        {activeTab === 'line' && (
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrev}
              disabled={!hasPrev}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
              title="Previous explained line"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1">
              {currentIndex + 1}/{explanations.length}
            </span>
            <button
              onClick={goToNext}
              disabled={!hasNext}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
              title="Next explained line"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: LINE BREAKDOWN */}
      {activeTab === 'line' && currentExplanation && (
        <div className="space-y-3.5 flex-1">
          {/* Top Line Meta */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-semibold border border-purple-500/30">
                Line {currentExplanation.lineNumber} of {totalLines}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 text-xs font-medium border border-indigo-500/30">
                {currentExplanation.keyConcept}
              </span>
            </div>

            {/* Read Aloud Button */}
            <button
              onClick={() =>
                handleReadAloud(
                  languageMode === 'hinglish'
                    ? currentExplanation.hinglishExplanation
                    : currentExplanation.englishExplanation,
                  languageMode === 'hinglish'
                )
              }
              className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                isSpeaking
                  ? 'bg-purple-600/30 border-purple-400 text-purple-200 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Listen to this line's explanation"
            >
              {isSpeaking ? <VolumeX className="w-3 h-3 text-purple-300" /> : <Volume2 className="w-3 h-3 text-purple-400" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen Aloud'}</span>
            </button>
          </div>

          {/* Current line code display */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-purple-200 overflow-x-auto">
            <code>{currentExplanation.code}</code>
          </div>

          {/* Spoken Intent Mapping */}
          {currentExplanation.spokenIntent && (
            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Mapped from your Spoken Logic:</span>
              </div>
              <p className="text-xs text-purple-200/90 italic font-sans">
                "{currentExplanation.spokenIntent}"
              </p>
            </div>
          )}

          {/* Explanations */}
          <div className="space-y-2.5">
            {(languageMode === 'english' || languageMode === 'both') && (
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>English Explanation</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentExplanation.englishExplanation}
                </p>
              </div>
            )}

            {(languageMode === 'hinglish' || languageMode === 'both') && (
              <div className="bg-amber-950/15 rounded-xl p-3 border border-amber-500/20">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-300 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🇮🇳</span>
                    <span>Hinglish Explanation</span>
                  </div>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
                  {currentExplanation.hinglishExplanation}
                </p>
              </div>
            )}
          </div>

          {/* Beginner Tip / Callout */}
          {currentExplanation.beginnerTip && (
            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-3 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-indigo-300 block mb-0.5">
                  Beginner Pro-Tip:
                </span>
                <p className="text-xs text-indigo-200/90 leading-relaxed font-sans">
                  {currentExplanation.beginnerTip}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LOGIC FLOW DIAGRAM */}
      {activeTab === 'flow' && (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
          <div className="text-xs text-slate-400 mb-2">
            Visual breakdown of how your spoken logic is executed step-by-step:
          </div>
          {flowSteps && flowSteps.length > 0 ? (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {flowSteps.map((fs) => (
                <div key={fs.step} className="relative group">
                  <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-purple-600/30 border border-purple-500 text-purple-300 text-[10px] font-mono font-bold flex items-center justify-center">
                    {fs.step}
                  </span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 group-hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{fs.icon || '⚡'}</span>
                      <h4 className="text-xs font-semibold text-slate-200">{fs.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{fs.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic p-4 text-center">
              Visual flow generated for presets. Select any preset above to see the step diagram!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BEGINNER CHEAT-SHEET */}
      {activeTab === 'cheatsheet' && (
        <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[420px] pr-1 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="font-mono text-purple-400 font-semibold">% (Modulo Operator)</span>
            <p className="text-slate-400 mt-1">
              Gives remainder after division. <code className="text-slate-200">10 % 3 = 1</code>. If <code className="text-slate-200">n % 2 == 0</code>, the number is even!
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="font-mono text-emerald-400 font-semibold">range(start, stop)</span>
            <p className="text-slate-400 mt-1">
              Generates numbers up to <code className="text-slate-200">stop - 1</code>. To include 50, write <code className="text-slate-200">range(2, 51)</code>.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="font-mono text-amber-400 font-semibold">[::-1] (Slice Reversal)</span>
            <p className="text-slate-400 mt-1">
              Reverses any string or list in one line. Perfect for checking palindromes like <code className="text-slate-200">"radar"</code>.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="font-mono text-indigo-400 font-semibold">f-strings (f"Hello &#123;name&#125;")</span>
            <p className="text-slate-400 mt-1">
              Easily embed variables directly inside strings without messy concatenation.
            </p>
          </div>
        </div>
      )}

      {/* Jump Line Buttons Bar */}
      {activeTab === 'line' && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px] hidden sm:inline">Jump to line:</span>
          <div className="flex flex-wrap gap-1">
            {explanations.map((exp) => (
              <button
                key={exp.lineNumber}
                onClick={() => {
                  ttsService.stop();
                  setIsSpeaking(false);
                  onSelectLine(exp.lineNumber);
                }}
                className={`w-6 h-6 rounded-md text-[11px] font-mono font-medium transition-all ${
                  exp.lineNumber === currentExplanation?.lineNumber
                    ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title={`Jump to line ${exp.lineNumber}`}
              >
                {exp.lineNumber}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
