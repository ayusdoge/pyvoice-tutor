import React from 'react';
import { X, Mic, Sparkles, CheckCircle2, Flame, ExternalLink } from 'lucide-react';

interface WisprGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WisprGuideModal: React.FC<WisprGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                How to use Wispr Flow with PyVoice
              </h3>
              <p className="text-[11px] text-slate-400">
                Voice-First Python Learning for the WeMakeDevs Challenge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 rounded-xl p-3.5 space-y-1.5">
            <span className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              The Voice-First Philosophy
            </span>
            <p className="text-slate-300">
              Beginners often know <em>what</em> logic they want to execute, but struggle translating their thoughts into precise Python syntax, loops, and indentations. Wispr Flow lets them speak their natural thoughts, bridging the gap between thought and code!
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
              3-Step Flow:
            </h4>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-slate-100">Hold Wispr Key & Speak:</strong>
                <p className="text-slate-400">
                  Click the prompt textarea, hold your Wispr Flow hotkey (e.g. <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">Fn</kbd> or your chosen shortcut), and describe your logic.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-slate-100">English or Hinglish:</strong>
                <p className="text-slate-400">
                  Speak naturally in English (e.g., <em>"Find all prime numbers up to 50"</em>) or conversational Hinglish (e.g., <em>"Bhai prime numbers kaise find karein ek function banao"</em>).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-slate-100">Click & Learn:</strong>
                <p className="text-slate-400">
                  Click any line of generated Python to read what it does, why it was written, and run the code live in your browser with Pyodide!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <a
            href="https://wisprflow.ai/?promo_code=WEMAKEDEVS"
            target="_blank"
            rel="noreferrer"
            className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
          >
            <span>Wispr Flow Pro (1 Month Free)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
