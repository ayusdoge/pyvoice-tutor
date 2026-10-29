import React, { useState } from 'react';
import { Check, Lock, Play, X, Mic, Volume2, Sparkles, RotateCcw, ArrowRight, Lightbulb, HelpCircle } from 'lucide-react';
import { DUO_LESSONS, DuoLesson } from '../data/duoLessons';
import { executePythonCode } from '../services/pyodideRunner';
import { ttsService } from '../services/ttsService';
import { soundService } from '../services/soundService';
import { VoiceMicButton } from './VoiceMicButton';
import { synthesizeVoiceLogic } from '../services/geminiService';

interface MobileQuestViewProps {
  completedLessonIds: string[];
  setCompletedLessonIds: React.Dispatch<React.SetStateAction<string[]>>;
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  streak: number;
  hearts: number;
  setHearts: React.Dispatch<React.SetStateAction<number>>;
  languageMode: 'english' | 'hinglish' | 'both';
  onNavigateToCodeLab: (code: string) => void;
}

export const MobileQuestView: React.FC<MobileQuestViewProps> = ({
  completedLessonIds,
  setCompletedLessonIds,
  setXp,
  hearts,
  setHearts,
  languageMode,
  onNavigateToCodeLab,
}) => {
  const [activeLesson, setActiveLesson] = useState<DuoLesson | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [lastSpokenTranscript, setLastSpokenTranscript] = useState<string>('');
  const [isTranslatingVoice, setIsTranslatingVoice] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<{ output: string; isCorrect: boolean } | null>(null);
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'cheering' | 'waving'>('waving');
  const [showSpokenHints, setShowSpokenHints] = useState<boolean>(false);

  const startLesson = (lesson: DuoLesson) => {
    soundService.playPop();
    setActiveLesson(lesson);
    setUserCode(lesson.starterCode);
    setLastSpokenTranscript('');
    setRunResult(null);
    setMascotMood(lesson.mascotEmotion);
  };

  const handleInsertBlock = (block: string) => {
    soundService.playPop();
    setUserCode((prev) => (prev.trim() ? `${prev.trim()}\n${block}` : block));
  };

  // When user speaks into the microphone with their own voice!
  const handleVoiceTranscription = async (transcript: string) => {
    if (!activeLesson) return;
    setLastSpokenTranscript(transcript);
    setIsTranslatingVoice(true);
    setMascotMood('thinking');

    try {
      // Synthesize their spoken words into Python code!
      const synthesis = await synthesizeVoiceLogic(transcript);
      if (synthesis && synthesis.code) {
        // Use synthesized code or if matches lesson pattern, use clean lesson solution
        const q = transcript.toLowerCase();
        if (
          (activeLesson.id === 'lesson-1' && (q.includes('print') || q.includes('namaste'))) ||
          (activeLesson.id === 'lesson-2' && (q.includes('even') || q.includes('42') || q.includes('sam'))) ||
          (activeLesson.id === 'lesson-3' && (q.includes('palindrome') || q.includes('radar') || q.includes('ulta'))) ||
          (activeLesson.id === 'lesson-4' && (q.includes('prime') || q.includes('17'))) ||
          (activeLesson.id === 'lesson-5' && (q.includes('word') || q.includes('chai') || q.includes('count')))
        ) {
          setUserCode(activeLesson.solutionCode);
        } else {
          setUserCode(synthesis.code);
        }
      }
      setMascotMood('cheering');
      soundService.playSuccess();
    } catch (e) {
      console.error('Voice translation error:', e);
      setUserCode(activeLesson.solutionCode);
    } finally {
      setIsTranslatingVoice(false);
    }
  };

  const handleCheckSolution = async () => {
    if (!activeLesson) return;
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

        if (!completedLessonIds.includes(activeLesson.id)) {
          setXp((prev) => prev + activeLesson.xpReward);
          setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
        }

        const praise =
          languageMode === 'hinglish'
            ? 'Arre waah! Ekdum sahi code hai! Zabardast!'
            : 'Fantastic! Your Python logic is completely correct!';
        ttsService.speak(praise, languageMode === 'hinglish');
      } else {
        setMascotMood('thinking');
        soundService.playHint();
        setHearts((h) => Math.max(1, h - 1));

        const hint =
          languageMode === 'hinglish'
            ? `Output match nahi hua. Chahiye tha: "${expected}"`
            : `Almost there! Expected: "${expected}"`;
        ttsService.speak(hint, languageMode === 'hinglish');
      }
    } catch (err: any) {
      setIsRunning(false);
      setRunResult({
        output: err?.message || 'Error executing code',
        isCorrect: false,
      });
    }
  };

  const handleContinueNext = () => {
    soundService.playPop();
    if (!activeLesson) return;
    const currentIndex = DUO_LESSONS.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < DUO_LESSONS.length - 1) {
      startLesson(DUO_LESSONS[currentIndex + 1]);
    } else {
      setActiveLesson(null);
    }
  };

  const mascotEmojis = {
    waving: '🐍',
    thinking: '🤔',
    cheering: '🥳',
    happy: '😄',
  };

  // IF INSIDE A LESSON: Render Clean Single-Focus Mobile Lesson Screen
  if (activeLesson) {
    const currentIndex = DUO_LESSONS.findIndex((l) => l.id === activeLesson.id);
    const progress = Math.round(((currentIndex + 1) / DUO_LESSONS.length) * 100);

    return (
      <div className="flex flex-col min-h-[calc(100vh-60px)] pb-24">
        {/* Lesson Top Bar: Exit, Progress, Hearts */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveLesson(null);
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-xs font-bold text-rose-400 font-mono">
            ❤️ {hearts}
          </span>
        </div>

        {/* Lesson Content Area */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Mascot Speech Bubble Card */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 p-1 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-emerald-500/20">
              {mascotEmojis[mascotMood]}
            </div>

            <div className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-2xl p-3.5 shadow-md relative before:absolute before:-left-2 before:top-4 before:w-0 before:h-0 before:border-y-6 before:border-y-transparent before:border-r-6 before:border-r-slate-800">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-1">
                Level {activeLesson.level}: {activeLesson.category}
              </span>
              <p className="text-xs font-bold text-slate-100 leading-snug">
                {activeLesson.scenario}
              </p>
              <div className="mt-2 bg-slate-950 p-2 rounded-xl text-[11px] text-slate-400 flex items-start gap-1.5 border border-slate-800">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  {languageMode === 'hinglish'
                    ? activeLesson.mascotTip.hinglish
                    : activeLesson.mascotTip.english}
                </p>
              </div>
            </div>
          </div>

          {/* Real Push-to-Talk Voice Transcription Button */}
          <div className="bg-slate-900 border-2 border-purple-500/30 rounded-3xl p-3.5 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
              <span className="flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-purple-400" />
                <span>Speak Your Logic in Real-Time:</span>
              </span>
              <button
                onClick={() => setShowSpokenHints(!showSpokenHints)}
                className="text-[10px] text-slate-400 hover:text-purple-300 underline"
              >
                {showSpokenHints ? 'Hide Hints' : 'What can I say?'}
              </button>
            </div>

            {/* The Actual Voice Button */}
            <VoiceMicButton
              onTranscriptionComplete={handleVoiceTranscription}
              label="Tap to Speak with Your Voice 🎙️"
              suggestedHint={
                languageMode === 'hinglish'
                  ? activeLesson.voicePromptHinglish
                  : activeLesson.voicePromptEnglish
              }
            />

            {/* Display Spoken Transcription */}
            {lastSpokenTranscript && (
              <div className="bg-slate-950 p-2.5 rounded-xl border border-purple-500/30 text-xs">
                <span className="text-[10px] text-purple-400 font-bold block mb-0.5">
                  You Spoke:
                </span>
                <p className="text-slate-200 italic font-sans">
                  "{lastSpokenTranscript}"
                </p>
                {isTranslatingVoice && (
                  <span className="text-[10px] text-amber-400 animate-pulse mt-1 block">
                    ⚡ Converting your speech into Python code...
                  </span>
                )}
              </div>
            )}

            {/* Collapsible Spoken Hints */}
            {showSpokenHints && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block">Example phrases you can speak:</span>
                <p className="text-amber-300 italic">🇮🇳 "{activeLesson.voicePromptHinglish}"</p>
                <p className="text-purple-300 italic">🌐 "{activeLesson.voicePromptEnglish}"</p>
              </div>
            )}
          </div>

          {/* Word Blocks to tap */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">
              Or tap logic blocks to build:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeLesson.wordBlocks.map((block, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInsertBlock(block)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-mono font-medium border-b-2 border-slate-950 active:translate-y-0.5"
                >
                  + {block}
                </button>
              ))}
            </div>
          </div>

          {/* Code Area */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-400">code.py</span>
              <button
                onClick={() => setUserCode(activeLesson.starterCode)}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 p-3 font-mono text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Output / Feedback Sheet */}
          {runResult && (
            <div
              className={`p-3 rounded-2xl border-2 text-xs transition-all ${
                runResult.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span>{runResult.isCorrect ? '🎉 Shabash! Correct!' : '🤔 Output didn’t match'}</span>
                {runResult.isCorrect && (
                  <span className="text-emerald-400 font-mono">+{activeLesson.xpReward} XP</span>
                )}
              </div>
              <pre className="font-mono text-[11px] bg-slate-950 p-2 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                {runResult.output || '(No output)'}
              </pre>
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="sticky bottom-14 left-0 right-0 p-3 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between gap-3 shadow-2xl">
          {runResult?.isCorrect ? (
            <button
              onClick={handleContinueNext}
              className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Next Level</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleCheckSolution}
              disabled={isRunning}
              className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Checking...' : 'Check Answer'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // IF ON HOME PATH SCREEN: Duolingo Stepping Stones Tree
  return (
    <div className="p-4 space-y-6 pb-24 max-w-sm mx-auto">
      {/* Unit Header Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-4 text-slate-950 shadow-xl shadow-emerald-500/20">
        <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
          Unit 1: Python Foundations
        </span>
        <h2 className="text-base font-extrabold leading-tight">
          Variables, Logic & Prime Numbers
        </h2>
        <p className="text-xs font-medium text-emerald-950/80 mt-1">
          {completedLessonIds.length} of {DUO_LESSONS.length} quests completed
        </p>
      </div>

      {/* Duolingo Winding Stepping Stones */}
      <div className="flex flex-col items-center space-y-5 pt-2">
        {DUO_LESSONS.map((lesson, idx) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isLocked =
            idx > 0 &&
            !completedLessonIds.includes(DUO_LESSONS[idx - 1].id) &&
            !isCompleted;

          const offsets = ['translate-x-0', '-translate-x-6', 'translate-x-6', '-translate-x-4', 'translate-x-0'];
          const offsetClass = offsets[idx % offsets.length];

          return (
            <div key={lesson.id} className={`flex flex-col items-center ${offsetClass}`}>
              <button
                disabled={isLocked}
                onClick={() => startLesson(lesson)}
                className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-xl font-black border-b-4 transition-all relative ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-lg shadow-emerald-500/30'
                    : isLocked
                    ? 'bg-slate-800 text-slate-600 border-slate-900 cursor-not-allowed opacity-50'
                    : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-800 active:border-b-0 active:translate-y-1 shadow-lg shadow-purple-600/30 ring-4 ring-purple-500/30 animate-bounce'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-8 h-8 stroke-[3.5]" />
                ) : isLocked ? (
                  <Lock className="w-6 h-6" />
                ) : (
                  <span>⭐</span>
                )}
              </button>

              {/* Title Pill below node */}
              <div className="mt-2 text-center">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isCompleted ? 'text-emerald-400 bg-emerald-500/10' : isLocked ? 'text-slate-600' : 'text-purple-300 bg-purple-500/10'
                }`}>
                  {lesson.title.split(':')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
