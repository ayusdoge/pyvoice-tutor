import React, { useState } from 'react';
import { Play, Copy, Check, Download, FastForward, Pause } from 'lucide-react';
import { CodeLineExplanation } from '../types';

interface CodeViewerProps {
  code: string;
  explanations: CodeLineExplanation[];
  activeLineNumber: number | null;
  onSelectLine: (lineNumber: number) => void;
  onRunCode: () => void;
  isRunning: boolean;
  isAutoTouring: boolean;
  onToggleAutoTour: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  explanations,
  activeLineNumber,
  onSelectLine,
  onRunCode,
  isRunning,
  isAutoTouring,
  onToggleAutoTour,
}) => {
  const [copied, setCopied] = useState(false);

  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'solution.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Basic syntax highlighter helper for Python tokens
  const highlightSyntax = (lineText: string) => {
    if (!lineText) return <span>&nbsp;</span>;

    // Comments
    if (lineText.trim().startsWith('#')) {
      return <span className="text-slate-500 italic">{lineText}</span>;
    }

    // Split by string literals or keywords
    const keywords = ['def', 'return', 'for', 'in', 'if', 'else', 'elif', 'while', 'break', 'continue', 'True', 'False', 'None', 'import', 'from', 'as', 'try', 'except', 'with'];
    const parts = lineText.split(/(\b(?:def|return|for|in|if|else|elif|while|break|continue|True|False|None|import|from|as)\b|"[^"]*"|'[^']*'|#[^\n]*)/g);

    return parts.map((part, i) => {
      if (keywords.includes(part)) {
        return <span key={i} className="text-purple-400 font-semibold">{part}</span>;
      }
      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
        return <span key={i} className="text-emerald-300">{part}</span>;
      }
      if (part.startsWith('#')) {
        return <span key={i} className="text-slate-500 italic">{part}</span>;
      }
      if (/\b\d+\b/.test(part)) {
        return <span key={i} className="text-amber-300">{part}</span>;
      }
      return <span key={i} className="text-slate-200">{part}</span>;
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/50 flex flex-col h-full">
      {/* Editor Top Bar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* macOS window control buttons */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="text-emerald-400">🐍</span> logic_solution.py
          </span>
          <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-mono hidden sm:inline">
            Click lines to inspect
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Auto Tour Button */}
          <button
            onClick={onToggleAutoTour}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all ${
              isAutoTouring
                ? 'bg-purple-600/30 border-purple-400 text-purple-200 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Auto-step through each explained line"
          >
            {isAutoTouring ? <Pause className="w-3.5 h-3.5" /> : <FastForward className="w-3.5 h-3.5 text-purple-400" />}
            <span className="text-[11px] font-medium">{isAutoTouring ? 'Pause Tour' : 'Auto-Tour'}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
            title="Copy Python code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>

          {/* Download .py Button */}
          <button
            onClick={handleDownload}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
            title="Download solution.py"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Run in Pyodide Button */}
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer ml-1"
            title="Run Python code directly in your browser using Pyodide WebAssembly"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run in Browser'}</span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-2 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto overflow-y-auto max-h-[460px] bg-slate-950/40 select-text">
        {lines.map((lineText, index) => {
          const lineNumber = index + 1;
          const isSelected = activeLineNumber === lineNumber;
          const hasExplanation = explanations.some((e) => e.lineNumber === lineNumber);

          return (
            <div
              key={lineNumber}
              onClick={() => onSelectLine(lineNumber)}
              className={`flex items-start rounded-md px-2 py-0.5 cursor-pointer transition-all duration-150 group relative ${
                isSelected
                  ? 'bg-purple-900/30 border-l-2 border-purple-400 text-white shadow-sm ring-1 ring-purple-500/20'
                  : 'hover:bg-slate-800/50 text-slate-300'
              }`}
            >
              {/* Line Number */}
              <span
                className={`w-8 shrink-0 text-right pr-3 select-none text-xs ${
                  isSelected
                    ? 'text-purple-400 font-bold'
                    : 'text-slate-600 group-hover:text-slate-400'
                }`}
              >
                {lineNumber}
              </span>

              {/* Line Indicator if explained */}
              <span className="w-2.5 shrink-0 flex items-center justify-center pt-1 mr-1">
                {hasExplanation && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-purple-400 animate-ping' : 'bg-slate-700 group-hover:bg-purple-400/60'
                    }`}
                  />
                )}
              </span>

              {/* Code Content */}
              <div className="flex-1 whitespace-pre pl-1">
                {highlightSyntax(lineText)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
