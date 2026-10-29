# 🐍 PyVoice Tutor — Speak Your Logic, Master Python

> Built for **No Hands: The Wispr Challenge** (WeMakeDevs × Wispr Flow)  
> *A voice-first Python learning studio that turns spoken English and Hinglish logic into clean, runnable Python code with line-by-line interactive explanations.*

[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Python](https://img.shields.io/badge/Pyodide-WebAssembly-emerald.svg)](https://pyodide.org/)
[![Wispr Flow](https://img.shields.io/badge/Voice--First-Wispr%20Flow-8b5cf6.svg)](https://wisprflow.ai/)

---

## 🌟 The Problem & The Voice-First Solution

Beginner programmers often have strong mental logic, but stumble when translating their thoughts into rigid Python syntax, indentations, colons, and loops. 

With **Wispr Flow**, learners simply **speak their logic naturally**—even in conversational **Hinglish** (e.g., *"Bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein"*). 

**PyVoice Tutor** immediately:
1. **Translates the spoken logic** into idiomatic, clean Python code.
2. **Generates an interactive line-by-line walkthrough** with concept tags, spoken intent mapping, and dual **English + Hinglish** explanations.
3. **Executes the code live in the browser** using Pyodide (Python 3.12 WebAssembly VM)—no server, no backend, and zero installation needed!

---

## 🚀 Instant Quickstart for Hackathon Judges (0 Setup Required)

Judges can test the entire app **instantly without needing an API key or signing in**:

1. Clone or open the project:
   ```bash
   cd pyvoice-tutor
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.
3. Click any of the **1-Click Judge Presets** on top:
   - 🌟 **Prime Numbers Finder (Hinglish)**: *"bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein"*
   - 🔢 **Even Numbers Filter & Sum**: *"list me se even numbers nikaal ke sum karna hai aur unko alag print karna hai"*
   - 🔄 **Palindrome String Checker**: *"ek word lo aur check karo ki wo palindrome hai ya nahi jaise radar ya madam"*
   - ✖️ **Factorial Calculator**: *"kisi number ka factorial nikaalna hai loop use karke simple tareeqe se"*
   - 📖 **Word Frequency in Sentence**: *"count how many times each word appears in a sentence using a dictionary"*
   - 🌀 **Fibonacci Sequence**: *"generate the first 10 numbers of the Fibonacci sequence"*
4. Click **Run in Browser** to execute Python code live in WebAssembly!
5. Click on any line of code in the editor to inspect the line-by-line explanation.

---

## 🔑 How to Add an API Key (Optional Live AI Mode)

If you want the app to synthesize **any arbitrary spoken prompt** beyond the built-in preset engine, you can add a Google Gemini API Key in either of two ways:

### Option A: Via `.env` File
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your key:
   ```env
   VITE_GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
   ```
3. Restart the dev server (`npm run dev`). The header badge will immediately show **Live AI Key Active (Green)**.

### Option B: Via the In-App Settings Modal
1. Click the **API Key** button in the top right header.
2. Paste your Google Gemini API Key (get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey)).
3. Click **Save & Apply**. It will be saved securely to your browser's `localStorage`.

> **Note:** If no API key is loaded, PyVoice automatically and seamlessly falls back to the built-in offline smart logic engine and judge presets. Nothing breaks!

---

## 🎙️ Using Wispr Flow with PyVoice Tutor

1. Launch the **Wispr Flow** desktop app.
2. Click into the PyVoice prompt input textarea.
3. Hold your Wispr hotkey (default: `Fn` on Mac or your custom key).
4. Speak your logic in plain English or Hinglish:
   - *"Bhai prime numbers kaise find karein ek function banao"*
   - *"Filter all even numbers from a list and print their total sum"*
   - *"Take a sentence and count how many times each word appears"*
5. Release the hotkey. Wispr Flow instantly types clean, polished text into the prompt.
6. Press `Cmd + Enter` or click **Generate Python & Explain**!

*(A built-in Web Speech API browser microphone fallback is also included if you are testing without the Wispr desktop client).*

---

## 🇮🇳 Hinglish Language Support

PyVoice is specially crafted for Indian developers and beginners:
- **Spoken Input**: Accurately recognizes conversational Hinglish queries.
- **Dual Explanations**: Toggle between **English**, **Hinglish**, or **Dual Mode** in the top navigation bar.
- Every line of code explains:
  - *English:* "Initializes an empty list `primes` to store all valid prime numbers discovered."
  - *Hinglish:* "Yahan humne ek empty list banayi jisme sare prime numbers save karenge."
  - *Beginner Tip:* "Square brackets `[]` create a dynamic list in Python."

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom glowing themes
- **In-Browser Python VM**: Pyodide (Python 3.12 compiled to WebAssembly)
- **AI Engine**: Google Gemini API (`gemini-2.0-flash`) + Offline Pattern Matching Synthesizer
- **Voice**: Wispr Flow integration + Custom Indian Female/Male & Global Voice Personas (Priya, Rohan, Sarah, Alex)
- **Gamification**: PyDuo Quest (Duolingo-style skill tree, XP, streaks, hearts, and mascot audio feedback)
- **Icons**: Lucide React

---

## 🎮 PyDuo Quest: The Duolingo of Python Learning

Switch from **Voice Studio** to **PyDuo Quest** using the top navigation bar to experience a gamified, structured learning path:
- **Skill Tree Path**: Progressive levels from *Level 1 (Hello Python)* to *Level 4 (Prime Number Boss Fight)* and *Level 5 (Word Detective)*.
- **Mascot Audio Coaching**: PyDuo the friendly Python tutor provides encouragement, spoken tips, and celebratory cheers (*"Shabash!"*).
- **Voice Shortcuts**: Practice dictating logic in conversational Hinglish or English using Wispr Flow.
- **XP, Streaks & Hearts**: Earn +20 to +40 XP per challenge, maintain your daily streak, and unlock the next level!


---

## 📦 Building for Production / Vercel Deployment

To create a production build ready to deploy on Vercel, Netlify, or GitHub Pages:

```bash
npm run build
npm run preview
```

Deploying to Vercel takes 1 click:
```bash
npx vercel
```

---

## 🏆 WeMakeDevs Submission Checklist

- [x] **Working Project**: Instant 1-click testable in browser with zero sign-in.
- [x] **Wispr Flow Integration**: Voice dictation with Hinglish and English support.
- [x] **Judges 1-Click Presets**: Preloaded test scenarios for instant evaluation.
- [x] **API Key Integration**: Documented in `.env` and in-app settings with seamless fallback.
- [x] **Live Python Execution**: Full WebAssembly in-browser compiler.
