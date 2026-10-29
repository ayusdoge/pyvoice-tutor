import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, X, Volume2 } from 'lucide-react';

interface VoiceInputBarProps {
  query: string;
  setQuery: (q: string) => void;
  onSubmit: (q: string) => void;
  isLoading: boolean;
}

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  query,
  setQuery,
  onSubmit,
  isLoading,
}) => {
  const [isListeningBrowser, setIsListeningBrowser] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / Hinglish friendly

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setQuery(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListeningBrowser(false);
      };

      recognition.onend = () => {
        setIsListeningBrowser(false);
      };

      setSpeechRecognition(recognition);
    }
  }, [setQuery]);

  const toggleBrowserListening = () => {
    if (!speechRecognition) return;
    if (isListeningBrowser) {
      speechRecognition.stop();
      setIsListeningBrowser(false);
    } else {
      try {
        speechRecognition.start();
        setIsListeningBrowser(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onSubmit(query.trim());
      }
    }
  };

  const clearText = () => {
    setQuery('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl shadow-black/40 relative overflow-hidden transition-all duration-300 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/20">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info Banner */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium">
            <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Wispr Flow Dictation Ready</span>
          </div>
          <span className="text-slate-500 text-xs hidden sm:inline">•</span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            Speak your logic in plain English or natural Hinglish
          </span>
        </div>

        {/* Audio Visualizer Waves when typing or listening */}
        {(query.length > 0 || isListeningBrowser) && (
          <div className="flex items-center gap-1 h-5 px-2">
            <span className="w-1 bg-purple-400 rounded-full sound-bar" />
            <span className="w-1 bg-indigo-400 rounded-full sound-bar" />
            <span className="w-1 bg-emerald-400 rounded-full sound-bar" />
            <span className="w-1 bg-purple-400 rounded-full sound-bar" />
            <span className="w-1 bg-indigo-400 rounded-full sound-bar" />
          </div>
        )}
      </div>

      {/* Textarea for spoken prompt */}
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak or paste your logic here... e.g., 'bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein' or 'take a list of numbers, keep only evens and sum them'"
          rows={3}
          className="w-full bg-slate-950/80 text-slate-100 placeholder:text-slate-500 rounded-xl p-3.5 pr-12 text-sm border border-slate-800/80 focus:outline-none focus:border-purple-500/50 resize-none font-sans leading-relaxed"
        />

        {query && (
          <button
            onClick={clearText}
            className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-800 transition-colors"
            title="Clear prompt"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3.5 pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-slate-300">
            Cmd/Ctrl + Enter
          </kbd>
          <span className="hidden sm:inline">to synthesize & explain</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Browser Speech fallback button */}
          {speechSupported && (
            <button
              onClick={toggleBrowserListening}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                isListeningBrowser
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
              }`}
              title="Toggle Browser Microphone"
            >
              {isListeningBrowser ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Listening... Click to Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  <span>Browser Mic</span>
                </>
              )}
            </button>
          )}

          {/* Submit Synthesize Button */}
          <button
            onClick={() => query.trim() && onSubmit(query.trim())}
            disabled={!query.trim() || isLoading}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md ${
              query.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25 cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-purple-300" />
                <span>Translating Voice Logic...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Generate Python & Explain</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
