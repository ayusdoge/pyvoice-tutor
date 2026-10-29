import React, { useState } from 'react';
import { Terminal, Clock, Copy, Check, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ExecutionResult } from '../types';

interface ConsoleOutputProps {
  result: ExecutionResult | null;
  expectedOutput: string;
  onClear: () => void;
  isRunning: boolean;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  result,
  expectedOutput,
  onClear,
  isRunning,
}) => {
  const [activeTab, setActiveTab] = useState<'actual' | 'expected'>('actual');
  const [copied, setCopied] = useState(false);

  const currentDisplay = activeTab === 'actual' ? result?.output : expectedOutput;

  const handleCopy = () => {
    if (currentDisplay) {
      navigator.clipboard.writeText(currentDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
      {/* Console Header Bar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Python Console</span>
          </div>

          {/* Engine Badge */}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Pyodide (WebAssembly)
          </span>

          {/* Execution Time */}
          {result && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{result.executionTimeMs}ms</span>
            </span>
          )}
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/80 text-xs">
            <button
              onClick={() => setActiveTab('actual')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                activeTab === 'actual'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Execution Output
            </button>
            <button
              onClick={() => setActiveTab('expected')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                activeTab === 'expected'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expected Output
            </button>
          </div>

          <button
            onClick={handleCopy}
            disabled={!currentDisplay}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Copy console output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClear}
            disabled={!result}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 bg-slate-950 font-mono text-xs sm:text-sm min-h-[140px] max-h-[220px] overflow-y-auto leading-relaxed">
        {isRunning ? (
          <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Executing Python code in in-browser Pyodide VM...</span>
          </div>
        ) : activeTab === 'actual' ? (
          result ? (
            result.error ? (
              <div className="text-rose-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Runtime Error:</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs text-rose-300/90">
                  {result.error}
                </pre>
              </div>
            ) : (
              <div className="text-emerald-300">
                <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
                  {result.output}
                </pre>
              </div>
            )
          ) : (
            <div className="text-slate-600 italic">
              Click &quot;Run in Browser&quot; above to execute this Python code live in WebAssembly.
            </div>
          )
        ) : (
          <div className="text-purple-300">
            <div className="text-slate-400 text-xs mb-1 font-sans">Expected Sample Output:</div>
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
              {expectedOutput || 'No expected output specified.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
