import React from 'react';
import { Mic, Key, Globe2, Compass, Award } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onOpenWisprGuide: () => void;
  languageMode: 'english' | 'hinglish' | 'both';
  setLanguageMode: (mode: 'english' | 'hinglish' | 'both') => void;
  activeAppMode: 'studio' | 'duo';
  setActiveAppMode: (mode: 'studio' | 'duo') => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  onOpenApiKeyModal,
  onOpenWisprGuide,
  languageMode,
  setLanguageMode,
  activeAppMode,
  setActiveAppMode,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Hackathon Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-400 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
            <span className="text-2xl">🐍</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                PyVoice <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 font-extrabold">Tutor</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Wispr Flow Challenge
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Voice-First Python Learning • Speak Logic, Master Coding
            </p>
          </div>
        </div>

        {/* Central Mode Switcher: Studio vs PyDuo Quest */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveAppMode('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeAppMode === 'studio'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Voice Studio</span>
          </button>
          <button
            onClick={() => setActiveAppMode('duo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeAppMode === 'duo'
                ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">🐍</span>
            <span>PyDuo Quest (Duolingo)</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Explanation Language Selector */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/80 text-xs">
            <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => setLanguageMode('english')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                languageMode === 'english'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguageMode('hinglish')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                languageMode === 'hinglish'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguageMode('both')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                languageMode === 'both'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Dual
            </button>
          </div>

          {/* Wispr Flow Guide */}
          <button
            onClick={onOpenWisprGuide}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Wispr</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all shadow-sm ${
              hasApiKey
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-800 border-amber-500/40 text-amber-300 hover:bg-slate-700'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasApiKey ? 'Live AI' : 'Presets'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
