import { useState, useEffect } from 'react';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { MobileQuestView } from './components/MobileQuestView';
import { MobileStudioView } from './components/MobileStudioView';
import { MobileCodeView } from './components/MobileCodeView';
import { MobileSettingsView } from './components/MobileSettingsView';
import { WisprGuideModal } from './components/WisprGuideModal';
import { PRESET_DATA } from './services/logicEngine';
import { synthesizeVoiceLogic } from './services/geminiService';
import { executePythonCode } from './services/pyodideRunner';
import { LogicSynthesisResult, ExecutionResult, PresetPrompt } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>('quest');
  const [languageMode, setLanguageMode] = useState<'english' | 'hinglish' | 'both'>('both');
  const [isWisprGuideOpen, setIsWisprGuideOpen] = useState<boolean>(false);

  // Gamification States
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('pyduo_xp');
    return saved ? parseInt(saved, 10) : 40;
  });

  const [streak] = useState<number>(() => {
    const saved = localStorage.getItem('pyduo_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [hearts, setHearts] = useState<number>(5);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pyduo_completed');
    return saved ? JSON.parse(saved) : ['lesson-1'];
  });

  // Studio & Code Lab States
  const [query, setQuery] = useState<string>(
    'bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein'
  );
  const [synthesisResult, setSynthesisResult] = useState<LogicSynthesisResult>(
    PRESET_DATA['prime-hinglish']
  );
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [isLoadingSynthesis, setIsLoadingSynthesis] = useState<boolean>(false);

  // Auto-run first code snippet for instant output
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRunCode(PRESET_DATA['prime-hinglish'].code);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSynthesize = async (spokenText: string) => {
    setIsLoadingSynthesis(true);
    try {
      const result = await synthesizeVoiceLogic(spokenText);
      setSynthesisResult(result);
      handleRunCode(result.code);
      // Auto-open Code Lab tab to view the generated result
      setActiveTab('code');
    } catch (err) {
      console.error('Synthesis failed:', err);
    } finally {
      setIsLoadingSynthesis(false);
    }
  };

  const handleRunCode = async (overrideCode?: string) => {
    const codeToRun = overrideCode || synthesisResult.code;
    if (!codeToRun || isRunningCode) return;
    setIsRunningCode(true);
    try {
      const res = await executePythonCode(codeToRun);
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({
        output: '',
        error: err?.message || 'Error running Python code in browser.',
        executionTimeMs: 0,
      });
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleSelectPreset = (preset: PresetPrompt) => {
    setQuery(preset.spokenQuery);
    if (PRESET_DATA[preset.id]) {
      const data = PRESET_DATA[preset.id];
      setSynthesisResult(data);
      handleRunCode(data.code);
      setActiveTab('code');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Clean Mobile App Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-slate-900 border-x border-slate-800 shadow-2xl flex flex-col relative overflow-x-hidden">
        {/* Top Header */}
        <MobileHeader
          streak={streak}
          xp={xp}
          hearts={hearts}
          languageMode={languageMode}
          setLanguageMode={setLanguageMode}
          onOpenSettings={() => setActiveTab('settings')}
        />

        {/* Tab Content Views */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'quest' && (
            <MobileQuestView
              completedLessonIds={completedLessonIds}
              setCompletedLessonIds={setCompletedLessonIds}
              xp={xp}
              setXp={setXp}
              streak={streak}
              hearts={hearts}
              setHearts={setHearts}
              languageMode={languageMode}
              onNavigateToCodeLab={(code) => {
                handleRunCode(code);
                setActiveTab('code');
              }}
            />
          )}

          {activeTab === 'studio' && (
            <MobileStudioView
              query={query}
              setQuery={setQuery}
              onSubmit={handleSynthesize}
              isLoading={isLoadingSynthesis}
              synthesisResult={synthesisResult}
              onOpenCodeLab={() => setActiveTab('code')}
              onSelectPreset={handleSelectPreset}
            />
          )}

          {activeTab === 'code' && (
            <MobileCodeView
              synthesisResult={synthesisResult}
              onRunCode={() => handleRunCode()}
              isRunning={isRunningCode}
              executionResult={executionResult}
              languageMode={languageMode}
            />
          )}

          {activeTab === 'settings' && (
            <MobileSettingsView
              languageMode={languageMode}
              setLanguageMode={setLanguageMode}
              onOpenWisprGuide={() => setIsWisprGuideOpen(true)}
            />
          )}
        </main>

        {/* Bottom Mobile Tab Bar */}
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />

        {/* Wispr Guide Modal */}
        <WisprGuideModal
          isOpen={isWisprGuideOpen}
          onClose={() => setIsWisprGuideOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
