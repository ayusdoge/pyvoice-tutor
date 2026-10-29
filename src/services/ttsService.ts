// Enhanced Multi-Engine Voice System: Neural AI (OpenAI/ElevenLabs) + Enhanced Studio Browser Voices
export type VoicePersona =
  | 'neural-nova'
  | 'neural-shimmer'
  | 'neural-echo'
  | 'neural-onyx'
  | 'indian-female'
  | 'indian-male'
  | 'global-female'
  | 'global-male';

export interface VoiceOption {
  id: VoicePersona;
  name: string;
  tutorName: string;
  gender: 'female' | 'male';
  accent: 'India' | 'Global' | 'Studio AI';
  flag: string;
  badge: string;
  engine: 'neural-ai' | 'device-hd';
  description: string;
  openaiVoice?: 'nova' | 'shimmer' | 'echo' | 'onyx' | 'fable' | 'alloy';
  sampleHinglish: string;
  sampleEnglish: string;
}

export const VOICE_PERSONAS: VoiceOption[] = [
  {
    id: 'neural-nova',
    name: 'Nova (Ultra-Realistic AI)',
    tutorName: 'Nova',
    gender: 'female',
    accent: 'Studio AI',
    flag: '✨',
    badge: 'Ultra-HD • Studio Human',
    engine: 'neural-ai',
    openaiVoice: 'nova',
    description: 'Vibrant, natural, human-like voice actor. State-of-the-art conversational AI.',
    sampleHinglish: 'Namaste! Main Nova hoon. Aaj Python coding ko ekdum aasan aur mazedaar banayenge!',
    sampleEnglish: 'Hello! I am Nova, your Python mentor. Let us write and test some clean code together!'
  },
  {
    id: 'neural-echo',
    name: 'Echo (Warm Studio AI)',
    tutorName: 'Echo',
    gender: 'male',
    accent: 'Studio AI',
    flag: '✨',
    badge: 'Warm • Studio Human',
    engine: 'neural-ai',
    openaiVoice: 'echo',
    description: 'Deep, warm, natural male voice with studio-grade articulation.',
    sampleHinglish: 'Hey there! Main Echo hoon. Python ke loops aur logic ko step-by-step master karte hain.',
    sampleEnglish: 'Welcome! I am Echo. I will walk you through your Python algorithm step by step.'
  },
  {
    id: 'neural-shimmer',
    name: 'Shimmer (Calm Studio AI)',
    tutorName: 'Shimmer',
    gender: 'female',
    accent: 'Studio AI',
    flag: '✨',
    badge: 'Calm • Empathetic AI',
    engine: 'neural-ai',
    openaiVoice: 'shimmer',
    description: 'Gentle, articulate, patient tutor voice. Ideal for deep learning sessions.',
    sampleHinglish: 'Namaste! Main Shimmer hoon. Koi jaldi nahi hai, aaram se har line ka matlab samjhenge.',
    sampleEnglish: 'Hi! I am Shimmer. Take your time, and we will inspect each line of your code carefully.'
  },
  {
    id: 'neural-onyx',
    name: 'Onyx (Deep Studio AI)',
    tutorName: 'Onyx',
    gender: 'male',
    accent: 'Studio AI',
    flag: '✨',
    badge: 'Deep • Authoritative',
    engine: 'neural-ai',
    openaiVoice: 'onyx',
    description: 'Resonant, crisp, executive tutor voice with impeccable clarity.',
    sampleHinglish: 'Hello! Main Onyx hoon. Chaliye aapke code ko Pyodide WebAssembly me run karke verify karte hain.',
    sampleEnglish: 'Hello! I am Onyx. Let us execute this Python code and evaluate its time complexity.'
  },
  {
    id: 'indian-female',
    name: 'Priya (Indian Female HD)',
    tutorName: 'Priya',
    gender: 'female',
    accent: 'India',
    flag: '🇮🇳',
    badge: 'Natural Indian Accent',
    engine: 'device-hd',
    description: 'Clear Indian female voice. Filtered for high-fidelity browser engines.',
    sampleHinglish: 'Namaste! Main Priya hoon. Chaliye saath me prime numbers aur lists samajhte hain!',
    sampleEnglish: 'Hello! I am Priya. Let us break down your Python logic line-by-line together!'
  },
  {
    id: 'indian-male',
    name: 'Rohan (Indian Male HD)',
    tutorName: 'Rohan',
    gender: 'male',
    accent: 'India',
    flag: '🇮🇳',
    badge: 'Conversational Indian Accent',
    engine: 'device-hd',
    description: 'Energetic, friendly Indian male voice. Sounds like a helpful peer.',
    sampleHinglish: 'Bhai suno, main Rohan hoon! Python bilkul aasan hai, chaliye code karte hain.',
    sampleEnglish: 'Hey there! I am Rohan. Let us turn your spoken thoughts into working Python code!'
  },
  {
    id: 'global-female',
    name: 'Sarah (Global HD Female)',
    tutorName: 'Sarah',
    gender: 'female',
    accent: 'Global',
    flag: '🌐',
    badge: 'Crisp Standard Voice',
    engine: 'device-hd',
    description: 'High-definition modern English voice with clear enunciation.',
    sampleHinglish: 'Namaste! I am Sarah. I will guide you through Python syntax and best practices.',
    sampleEnglish: 'Hi! I am Sarah, your voice programming tutor. Ready to run your Python code?'
  },
  {
    id: 'global-male',
    name: 'Alex (Global HD Male)',
    tutorName: 'Alex',
    gender: 'male',
    accent: 'Global',
    flag: '🌐',
    badge: 'Clear Articulate Voice',
    engine: 'device-hd',
    description: 'Structured, confident global male voice.',
    sampleHinglish: 'Hello! I am Alex. Let us test your algorithm in the WebAssembly runner.',
    sampleEnglish: 'Hello, I am Alex. We are going to inspect this Python algorithm together.'
  }
];

// Robotic novelty voices on macOS/Windows that MUST be blacklisted
const ROBOTIC_VOICE_BLACKLIST = [
  'albert',
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'deranged',
  'fred',
  'good news',
  'hysterical',
  'junior',
  'kathy',
  'pipe organ',
  'princess',
  'ralph',
  'trinoids',
  'whisper',
  'zarvox',
  'organ',
  'wobble'
];

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private isSpeakingState = false;
  private selectedPersonaId: VoicePersona = 'neural-nova';
  private speechRate = 0.95;
  private currentAudioElement: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => {};
        }
      }
      const savedPersona = localStorage.getItem('pyvoice_persona') as VoicePersona;
      if (savedPersona && VOICE_PERSONAS.some((p) => p.id === savedPersona)) {
        this.selectedPersonaId = savedPersona;
      }
    }
  }

  public getSelectedPersona(): VoiceOption {
    return (
      VOICE_PERSONAS.find((p) => p.id === this.selectedPersonaId) ||
      VOICE_PERSONAS[0]
    );
  }

  public setSelectedPersona(personaId: VoicePersona): void {
    this.selectedPersonaId = personaId;
    localStorage.setItem('pyvoice_persona', personaId);
  }

  public setSpeechRate(rate: number): void {
    this.speechRate = Math.max(0.75, Math.min(1.3, rate));
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  public getOpenAiKey(): string {
    return (
      localStorage.getItem('pyvoice_openai_key') ||
      (import.meta.env.VITE_OPENAI_API_KEY as string) ||
      ''
    );
  }

  public setOpenAiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem('pyvoice_openai_key', key.trim());
    } else {
      localStorage.removeItem('pyvoice_openai_key');
    }
  }

  /**
   * Cleans code and adds natural breathing pauses for human-like cadence
   */
  private cleanCodeForSpeech(text: string): string {
    return text
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*/g, '')
      .replace(/%\s*2\s*==\s*0/g, ' modulo 2 equals zero, meaning it is even. ')
      .replace(/%\s*([a-zA-Z0-9_]+)/g, ' modulo $1 ')
      .replace(/\*\*\s*0\.5/g, ' square root ')
      .replace(/\[::-1\]/g, ' reverse slice ')
      .replace(/def\s+([a-zA-Z0-9_]+)/g, 'define function $1 ')
      .replace(/==/g, ' equals ')
      .replace(/!=/g, ' is not equal to ')
      .replace(/<=/g, ' is less than or equal to ')
      .replace(/>=/g, ' is greater than or equal to ')
      .replace(/\.append\(/g, ' append ')
      .replace(/f"([^"]+)"/g, 'text: $1')
      .replace(/range\(2,\s*limit\s*\+\s*1\)/g, 'range from 2 up to limit plus 1')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Filters and returns only high-grade, natural browser voices
   */
  private findHighQualityDeviceVoice(persona: VoiceOption, isHinglish: boolean): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const allVoices = this.synth.getVoices();
    if (!allVoices || allVoices.length === 0) return null;

    // Filter out all robotic novelty voices
    const cleanVoices = allVoices.filter((v) => {
      const name = v.name.toLowerCase();
      return !ROBOTIC_VOICE_BLACKLIST.some((bad) => name.includes(bad));
    });

    if (cleanVoices.length === 0) return allVoices[0];

    // Priority 1: High-grade Google neural voices in Chrome
    const googleNatural = cleanVoices.filter((v) => v.name.toLowerCase().includes('google'));
    // Priority 2: Enhanced or Premium natural voices in Safari / macOS
    const enhancedApple = cleanVoices.filter((v) =>
      v.name.toLowerCase().includes('enhanced') ||
      v.name.toLowerCase().includes('premium') ||
      v.name.toLowerCase().includes('natural')
    );

    // If looking for Indian accent (Priya / Rohan)
    if (persona.accent === 'India' || isHinglish) {
      const indianMatches = cleanVoices.filter(
        (v) => v.lang.includes('en-IN') || v.lang.includes('hi-IN') || v.lang.includes('hi_IN')
      );

      if (persona.gender === 'female') {
        const femaleIndian = indianMatches.find(
          (v) =>
            v.name.toLowerCase().includes('veena') ||
            v.name.toLowerCase().includes('lekha') ||
            v.name.toLowerCase().includes('heera') ||
            v.name.toLowerCase().includes('female')
        );
        if (femaleIndian) return femaleIndian;
      } else {
        const maleIndian = indianMatches.find(
          (v) =>
            v.name.toLowerCase().includes('rishi') ||
            v.name.toLowerCase().includes('ravi') ||
            v.name.toLowerCase().includes('neel') ||
            v.name.toLowerCase().includes('male')
        );
        if (maleIndian) return maleIndian;
      }

      if (indianMatches.length > 0) return indianMatches[0];
    }

    // High quality natural voices for Nova, Echo, Sarah, Alex
    if (persona.gender === 'female') {
      const bestFemale =
        enhancedApple.find((v) => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Ava') || v.name.includes('Zoe'))) ||
        googleNatural.find((v) => v.name.includes('Female') || v.name.includes('US English')) ||
        cleanVoices.find((v) => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Moira')));
      if (bestFemale) return bestFemale;
    } else {
      const bestMale =
        enhancedApple.find((v) => v.lang.startsWith('en') && (v.name.includes('Tom') || v.name.includes('Daniel') || v.name.includes('Alex'))) ||
        googleNatural.find((v) => v.name.includes('Male') || v.name.includes('UK English Male')) ||
        cleanVoices.find((v) => v.lang.startsWith('en') && (v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Oliver')));
      if (bestMale) return bestMale;
    }

    return cleanVoices.find((v) => v.lang.startsWith('en')) || cleanVoices[0];
  }

  /**
   * Speak using OpenAI Studio Neural TTS if API key is provided
   */
  private async speakWithOpenAi(
    text: string,
    voice: string,
    onEnd?: () => void
  ): Promise<boolean> {
    const apiKey = this.getOpenAiKey();
    if (!apiKey) return false;

    try {
      this.isSpeakingState = true;
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
          speed: this.speechRate
        })
      });

      if (!response.ok) {
        console.warn('OpenAI TTS call failed, falling back to device HD:', response.status);
        this.isSpeakingState = false;
        return false;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      this.stop();

      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;

      audio.onended = () => {
        this.isSpeakingState = false;
        this.currentAudioElement = null;
        URL.revokeObjectURL(audioUrl);
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        this.isSpeakingState = false;
        this.currentAudioElement = null;
        URL.revokeObjectURL(audioUrl);
        if (onEnd) onEnd();
      };

      await audio.play();
      return true;
    } catch (err) {
      console.warn('Error in OpenAI TTS playback:', err);
      this.isSpeakingState = false;
      return false;
    }
  }

  public async speak(text: string, isHinglish: boolean = false, onEnd?: () => void): Promise<void> {
    this.stop();

    const naturalSpeechText = this.cleanCodeForSpeech(text);
    const persona = this.getSelectedPersona();

    // 1. If user selected a Neural AI persona and has an OpenAI Key, use Ultra-Realistic Studio Neural TTS!
    if (persona.engine === 'neural-ai' && persona.openaiVoice) {
      const usedOpenAi = await this.speakWithOpenAi(naturalSpeechText, persona.openaiVoice, onEnd);
      if (usedOpenAi) return;
    }

    // 2. High-Fidelity Device HD Speech Engine (with blacklisted robotic voices & natural cadence)
    if (!this.synth) return;

    const utterance = new SpeechSynthesisUtterance(naturalSpeechText);

    // Natural human pitch: 1.0 (avoids robotic digital vocoder artifacts)
    utterance.pitch = 1.0;
    utterance.rate = this.speechRate;

    const matchedVoice = this.findHighQualityDeviceVoice(persona, isHinglish);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (e) {}
      this.currentAudioElement = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }

    this.isSpeakingState = false;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth ? this.synth.speaking : false);
  }
}

export const ttsService = new TTSService();
