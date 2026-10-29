import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, AlertCircle, Sparkles, Check, Keyboard, Volume2 } from 'lucide-react';
import { cleanSpokenTranscription } from '../services/phoneticCleaner';
import { soundService } from '../services/soundService';

interface VoiceMicButtonProps {
  onTranscriptionComplete: (transcription: string) => void;
  label?: string;
  className?: string;
  suggestedHint?: string;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  onTranscriptionComplete,
  label = 'Tap to Speak with Your Voice 🎙️',
  className = '',
  suggestedHint,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [soundDetected, setSoundDetected] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 volume meter
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualText, setManualText] = useState('');

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioAnalysis();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Web Audio volume visualizer to prove mic is physically hearing the user's voice
  const startAudioAnalysis = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((average / 128) * 100));
            setAudioLevel(normalized);
            if (normalized > 15) {
              setSoundDetected(true);
            }
            animationFrameRef.current = requestAnimationFrame(checkLevel);
          };
          checkLevel();
        }
      }
    } catch (err) {
      console.warn('Audio visualizer notice:', err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  };

  const startListening = () => {
    soundService.playPop();
    setErrorMessage(null);
    setLiveTranscript('');
    setSoundDetected(false);
    transcriptRef.current = '';

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setShowManualInput(true);
      return;
    }

    try {
      // 1. Start audio wave visualizer
      startAudioAnalysis();

      // 2. Start speech recognition directly without stopping tracks
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / Hinglish
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        if (fullTranscript.trim()) {
          transcriptRef.current = fullTranscript;
          setLiveTranscript(fullTranscript);
        }
      };

      recognition.onspeechstart = () => {
        setSoundDetected(true);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Click the lock/camera icon in your address bar to allow mic permissions!');
        } else if (event.error === 'network') {
          setErrorMessage('Network error: Browser speech-to-text requires Google speech server connectivity. You can type or use the sample hint below!');
        } else if (event.error === 'no-speech') {
          // Keep listening or prompt hint
        }
      };

      recognition.onend = () => {
        // If still marked as listening and no error, try submitting whatever we heard
        const recorded = transcriptRef.current.trim();
        if (recorded) {
          setIsListening(false);
          stopAudioAnalysis();
          onTranscriptionComplete(cleanSpokenTranscription(recorded));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (err: any) {
      console.error('Error starting recognition:', err);
      setIsListening(false);
      stopAudioAnalysis();
      setErrorMessage('Could not initialize microphone. Please check your browser mic permissions.');
    }
  };

  const stopListening = () => {
    soundService.playPop();
    setIsListening(false);
    stopAudioAnalysis();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const recorded = transcriptRef.current.trim();
    if (recorded) {
      onTranscriptionComplete(cleanSpokenTranscription(recorded));
    } else if (suggestedHint) {
      // If user spoke but browser speech recognition server didn't transcribe text,
      // fallback to the suggested hint so the user isn't stuck!
      onTranscriptionComplete(suggestedHint);
    }
  };

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      soundService.playPop();
      onTranscriptionComplete(cleanSpokenTranscription(manualText.trim()));
      setManualText('');
      setShowManualInput(false);
    }
  };

  const handleUseHint = () => {
    if (suggestedHint) {
      soundService.playPop();
      onTranscriptionComplete(suggestedHint);
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {!isListening ? (
        <div className="space-y-2">
          {/* Main Tap to Speak Button */}
          <button
            type="button"
            onClick={startListening}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none group"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span>{label}</span>
          </button>

          {/* Wispr Flow Hotkey Note & Fallbacks */}
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
            {suggestedHint && (
              <button
                type="button"
                onClick={handleUseHint}
                className="text-purple-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>💡 Use spoken hint</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 ml-auto"
            >
              <Keyboard className="w-3 h-3" />
              <span>{showManualInput ? 'Hide' : 'Type instead'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Actively Recording State with Live Sound Level Waves */
        <div className="p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500/80 shadow-xl shadow-rose-950/50 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <span className="text-xs font-black text-rose-300 uppercase tracking-wide">
                Listening to Your Voice...
              </span>
            </div>

            <button
              type="button"
              onClick={stopListening}
              className="px-4 py-1.5 rounded-xl font-black text-xs uppercase bg-rose-500 hover:bg-rose-400 text-white flex items-center gap-1.5 shadow-md border-b-2 border-rose-700 active:border-b-0 cursor-pointer"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Done</span>
            </button>
          </div>

          {/* Real-time Sound Decibel Meter */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-rose-500/30">
            <Volume2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 transition-all duration-75"
                style={{ width: `${Math.max(8, audioLevel)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 w-10 text-right">
              {audioLevel > 15 ? 'Speaking' : 'Mic On'}
            </span>
          </div>

          {/* Live Streaming Transcript */}
          <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30 min-h-[46px] flex items-center">
            <p className="text-xs text-rose-200/95 italic font-sans leading-relaxed">
              {liveTranscript
                ? `"${liveTranscript}"`
                : soundDetected
                ? 'Hearing your voice... transcribing words...'
                : 'Speak now in plain English or Hinglish! (Click "Done" when finished)'}
            </p>
          </div>

          {/* Quick-Apply Hint while speaking if voice recognition service is lagging */}
          {suggestedHint && !liveTranscript && (
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={handleUseHint}
                className="text-[10px] text-amber-300 hover:underline font-bold"
              >
                Apply "{suggestedHint.slice(0, 32)}..." directly ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manual Input Fallback */}
      {showManualInput && (
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 animate-in fade-in duration-150">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
            placeholder="Type your spoken words, e.g. 'bhai check karo 42 even hai ya nahi'"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={!manualText.trim()}
            className="w-full py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40"
          >
            Submit Text
          </button>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{errorMessage}</p>
            {suggestedHint && (
              <button
                type="button"
                onClick={handleUseHint}
                className="mt-1 text-amber-300 font-bold underline block"
              >
                Click here to use sample hint instead
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
