// Phonetic and colloquial cleaner for Hinglish and Programming speech dictation
export function cleanSpokenTranscription(rawSpeech: string): string {
  let cleaned = rawSpeech.trim();

  // Common Hinglish speech-to-text corrections
  const hinglishMap: [RegExp, string][] = [
    [/\b(bye|buy|by)\s+(mera|mere|ko|bhai)\b/gi, 'bhai mere ko'],
    [/\bmerko|mereko\b/gi, 'mere ko'],
    [/\busko|usey\b/gi, 'usko'],
    [/\bkese|kayse|kase\b/gi, 'kaise'],
    [/\bkare|kareen|karey\b/gi, 'karein'],
    [/\bnikalo|nekaal|nikal\b/gi, 'nikaal'],
    [/\bnikalke|nikal ke\b/gi, 'nikaal ke'],
    [/\bchahiye|chaye\b/gi, 'chahiye'],
    [/\bbanado|bana do\b/gi, 'banao'],
    [/\bsamjhao|samjha do\b/gi, 'samjha do'],
    [/\bulta|oolta\b/gi, 'ulta'],
    [/\bjod do|jodo\b/gi, 'sum karo'],
  ];

  for (const [pattern, replacement] of hinglishMap) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  // Common programming terms spoken aloud
  const codeSpeechMap: [RegExp, string][] = [
    [/\bdef\s+function\b/gi, 'def'],
    [/\bfor\s+in\s+loop\b/gi, 'for loop'],
    [/\bmodulus|modular\b/gi, 'modulo %'],
    [/\bequals\s+equals\b/gi, '=='],
    [/\bnot\s+equals\b/gi, '!='],
    [/\bsquare\s+root\b/gi, 'square root (** 0.5)'],
    [/\bf\s+string|fstring\b/gi, 'f-string'],
    [/\bcolon\b/gi, ':'],
  ];

  for (const [pattern, replacement] of codeSpeechMap) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}
