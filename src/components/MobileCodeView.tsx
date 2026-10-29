import React, { useState } from 'react';
import { Play, Copy, Check, Volume2, ArrowLeft, ArrowRight, Lightbulb, Terminal, Clock, Download } from 'lucide-react';
import { LogicSynthesisResult, ExecutionResult } from '../types';
import { ttsService } from '../services/ttsService';
import { soundService } from '../services/soundService';

interface MobileCodeViewProps {
  synthesisResult: LogicSynthesisResult;
  onRunCode: () => void;
  isRunning: boolean;
  executionResult: ExecutionResult | null;
  languageMode: 'english' | 'hinglish' | 'both';
}

export const MobileCodeView: React.FC<MobileCodeViewProps> = ({
  synthesisResult,
  onRunCode,
  isRunning,
  executionResult,
  languageMode,
}) => {
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const explanations = synthesisResult.explanations || [];

  const currentExplanation =
    explanations.find((e) => e.lineNumber === activeLineNumber) || explanations[0];
  const currentIndex = explanations.findIndex((e) => e.lineNumber === currentExplanation?.lineNumber);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < explanations.length - 1;

  const handleCopy = () => {
    soundService.playPop();
    navigator.clipboard.writeText(synthesisResult.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    soundService.playPop();
    const blob = new Blob([synthesisResult.code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'solution.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleListenAloud = () => {
    if (!currentExplanation) return;
    soundService.playPop();
    const text =
      languageMode === 'hinglish'
        ? currentExplanation.hinglishExplanation
        : currentExplanation.englishExplanation;
    ttsService.speak(text, languageMode === 'hinglish');
  };

  return (
    <div className="p-4 space-y-4 pb-24 max-w-sm mx-auto">
      {/* Code Editor Header */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
            <span className="text-emerald-400">🐍</span>
            <span>{synthesisResult.title.split(' ')[0]}.py</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              title="Copy"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundService.playPop();
                onRunCode();
              }}
              disabled={isRunning}
              className="flex items-center gap-1 px-3 py-1 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs border-b-2 border-emerald-700 active:border-b-0 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRunning ? 'Running' : 'Run'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-3 bg-slate-950 font-mono text-xs overflow-x-auto max-h-48 leading-relaxed">
          {synthesisResult.code.split('\n').map((line, idx) => {
            const lineNum = idx + 1;
            const isSelected = activeLineNumber === lineNum;
            return (
              <div
                key={lineNum}
                onClick={() => {
                  soundService.playPop();
                  setActiveLineNumber(lineNum);
                }}
                className={`flex items-start px-1.5 py-0.5 rounded cursor-pointer ${
                  isSelected ? 'bg-purple-900/40 text-purple-200 border-l-2 border-purple-400' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="w-6 shrink-0 text-slate-600 select-none text-[10px] text-right pr-2">
                  {lineNum}
                </span>
                <span className="whitespace-pre">{line}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Line-by-Line Breakdown Stepper Card */}
      {currentExplanation && (
        <div className="bg-slate-900 border-2 border-purple-500/30 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold">
                Line {currentExplanation.lineNumber}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                {currentExplanation.keyConcept}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (hasPrev) {
                    soundService.playPop();
                    setActiveLineNumber(explanations[currentIndex - 1].lineNumber);
                  }
                }}
                disabled={!hasPrev}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1">
                {currentIndex + 1}/{explanations.length}
              </span>
              <button
                onClick={() => {
                  if (hasNext) {
                    soundService.playPop();
                    setActiveLineNumber(explanations[currentIndex + 1].lineNumber);
                  }
                }}
                disabled={!hasNext}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Current Line Snippet */}
          <div className="bg-slate-950 p-2 rounded-xl font-mono text-xs text-purple-300 overflow-x-auto border border-slate-800">
            <code>{currentExplanation.code}</code>
          </div>

          {/* Explanation Text */}
          <div className="space-y-2 text-xs leading-relaxed">
            {(languageMode === 'english' || languageMode === 'both') && (
              <p className="text-slate-300">
                {currentExplanation.englishExplanation}
              </p>
            )}
            {(languageMode === 'hinglish' || languageMode === 'both') && (
              <p className="text-amber-200/90 font-medium">
                🇮🇳 {currentExplanation.hinglishExplanation}
              </p>
            )}
          </div>

          {/* Read Aloud Button */}
          <button
            onClick={handleListenAloud}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Listen to Explanation</span>
          </button>
        </div>
      )}

      {/* Terminal Output */}
      {executionResult && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Output (WebAssembly)</span>
            </span>
            <span className="font-mono text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{executionResult.executionTimeMs}ms</span>
            </span>
          </div>

          <pre className="font-mono text-xs text-emerald-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 whitespace-pre-wrap overflow-x-auto">
            {executionResult.output || executionResult.error || '(No output)'}
          </pre>
        </div>
      )}
    </div>
  );
};
