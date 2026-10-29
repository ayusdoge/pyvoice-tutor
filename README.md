<div align="center">

# PyVoice Tutor
### *Speak Your Logic • Master Python*

**Built for "No Hands: The Wispr Challenge" (WeMakeDevs × Wispr Flow)**  
*A voice-first Python learning studio and Duolingo-style quest that turns spoken English and Hinglish into clean, runnable Python code with line-by-line interactive coaching.*

[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Pyodide-WebAssembly%20Python%203.12-3776AB.svg)](https://pyodide.org/)
[![Wispr Flow](https://img.shields.io/badge/Voice--First-Wispr%20Flow-8b5cf6.svg)](https://wisprflow.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](http://localhost:5173) • [🎬 Video Demo Guide](#-demo-video-guide-2-minutes) • [Hackathon Details](#-built-for-wemakedevs--wispr-flow-challenge)

</div>

---

## The Problem & The Voice-First Solution

Beginner programmers, students, and creators often have clear mental logic, but stumble when translating their thoughts into rigid Python syntax, indentations, colons, and loops. 

With **Wispr Flow**, learners simply **speak their logic naturally**—even in conversational **Hinglish** (e.g., *"bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein"*). 

**PyVoice Tutor** immediately:
1. **Translates spoken logic** into clean, idiomatic Python code.
2. **Breaks down the code line-by-line** with concept tags, spoken intent mapping, and dual **English + Hinglish** explanations.
3. **Executes the code live in the browser** using Pyodide (Python 3.12 WebAssembly VM)—no server, no backend, and zero local Python installation needed!
4. **Gamifies the journey with PyDuo Quest**: A Duolingo-style skill tree path with XP, daily streaks, 5 hearts, and voice coaching!

---

## Core Features

### 1. PyDuo Quest (The Duolingo of Python)
- **Skill Tree Path**: Progressive bite-sized levels:
  - **Level 1**: *Hello Python: First Words* (`print()` & Strings)
  - **Level 2**: *Even or Odd: The Modulo Spell* (`if-else` & `%`)
  - **Level 3**: *Palindrome Quest: Mirror Words* (String Slicing `[::-1]`)
  - **Level 4**: *Prime Boss Fight: 17 Hunter* (Hinglish prime number challenge!)
  - **Level 5**: *Word Counter Detective* (Dictionaries & Frequency Counting)
- **Gamification**: XP points, daily streak counter, hearts system, and celebratory trophy modals.
- **Push-to-Talk Voice Challenges**: Tap the mic button to speak your solution in Hinglish or English, or tap the interactive logic blocks!

### 2. Dual Voice Input: Wispr Flow & Live In-Browser STT
- **Wispr Flow Native**: Hold your Wispr hotkey (<kbd>Fn</kbd>) and speak freely anywhere in the app.
- **In-Browser Push-to-Talk**: Built-in microphone recording with a live audio decibel meter and streaming transcription.
- **Phonetic Auto-Correction**: Automatically corrects common Hinglish Speech-to-Text misinterpretations (e.g., *"bye"* ➔ *"bhai"*, *"kese"* ➔ *"kaise"*, *"modulus"* ➔ *"modulo %"*).

### 3. Studio-Grade Voice Tutors (Male & Female)
- **Nova (Ultra-Realistic AI Female)**: Vibrant, warm, ultra-natural voice actor.
- **Echo (Warm Studio AI Male)**: Deep, natural male voice with studio-grade articulation.
- **Priya (Indian Female HD 🇮🇳)**: Warm Indian accent tuned for Hinglish.
- **Rohan (Indian Male HD 🇮🇳)**: Friendly, conversational Indian male accent.
- **Natural Code Pronunciation**: Converts symbols like `num % 2 == 0` into *"modulo 2 equals zero, meaning it is an even number"*, and `** 0.5` into *"square root"*.

### 4. In-Browser Python WebAssembly Execution
- Uses **Pyodide** (WebAssembly) to execute Python 3.12 code directly inside the user's browser.
- Instant execution in **~14ms** with standard output capture, syntax validation, and zero server lag.

---

## Adding an API Key (Optional Live AI Mode)

The app works 100% offline using its built-in intelligent synthesizer. If you wish to synthesize completely arbitrary custom voice prompts with live AI:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Google Gemini key (Free at [Google AI Studio](https://aistudio.google.com/app/apikey)):
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...
   ```
3. *(Optional)* Add your OpenAI key for Ultra-HD Nova & Echo TTS:
   ```env
   VITE_OPENAI_API_KEY=sk-...
   ```
4. Or configure them directly in the in-app **Settings** tab!

---


## Demo Video Guide (< 2 Minutes)

| Timestamp | Screen Action | Voiceover / Script |
| :--- | :--- | :--- |
| **0:00 - 0:20** | Show PyVoice Tutor mobile app open. Point to streak, XP, and Wispr Flow badge. | *"Hey everyone, this is PyVoice Tutor, a voice-first Python learning app built for the WeMakeDevs Wispr Challenge. Translating mental logic into Python syntax is hard for beginners, so we made it voice-first."* |
| **0:20 - 0:50** | Open **Wispr Voice Studio**. Hold Wispr key / tap mic and speak: *"bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein"* | *"Notice how seamlessly my spoken Hinglish was captured. Now I click 'Generate Python & Explain'..."* |
| **0:50 - 1:20** | Switch to **Code Lab**. Show the code, click lines to view the breakdown. Tap **"Listen to Explanation"** to hear Priya/Rohan speak. | *"PyVoice writes idiomatic Python and breaks it down line-by-line in both English and Hinglish. Our natural voice models pronounce tricky symbols like square roots and modulo clearly."* |
| **1:20 - 1:45** | Switch to **PyDuo Quest**. Show the Duolingo skill tree, mascot speech bubble, logic blocks, and tap **"Check Answer"** to hear the celebration chime! | *"We even built PyDuo Quest, the Duolingo of Python with a skill tree, streak counter, and push-to-talk voice challenges!"* |
| **1:45 - 2:00** | Click **Run in Browser** (executes in 14ms in WebAssembly), flash your Wispr Flow Insights desktop card, and wrap up! | *"Runs live in WebAssembly with zero servers. 100% built with voice. Thank you WeMakeDevs and Wispr!"* |

---

## Built for WeMakeDevs × Wispr Flow Challenge

- **Track**: Builders Track
- **Challenge**: "No Hands: The Wispr Challenge" (16 to 31 October 2026)
- **Built With**: React 18, Vite, TypeScript, Pyodide WebAssembly, Tailwind CSS, Web Audio API, Google Gemini 2.0 Flash.
- **License**: MIT
