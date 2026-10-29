import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Heart, CheckCircle2, Lock, ArrowRight, Play, Volume2, Mic, RotateCcw, Award, Lightbulb, Check, HelpCircle } from 'lucide-react';
import { DUO_LESSONS, DuoLesson } from '../data/duoLessons';
import { executePythonCode } from '../services/pyodideRunner';
import { ttsService } from '../services/ttsService';
import { soundService } from '../services/soundService';

interface PyDuoQuestProps {
  onBackToStudio: () => void;
  languageMode: 'english' | 'hinglish' | 'both';
}

export const PyDuoQuest: React.FC<PyDuoQuestProps> = ({
  onBackToStudio,
  languageMode,
}) => {
  // Gamification states from localStorage
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('pyduo_xp');
    return saved ? parseInt(saved, 10) : 40;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('pyduo_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [hearts, setHearts] = useState<number>(5);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pyduo_completed');
    return saved ? JSON.parse(saved) : ['lesson-1'];
  });

  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(1);
  const activeLesson = DUO_LESSONS[activeLessonIndex];

  const [userCode, setUserCode] = useState<string>(activeLesson.starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<{ output: string; isCorrect: boolean } | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'cheering' | 'waving'>('waving');

  // Sync userCode when active lesson changes
  useEffect(() => {
    setUserCode(activeLesson.starterCode);
    setRunResult(null);
    setMascotMood(activeLesson.mascotEmotion);
  }, [activeLessonIndex, activeLesson]);

  // Persist XP and Completed
  useEffect(() => {
    localStorage.setItem('pyduo_xp', xp.toString());
    localStorage.setItem('pyduo_completed', JSON.stringify(completedLessonIds));
    localStorage.setItem('pyduo_streak', streak.toString());
  }, [xp, completedLessonIds, streak]);

  const handleUseVoicePrompt = (isHinglish: boolean) => {
    soundService.playPop();
    const prompt = isHinglish
      ? activeLesson.voicePromptHinglish
      : activeLesson.voicePromptEnglish;
    setUserCode(activeLesson.solutionCode);
    setMascotMood('cheering');
    ttsService.speak(prompt, isHinglish);
  };

  const handleInsertBlock = (block: string) => {
    soundService.playPop();
    setUserCode((prev) => (prev.trim() ? `${prev.trim()}\n${block}` : block));
  };

  const handleRunAndCheck = async () => {
    soundService.playPop();
    setIsRunning(true);
    setRunResult(null);
    setMascotMood('thinking');

    try {
      const result = await executePythonCode(userCode);
      const output = (result.output || '').trim();
      const expected = activeLesson.expectedOutput.trim();

      const isMatch =
        output.toLowerCase().includes(expected.toLowerCase()) ||
        output === expected;

      setIsRunning(false);
      setRunResult({ output, isCorrect: isMatch });

      if (isMatch) {
        setMascotMood('cheering');
        soundService.playSuccess();

        // Award XP
        const isFirstTime = !completedLessonIds.includes(activeLesson.id);
        if (isFirstTime) {
          setXp((prev) => prev + activeLesson.xpReward);
          setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
        }

        setShowCelebration(true);
        // Mascot speaks praise
        const praise =
          languageMode === 'hinglish'
            ? 'Arre waah! Ekdum sahi code likha hai! Next level unlocked!'
            : 'Fantastic! Your Python logic is completely correct! Level unlocked!';
        ttsService.speak(praise, languageMode === 'hinglish');
      } else {
        setMascotMood('thinking');
        soundService.playHint();
        setHearts((h) => Math.max(1, h - 1));

        const hint =
          languageMode === 'hinglish'
            ? `Output match nahi hua. Chahiye tha: "${expected}"`
            : `Almost there! Expected output was: "${expected}"`;
        ttsService.speak(hint, languageMode === 'hinglish');
      }
    } catch (err: any) {
      setIsRunning(false);
      setRunResult({
        output: err?.message || 'Error executing Python code',
        isCorrect: false,
      });
    }
  };

  const handleNextLevel = () => {
    soundService.playPop();
    setShowCelebration(false);
    if (activeLessonIndex < DUO_LESSONS.length - 1) {
      setActiveLessonIndex((prev) => prev + 1);
    }
  };

  const mascotEmojis = {
    waving: '🐍',
    thinking: '🤔',
    cheering: '🥳',
    happy: '😄',
  };

  const progressPercent = Math.round(
    ((activeLessonIndex + 1) / DUO_LESSONS.length) * 100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Friendly Top Gamification Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mascot & Level Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-green-500 p-1 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 transform hover:scale-105 transition-transform cursor-pointer">
            {mascotEmojis[mascotMood]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">PyDuo Quest</h2>
              <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Level {activeLesson.level} of {DUO_LESSONS.length}
              </span>
            </div>
            {/* Duolingo-style Progress Bar */}
            <div className="flex items-center gap-2 mt-1.5 w-48 sm:w-60">
              <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono text-emerald-400">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Stats: Streak, XP, Hearts & Friendly Exit */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Streak 3D Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-300 text-xs font-black shadow-sm">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{streak} Days</span>
          </div>

          {/* XP 3D Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 text-purple-300 text-xs font-black shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400" />
            <span>{xp} XP</span>
          </div>

          {/* Hearts 3D Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-300 text-xs font-black shadow-sm">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>{hearts}</span>
          </div>

          {/* Back Button with tactile 3D style */}
          <button
            onClick={() => {
              soundService.playPop();
              onBackToStudio();
            }}
            className="text-xs font-bold px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
          >
            Exit Quest
          </button>
        </div>
      </div>

      {/* Main Dual Layout: Skill Tree (Left) & Active Lesson Arena (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Duolingo Skill Tree Path */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Path to Python Mastery</span>
            </h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              {completedLessonIds.length} / {DUO_LESSONS.length} Done
            </span>
          </div>

          {/* Skill Tree Stepper Nodes */}
          <div className="space-y-3">
            {DUO_LESSONS.map((lesson, idx) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              const isActive = activeLessonIndex === idx;
              const isLocked = idx > 0 && !completedLessonIds.includes(DUO_LESSONS[idx - 1].id) && !isCompleted;

              return (
                <button
                  key={lesson.id}
                  disabled={isLocked}
                  onClick={() => {
                    soundService.playPop();
                    setActiveLessonIndex(idx);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-900/20 ring-2 ring-purple-500/30'
                      : isCompleted
                      ? 'bg-emerald-950/20 hover:bg-emerald-950/30 border-emerald-500/40'
                      : isLocked
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                      : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Circle badge */}
                    <div
                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border-b-2 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 border-emerald-700'
                          : isActive
                          ? 'bg-purple-600 text-white border-purple-800 animate-pulse'
                          : isLocked
                          ? 'bg-slate-800 text-slate-600 border-slate-900'
                          : 'bg-slate-800 text-slate-300 border-slate-900'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold leading-tight ${isActive ? 'text-purple-200' : isLocked ? 'text-slate-500' : 'text-slate-200'}`}>
                        {lesson.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {lesson.concept}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold font-mono text-amber-400 shrink-0">
                    +{lesson.xpReward} XP
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Challenge Arena */}
        <div className="lg:col-span-8 space-y-4">
          {/* Mascot Speech Bubble Card with Tail */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-green-400 p-2 text-3xl sm:text-4xl flex items-center justify-center shrink-0 shadow-xl shadow-emerald-500/20 transform hover:rotate-6 transition-transform">
              {mascotEmojis[mascotMood]}
            </div>

            {/* Duolingo Speech Bubble */}
            <div className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl relative before:absolute before:-left-2.5 before:top-5 before:w-0 before:h-0 before:border-y-8 before:border-y-transparent before:border-r-8 before:border-r-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>PyDuo the Tutor</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-normal">{activeLesson.category}</span>
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  +{activeLesson.xpReward} XP
                </span>
              </div>

              {/* Scenario */}
              <p className="text-sm font-bold text-slate-100 leading-snug">
                {activeLesson.scenario}
              </p>

              {/* Friendly Hint Box */}
              <div className="mt-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {languageMode === 'hinglish'
                    ? activeLesson.mascotTip.hinglish
                    : activeLesson.mascotTip.english}
                </p>
              </div>
            </div>
          </div>

          {/* Voice Logic Quick-Speak Helpers (Wispr Flow) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-purple-300">
                <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>Option A: Speak with Wispr Flow (Hold key & say):</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Click pill to autofill
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Hinglish Voice Prompt */}
              <button
                onClick={() => handleUseVoicePrompt(true)}
                className="text-left p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/30 transition-all group flex items-start justify-between gap-2 border-b-4 border-amber-600 active:border-b-2 active:translate-y-0.5"
              >
                <div>
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wide block mb-1">
                    🇮🇳 Hinglish Voice Note:
                  </span>
                  <p className="text-xs text-slate-200 group-hover:text-amber-200 font-semibold italic">
                    "{activeLesson.voicePromptHinglish}"
                  </p>
                </div>
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              </button>

              {/* English Voice Prompt */}
              <button
                onClick={() => handleUseVoicePrompt(false)}
                className="text-left p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border-2 border-purple-500/30 transition-all group flex items-start justify-between gap-2 border-b-4 border-purple-600 active:border-b-2 active:translate-y-0.5"
              >
                <div>
                  <span className="text-[10px] font-black text-purple-300 uppercase tracking-wide block mb-1">
                    🌐 English Voice Note:
                  </span>
                  <p className="text-xs text-slate-200 group-hover:text-purple-200 font-semibold italic">
                    "{activeLesson.voicePromptEnglish}"
                  </p>
                </div>
                <Volume2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              </button>
            </div>
          </div>

          {/* Option B: Clickable Word Blocks / Logic Tiles */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-2.5 shadow-xl">
            <span className="text-xs font-bold text-slate-300 block">
              Option B: Tap Logic Blocks to assemble code:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeLesson.wordBlocks.map((block, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInsertBlock(block)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-900/40 text-purple-300 hover:text-white border-2 border-purple-500/30 text-xs font-mono font-semibold transition-all border-b-4 border-slate-950 active:border-b-2 active:translate-y-0.5 cursor-pointer shadow-sm"
                >
                  + {block}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Code Editor & Tactile 3D Action Bar */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 font-bold flex items-center gap-2">
                <span className="text-emerald-400">🐍</span> logic_editor.py
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundService.playPop();
                    setUserCode(activeLesson.starterCode);
                  }}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2.5 py-1 rounded-xl bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => {
                    soundService.playPop();
                    setUserCode(activeLesson.solutionCode);
                  }}
                  className="text-[11px] font-bold text-purple-300 hover:text-white px-2.5 py-1 rounded-xl bg-purple-900/30 border border-purple-500/40 transition-colors"
                >
                  Reveal Solution
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={6}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 font-mono text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-medium resize-none leading-relaxed"
                placeholder="# Speak your logic or tap the blocks above..."
              />
            </div>

            {/* Run & Verify Action Bar with Signature Duolingo 3D Button */}
            <div className="px-5 py-3.5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Target Output: <code className="text-purple-300 font-mono font-bold bg-purple-950/40 px-2 py-0.5 rounded-lg border border-purple-500/30">{activeLesson.expectedOutput}</code>
              </div>

              <button
                onClick={handleRunAndCheck}
                disabled={isRunning}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'Checking Logic...' : 'Check Solution'}</span>
              </button>
            </div>
          </div>

          {/* Test Execution Output Box */}
          {runResult && (
            <div
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all ${
                runResult.isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200 shadow-xl shadow-emerald-500/10'
                  : 'bg-rose-950/30 border-rose-500/60 text-rose-200 shadow-xl shadow-rose-500/10'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="flex items-center gap-2 text-sm">
                  {runResult.isCorrect ? '🎉 Shabash! Solution Verified!' : '🤔 Almost there! Output didn’t match'}
                </span>
                {runResult.isCorrect && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black font-mono text-xs border border-emerald-500/40">
                    +{activeLesson.xpReward} XP Gained!
                  </span>
                )}
              </div>
              <pre className="font-mono text-xs sm:text-sm bg-slate-950 p-3 rounded-2xl border border-slate-800 whitespace-pre-wrap">
                {runResult.output || '(No output returned)'}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Level Completed Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl shadow-emerald-500/30 relative">
            <div className="text-6xl animate-bounce">🏆</div>
            <h3 className="text-2xl font-black text-white">
              Shabash! Quest Complete!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You mastered <strong>{activeLesson.title}</strong> and earned{' '}
              <strong className="text-amber-400">+{activeLesson.xpReward} XP</strong>!
            </p>

            <div className="py-2 flex items-center justify-center gap-3">
              <span className="px-3.5 py-1.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black font-mono">
                Total XP: {xp}
              </span>
              <span className="px-3.5 py-1.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black font-mono">
                {streak} Day Streak 🔥
              </span>
            </div>

            <div className="pt-3 flex gap-3 justify-center">
              <button
                onClick={() => {
                  soundService.playPop();
                  setShowCelebration(false);
                }}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all"
              >
                Review Code
              </button>
              <button
                onClick={handleNextLevel}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <span>Continue Quest</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
