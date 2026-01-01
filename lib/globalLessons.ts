// 🧠 FILE PURPOSE
// This file contains 10 global English learning lessons that all users share.
// These lessons are hardcoded and ready to use directly in the app.

export const GLOBAL_LESSONS = [
  // Lesson 1: Greetings & Introductions
  {
    number: 1,
    title: "Greetings & Introductions",
    practice: [
      {
        type: "matching",
        question: "Match the English greetings with their meanings",
        pairs: {
          "Hello": "A common greeting",
          "Good morning": "Greeting used before noon",
          "How are you?": "Asking about someone's well-being"
        }
      },
      {
        type: "sentence-building",
        question: "Arrange the words to make a greeting",
        words: ["Hello", "my", "name", "is", "John", "goodbye", "car"],
        correctSentence: "Hello my name is John"
      },
      {
        type: "multiple-choice",
        question: "Which greeting is used in the morning?",
        options: [
          { id: "A", text: "Good morning" },
          { id: "B", text: "Good night" },
          { id: "C", text: "Good afternoon" },
          { id: "D", text: "Good evening" }
        ],
        correctAnswer: "A",
        explanation: "Good morning is used before noon.",
        difficulty: "easy"
      }
    ]
  },

  // Lesson 2: Family & People
  {
    number: 2,
    title: "Family & People",
    practice: [
      {
        type: "matching",
        question: "Match the family members",
        pairs: {
          "Mother": "Female parent",
          "Father": "Male parent",
          "Sister": "Female sibling",
          "Brother": "Male sibling"
        }
      },
      {
        type: "fill-in-blank",
        sentence: "My ___ is very kind and caring.",
        correctAnswer: "mother",
        wrongOptions: ["car", "book", "computer"],
        explanation: "Mother is a family member."
      },
      {
        type: "sentence-building",
        question: "Build a sentence about family",
        words: ["I", "have", "two", "brothers", "cats", "running", "happy"],
        correctSentence: "I have two brothers"
      }
    ]
  },

  // Lesson 3: Colors & Descriptions
  {
    number: 3,
    title: "Colors & Descriptions",
    practice: [
      {
        type: "matching",
        question: "Match the colors",
        pairs: {
          "Red": "The color of fire",
          "Blue": "The color of the sky",
          "Green": "The color of grass",
          "Yellow": "The color of the sun"
        }
      },
      {
        type: "multiple-choice",
        question: "What color is the grass?",
        options: [
          { id: "A", text: "Green" },
          { id: "B", text: "Red" },
          { id: "C", text: "Blue" },
          { id: "D", text: "Yellow" }
        ],
        correctAnswer: "A",
        explanation: "Grass is green.",
        difficulty: "easy"
      },
      {
        type: "sentence-building",
        question: "Make a sentence about colors",
        words: ["The", "sky", "is", "blue", "red", "running", "happy"],
        correctSentence: "The sky is blue"
      }
    ]
  },

  // Lesson 4: Food & Drinks
  {
    number: 4,
    title: "Food & Drinks",
    practice: [
      {
        type: "matching",
        question: "Match the food items",
        pairs: {
          "Apple": "A red or green fruit",
          "Bread": "Made from flour and baked",
          "Water": "Clear liquid we drink",
          "Coffee": "Hot brown drink from beans"
        }
      },
      {
        type: "fill-in-blank",
        sentence: "I drink ___ every morning.",
        correctAnswer: "coffee",
        wrongOptions: ["table", "car", "book"],
        explanation: "Coffee is a common morning drink."
      },
      {
        type: "multiple-choice",
        question: "Which is a fruit?",
        options: [
          { id: "A", text: "Apple" },
          { id: "B", text: "Bread" },
          { id: "C", text: "Coffee" },
          { id: "D", text: "Water" }
        ],
        correctAnswer: "A",
        explanation: "Apple is a fruit.",
        difficulty: "easy"
      },
      {
        type: "sentence-building",
        question: "Make a sentence about food",
        words: ["I", "eat", "an", "apple", "car", "running", "every", "day"],
        correctSentence: "I eat an apple every day"
      }
    ]
  },

  // Lesson 5: Animals
  {
    number: 5,
    title: "Animals",
    practice: [
      {
        type: "matching",
        question: "Match the animals with their descriptions",
        pairs: {
          "Dog": "A common pet that barks",
          "Cat": "A pet that meows",
          "Bird": "An animal that flies",
          "Fish": "Lives in water"
        }
      },
      {
        type: "sentence-building",
        question: "Build a sentence about animals",
        words: ["The", "dog", "is", "running", "sleeping", "car", "happy"],
        correctSentence: "The dog is running"
      },
      {
        type: "multiple-choice",
        question: "Which animal lives in water?",
        options: [
          { id: "A", text: "Fish" },
          { id: "B", text: "Dog" },
          { id: "C", text: "Cat" },
          { id: "D", text: "Bird" }
        ],
        correctAnswer: "A",
        explanation: "Fish live in water.",
        difficulty: "easy"
      },
      {
        type: "fill-in-blank",
        sentence: "A ___ can fly in the sky.",
        correctAnswer: "bird",
        wrongOptions: ["car", "dog", "fish"],
        explanation: "Birds have wings and can fly."
      }
    ]
  },

  // Lesson 6: Daily Actions
  {
    number: 6,
    title: "Daily Actions",
    practice: [
      {
        type: "matching",
        question: "Match the daily actions",
        pairs: {
          "Wake up": "Get out of bed in the morning",
          "Eat breakfast": "First meal of the day",
          "Go to work": "Travel to your job",
          "Sleep": "Rest at night"
        }
      },
      {
        type: "sentence-building",
        question: "Make a sentence about daily routine",
        words: ["I", "wake", "up", "at", "seven", "sleeping", "car", "o'clock"],
        correctSentence: "I wake up at seven o'clock"
      },
      {
        type: "fill-in-blank",
        sentence: "I ___ breakfast every morning.",
        correctAnswer: "eat",
        wrongOptions: ["sleep", "fly", "run"],
        explanation: "We eat breakfast in the morning."
      },
      {
        type: "multiple-choice",
        question: "What do you do at night?",
        options: [
          { id: "A", text: "Sleep" },
          { id: "B", text: "Wake up" },
          { id: "C", text: "Eat breakfast" },
          { id: "D", text: "Go to work" }
        ],
        correctAnswer: "A",
        explanation: "We sleep at night.",
        difficulty: "easy"
      }
    ]
  },

  // Lesson 7: Weather & Seasons
  {
    number: 7,
    title: "Weather & Seasons",
    practice: [
      {
        type: "matching",
        question: "Match the weather and seasons",
        pairs: {
          "Sunny": "Bright with sunlight",
          "Rainy": "Water falling from sky",
          "Cold": "Low temperature",
          "Hot": "High temperature"
        }
      },
      {
        type: "multiple-choice",
        question: "When does it snow?",
        options: [
          { id: "A", text: "In winter" },
          { id: "B", text: "In summer" },
          { id: "C", text: "In spring" },
          { id: "D", text: "Never" }
        ],
        correctAnswer: "A",
        explanation: "Snow falls in winter when it's cold.",
        difficulty: "easy"
      },
      {
        type: "sentence-building",
        question: "Build a sentence about weather",
        words: ["It", "is", "sunny", "today", "car", "running", "cold"],
        correctSentence: "It is sunny today"
      },
      {
        type: "fill-in-blank",
        sentence: "I need an umbrella when it is ___.",
        correctAnswer: "rainy",
        wrongOptions: ["sunny", "happy", "green"],
        explanation: "We use umbrellas when it rains."
      }
    ]
  },

  // Lesson 8: At School
  {
    number: 8,
    title: "At School",
    practice: [
      {
        type: "matching",
        question: "Match school-related items",
        pairs: {
          "Teacher": "Person who teaches",
          "Student": "Person who learns",
          "Book": "Used for reading and studying",
          "Pencil": "Used for writing"
        }
      },
      {
        type: "sentence-building",
        question: "Make a sentence about school",
        words: ["The", "teacher", "is", "teaching", "running", "car", "English"],
        correctSentence: "The teacher is teaching English"
      },
      {
        type: "fill-in-blank",
        sentence: "I write with a ___.",
        correctAnswer: "pencil",
        wrongOptions: ["teacher", "car", "sky"],
        explanation: "We use a pencil to write."
      },
      {
        type: "multiple-choice",
        question: "Who teaches at school?",
        options: [
          { id: "A", text: "Teacher" },
          { id: "B", text: "Student" },
          { id: "C", text: "Book" },
          { id: "D", text: "Pencil" }
        ],
        correctAnswer: "A",
        explanation: "Teachers teach students at school.",
        difficulty: "easy"
      }
    ]
  },

  // Lesson 9: Shopping & Money
  {
    number: 9,
    title: "Shopping & Money",
    practice: [
      {
        type: "matching",
        question: "Match shopping vocabulary",
        pairs: {
          "Buy": "Purchase something",
          "Sell": "Give something for money",
          "Price": "How much something costs",
          "Money": "Used to buy things"
        }
      },
      {
        type: "multiple-choice",
        question: "What do you need to buy something?",
        options: [
          { id: "A", text: "Money" },
          { id: "B", text: "Book" },
          { id: "C", text: "Car" },
          { id: "D", text: "Sky" }
        ],
        correctAnswer: "A",
        explanation: "You need money to buy things.",
        difficulty: "easy"
      },
      {
        type: "sentence-building",
        question: "Build a sentence about shopping",
        words: ["I", "want", "to", "buy", "a", "book", "car", "fly"],
        correctSentence: "I want to buy a book"
      },
      {
        type: "fill-in-blank",
        sentence: "The ___ of this apple is two dollars.",
        correctAnswer: "price",
        wrongOptions: ["color", "teacher", "sky"],
        explanation: "Price is how much something costs."
      }
    ]
  },

  // Lesson 10: Time & Schedule
  {
    number: 10,
    title: "Time & Schedule",
    practice: [
      {
        type: "matching",
        question: "Match time-related words",
        pairs: {
          "Morning": "Early part of the day",
          "Afternoon": "Middle of the day",
          "Evening": "Late part of the day",
          "Night": "Dark time when we sleep"
        }
      },
      {
        type: "sentence-building",
        question: "Make a sentence about time",
        words: ["I", "go", "to", "bed", "at", "night", "morning", "car"],
        correctSentence: "I go to bed at night"
      },
      {
        type: "fill-in-blank",
        sentence: "I wake up in the ___.",
        correctAnswer: "morning",
        wrongOptions: ["night", "car", "book"],
        explanation: "We wake up in the morning."
      },
      {
        type: "multiple-choice",
        question: "When is it dark outside?",
        options: [
          { id: "A", text: "Night" },
          { id: "B", text: "Morning" },
          { id: "C", text: "Afternoon" },
          { id: "D", text: "Never" }
        ],
        correctAnswer: "A",
        explanation: "It is dark at night.",
        difficulty: "easy"
      }
    ]
  },

  // Lesson 11: Covert Manipulation — Recognition & Defense
  {
    number: 11,
    title: "Covert Manipulation — Recognition & Defense",
    practice: [
      {
        type: "multiple-choice",
        question: "What does 'covert' mean in 'covert manipulation'?",
        options: [
          { id: "A", text: "Open and obvious" },
          { id: "B", text: "Hidden or disguised" },
          { id: "C", text: "Loud and public" },
          { id: "D", text: "Quick and easy" }
        ],
        correctAnswer: "B",
        explanation: "Covert means hidden or disguised — the manipulator hides their agenda.",
        difficulty: "easy"
      },
      {
        type: "fill-in-blank",
        sentence: "Covert manipulation often aims to change a person's ___ without them noticing.",
        correctAnswer: "opinion",
        wrongOptions: ["clock", "weather", "salary"],
        explanation: "The goal is usually to change opinion, feelings, or behavior subtly."
      },
      {
        type: "matching",
        question: "Match terms to their definitions",
        pairs: {
          "Covert": "Hidden or disguised",
          "Obfuscation": "Hiding relevant facts",
          "Assertive call-out": "Naming the behavior calmly"
        }
      },
      {
        type: "sentence-building",
        question: "Arrange the words to make a correct short sentence about covert manipulation",
        words: ["Covert", "aims", "to", "persuade", "subtly", "loudly", "openly"],
        correctSentence: "Covert aims to persuade subtly"
      },
      {
        type: "multiple-choice",
        question: "Which of the following is a safe defensive response to suspected manipulation?",
        options: [
          { id: "A", text: "Call the person out calmly and ask for facts" },
          { id: "B", text: "Agree quickly to avoid conflict" },
          { id: "C", text: "Ignore and never speak about it again" },
          { id: "D", text: "Publicly shame them immediately" }
        ],
        correctAnswer: "A",
        explanation: "Calmly calling out and asking for facts protects your autonomy without escalating.",
        difficulty: "medium"
      },
      {
        type: "multiple-choice",
        question: "Which practice should you avoid to protect yourself from covert manipulation?",
        options: [
          { id: "A", text: "Ask clarifying questions" },
          { id: "B", text: "Accept a claim without checking" },
          { id: "C", text: "Request evidence" },
          { id: "D", text: "Take time before deciding" }
        ],
        correctAnswer: "B",
        explanation: "Accepting claims without checking makes you vulnerable to hidden agendas.",
        difficulty: "easy"
      }
    ]
  }
];
