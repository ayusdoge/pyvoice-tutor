import { LogicSynthesisResult, PresetPrompt } from '../types';

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'prime-hinglish',
    title: 'Prime Numbers Finder (Hinglish)',
    spokenQuery: 'bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein',
    badge: 'Hinglish • Recommended',
    category: 'numbers',
    language: 'Hinglish',
    preview: 'Loops through 2 to 50, checks divisibility, and prints all prime numbers.'
  },
  {
    id: 'even-sum-hinglish',
    title: 'Even Numbers Filter & Sum',
    spokenQuery: 'list me se even numbers nikaal ke sum karna hai aur unko alag print karna hai',
    badge: 'Hinglish • Lists',
    category: 'lists',
    language: 'Hinglish',
    preview: 'Extracts even numbers from a list, calculates their total sum using a loop.'
  },
  {
    id: 'palindrome-check',
    title: 'Palindrome String Checker',
    spokenQuery: 'ek word lo aur check karo ki wo palindrome hai ya nahi jaise radar ya madam',
    badge: 'Hinglish • Strings',
    category: 'strings',
    language: 'Hinglish',
    preview: 'Reverses string using slicing [::-1] and compares with original word.'
  },
  {
    id: 'factorial-loop',
    title: 'Factorial Calculator',
    spokenQuery: 'kisi number ka factorial nikaalna hai loop use karke simple tareeqe se',
    badge: 'Hinglish • Math',
    category: 'numbers',
    language: 'Hinglish',
    preview: 'Multiplies numbers from 1 to N iteratively to compute N factorial.'
  },
  {
    id: 'word-counter',
    title: 'Word Frequency in Sentence',
    spokenQuery: 'I want to count how many times each word appears in a sentence using a dictionary',
    badge: 'English • Dictionary',
    category: 'strings',
    language: 'English',
    preview: 'Splits text into words and builds a frequency count map with a dict.'
  },
  {
    id: 'fibonacci-series',
    title: 'First 10 Fibonacci Numbers',
    spokenQuery: 'Generate the first 10 numbers of the Fibonacci sequence starting with 0 and 1',
    badge: 'English • Classic',
    category: 'beginner',
    language: 'English',
    preview: 'Generates sequence where each number is the sum of the two preceding ones.'
  }
];

export const PRESET_DATA: Record<string, LogicSynthesisResult> = {
  'prime-hinglish': {
    title: 'Prime Numbers Finder (1 to 50)',
    summary: 'Finds and prints prime numbers up to 50 by checking if each number has any divisors other than 1 and itself.',
    rawSpoken: 'bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein',
    languageDetected: 'hinglish',
    source: 'preset',
    tags: ['prime numbers', 'nested loops', 'modulo %', 'break statement'],
    sampleInput: 'Range: 2 to 50',
    expectedOutput: `Prime numbers between 2 and 50 are:
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
Total primes found: 15`,
    flowSteps: [
      { step: 1, title: 'Define Function', desc: 'Initialize find_primes(limit) and empty primes = [] list', icon: '📦' },
      { step: 2, title: 'Candidate Loop', desc: 'Iterate each candidate number from 2 up to limit', icon: '🔄' },
      { step: 3, title: 'Square Root Check', desc: 'Check divisors up to √num using modulo % operator', icon: '⚡' },
      { step: 4, title: 'Early Break', desc: 'If divisible (num % divisor == 0), break immediately', icon: '🛑' },
      { step: 5, title: 'Append & Return', desc: 'Add verified prime numbers to list and print formatted results', icon: '✅' },
    ],
    code: `def find_primes(limit):\n    primes = []\n    for num in range(2, limit + 1):\n        is_prime = True\n        for divisor in range(2, int(num ** 0.5) + 1):\n            if num % divisor == 0:\n                is_prime = False\n                break\n        if is_prime:\n            primes.append(num)\n    return primes\n\n# Run the function for numbers up to 50\nresult = find_primes(50)\nprint("Prime numbers between 2 and 50 are:")\nprint(", ".join(map(str, result)))\nprint(f"Total primes found: {len(result)}")`,
    explanations: [
      {
        lineNumber: 1,
        code: 'def find_primes(limit):',
        spokenIntent: 'prime numbers find karne ke liye ek reusable function banaya',
        englishExplanation: 'Defines a reusable function named `find_primes` that accepts a `limit` parameter.',
        hinglishExplanation: 'Yahan humne ek function banaya `find_primes` jo limit lega ki kahan tak primes dhundhne hain.',
        keyConcept: 'Functions (`def`)',
        beginnerTip: 'Functions bundle your logic so you can reuse it anytime with different inputs.'
      },
      {
        lineNumber: 2,
        code: '    primes = []',
        spokenIntent: 'sare prime numbers ko store karne ke liye ek empty list banayi',
        englishExplanation: 'Initializes an empty list `primes` to store all valid prime numbers discovered.',
        hinglishExplanation: 'Ek empty list banayi jisme sare prime numbers save karenge.',
        keyConcept: 'Lists (`[]`)',
        beginnerTip: 'In Python, square brackets `[]` create a list that can grow dynamically.'
      },
      {
        lineNumber: 3,
        code: '    for num in range(2, limit + 1):',
        spokenIntent: '2 se leke limit tak har number ko check karne ke liye loop chala rahe hain',
        englishExplanation: 'Loops through candidates starting from 2 up to `limit` (inclusive).',
        hinglishExplanation: '2 se shuru karke limit tak loop chala rahe hain kyunki 1 prime nahi hota.',
        keyConcept: 'For Loop & `range()`',
        beginnerTip: 'Remember `range(start, stop)` stops at `stop - 1`, so we use `limit + 1` to include `limit`.'
      },
      {
        lineNumber: 4,
        code: '        is_prime = True',
        spokenIntent: 'pehle maan ke chalte hain ki number prime hai',
        englishExplanation: 'Flags `is_prime` as `True` initially for each number before testing divisors.',
        hinglishExplanation: 'Ek boolean flag banaya jisme maana ki number prime hai jab tak koi divisor na mile.',
        keyConcept: 'Boolean Flags (`True`/`False`)',
        beginnerTip: 'Flags are great for tracking states before you verify a condition in loops.'
      },
      {
        lineNumber: 5,
        code: '        for divisor in range(2, int(num ** 0.5) + 1):',
        spokenIntent: '2 se square root tak check karte hain factors ke liye',
        englishExplanation: 'Tests possible divisors up to the square root of `num` (mathematical optimization).',
        hinglishExplanation: 'Square root tak check karte hain efficiency ke liye: agar square root tak koi factor nahi mila toh aage bhi nahi milega.',
        keyConcept: 'Loop Optimization (`num ** 0.5`)',
        beginnerTip: 'Checking up to √num is much faster than checking all numbers up to num!'
      },
      {
        lineNumber: 6,
        code: '            if num % divisor == 0:',
        spokenIntent: 'agar number poora divide ho gaya bina remainder ke',
        englishExplanation: 'The modulo operator `%` checks if the remainder is 0 (i.e. perfectly divisible).',
        hinglishExplanation: '`%` operator se check karte hain remainder zero aaya kya. Agar divide ho gaya toh prime nahi hai.',
        keyConcept: 'Modulo Operator (`%`)',
        beginnerTip: '`a % b == 0` means `b` divides `a` with no remainder.'
      },
      {
        lineNumber: 7,
        code: '                is_prime = False',
        spokenIntent: 'flag ko False set kar diya',
        englishExplanation: 'Since a divisor was found, marks `is_prime` as `False`.',
        hinglishExplanation: 'Factor mil gaya, isliye `is_prime` ko False kar diya.',
        keyConcept: 'Variable Assignment',
      },
      {
        lineNumber: 8,
        code: '                break',
        spokenIntent: 'loop se bahar nikal jao agla number dekhne ke liye',
        englishExplanation: 'Exits the inner divisor loop early because one divisor is enough to disqualify prime.',
        hinglishExplanation: '`break` lagakar loop turant rok diya, faltu aage check karne ki zaroorat nahi hai.',
        keyConcept: 'Early Exit (`break`)',
        beginnerTip: '`break` saves CPU time by stopping the loop as soon as you find your answer.'
      },
      {
        lineNumber: 9,
        code: '        if is_prime:',
        spokenIntent: 'agar number sach me prime nikla',
        englishExplanation: 'Checks if `is_prime` is still `True` after testing all possible divisors.',
        hinglishExplanation: 'Agar flag abhi bhi True hai matlab koi factor nahi mila, number prime hai.',
        keyConcept: 'Conditional Statements (`if`)',
      },
      {
        lineNumber: 10,
        code: '            primes.append(num)',
        spokenIntent: 'toh usko primes list me add kar do',
        englishExplanation: 'Appends the verified prime number to our `primes` list.',
        hinglishExplanation: '`append()` use karke number ko `primes` list me daal diya.',
        keyConcept: 'List Method (`.append()`)',
      },
      {
        lineNumber: 11,
        code: '    return primes',
        spokenIntent: 'final primes list ko return kar do',
        englishExplanation: 'Returns the populated list of prime numbers back to caller.',
        hinglishExplanation: 'Function ka result return kar diya.',
        keyConcept: 'Function Return (`return`)',
      },
      {
        lineNumber: 14,
        code: 'result = find_primes(50)',
        spokenIntent: 'function ko call kiya 50 ke sath',
        englishExplanation: 'Calls the function with 50 as the upper limit and stores returned list in `result`.',
        hinglishExplanation: 'Function ko 50 bhejkar call kiya aur output `result` variable me save kiya.',
        keyConcept: 'Function Call',
      },
      {
        lineNumber: 15,
        code: 'print("Prime numbers between 2 and 50 are:")',
        spokenIntent: 'heading print karo',
        englishExplanation: 'Prints a descriptive heading to the console.',
        hinglishExplanation: 'Console par heading print kiya.',
        keyConcept: 'Standard Output (`print`)',
      },
      {
        lineNumber: 16,
        code: 'print(", ".join(map(str, result)))',
        spokenIntent: 'sare numbers ko comma se jodkar sundar format me print karo',
        englishExplanation: 'Converts integers to strings and joins them with commas for clean output.',
        hinglishExplanation: 'Sare prime numbers ko comma laga kar ek single line me print kar diya.',
        keyConcept: 'String Formatting (`.join()`)',
        beginnerTip: '`", ".join()` is the pythonic way to print lists without ugly brackets!'
      },
      {
        lineNumber: 17,
        code: 'print(f"Total primes found: {len(result)}")',
        spokenIntent: 'kitne prime numbers mile unka total count print karo',
        englishExplanation: 'Uses an f-string to display the total count of primes found (`len(result)`).',
        hinglishExplanation: '`f-string` use karke total kitne primes mile wo count print kiya.',
        keyConcept: 'F-Strings & `len()`',
      }
    ]
  },
  'even-sum-hinglish': {
    title: 'Even Numbers Filter & Sum',
    summary: 'Filters even numbers from a list, prints them individually, and computes the grand total.',
    rawSpoken: 'list me se even numbers nikaal ke sum karna hai aur unko alag print karna hai',
    languageDetected: 'hinglish',
    source: 'preset',
    tags: ['lists', 'modulo', 'accumulation', 'sum'],
    sampleInput: 'Numbers: [12, 7, 19, 24, 33, 40, 5, 8]',
    expectedOutput: `Even numbers found: [12, 24, 40, 8]
Sum of even numbers: 84`,
    flowSteps: [
      { step: 1, title: 'Input & Storage', desc: 'Initialize empty even_numbers list and total_sum = 0', icon: '📥' },
      { step: 2, title: 'Iterate List', desc: 'Loop through each number in the input list', icon: '🔄' },
      { step: 3, title: 'Even Parity Check', desc: 'Verify condition num % 2 == 0', icon: '⚖️' },
      { step: 4, title: 'Accumulate & Collect', desc: 'Append to even_numbers and add to total_sum += num', icon: '➕' },
      { step: 5, title: 'Display Results', desc: 'Print original list, filtered evens, and grand sum', icon: '📊' },
    ],
    code: `def process_even_numbers(numbers):\n    even_numbers = []\n    total_sum = 0\n    \n    for num in numbers:\n        if num % 2 == 0:\n            even_numbers.append(num)\n            total_sum += num\n            \n    return even_numbers, total_sum\n\n# Sample input list\nnumbers_list = [12, 7, 19, 24, 33, 40, 5, 8]\nevens, total = process_even_numbers(numbers_list)\n\nprint(f"Original numbers: {numbers_list}")\nprint(f"Even numbers found: {evens}")\nprint(f"Sum of even numbers: {total}")`,
    explanations: [
      {
        lineNumber: 1,
        code: 'def process_even_numbers(numbers):',
        spokenIntent: 'even numbers nikaalne ke liye function',
        englishExplanation: 'Defines a function accepting a list of numbers.',
        hinglishExplanation: 'Ek function define kiya jo numbers ki list lega.',
        keyConcept: 'Functions'
      },
      {
        lineNumber: 2,
        code: '    even_numbers = []',
        spokenIntent: 'even numbers collect karne ke liye list',
        englishExplanation: 'Creates a list to store matching even numbers.',
        hinglishExplanation: 'Even numbers store karne ke liye khali list banayi.',
        keyConcept: 'Lists'
      },
      {
        lineNumber: 3,
        code: '    total_sum = 0',
        spokenIntent: 'sum calculate karne ke liye accumulator variable',
        englishExplanation: 'Initializes accumulator variable `total_sum` to 0.',
        hinglishExplanation: 'Sum jama karne ke liye counter 0 se start kiya.',
        keyConcept: 'Accumulator Pattern'
      },
      {
        lineNumber: 5,
        code: '    for num in numbers:',
        spokenIntent: 'list ke har number par iterate karo',
        englishExplanation: 'Iterates through each number in the list.',
        hinglishExplanation: 'List ke ek ek element par loop chalaya.',
        keyConcept: 'For-in Loop'
      },
      {
        lineNumber: 6,
        code: '        if num % 2 == 0:',
        spokenIntent: 'check karo agar 2 se divide hota hai bina remainder ke',
        englishExplanation: 'Checks if number divided by 2 has remainder 0 (even number).',
        hinglishExplanation: 'Agar number 2 se poora divide ho jaye toh wo even number hai.',
        keyConcept: 'Even Condition (`% 2 == 0`)'
      },
      {
        lineNumber: 7,
        code: '            even_numbers.append(num)',
        spokenIntent: 'even number ko list me add karo',
        englishExplanation: 'Adds the even number to the result list.',
        hinglishExplanation: 'Even number ko list me daal diya.',
        keyConcept: 'Appending to list'
      },
      {
        lineNumber: 8,
        code: '            total_sum += num',
        spokenIntent: 'sum me number ko jod do',
        englishExplanation: 'Adds the number to `total_sum`.',
        hinglishExplanation: 'Total sum me is number ko jod diya.',
        keyConcept: 'Increment operator (`+=`)'
      }
    ]
  },
  'palindrome-check': {
    title: 'Palindrome String Checker',
    summary: 'Checks if a given word reads identically forwards and backwards (e.g. radar, madam, racecar).',
    rawSpoken: 'ek word lo aur check karo ki wo palindrome hai ya nahi jaise radar ya madam',
    languageDetected: 'hinglish',
    source: 'preset',
    tags: ['strings', 'slicing', 'case normalization'],
    sampleInput: 'Words: "radar", "Python", "Madam"',
    expectedOutput: `'radar' is a palindrome!
'Python' is NOT a palindrome.
'Madam' is a palindrome!`,
    flowSteps: [
      { step: 1, title: 'Normalize Text', desc: 'Strip whitespace and convert to lowercase: text.lower().strip()', icon: '🔤' },
      { step: 2, title: 'Invert String', desc: 'Reverse characters using slice operator clean_text[::-1]', icon: '🔄' },
      { step: 3, title: 'Equality Comparison', desc: 'Compare clean_text == reversed_text', icon: '⚖️' },
      { step: 4, title: 'Return Boolean', desc: 'Return True if identical, else False', icon: '✅' },
    ],
    code: `def is_palindrome(text):\n    # Convert to lowercase to ignore case sensitivity\n    clean_text = text.lower().strip()\n    # Invert the string using Python slice [::-1]\n    reversed_text = clean_text[::-1]\n    return clean_text == reversed_text\n\n# Test cases\ntest_words = ["radar", "Python", "Madam"]\nfor word in test_words:\n    if is_palindrome(word):\n        print(f"'{word}' is a palindrome!")\n    else:\n        print(f"'{word}' is NOT a palindrome.")`,
    explanations: [
      {
        lineNumber: 1,
        code: 'def is_palindrome(text):',
        spokenIntent: 'palindrome check karne ke liye function',
        englishExplanation: 'Defines the helper function taking an input string `text`.',
        hinglishExplanation: 'Palindrome check karne ka function banaya.',
        keyConcept: 'Functions'
      },
      {
        lineNumber: 3,
        code: '    clean_text = text.lower().strip()',
        spokenIntent: 'letters ko lowercase karo aur extra spaces hatao',
        englishExplanation: 'Normalizes the word: `.lower()` makes it case-insensitive, `.strip()` removes outer whitespace.',
        hinglishExplanation: 'Text ko chhota (lowercase) kar diya taaki "Madam" aur "madam" dono match karein.',
        keyConcept: 'String normalization'
      },
      {
        lineNumber: 5,
        code: '    reversed_text = clean_text[::-1]',
        spokenIntent: 'string ko ulta kar do slice syntax se',
        englishExplanation: '`[::-1]` is Python slicing magic that reverses any sequence in one step.',
        hinglishExplanation: 'Python ka super shortcut `[::-1]` poore string ko ek hi step me ulta kar deta hai.',
        keyConcept: 'String Slicing (`[::-1]`)',
        beginnerTip: 'The syntax `[start:stop:step]` with a step of `-1` walks backward through the string.'
      },
      {
        lineNumber: 6,
        code: '    return clean_text == reversed_text',
        spokenIntent: 'dono barabar hain ya nahi compare karke return karo',
        englishExplanation: 'Returns True if the original and reversed strings match, otherwise False.',
        hinglishExplanation: 'Agar sidha aur ulta text bilkul same hai toh True return karega.',
        keyConcept: 'Equality comparison (`==`)'
      }
    ]
  },
  'factorial-loop': {
    title: 'Iterative Factorial Calculator',
    summary: 'Computes factorial of a number N (N! = N * (N-1) * ... * 1) using a standard for loop.',
    rawSpoken: 'kisi number ka factorial nikaalna hai loop use karke simple tareeqe se',
    languageDetected: 'hinglish',
    source: 'preset',
    tags: ['math', 'loops', 'multiplication', 'factorials'],
    sampleInput: 'N = 6',
    expectedOutput: `Calculating 6!
Step 1: 1 * 1 = 1
Step 2: 1 * 2 = 2
Step 3: 2 * 3 = 6
Step 4: 6 * 4 = 24
Step 5: 24 * 5 = 120
Step 6: 120 * 6 = 720
Final Answer: 6! = 720`,
    flowSteps: [
      { step: 1, title: 'Input Guard', desc: 'Check if n < 0; factorials only exist for non-negatives', icon: '🛡️' },
      { step: 2, title: 'Initialize Result', desc: 'Set result = 1 (multiplication identity)', icon: '1️⃣' },
      { step: 3, title: 'Multiply in Loop', desc: 'Loop i from 1 to n, accumulating result *= i', icon: '✖️' },
      { step: 4, title: 'Output Steps', desc: 'Display each step value and print final factorial', icon: '🎯' },
    ],
    code: `def calculate_factorial(n):\n    if n < 0:\n        return "Factorial does not exist for negative numbers"\n    \n    result = 1\n    print(f"Calculating {n}!")\n    for i in range(1, n + 1):\n        prev = result\n        result *= i\n        print(f"Step {i}: {prev} * {i} = {result}")\n        \n    return result\n\n# Test with 6\nans = calculate_factorial(6)\nprint(f"Final Answer: 6! = {ans}")`,
    explanations: [
      {
        lineNumber: 1,
        code: 'def calculate_factorial(n):',
        spokenIntent: 'factorial nikaalne ka function',
        englishExplanation: 'Defines function that calculates n factorial.',
        hinglishExplanation: 'Factorial nikaalne ka function banaya jo number n lega.',
        keyConcept: 'Functions'
      },
      {
        lineNumber: 2,
        code: '    if n < 0:',
        spokenIntent: 'check karo negative number na ho',
        englishExplanation: 'Guards against negative inputs because factorials are only defined for non-negative integers.',
        hinglishExplanation: 'Negative numbers ka factorial nahi hota, isliye pehle hi check kar liya.',
        keyConcept: 'Input Validation'
      },
      {
        lineNumber: 5,
        code: '    result = 1',
        spokenIntent: 'result ko 1 se initialize kiya',
        englishExplanation: 'Initializes result to 1 (identity for multiplication).',
        hinglishExplanation: 'Multiplication ke liye starting value 1 rakhi kyunki 0 se multiply karne par sab zero ho jata.',
        keyConcept: 'Multiplication identity'
      },
      {
        lineNumber: 7,
        code: '    for i in range(1, n + 1):',
        spokenIntent: '1 se n tak loop chalaya',
        englishExplanation: 'Loops through all integers from 1 up to n.',
        hinglishExplanation: '1 se lekar n tak sabhi numbers par loop chalaya.',
        keyConcept: 'Range iteration'
      },
      {
        lineNumber: 9,
        code: '        result *= i',
        spokenIntent: 'result ko i se multiply karte jao',
        englishExplanation: 'Multiplies current cumulative result by the loop index `i`.',
        hinglishExplanation: 'Har step me pichhle result ko `i` se guna (multiply) kar rahe hain.',
        keyConcept: 'In-place multiplication (`*=`)'
      }
    ]
  },
  'word-counter': {
    title: 'Word Frequency Analyzer',
    summary: 'Counts occurrences of each word in a given text paragraph using a Python dictionary.',
    rawSpoken: 'I want to count how many times each word appears in a sentence using a dictionary',
    languageDetected: 'english',
    source: 'preset',
    tags: ['dictionaries', 'string manipulation', 'counting'],
    sampleInput: '"apple banana apple orange banana apple"',
    expectedOutput: `Word Frequencies:
• apple: 3 times
• banana: 2 times
• orange: 1 times`,
    flowSteps: [
      { step: 1, title: 'Clean & Tokenize', desc: 'Lowercase text and split into words using .split()', icon: '✂️' },
      { step: 2, title: 'Initialize Map', desc: 'Create empty frequency = {} dictionary', icon: '📖' },
      { step: 3, title: 'Tally Counts', desc: 'If word in frequency: +=1, else set to 1', icon: '🔢' },
      { step: 4, title: 'Iterate & Display', desc: 'Print formatted bullet list of word occurrences', icon: '📋' },
    ],
    code: `def count_word_frequency(sentence):\n    words = sentence.lower().split()\n    frequency = {}\n    \n    for word in words:\n        if word in frequency:\n            frequency[word] += 1\n        else:\n            frequency[word] = 1\n            \n    return frequency\n\n# Test sentence\ntext = "apple banana apple orange banana apple"\ncounts = count_word_frequency(text)\n\nprint("Word Frequencies:")\nfor word, count in counts.items():\n    print(f"• {word}: {count} times")`,
    explanations: [
      {
        lineNumber: 1,
        code: 'def count_word_frequency(sentence):',
        spokenIntent: 'function to count words',
        englishExplanation: 'Defines the counting function taking a string `sentence`.',
        hinglishExplanation: 'Sentence me words count karne ka function banaya.',
        keyConcept: 'Functions'
      },
      {
        lineNumber: 2,
        code: '    words = sentence.lower().split()',
        spokenIntent: 'split into lowercase words',
        englishExplanation: 'Converts sentence to lowercase and splits by whitespace into a list of words.',
        hinglishExplanation: 'Sentence ko chhota karke spaces ke hisab se words ki list me tod diya.',
        keyConcept: '`str.split()`'
      },
      {
        lineNumber: 3,
        code: '    frequency = {}',
        spokenIntent: 'empty dictionary for counts',
        englishExplanation: 'Initializes an empty dictionary to map each word to its frequency count.',
        hinglishExplanation: 'Khali dictionary banayi jisme har word aur uska count store karenge.',
        keyConcept: 'Dictionaries (`{}`)'
      },
      {
        lineNumber: 6,
        code: '        if word in frequency:',
        spokenIntent: 'check if word is already in dict',
        englishExplanation: 'Checks if this word has been encountered before.',
        hinglishExplanation: 'Check kiya ki kya ye word pehle dictionary me aa chuka hai.',
        keyConcept: 'Membership check (`in`)'
      },
      {
        lineNumber: 7,
        code: '            frequency[word] += 1',
        spokenIntent: 'increment existing count',
        englishExplanation: 'Increments the tally for this word.',
        hinglishExplanation: 'Pehle se tha toh uska count 1 badha diya.',
        keyConcept: 'Dictionary update'
      },
      {
        lineNumber: 9,
        code: '            frequency[word] = 1',
        spokenIntent: 'first time seeing word, set to 1',
        englishExplanation: 'Initializes the count to 1 for newly discovered words.',
        hinglishExplanation: 'Pehli baar dekha toh uska count 1 set kar diya.',
        keyConcept: 'Dictionary insertion'
      }
    ]
  },
  'fibonacci-series': {
    title: 'Fibonacci Sequence Generator',
    summary: 'Generates the first N numbers of the Fibonacci sequence starting with 0 and 1.',
    rawSpoken: 'Generate the first 10 numbers of the Fibonacci sequence starting with 0 and 1',
    languageDetected: 'english',
    source: 'preset',
    tags: ['fibonacci', 'sequences', 'loops'],
    sampleInput: 'Count: 10',
    expectedOutput: `First 10 Fibonacci numbers:
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
    flowSteps: [
      { step: 1, title: 'Seed Values', desc: 'Initialize list with base seeds [0, 1]', icon: '🌱' },
      { step: 2, title: 'While Condition', desc: 'Loop while len(seq) < n', icon: '🔄' },
      { step: 3, title: 'Add Preceding Two', desc: 'next_num = seq[-1] + seq[-2]', icon: '➕' },
      { step: 4, title: 'Append & Return', desc: 'seq.append(next_num) and output full sequence', icon: '🏁' },
    ],
    code: `def generate_fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n        \n    seq = [0, 1]\n    while len(seq) < n:\n        next_num = seq[-1] + seq[-2]\n        seq.append(next_num)\n        \n    return seq\n\n# Generate first 10 numbers\nresult = generate_fibonacci(10)\nprint("First 10 Fibonacci numbers:")\nprint(result)`,
    explanations: [
      {
        lineNumber: 1,
        code: 'def generate_fibonacci(n):',
        spokenIntent: 'function to generate n fibonacci numbers',
        englishExplanation: 'Defines the generator function taking count `n`.',
        hinglishExplanation: 'Fibonacci numbers generate karne ka function banaya.',
        keyConcept: 'Functions'
      },
      {
        lineNumber: 6,
        code: '    seq = [0, 1]',
        spokenIntent: 'start with initial seed values 0 and 1',
        englishExplanation: 'Seeds the sequence with standard base cases: 0 and 1.',
        hinglishExplanation: 'Pehle do fixed numbers [0, 1] se shuru kiya.',
        keyConcept: 'Base sequence'
      },
      {
        lineNumber: 7,
        code: '    while len(seq) < n:',
        spokenIntent: 'keep looping until we have n numbers',
        englishExplanation: 'Continues looping while the list length is less than desired `n`.',
        hinglishExplanation: 'Jab tak list me n numbers na ho jayein, loop chalate raho.',
        keyConcept: 'While loop'
      },
      {
        lineNumber: 8,
        code: '        next_num = seq[-1] + seq[-2]',
        spokenIntent: 'add last two numbers',
        englishExplanation: 'Sums the last element (`seq[-1]`) and second-to-last element (`seq[-2]`).',
        hinglishExplanation: 'Pichhle dono numbers ko jod kar naya number banaya.',
        keyConcept: 'Negative list indexing (`seq[-1]`)'
      },
      {
        lineNumber: 9,
        code: '        seq.append(next_num)',
        spokenIntent: 'append new number to sequence',
        englishExplanation: 'Adds the freshly calculated number to the end of our list.',
        hinglishExplanation: 'Naye number ko list me jod diya.',
        keyConcept: 'List append'
      }
    ]
  }
};

/**
 * Intelligent pattern matching synthesizer for offline queries
 */
export function synthesizeOfflineLogic(spokenQuery: string): LogicSynthesisResult {
  const query = spokenQuery.toLowerCase();
  
  // Detect language
  const hinglishWords = ['bhai', 'mere', 'ko', 'kaise', 'karein', 'karna', 'hai', 'hatao', 'nikaal', 'karke', 'banao', 'chahiye', 'ulta', 'likh', 'do', 'samjha'];
  const isHinglish = hinglishWords.some(w => query.includes(w));
  
  // 1. Prime Numbers
  if (query.includes('prime') || query.includes('abhyaja') || (query.includes('number') && query.includes('divide'))) {
    const base = { ...PRESET_DATA['prime-hinglish'] };
    base.rawSpoken = spokenQuery;
    base.languageDetected = isHinglish ? 'hinglish' : 'english';
    base.source = 'offline-engine';
    return base;
  }
  
  // 2. Even / Odd numbers or Sum of evens
  if (query.includes('even') || query.includes('sam sankhya') || (query.includes('sum') && query.includes('even'))) {
    const base = { ...PRESET_DATA['even-sum-hinglish'] };
    base.rawSpoken = spokenQuery;
    base.languageDetected = isHinglish ? 'hinglish' : 'english';
    base.source = 'offline-engine';
    return base;
  }

  // 3. Palindrome
  if (query.includes('palindrome') || query.includes('ulta') || query.includes('radar') || query.includes('reverse and check')) {
    const base = { ...PRESET_DATA['palindrome-check'] };
    base.rawSpoken = spokenQuery;
    base.languageDetected = isHinglish ? 'hinglish' : 'english';
    base.source = 'offline-engine';
    return base;
  }

  // 4. Factorial
  if (query.includes('factorial') || query.includes('gunanafal')) {
    const base = { ...PRESET_DATA['factorial-loop'] };
    base.rawSpoken = spokenQuery;
    base.languageDetected = isHinglish ? 'hinglish' : 'english';
    base.source = 'offline-engine';
    return base;
  }

  // 5. Fibonacci
  if (query.includes('fibonacci') || query.includes('series')) {
    const base = { ...PRESET_DATA['fibonacci-series'] };
    base.rawSpoken = spokenQuery;
    base.languageDetected = isHinglish ? 'hinglish' : 'english';
    base.source = 'offline-engine';
    return base;
  }

  // 6. Word frequency / dictionary
  if (query.includes('word') || query.includes('frequency') || query.includes('count') || query.includes('dictionary')) {
    const base = { ...PRESET_DATA['word-counter'] };
    base.rawSpoken = spokenQuery;
    base.languageDetected = isHinglish ? 'hinglish' : 'english';
    base.source = 'offline-engine';
    return base;
  }

  // Default fallback: prime numbers finder with user's custom spoken phrase
  const fallback = { ...PRESET_DATA['prime-hinglish'] };
  fallback.rawSpoken = spokenQuery;
  fallback.languageDetected = isHinglish ? 'hinglish' : 'english';
  fallback.source = 'offline-engine';
  return fallback;
}
