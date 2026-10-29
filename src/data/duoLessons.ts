export interface DuoLesson {
  id: string;
  title: string;
  category: string;
  level: number;
  xpReward: number;
  concept: string;
  scenario: string;
  voicePromptEnglish: string;
  voicePromptHinglish: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  wordBlocks: string[];
  mascotTip: {
    english: string;
    hinglish: string;
  };
  mascotEmotion: 'happy' | 'thinking' | 'cheering' | 'waving';
}

export const DUO_LESSONS: DuoLesson[] = [
  {
    id: 'lesson-1',
    title: 'Hello Python: First Words',
    category: 'Basics',
    level: 1,
    xpReward: 20,
    concept: 'print() function & Strings',
    scenario: 'Welcome to Python! Speak with Wispr or tap the blocks to print "Namaste Python!".',
    voicePromptEnglish: 'Print the greeting "Namaste Python!" to the screen',
    voicePromptHinglish: 'Screen par print karo "Namaste Python!"',
    starterCode: `# Speak with Wispr or tap the word blocks below!\n`,
    solutionCode: `print("Namaste Python!")`,
    expectedOutput: `Namaste Python!`,
    wordBlocks: ['print(', '"Namaste Python!"', ')', 'name = "Python"'],
    mascotEmotion: 'waving',
    mascotTip: {
      english: 'In Python, print() is your loudspeaker! Put text in quotes ("...") to display it.',
      hinglish: 'Python me print() se screen par kuch bhi dikha sakte hain. Text ko quotes ("...") me daalo!'
    }
  },
  {
    id: 'lesson-2',
    title: 'Even or Odd: The Modulo Spell',
    category: 'Conditionals',
    level: 2,
    xpReward: 25,
    concept: 'if-else & Modulo (%)',
    scenario: 'Check if number 42 is even or odd. If num % 2 == 0, print "42 is Even".',
    voicePromptEnglish: 'Check if number 42 is even using modulo 2 and print "42 is Even"',
    voicePromptHinglish: 'bhai check karo 42 even hai ya nahi agar remainder zero hai toh print karo "42 is Even"',
    starterCode: `num = 42\n# Speak your logic or tap the blocks below:\n`,
    solutionCode: `num = 42\nif num % 2 == 0:\n    print(f"{num} is Even")\nelse:\n    print(f"{num} is Odd")`,
    expectedOutput: `42 is Even`,
    wordBlocks: ['if num % 2 == 0:', 'print(f"{num} is Even")', 'else:', 'print(f"{num} is Odd")'],
    mascotEmotion: 'thinking',
    mascotTip: {
      english: '% gives the remainder. When any number % 2 equals 0, it is an even number!',
      hinglish: '% operator remainder nikaalta hai. Agar number % 2 == 0 aaye, toh wo pakka Even number hai!'
    }
  },
  {
    id: 'lesson-3',
    title: 'Palindrome Quest: Mirror Words',
    category: 'Strings',
    level: 3,
    xpReward: 30,
    concept: 'String Slicing [::-1] & Equality',
    scenario: 'Test if word = "radar" is a palindrome (reads identically backwards).',
    voicePromptEnglish: 'Take word "radar", reverse it with slicing, and print "radar is a palindrome"',
    voicePromptHinglish: 'word "radar" ko ulta karke check karo agar same hai toh print karo "radar is a palindrome"',
    starterCode: `word = "radar"\n# Reverse with [::-1] and check equality\n`,
    solutionCode: `word = "radar"\nif word == word[::-1]:\n    print(f"{word} is a palindrome")\nelse:\n    print(f"{word} is not a palindrome")`,
    expectedOutput: `radar is a palindrome`,
    wordBlocks: ['if word == word[::-1]:', 'print(f"{word} is a palindrome")', 'else:', 'print("not palindrome")'],
    mascotEmotion: 'happy',
    mascotTip: {
      english: 'word[::-1] is Python’s coolest shortcut! It reverses the string in one step.',
      hinglish: 'word[::-1] Python ka jaadui slice hai jo poore text ko ek hi jhatke me palat deta hai!'
    }
  },
  {
    id: 'lesson-4',
    title: 'Prime Boss Fight: 17 Hunter',
    category: 'Functions & Loops',
    level: 4,
    xpReward: 35,
    concept: 'Functions, Loops, & Modulo Optimization',
    scenario: 'Write function is_prime(17) and print "17 is Prime" by testing divisors up to √17.',
    voicePromptEnglish: 'Write a function to check if 17 is a prime number and print "17 is Prime"',
    voicePromptHinglish: 'bhai ek function banao check karne ke liye ki 17 prime number hai ya nahi aur print karo "17 is Prime"',
    starterCode: `def is_prime(n):\n    # Speak your logic or tap the blocks below\n    pass\n\n`,
    solutionCode: `def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nif is_prime(17):\n    print("17 is Prime")\nelse:\n    print("17 is not Prime")`,
    expectedOutput: `17 is Prime`,
    wordBlocks: ['for i in range(2, int(n**0.5) + 1):', 'if n % i == 0: return False', 'return True', 'if is_prime(17): print("17 is Prime")'],
    mascotEmotion: 'cheering',
    mascotTip: {
      english: 'Boss battle tip: A prime number has only two factors: 1 and itself! Checking up to √n is super fast.',
      hinglish: 'Boss fight tip: Prime number sirf 1 aur khud se divide hota hai. √n tak check karna fastest tareeqa hai!'
    }
  },
  {
    id: 'lesson-5',
    title: 'Word Counter Detective',
    category: 'Dictionaries',
    level: 5,
    xpReward: 40,
    concept: 'Dictionaries & Frequency Counting',
    scenario: 'Count word occurrences in "chai coffee chai chai" and print the count of "chai".',
    voicePromptEnglish: 'Split sentence "chai coffee chai chai" and count how many times "chai" appears',
    voicePromptHinglish: 'sentence me count karo "chai" kitni baar aaya hai dictionary se',
    starterCode: `text = "chai coffee chai chai"\n# Count words using dictionary\n`,
    solutionCode: `text = "chai coffee chai chai"\nwords = text.split()\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nprint(f"chai appears {counts['chai']} times")`,
    expectedOutput: `chai appears 3 times`,
    wordBlocks: ['words = text.split()', 'counts = {}', 'counts[w] = counts.get(w, 0) + 1', 'print(f"chai appears {counts[\'chai\']} times")'],
    mascotEmotion: 'happy',
    mascotTip: {
      english: 'Dictionaries store Key-Value pairs! counts.get(w, 0) + 1 handles counting in one clean line.',
      hinglish: 'Dictionary me har word ki frequency store hoti hai. counts.get(w, 0) + 1 counting ko aasan bana deta hai!'
    }
  }
];
