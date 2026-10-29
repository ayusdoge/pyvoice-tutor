import React, { useState } from 'react';
import { Key, Globe2, Mic, Trash2, Cpu, Volume2, Play, UserCheck, Sparkles } from 'lucide-react';
import { getActiveApiKey, saveApiKey, getSelectedAiModel, setSelectedAiModel } from '../services/geminiService';
import { ttsService, VOICE_PERSONAS, VoicePersona, VoiceOption } from '../services/ttsService';
import { soundService } from '../services/soundService';

interface MobileSettingsViewProps {
  languageMode: 'english' | 'hinglish' | 'both';
  setLanguageMode: (mode: 'english' | 'hinglish' | 'both') => void;
  onOpenWisprGuide: () => void;
}

export const MobileSettingsView: React.FC<MobileSettingsViewProps> = ({
  languageMode,
  setLanguageMode,
  onOpenWisprGuide,
}) => {
  const [apiKey, setApiKey] = useState(getActiveApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedModel, setSelectedModel] = useState(getSelectedAiModel());
  const [selectedPersona, setSelectedPersona] = useState<VoiceOption>(ttsService.getSelectedPersona());
  const [speechRate, setSpeechRate] = useState(ttsService.getSpeechRate());
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const handleSelectPersona = (persona: VoiceOption) => {
    soundService.playPop();
    setSelectedPersona(persona);
    ttsService.setSelectedPersona(persona.id);
  };

  const handlePreviewPersona = (persona: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.playPop();
    setPreviewingId(persona.id);
    const phrase =
      languageMode === 'hinglish' ? persona.sampleHinglish : persona.sampleEnglish;
    // Set active persona temporarily to preview
    ttsService.setSelectedPersona(persona.id);
    setSelectedPersona(persona);
    ttsService.speak(phrase, languageMode === 'hinglish', () => {
      setPreviewingId(null);
    });
  };

  const handleSaveKey = () => {
    soundService.playSuccess();
    saveApiKey(apiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearKey = () => {
    soundService.playPop();
    setApiKey('');
    saveApiKey('');
  };

  const handleModelChange = (model: string) => {
    soundService.playPop();
    setSelectedModel(model);
    setSelectedAiModel(model);
  };

  const handleRateChange = (rate: number) => {
    soundService.playPop();
    setSpeechRate(rate);
    ttsService.setSpeechRate(rate);
  };

  return (
    <div className="p-4 space-y-4 pb-24 max-w-sm mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-base font-black text-white">Voice & Audio Settings</h2>
        <p className="text-xs text-slate-400">Choose your tutor's voice, gender, and Indian accent</p>
      </div>

      {/* Voice Persona Selector (Male/Female, Indian/Global) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span>Tutor Voice & Accent</span>
          </div>
          <span className="text-[10px] text-purple-300 font-mono">
            {selectedPersona.gender === 'female' ? '👩 Female' : '👨 Male'} • {selectedPersona.accent}
          </span>
        </div>

        {/* Persona Options Grid */}
        <div className="space-y-2">
          {VOICE_PERSONAS.map((p) => {
            const isSelected = selectedPersona.id === p.id;
            const isPreviewing = previewingId === p.id;

            return (
              <div
                key={p.id}
                onClick={() => handleSelectPersona(p)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500/40'
                    : 'bg-slate-950/60 hover:bg-slate-850/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{p.gender === 'female' ? '👩' : '👨'}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-100">{p.name}</span>
                        <span className="text-xs">{p.flag}</span>
                      </div>
                      <span className="text-[10px] text-purple-300 font-medium block">
                        {p.badge}
                      </span>
                    </div>
                  </div>

                  {/* Preview Voice Button */}
                  <button
                    onClick={(e) => handlePreviewPersona(p, e)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                      isPreviewing
                        ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="Preview how this voice speaks"
                  >
                    <Play className="w-3 h-3 fill-current text-purple-400" />
                    <span>{isPreviewing ? 'Playing' : 'Listen'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Speed Slider / Pills */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span>Speaking Speed</span>
          <span className="text-[10px] text-purple-400 font-mono">{speechRate}x</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { rate: 0.82, label: '0.8x (Calm)' },
            { rate: 0.93, label: '1.0x (Natural)' },
            { rate: 1.12, label: '1.1x (Brisk)' },
          ].map((item) => (
            <button
              key={item.rate}
              onClick={() => handleRateChange(item.rate)}
              className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                Math.abs(speechRate - item.rate) < 0.05
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation Language Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2.5 shadow-md">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Globe2 className="w-4 h-4 text-purple-400" />
          <span>Language Output</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {(['english', 'hinglish', 'both'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                soundService.playPop();
                setLanguageMode(mode);
              }}
              className={`py-2 px-1 text-xs font-bold rounded-2xl border transition-all ${
                languageMode === mode
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {mode === 'english' ? 'English' : mode === 'hinglish' ? 'Hinglish 🇮🇳' : 'Dual Mode'}
            </button>
          ))}
        </div>
      </div>

      {/* AI Voice Reasoning Model */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2 shadow-md">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>AI Reasoning Model</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Gemini 2.0</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {[
            { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Recommended)' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModelChange(m.id)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedModel === m.id
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gemini API Key */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <div className="flex items-center gap-1.5">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Gemini API Key</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${apiKey ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {apiKey ? 'Active' : 'Offline Presets'}
          </span>
        </div>

        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIzaSy..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSaveKey}
            className="flex-1 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white border-b-2 border-purple-800 active:border-b-0"
          >
            {savedSuccess ? 'Saved!' : 'Save Key'}
          </button>
          {apiKey && (
            <button
              onClick={handleClearKey}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Wispr Flow Guide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Mic className="w-4 h-4 text-purple-400" />
            <span>Wispr Flow Dictation</span>
          </div>
          <button
            onClick={onOpenWisprGuide}
            className="text-[11px] text-purple-400 hover:underline"
          >
            Guide
          </button>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Hold your Wispr Flow hotkey (e.g. Fn) anywhere in the app to speak your programming logic!
        </p>
      </div>
    </div>
  );
};
