// Enhanced Voice Persona & Text-to-Speech Engine with Indian Male/Female Voice Support
export type VoicePersona = 'indian-female' | 'indian-male' | 'global-female' | 'global-male';

export interface VoiceOption {
  id: VoicePersona;
  name: string;
  tutorName: string;
  gender: 'female' | 'male';
  accent: 'India' | 'Global';
  flag: string;
  badge: string;
  description: string;
  pitch: number;
  defaultRate: number;
  sampleHinglish: string;
  sampleEnglish: string;
}

export const VOICE_PERSONAS: VoiceOption[] = [
  {
    id: 'indian-female',
    name: 'Priya (Indian Female)',
    tutorName: 'Priya',
    gender: 'female',
    accent: 'India',
    flag: '🇮🇳',
    badge: 'Popular • Indian Accent',
    description: 'Warm, clear Indian accent. Ideal for Hinglish & English explanations.',
    pitch: 1.08,
    defaultRate: 0.93,
    sampleHinglish: 'Namaste! Main Priya hoon. Chaliye saath me Python ke prime numbers aur loops samajhte hain!',
    sampleEnglish: 'Hello! I am Priya. Let us break down your Python logic line-by-line together!'
  },
  {
    id: 'indian-male',
    name: 'Rohan (Indian Male)',
    tutorName: 'Rohan',
    gender: 'male',
    accent: 'India',
    flag: '🇮🇳',
    badge: 'Energetic • Indian Accent',
    description: 'Deep, conversational Indian male voice. Great for friendly coaching.',
    pitch: 0.92,
    defaultRate: 0.92,
    sampleHinglish: 'Bhai suno, main Rohan hoon! Python bilkul tough nahi hai, aao step-by-step code karein.',
    sampleEnglish: 'Hey there! I am Rohan. Let us turn your spoken thoughts into clean, working Python code!'
  },
  {
    id: 'global-female',
    name: 'Sarah (Global Female)',
    tutorName: 'Sarah',
    gender: 'female',
    accent: 'Global',
    flag: '🌐',
    badge: 'Crisp & Natural',
    description: 'Clear, modern standard English voice with smooth articulation.',
    pitch: 1.05,
    defaultRate: 0.95,
    sampleHinglish: 'Namaste! I am Sarah. I will guide you through Python syntax and best practices.',
    sampleEnglish: 'Hi! I am Sarah, your voice programming tutor. Ready to run your Python code?'
  },
  {
    id: 'global-male',
    name: 'Alex (Global Male)',
    tutorName: 'Alex',
    gender: 'male',
    accent: 'Global',
    flag: '🌐',
    badge: 'Deep & Studio Articulate',
    description: 'Confident, structured global male voice with clear enunciation.',
    pitch: 0.94,
    defaultRate: 0.94,
    sampleHinglish: 'Hello! I am Alex. Let us test your algorithm in the WebAssembly runner.',
    sampleEnglish: 'Hello, I am Alex. We are going to inspect this Python algorithm together.'
  }
];

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private isSpeakingState = false;
  private selectedPersonaId: VoicePersona = 'indian-female';
  private speechRate = 0.93;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      // Load saved persona
      const savedPersona = localStorage.getItem('pyvoice_persona') as VoicePersona;
      if (savedPersona && VOICE_PERSONAS.some((p) => p.id === savedPersona)) {
        this.selectedPersonaId = savedPersona;
      }
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          // Trigger voice table refresh
        };
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
    this.speechRate = Math.max(0.7, Math.min(1.4, rate));
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  /**
   * Discovers the best matching browser SpeechSynthesisVoice for the selected persona
   */
  private findBestVoice(persona: VoiceOption, isHinglish: boolean): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    if (persona.id === 'indian-female') {
      // Look for known Indian female voices on Mac, Windows, Chrome, iOS
      const match =
        voices.find(
          (v) =>
            (v.lang.includes('en-IN') || v.lang.includes('hi-IN') || v.lang.includes('hi_IN')) &&
            (v.name.toLowerCase().includes('veena') ||
              v.name.toLowerCase().includes('lekha') ||
              v.name.toLowerCase().includes('sangeeta') ||
              v.name.toLowerCase().includes('heera') ||
              v.name.toLowerCase().includes('neerja') ||
              v.name.toLowerCase().includes('female'))
        ) ||
        voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('hi-IN')) ||
        voices.find((v) => v.name.toLowerCase().includes('female') && v.lang.startsWith('en'));
      return match || voices[0];
    }

    if (persona.id === 'indian-male') {
      // Look for known Indian male voices
      const match =
        voices.find(
          (v) =>
            (v.lang.includes('en-IN') || v.lang.includes('hi-IN') || v.lang.includes('hi_IN')) &&
            (v.name.toLowerCase().includes('rishi') ||
              v.name.toLowerCase().includes('neel') ||
              v.name.toLowerCase().includes('ravi') ||
              v.name.toLowerCase().includes('prabhat') ||
              v.name.toLowerCase().includes('male'))
        ) ||
        voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('hi-IN')) ||
        voices.find((v) => v.name.toLowerCase().includes('male') && v.lang.startsWith('en'));
      return match || voices[0];
    }

    if (persona.id === 'global-female') {
      const match =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('ava') ||
              v.name.toLowerCase().includes('zoe') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('serena') ||
              v.name.toLowerCase().includes('female'))
        ) || voices.find((v) => v.lang.startsWith('en'));
      return match || voices[0];
    }

    if (persona.id === 'global-male') {
      const match =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('alex') ||
              v.name.toLowerCase().includes('daniel') ||
              v.name.toLowerCase().includes('tom') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('male'))
        ) || voices.find((v) => v.lang.startsWith('en'));
      return match || voices[0];
    }

    return voices[0];
  }

  /**
   * Pre-process code statements into natural, human-like spoken speech
   */
  private cleanCodeForSpeech(text: string): string {
    return text
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*/g, '')
      .replace(/%\s*2\s*==\s*0/g, ' modulo 2 equals zero, meaning it is an even number ')
      .replace(/%\s*([a-zA-Z0-9_]+)/g, ' modulo $1 ')
      .replace(/\*\*\s*0\.5/g, ' to the power 0.5, which is the square root ')
      .replace(/\[::-1\]/g, ' reverse slice ')
      .replace(/def\s+([a-zA-Z0-9_]+)/g, 'define function $1 ')
      .replace(/==/g, ' equals ')
      .replace(/!=/g, ' is not equal to ')
      .replace(/<=/g, ' is less than or equal to ')
      .replace(/>=/g, ' is greater than or equal to ')
      .replace(/\.append\(/g, ' dot append ')
      .replace(/f"([^"]+)"/g, 'formatted text: $1')
      .replace(/range\(2,\s*limit\s*\+\s*1\)/g, 'range from 2 up to limit plus 1')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public speak(text: string, isHinglish: boolean = false, onEnd?: () => void): void {
    if (!this.synth) return;

    this.stop();

    const naturalSpeechText = this.cleanCodeForSpeech(text);
    const persona = this.getSelectedPersona();

    const utterance = new SpeechSynthesisUtterance(naturalSpeechText);

    // Apply voice-specific pitch & rate tuning
    utterance.pitch = persona.pitch;
    utterance.rate = this.speechRate;

    const matchedVoice = this.findBestVoice(persona, isHinglish);
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
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth ? this.synth.speaking : false);
  }
}

export const ttsService = new TTSService();
