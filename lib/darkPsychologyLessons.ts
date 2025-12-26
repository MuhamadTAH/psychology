// 🧠 FILE PURPOSE
// This file contains Dark Psychology lessons that all users can access.
// Lessons are added via the admin panel and stored here globally.

export interface LessonPart {
  partNumber: number;
  partTitle: string;
  questions: any[];
}

export interface DarkPsychologyLesson {
  // Legacy fields (backward compatibility)
  number: number;
  title: string;
  section: string; // A, B, C, or D
  practice: any[];
  parts?: LessonPart[];
  totalParts?: number;

  // New comprehensive structure
  sectionId?: string; // "A", "B", "C", "D"
  sectionTitle?: string; // "The Foundations of the Dark Mind"
  unitId?: string; // "A1", "A2", "B1"
  unitTitle?: string; // "The Unseen Influence"
  lessonId?: string; // "A1-1", "A1-2"
  lessonTitle?: string;
  lessonType?: string; // "Normal", "Boss", "Story"
  lessonPart?: number; // Which part this lesson belongs to
  lessonPartTitle?: string; // "Practice and Application"
  objective?: string;

  gamification?: {
    progressRings?: Array<{ringId: string, status: string, label: string}>;
    pointsValue?: number;
    starsAvailable?: number;
    badgeOnCompletion?: string;
  };

  contentScreens?: any[]; // Full screen-based content
}

export const SECTIONS = {
  A: "The Foundations of the Dark Mind",
  B: "Psychological Tactics",
  C: "Defense Strategies",
  D: "Ethical Applications"
};

export const DARK_PSYCHOLOGY_LESSONS: DarkPsychologyLesson[] = [
  // Lesson 3: The "Bootcamp" - Definitions, History & Ethics
  {
                                                                                                                              "number": 3,
                                                                                                                              "title": "The \"Bootcamp\" - Definitions, History & Ethics",
                                                                                                                              "section": "A",
                                                                                                                              "sectionId": "A",
                                                                                                                              "sectionTitle": "The Foundations of the Dark Mind",
                                                                                                                              "unitId": "A1",
                                                                                                                              "unitTitle": "The Fast Hook",
                                                                                                                              "lessonId": "A1-3",
                                                                                                                              "lessonTitle": "The \"Bootcamp\" - Definitions, History & Ethics",
                                                                                                                              "lessonType": "Normal",
                                                                                                                              "lessonPart": 1,
                                                                                                                              "lessonPartTitle": "The Core Definitions (What is Dark Psychology?)",
                                                                                                                              "objective": "To formally define the core concepts of Dark Psychology (Manipulation, Coercion, Persuasion) and distinguish them from benign influence.",
                                                                                                                              "gamification": {
                                                                                                                                "progressRings": [
                                                                                                                                  {
                                                                                                                                    "ringId": "learn",
                                                                                                                                    "status": "pending",
                                                                                                                                    "label": "Part 1"
                                                                                                                                  },
                                                                                                                                  {
                                                                                                                                    "ringId": "practice",
                                                                                                                                    "status": "pending",
                                                                                                                                    "label": "Part 2"
                                                                                                                                  },
                                                                                                                                  {
                                                                                                                                    "ringId": "challenge",
                                                                                                                                    "status": "pending",
                                                                                                                                    "label": "Part 3"
                                                                                                                                  }
                                                                                                                                ],
                                                                                                                                "pointsValue": 100,
                                                                                                                                "starsAvailable": 3,
                                                                                                                                "badgeOnCompletion": null
                                                                                                                              },
                                                                                                                              "parts": [
                                                                                                                                {
                                                                                                                                  "partNumber": 1,
                                                                                                                                  "partTitle": "The Core Definitions (What is Dark Psychology?)",
                                                                                                                                  "questions": [
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the core concept. Both a therapist and a con-artist use psychology. One intends to heal, the other intends to harm or exploit. Intent is everything.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "What is the *primary* factor that separates 'Dark Psychology' from 'Light Psychology' (like therapy)?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "How effective it is."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "The *intent* (to control vs. to empower)."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "How famous the person is."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "The amount of money involved."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is a myth. 'Persuasion' (like a debate or a sales pitch) is often transparent. It becomes 'manipulation' when it's deceptive, hidden, and exploits weaknesses.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Any attempt to 'persuade' someone is a form of 'dark' manipulation.",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the 'Big 3'. Persuasion (transparent), Manipulation (hidden), Coercion (force). Understanding this is your first layer of defense.",
                                                                                                                                      "type": "matching",
                                                                                                                                      "question": "Match the core term to its definition:",
                                                                                                                                      "pairs": [
                                                                                                                                        {
                                                                                                                                          "term": "Persuasion",
                                                                                                                                          "definition": "Using emotion or logic to convince someone *transparently*."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "term": "Manipulation",
                                                                                                                                          "definition": "Using *hidden* influence or deception to control someone's choice."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "term": "Coercion",
                                                                                                                                          "definition": "Using *threats* or force (implied or real) to control someone."
                                                                                                                                        }
                                                                                                                                      ]
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "The implied threat of 'you're fired' is a form of force. Coercion is about removing choice through fear.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Your boss says, 'If you don't finish this report by Friday, don't bother coming in on Monday.'\n\nThis is a clear example of:",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Persuasion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Manipulation"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Coercion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Flattery"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "C"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is a guilt-trip, a form of emotional manipulation. It's hidden. They aren't asking for money, they are *attacking your character* to get the money.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Your friend says, 'If you *really* cared about me, you would lend me the money.'\n\nThis is a clear example of:",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Persuasion (a logical argument)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Manipulation (a hidden guilt-trip)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Coercion (a direct threat)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "A simple request"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is persuasion. The attempt to influence is *transparent*. The politician is openly stating their case to win your vote. You are free to agree or disagree.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "A politician says, 'My plan will create 10,000 jobs and make this city safer for your families. I urge you to vote for me.'\n\nAssuming the claims are debatable, this is a form of:",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Persuasion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Manipulation"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Coercion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Gaslighting"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the key mechanical difference. Manipulation is a 'trick,' Coercion is a 'push'.",
                                                                                                                                      "type": "fill-in-blank",
                                                                                                                                      "sentence": "Manipulation requires ___ (like deceit), while Coercion requires ___ (like threats).",
                                                                                                                                      "correctAnswer": "deception",
                                                                                                                                      "wrongOptions": [
                                                                                                                                        "honesty",
                                                                                                                                        "kindness",
                                                                                                                                        "money"
                                                                                                                                      ]
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "They are forms of *Manipulation*. Alex didn't *force* or *threaten* you. Alex *tricked* you by lowering your defenses and making you feel indebted.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "The 'Flattery' and 'Reciprocity Trap' Alex used in the Coffee Shop are forms of Coercion.",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the rule. Always ask yourself: What is the *true intent* behind their words?",
                                                                                                                                      "type": "sentence-building",
                                                                                                                                      "question": "Arrange these words into the 'Golden Rule' of this lesson:",
                                                                                                                                      "words": [
                                                                                                                                        "is",
                                                                                                                                        "the",
                                                                                                                                        "Dark",
                                                                                                                                        "Psychology",
                                                                                                                                        "Intent",
                                                                                                                                        "of",
                                                                                                                                        "language"
                                                                                                                                      ],
                                                                                                                                      "correctSentence": "Intent is the language of Dark Psychology"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "We will have a whole unit on this. Gaslighting ('That never happened,' 'You're crazy') is one of the most 'dark' forms of manipulation.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "What is 'Gaslighting'?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "A form of persuasion using facts."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "A form of coercion using physical threats."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "A form of manipulation that makes you doubt your own reality or memory."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "A form of flattery."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "C"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "Persuasion is *open*. Manipulation is *hidden*. Coercion is *forced*.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "This tactic is *hidden* and uses *deception* to get a 'yes'. This is the definition of...?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Coercion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Manipulation"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Persuasion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Honesty"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is an advanced, combined tactic. It's manipulation (guilt) *and* coercion (the implied threat: 'If you're not 'all-in,' your job is at risk').",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "A boss needs someone to work the weekend. Instead of asking directly, the boss says in a meeting, 'I'm *so* worried we'll lose this client. This project means everything. It's a shame not everyone is as 'all-in' as I am.' The boss then looks around the room. This is a combination of a guilt-trip (Manipulation) and...?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Implied Coercion (a threat to your job's 'safety')"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Open Persuasion (a logical argument)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Flattery (praising the team)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Honesty (sharing feelings)"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is a high-level concept. Remember *intent*? If the intent is genuinely for *their* benefit (and not your own), it's a 'grey area' that most would not consider 'dark'.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Manipulation can sometimes be 'benign' (harmless), like convincing a sad friend to go to a party you *know* they will enjoy.",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "The antidote to 'dark' (hidden, deceptive) communication is 'light' (transparent, direct) communication. 'I need help' is 'light'. 'If you were a *good* friend...' is 'dark'.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "What is the *opposite* of manipulation?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Silence"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Transparent & Direct Communication"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Better persuasion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Coercion"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "You've learned the 'what.' Next, you'll learn the 'why' (ethics) and the 'who' (history).",
                                                                                                                                      "type": "fill-in-blank",
                                                                                                                                      "sentence": "In Part 2, we will cover the ___ and ___ of these tactics.",
                                                                                                                                      "correctAnswer": "ethics",
                                                                                                                                      "wrongOptions": [
                                                                                                                                        "cost",
                                                                                                                                        "colors"
                                                                                                                                      ]
                                                                                                                                    }
                                                                                                                                  ]
                                                                                                                                },
                                                                                                                                {
                                                                                                                                  "partNumber": 2,
                                                                                                                                  "partTitle": "The 'Why' & 'Who' (Ethics & History)",
                                                                                                                                  "questions": [
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the 'Do No Harm' principle. You don't 'attack' (which causes defense), you 'inquire' (which causes reflection). This is using awareness to *help*.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "A friend is in a new relationship and is being 'love-bombed' (excessive flattery, gifts, fast intimacy) but they are happy. What is the most 'ethically aware' action?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Tell them their partner is a manipulator and they should break up."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Do nothing. It's not your business."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Gently ask them, 'It's great you're so happy! Is the pace ever a bit much?'"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Use love-bombing tactics on your own partner."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "C"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is our 'Ethical Compass.' Learning this is about building a shield, not a sword.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "The 'Prime Directive' of this app is: 'Use this knowledge for awareness, defense, and personal growth, not to harm or exploit others.'",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "Machiavelli's book 'The Prince' is a famous historical 'playbook' on using deception, fear, and manipulation to maintain power. This is the 'Who'.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Who is considered the 'father' of 'ends justifies the means' philosophy, making him a core figure in Dark Psychology history?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Sigmund Freud"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Carl Jung"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Niccolò Machiavelli"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Abraham Maslow"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "C"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "These tactics aren't new. They have just been 're-branded' over time. What was 'propaganda' then is now 'fake news' or 'viral campaigns'.",
                                                                                                                                      "type": "matching",
                                                                                                                                      "question": "Match the historical concept with its description:",
                                                                                                                                      "pairs": [
                                                                                                                                        {
                                                                                                                                          "term": "Machiavellianism",
                                                                                                                                          "definition": "A philosophy that 'the end justifies the means' (deception is fine)."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "term": "Propaganda",
                                                                                                                                          "definition": "Using mass media to manipulate public opinion (e.g., in wartime)."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "term": "Gaslighting (Origin)",
                                                                                                                                          "definition": "From a 1938 play/film where a husband dims lights to make his wife think she's insane."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "term": "The 'Dark Triad'",
                                                                                                                                          "definition": "A modern term for 3 traits: Narcissism, Machiavellianism, Psychopathy."
                                                                                                                                        }
                                                                                                                                      ]
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "These are the three personality traits most associated with manipulative and exploitative behavior in modern psychology.",
                                                                                                                                      "type": "fill-in-blank",
                                                                                                                                      "sentence": "The 'Dark Triad' consists of ___, Machiavellianism, and ___.",
                                                                                                                                      "correctAnswer": "Narcissism",
                                                                                                                                      "wrongOptions": [
                                                                                                                                        "Kindness",
                                                                                                                                        "Empathy",
                                                                                                                                        "Neuroticism"
                                                                                                                                      ]
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the 'grey area.' The *intent* is not to exploit, and the *context* is transparent (you both know you're 'selling' yourself). This is persuasion, not 'dark' manipulation.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "You are in a job interview. You *know* the interviewer values 'teamwork' above all. Is it 'unethical' to mirror their body language and constantly mention 'teamwork' (a form of Pacing)?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Yes. It's manipulation, you are faking it."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "No. An interview is a transparent 'persuasion' game. This is just social skill."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "It's only okay if you *also* flatter them."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "It's 'dark' but necessary to get a job."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "Yes. Alex had a goal ($20) and used deception (flattery, vulnerability) to get it. 'The end justifies the means.' This is pure Machiavellianism in action.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "The historical figure Machiavelli would have *agreed* with the 'Coffee Shop' con-artist 'Alex'.",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is 'Dark Psychology' at a mass scale. 'Propaganda' is just manipulation for nations. It uses fear and 'us vs. them' to control behavior.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "During WWI, posters showed 'enemy' soldiers as 'monsters' or 'brutes' to build fear and hatred. This encouraged men to enlist and the public to support the war. This is a large-scale example of what?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Emotional manipulation (using fear) and deception (dehumanizing the enemy)."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "A logical argument for war."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "A form of flattery (praising your own country)."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "A simple recruitment drive."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the origin. The goal was to make her *doubt her own senses* and reality, making her completely dependent on him. That is the core of 'gaslighting'.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "The term 'Gaslighting' comes from a 1938 play. What did the manipulator do in the story?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "He used a gaslight to find lost keys."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "He was a gas station attendant who lied."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "He dimmed the gas lights in the house, then told his wife she was 'imagining it'."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "He lit a fire to threaten his wife."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "C"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the 'Manipulator's Creed.' If the goal is 'good' (to them), any method (lying, cheating, harming) is okay. This is a *major* ethical blind spot.",
                                                                                                                                      "type": "sentence-building",
                                                                                                                                      "question": "Arrange these words into Machiavelli's core philosophy:",
                                                                                                                                      "words": [
                                                                                                                                        "means",
                                                                                                                                        "the",
                                                                                                                                        "justifies",
                                                                                                                                        "The",
                                                                                                                                        "end"
                                                                                                                                      ],
                                                                                                                                      "correctSentence": "The end justifies the means"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "We will spend a *lot* of time on Narcissism, as it's one of the most common sources of manipulation in personal relationships.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "A personality trait marked by a high sense of self-importance, a need for admiration, and a lack of empathy. This is the definition of what 'Dark Triad' trait?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Machiavellianism"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Psychopathy"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Narcissism"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Kindness"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "C"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is 'passive' manipulation. You aren't *doing* harm, but you are *allowing* harm (or failure) to happen for your own gain. This is a 'grey area' that leans 'dark'.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Your friend is applying for the same job as you. You *know* the interviewer hates long answers. You *don't* tell your friend this 'secret'. Is this 'dark' manipulation?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Yes. You are manipulating the outcome by withholding information."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "No. It's a competition. You have no 'ethical duty' to help your friend in this case."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Yes, and you should tell your friend *bad* advice to make it worse."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "No, because you are both friends."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is a major myth. These tactics are used every day in advertising, in office politics, and in family dynamics. The 'Coffee Shop' is proof.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Historically, 'Dark Psychology' tactics have only been used by evil dictators.",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "Exactly. History (like propaganda) shows the devastating *consequences* of manipulation. This is why the 'Ethical Compass' is so important.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Why are we studying 'Ethics' and 'History' together in this part?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Because they are both boring."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Because history is full of ethical dilemmas."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Because history shows *why* we need ethics; it shows the *damage* these tactics cause."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Because they are the same thing."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "C"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "You've learned the 'What,' the 'Why,' and the 'Who.' Get ready to put it all together in the Part 3 challenge.",
                                                                                                                                      "type": "fill-in-blank",
                                                                                                                                      "sentence": "In Part 3, you will face the '___-Test' which will combine all 3 topics: ___, Ethics, and ___.",
                                                                                                                                      "correctAnswer": "Mega",
                                                                                                                                      "wrongOptions": [
                                                                                                                                        "Final",
                                                                                                                                        "Easy",
                                                                                                                                        "Flattery"
                                                                                                                                      ]
                                                                                                                                    }
                                                                                                                                  ]
                                                                                                                                },
                                                                                                                                {
                                                                                                                                  "partNumber": 3,
                                                                                                                                  "partTitle": "The 'Mega-Test' (A long challenge on all 3 topics)",
                                                                                                                                  "questions": [
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the 'Big 3'. Persuasion (transparent), Manipulation (hidden), Coercion (force). Understanding this is your first layer of defense.",
                                                                                                                                      "type": "matching",
                                                                                                                                      "question": "Match the core term to its definition:",
                                                                                                                                      "pairs": [
                                                                                                                                        {
                                                                                                                                          "term": "Machiavellianism",
                                                                                                                                          "definition": "Niccolò Machiavelli"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "term": "Gaslighting",
                                                                                                                                          "definition": "Modern Psychology (2002)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "term": "Dark Triad",
                                                                                                                                          "definition": "A 1938 play/film"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "term": "Propaganda",
                                                                                                                                          "definition": "Wartime Media / Edward Bernays"
                                                                                                                                        }
                                                                                                                                      ]
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is historical 'Propaganda' in modern form. It uses 'us vs. them' and *fear* (Implied Coercion) to manipulate your vote, not logic.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "political ad shows a grainy, black-and-white photo of an opponent ('Monster') while playing scary music. It then shows their own candidate in full color, smiling, with a flag ('Hero').\n\nThis ad combines 'Propaganda' with what other concept?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Implied Coercion (fear-mongering)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Flattery (of the viewer's intelligence)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Reciprocity (giving a gift)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "The Silent Treatment"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the 'light' path. Don't play the 'dark' game. The best defense is to counter *hidden* manipulation with *transparent* value. This is your 'Ethical Compass' in action.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "You *know* a co-worker is using 'flattery' and 'mirroring' (Machiavellian tactics) to get a promotion you both want. What is the most 'ethically aware' response?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Use the *same* tactics, but do them better."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Do nothing and hope the boss sees through it."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Focus on your own *work and results*, communicating them clearly and transparently."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Loudly accuse them of being a manipulator in a team meeting."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "C"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "Machiavelli would say Alex was 'right.' The 'end' (getting $20) 'justified the means' (lying, flattery, reciprocity). This is the 'dark' philosophy.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "According to Machiavelli, Alex (the coffee shop con-artist) was 'wrong' because Alex lied.",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is a key definition from Part 2. These three traits together form the 'Dark Triad'.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "What *three* concepts (the 'Dark Triad') are the cornerstones of manipulative personalities?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Kindness, Empathy, Honesty"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Narcissism, Machiavellianism, Psychopathy"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Persuasion, Coercion, Flattery"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Gaslighting, Love Bombing, Guilt"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is an advanced scenario. The 'help' is a narcissistic act of control. The 'debt' is the 'Reciprocity Trap.' This is a 2-part tactic.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Your friend 'Sam' always gives you 'help' you didn't ask for (like 'fixing' your resume or 're-organizing' your kitchen). Later, Sam always says, 'Well, after all I've done for you, you *owe* me...' when they want a big favor. Sam is combining a 'Reciprocity Trap' (Manipulation) with what other 'Dark Triad' trait?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Narcissism (needing to feel superior and 'in control' of your life)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Empathy (genuinely wanting to help)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Honesty (being direct about your flaws)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Psychopathy (a lack of emotion)"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "These are the 'Big 3' definitions from Part 1. You must know these by heart.",
                                                                                                                                      "type": "fill-in-blank",
                                                                                                                                      "sentence": "___ is hidden (deceit). ___ is forced (threats). ___ is transparent (logic/emotion).",
                                                                                                                                      "correctAnswer": "Manipulation",
                                                                                                                                      "wrongOptions": [
                                                                                                                                        "Flattery",
                                                                                                                                        "History"
                                                                                                                                      ]
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the core 'Ethical' rule from Part 2. We are building shields, not swords.",
                                                                                                                                      "type": "sentence-building",
                                                                                                                                      "question": "Arrange these words into the 'Prime Directive' of this app:",
                                                                                                                                      "words": [
                                                                                                                                        "to",
                                                                                                                                        "not",
                                                                                                                                        "harm",
                                                                                                                                        "awareness",
                                                                                                                                        "Use",
                                                                                                                                        "for",
                                                                                                                                        "defense,"
                                                                                                                                      ],
                                                                                                                                      "correctSentence": "Use awareness for defense, not to harm"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the definition of Manipulation. The key words are 'hidden' and 'deceive'.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "This person uses *hidden* tactics (like guilt-trips, flattery, or gaslighting) to *deceive* you into doing what they want. What is this person's primary method?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Manipulation"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Coercion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Persuasion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Radical Honesty"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the definition of Coercion. The key word is 'force' or 'threat'.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "This person uses *threats* (like 'You'll be fired' or 'You'll be sorry') to *force* you into doing what they want. What is this person's primary method?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Manipulation"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Coercion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Persuasion"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Flattery"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "They are *deeply* related. Propaganda is often 'Gaslighting' on a mass scale (e.g., 'The war is not happening, you are just imagining it.' 'That photo is fake.').",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "The historical term 'Propaganda' and the modern term 'Gaslighting' are completely unrelated.",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is a 2-hit combo: (1) Gaslighting (using 'never' or 'always' to make you doubt reality) and (2) a Guilt-Trip (making you feel 'in debt' for past 'sacrifices').",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Your partner is upset. 'You *never* listen to me!' (You know this isn't true). 'After all the sacrifices I've made for you, you *always* abandon me!'\n\nThis is a 'Boss Scenario' combining 'Gaslighting' ('You never...') with what?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "A Guilt-Trip ('After all I've made...')"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Flattery ('You're so smart')"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Reciprocity (a free gift)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "A genuine complaint"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the ultimate ethical test. The 'Prime Directive' is 'Do No Harm.' Using a 'white lie' (manipulation) to *prevent* harm (the scam) is a high-level, ethically-aware choice.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "A con-artist (like 'Alex') is using 'flattery' and 'vulnerability' to try and scam your elderly neighbor. Is it 'ethical' to use 'manipulation' (like a 'light' lie, e.g., 'Oh, Alex, your boss is on the phone for you!') to stop them?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "No. Manipulation is *always* unethical. You must tell the truth."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Yes. This is an 'ethically grey' area where a 'dark' tactic (a lie) is used for a 'light' purpose (protection)."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "No. You should just call the police."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Yes. You should use a 'dark' tactic to steal Alex's wallet."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "They are different. A Narcissist *needs* admiration and flattery (it's about their ego). A Machiavellian *doesn't* need admiration; they only want *power* and will use any tool (even faking weakness) to get it.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "A 'Narcissist' and a 'Machiavellian' are the same thing.",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "True"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "False"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "Alex's actions weren't about *ego*; they were about *profit*. The flattery, the vulnerability—it was all a *script*. This is pure 'the end justifies the means.' This is Machiavellianism.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "Which 'Dark Triad' trait *best* describes Alex from the Coffee Shop?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Narcissism (needed to be flattered and admired)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Machiavellianism (used a cold, calculated 'script' to get a goal: $20)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Psychopathy (showed a total lack of fear or remorse)"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Empathy (was genuinely lonely)"
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "B"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is the final test of 'Intent' (from Part 1) and 'Ethics' (from Part 2). 'Dark' implies a *hidden, exploitative* intent. An interview is a *transparent, persuasive* context.",
                                                                                                                                      "type": "multiple-choice",
                                                                                                                                      "question": "In Part 2, we said 'mirroring' in a job interview is an 'ethically grey' area. What is the *primary* factor that keeps it from being 'Dark'? Why is it not 'Dark' manipulation?",
                                                                                                                                      "options": [
                                                                                                                                        {
                                                                                                                                          "id": "A",
                                                                                                                                          "text": "Because the 'intent' is transparent (to get a job), not 'hidden' (to exploit)."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "B",
                                                                                                                                          "text": "Because it never works."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "C",
                                                                                                                                          "text": "Because everyone does it, so it's 'normal'."
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                          "id": "D",
                                                                                                                                          "text": "Because the interviewer is also a manipulator."
                                                                                                                                        }
                                                                                                                                      ],
                                                                                                                                      "correctAnswer": "A"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "This is a core 'Bootcamp' concept. The defense against 'Gaslighting' (from Part 2 history) is to trust your own senses.",
                                                                                                                                      "type": "sentence-building",
                                                                                                                                      "question": "Arrange these words into the *defense* for the 'Gaslighting' origin story:",
                                                                                                                                      "words": [
                                                                                                                                        "your",
                                                                                                                                        "trust",
                                                                                                                                        "lights'",
                                                                                                                                        "'the",
                                                                                                                                        "are",
                                                                                                                                        "own",
                                                                                                                                        "when",
                                                                                                                                        "dim",
                                                                                                                                        "perception"
                                                                                                                                      ],
                                                                                                                                      "correctSentence": "Trust your own perception when 'the lights' are dim"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                      "explanation": "You've mastered the 'What,' 'Why,' and 'Who' of Dark Psychology.",
                                                                                                                                      "type": "fill-in-blank",
                                                                                                                                      "sentence": "You have completed the 'Bootcamp' on Definitions, ___, and ___.",
                                                                                                                                      "correctAnswer": "History",
                                                                                                                                      "wrongOptions": [
                                                                                                                                        "Sales",
                                                                                                                                        "Flattery"
                                                                                                                                      ]
                                                                                                                                    }
                                                                                                                                  ]
                                                                                                                                }
                                                                                                                              ],
                                                                                                                              "totalParts": 3
                                                                                                                            },
  // Lesson 4: The Second Hook
  {
                                                      "number": 4,
                                                      "title": "The Second Hook",
                                                      "section": "A",
                                                      "sectionId": "A",
                                                      "sectionTitle": "The Foundations of the Dark Mind",
                                                      "unitId": "A1",
                                                      "unitTitle": "The Fast Hook",
                                                      "lessonId": "A1-4",
                                                      "lessonTitle": "The Second Hook",
                                                      "lessonType": "Normal",
                                                      "lessonPart": 1,
                                                      "lessonPartTitle": "A New Scenario (The Guilt Trip)",
                                                      "objective": "To test the user's ability to detect emotional manipulation (guilt-tripping) in a high-stakes personal scenario.",
                                                      "gamification": {
                                                        "progressRings": [
                                                          {
                                                            "ringId": "learn",
                                                            "status": "pending",
                                                            "label": "Part 1"
                                                          },
                                                          {
                                                            "ringId": "practice",
                                                            "status": "pending",
                                                            "label": "Part 2"
                                                          },
                                                          {
                                                            "ringId": "challenge",
                                                            "status": "pending",
                                                            "label": "Part 3"
                                                          }
                                                        ],
                                                        "pointsValue": 100,
                                                        "starsAvailable": 3,
                                                        "badgeOnCompletion": null
                                                      },
                                                      "parts": [
                                                        {
                                                          "partNumber": 1,
                                                          "partTitle": "A New Scenario (The Guilt Trip)",
                                                          "questions": [
                                                            {
                                                              "explanation": "This is a passive-aggressive 'hook.' They *want* you to say, 'No, no, I'm not busy! What's wrong?' This puts them in control.",
                                                              "type": "multiple-choice",
                                                              "question": "Casey: 'Hey... you're not *busy*, are you? It sounds like you're busy, I'll just go...'\n\nThis opening is a 'primer' designed to make you...",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Feel guilty and defensive immediately."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Hang up the phone."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Feel happy and excited."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Ask them for a favor."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "By dismissing the movie as 'less important' (without saying why), Casey is *implying* you are a bad friend for prioritizing it. This is Tactic #1: The Guilt-Trip.",
                                                              "type": "multiple-choice",
                                                              "question": "You: 'No, I can talk! I'm just getting ready for our movie. What's up?' Casey: (Sighs) 'The... the *movie*. Oh. I see. I guess that's more important.'\n\nWhat is the *tactic* Casey is using here?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "A Guilt-Trip (diminishing your plans)."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Forgetting about the movie."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Honest communication."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Flattery."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "This is Tactic #2. Just like 'Alex' in the coffee shop, Casey is using a 'vulnerable' state (a sad sigh) to pull you in and make you feel responsible.",
                                                              "type": "multiple-choice",
                                                              "question": "This is an example of 'Weaponized Vulnerability.' Casey is using a 'sad' tone to make you feel responsible for their emotions.",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "The 'ask' is hidden inside a guilt-trip. The manipulator makes *you* feel like you have to *offer* to cancel your plans.",
                                                              "type": "multiple-choice",
                                                              "question": "You: 'What's wrong, Casey?' Casey: 'Oh, nothing... it's just... my car is making a weird noise and I just... I *really* need you to drive me to the auto shop *right now*. But, you know, the *movie*...'\n\nWhat is the *real* 'ask' here?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "For you to skip your plans and solve their problem."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "For advice on car mechanics."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "To know what time the movie starts."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "For you to pay for their car."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "The goal is to make you feel like a 'bad person' for having your own needs, forcing you to comply to prove you're a 'good person'.",
                                                              "type": "fill-in-blank",
                                                              "sentence": "A 'guilt-trip' works by making you feel ___ and ___ for not doing what the manipulator wants.",
                                                              "answers": [
                                                                "selfish",
                                                                "reciprocity"
                                                              ],
                                                              "correctAnswer": "selfish",
                                                              "wrongOptions": [
                                                                "happy",
                                                                "proud",
                                                                "angry"
                                                              ]
                                                            },
                                                            {
                                                              "explanation": "This is a 'Reciprocity Trap' turned into a guilt-trip. Casey is implying that your friendship is 'transactional' and that you 'owe' them. This is Tactic #3.",
                                                              "type": "multiple-choice",
                                                              "question": "You: 'The shop is on the other side of town! That'll take hours. We'll miss the movie for sure.' Casey: (Coldly) 'Wow. Okay. I see how it is. After all those times I helped you move? Unbelievable.'\n\nThis is a very powerful tactic. What is it?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "A 'Historical' Guilt-Trip (using past favors as a weapon)."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "A simple misunderstanding."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "A 'Gaslighting' attempt."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "A compliment."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "A manipulator knows you *want* to be a 'good friend.' They use that desire against you to control your behavior.",
                                                              "type": "sentence-building",
                                                              "question": "Arrange these words into a core 'guilt' concept:",
                                                              "words": [
                                                                "your",
                                                                "own",
                                                                "Guilt-trips",
                                                                "against",
                                                                "turn",
                                                                "morals",
                                                                "you"
                                                              ],
                                                              "correctSentence": "Guilt-trips turn your own morals against you"
                                                            },
                                                            {
                                                              "explanation": "Emotional manipulation is *most* effective when it comes from people you love and trust, because you *care* what they think of you.",
                                                              "type": "multiple-choice",
                                                              "question": "This scenario is 'darker' than the 'Coffee Shop' because the manipulation is coming from a trusted friend, not a stranger.",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "These phrases aren't requests; they are *challenges* to your character. They force you to 'prove' your love or loyalty by complying.",
                                                              "type": "multiple-choice",
                                                              "question": "These are classic opening lines for what tactic?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Flattery"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "A Guilt-Trip"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "A Direct Request"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Gaslighting"
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "This is Tactic #4: Gaslighting. Casey is denying your reality. You *are* being guilt-tripped, but Casey is telling you you're 'overreacting' to make you doubt your own feelings.",
                                                              "type": "multiple-choice",
                                                              "question": "You: 'Casey, that's not fair! You're making me feel terrible!' Casey: 'What? I'm not doing *anything*! I'm just *sad*. You're the one who's overreacting and being defensive!'\n\nThis is a 2-hit combo. A Guilt-Trip ('I'm just sad') combined with...?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Gaslighting ('You're overreacting')."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Flattery ('You're so smart')."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Honesty."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "A direct threat (Coercion)."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "The manipulator wants you to abandon your *own* needs to serve *theirs*. Giving in rewards their bad behavior and proves the tactics worked.",
                                                              "type": "multiple-choice",
                                                              "question": "What is the *most* manipulated response (the one Casey wants)?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "'(Sigh) Fine. I'll skip the movie. I'm on my way.'"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "'Casey, I can't help you *now*, but I can help you *tomorrow*.'"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "'You're trying to guilt-trip me, and it's not fair.'"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "'I'm going to the movie. I'll talk to you later.'"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "This is a 'checkmate' move. Casey is playing the 'martyr' ('I'll just walk...'). The goal is to make *you* feel so overwhelmingly guilty that *you* call *them* back, apologizing.",
                                                              "type": "multiple-choice",
                                                              "question": "[Boss Challenge]\nYou try to set a boundary: 'Casey, I can't drive you right now.' Casey: 'Fine! Go. Have fun. I'll just... I'll just walk to the auto shop, I guess. It's only 5 miles. At night. It's... *fine*.' (Hangs up)\n\nThis 'Boss Scenario' is a combination of a Guilt-Trip and...?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "The 'Martyr Complex' / Passive-Aggression"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Flattery"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "A genuine 'okay' response."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Radical Honesty"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "Flattery 'pulls' you in by making you feel good. Guilt 'pushes' you by making you feel bad. Both are forms of manipulation.",
                                                              "type": "fill-in-blank",
                                                              "sentence": "Unlike 'Alex' (Flattery), 'Casey' used ___ as their primary weapon.",
                                                              "correctAnswer": "guilt",
                                                              "wrongOptions": [
                                                                "money",
                                                                "threats",
                                                                "kindness"
                                                              ]
                                                            },
                                                            {
                                                              "feedback": {
                                                                "correct": "Correct. The oil is just the *excuse*. The real conflict is a **power struggle** over your boundaries. Casey is testing if their 'needs' can override your 'plans'.",
                                                                "incorrect": "Incorrect. The car is just the surface issue. If you focus on the oil, you miss the manipulation. The real conflict is about control."
                                                              },
                                                              "type": "multiple-choice",
                                                              "scene": "Casey tried to guilt-trip you into cancelling your movie plans to help fix a minor car issue.",
                                                              "question": "The *real* conflict in this scenario is about car oil.",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "You've felt the hook. Now it's time for the debrief. In Part 2, we will break down *why* guilt is such an effective weapon.",
                                                              "type": "multiple-choice",
                                                              "question": "You've been 'hooked' again. What is the next logical step?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Part 2: The Debrief - How Guilt is Weaponized"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "A lesson on car mechanics."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Lesson A2-1: Narcissism"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Never speak to Casey again."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            }
                                                          ]
                                                        },
                                                        {
                                                          "partNumber": 3,
                                                          "partTitle": "The Promise - Learn This Tactic",
                                                          "questions": [
                                                            {
                                                              "explanation": "This is the 'shield.' A boundary is the defense against a guilt-trip. We will learn how to build them.",
                                                              "type": "multiple-choice",
                                                              "question": "What is the *primary* defense against a guilt-trip?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Guilt-tripping them back even harder."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Setting a clear, firm, but polite boundary."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Giving in immediately to avoid conflict."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Never speaking to your friends again."
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "False. The promise is to teach you the difference between *caring* for someone (Empathy) and being *responsible* for them (a trap).",
                                                              "type": "multiple-choice",
                                                              "question": "The core 'promise' of this app is to teach you how to stop caring about other people's feelings.",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*.",
                                                              "type": "sentence-building",
                                                              "question": "Arrange these words into the core 'guilt' defense:",
                                                              "words": [
                                                                "for",
                                                                "responsible",
                                                                "not",
                                                                "are",
                                                                "You",
                                                                "emotions",
                                                                "others'"
                                                              ],
                                                              "correctSentence": "You are not responsible for others' emotions"
                                                            },
                                                            {
                                                              "explanation": "The 'promise' is to teach you to spot the 'covert' (hidden) request inside the emotion and demand 'direct' communication.",
                                                              "type": "fill-in-blank",
                                                              "sentence": "A 'light' request is ___. A 'dark' request is ___ (hidden in an emotion).",
                                                              "correctAnswer": "direct",
                                                              "wrongOptions": [
                                                                "loud",
                                                                "always",
                                                                "mean"
                                                              ]
                                                            },
                                                            {
                                                              "explanation": "A boundary is a healthy, defensive tool. It is the *antidote* to manipulation. We will cover this in detail.",
                                                              "type": "multiple-choice",
                                                              "question": "In this app, what is a 'Boundary'?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "A wall you build to keep everyone out."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "A rude way of saying 'no'."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "A clear line you set that defines what you *will* and *won't* accept."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "A form of manipulation."
                                                                }
                                                              ],
                                                              "correctAnswer": "C"
                                                            },
                                                            {
                                                              "explanation": "This is an advanced defense. It (1) Names the Tactic ('That's not fair'), (2) Rejects the false choice, and (3) Asks for direct communication. This is a *perfect* response.",
                                                              "type": "multiple-choice",
                                                              "question": "Let's replay the 'Casey' scenario. Casey says, 'I guess the *movie* is more important to you.'\n\nWhat is a *strong, boundary-setting* response?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "'You're right, it is. Bye.' (Aggressive)"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "'Oh no, it's not! I'll come over!' (Manipulated)"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "'Wow, you're trying to guilt-trip me!' (Accusatory)"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "'That's not fair. I *can* be your friend *and* want to see the movie. What's *really* going on?'"
                                                                }
                                                              ],
                                                              "correctAnswer": "D"
                                                            },
                                                            {
                                                              "explanation": "This is a 'Drama Triangle' (Victim, Persecutor, Rescuer). By playing the 'Victim' ('I'll walk'), Casey *forces* you into the 'Rescuer' role. The promise is to teach you to *reject* this role.",
                                                              "type": "multiple-choice",
                                                              "question": "The 'Martyr Complex' ('I'll just walk...') is designed to make you feel like a 'Rescuer'.",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "You've passed two 'Boss Scenarios' (Alex and Casey). They combine tactics (Flattery + Guilt + Gaslighting) to test your skills.",
                                                              "type": "multiple-choice",
                                                              "question": "What does this term mean in this app?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "A simulation of talking to your boss."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "A test that is impossibly difficult."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "A complex scenario that *combines multiple tactics* at once."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "A simple, easy-to-pass quiz."
                                                                }
                                                              ],
                                                              "correctAnswer": "C"
                                                            },
                                                            {
                                                              "explanation": "This is the 'light' path. This knowledge isn't for *punishing* people; it's for *protecting* you. The promise is to build your defense (boundaries).",
                                                              "type": "multiple-choice",
                                                              "question": "What is the 'ethically-aware' promise to yourself?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "To use their tactics back on them to 'win'."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "To cut them out of your life immediately without a word."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "To start setting small, firm boundaries and see if the friendship can be saved."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "To do nothing, because you are a good friend."
                                                                }
                                                              ],
                                                              "correctAnswer": "C"
                                                            },
                                                            {
                                                              "explanation": "This is the promise. You will learn to stop 'feeling guilty' and start 'setting boundaries'.",
                                                              "type": "sentence-building",
                                                              "question": "Arrange these words into the *defense* for the 'Casey' scenario:",
                                                              "words": [
                                                                "a",
                                                                "boundary,",
                                                                "Set",
                                                                "guilt",
                                                                "not",
                                                                "a"
                                                              ],
                                                              "correctSentence": "Set a boundary, not a guilt"
                                                            },
                                                            {
                                                              "explanation": "These are the two biggest 'softener' tactics. You've now seen them both in action.",
                                                              "type": "fill-in-blank",
                                                              "sentence": "You have now been 'hooked' with ___ (Alex) and ___ (Casey).",
                                                              "correctAnswer": "flattery",
                                                              "wrongOptions": [
                                                                "money",
                                                                "threats"
                                                              ]
                                                            },
                                                            {
                                                              "explanation": "Correct. The final lesson of the Unit will be a 'Review Challenge' that combines *everything* you've learned from all 4 previous lessons into a final 'Gauntlet'.",
                                                              "type": "multiple-choice",
                                                              "question": "The next lesson, A1-5, is the 'Unit 1 Review.' What will it *most likely* test you on?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "A final, complex 'Boss Scenario' combining *all* the tactics you've seen (Flattery, Rapport, Guilt, Gaslighting)."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "A 50-question test on Machiavellian history."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "A friendly conversation with no manipulation."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Only the 'Casey' scenario again."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "False. You are promising to become a *wiser* person. This allows you to trust *safely*. You will trust 'light' (direct) communication, and defend against 'dark' (covert) manipulation.",
                                                              "type": "multiple-choice",
                                                              "question": "By promising to learn these defenses, I am promising to become a colder, less-trusting person.",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "This is the core of a 'boundary.' A manipulator (like Casey) tries to 'negotiate' your peace and your plans. The promise is to stop negotiating.",
                                                              "type": "sentence-building",
                                                              "question": "Arrange these words into the 'Final Promise' of this lesson:",
                                                              "words": [
                                                                "My",
                                                                "is",
                                                                "not",
                                                                "negotiable",
                                                                "peace"
                                                              ],
                                                              "correctSentence": "My peace is not negotiable"
                                                            },
                                                            {
                                                              "explanation": "Congratulations. You've passed the 'hook' phase. It's time to put all your new knowledge to the test in the final Unit 1 Review.",
                                                              "type": "multiple-choice",
                                                              "question": "You are now ready for the final lesson of this unit:",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Lesson A1-5: Unit 1 Review"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Lesson A2-1: Narcissism"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "A lesson on friendship"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "This lesson is over"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            }
                                                          ]
                                                        },
                                                        {
                                                          "partNumber": 2,
                                                          "partTitle": "The Debrief - How Guilt is Weaponized",
                                                          "questions": [
                                                            {
                                                              "explanation": "This is the key. A guilt-trip *transfers* responsibility. 'I am sad, and it is *your fault* (or *your job*) to fix it.'",
                                                              "type": "multiple-choice",
                                                              "question": "What is the *definition* of a 'Guilt-Trip'?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "A genuine expression of sadness."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "A manipulation tactic that makes you feel responsible for the manipulator's emotions or happiness."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "A form of flattery."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "A direct and honest request for help."
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "Casey's script was a 4-part combo. Seeing them as separate tactics is how you learn to defend against them.",
                                                              "type": "matching",
                                                              "question": "Match the tactic Casey used in Part 1 to its description:",
                                                              "pairs": [
                                                                {
                                                                  "term": "Guilt-Trip",
                                                                  "definition": "'I guess the *movie* is more important.'"
                                                                },
                                                                {
                                                                  "term": "Historical Guilt",
                                                                  "definition": "'After all those times I helped you move?!'"
                                                                },
                                                                {
                                                                  "term": "Gaslighting",
                                                                  "definition": "'What? I'm not doing *anything*! You're just overreacting!'"
                                                                },
                                                                {
                                                                  "term": "Martyr Complex",
                                                                  "definition": "'Fine. I'll just... I'll just walk. At night...'"
                                                                }
                                                              ]
                                                            },
                                                            {
                                                              "explanation": "This is a core concept. This tactic turns a *relationship* into a *ledger* ('You owe me'). It's a 'dark' form of the 'Reciprocity' principle.",
                                                              "type": "multiple-choice",
                                                              "question": "When Casey used 'Historical Guilt' ('after I helped you move'), they were turning a past 'friendship' act into a 'transactional' weapon.",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "This is the 'dark' side of empathy. A manipulator weaponizes your *own* goodness. You don't care if 'Alex' thinks you're a bad friend, but you *do* care what 'Casey' thinks.",
                                                              "type": "multiple-choice",
                                                              "question": "Why is a guilt-trip from a friend (like Casey) *more* effective than a guilt-trip from a stranger (like Alex)?\n\nWhy is it more effective?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Because strangers are usually nicer."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Because you genuinely *care* about your friend's feelings and your 'status' as a 'good friend'."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Because friends give better gifts."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "It isn't. Strangers are more effective."
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "The 'Martyr' is the ultimate guilt-trip. They are 'sacrificing' themselves *at you*. They *want* you to stop them, putting 100% of the responsibility on you.",
                                                              "type": "fill-in-blank",
                                                              "sentence": "The 'Martyr Complex' ('I'll just walk...') is a form of passive-aggression designed to make you feel ___ and ___.",
                                                              "correctAnswer": "overwhelmingly guilty",
                                                              "wrongOptions": [
                                                                "happy",
                                                                "proud",
                                                                "angry"
                                                              ]
                                                            },
                                                            {
                                                              "explanation": "This is why this combo is so 'dark.' Tactic 1: They guilt-trip you. Tactic 2: When you call them on it, they 'Gaslight' you. This 1-2 punch is designed to confuse you.",
                                                              "type": "multiple-choice",
                                                              "question": "When Casey said this, they were using 'Gaslighting' to...",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Make you doubt your own (correct) perception that you were being guilt-tripped."
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Calm you down and have a real conversation."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Admit that they were wrong."
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Flatter you into agreeing with them."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "This is the 'shield.' You are responsible for your *actions* (how you treat people), but not for their *feelings* (their reaction to your boundaries).",
                                                              "type": "sentence-building",
                                                              "question": "Arrange these words into the core 'guilt' defense:",
                                                              "words": [
                                                                "for",
                                                                "responsible",
                                                                "not",
                                                                "are",
                                                                "You",
                                                                "emotions",
                                                                "others'"
                                                              ],
                                                              "correctSentence": "You are not responsible for others' emotions"
                                                            },
                                                            {
                                                              "explanation": "This is 'light' communication. It's *direct*, *honest*, and *respects your choice*. A guilt-trip ('I guess the movie is more important...') *removes* your choice.",
                                                              "type": "multiple-choice",
                                                              "question": "A 'direct, honest' request would be: 'Hey, I'm in a jam with my car. I know we have the movie, but would you be *willing* to help me instead?'",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "This is the 'emotional coercion.' The manipulator puts your *moral character* on trial. You comply to prove to them (and yourself) that you are 'good'.",
                                                              "type": "multiple-choice",
                                                              "question": "What is the *unspoken threat* inside every guilt-trip?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "'If you don't do this, you are a *bad person*.'"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "'If you don't do this, I will physically harm you.'"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "'If you don't do this, I will give you $20.'"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "There is no threat."
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "The 'Silent Treatment' is just another manipulation (a 'passive' coercion). The *only* winning move is to not play. You set your boundary. The game is over.",
                                                              "type": "multiple-choice",
                                                              "question": "What is the 'ethically-aware' (and strongest) response?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Panic, apologize, and offer to do whatever they want. (You lost)"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Let them be silent. You set a fair boundary and are not responsible for their reaction."
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Fight back. Text them, 'Wow, so now you're using the Silent Treatment on me?'"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Guilt-trip *them* back. 'Fine, I guess our friendship is over.'"
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "Correct. The 'Review' will test *all* the 'hook' tactics you've learned so far: Flattery, Rapport, Reciprocity, and Guilt.",
                                                              "type": "multiple-choice",
                                                              "question": "In the next lesson (A1-5), you will do the 'Unit 1 Review.' What do you expect to be tested on?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "The 'Coffee Shop' (Flattery) AND the 'Guilt-Trip' (Emotion)"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Only the 'Coffee Shop'"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Only the 'Guilt-Trip'"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Advanced Machiavellianism"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "This is a key difference. Flattery makes you feel *good*. Guilt makes you feel *bad*. Both are used to control you.",
                                                              "type": "fill-in-blank",
                                                              "sentence": "Flattery attacks your ___. A Guilt-Trip attacks your ___.",
                                                              "correctAnswer": "ego",
                                                              "wrongOptions": [
                                                                "wallet",
                                                                "job"
                                                              ]
                                                            },
                                                            {
                                                              "explanation": "The 'sigh' is a non-verbal, 'passive-aggressive' way of saying, 'You are disappointing me. You are a bad person for this.' It's a guilt-trip without words.",
                                                              "type": "multiple-choice",
                                                              "question": "This is a 'non-verbal' form of what tactic?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "A Guilt-Trip / Martyr Complex"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Flattery"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Gaslighting"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "Honest sadness"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            },
                                                            {
                                                              "explanation": "The car was the *excuse*. The real problem was *how* Casey communicated: by using a 'dark' script of manipulation instead of 'light,' direct honesty.",
                                                              "type": "multiple-choice",
                                                              "question": "The *real* problem in the 'Casey' scenario was the car.",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "True"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "False"
                                                                }
                                                              ],
                                                              "correctAnswer": "B"
                                                            },
                                                            {
                                                              "explanation": "Correct. You've been hooked and debriefed. The final part is the 'promise' of how you'll learn to defend against this.",
                                                              "type": "multiple-choice",
                                                              "question": "You are ready for the final part of this lesson. What is the next logical step?",
                                                              "options": [
                                                                {
                                                                  "id": "A",
                                                                  "text": "Part 3: The Promise - Learn This Tactic"
                                                                },
                                                                {
                                                                  "id": "B",
                                                                  "text": "Lesson A1-5: The Unit Review"
                                                                },
                                                                {
                                                                  "id": "C",
                                                                  "text": "Lesson A1-3: The Bootcamp"
                                                                },
                                                                {
                                                                  "id": "D",
                                                                  "text": "A lesson on car repair"
                                                                }
                                                              ],
                                                              "correctAnswer": "A"
                                                            }
                                                          ]
                                                        }
                                                      ],
                                                      "totalParts": 3
                                                    },
  // Lesson 5: Unit 1 Review
  {
      "number": 5,
      "title": "Unit 1 Review",
      "section": "A",
      "sectionId": "A",
      "sectionTitle": "The Foundations of the Dark Mind",
      "unitId": "A1",
      "unitTitle": "The Fast Hook",
      "lessonId": "A1-5",
      "lessonTitle": "Unit 1 Review",
      "lessonType": "Review",
      "lessonPart": 1,
      "lessonPartTitle": "Unit 1 Core Concepts Review",
      "objective": "To comprehensively review all core concepts from Lessons A1-1, A1-2, A1-3, and A1-4, ensuring the user has mastered the definitions and tactics.",
      "gamification": {
        "progressRings": [
          {
            "ringId": "learn",
            "status": "pending",
            "label": "Part 1"
          },
          {
            "ringId": "practice",
            "status": "pending",
            "label": "Part 2"
          },
          {
            "ringId": "challenge",
            "status": "pending",
            "label": "Part 3"
          }
        ],
        "pointsValue": 200,
        "starsAvailable": 3,
        "badgeOnCompletion": null
      },
      "practice": [
        {
          "explanation": "These are the core tactics you've seen in all the 'Hook' scenarios. Naming them is the first step to defense.",
          "type": "matching",
          "question": "Match the core tactic to its definition:",
          "pairs": [
            {
              "term": "Flattery (A1-2)",
              "definition": "Using praise to lower the ego's defenses."
            },
            {
              "term": "Guilt-Trip (A1-4)",
              "definition": "Attacking the conscience to force compliance."
            },
            {
              "term": "Reciprocity (A1-1)",
              "definition": "Giving a small gift to create a sense of 'debt'."
            },
            {
              "term": "Gaslighting (A1-4)",
              "definition": "Making someone doubt their own reality/memory."
            },
            {
              "term": "Mirroring (A1-2)",
              "definition": "Copying body language to build subconscious rapport."
            }
          ]
        },
        {
          "explanation": "This is the most important set of definitions in the app. Manipulation (hidden), Coercion (force), Persuasion (transparent).",
          "type": "fill-in-blank",
          "sentence": "The 'Big 3' (from A1-3): ___ is hidden/deceptive. ___ is forced/threats. ___ is transparent/direct.",
          "correctAnswer": "Manipulation",
          "wrongOptions": [
            "History",
            "Flattery",
            "Guilt"
          ]
        },
        {
          "explanation": "Machiavelli's philosophy is the core of a 'dark' mindset: It's okay to lie, cheat, or harm to get what you want.",
          "type": "multiple-choice",
          "question": "From A1-3, who is the historical 'father' of the philosophy 'The end justifies the means'?",
          "options": [
            {
              "id": "A",
              "text": "Sigmund Freud"
            },
            {
              "id": "B",
              "text": "Niccolò Machiavelli"
            },
            {
              "id": "C",
              "text": "Alex from the Coffee Shop"
            },
            {
              "id": "D",
              "text": "Carl Jung"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "Correct. The 'Martyr' plays the 'victim' to make *you* feel overwhelmingly guilty, forcing you into the 'Rescuer' role.",
          "type": "multiple-choice",
          "question": "From A1-4, the 'Martyr Complex' ('Fine, I'll just walk...') is a form of passive-aggressive guilt-trip.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This 'Implied Flattery' (from A1-2) makes you feel 'superior' and 'helpful,' trapping you into doing their work.",
          "type": "multiple-choice",
          "question": "A co-worker says, 'You're the only one smart enough to fix this. I'm just hopeless.' They are combining Flattery ('smart') with...?\n\nundefined",
          "options": [
            {
              "id": "A",
              "text": "Implied Flattery / Feigned Incompetence"
            },
            {
              "id": "B",
              "text": "A direct threat (Coercion)"
            },
            {
              "id": "C",
              "text": "Gaslighting"
            },
            {
              "id": "D",
              "text": "A genuine compliment"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is a 'dark' form of 'Reciprocity.' It turns a past favor into a *weapon* to make you feel you *owe* them compliance.",
          "type": "multiple-choice",
          "question": "Your friend 'Casey' (from A1-4) says, 'After all those times I helped you move?!' This is called:\n\nundefined",
          "options": [
            {
              "id": "A",
              "text": "A 'Historical' Guilt-Trip"
            },
            {
              "id": "B",
              "text": "Flattery"
            },
            {
              "id": "C",
              "text": "A genuine reminder"
            },
            {
              "id": "D",
              "text": "Gaslighting"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is the 'Ethical Compass' of the entire app. We are building shields, not swords.",
          "type": "sentence-building",
          "question": "Arrange these words into the 'Prime Directive' (from A1-3):",
          "words": [
            "harm",
            "defense,",
            "awareness",
            "to",
            "for",
            "Use",
            "not"
          ],
          "correctSentence": "Use awareness for defense, not to harm"
        },
        {
          "explanation": "Flattery *creates* a 'Halo Effect.' Alex seemed 'nice' (from flattery), so you assumed they were also 'trustworthy' (a mistake).",
          "type": "multiple-choice",
          "question": "What is the 'Halo Effect' (from A1-2)?",
          "options": [
            {
              "id": "A",
              "text": "The belief that you are an angel."
            },
            {
              "id": "B",
              "text": "A cognitive bias where you assume a 'good' trait (like 'nice') means they have *other* 'good' traits (like 'honest')."
            },
            {
              "id": "C",
              "text": "A form of gaslighting."
            },
            {
              "id": "D",
              "text": "A historical propaganda technique."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is the 'Separate and Judge' method from A1-2. 'Thanks, I appreciate that. But no, I can't do your report.'",
          "type": "multiple-choice",
          "question": "This is the primary defense against...?",
          "options": [
            {
              "id": "A",
              "text": "Gaslighting"
            },
            {
              "id": "B",
              "text": "A Guilt-Trip"
            },
            {
              "id": "C",
              "text": "Flattery"
            },
            {
              "id": "D",
              "text": "Coercion"
            }
          ],
          "correctAnswer": "C"
        },
        {
          "explanation": "This is the 'Boundary' defense from A1-4. 'I can't help you, Casey' stops the guilt-trip from working.",
          "type": "multiple-choice",
          "question": "This is the primary defense against...?",
          "options": [
            {
              "id": "A",
              "text": "Flattery"
            },
            {
              "id": "B",
              "text": "A Guilt-Trip"
            },
            {
              "id": "C",
              "text": "Propaganda"
            },
            {
              "id": "D",
              "text": "A direct threat"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "False. The 'Dark Triad' refers to *personalities*: Narcissism, Machiavellianism, and Psychopathy. Flattery/Guilt/Gaslighting are the *tactics* they use.",
          "type": "multiple-choice",
          "question": "The 'Dark Triad' (from A1-3) consists of Flattery, Guilt, and Gaslighting.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is a 'Boss Scenario' (from A1-3). The 'guilt' ('you're not a team player') is combined with an 'implied threat' (Coercion) to your career. This is a common, 'dark' tactic.",
          "type": "multiple-choice",
          "question": "This is 'grey area' manipulation. It's a combination of a Guilt-Trip and...?",
          "options": [
            {
              "id": "A",
              "text": "Implied Coercion"
            },
            {
              "id": "B",
              "text": "Flattery"
            },
            {
              "id": "C",
              "text": "Gaslighting"
            },
            {
              "id": "D",
              "text": "Direct Persuasion"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is a high-level synthesis. Alex's 'end' ($20) 'justified the means' (deception). Alex *chose* deception (flattery) *over* force (a threat). Alex would make Machiavelli proud.",
          "type": "multiple-choice",
          "question": "Which of Machiavelli's philosophies (from A1-3) does this *best* represent?",
          "options": [
            {
              "id": "A",
              "text": "'The end justifies the means.'"
            },
            {
              "id": "B",
              "text": "'It is better to be feared than loved.'"
            },
            {
              "id": "C",
              "text": "'Never attempt to win by force what can be won by deception.'"
            },
            {
              "id": "D",
              "text": "All of the above."
            }
          ],
          "correctAnswer": "D"
        },
        {
          "explanation": "This is a key review from A1-4. Flattery makes you feel *good* (ego). Guilt makes you feel *bad* (conscience). Both are used to control you.",
          "type": "fill-in-blank",
          "sentence": "Flattery attacks the ___. Guilt attacks the ___.",
          "correctAnswer": "ego",
          "wrongOptions": [
            "wallet",
            "job"
          ]
        },
        {
          "explanation": "The 'Coffee Shop' scenario was a *speed-run* of a 'grooming' script. The manipulator 'grooms' you for the 'ask'.",
          "type": "multiple-choice",
          "question": "What is 'Grooming' (from A1-1)?",
          "options": [
            {
              "id": "A",
              "text": "A one-time insult."
            },
            {
              "id": "B",
              "text": "The *entire process* of using 'softeners' (like flattery/rapport) over time to prepare a target for manipulation."
            },
            {
              "id": "C",
              "text": "A form of Guilt-Trip."
            },
            {
              "id": "D",
              "text": "A way to compliment someone."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is a core concept. Manipulation from *inside* your 'trust circle' (friends, family) is far more dangerous and effective than from a stranger.",
          "type": "multiple-choice",
          "question": "The 'Casey' (Guilt-Trip) scenario (A1-4) was 'darker' than the 'Alex' (Flattery) scenario (A1-1) because it came from a trusted friend.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is a history *and* definition review. Gaslighting's goal is to *destroy* your trust in your own mind, making you dependent on the manipulator.",
          "type": "multiple-choice",
          "question": "Why did he do this?",
          "options": [
            {
              "id": "A",
              "text": "To save money on gas."
            },
            {
              "id": "B",
              "text": "To make his wife *doubt her own senses* and believe she was 'crazy'."
            },
            {
              "id": "C",
              "text": "To flatter his wife in the romantic light."
            },
            {
              "id": "D",
              "text": "To coerce his wife with the threat of fire."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*.",
          "type": "sentence-building",
          "question": "Arrange these words into the 'Guilt' defense (from A1-4):",
          "words": [
            "for",
            "responsible",
            "not",
            "are",
            "You",
            "emotions",
            "others'"
          ],
          "correctSentence": "You are not responsible for others' emotions"
        },
        {
          "explanation": "This is the advanced 'testing' defense from A1-2. This is how you *confirm* a tactic without being aggressive.",
          "type": "multiple-choice",
          "question": "From A1-2, what is the *best* defense when you *suspect* (but aren't sure) someone is using flattery and mirroring?",
          "options": [
            {
              "id": "A",
              "text": "Accuse them: 'You're manipulating me!'"
            },
            {
              "id": "B",
              "text": "Give in, just in case they are being nice."
            },
            {
              "id": "C",
              "text": "*Test* them: Change your posture (to test the mirror) and ask for specifics (to test the flattery)."
            },
            {
              "id": "D",
              "text": "Run away."
            }
          ],
          "correctAnswer": "C"
        },
        {
          "explanation": "Correct. You've reviewed the 'what.' Now you'll be tested on the 'how' in high-speed, complex scenarios. Let's begin Part 2.",
          "type": "multiple-choice",
          "question": "You have completed Part 1 of the review. What do you expect in Part 2, 'The Gauntlet'?",
          "options": [
            {
              "id": "A",
              "text": "More, *harder* scenarios combining all these tactics at once."
            },
            {
              "id": "B",
              "text": "A review of this review."
            },
            {
              "id": "C",
              "text": "An easy, 5-question quiz."
            },
            {
              "id": "D",
              "text": "New lessons you haven't seen yet."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is a classic 'praise and punish' script. The Flattery 'pulls you in' (ego), and the Guilt-Trip 'pushes you' (conscience). This is high-level manipulation.",
          "type": "multiple-choice",
          "question": "[Boss Challenge]\nA new manager pulls you aside. 'You're the *only* one here with real vision. You're a star. That's why I'm *so* disappointed you didn't support my new policy in the meeting.'\n\nThis is a 2-hit 'Boss' combo of...?",
          "options": [
            {
              "id": "A",
              "text": "Flattery ('star') and a Guilt-Trip ('disappointed')"
            },
            {
              "id": "B",
              "text": "Gaslighting and Reciprocity"
            },
            {
              "id": "C",
              "text": "Honesty and a Guilt-Trip"
            },
            {
              "id": "D",
              "text": "Flattery and a Direct Order"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is a 'Historical Guilt-Trip' (A1-4) combined with a 'Reciprocity Trap' (A1-1). The manipulator *invests* a 'gift' to get a bigger payout.",
          "type": "multiple-choice",
          "question": "[Micro Simulation - Step 1]\nundefined\n\nundefined",
          "options": [
            {
              "id": "A",
              "text": "A genuine gift. (Possible, but be aware...)"
            },
            {
              "id": "B",
              "text": "A 'Reciprocity Trap' (an unsolicited gift)."
            },
            {
              "id": "C",
              "text": "A Guilt-Trip."
            },
            {
              "id": "D",
              "text": "Gaslighting."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is a 'Gauntlet' quick-check. Manipulation = Hidden. Coercion = Forced. Persuasion = Transparent.",
          "type": "multiple-choice",
          "question": "Which of the 'Big 3' definitions (A1-3) describes a tactic that is *hidden* and *deceptive*?",
          "options": [
            {
              "id": "A",
              "text": "Coercion"
            },
            {
              "id": "B",
              "text": "Persuasion"
            },
            {
              "id": "C",
              "text": "Manipulation"
            },
            {
              "id": "D",
              "text": "History"
            }
          ],
          "correctAnswer": "C"
        },
        {
          "explanation": "Quick-check: False. The Dark Triad is *personalities*: Narcissism, Machiavellianism, Psychopathy. The others are *tactics*.",
          "type": "multiple-choice",
          "question": "The 'Dark Triad' (A1-3) consists of Flattery, Guilt, and Gaslighting.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is a powerful combo. They (1) Deny your reality (Gaslighting) and (2) Reverse the blame (Playing the Victim). You are now 'the attacker'.",
          "type": "multiple-choice",
          "question": "You: 'You keep interrupting me.' Manipulator: 'No, I'm not! I'm just *passionate*! You're being *way* too sensitive. Why are you attacking me?'\n\nThis is a 2-hit combo of 'Denial' and...?",
          "options": [
            {
              "id": "A",
              "text": "Gaslighting ('You're... too sensitive') and Playing the Victim ('Why are you attacking me?')."
            },
            {
              "id": "B",
              "text": "Flattery and Honesty."
            },
            {
              "id": "C",
              "text": "Reciprocity and Guilt."
            },
            {
              "id": "D",
              "text": "A genuine misunderstanding."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is a 'Covert' manipulator. Gary *looks* like the hardest worker, but he's using the 'Martyr' (Guilt) and 'Feigned Incompetence' (Flattery) to get *out* of work.",
          "type": "multiple-choice",
          "question": "Gary is using the 'Martyr Complex' (A1-4) to...?",
          "options": [
            {
              "id": "A",
              "text": "Genuinely help the team."
            },
            {
              "id": "B",
              "text": "Manipulate his boss and co-workers to gain 'victim' status and evade 'real' work."
            },
            {
              "id": "C",
              "text": "Show he is a bad employee."
            },
            {
              "id": "D",
              "text": "Ask for a raise directly."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "Gauntlet quick-check: This is our 'Ethical Compass.' We are building shields, not swords.",
          "type": "fill-in-blank",
          "sentence": "The 'Prime Directive' (A1-3) of this app is: Use ___ for ___, not to harm.",
          "correctAnswer": "awareness",
          "wrongOptions": [
            "power",
            "friends",
            "guilt",
            "work"
          ]
        },
        {
          "explanation": "Flattery (A1-2) *creates* a 'Halo Effect.' Alex (A1-1) seemed 'nice' (from flattery), so you *assumed* they were 'trustworthy.' This was the trap.",
          "type": "multiple-choice",
          "question": "The 'Halo Effect' (A1-2) is when...",
          "options": [
            {
              "id": "A",
              "text": "You see a halo over a manipulator's head."
            },
            {
              "id": "B",
              "text": "A manipulator uses a 'Guilt-Trip' to make you feel bad."
            },
            {
              "id": "C",
              "text": "A 'good' trait (like 'nice') makes you *assume* they have *other* good traits (like 'honest')."
            },
            {
              "id": "D",
              "text": "You assume a 'bad' trait means they are all-bad."
            }
          ],
          "correctAnswer": "C"
        },
        {
          "explanation": "Gauntlet quick-check: This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*.",
          "type": "sentence-building",
          "question": "Arrange these words into the 'Guilt' defense (A1-4):",
          "words": [
            "for",
            "responsible",
            "not",
            "are",
            "You",
            "emotions",
            "others'"
          ],
          "correctSentence": "You are not responsible for others' emotions"
        },
        {
          "explanation": "Correct. 'Boss Scenarios' are not about 'bosses'; they are about *combined tactics* (e.g., Flattery + Guilt + Gaslighting).",
          "type": "multiple-choice",
          "question": "The 'Coffee Shop' (A1-1) and 'Guilt-Trip' (A1-4) scenarios are both 'Boss Scenarios' because they combine multiple tactics.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "Gauntlet quick-check: This is the 'Separate and Judge' method from A1-2. 'Thanks, but no.'",
          "type": "multiple-choice",
          "question": "This is the primary defense against...?",
          "options": [
            {
              "id": "A",
              "text": "Gaslighting"
            },
            {
              "id": "B",
              "text": "A Guilt-Trip"
            },
            {
              "id": "C",
              "text": "Flattery"
            },
            {
              "id": "D",
              "text": "Coercion"
            }
          ],
          "correctAnswer": "C"
        },
        {
          "explanation": "Gauntlet quick-check: This is the 'Boundary' defense from A1-4. 'I can't help you' stops the guilt-trip.",
          "type": "multiple-choice",
          "question": "This is the primary defense against...?",
          "options": [
            {
              "id": "A",
              "text": "Flattery"
            },
            {
              "id": "B",
              "text": "A Guilt-Trip"
            },
            {
              "id": "C",
              "text": "Propaganda"
            },
            {
              "id": "D",
              "text": "A direct threat"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This (and 'Pacing') are 'rapport' tactics. They make you *feel* 'like' the manipulator, bypassing your logic.",
          "type": "multiple-choice",
          "question": "What is 'Mirroring' (A1-2)?",
          "options": [
            {
              "id": "A",
              "text": "Looking at yourself in a mirror."
            },
            {
              "id": "B",
              "text": "A 'dark' tactic of copying a person's posture/gestures to build subconscious rapport."
            },
            {
              "id": "C",
              "text": "A 'light' tactic of telling the truth."
            },
            {
              "id": "D",
              "text": "A form of Gaslighting."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "The 'dark' path is to *beat the manipulator at their own game*. The 'light' path (from A1-3) is to refuse to play and win with *transparent* value. This app teaches the 'light' path.",
          "type": "multiple-choice",
          "question": "What is the *most* Machiavellian (and 'dark') response?",
          "options": [
            {
              "id": "A",
              "text": "Use the *same* tactics, but do them better."
            },
            {
              "id": "B",
              "text": "Focus on your own *work and results* (the 'light' path)."
            },
            {
              "id": "C",
              "text": "Loudly accuse them of being a manipulator."
            },
            {
              "id": "D",
              "text": "Quit the job."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is the 'dark' philosophy. Machiavelli saw ethics/morality as 'weakness' that got in the way of 'winning'. We are learning to see it as 'strength'.",
          "type": "multiple-choice",
          "question": "The historical figure Machiavelli (A1-3) would say you are 'weak' if you *don't* use manipulation to get what you want.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is a 'Boss Scenario' of Manipulation (Guilt) + Coercion (Threat). The *threat* is the removal of 'love' or 'status' in the family. It's a 'dark' ultimatum.",
          "type": "multiple-choice",
          "question": "A family member says, 'If you *really* loved this family, you wouldn't move to a new city for that job.'\n\nThis is a 2-hit combo of a 'Guilt-Trip' (A1-4) and...?",
          "options": [
            {
              "id": "A",
              "text": "Coercion (an emotional threat/ultimatum)."
            },
            {
              "id": "B",
              "text": "Flattery (praising the family)."
            },
            {
              "id": "C",
              "text": "Gaslighting (denying your reality)."
            },
            {
              "id": "D",
              "text": "A genuine expression of sadness."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is the 'Drama Triangle' (which we'll cover later). They play the 'Victim' to force you to be the 'Rescuer.' The only winning move is to *refuse* the role.",
          "type": "fill-in-blank",
          "sentence": "The 'Martyr Complex' (A1-4) ('I'll just walk...') forces you into the '___' role.",
          "correctAnswer": "Rescuer",
          "wrongOptions": [
            "Villain",
            "Hero",
            "Victim"
          ]
        },
        {
          "explanation": "This is a 'dark' script. (1) They deny your reality ('It was a joke') and (2) They make *you* the problem ('You're too serious'). You are now 'wrong' for having feelings.",
          "type": "multiple-choice",
          "question": "This is a 2-hit 'Gaslighting' combo. 'I'm just kidding' (Denial) and...?",
          "options": [
            {
              "id": "A",
              "text": "'You're... so serious' (Blame-Shifting / Attacking your character)."
            },
            {
              "id": "B",
              "text": "A genuine apology."
            },
            {
              "id": "C",
              "text": "Flattery."
            },
            {
              "id": "D",
              "text": "A 'Historical' Guilt-Trip."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is a myth. Many manipulators are 'covert' (hidden). They seem charming, friendly, and kind. The 'Coffee Shop' (A1-1) is proof. The 'charm' is the *mask*.",
          "type": "multiple-choice",
          "question": "The 'Dark Triad' (A1-3) traits (Narcissism, Machiavellianism, Psychopathy) are *always* easy to spot.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is a 'Bootcamp' (A1-3) review. Alex's actions weren't about *ego*; they were about *profit*. The flattery was a *tool*. 'The end justifies the means.' This is Machiavellianism.",
          "type": "multiple-choice",
          "question": "The 'Coffee Shop' (A1-1) con-artist 'Alex' *best* represents which 'Dark Triad' trait?",
          "options": [
            {
              "id": "A",
              "text": "Narcissism (needed admiration and flattery)"
            },
            {
              "id": "B",
              "text": "Machiavellianism (used a cold, calculated script to get a goal: $20)"
            },
            {
              "id": "C",
              "text": "Psychopathy (showed a total lack of fear)"
            },
            {
              "id": "D",
              "text": "Empathy (was genuinely lonely)"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "Gauntlet quick-check: This is the 'Golden Rule' of flattery defense.",
          "type": "sentence-building",
          "question": "Arrange these words into the 'Flattery' defense (A1-2):",
          "words": [
            "the",
            "flattery",
            "and",
            "the",
            "Separate",
            "'ask.'"
          ],
          "correctSentence": "Separate the flattery and the 'ask.'"
        },
        {
          "explanation": "This is the 'Golden Rule' from A1-3. You must always ask: What is the *true intent* behind these words? Is it to help, or to control?",
          "type": "multiple-choice",
          "question": "What is the 'Prime Directive' of this app's philosophy? (A1-3)",
          "options": [
            {
              "id": "A",
              "text": "The end justifies the means."
            },
            {
              "id": "B",
              "text": "Intent is the language of Dark Psychology."
            },
            {
              "id": "C",
              "text": "Do whatever it takes to win."
            },
            {
              "id": "D",
              "text": "Trust no one."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is a *huge* red flag. They (1) Flatter you (Love Bombing), (2) Play the Victim ('my ex is crazy'), and (3) Gaslight the ex ('they are the problem'). You're being 'groomed' to take their side.",
          "type": "multiple-choice",
          "question": "[Boss Challenge]\nA date: 'You are *perfect* (Love Bombing). I've never met anyone like you. That's why I know you'll understand... my ex is *crazy* and *always* texting me, you *have* to believe me, they are the problem!'\n\nThis is a 'Boss Scenario' combining 'Love Bombing' (A1-2 Flattery) with...?",
          "options": [
            {
              "id": "A",
              "text": "Gaslighting (denying their ex's reality) and Playing the Victim."
            },
            {
              "id": "B",
              "text": "Honesty and Trust."
            },
            {
              "id": "C",
              "text": "Guilt-Tripping you."
            },
            {
              "id": "D",
              "text": "Reciprocity (they bought you dinner)."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is the final 'Ethics' test from A1-3. The 'Prime Directive' is 'Do No Harm.' Using a 'white lie' (manipulation) to *prevent* harm (the scam) is a high-level, 'light' side choice.",
          "type": "multiple-choice",
          "question": "Is it 'ethical' to use 'manipulation' (a lie, e.g., 'Oh, Alex, your boss is on the phone!') to stop them?",
          "options": [
            {
              "id": "A",
              "text": "No. Manipulation is *always* unethical."
            },
            {
              "id": "B",
              "text": "Yes. This is a 'grey area' where a 'dark' tactic (a lie) is used for a 'light' purpose (protection)."
            },
            {
              "id": "C",
              "text": "No. You should just call the police."
            },
            {
              "id": "D",
              "text": "Yes. You should steal Alex's wallet."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "False. This is an aggressive, bad defense. The *best* defense is to *test* them: subtly change your *own* posture. If they follow, you've confirmed the tactic silently.",
          "type": "multiple-choice",
          "question": "The *best* defense against 'Mirroring' (A1-2) is to angrily accuse the person: 'Stop copying me!'",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This was the lesson of A1-4. The 'Casey' (Guilt) con is 'darker' because it exploits *trust* and *empathy*, which are much more powerful than flattery from a stranger.",
          "type": "multiple-choice",
          "question": "The 'Hook' scenarios (Alex and Casey) proved that...",
          "options": [
            {
              "id": "A",
              "text": "You are a bad person."
            },
            {
              "id": "B",
              "text": "Manipulation is most effective when it comes from a *friend* (Casey)."
            },
            {
              "id": "C",
              "text": "Manipulation is most effective when it comes from a *stranger* (Alex)."
            },
            {
              "id": "D",
              "text": "Flattery and Guilt are the *same* tactic."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is a 'synthesis' question. This proves that 'Gaslighting' is an *ancient* tactic. The goal is *always* to destroy your trust in your own mind.",
          "type": "multiple-choice",
          "question": "What is the *identical* manipulative goal in both?",
          "options": [
            {
              "id": "A",
              "text": "To make the target doubt their own reality/perception."
            },
            {
              "id": "B",
              "text": "To save money on gas/phone bills."
            },
            {
              "id": "C",
              "text": "To be funny and make a joke."
            },
            {
              "id": "D",
              "text": "To flatter the target."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "Gauntlet quick-check: This is the core difference. Flattery (ego) 'pulls' you. Guilt (conscience) 'pushes' you.",
          "type": "fill-in-blank",
          "sentence": "Flattery (A1-2) attacks your ___. Guilt (A1-4) attacks your ___.",
          "correctAnswer": "ego",
          "wrongOptions": [
            "wallet",
            "job"
          ]
        },
        {
          "explanation": "This is the defense for 'After all I've done for you...'. A 'light' friendship is a *relationship*; a 'dark' one is a *ledger*.",
          "type": "sentence-building",
          "question": "Arrange these words into the *defense* for 'Historical Guilt' (A1-4):",
          "words": [
            "is",
            "not",
            "Friendship",
            "a",
            "transaction"
          ],
          "correctSentence": "Friendship is not a transaction"
        },
        {
          "explanation": "Correct. You've passed the 'Gauntlet.' Part 3 is the final 'Boss Fight' for Unit 1. Let's see if you can put it all together.",
          "type": "multiple-choice",
          "question": "You have survived the 'Gauntlet.' What do you expect in Part 3, the 'Final Scenarios'?",
          "options": [
            {
              "id": "A",
              "text": "The final, *hardest* 'Boss Scenarios' that combine *everything* you've learned."
            },
            {
              "id": "B",
              "text": "An easy, 5-question quiz."
            },
            {
              "id": "C",
              "text": "A review of this review."
            },
            {
              "id": "D",
              "text": "New lessons you haven't seen yet."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is the 'Full House.' (1) Flattery ('trust'), (2) Guilt ('hurt'), (3) Gaslighting ('you always doubt me'). This is a 10/10 manipulation.",
          "type": "multiple-choice",
          "question": "[Boss Challenge]\nA family member: 'You're the only one I can *trust* (Flattery). You're so good at this... which is why I'm *so hurt* you won't 'loan' me money for my 'business idea' (Guilt). You *always* doubt me!' (Gaslighting)\n\nWhat is this 3-hit 'Boss' combo?",
          "options": [
            {
              "id": "A",
              "text": "Flattery + Guilt-Trip + Gaslighting"
            },
            {
              "id": "B",
              "text": "Flattery + Reciprocity + Honesty"
            },
            {
              "id": "C",
              "text": "Guilt-Trip + Gaslighting + A Direct Request"
            },
            {
              "id": "D",
              "text": "Gaslighting + Flattery + A Genuine Complaint"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is the 'Coffee Shop Rematch.' You've used the 'Acknowledge & Pivot' and 'Settle the Debt' defenses to win.",
          "type": "multiple-choice",
          "question": "[Micro Simulation - Step 1]\nundefined\n\nundefined",
          "options": [
            {
              "id": "A",
              "text": "'Stop flattering me, you con-artist!' (Aggressive)"
            },
            {
              "id": "B",
              "text": "'Wow, thank you so much! I am!' (You are trapped)"
            },
            {
              "id": "C",
              "text": "'Thanks. What's on your mind?' (Acknowledge & Pivot)"
            },
            {
              "id": "D",
              "text": "'I'm not creative at all.' (Defensive)"
            }
          ],
          "correctAnswer": "C"
        },
        {
          "explanation": "This is the 'Casey Rematch.' You've used a 'Boundary' and 'Named the Tactic' to win.",
          "type": "multiple-choice",
          "question": "[Micro Simulation - Step 1]\nundefined\n\nundefined",
          "options": [
            {
              "id": "A",
              "text": "'You're right, it is. Bye.' (Aggressive)"
            },
            {
              "id": "B",
              "text": "'Oh no, it's not! I'll come over!' (You are trapped)"
            },
            {
              "id": "C",
              "text": "'You're trying to guilt-trip me!' (Accusatory)"
            },
            {
              "id": "D",
              "text": "'Casey, that's not fair. I want to see the movie, but I'm happy to help *tomorrow*. What's *really* going on?'"
            }
          ],
          "correctAnswer": "D"
        },
        {
          "explanation": "This is Machiavellianism (A1-3). The politician is using 'dark' tactics (Fear, Flattery, Gaslighting) as *tools*. The 'end' (winning the election) 'justifies the means' (dividing the nation).",
          "type": "multiple-choice",
          "question": "This is a form of mass-scale 'Propaganda' (A1-3). This politician is *acting* like...?",
          "options": [
            {
              "id": "A",
              "text": "A Machiavellian (using fear/division as a *tool* to win power)."
            },
            {
              "id": "B",
              "text": "An Empath (sharing real feelings)."
            },
            {
              "id": "C",
              "text": "A 'Light' Leader (being honest)."
            },
            {
              "id": "D",
              "text": "A 'Rescuer' (trying to help)."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "Final definition check. Persuasion is 'light' because it's *transparent* and respects your *choice*.",
          "type": "multiple-choice",
          "question": "Which of the 'Big 3' (A1-3) is *always* the most 'ethical' and 'light'?",
          "options": [
            {
              "id": "A",
              "text": "Manipulation (hidden)"
            },
            {
              "id": "B",
              "text": "Coercion (forced)"
            },
            {
              "id": "C",
              "text": "Persuasion (transparent)"
            },
            {
              "id": "D",
              "text": "None of them."
            }
          ],
          "correctAnswer": "C"
        },
        {
          "explanation": "False. That is the *Machiavellian* creed. Our 'Prime Directive' is 'Do No Harm. Use awareness for *defense*.'",
          "type": "multiple-choice",
          "question": "The 'Prime Directive' (A1-3) means: 'It is okay to use 'dark' tactics, as long as you *win*.'",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "Final check. Flattery 'pulls' (ego). Guilt 'pushes' (conscience).",
          "type": "fill-in-blank",
          "sentence": "Flattery (A1-2) attacks the ___. Guilt (A1-4) attacks the ___.",
          "correctAnswer": "ego",
          "wrongOptions": [
            "wallet",
            "job"
          ]
        },
        {
          "explanation": "Final check. This is the 'Golden Rule' of flattery defense.",
          "type": "sentence-building",
          "question": "Arrange these words into the 'Flattery' defense (A1-2):",
          "words": [
            "the",
            "flattery",
            "and",
            "the",
            "Separate",
            "'ask.'"
          ],
          "correctSentence": "Separate the flattery and the 'ask.'"
        },
        {
          "explanation": "Final check. This is the 'Golden Rule' of emotional defense.",
          "type": "sentence-building",
          "question": "Arrange these words into the 'Guilt' defense (A1-4):",
          "words": [
            "for",
            "responsible",
            "not",
            "are",
            "You",
            "emotions",
            "others'"
          ],
          "correctSentence": "You are not responsible for others' emotions"
        },
        {
          "explanation": "Final check. Gaslighting's goal is to *destroy your reality*.",
          "type": "multiple-choice",
          "question": "The term 'Gaslighting' (A1-3/A1-4) comes from a play where a man tries to make his wife believe she is...?",
          "options": [
            {
              "id": "A",
              "text": "A genius"
            },
            {
              "id": "B",
              "text": "Insane / Crazy"
            },
            {
              "id": "C",
              "text": "A good friend"
            },
            {
              "id": "D",
              "text": "Wealthy"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "Final check. False. It is *personalities*: Narcissism, Machiavellianism, Psychopathy.",
          "type": "multiple-choice",
          "question": "The 'Dark Triad' (A1-3) consists of Flattery, Guilt, and Gaslighting.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is the 'Mastery' defense. (1) Break the Mirror (non-verbal), (2) Name the Tactic ('not fair'), (3) Reject the Gaslight ('not true'), (4) State the Boundary ('I can't help').",
          "type": "multiple-choice",
          "question": "[Boss Challenge]\nA 'friend' is mirroring your posture. 'You are *so* smart (Flattery). That's why I'm *crushed* you won't help me... *after all I've done for you* (Guilt). You must just be *imagining* I was ever a good friend!' (Gaslighting)\n\nWhat is the *strongest* defense against this 4-hit 'Boss' combo?",
          "options": [
            {
              "id": "A",
              "text": "Give in immediately. (You lose)"
            },
            {
              "id": "B",
              "text": "(Subtly change posture, breaking the mirror) 'That's not fair, and it's not true. I can't help you, but I'm not a bad friend.'"
            },
            {
              "id": "C",
              "text": "Start crying. (You lose)"
            },
            {
              "id": "D",
              "text": "Accuse them: 'You're a gaslighting, guilt-tripping narcissist!'"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "Flattery (A1-2) *creates* a 'Halo Effect.' Alex (A1-1) seemed 'nice' (from flattery), so you *assumed* they were 'trustworthy.' This was the trap.",
          "type": "multiple-choice",
          "question": "What is the 'Halo Effect' (A1-2)?",
          "options": [
            {
              "id": "A",
              "text": "A 'good' trait (like 'nice') makes you *assume* other 'good' traits (like 'honest')."
            },
            {
              "id": "B",
              "text": "A 'bad' trait makes you assume other 'bad' traits."
            },
            {
              "id": "C",
              "text": "A 'guilt-trip' about religion."
            },
            {
              "id": "D",
              "text": "A tactic used by 'Alex' in A1-1."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "explanation": "This is the 'Light' path. 'Rapport' is a normal social skill. It only becomes 'dark' when the *intent* is *hidden* and *exploitative*.",
          "type": "multiple-choice",
          "question": "When is it 'ethically' okay to use these 'rapport' skills?",
          "options": [
            {
              "id": "A",
              "text": "To *deceive* a date into liking you (Dark)."
            },
            {
              "id": "B",
              "text": "To *transparently* build a *real* connection (Light)."
            },
            {
              "id": "C",
              "text": "To *trick* your boss into giving you a raise (Dark)."
            },
            {
              "id": "D",
              "text": "It is *never* ethical to use these skills."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is the 'Drama Triangle' from A1-4. The 'Martyr' (Victim) *forces* you to be the 'Persecutor' ('You're letting me walk!'). You can only 'escape' by becoming the 'Rescuer' ('I'm coming!').",
          "type": "multiple-choice",
          "question": "What is the *goal* of the 'Martyr'?",
          "options": [
            {
              "id": "A",
              "text": "To make you feel like the 'Persecutor' (the 'bad guy')."
            },
            {
              "id": "B",
              "text": "To make you feel like the 'Rescuer' (the 'good guy')."
            },
            {
              "id": "C",
              "text": "Both A and B. They make you the 'bad guy' *until* you become the 'RescEuer'."
            },
            {
              "id": "D",
              "text": "To genuinely go for a walk."
            }
          ],
          "correctAnswer": "C"
        },
        {
          "explanation": "This is a 'dark' 'Rescuer' mentality. The 'light' path is to *respect* autonomy. You can *offer* help (Persuasion), but you cannot *force* it (Coercion/Manipulation).",
          "type": "multiple-choice",
          "question": "The 'Prime Directive' (A1-3) means: 'It is okay to use manipulation to 'help' someone, even if they don't want it.'",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is the 'Mastery' defense. It's 'covert' (hidden). You *test* them without being aggressive. If they follow, you've confirmed the tactic.",
          "type": "multiple-choice",
          "question": "What is the *best* 'test' if you suspect 'Mirroring' (A1-2)?",
          "options": [
            {
              "id": "A",
              "text": "Accuse them: 'Stop copying me!'"
            },
            {
              "id": "B",
              "text": "Subtly change your *own* posture and see if they *follow*."
            },
            {
              "id": "C",
              "text": "Copy *them* to see if they notice."
            },
            {
              "id": "D",
              "text": "Say nothing and leave."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is 'Flipping the Script.' You came with a valid complaint, and you *left* feeling guilty for 'attacking' a 'sad' person. This is a 10/10 defensive manipulation.",
          "type": "multiple-choice",
          "question": "Why is this 'Gaslight/Victim' combo so effective?",
          "options": [
            {
              "id": "A",
              "text": "Because it's true."
            },
            {
              "id": "B",
              "text": "Because it makes *you* the 'attacker' and *them* the 'victim'."
            },
            {
              "id": "C",
              "text": "Because it is very funny."
            },
            {
              "id": "D",
              "text": "Because it is a form of flattery."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "This is the 'Mastery' insight. 'Rapport' is a tool. 'Flattery' is a tool. 'Guilt' is a tool. The 'intent' (A1-3) is what defines them as 'dark' or 'light'.",
          "type": "multiple-choice",
          "question": "What is the 'ethically-aware' takeaway from Unit 1?",
          "options": [
            {
              "id": "A",
              "text": "That *everyone* is a 'dark' manipulator and no one can be trusted."
            },
            {
              "id": "B",
              "text": "That these tactics are 'tools.' The *intent* (to help vs. to harm) is what makes them 'dark' or 'light'."
            },
            {
              "id": "C",
              "text": "That you are now a 'master' and can't be manipulated."
            },
            {
              "id": "D",
              "text": "That you should use these tactics to get what you want."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "explanation": "Congratulations. You have mastered the 'Foundations.' It's time to move on to the 'core' tactics in Unit 2, starting with the most famous 'Dark Triad' trait: Narcissism.",
          "type": "multiple-choice",
          "question": "You have earned the 'Unit 1 Mastery Badge.' What is the next logical step?",
          "options": [
            {
              "id": "A",
              "text": "Lesson A2-1: (Start the next Unit)"
            },
            {
              "id": "B",
              "text": "Restart Unit 1."
            },
            {
              "id": "C",
              "text": "Quit the app."
            },
            {
              "id": "D",
              "text": "This is the end of the app."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! This is a classic 'praise and punish' script. The Flattery 'pulls you in' (ego), and the Guilt-Trip 'pushes you' (conscience). This is high-level manipulation.",
            "incorrect": "Incorrect. This is a classic 'praise and punish' script. The Flattery 'pulls you in' (ego), and the Guilt-Trip 'pushes you' (conscience). This is high-level manipulation."
          },
          "type": "multiple-choice",
          "question": "[Boss Challenge]\nA new manager pulls you aside. 'You're the *only* one here with real vision. You're a star. That's why I'm *so* disappointed you didn't support my new policy in the meeting.'\n\nThis is a 2-hit 'Boss' combo of...?",
          "options": [
            {
              "id": "A",
              "text": "Flattery ('star') and a Guilt-Trip ('disappointed')"
            },
            {
              "id": "B",
              "text": "Gaslighting and Reciprocity"
            },
            {
              "id": "C",
              "text": "Honesty and a Guilt-Trip"
            },
            {
              "id": "D",
              "text": "Flattery and a Direct Order"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! This is a 'Historical Guilt-Trip' (A1-4) combined with a 'Reciprocity Trap' (A1-1). The manipulator *invests* a 'gift' to get a bigger payout.",
            "incorrect": "Incorrect. This is a 'Historical Guilt-Trip' (A1-4) combined with a 'Reciprocity Trap' (A1-1). The manipulator *invests* a 'gift' to get a bigger payout."
          },
          "type": "multiple-choice",
          "question": "[Micro Simulation - Step 1]\nundefined\n\nundefined",
          "options": [
            {
              "id": "A",
              "text": "A genuine gift. (Possible, but be aware...)"
            },
            {
              "id": "B",
              "text": "A 'Reciprocity Trap' (an unsolicited gift)."
            },
            {
              "id": "C",
              "text": "A Guilt-Trip."
            },
            {
              "id": "D",
              "text": "Gaslighting."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! This is a 'Gauntlet' quick-check. Manipulation = Hidden. Coercion = Forced. Persuasion = Transparent.",
            "incorrect": "Incorrect. This is a 'Gauntlet' quick-check. Manipulation = Hidden. Coercion = Forced. Persuasion = Transparent."
          },
          "type": "multiple-choice",
          "question": "Which of the 'Big 3' definitions (A1-3) describes a tactic that is *hidden* and *deceptive*?",
          "options": [
            {
              "id": "A",
              "text": "Coercion"
            },
            {
              "id": "B",
              "text": "Persuasion"
            },
            {
              "id": "C",
              "text": "Manipulation"
            },
            {
              "id": "D",
              "text": "History"
            }
          ],
          "correctAnswer": "C"
        },
        {
          "feedback": {
            "correct": "Correct! Quick-check: False. The Dark Triad is *personalities*: Narcissism, Machiavellianism, Psychopathy. The others are *tactics*.",
            "incorrect": "Incorrect. Quick-check: False. The Dark Triad is *personalities*: Narcissism, Machiavellianism, Psychopathy. The others are *tactics*."
          },
          "type": "multiple-choice",
          "question": "The 'Dark Triad' (A1-3) consists of Flattery, Guilt, and Gaslighting.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! This is a powerful combo. They (1) Deny your reality (Gaslighting) and (2) Reverse the blame (Playing the Victim). You are now 'the attacker'.",
            "incorrect": "Incorrect. This is a powerful combo. They (1) Deny your reality (Gaslighting) and (2) Reverse the blame (Playing the Victim). You are now 'the attacker'."
          },
          "type": "multiple-choice",
          "question": "You: 'You keep interrupting me.' Manipulator: 'No, I'm not! I'm just *passionate*! You're being *way* too sensitive. Why are you attacking me?'\n\nThis is a 2-hit combo of 'Denial' and...?",
          "options": [
            {
              "id": "A",
              "text": "Gaslighting ('You're... too sensitive') and Playing the Victim ('Why are you attacking me?')."
            },
            {
              "id": "B",
              "text": "Flattery and Honesty."
            },
            {
              "id": "C",
              "text": "Reciprocity and Guilt."
            },
            {
              "id": "D",
              "text": "A genuine misunderstanding."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! This is a 'Covert' manipulator. Gary *looks* like the hardest worker, but he's using the 'Martyr' (Guilt) and 'Feigned Incompetence' (Flattery) to get *out* of work.",
            "incorrect": "Incorrect. This is a 'Covert' manipulator. Gary *looks* like the hardest worker, but he's using the 'Martyr' (Guilt) and 'Feigned Incompetence' (Flattery) to get *out* of work."
          },
          "type": "multiple-choice",
          "question": "Gary is using the 'Martyr Complex' (A1-4) to...?",
          "options": [
            {
              "id": "A",
              "text": "Genuinely help the team."
            },
            {
              "id": "B",
              "text": "Manipulate his boss and co-workers to gain 'victim' status and evade 'real' work."
            },
            {
              "id": "C",
              "text": "Show he is a bad employee."
            },
            {
              "id": "D",
              "text": "Ask for a raise directly."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! Gauntlet quick-check: This is our 'Ethical Compass.' We are building shields, not swords.",
            "incorrect": "Incorrect. Gauntlet quick-check: This is our 'Ethical Compass.' We are building shields, not swords."
          },
          "type": "fill-in-blank",
          "sentence": "The 'Prime Directive' (A1-3) of this app is: Use (--------) for (--------), not to harm.",
          "fillInOptions": [
            "awareness",
            "defense",
            "power",
            "friends",
            "guilt",
            "work"
          ],
          "answers": [
            "awareness",
            "defense"
          ],
          "correctAnswer": "awareness",
          "wrongOptions": [
            "power",
            "friends",
            "guilt",
            "work"
          ]
        },
        {
          "feedback": {
            "correct": "Correct! Flattery (A1-2) *creates* a 'Halo Effect.' Alex (A1-1) seemed 'nice' (from flattery), so you *assumed* they were 'trustworthy.' This was the trap.",
            "incorrect": "Incorrect. Flattery (A1-2) *creates* a 'Halo Effect.' Alex (A1-1) seemed 'nice' (from flattery), so you *assumed* they were 'trustworthy.' This was the trap."
          },
          "type": "multiple-choice",
          "question": "The 'Halo Effect' (A1-2) is when...",
          "options": [
            {
              "id": "A",
              "text": "You see a halo over a manipulator's head."
            },
            {
              "id": "B",
              "text": "A manipulator uses a 'Guilt-Trip' to make you feel bad."
            },
            {
              "id": "C",
              "text": "A 'good' trait (like 'nice') makes you *assume* they have *other* good traits (like 'honest')."
            },
            {
              "id": "D",
              "text": "You assume a 'bad' trait means they are all-bad."
            }
          ],
          "correctAnswer": "C"
        },
        {
          "feedback": {
            "correct": "Correct! Gauntlet quick-check: This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*.",
            "incorrect": "Incorrect. Gauntlet quick-check: This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*."
          },
          "type": "sentence-building",
          "question": "Arrange the words to make a sentence",
          "words": [
            "for",
            "responsible",
            "not",
            "are",
            "You",
            "emotions",
            "others'"
          ],
          "correctSentence": "You are not responsible for others' emotions"
        },
        {
          "feedback": {
            "correct": "Correct! Correct. 'Boss Scenarios' are not about 'bosses'; they are about *combined tactics* (e.g., Flattery + Guilt + Gaslighting).",
            "incorrect": "Incorrect. Correct. 'Boss Scenarios' are not about 'bosses'; they are about *combined tactics* (e.g., Flattery + Guilt + Gaslighting)."
          },
          "type": "multiple-choice",
          "question": "The 'Coffee Shop' (A1-1) and 'Guilt-Trip' (A1-4) scenarios are both 'Boss Scenarios' because they combine multiple tactics.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! Gauntlet quick-check: This is the 'Separate and Judge' method from A1-2. 'Thanks, but no.'",
            "incorrect": "Incorrect. Gauntlet quick-check: This is the 'Separate and Judge' method from A1-2. 'Thanks, but no.'"
          },
          "type": "multiple-choice",
          "question": "This is the primary defense against...?",
          "options": [
            {
              "id": "A",
              "text": "Gaslighting"
            },
            {
              "id": "B",
              "text": "A Guilt-Trip"
            },
            {
              "id": "C",
              "text": "Flattery"
            },
            {
              "id": "D",
              "text": "Coercion"
            }
          ],
          "correctAnswer": "C"
        },
        {
          "feedback": {
            "correct": "Correct! Gauntlet quick-check: This is the 'Boundary' defense from A1-4. 'I can't help you' stops the guilt-trip.",
            "incorrect": "Incorrect. Gauntlet quick-check: This is the 'Boundary' defense from A1-4. 'I can't help you' stops the guilt-trip."
          },
          "type": "multiple-choice",
          "question": "This is the primary defense against...?",
          "options": [
            {
              "id": "A",
              "text": "Flattery"
            },
            {
              "id": "B",
              "text": "A Guilt-Trip"
            },
            {
              "id": "C",
              "text": "Propaganda"
            },
            {
              "id": "D",
              "text": "A direct threat"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! This (and 'Pacing') are 'rapport' tactics. They make you *feel* 'like' the manipulator, bypassing your logic.",
            "incorrect": "Incorrect. This (and 'Pacing') are 'rapport' tactics. They make you *feel* 'like' the manipulator, bypassing your logic."
          },
          "type": "multiple-choice",
          "question": "What is 'Mirroring' (A1-2)?",
          "options": [
            {
              "id": "A",
              "text": "Looking at yourself in a mirror."
            },
            {
              "id": "B",
              "text": "A 'dark' tactic of copying a person's posture/gestures to build subconscious rapport."
            },
            {
              "id": "C",
              "text": "A 'light' tactic of telling the truth."
            },
            {
              "id": "D",
              "text": "A form of Gaslighting."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! The 'dark' path is to *beat the manipulator at their own game*. The 'light' path (from A1-3) is to refuse to play and win with *transparent* value. This app teaches the 'light' path.",
            "incorrect": "Incorrect. The 'dark' path is to *beat the manipulator at their own game*. The 'light' path (from A1-3) is to refuse to play and win with *transparent* value. This app teaches the 'light' path."
          },
          "type": "multiple-choice",
          "question": "What is the *most* Machiavellian (and 'dark') response?",
          "options": [
            {
              "id": "A",
              "text": "Use the *same* tactics, but do them better."
            },
            {
              "id": "B",
              "text": "Focus on your own *work and results* (the 'light' path)."
            },
            {
              "id": "C",
              "text": "Loudly accuse them of being a manipulator."
            },
            {
              "id": "D",
              "text": "Quit the job."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! This is the 'dark' philosophy. Machiavelli saw ethics/morality as 'weakness' that got in the way of 'winning'. We are learning to see it as 'strength'.",
            "incorrect": "Incorrect. This is the 'dark' philosophy. Machiavelli saw ethics/morality as 'weakness' that got in the way of 'winning'. We are learning to see it as 'strength'."
          },
          "type": "multiple-choice",
          "question": "The historical figure Machiavelli (A1-3) would say you are 'weak' if you *don't* use manipulation to get what you want.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! This is a 'Boss Scenario' of Manipulation (Guilt) + Coercion (Threat). The *threat* is the removal of 'love' or 'status' in the family. It's a 'dark' ultimatum.",
            "incorrect": "Incorrect. This is a 'Boss Scenario' of Manipulation (Guilt) + Coercion (Threat). The *threat* is the removal of 'love' or 'status' in the family. It's a 'dark' ultimatum."
          },
          "type": "multiple-choice",
          "question": "A family member says, 'If you *really* loved this family, you wouldn't move to a new city for that job.'\n\nThis is a 2-hit combo of a 'Guilt-Trip' (A1-4) and...?",
          "options": [
            {
              "id": "A",
              "text": "Coercion (an emotional threat/ultimatum)."
            },
            {
              "id": "B",
              "text": "Flattery (praising the family)."
            },
            {
              "id": "C",
              "text": "Gaslighting (denying your reality)."
            },
            {
              "id": "D",
              "text": "A genuine expression of sadness."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! This is the 'Drama Triangle' (which we'll cover later). They play the 'Victim' to force you to be the 'Rescuer.' The only winning move is to *refuse* the role.",
            "incorrect": "Incorrect. This is the 'Drama Triangle' (which we'll cover later). They play the 'Victim' to force you to be the 'Rescuer.' The only winning move is to *refuse* the role."
          },
          "type": "fill-in-blank",
          "sentence": "The 'Martyr Complex' (A1-4) ('I'll just walk...') forces you into the '(--------)' role.",
          "fillInOptions": [
            "Rescuer",
            "Villain",
            "Hero",
            "Victim"
          ],
          "answers": [
            "Rescuer"
          ],
          "correctAnswer": "Rescuer",
          "wrongOptions": [
            "Villain",
            "Hero",
            "Victim"
          ]
        },
        {
          "feedback": {
            "correct": "Correct! This is a 'dark' script. (1) They deny your reality ('It was a joke') and (2) They make *you* the problem ('You're too serious'). You are now 'wrong' for having feelings.",
            "incorrect": "Incorrect. This is a 'dark' script. (1) They deny your reality ('It was a joke') and (2) They make *you* the problem ('You're too serious'). You are now 'wrong' for having feelings."
          },
          "type": "multiple-choice",
          "question": "This is a 2-hit 'Gaslighting' combo. 'I'm just kidding' (Denial) and...?",
          "options": [
            {
              "id": "A",
              "text": "'You're... so serious' (Blame-Shifting / Attacking your character)."
            },
            {
              "id": "B",
              "text": "A genuine apology."
            },
            {
              "id": "C",
              "text": "Flattery."
            },
            {
              "id": "D",
              "text": "A 'Historical' Guilt-Trip."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! This is a myth. Many manipulators are 'covert' (hidden). They seem charming, friendly, and kind. The 'Coffee Shop' (A1-1) is proof. The 'charm' is the *mask*.",
            "incorrect": "Incorrect. This is a myth. Many manipulators are 'covert' (hidden). They seem charming, friendly, and kind. The 'Coffee Shop' (A1-1) is proof. The 'charm' is the *mask*."
          },
          "type": "multiple-choice",
          "question": "The 'Dark Triad' (A1-3) traits (Narcissism, Machiavellianism, Psychopathy) are *always* easy to spot.",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! This is a 'Bootcamp' (A1-3) review. Alex's actions weren't about *ego*; they were about *profit*. The flattery was a *tool*. 'The end justifies the means.' This is Machiavellianism.",
            "incorrect": "Incorrect. This is a 'Bootcamp' (A1-3) review. Alex's actions weren't about *ego*; they were about *profit*. The flattery was a *tool*. 'The end justifies the means.' This is Machiavellianism."
          },
          "type": "multiple-choice",
          "question": "The 'Coffee Shop' (A1-1) con-artist 'Alex' *best* represents which 'Dark Triad' trait?",
          "options": [
            {
              "id": "A",
              "text": "Narcissism (needed admiration and flattery)"
            },
            {
              "id": "B",
              "text": "Machiavellianism (used a cold, calculated script to get a goal: $20)"
            },
            {
              "id": "C",
              "text": "Psychopathy (showed a total lack of fear)"
            },
            {
              "id": "D",
              "text": "Empathy (was genuinely lonely)"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! Gauntlet quick-check: This is the 'Golden Rule' of flattery defense.",
            "incorrect": "Incorrect. Gauntlet quick-check: This is the 'Golden Rule' of flattery defense."
          },
          "type": "sentence-building",
          "question": "Arrange the words to make a sentence",
          "words": [
            "the",
            "flattery",
            "and",
            "the",
            "Separate",
            "'ask.'"
          ],
          "correctSentence": "Separate the flattery and the 'ask.'"
        },
        {
          "feedback": {
            "correct": "Correct! This is the 'Golden Rule' from A1-3. You must always ask: What is the *true intent* behind these words? Is it to help, or to control?",
            "incorrect": "Incorrect. This is the 'Golden Rule' from A1-3. You must always ask: What is the *true intent* behind these words? Is it to help, or to control?"
          },
          "type": "multiple-choice",
          "question": "What is the 'Prime Directive' of this app's philosophy? (A1-3)",
          "options": [
            {
              "id": "A",
              "text": "The end justifies the means."
            },
            {
              "id": "B",
              "text": "Intent is the language of Dark Psychology."
            },
            {
              "id": "C",
              "text": "Do whatever it takes to win."
            },
            {
              "id": "D",
              "text": "Trust no one."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! This is a *huge* red flag. They (1) Flatter you (Love Bombing), (2) Play the Victim ('my ex is crazy'), and (3) Gaslight the ex ('they are the problem'). You're being 'groomed' to take their side.",
            "incorrect": "Incorrect. This is a *huge* red flag. They (1) Flatter you (Love Bombing), (2) Play the Victim ('my ex is crazy'), and (3) Gaslight the ex ('they are the problem'). You're being 'groomed' to take their side."
          },
          "type": "multiple-choice",
          "question": "[Boss Challenge]\nA date: 'You are *perfect* (Love Bombing). I've never met anyone like you. That's why I know you'll understand... my ex is *crazy* and *always* texting me, you *have* to believe me, they are the problem!'\n\nThis is a 'Boss Scenario' combining 'Love Bombing' (A1-2 Flattery) with...?",
          "options": [
            {
              "id": "A",
              "text": "Gaslighting (denying their ex's reality) and Playing the Victim."
            },
            {
              "id": "B",
              "text": "Honesty and Trust."
            },
            {
              "id": "C",
              "text": "Guilt-Tripping you."
            },
            {
              "id": "D",
              "text": "Reciprocity (they bought you dinner)."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! This is the final 'Ethics' test from A1-3. The 'Prime Directive' is 'Do No Harm.' Using a 'white lie' (manipulation) to *prevent* harm (the scam) is a high-level, 'light' side choice.",
            "incorrect": "Incorrect. This is the final 'Ethics' test from A1-3. The 'Prime Directive' is 'Do No Harm.' Using a 'white lie' (manipulation) to *prevent* harm (the scam) is a high-level, 'light' side choice."
          },
          "type": "multiple-choice",
          "question": "Is it 'ethical' to use 'manipulation' (a lie, e.g., 'Oh, Alex, your boss is on the phone!') to stop them?",
          "options": [
            {
              "id": "A",
              "text": "No. Manipulation is *always* unethical."
            },
            {
              "id": "B",
              "text": "Yes. This is a 'grey area' where a 'dark' tactic (a lie) is used for a 'light' purpose (protection)."
            },
            {
              "id": "C",
              "text": "No. You should just call the police."
            },
            {
              "id": "D",
              "text": "Yes. You should steal Alex's wallet."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! False. This is an aggressive, bad defense. The *best* defense is to *test* them: subtly change your *own* posture. If they follow, you've confirmed the tactic silently.",
            "incorrect": "Incorrect. False. This is an aggressive, bad defense. The *best* defense is to *test* them: subtly change your *own* posture. If they follow, you've confirmed the tactic silently."
          },
          "type": "multiple-choice",
          "question": "The *best* defense against 'Mirroring' (A1-2) is to angrily accuse the person: 'Stop copying me!'",
          "options": [
            {
              "id": "A",
              "text": "True"
            },
            {
              "id": "B",
              "text": "False"
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! This was the lesson of A1-4. The 'Casey' (Guilt) con is 'darker' because it exploits *trust* and *empathy*, which are much more powerful than flattery from a stranger.",
            "incorrect": "Incorrect. This was the lesson of A1-4. The 'Casey' (Guilt) con is 'darker' because it exploits *trust* and *empathy*, which are much more powerful than flattery from a stranger."
          },
          "type": "multiple-choice",
          "question": "The 'Hook' scenarios (Alex and Casey) proved that...",
          "options": [
            {
              "id": "A",
              "text": "You are a bad person."
            },
            {
              "id": "B",
              "text": "Manipulation is most effective when it comes from a *friend* (Casey)."
            },
            {
              "id": "C",
              "text": "Manipulation is most effective when it comes from a *stranger* (Alex)."
            },
            {
              "id": "D",
              "text": "Flattery and Guilt are the *same* tactic."
            }
          ],
          "correctAnswer": "B"
        },
        {
          "feedback": {
            "correct": "Correct! This is a 'synthesis' question. This proves that 'Gaslighting' is an *ancient* tactic. The goal is *always* to destroy your trust in your own mind.",
            "incorrect": "Incorrect. This is a 'synthesis' question. This proves that 'Gaslighting' is an *ancient* tactic. The goal is *always* to destroy your trust in your own mind."
          },
          "type": "multiple-choice",
          "question": "What is the *identical* manipulative goal in both?",
          "options": [
            {
              "id": "A",
              "text": "To make the target doubt their own reality/perception."
            },
            {
              "id": "B",
              "text": "To save money on gas/phone bills."
            },
            {
              "id": "C",
              "text": "To be funny and make a joke."
            },
            {
              "id": "D",
              "text": "To flatter the target."
            }
          ],
          "correctAnswer": "A"
        },
        {
          "feedback": {
            "correct": "Correct! Gauntlet quick-check: This is the core difference. Flattery (ego) 'pulls' you. Guilt (conscience) 'pushes' you.",
            "incorrect": "Incorrect. Gauntlet quick-check: This is the core difference. Flattery (ego) 'pulls' you. Guilt (conscience) 'pushes' you."
          },
          "type": "fill-in-blank",
          "sentence": "Flattery (A1-2) attacks your (--------). Guilt (A1-4) attacks your (--------).",
          "fillInOptions": [
            "ego",
            "conscience",
            "wallet",
            "job"
          ],
          "answers": [
            "ego",
            "conscience"
          ],
          "correctAnswer": "ego",
          "wrongOptions": [
            "wallet",
            "job"
          ]
        },
        {
          "feedback": {
            "correct": "Correct! This is the defense for 'After all I've done for you...'. A 'light' friendship is a *relationship*; a 'dark' one is a *ledger*.",
            "incorrect": "Incorrect. This is the defense for 'After all I've done for you...'. A 'light' friendship is a *relationship*; a 'dark' one is a *ledger*."
          },
          "type": "sentence-building",
          "question": "Arrange the words to make a sentence",
          "words": [
            "is",
            "not",
            "Friendship",
            "a",
            "transaction"
          ],
          "correctSentence": "Friendship is not a transaction"
        },
        {
          "feedback": {
            "correct": "Correct! Correct. You've passed the 'Gauntlet.' Part 3 is the final 'Boss Fight' for Unit 1. Let's see if you can put it all together.",
            "incorrect": "Incorrect. Correct. You've passed the 'Gauntlet.' Part 3 is the final 'Boss Fight' for Unit 1. Let's see if you can put it all together."
          },
          "type": "multiple-choice",
          "question": "You have survived the 'Gauntlet.' What do you expect in Part 3, the 'Final Scenarios'?",
          "options": [
            {
              "id": "A",
              "text": "The final, *hardest* 'Boss Scenarios' that combine *everything* you've learned."
            },
            {
              "id": "B",
              "text": "An easy, 5-question quiz."
            },
            {
              "id": "C",
              "text": "A review of this review."
            },
            {
              "id": "D",
              "text": "New lessons you haven't seen yet."
            }
          ],
          "correctAnswer": "A"
        }
      ],
      "contentScreens": [
        {
          "screenId": "A1-5-P1-S1",
          "screenType": "Learn",
          "title": "Unit 1 Review: The Gauntlet",
          "content": [
            {
              "type": "paragraph",
              "text": "You've been 'hooked' with the Coffee Shop con (Flattery) and the 'Casey' call (Guilt). You've learned the Definitions, History, and Ethics in the 'Bootcamp'."
            },
            {
              "type": "alert",
              "alertType": "warning",
              "text": "It's time to test your knowledge. This is Part 1 of the Unit 1 Review. It will pull questions from *all* previous lessons. Let's see what you've learned."
            }
          ]
        },
        {
          "screenId": "A1-5-P1-S2",
          "screenType": "Exercises",
          "exercises": [
            {
              "exerciseId": "A1-5-P1-E1",
              "type": "matching",
              "question": "Match the core tactic to its definition:",
              "pairs": [
                {
                  "term": "Flattery (A1-2)",
                  "definition": "Using praise to lower the ego's defenses."
                },
                {
                  "term": "Guilt-Trip (A1-4)",
                  "definition": "Attacking the conscience to force compliance."
                },
                {
                  "term": "Reciprocity (A1-1)",
                  "definition": "Giving a small gift to create a sense of 'debt'."
                },
                {
                  "term": "Gaslighting (A1-4)",
                  "definition": "Making someone doubt their own reality/memory."
                },
                {
                  "term": "Mirroring (A1-2)",
                  "definition": "Copying body language to build subconscious rapport."
                }
              ],
              "difficulty": "medium",
              "explanation": "These are the core tactics you've seen in all the 'Hook' scenarios. Naming them is the first step to defense."
            },
            {
              "exerciseId": "A1-5-P1-E2",
              "type": "fill-in",
              "sentence": "The 'Big 3' (from A1-3): ___ is hidden/deceptive. ___ is forced/threats. ___ is transparent/direct.",
              "options": [
                "Manipulation",
                "Coercion",
                "Persuasion",
                "History",
                "Flattery",
                "Guilt"
              ],
              "answers": [
                "Manipulation",
                "Coercion",
                "Persuasion"
              ],
              "difficulty": "medium",
              "explanation": "This is the most important set of definitions in the app. Manipulation (hidden), Coercion (force), Persuasion (transparent)."
            },
            {
              "exerciseId": "A1-5-P1-E3",
              "type": "multiple-choice",
              "question": "From A1-3, who is the historical 'father' of the philosophy 'The end justifies the means'?",
              "options": [
                "Sigmund Freud",
                "Niccolò Machiavelli",
                "Alex from the Coffee Shop",
                "Carl Jung"
              ],
              "correct": "Niccolò Machiavelli",
              "difficulty": "easy",
              "explanation": "Machiavelli's philosophy is the core of a 'dark' mindset: It's okay to lie, cheat, or harm to get what you want."
            },
            {
              "exerciseId": "A1-5-P1-E4",
              "type": "true-false",
              "statement": "From A1-4, the 'Martyr Complex' ('Fine, I'll just walk...') is a form of passive-aggressive guilt-trip.",
              "options": [
                "True",
                "False"
              ],
              "correct": "True",
              "difficulty": "medium",
              "explanation": "Correct. The 'Martyr' plays the 'victim' to make *you* feel overwhelmingly guilty, forcing you into the 'Rescuer' role."
            },
            {
              "exerciseId": "A1-5-P1-E5",
              "type": "scenario",
              "scene": "A co-worker says, 'You're the only one smart enough to fix this. I'm just hopeless.' They are combining Flattery ('smart') with...?",
              "options": [
                "Implied Flattery / Feigned Incompetence",
                "A direct threat (Coercion)",
                "Gaslighting",
                "A genuine compliment"
              ],
              "correct": "Implied Flattery / Feigned Incompetence",
              "difficulty": "medium",
              "explanation": "This 'Implied Flattery' (from A1-2) makes you feel 'superior' and 'helpful,' trapping you into doing their work."
            },
            {
              "exerciseId": "A1-5-P1-E6",
              "type": "scenario",
              "scene": "Your friend 'Casey' (from A1-4) says, 'After all those times I helped you move?!' This is called:",
              "options": [
                "A 'Historical' Guilt-Trip",
                "Flattery",
                "A genuine reminder",
                "Gaslighting"
              ],
              "correct": "A 'Historical' Guilt-Trip",
              "difficulty": "medium",
              "explanation": "This is a 'dark' form of 'Reciprocity.' It turns a past favor into a *weapon* to make you feel you *owe* them compliance."
            },
            {
              "exerciseId": "A1-5-P1-E7",
              "type": "build-sentence",
              "prompt": "Arrange these words into the 'Prime Directive' (from A1-3):",
              "words": [
                "harm",
                "defense,",
                "awareness",
                "to",
                "for",
                "Use",
                "not"
              ],
              "correct": "Use awareness for defense, not to harm",
              "difficulty": "medium",
              "explanation": "This is the 'Ethical Compass' of the entire app. We are building shields, not swords."
            },
            {
              "exerciseId": "A1-5-P1-E8",
              "type": "multiple-choice",
              "question": "What is the 'Halo Effect' (from A1-2)?",
              "options": [
                "The belief that you are an angel.",
                "A cognitive bias where you assume a 'good' trait (like 'nice') means they have *other* 'good' traits (like 'honest').",
                "A form of gaslighting.",
                "A historical propaganda technique."
              ],
              "correct": "A cognitive bias where you assume a 'good' trait (like 'nice') means they have *other* 'good' traits (like 'honest').",
              "difficulty": "medium",
              "explanation": "Flattery *creates* a 'Halo Effect.' Alex seemed 'nice' (from flattery), so you assumed they were also 'trustworthy' (a mistake)."
            },
            {
              "exerciseId": "A1-5-P1-E9",
              "type": "reverse-scenario",
              "answer": "Acknowledge the compliment, but *separate* it from the 'ask'.",
              "question": "This is the primary defense against...?",
              "options": [
                "Gaslighting",
                "A Guilt-Trip",
                "Flattery",
                "Coercion"
              ],
              "correct": "Flattery",
              "difficulty": "medium",
              "explanation": "This is the 'Separate and Judge' method from A1-2. 'Thanks, I appreciate that. But no, I can't do your report.'"
            },
            {
              "exerciseId": "A1-5-P1-E10",
              "type": "reverse-scenario",
              "answer": "Set a clear, firm, but polite boundary.",
              "question": "This is the primary defense against...?",
              "options": [
                "Flattery",
                "A Guilt-Trip",
                "Propaganda",
                "A direct threat"
              ],
              "correct": "A Guilt-Trip",
              "difficulty": "medium",
              "explanation": "This is the 'Boundary' defense from A1-4. 'I can't help you, Casey' stops the guilt-trip from working."
            },
            {
              "exerciseId": "A1-5-P1-E11",
              "type": "true-false",
              "statement": "The 'Dark Triad' (from A1-3) consists of Flattery, Guilt, and Gaslighting.",
              "options": [
                "True",
                "False"
              ],
              "correct": "False",
              "difficulty": "medium",
              "explanation": "False. The 'Dark Triad' refers to *personalities*: Narcissism, Machiavellianism, and Psychopathy. Flattery/Guilt/Gaslighting are the *tactics* they use."
            },
            {
              "exerciseId": "A1-5-P1-E12",
              "type": "ethical-dilemma",
              "situation": "A boss 'implies' that if you don't 'volunteer' for the weekend, you won't be seen as a 'team player' and might miss a promotion.",
              "question": "This is 'grey area' manipulation. It's a combination of a Guilt-Trip and...?",
              "options": [
                "Implied Coercion",
                "Flattery",
                "Gaslighting",
                "Direct Persuasion"
              ],
              "correct": "Implied Coercion",
              "difficulty": "hard",
              "explanation": "This is a 'Boss Scenario' (from A1-3). The 'guilt' ('you're not a team player') is combined with an 'implied threat' (Coercion) to your career. This is a common, 'dark' tactic."
            },
            {
              "exerciseId": "A1-5-P1-E13",
              "type": "case-analysis",
              "caseTitle": "The 'Alex' Con (A1-1) Reviewed",
              "caseDescription": "In the 'Coffee Shop' con, Alex used flattery, mirroring, vulnerability, and a $5 coffee (reciprocity) to get $20.",
              "question": "Which of Machiavelli's philosophies (from A1-3) does this *best* represent?",
              "options": [
                "'The end justifies the means.'",
                "'It is better to be feared than loved.'",
                "'Never attempt to win by force what can be won by deception.'",
                "All of the above."
              ],
              "correct": "All of the above.",
              "difficulty": "hard",
              "explanation": "This is a high-level synthesis. Alex's 'end' ($20) 'justified the means' (deception). Alex *chose* deception (flattery) *over* force (a threat). Alex would make Machiavelli proud."
            },
            {
              "exerciseId": "A1-5-P1-E14",
              "type": "fill-in",
              "sentence": "Flattery attacks the ___. Guilt attacks the ___.",
              "options": [
                "ego",
                "conscience",
                "wallet",
                "job"
              ],
              "answers": [
                "ego",
                "conscience"
              ],
              "difficulty": "medium",
              "explanation": "This is a key review from A1-4. Flattery makes you feel *good* (ego). Guilt makes you feel *bad* (conscience). Both are used to control you."
            },
            {
              "exerciseId": "A1-5-P1-E15",
              "type": "multiple-choice",
              "question": "What is 'Grooming' (from A1-1)?",
              "options": [
                "A one-time insult.",
                "The *entire process* of using 'softeners' (like flattery/rapport) over time to prepare a target for manipulation.",
                "A form of Guilt-Trip.",
                "A way to compliment someone."
              ],
              "correct": "The *entire process* of using 'softeners' (like flattery/rapport) over time to prepare a target for manipulation.",
              "difficulty": "medium",
              "explanation": "The 'Coffee Shop' scenario was a *speed-run* of a 'grooming' script. The manipulator 'grooms' you for the 'ask'."
            },
            {
              "exerciseId": "A1-5-P1-E16",
              "type": "true-false",
              "statement": "The 'Casey' (Guilt-Trip) scenario (A1-4) was 'darker' than the 'Alex' (Flattery) scenario (A1-1) because it came from a trusted friend.",
              "options": [
                "True",
                "False"
              ],
              "correct": "True",
              "difficulty": "medium",
              "explanation": "This is a core concept. Manipulation from *inside* your 'trust circle' (friends, family) is far more dangerous and effective than from a stranger."
            },
            {
              "exerciseId": "A1-5-P1-E17",
              "type": "case-analysis",
              "caseTitle": "The 'Gaslighting' Origin (A1-3)",
              "caseDescription": "The term 'Gaslighting' comes from a 1938 play where a husband dims the gas lights.",
              "question": "Why did he do this?",
              "options": [
                "To save money on gas.",
                "To make his wife *doubt her own senses* and believe she was 'crazy'.",
                "To flatter his wife in the romantic light.",
                "To coerce his wife with the threat of fire."
              ],
              "correct": "To make his wife *doubt her own senses* and believe she was 'crazy'.",
              "difficulty": "medium",
              "explanation": "This is a history *and* definition review. Gaslighting's goal is to *destroy* your trust in your own mind, making you dependent on the manipulator."
            },
            {
              "exerciseId": "A1-5-P1-E18",
              "type": "build-sentence",
              "prompt": "Arrange these words into the 'Guilt' defense (from A1-4):",
              "words": [
                "for",
                "responsible",
                "not",
                "are",
                "You",
                "emotions",
                "others'"
              ],
              "correct": "You are not responsible for others' emotions",
              "difficulty": "medium",
              "explanation": "This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*."
            },
            {
              "exerciseId": "A1-5-P1-E19",
              "type": "multiple-choice",
              "question": "From A1-2, what is the *best* defense when you *suspect* (but aren't sure) someone is using flattery and mirroring?",
              "options": [
                "Accuse them: 'You're manipulating me!'",
                "Give in, just in case they are being nice.",
                "*Test* them: Change your posture (to test the mirror) and ask for specifics (to test the flattery).",
                "Run away."
              ],
              "correct": "*Test* them: Change your posture (to test the mirror) and ask for specifics (to test the flattery).",
              "difficulty": "hard",
              "explanation": "This is the advanced 'testing' defense from A1-2. This is how you *confirm* a tactic without being aggressive."
            },
            {
              "exerciseId": "A1-5-P1-E20",
              "type": "multiple-choice",
              "question": "You have completed Part 1 of the review. What do you expect in Part 2, 'The Gauntlet'?",
              "options": [
                "More, *harder* scenarios combining all these tactics at once.",
                "A review of this review.",
                "An easy, 5-question quiz.",
                "New lessons you haven't seen yet."
              ],
              "correct": "More, *harder* scenarios combining all these tactics at once.",
              "difficulty": "easy",
              "explanation": "Correct. You've reviewed the 'what.' Now you'll be tested on the 'how' in high-speed, complex scenarios. Let's begin Part 2."
            }
          ]
        }
      ],
      "parts": [
        {
          "partNumber": 1,
          "partTitle": "Unit 1 Core Concepts Review",
          "questions": [
            {
              "explanation": "These are the core tactics you've seen in all the 'Hook' scenarios. Naming them is the first step to defense.",
              "type": "matching",
              "question": "Match the core tactic to its definition:",
              "pairs": [
                {
                  "term": "Flattery (A1-2)",
                  "definition": "Using praise to lower the ego's defenses."
                },
                {
                  "term": "Guilt-Trip (A1-4)",
                  "definition": "Attacking the conscience to force compliance."
                },
                {
                  "term": "Reciprocity (A1-1)",
                  "definition": "Giving a small gift to create a sense of 'debt'."
                },
                {
                  "term": "Gaslighting (A1-4)",
                  "definition": "Making someone doubt their own reality/memory."
                },
                {
                  "term": "Mirroring (A1-2)",
                  "definition": "Copying body language to build subconscious rapport."
                }
              ]
            },
            {
              "explanation": "This is the most important set of definitions in the app. Manipulation (hidden), Coercion (force), Persuasion (transparent).",
              "type": "fill-in-blank",
              "sentence": "The 'Big 3' (from A1-3): ___ is hidden/deceptive. ___ is forced/threats. ___ is transparent/direct.",
              "correctAnswer": "Manipulation",
              "wrongOptions": [
                "History",
                "Flattery",
                "Guilt"
              ]
            },
            {
              "explanation": "Machiavelli's philosophy is the core of a 'dark' mindset: It's okay to lie, cheat, or harm to get what you want.",
              "type": "multiple-choice",
              "question": "From A1-3, who is the historical 'father' of the philosophy 'The end justifies the means'?",
              "options": [
                {
                  "id": "A",
                  "text": "Sigmund Freud"
                },
                {
                  "id": "B",
                  "text": "Niccolò Machiavelli"
                },
                {
                  "id": "C",
                  "text": "Alex from the Coffee Shop"
                },
                {
                  "id": "D",
                  "text": "Carl Jung"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "Correct. The 'Martyr' plays the 'victim' to make *you* feel overwhelmingly guilty, forcing you into the 'Rescuer' role.",
              "type": "multiple-choice",
              "question": "From A1-4, the 'Martyr Complex' ('Fine, I'll just walk...') is a form of passive-aggressive guilt-trip.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This 'Implied Flattery' (from A1-2) makes you feel 'superior' and 'helpful,' trapping you into doing their work.",
              "type": "multiple-choice",
              "question": "A co-worker says, 'You're the only one smart enough to fix this. I'm just hopeless.' They are combining Flattery ('smart') with...?\n\nundefined",
              "options": [
                {
                  "id": "A",
                  "text": "Implied Flattery / Feigned Incompetence"
                },
                {
                  "id": "B",
                  "text": "A direct threat (Coercion)"
                },
                {
                  "id": "C",
                  "text": "Gaslighting"
                },
                {
                  "id": "D",
                  "text": "A genuine compliment"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is a 'dark' form of 'Reciprocity.' It turns a past favor into a *weapon* to make you feel you *owe* them compliance.",
              "type": "multiple-choice",
              "question": "Your friend 'Casey' (from A1-4) says, 'After all those times I helped you move?!' This is called:\n\nundefined",
              "options": [
                {
                  "id": "A",
                  "text": "A 'Historical' Guilt-Trip"
                },
                {
                  "id": "B",
                  "text": "Flattery"
                },
                {
                  "id": "C",
                  "text": "A genuine reminder"
                },
                {
                  "id": "D",
                  "text": "Gaslighting"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is the 'Ethical Compass' of the entire app. We are building shields, not swords.",
              "type": "sentence-building",
              "question": "Arrange these words into the 'Prime Directive' (from A1-3):",
              "words": [
                "harm",
                "defense,",
                "awareness",
                "to",
                "for",
                "Use",
                "not"
              ],
              "correctSentence": "Use awareness for defense, not to harm"
            },
            {
              "explanation": "Flattery *creates* a 'Halo Effect.' Alex seemed 'nice' (from flattery), so you assumed they were also 'trustworthy' (a mistake).",
              "type": "multiple-choice",
              "question": "What is the 'Halo Effect' (from A1-2)?",
              "options": [
                {
                  "id": "A",
                  "text": "The belief that you are an angel."
                },
                {
                  "id": "B",
                  "text": "A cognitive bias where you assume a 'good' trait (like 'nice') means they have *other* 'good' traits (like 'honest')."
                },
                {
                  "id": "C",
                  "text": "A form of gaslighting."
                },
                {
                  "id": "D",
                  "text": "A historical propaganda technique."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is the 'Separate and Judge' method from A1-2. 'Thanks, I appreciate that. But no, I can't do your report.'",
              "type": "multiple-choice",
              "question": "This is the primary defense against...?",
              "options": [
                {
                  "id": "A",
                  "text": "Gaslighting"
                },
                {
                  "id": "B",
                  "text": "A Guilt-Trip"
                },
                {
                  "id": "C",
                  "text": "Flattery"
                },
                {
                  "id": "D",
                  "text": "Coercion"
                }
              ],
              "correctAnswer": "C"
            },
            {
              "explanation": "This is the 'Boundary' defense from A1-4. 'I can't help you, Casey' stops the guilt-trip from working.",
              "type": "multiple-choice",
              "question": "This is the primary defense against...?",
              "options": [
                {
                  "id": "A",
                  "text": "Flattery"
                },
                {
                  "id": "B",
                  "text": "A Guilt-Trip"
                },
                {
                  "id": "C",
                  "text": "Propaganda"
                },
                {
                  "id": "D",
                  "text": "A direct threat"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "False. The 'Dark Triad' refers to *personalities*: Narcissism, Machiavellianism, and Psychopathy. Flattery/Guilt/Gaslighting are the *tactics* they use.",
              "type": "multiple-choice",
              "question": "The 'Dark Triad' (from A1-3) consists of Flattery, Guilt, and Gaslighting.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is a 'Boss Scenario' (from A1-3). The 'guilt' ('you're not a team player') is combined with an 'implied threat' (Coercion) to your career. This is a common, 'dark' tactic.",
              "type": "multiple-choice",
              "question": "This is 'grey area' manipulation. It's a combination of a Guilt-Trip and...?",
              "options": [
                {
                  "id": "A",
                  "text": "Implied Coercion"
                },
                {
                  "id": "B",
                  "text": "Flattery"
                },
                {
                  "id": "C",
                  "text": "Gaslighting"
                },
                {
                  "id": "D",
                  "text": "Direct Persuasion"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is a high-level synthesis. Alex's 'end' ($20) 'justified the means' (deception). Alex *chose* deception (flattery) *over* force (a threat). Alex would make Machiavelli proud.",
              "type": "multiple-choice",
              "question": "Which of Machiavelli's philosophies (from A1-3) does this *best* represent?",
              "options": [
                {
                  "id": "A",
                  "text": "'The end justifies the means.'"
                },
                {
                  "id": "B",
                  "text": "'It is better to be feared than loved.'"
                },
                {
                  "id": "C",
                  "text": "'Never attempt to win by force what can be won by deception.'"
                },
                {
                  "id": "D",
                  "text": "All of the above."
                }
              ],
              "correctAnswer": "D"
            },
            {
              "explanation": "This is a key review from A1-4. Flattery makes you feel *good* (ego). Guilt makes you feel *bad* (conscience). Both are used to control you.",
              "type": "fill-in-blank",
              "sentence": "Flattery attacks the ___. Guilt attacks the ___.",
              "correctAnswer": "ego",
              "wrongOptions": [
                "wallet",
                "job"
              ]
            },
            {
              "explanation": "The 'Coffee Shop' scenario was a *speed-run* of a 'grooming' script. The manipulator 'grooms' you for the 'ask'.",
              "type": "multiple-choice",
              "question": "What is 'Grooming' (from A1-1)?",
              "options": [
                {
                  "id": "A",
                  "text": "A one-time insult."
                },
                {
                  "id": "B",
                  "text": "The *entire process* of using 'softeners' (like flattery/rapport) over time to prepare a target for manipulation."
                },
                {
                  "id": "C",
                  "text": "A form of Guilt-Trip."
                },
                {
                  "id": "D",
                  "text": "A way to compliment someone."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is a core concept. Manipulation from *inside* your 'trust circle' (friends, family) is far more dangerous and effective than from a stranger.",
              "type": "multiple-choice",
              "question": "The 'Casey' (Guilt-Trip) scenario (A1-4) was 'darker' than the 'Alex' (Flattery) scenario (A1-1) because it came from a trusted friend.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is a history *and* definition review. Gaslighting's goal is to *destroy* your trust in your own mind, making you dependent on the manipulator.",
              "type": "multiple-choice",
              "question": "Why did he do this?",
              "options": [
                {
                  "id": "A",
                  "text": "To save money on gas."
                },
                {
                  "id": "B",
                  "text": "To make his wife *doubt her own senses* and believe she was 'crazy'."
                },
                {
                  "id": "C",
                  "text": "To flatter his wife in the romantic light."
                },
                {
                  "id": "D",
                  "text": "To coerce his wife with the threat of fire."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*.",
              "type": "sentence-building",
              "question": "Arrange these words into the 'Guilt' defense (from A1-4):",
              "words": [
                "for",
                "responsible",
                "not",
                "are",
                "You",
                "emotions",
                "others'"
              ],
              "correctSentence": "You are not responsible for others' emotions"
            },
            {
              "explanation": "This is the advanced 'testing' defense from A1-2. This is how you *confirm* a tactic without being aggressive.",
              "type": "multiple-choice",
              "question": "From A1-2, what is the *best* defense when you *suspect* (but aren't sure) someone is using flattery and mirroring?",
              "options": [
                {
                  "id": "A",
                  "text": "Accuse them: 'You're manipulating me!'"
                },
                {
                  "id": "B",
                  "text": "Give in, just in case they are being nice."
                },
                {
                  "id": "C",
                  "text": "*Test* them: Change your posture (to test the mirror) and ask for specifics (to test the flattery)."
                },
                {
                  "id": "D",
                  "text": "Run away."
                }
              ],
              "correctAnswer": "C"
            },
            {
              "explanation": "Correct. You've reviewed the 'what.' Now you'll be tested on the 'how' in high-speed, complex scenarios. Let's begin Part 2.",
              "type": "multiple-choice",
              "question": "You have completed Part 1 of the review. What do you expect in Part 2, 'The Gauntlet'?",
              "options": [
                {
                  "id": "A",
                  "text": "More, *harder* scenarios combining all these tactics at once."
                },
                {
                  "id": "B",
                  "text": "A review of this review."
                },
                {
                  "id": "C",
                  "text": "An easy, 5-question quiz."
                },
                {
                  "id": "D",
                  "text": "New lessons you haven't seen yet."
                }
              ],
              "correctAnswer": "A"
            }
          ]
        },
        {
          "partNumber": 2,
          "partTitle": "The 'Gauntlet' - Mixed Review",
          "questions": [
            {
              "explanation": "This is a classic 'praise and punish' script. The Flattery 'pulls you in' (ego), and the Guilt-Trip 'pushes you' (conscience). This is high-level manipulation.",
              "type": "multiple-choice",
              "question": "[Boss Challenge]\nA new manager pulls you aside. 'You're the *only* one here with real vision. You're a star. That's why I'm *so* disappointed you didn't support my new policy in the meeting.'\n\nThis is a 2-hit 'Boss' combo of...?",
              "options": [
                {
                  "id": "A",
                  "text": "Flattery ('star') and a Guilt-Trip ('disappointed')"
                },
                {
                  "id": "B",
                  "text": "Gaslighting and Reciprocity"
                },
                {
                  "id": "C",
                  "text": "Honesty and a Guilt-Trip"
                },
                {
                  "id": "D",
                  "text": "Flattery and a Direct Order"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is a 'Historical Guilt-Trip' (A1-4) combined with a 'Reciprocity Trap' (A1-1). The manipulator *invests* a 'gift' to get a bigger payout.",
              "type": "multiple-choice",
              "question": "[Micro Simulation - Step 1]\nundefined\n\nundefined",
              "options": [
                {
                  "id": "A",
                  "text": "A genuine gift. (Possible, but be aware...)"
                },
                {
                  "id": "B",
                  "text": "A 'Reciprocity Trap' (an unsolicited gift)."
                },
                {
                  "id": "C",
                  "text": "A Guilt-Trip."
                },
                {
                  "id": "D",
                  "text": "Gaslighting."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is a 'Gauntlet' quick-check. Manipulation = Hidden. Coercion = Forced. Persuasion = Transparent.",
              "type": "multiple-choice",
              "question": "Which of the 'Big 3' definitions (A1-3) describes a tactic that is *hidden* and *deceptive*?",
              "options": [
                {
                  "id": "A",
                  "text": "Coercion"
                },
                {
                  "id": "B",
                  "text": "Persuasion"
                },
                {
                  "id": "C",
                  "text": "Manipulation"
                },
                {
                  "id": "D",
                  "text": "History"
                }
              ],
              "correctAnswer": "C"
            },
            {
              "explanation": "Quick-check: False. The Dark Triad is *personalities*: Narcissism, Machiavellianism, Psychopathy. The others are *tactics*.",
              "type": "multiple-choice",
              "question": "The 'Dark Triad' (A1-3) consists of Flattery, Guilt, and Gaslighting.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is a powerful combo. They (1) Deny your reality (Gaslighting) and (2) Reverse the blame (Playing the Victim). You are now 'the attacker'.",
              "type": "multiple-choice",
              "question": "You: 'You keep interrupting me.' Manipulator: 'No, I'm not! I'm just *passionate*! You're being *way* too sensitive. Why are you attacking me?'\n\nThis is a 2-hit combo of 'Denial' and...?",
              "options": [
                {
                  "id": "A",
                  "text": "Gaslighting ('You're... too sensitive') and Playing the Victim ('Why are you attacking me?')."
                },
                {
                  "id": "B",
                  "text": "Flattery and Honesty."
                },
                {
                  "id": "C",
                  "text": "Reciprocity and Guilt."
                },
                {
                  "id": "D",
                  "text": "A genuine misunderstanding."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is a 'Covert' manipulator. Gary *looks* like the hardest worker, but he's using the 'Martyr' (Guilt) and 'Feigned Incompetence' (Flattery) to get *out* of work.",
              "type": "multiple-choice",
              "question": "Gary is using the 'Martyr Complex' (A1-4) to...?",
              "options": [
                {
                  "id": "A",
                  "text": "Genuinely help the team."
                },
                {
                  "id": "B",
                  "text": "Manipulate his boss and co-workers to gain 'victim' status and evade 'real' work."
                },
                {
                  "id": "C",
                  "text": "Show he is a bad employee."
                },
                {
                  "id": "D",
                  "text": "Ask for a raise directly."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "Gauntlet quick-check: This is our 'Ethical Compass.' We are building shields, not swords.",
              "type": "fill-in-blank",
              "sentence": "The 'Prime Directive' (A1-3) of this app is: Use ___ for ___, not to harm.",
              "correctAnswer": "awareness",
              "wrongOptions": [
                "power",
                "friends",
                "guilt",
                "work"
              ]
            },
            {
              "explanation": "Flattery (A1-2) *creates* a 'Halo Effect.' Alex (A1-1) seemed 'nice' (from flattery), so you *assumed* they were 'trustworthy.' This was the trap.",
              "type": "multiple-choice",
              "question": "The 'Halo Effect' (A1-2) is when...",
              "options": [
                {
                  "id": "A",
                  "text": "You see a halo over a manipulator's head."
                },
                {
                  "id": "B",
                  "text": "A manipulator uses a 'Guilt-Trip' to make you feel bad."
                },
                {
                  "id": "C",
                  "text": "A 'good' trait (like 'nice') makes you *assume* they have *other* good traits (like 'honest')."
                },
                {
                  "id": "D",
                  "text": "You assume a 'bad' trait means they are all-bad."
                }
              ],
              "correctAnswer": "C"
            },
            {
              "explanation": "Gauntlet quick-check: This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*.",
              "type": "sentence-building",
              "question": "Arrange these words into the 'Guilt' defense (A1-4):",
              "words": [
                "for",
                "responsible",
                "not",
                "are",
                "You",
                "emotions",
                "others'"
              ],
              "correctSentence": "You are not responsible for others' emotions"
            },
            {
              "explanation": "Correct. 'Boss Scenarios' are not about 'bosses'; they are about *combined tactics* (e.g., Flattery + Guilt + Gaslighting).",
              "type": "multiple-choice",
              "question": "The 'Coffee Shop' (A1-1) and 'Guilt-Trip' (A1-4) scenarios are both 'Boss Scenarios' because they combine multiple tactics.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "Gauntlet quick-check: This is the 'Separate and Judge' method from A1-2. 'Thanks, but no.'",
              "type": "multiple-choice",
              "question": "This is the primary defense against...?",
              "options": [
                {
                  "id": "A",
                  "text": "Gaslighting"
                },
                {
                  "id": "B",
                  "text": "A Guilt-Trip"
                },
                {
                  "id": "C",
                  "text": "Flattery"
                },
                {
                  "id": "D",
                  "text": "Coercion"
                }
              ],
              "correctAnswer": "C"
            },
            {
              "explanation": "Gauntlet quick-check: This is the 'Boundary' defense from A1-4. 'I can't help you' stops the guilt-trip.",
              "type": "multiple-choice",
              "question": "This is the primary defense against...?",
              "options": [
                {
                  "id": "A",
                  "text": "Flattery"
                },
                {
                  "id": "B",
                  "text": "A Guilt-Trip"
                },
                {
                  "id": "C",
                  "text": "Propaganda"
                },
                {
                  "id": "D",
                  "text": "A direct threat"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This (and 'Pacing') are 'rapport' tactics. They make you *feel* 'like' the manipulator, bypassing your logic.",
              "type": "multiple-choice",
              "question": "What is 'Mirroring' (A1-2)?",
              "options": [
                {
                  "id": "A",
                  "text": "Looking at yourself in a mirror."
                },
                {
                  "id": "B",
                  "text": "A 'dark' tactic of copying a person's posture/gestures to build subconscious rapport."
                },
                {
                  "id": "C",
                  "text": "A 'light' tactic of telling the truth."
                },
                {
                  "id": "D",
                  "text": "A form of Gaslighting."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "The 'dark' path is to *beat the manipulator at their own game*. The 'light' path (from A1-3) is to refuse to play and win with *transparent* value. This app teaches the 'light' path.",
              "type": "multiple-choice",
              "question": "What is the *most* Machiavellian (and 'dark') response?",
              "options": [
                {
                  "id": "A",
                  "text": "Use the *same* tactics, but do them better."
                },
                {
                  "id": "B",
                  "text": "Focus on your own *work and results* (the 'light' path)."
                },
                {
                  "id": "C",
                  "text": "Loudly accuse them of being a manipulator."
                },
                {
                  "id": "D",
                  "text": "Quit the job."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is the 'dark' philosophy. Machiavelli saw ethics/morality as 'weakness' that got in the way of 'winning'. We are learning to see it as 'strength'.",
              "type": "multiple-choice",
              "question": "The historical figure Machiavelli (A1-3) would say you are 'weak' if you *don't* use manipulation to get what you want.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is a 'Boss Scenario' of Manipulation (Guilt) + Coercion (Threat). The *threat* is the removal of 'love' or 'status' in the family. It's a 'dark' ultimatum.",
              "type": "multiple-choice",
              "question": "A family member says, 'If you *really* loved this family, you wouldn't move to a new city for that job.'\n\nThis is a 2-hit combo of a 'Guilt-Trip' (A1-4) and...?",
              "options": [
                {
                  "id": "A",
                  "text": "Coercion (an emotional threat/ultimatum)."
                },
                {
                  "id": "B",
                  "text": "Flattery (praising the family)."
                },
                {
                  "id": "C",
                  "text": "Gaslighting (denying your reality)."
                },
                {
                  "id": "D",
                  "text": "A genuine expression of sadness."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is the 'Drama Triangle' (which we'll cover later). They play the 'Victim' to force you to be the 'Rescuer.' The only winning move is to *refuse* the role.",
              "type": "fill-in-blank",
              "sentence": "The 'Martyr Complex' (A1-4) ('I'll just walk...') forces you into the '___' role.",
              "correctAnswer": "Rescuer",
              "wrongOptions": [
                "Villain",
                "Hero",
                "Victim"
              ]
            },
            {
              "explanation": "This is a 'dark' script. (1) They deny your reality ('It was a joke') and (2) They make *you* the problem ('You're too serious'). You are now 'wrong' for having feelings.",
              "type": "multiple-choice",
              "question": "This is a 2-hit 'Gaslighting' combo. 'I'm just kidding' (Denial) and...?",
              "options": [
                {
                  "id": "A",
                  "text": "'You're... so serious' (Blame-Shifting / Attacking your character)."
                },
                {
                  "id": "B",
                  "text": "A genuine apology."
                },
                {
                  "id": "C",
                  "text": "Flattery."
                },
                {
                  "id": "D",
                  "text": "A 'Historical' Guilt-Trip."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is a myth. Many manipulators are 'covert' (hidden). They seem charming, friendly, and kind. The 'Coffee Shop' (A1-1) is proof. The 'charm' is the *mask*.",
              "type": "multiple-choice",
              "question": "The 'Dark Triad' (A1-3) traits (Narcissism, Machiavellianism, Psychopathy) are *always* easy to spot.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is a 'Bootcamp' (A1-3) review. Alex's actions weren't about *ego*; they were about *profit*. The flattery was a *tool*. 'The end justifies the means.' This is Machiavellianism.",
              "type": "multiple-choice",
              "question": "The 'Coffee Shop' (A1-1) con-artist 'Alex' *best* represents which 'Dark Triad' trait?",
              "options": [
                {
                  "id": "A",
                  "text": "Narcissism (needed admiration and flattery)"
                },
                {
                  "id": "B",
                  "text": "Machiavellianism (used a cold, calculated script to get a goal: $20)"
                },
                {
                  "id": "C",
                  "text": "Psychopathy (showed a total lack of fear)"
                },
                {
                  "id": "D",
                  "text": "Empathy (was genuinely lonely)"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "Gauntlet quick-check: This is the 'Golden Rule' of flattery defense.",
              "type": "sentence-building",
              "question": "Arrange these words into the 'Flattery' defense (A1-2):",
              "words": [
                "the",
                "flattery",
                "and",
                "the",
                "Separate",
                "'ask.'"
              ],
              "correctSentence": "Separate the flattery and the 'ask.'"
            },
            {
              "explanation": "This is the 'Golden Rule' from A1-3. You must always ask: What is the *true intent* behind these words? Is it to help, or to control?",
              "type": "multiple-choice",
              "question": "What is the 'Prime Directive' of this app's philosophy? (A1-3)",
              "options": [
                {
                  "id": "A",
                  "text": "The end justifies the means."
                },
                {
                  "id": "B",
                  "text": "Intent is the language of Dark Psychology."
                },
                {
                  "id": "C",
                  "text": "Do whatever it takes to win."
                },
                {
                  "id": "D",
                  "text": "Trust no one."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is a *huge* red flag. They (1) Flatter you (Love Bombing), (2) Play the Victim ('my ex is crazy'), and (3) Gaslight the ex ('they are the problem'). You're being 'groomed' to take their side.",
              "type": "multiple-choice",
              "question": "[Boss Challenge]\nA date: 'You are *perfect* (Love Bombing). I've never met anyone like you. That's why I know you'll understand... my ex is *crazy* and *always* texting me, you *have* to believe me, they are the problem!'\n\nThis is a 'Boss Scenario' combining 'Love Bombing' (A1-2 Flattery) with...?",
              "options": [
                {
                  "id": "A",
                  "text": "Gaslighting (denying their ex's reality) and Playing the Victim."
                },
                {
                  "id": "B",
                  "text": "Honesty and Trust."
                },
                {
                  "id": "C",
                  "text": "Guilt-Tripping you."
                },
                {
                  "id": "D",
                  "text": "Reciprocity (they bought you dinner)."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is the final 'Ethics' test from A1-3. The 'Prime Directive' is 'Do No Harm.' Using a 'white lie' (manipulation) to *prevent* harm (the scam) is a high-level, 'light' side choice.",
              "type": "multiple-choice",
              "question": "Is it 'ethical' to use 'manipulation' (a lie, e.g., 'Oh, Alex, your boss is on the phone!') to stop them?",
              "options": [
                {
                  "id": "A",
                  "text": "No. Manipulation is *always* unethical."
                },
                {
                  "id": "B",
                  "text": "Yes. This is a 'grey area' where a 'dark' tactic (a lie) is used for a 'light' purpose (protection)."
                },
                {
                  "id": "C",
                  "text": "No. You should just call the police."
                },
                {
                  "id": "D",
                  "text": "Yes. You should steal Alex's wallet."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "False. This is an aggressive, bad defense. The *best* defense is to *test* them: subtly change your *own* posture. If they follow, you've confirmed the tactic silently.",
              "type": "multiple-choice",
              "question": "The *best* defense against 'Mirroring' (A1-2) is to angrily accuse the person: 'Stop copying me!'",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This was the lesson of A1-4. The 'Casey' (Guilt) con is 'darker' because it exploits *trust* and *empathy*, which are much more powerful than flattery from a stranger.",
              "type": "multiple-choice",
              "question": "The 'Hook' scenarios (Alex and Casey) proved that...",
              "options": [
                {
                  "id": "A",
                  "text": "You are a bad person."
                },
                {
                  "id": "B",
                  "text": "Manipulation is most effective when it comes from a *friend* (Casey)."
                },
                {
                  "id": "C",
                  "text": "Manipulation is most effective when it comes from a *stranger* (Alex)."
                },
                {
                  "id": "D",
                  "text": "Flattery and Guilt are the *same* tactic."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is a 'synthesis' question. This proves that 'Gaslighting' is an *ancient* tactic. The goal is *always* to destroy your trust in your own mind.",
              "type": "multiple-choice",
              "question": "What is the *identical* manipulative goal in both?",
              "options": [
                {
                  "id": "A",
                  "text": "To make the target doubt their own reality/perception."
                },
                {
                  "id": "B",
                  "text": "To save money on gas/phone bills."
                },
                {
                  "id": "C",
                  "text": "To be funny and make a joke."
                },
                {
                  "id": "D",
                  "text": "To flatter the target."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "Gauntlet quick-check: This is the core difference. Flattery (ego) 'pulls' you. Guilt (conscience) 'pushes' you.",
              "type": "fill-in-blank",
              "sentence": "Flattery (A1-2) attacks your ___. Guilt (A1-4) attacks your ___.",
              "correctAnswer": "ego",
              "wrongOptions": [
                "wallet",
                "job"
              ]
            },
            {
              "explanation": "This is the defense for 'After all I've done for you...'. A 'light' friendship is a *relationship*; a 'dark' one is a *ledger*.",
              "type": "sentence-building",
              "question": "Arrange these words into the *defense* for 'Historical Guilt' (A1-4):",
              "words": [
                "is",
                "not",
                "Friendship",
                "a",
                "transaction"
              ],
              "correctSentence": "Friendship is not a transaction"
            },
            {
              "explanation": "Correct. You've passed the 'Gauntlet.' Part 3 is the final 'Boss Fight' for Unit 1. Let's see if you can put it all together.",
              "type": "multiple-choice",
              "question": "You have survived the 'Gauntlet.' What do you expect in Part 3, the 'Final Scenarios'?",
              "options": [
                {
                  "id": "A",
                  "text": "The final, *hardest* 'Boss Scenarios' that combine *everything* you've learned."
                },
                {
                  "id": "B",
                  "text": "An easy, 5-question quiz."
                },
                {
                  "id": "C",
                  "text": "A review of this review."
                },
                {
                  "id": "D",
                  "text": "New lessons you haven't seen yet."
                }
              ],
              "correctAnswer": "A"
            }
          ]
        },
        {
          "partNumber": 3,
          "partTitle": "Challenge: Final Scenarios",
          "questions": [
            {
              "explanation": "This is the 'Full House.' (1) Flattery ('trust'), (2) Guilt ('hurt'), (3) Gaslighting ('you always doubt me'). This is a 10/10 manipulation.",
              "type": "multiple-choice",
              "question": "[Boss Challenge]\nA family member: 'You're the only one I can *trust* (Flattery). You're so good at this... which is why I'm *so hurt* you won't 'loan' me money for my 'business idea' (Guilt). You *always* doubt me!' (Gaslighting)\n\nWhat is this 3-hit 'Boss' combo?",
              "options": [
                {
                  "id": "A",
                  "text": "Flattery + Guilt-Trip + Gaslighting"
                },
                {
                  "id": "B",
                  "text": "Flattery + Reciprocity + Honesty"
                },
                {
                  "id": "C",
                  "text": "Guilt-Trip + Gaslighting + A Direct Request"
                },
                {
                  "id": "D",
                  "text": "Gaslighting + Flattery + A Genuine Complaint"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is the 'Coffee Shop Rematch.' You've used the 'Acknowledge & Pivot' and 'Settle the Debt' defenses to win.",
              "type": "multiple-choice",
              "question": "[Micro Simulation - Step 1]\nundefined\n\nundefined",
              "options": [
                {
                  "id": "A",
                  "text": "'Stop flattering me, you con-artist!' (Aggressive)"
                },
                {
                  "id": "B",
                  "text": "'Wow, thank you so much! I am!' (You are trapped)"
                },
                {
                  "id": "C",
                  "text": "'Thanks. What's on your mind?' (Acknowledge & Pivot)"
                },
                {
                  "id": "D",
                  "text": "'I'm not creative at all.' (Defensive)"
                }
              ],
              "correctAnswer": "C"
            },
            {
              "explanation": "This is the 'Casey Rematch.' You've used a 'Boundary' and 'Named the Tactic' to win.",
              "type": "multiple-choice",
              "question": "[Micro Simulation - Step 1]\nundefined\n\nundefined",
              "options": [
                {
                  "id": "A",
                  "text": "'You're right, it is. Bye.' (Aggressive)"
                },
                {
                  "id": "B",
                  "text": "'Oh no, it's not! I'll come over!' (You are trapped)"
                },
                {
                  "id": "C",
                  "text": "'You're trying to guilt-trip me!' (Accusatory)"
                },
                {
                  "id": "D",
                  "text": "'Casey, that's not fair. I want to see the movie, but I'm happy to help *tomorrow*. What's *really* going on?'"
                }
              ],
              "correctAnswer": "D"
            },
            {
              "explanation": "This is Machiavellianism (A1-3). The politician is using 'dark' tactics (Fear, Flattery, Gaslighting) as *tools*. The 'end' (winning the election) 'justifies the means' (dividing the nation).",
              "type": "multiple-choice",
              "question": "This is a form of mass-scale 'Propaganda' (A1-3). This politician is *acting* like...?",
              "options": [
                {
                  "id": "A",
                  "text": "A Machiavellian (using fear/division as a *tool* to win power)."
                },
                {
                  "id": "B",
                  "text": "An Empath (sharing real feelings)."
                },
                {
                  "id": "C",
                  "text": "A 'Light' Leader (being honest)."
                },
                {
                  "id": "D",
                  "text": "A 'Rescuer' (trying to help)."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "Final definition check. Persuasion is 'light' because it's *transparent* and respects your *choice*.",
              "type": "multiple-choice",
              "question": "Which of the 'Big 3' (A1-3) is *always* the most 'ethical' and 'light'?",
              "options": [
                {
                  "id": "A",
                  "text": "Manipulation (hidden)"
                },
                {
                  "id": "B",
                  "text": "Coercion (forced)"
                },
                {
                  "id": "C",
                  "text": "Persuasion (transparent)"
                },
                {
                  "id": "D",
                  "text": "None of them."
                }
              ],
              "correctAnswer": "C"
            },
            {
              "explanation": "False. That is the *Machiavellian* creed. Our 'Prime Directive' is 'Do No Harm. Use awareness for *defense*.'",
              "type": "multiple-choice",
              "question": "The 'Prime Directive' (A1-3) means: 'It is okay to use 'dark' tactics, as long as you *win*.'",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "Final check. Flattery 'pulls' (ego). Guilt 'pushes' (conscience).",
              "type": "fill-in-blank",
              "sentence": "Flattery (A1-2) attacks the ___. Guilt (A1-4) attacks the ___.",
              "correctAnswer": "ego",
              "wrongOptions": [
                "wallet",
                "job"
              ]
            },
            {
              "explanation": "Final check. This is the 'Golden Rule' of flattery defense.",
              "type": "sentence-building",
              "question": "Arrange these words into the 'Flattery' defense (A1-2):",
              "words": [
                "the",
                "flattery",
                "and",
                "the",
                "Separate",
                "'ask.'"
              ],
              "correctSentence": "Separate the flattery and the 'ask.'"
            },
            {
              "explanation": "Final check. This is the 'Golden Rule' of emotional defense.",
              "type": "sentence-building",
              "question": "Arrange these words into the 'Guilt' defense (A1-4):",
              "words": [
                "for",
                "responsible",
                "not",
                "are",
                "You",
                "emotions",
                "others'"
              ],
              "correctSentence": "You are not responsible for others' emotions"
            },
            {
              "explanation": "Final check. Gaslighting's goal is to *destroy your reality*.",
              "type": "multiple-choice",
              "question": "The term 'Gaslighting' (A1-3/A1-4) comes from a play where a man tries to make his wife believe she is...?",
              "options": [
                {
                  "id": "A",
                  "text": "A genius"
                },
                {
                  "id": "B",
                  "text": "Insane / Crazy"
                },
                {
                  "id": "C",
                  "text": "A good friend"
                },
                {
                  "id": "D",
                  "text": "Wealthy"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "Final check. False. It is *personalities*: Narcissism, Machiavellianism, Psychopathy.",
              "type": "multiple-choice",
              "question": "The 'Dark Triad' (A1-3) consists of Flattery, Guilt, and Gaslighting.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is the 'Mastery' defense. (1) Break the Mirror (non-verbal), (2) Name the Tactic ('not fair'), (3) Reject the Gaslight ('not true'), (4) State the Boundary ('I can't help').",
              "type": "multiple-choice",
              "question": "[Boss Challenge]\nA 'friend' is mirroring your posture. 'You are *so* smart (Flattery). That's why I'm *crushed* you won't help me... *after all I've done for you* (Guilt). You must just be *imagining* I was ever a good friend!' (Gaslighting)\n\nWhat is the *strongest* defense against this 4-hit 'Boss' combo?",
              "options": [
                {
                  "id": "A",
                  "text": "Give in immediately. (You lose)"
                },
                {
                  "id": "B",
                  "text": "(Subtly change posture, breaking the mirror) 'That's not fair, and it's not true. I can't help you, but I'm not a bad friend.'"
                },
                {
                  "id": "C",
                  "text": "Start crying. (You lose)"
                },
                {
                  "id": "D",
                  "text": "Accuse them: 'You're a gaslighting, guilt-tripping narcissist!'"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "Flattery (A1-2) *creates* a 'Halo Effect.' Alex (A1-1) seemed 'nice' (from flattery), so you *assumed* they were 'trustworthy.' This was the trap.",
              "type": "multiple-choice",
              "question": "What is the 'Halo Effect' (A1-2)?",
              "options": [
                {
                  "id": "A",
                  "text": "A 'good' trait (like 'nice') makes you *assume* other 'good' traits (like 'honest')."
                },
                {
                  "id": "B",
                  "text": "A 'bad' trait makes you assume other 'bad' traits."
                },
                {
                  "id": "C",
                  "text": "A 'guilt-trip' about religion."
                },
                {
                  "id": "D",
                  "text": "A tactic used by 'Alex' in A1-1."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "explanation": "This is the 'Light' path. 'Rapport' is a normal social skill. It only becomes 'dark' when the *intent* is *hidden* and *exploitative*.",
              "type": "multiple-choice",
              "question": "When is it 'ethically' okay to use these 'rapport' skills?",
              "options": [
                {
                  "id": "A",
                  "text": "To *deceive* a date into liking you (Dark)."
                },
                {
                  "id": "B",
                  "text": "To *transparently* build a *real* connection (Light)."
                },
                {
                  "id": "C",
                  "text": "To *trick* your boss into giving you a raise (Dark)."
                },
                {
                  "id": "D",
                  "text": "It is *never* ethical to use these skills."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is the 'Drama Triangle' from A1-4. The 'Martyr' (Victim) *forces* you to be the 'Persecutor' ('You're letting me walk!'). You can only 'escape' by becoming the 'Rescuer' ('I'm coming!').",
              "type": "multiple-choice",
              "question": "What is the *goal* of the 'Martyr'?",
              "options": [
                {
                  "id": "A",
                  "text": "To make you feel like the 'Persecutor' (the 'bad guy')."
                },
                {
                  "id": "B",
                  "text": "To make you feel like the 'Rescuer' (the 'good guy')."
                },
                {
                  "id": "C",
                  "text": "Both A and B. They make you the 'bad guy' *until* you become the 'RescEuer'."
                },
                {
                  "id": "D",
                  "text": "To genuinely go for a walk."
                }
              ],
              "correctAnswer": "C"
            },
            {
              "explanation": "This is a 'dark' 'Rescuer' mentality. The 'light' path is to *respect* autonomy. You can *offer* help (Persuasion), but you cannot *force* it (Coercion/Manipulation).",
              "type": "multiple-choice",
              "question": "The 'Prime Directive' (A1-3) means: 'It is okay to use manipulation to 'help' someone, even if they don't want it.'",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is the 'Mastery' defense. It's 'covert' (hidden). You *test* them without being aggressive. If they follow, you've confirmed the tactic.",
              "type": "multiple-choice",
              "question": "What is the *best* 'test' if you suspect 'Mirroring' (A1-2)?",
              "options": [
                {
                  "id": "A",
                  "text": "Accuse them: 'Stop copying me!'"
                },
                {
                  "id": "B",
                  "text": "Subtly change your *own* posture and see if they *follow*."
                },
                {
                  "id": "C",
                  "text": "Copy *them* to see if they notice."
                },
                {
                  "id": "D",
                  "text": "Say nothing and leave."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is 'Flipping the Script.' You came with a valid complaint, and you *left* feeling guilty for 'attacking' a 'sad' person. This is a 10/10 defensive manipulation.",
              "type": "multiple-choice",
              "question": "Why is this 'Gaslight/Victim' combo so effective?",
              "options": [
                {
                  "id": "A",
                  "text": "Because it's true."
                },
                {
                  "id": "B",
                  "text": "Because it makes *you* the 'attacker' and *them* the 'victim'."
                },
                {
                  "id": "C",
                  "text": "Because it is very funny."
                },
                {
                  "id": "D",
                  "text": "Because it is a form of flattery."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "This is the 'Mastery' insight. 'Rapport' is a tool. 'Flattery' is a tool. 'Guilt' is a tool. The 'intent' (A1-3) is what defines them as 'dark' or 'light'.",
              "type": "multiple-choice",
              "question": "What is the 'ethically-aware' takeaway from Unit 1?",
              "options": [
                {
                  "id": "A",
                  "text": "That *everyone* is a 'dark' manipulator and no one can be trusted."
                },
                {
                  "id": "B",
                  "text": "That these tactics are 'tools.' The *intent* (to help vs. to harm) is what makes them 'dark' or 'light'."
                },
                {
                  "id": "C",
                  "text": "That you are now a 'master' and can't be manipulated."
                },
                {
                  "id": "D",
                  "text": "That you should use these tactics to get what you want."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "explanation": "Congratulations. You have mastered the 'Foundations.' It's time to move on to the 'core' tactics in Unit 2, starting with the most famous 'Dark Triad' trait: Narcissism.",
              "type": "multiple-choice",
              "question": "You have earned the 'Unit 1 Mastery Badge.' What is the next logical step?",
              "options": [
                {
                  "id": "A",
                  "text": "Lesson A2-1: (Start the next Unit)"
                },
                {
                  "id": "B",
                  "text": "Restart Unit 1."
                },
                {
                  "id": "C",
                  "text": "Quit the app."
                },
                {
                  "id": "D",
                  "text": "This is the end of the app."
                }
              ],
              "correctAnswer": "A"
            }
          ]
        },
        {
          "partNumber": 2,
          "partTitle": "The 'Gauntlet' - Mixed Review",
          "questions": [
            {
              "feedback": {
                "correct": "Correct! This is a classic 'praise and punish' script. The Flattery 'pulls you in' (ego), and the Guilt-Trip 'pushes you' (conscience). This is high-level manipulation.",
                "incorrect": "Incorrect. This is a classic 'praise and punish' script. The Flattery 'pulls you in' (ego), and the Guilt-Trip 'pushes you' (conscience). This is high-level manipulation."
              },
              "type": "multiple-choice",
              "question": "[Boss Challenge]\nA new manager pulls you aside. 'You're the *only* one here with real vision. You're a star. That's why I'm *so* disappointed you didn't support my new policy in the meeting.'\n\nThis is a 2-hit 'Boss' combo of...?",
              "options": [
                {
                  "id": "A",
                  "text": "Flattery ('star') and a Guilt-Trip ('disappointed')"
                },
                {
                  "id": "B",
                  "text": "Gaslighting and Reciprocity"
                },
                {
                  "id": "C",
                  "text": "Honesty and a Guilt-Trip"
                },
                {
                  "id": "D",
                  "text": "Flattery and a Direct Order"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! This is a 'Historical Guilt-Trip' (A1-4) combined with a 'Reciprocity Trap' (A1-1). The manipulator *invests* a 'gift' to get a bigger payout.",
                "incorrect": "Incorrect. This is a 'Historical Guilt-Trip' (A1-4) combined with a 'Reciprocity Trap' (A1-1). The manipulator *invests* a 'gift' to get a bigger payout."
              },
              "type": "multiple-choice",
              "question": "[Micro Simulation - Step 1]\nundefined\n\nundefined",
              "options": [
                {
                  "id": "A",
                  "text": "A genuine gift. (Possible, but be aware...)"
                },
                {
                  "id": "B",
                  "text": "A 'Reciprocity Trap' (an unsolicited gift)."
                },
                {
                  "id": "C",
                  "text": "A Guilt-Trip."
                },
                {
                  "id": "D",
                  "text": "Gaslighting."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! This is a 'Gauntlet' quick-check. Manipulation = Hidden. Coercion = Forced. Persuasion = Transparent.",
                "incorrect": "Incorrect. This is a 'Gauntlet' quick-check. Manipulation = Hidden. Coercion = Forced. Persuasion = Transparent."
              },
              "type": "multiple-choice",
              "question": "Which of the 'Big 3' definitions (A1-3) describes a tactic that is *hidden* and *deceptive*?",
              "options": [
                {
                  "id": "A",
                  "text": "Coercion"
                },
                {
                  "id": "B",
                  "text": "Persuasion"
                },
                {
                  "id": "C",
                  "text": "Manipulation"
                },
                {
                  "id": "D",
                  "text": "History"
                }
              ],
              "correctAnswer": "C"
            },
            {
              "feedback": {
                "correct": "Correct! Quick-check: False. The Dark Triad is *personalities*: Narcissism, Machiavellianism, Psychopathy. The others are *tactics*.",
                "incorrect": "Incorrect. Quick-check: False. The Dark Triad is *personalities*: Narcissism, Machiavellianism, Psychopathy. The others are *tactics*."
              },
              "type": "multiple-choice",
              "question": "The 'Dark Triad' (A1-3) consists of Flattery, Guilt, and Gaslighting.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! This is a powerful combo. They (1) Deny your reality (Gaslighting) and (2) Reverse the blame (Playing the Victim). You are now 'the attacker'.",
                "incorrect": "Incorrect. This is a powerful combo. They (1) Deny your reality (Gaslighting) and (2) Reverse the blame (Playing the Victim). You are now 'the attacker'."
              },
              "type": "multiple-choice",
              "question": "You: 'You keep interrupting me.' Manipulator: 'No, I'm not! I'm just *passionate*! You're being *way* too sensitive. Why are you attacking me?'\n\nThis is a 2-hit combo of 'Denial' and...?",
              "options": [
                {
                  "id": "A",
                  "text": "Gaslighting ('You're... too sensitive') and Playing the Victim ('Why are you attacking me?')."
                },
                {
                  "id": "B",
                  "text": "Flattery and Honesty."
                },
                {
                  "id": "C",
                  "text": "Reciprocity and Guilt."
                },
                {
                  "id": "D",
                  "text": "A genuine misunderstanding."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! This is a 'Covert' manipulator. Gary *looks* like the hardest worker, but he's using the 'Martyr' (Guilt) and 'Feigned Incompetence' (Flattery) to get *out* of work.",
                "incorrect": "Incorrect. This is a 'Covert' manipulator. Gary *looks* like the hardest worker, but he's using the 'Martyr' (Guilt) and 'Feigned Incompetence' (Flattery) to get *out* of work."
              },
              "type": "multiple-choice",
              "question": "Gary is using the 'Martyr Complex' (A1-4) to...?",
              "options": [
                {
                  "id": "A",
                  "text": "Genuinely help the team."
                },
                {
                  "id": "B",
                  "text": "Manipulate his boss and co-workers to gain 'victim' status and evade 'real' work."
                },
                {
                  "id": "C",
                  "text": "Show he is a bad employee."
                },
                {
                  "id": "D",
                  "text": "Ask for a raise directly."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! Gauntlet quick-check: This is our 'Ethical Compass.' We are building shields, not swords.",
                "incorrect": "Incorrect. Gauntlet quick-check: This is our 'Ethical Compass.' We are building shields, not swords."
              },
              "type": "fill-in-blank",
              "sentence": "The 'Prime Directive' (A1-3) of this app is: Use (--------) for (--------), not to harm.",
              "fillInOptions": [
                "awareness",
                "defense",
                "power",
                "friends",
                "guilt",
                "work"
              ],
              "answers": [
                "awareness",
                "defense"
              ],
              "correctAnswer": "awareness",
              "wrongOptions": [
                "power",
                "friends",
                "guilt",
                "work"
              ]
            },
            {
              "feedback": {
                "correct": "Correct! Flattery (A1-2) *creates* a 'Halo Effect.' Alex (A1-1) seemed 'nice' (from flattery), so you *assumed* they were 'trustworthy.' This was the trap.",
                "incorrect": "Incorrect. Flattery (A1-2) *creates* a 'Halo Effect.' Alex (A1-1) seemed 'nice' (from flattery), so you *assumed* they were 'trustworthy.' This was the trap."
              },
              "type": "multiple-choice",
              "question": "The 'Halo Effect' (A1-2) is when...",
              "options": [
                {
                  "id": "A",
                  "text": "You see a halo over a manipulator's head."
                },
                {
                  "id": "B",
                  "text": "A manipulator uses a 'Guilt-Trip' to make you feel bad."
                },
                {
                  "id": "C",
                  "text": "A 'good' trait (like 'nice') makes you *assume* they have *other* good traits (like 'honest')."
                },
                {
                  "id": "D",
                  "text": "You assume a 'bad' trait means they are all-bad."
                }
              ],
              "correctAnswer": "C"
            },
            {
              "feedback": {
                "correct": "Correct! Gauntlet quick-check: This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*.",
                "incorrect": "Incorrect. Gauntlet quick-check: This is the 'Golden Rule' of emotional defense. You are responsible for your *actions*, not their *feelings*."
              },
              "type": "sentence-building",
              "question": "Arrange the words to make a sentence",
              "words": [
                "for",
                "responsible",
                "not",
                "are",
                "You",
                "emotions",
                "others'"
              ],
              "correctSentence": "You are not responsible for others' emotions"
            },
            {
              "feedback": {
                "correct": "Correct! Correct. 'Boss Scenarios' are not about 'bosses'; they are about *combined tactics* (e.g., Flattery + Guilt + Gaslighting).",
                "incorrect": "Incorrect. Correct. 'Boss Scenarios' are not about 'bosses'; they are about *combined tactics* (e.g., Flattery + Guilt + Gaslighting)."
              },
              "type": "multiple-choice",
              "question": "The 'Coffee Shop' (A1-1) and 'Guilt-Trip' (A1-4) scenarios are both 'Boss Scenarios' because they combine multiple tactics.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! Gauntlet quick-check: This is the 'Separate and Judge' method from A1-2. 'Thanks, but no.'",
                "incorrect": "Incorrect. Gauntlet quick-check: This is the 'Separate and Judge' method from A1-2. 'Thanks, but no.'"
              },
              "type": "multiple-choice",
              "question": "This is the primary defense against...?",
              "options": [
                {
                  "id": "A",
                  "text": "Gaslighting"
                },
                {
                  "id": "B",
                  "text": "A Guilt-Trip"
                },
                {
                  "id": "C",
                  "text": "Flattery"
                },
                {
                  "id": "D",
                  "text": "Coercion"
                }
              ],
              "correctAnswer": "C"
            },
            {
              "feedback": {
                "correct": "Correct! Gauntlet quick-check: This is the 'Boundary' defense from A1-4. 'I can't help you' stops the guilt-trip.",
                "incorrect": "Incorrect. Gauntlet quick-check: This is the 'Boundary' defense from A1-4. 'I can't help you' stops the guilt-trip."
              },
              "type": "multiple-choice",
              "question": "This is the primary defense against...?",
              "options": [
                {
                  "id": "A",
                  "text": "Flattery"
                },
                {
                  "id": "B",
                  "text": "A Guilt-Trip"
                },
                {
                  "id": "C",
                  "text": "Propaganda"
                },
                {
                  "id": "D",
                  "text": "A direct threat"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! This (and 'Pacing') are 'rapport' tactics. They make you *feel* 'like' the manipulator, bypassing your logic.",
                "incorrect": "Incorrect. This (and 'Pacing') are 'rapport' tactics. They make you *feel* 'like' the manipulator, bypassing your logic."
              },
              "type": "multiple-choice",
              "question": "What is 'Mirroring' (A1-2)?",
              "options": [
                {
                  "id": "A",
                  "text": "Looking at yourself in a mirror."
                },
                {
                  "id": "B",
                  "text": "A 'dark' tactic of copying a person's posture/gestures to build subconscious rapport."
                },
                {
                  "id": "C",
                  "text": "A 'light' tactic of telling the truth."
                },
                {
                  "id": "D",
                  "text": "A form of Gaslighting."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! The 'dark' path is to *beat the manipulator at their own game*. The 'light' path (from A1-3) is to refuse to play and win with *transparent* value. This app teaches the 'light' path.",
                "incorrect": "Incorrect. The 'dark' path is to *beat the manipulator at their own game*. The 'light' path (from A1-3) is to refuse to play and win with *transparent* value. This app teaches the 'light' path."
              },
              "type": "multiple-choice",
              "question": "What is the *most* Machiavellian (and 'dark') response?",
              "options": [
                {
                  "id": "A",
                  "text": "Use the *same* tactics, but do them better."
                },
                {
                  "id": "B",
                  "text": "Focus on your own *work and results* (the 'light' path)."
                },
                {
                  "id": "C",
                  "text": "Loudly accuse them of being a manipulator."
                },
                {
                  "id": "D",
                  "text": "Quit the job."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! This is the 'dark' philosophy. Machiavelli saw ethics/morality as 'weakness' that got in the way of 'winning'. We are learning to see it as 'strength'.",
                "incorrect": "Incorrect. This is the 'dark' philosophy. Machiavelli saw ethics/morality as 'weakness' that got in the way of 'winning'. We are learning to see it as 'strength'."
              },
              "type": "multiple-choice",
              "question": "The historical figure Machiavelli (A1-3) would say you are 'weak' if you *don't* use manipulation to get what you want.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! This is a 'Boss Scenario' of Manipulation (Guilt) + Coercion (Threat). The *threat* is the removal of 'love' or 'status' in the family. It's a 'dark' ultimatum.",
                "incorrect": "Incorrect. This is a 'Boss Scenario' of Manipulation (Guilt) + Coercion (Threat). The *threat* is the removal of 'love' or 'status' in the family. It's a 'dark' ultimatum."
              },
              "type": "multiple-choice",
              "question": "A family member says, 'If you *really* loved this family, you wouldn't move to a new city for that job.'\n\nThis is a 2-hit combo of a 'Guilt-Trip' (A1-4) and...?",
              "options": [
                {
                  "id": "A",
                  "text": "Coercion (an emotional threat/ultimatum)."
                },
                {
                  "id": "B",
                  "text": "Flattery (praising the family)."
                },
                {
                  "id": "C",
                  "text": "Gaslighting (denying your reality)."
                },
                {
                  "id": "D",
                  "text": "A genuine expression of sadness."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! This is the 'Drama Triangle' (which we'll cover later). They play the 'Victim' to force you to be the 'Rescuer.' The only winning move is to *refuse* the role.",
                "incorrect": "Incorrect. This is the 'Drama Triangle' (which we'll cover later). They play the 'Victim' to force you to be the 'Rescuer.' The only winning move is to *refuse* the role."
              },
              "type": "fill-in-blank",
              "sentence": "The 'Martyr Complex' (A1-4) ('I'll just walk...') forces you into the '(--------)' role.",
              "fillInOptions": [
                "Rescuer",
                "Villain",
                "Hero",
                "Victim"
              ],
              "answers": [
                "Rescuer"
              ],
              "correctAnswer": "Rescuer",
              "wrongOptions": [
                "Villain",
                "Hero",
                "Victim"
              ]
            },
            {
              "feedback": {
                "correct": "Correct! This is a 'dark' script. (1) They deny your reality ('It was a joke') and (2) They make *you* the problem ('You're too serious'). You are now 'wrong' for having feelings.",
                "incorrect": "Incorrect. This is a 'dark' script. (1) They deny your reality ('It was a joke') and (2) They make *you* the problem ('You're too serious'). You are now 'wrong' for having feelings."
              },
              "type": "multiple-choice",
              "question": "This is a 2-hit 'Gaslighting' combo. 'I'm just kidding' (Denial) and...?",
              "options": [
                {
                  "id": "A",
                  "text": "'You're... so serious' (Blame-Shifting / Attacking your character)."
                },
                {
                  "id": "B",
                  "text": "A genuine apology."
                },
                {
                  "id": "C",
                  "text": "Flattery."
                },
                {
                  "id": "D",
                  "text": "A 'Historical' Guilt-Trip."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! This is a myth. Many manipulators are 'covert' (hidden). They seem charming, friendly, and kind. The 'Coffee Shop' (A1-1) is proof. The 'charm' is the *mask*.",
                "incorrect": "Incorrect. This is a myth. Many manipulators are 'covert' (hidden). They seem charming, friendly, and kind. The 'Coffee Shop' (A1-1) is proof. The 'charm' is the *mask*."
              },
              "type": "multiple-choice",
              "question": "The 'Dark Triad' (A1-3) traits (Narcissism, Machiavellianism, Psychopathy) are *always* easy to spot.",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! This is a 'Bootcamp' (A1-3) review. Alex's actions weren't about *ego*; they were about *profit*. The flattery was a *tool*. 'The end justifies the means.' This is Machiavellianism.",
                "incorrect": "Incorrect. This is a 'Bootcamp' (A1-3) review. Alex's actions weren't about *ego*; they were about *profit*. The flattery was a *tool*. 'The end justifies the means.' This is Machiavellianism."
              },
              "type": "multiple-choice",
              "question": "The 'Coffee Shop' (A1-1) con-artist 'Alex' *best* represents which 'Dark Triad' trait?",
              "options": [
                {
                  "id": "A",
                  "text": "Narcissism (needed admiration and flattery)"
                },
                {
                  "id": "B",
                  "text": "Machiavellianism (used a cold, calculated script to get a goal: $20)"
                },
                {
                  "id": "C",
                  "text": "Psychopathy (showed a total lack of fear)"
                },
                {
                  "id": "D",
                  "text": "Empathy (was genuinely lonely)"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! Gauntlet quick-check: This is the 'Golden Rule' of flattery defense.",
                "incorrect": "Incorrect. Gauntlet quick-check: This is the 'Golden Rule' of flattery defense."
              },
              "type": "sentence-building",
              "question": "Arrange the words to make a sentence",
              "words": [
                "the",
                "flattery",
                "and",
                "the",
                "Separate",
                "'ask.'"
              ],
              "correctSentence": "Separate the flattery and the 'ask.'"
            },
            {
              "feedback": {
                "correct": "Correct! This is the 'Golden Rule' from A1-3. You must always ask: What is the *true intent* behind these words? Is it to help, or to control?",
                "incorrect": "Incorrect. This is the 'Golden Rule' from A1-3. You must always ask: What is the *true intent* behind these words? Is it to help, or to control?"
              },
              "type": "multiple-choice",
              "question": "What is the 'Prime Directive' of this app's philosophy? (A1-3)",
              "options": [
                {
                  "id": "A",
                  "text": "The end justifies the means."
                },
                {
                  "id": "B",
                  "text": "Intent is the language of Dark Psychology."
                },
                {
                  "id": "C",
                  "text": "Do whatever it takes to win."
                },
                {
                  "id": "D",
                  "text": "Trust no one."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! This is a *huge* red flag. They (1) Flatter you (Love Bombing), (2) Play the Victim ('my ex is crazy'), and (3) Gaslight the ex ('they are the problem'). You're being 'groomed' to take their side.",
                "incorrect": "Incorrect. This is a *huge* red flag. They (1) Flatter you (Love Bombing), (2) Play the Victim ('my ex is crazy'), and (3) Gaslight the ex ('they are the problem'). You're being 'groomed' to take their side."
              },
              "type": "multiple-choice",
              "question": "[Boss Challenge]\nA date: 'You are *perfect* (Love Bombing). I've never met anyone like you. That's why I know you'll understand... my ex is *crazy* and *always* texting me, you *have* to believe me, they are the problem!'\n\nThis is a 'Boss Scenario' combining 'Love Bombing' (A1-2 Flattery) with...?",
              "options": [
                {
                  "id": "A",
                  "text": "Gaslighting (denying their ex's reality) and Playing the Victim."
                },
                {
                  "id": "B",
                  "text": "Honesty and Trust."
                },
                {
                  "id": "C",
                  "text": "Guilt-Tripping you."
                },
                {
                  "id": "D",
                  "text": "Reciprocity (they bought you dinner)."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! This is the final 'Ethics' test from A1-3. The 'Prime Directive' is 'Do No Harm.' Using a 'white lie' (manipulation) to *prevent* harm (the scam) is a high-level, 'light' side choice.",
                "incorrect": "Incorrect. This is the final 'Ethics' test from A1-3. The 'Prime Directive' is 'Do No Harm.' Using a 'white lie' (manipulation) to *prevent* harm (the scam) is a high-level, 'light' side choice."
              },
              "type": "multiple-choice",
              "question": "Is it 'ethical' to use 'manipulation' (a lie, e.g., 'Oh, Alex, your boss is on the phone!') to stop them?",
              "options": [
                {
                  "id": "A",
                  "text": "No. Manipulation is *always* unethical."
                },
                {
                  "id": "B",
                  "text": "Yes. This is a 'grey area' where a 'dark' tactic (a lie) is used for a 'light' purpose (protection)."
                },
                {
                  "id": "C",
                  "text": "No. You should just call the police."
                },
                {
                  "id": "D",
                  "text": "Yes. You should steal Alex's wallet."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! False. This is an aggressive, bad defense. The *best* defense is to *test* them: subtly change your *own* posture. If they follow, you've confirmed the tactic silently.",
                "incorrect": "Incorrect. False. This is an aggressive, bad defense. The *best* defense is to *test* them: subtly change your *own* posture. If they follow, you've confirmed the tactic silently."
              },
              "type": "multiple-choice",
              "question": "The *best* defense against 'Mirroring' (A1-2) is to angrily accuse the person: 'Stop copying me!'",
              "options": [
                {
                  "id": "A",
                  "text": "True"
                },
                {
                  "id": "B",
                  "text": "False"
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! This was the lesson of A1-4. The 'Casey' (Guilt) con is 'darker' because it exploits *trust* and *empathy*, which are much more powerful than flattery from a stranger.",
                "incorrect": "Incorrect. This was the lesson of A1-4. The 'Casey' (Guilt) con is 'darker' because it exploits *trust* and *empathy*, which are much more powerful than flattery from a stranger."
              },
              "type": "multiple-choice",
              "question": "The 'Hook' scenarios (Alex and Casey) proved that...",
              "options": [
                {
                  "id": "A",
                  "text": "You are a bad person."
                },
                {
                  "id": "B",
                  "text": "Manipulation is most effective when it comes from a *friend* (Casey)."
                },
                {
                  "id": "C",
                  "text": "Manipulation is most effective when it comes from a *stranger* (Alex)."
                },
                {
                  "id": "D",
                  "text": "Flattery and Guilt are the *same* tactic."
                }
              ],
              "correctAnswer": "B"
            },
            {
              "feedback": {
                "correct": "Correct! This is a 'synthesis' question. This proves that 'Gaslighting' is an *ancient* tactic. The goal is *always* to destroy your trust in your own mind.",
                "incorrect": "Incorrect. This is a 'synthesis' question. This proves that 'Gaslighting' is an *ancient* tactic. The goal is *always* to destroy your trust in your own mind."
              },
              "type": "multiple-choice",
              "question": "What is the *identical* manipulative goal in both?",
              "options": [
                {
                  "id": "A",
                  "text": "To make the target doubt their own reality/perception."
                },
                {
                  "id": "B",
                  "text": "To save money on gas/phone bills."
                },
                {
                  "id": "C",
                  "text": "To be funny and make a joke."
                },
                {
                  "id": "D",
                  "text": "To flatter the target."
                }
              ],
              "correctAnswer": "A"
            },
            {
              "feedback": {
                "correct": "Correct! Gauntlet quick-check: This is the core difference. Flattery (ego) 'pulls' you. Guilt (conscience) 'pushes' you.",
                "incorrect": "Incorrect. Gauntlet quick-check: This is the core difference. Flattery (ego) 'pulls' you. Guilt (conscience) 'pushes' you."
              },
              "type": "fill-in-blank",
              "sentence": "Flattery (A1-2) attacks your (--------). Guilt (A1-4) attacks your (--------).",
              "fillInOptions": [
                "ego",
                "conscience",
                "wallet",
                "job"
              ],
              "answers": [
                "ego",
                "conscience"
              ],
              "correctAnswer": "ego",
              "wrongOptions": [
                "wallet",
                "job"
              ]
            },
            {
              "feedback": {
                "correct": "Correct! This is the defense for 'After all I've done for you...'. A 'light' friendship is a *relationship*; a 'dark' one is a *ledger*.",
                "incorrect": "Incorrect. This is the defense for 'After all I've done for you...'. A 'light' friendship is a *relationship*; a 'dark' one is a *ledger*."
              },
              "type": "sentence-building",
              "question": "Arrange the words to make a sentence",
              "words": [
                "is",
                "not",
                "Friendship",
                "a",
                "transaction"
              ],
              "correctSentence": "Friendship is not a transaction"
            },
            {
              "feedback": {
                "correct": "Correct! Correct. You've passed the 'Gauntlet.' Part 3 is the final 'Boss Fight' for Unit 1. Let's see if you can put it all together.",
                "incorrect": "Incorrect. Correct. You've passed the 'Gauntlet.' Part 3 is the final 'Boss Fight' for Unit 1. Let's see if you can put it all together."
              },
              "type": "multiple-choice",
              "question": "You have survived the 'Gauntlet.' What do you expect in Part 3, the 'Final Scenarios'?",
              "options": [
                {
                  "id": "A",
                  "text": "The final, *hardest* 'Boss Scenarios' that combine *everything* you've learned."
                },
                {
                  "id": "B",
                  "text": "An easy, 5-question quiz."
                },
                {
                  "id": "C",
                  "text": "A review of this review."
                },
                {
                  "id": "D",
                  "text": "New lessons you haven't seen yet."
                }
              ],
              "correctAnswer": "A"
            }
          ]
        }
      ],
      "totalParts": 4
    },
  // Lesson 2: A2-1 Part 2: Practice - Grandiose vs. Vulnerable
  {
                                                                                              "lessonId": "A2-1-P2",
                                                                                              "number": 2,
                                                                                              "title": "A2-1 Part 2: Practice - Grandiose vs. Vulnerable",
                                                                                              "practice": [
                                                                                                {
                                                                                                  "id": "A2-1-P2-E1",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "Review: What is the primary source of 'Supply' for the Grandiose narcissist?",
                                                                                                  "options": [
                                                                                                    "Pity and sympathy from others.",
                                                                                                    "Admiration, obedience, and perceived superiority.",
                                                                                                    "Financial gain and material wealth.",
                                                                                                    "Emotional connection and intimacy."
                                                                                                  ],
                                                                                                  "correctAnswer": "Admiration, obedience, and perceived superiority.",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct. The Grandiose type demands admiration and control to feel superior.",
                                                                                                    "incorrect": "Incorrect. Pity and sympathy are what the Covert type seeks."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E2",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Sarah's boss storms into the office and loudly declares, 'I'm the only one who knows how to run this place! Everyone else is useless!' He demands everyone stop their work to listen to him describe how brilliant his latest idea is.",
                                                                                                  "question": "Which narcissistic mask is Sarah's boss displaying?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Grandiose",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! He's openly demanding admiration and superiority—classic Grandiose behavior.",
                                                                                                    "incorrect": "Look again. He's being loud, aggressive, and demanding admiration—this is Grandiose, not Covert."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E3",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Mark's friend constantly posts vague, sad messages on social media: 'Nobody understands how much I suffer... I guess I'll just stay quiet.' When people ask what's wrong, he says, 'You wouldn't understand. I'm always the one who gets hurt.'",
                                                                                                  "question": "Which narcissistic mask is Mark's friend displaying?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! He's seeking pity and sympathy—classic Covert manipulation.",
                                                                                                    "incorrect": "Notice how he's playing the victim to get sympathy, not demanding admiration. This is Covert."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E4",
                                                                                                  "type": "matching",
                                                                                                  "question": "Match each behavior to the correct narcissistic mask:",
                                                                                                  "pairs": [
                                                                                                    {
                                                                                                      "left": "Loud, aggressive, and demands respect",
                                                                                                      "right": "Grandiose"
                                                                                                    },
                                                                                                    {
                                                                                                      "left": "Quiet, plays the victim, seeks pity",
                                                                                                      "right": "Vulnerable/Covert"
                                                                                                    },
                                                                                                    {
                                                                                                      "left": "Uses guilt and self-pity to manipulate",
                                                                                                      "right": "Vulnerable/Covert"
                                                                                                    },
                                                                                                    {
                                                                                                      "left": "Brags about achievements and belittles others",
                                                                                                      "right": "Grandiose"
                                                                                                    }
                                                                                                  ],
                                                                                                  "feedback": {
                                                                                                    "correct": "Perfect! You're recognizing the key differences between the two masks.",
                                                                                                    "incorrect": "Remember: Grandiose is loud and superior, Covert is quiet and victimized."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E5",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "True or False: A Covert narcissist might say, 'I'm so worthless. Nobody appreciates everything I do for them.'",
                                                                                                  "options": [
                                                                                                    "True",
                                                                                                    "False"
                                                                                                  ],
                                                                                                  "correctAnswer": "True",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! This is classic Covert language—playing the victim to get sympathy and make you feel guilty.",
                                                                                                    "incorrect": "Look closely. This statement is playing the victim and seeking pity—classic Covert behavior."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E6",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Lisa's partner says, 'After everything I've done for you, this is how you treat me? I guess I'm just not good enough.' He sighs heavily and leaves the room, slamming the door.",
                                                                                                  "question": "Which mask is Lisa's partner using?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! He's using guilt and self-pity to manipulate Lisa into feeling bad.",
                                                                                                    "incorrect": "Notice the guilt-trip and victimhood language. This is Covert, not Grandiose."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E7",
                                                                                                  "type": "build-sentence",
                                                                                                  "question": "Build the sentence: The Grandiose narcissist seeks ________, while the Covert narcissist seeks ________.",
                                                                                                  "words": [
                                                                                                    "admiration",
                                                                                                    "pity",
                                                                                                    "sympathy",
                                                                                                    "respect",
                                                                                                    "control",
                                                                                                    "validation"
                                                                                                  ],
                                                                                                  "correctOrder": [
                                                                                                    "admiration",
                                                                                                    "pity"
                                                                                                  ],
                                                                                                  "feedback": {
                                                                                                    "correct": "Perfect! Grandiose wants admiration, Covert wants pity.",
                                                                                                    "incorrect": "Remember: Grandiose = admiration, Covert = pity and sympathy."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E8",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Tom's coworker interrupts a meeting to say, 'I can't believe you all ignored my idea last week. I'm always the one being overlooked. Maybe I should just stop contributing.'",
                                                                                                  "question": "Which mask is Tom's coworker displaying?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! He's playing the victim to make others feel guilty and give him sympathy.",
                                                                                                    "incorrect": "Notice the victimhood and guilt-tripping. This is Covert behavior."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E9",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "Which statement is MORE likely from a Grandiose narcissist?",
                                                                                                  "options": [
                                                                                                    "Nobody appreciates how much I sacrifice.",
                                                                                                    "I'm the best at what I do, and everyone knows it.",
                                                                                                    "I'm always the one who gets hurt.",
                                                                                                    "People just don't understand me."
                                                                                                  ],
                                                                                                  "correctAnswer": "I'm the best at what I do, and everyone knows it.",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! Grandiose narcissists openly brag and demand admiration.",
                                                                                                    "incorrect": "The other options sound like victimhood and self-pity—classic Covert tactics."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E10",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Rachel's mother says, 'I gave up my entire life for you kids, and this is the thanks I get? I'm just a burden to everyone now.'",
                                                                                                  "question": "Which mask is Rachel's mother using?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! She's using guilt and victimhood to manipulate Rachel.",
                                                                                                    "incorrect": "Look at the guilt-trip and self-pity. This is Covert manipulation."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E11",
                                                                                                  "type": "matching",
                                                                                                  "question": "Match the emotion to the mask that uses it as fuel:",
                                                                                                  "pairs": [
                                                                                                    {
                                                                                                      "left": "Admiration and fear",
                                                                                                      "right": "Grandiose"
                                                                                                    },
                                                                                                    {
                                                                                                      "left": "Pity and guilt",
                                                                                                      "right": "Vulnerable/Covert"
                                                                                                    }
                                                                                                  ],
                                                                                                  "feedback": {
                                                                                                    "correct": "Perfect! You're identifying the emotional 'fuel' each mask needs.",
                                                                                                    "incorrect": "Remember: Grandiose feeds on admiration and fear, Covert feeds on pity and guilt."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E12",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "True or False: Both Grandiose and Covert narcissists need 'Supply' to maintain their inflated self-image.",
                                                                                                  "options": [
                                                                                                    "True",
                                                                                                    "False"
                                                                                                  ],
                                                                                                  "correctAnswer": "True",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! Both masks need Supply—they just get it in different ways (admiration vs. pity).",
                                                                                                    "incorrect": "Both types need Supply, just from different sources. Grandiose = admiration, Covert = pity."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E13",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Daniel's friend says, 'I'm obviously the smartest person in this group. You should all be grateful I'm here to guide you.' He then dismisses someone's suggestion as 'stupid.'",
                                                                                                  "question": "Which mask is Daniel's friend displaying?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Grandiose",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! He's openly demanding admiration and belittling others—classic Grandiose.",
                                                                                                    "incorrect": "Notice the arrogance and superiority. This is Grandiose, not Covert."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E14",
                                                                                                  "type": "build-sentence",
                                                                                                  "question": "Complete: The Covert narcissist manipulates through ________ and ________.",
                                                                                                  "words": [
                                                                                                    "guilt",
                                                                                                    "pity",
                                                                                                    "admiration",
                                                                                                    "fear",
                                                                                                    "anger",
                                                                                                    "sympathy"
                                                                                                  ],
                                                                                                  "correctOrder": [
                                                                                                    "guilt",
                                                                                                    "pity"
                                                                                                  ],
                                                                                                  "feedback": {
                                                                                                    "correct": "Perfect! Covert narcissists use guilt and pity to control others.",
                                                                                                    "incorrect": "Remember: Covert narcissists manipulate by making you feel guilty and sorry for them."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E15",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "Final Check: Which mask is HARDER to spot because it hides behind victimhood?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! The Covert mask is harder to spot because it looks like genuine suffering—but it's manipulation.",
                                                                                                    "incorrect": "Grandiose narcissists are easier to spot because they're loud and obvious. Covert is the hidden mask."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E1",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "Review: What is the primary source of 'Supply' for the Grandiose narcissist?",
                                                                                                  "options": [
                                                                                                    "Pity and sympathy from others.",
                                                                                                    "Admiration, obedience, and perceived superiority.",
                                                                                                    "Financial gain and material wealth.",
                                                                                                    "Emotional connection and intimacy."
                                                                                                  ],
                                                                                                  "correctAnswer": "Admiration, obedience, and perceived superiority.",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct. The Grandiose type demands admiration and control to feel superior.",
                                                                                                    "incorrect": "Incorrect. Pity and sympathy are what the Covert type seeks."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E2",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Sarah's boss storms into the office and loudly declares, 'I'm the only one who knows how to run this place! Everyone else is useless!' He demands everyone stop their work to listen to him describe how brilliant his latest idea is.",
                                                                                                  "question": "Which narcissistic mask is Sarah's boss displaying?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Grandiose",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! He's openly demanding admiration and superiority—classic Grandiose behavior.",
                                                                                                    "incorrect": "Look again. He's being loud, aggressive, and demanding admiration—this is Grandiose, not Covert."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E3",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Mark's friend constantly posts vague, sad messages on social media: 'Nobody understands how much I suffer... I guess I'll just stay quiet.' When people ask what's wrong, he says, 'You wouldn't understand. I'm always the one who gets hurt.'",
                                                                                                  "question": "Which narcissistic mask is Mark's friend displaying?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! He's seeking pity and sympathy—classic Covert manipulation.",
                                                                                                    "incorrect": "Notice how he's playing the victim to get sympathy, not demanding admiration. This is Covert."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E4",
                                                                                                  "type": "matching",
                                                                                                  "question": "Match each behavior to the correct narcissistic mask:",
                                                                                                  "pairs": [
                                                                                                    {
                                                                                                      "left": "Loud, aggressive, and demands respect",
                                                                                                      "right": "Grandiose"
                                                                                                    },
                                                                                                    {
                                                                                                      "left": "Quiet, plays the victim, seeks pity",
                                                                                                      "right": "Vulnerable/Covert"
                                                                                                    },
                                                                                                    {
                                                                                                      "left": "Uses guilt and self-pity to manipulate",
                                                                                                      "right": "Vulnerable/Covert"
                                                                                                    },
                                                                                                    {
                                                                                                      "left": "Brags about achievements and belittles others",
                                                                                                      "right": "Grandiose"
                                                                                                    }
                                                                                                  ],
                                                                                                  "feedback": {
                                                                                                    "correct": "Perfect! You're recognizing the key differences between the two masks.",
                                                                                                    "incorrect": "Remember: Grandiose is loud and superior, Covert is quiet and victimized."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E5",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "True or False: A Covert narcissist might say, 'I'm so worthless. Nobody appreciates everything I do for them.'",
                                                                                                  "options": [
                                                                                                    "True",
                                                                                                    "False"
                                                                                                  ],
                                                                                                  "correctAnswer": "True",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! This is classic Covert language—playing the victim to get sympathy and make you feel guilty.",
                                                                                                    "incorrect": "Look closely. This statement is playing the victim and seeking pity—classic Covert behavior."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E6",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Lisa's partner says, 'After everything I've done for you, this is how you treat me? I guess I'm just not good enough.' He sighs heavily and leaves the room, slamming the door.",
                                                                                                  "question": "Which mask is Lisa's partner using?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! He's using guilt and self-pity to manipulate Lisa into feeling bad.",
                                                                                                    "incorrect": "Notice the guilt-trip and victimhood language. This is Covert, not Grandiose."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E7",
                                                                                                  "type": "build-sentence",
                                                                                                  "question": "Build the sentence: The Grandiose narcissist seeks ________, while the Covert narcissist seeks ________.",
                                                                                                  "words": [
                                                                                                    "admiration",
                                                                                                    "pity",
                                                                                                    "sympathy",
                                                                                                    "respect",
                                                                                                    "control",
                                                                                                    "validation"
                                                                                                  ],
                                                                                                  "correctOrder": [
                                                                                                    "admiration",
                                                                                                    "pity"
                                                                                                  ],
                                                                                                  "feedback": {
                                                                                                    "correct": "Perfect! Grandiose wants admiration, Covert wants pity.",
                                                                                                    "incorrect": "Remember: Grandiose = admiration, Covert = pity and sympathy."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E8",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Tom's coworker interrupts a meeting to say, 'I can't believe you all ignored my idea last week. I'm always the one being overlooked. Maybe I should just stop contributing.'",
                                                                                                  "question": "Which mask is Tom's coworker displaying?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! He's playing the victim to make others feel guilty and give him sympathy.",
                                                                                                    "incorrect": "Notice the victimhood and guilt-tripping. This is Covert behavior."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E9",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "Which statement is MORE likely from a Grandiose narcissist?",
                                                                                                  "options": [
                                                                                                    "Nobody appreciates how much I sacrifice.",
                                                                                                    "I'm the best at what I do, and everyone knows it.",
                                                                                                    "I'm always the one who gets hurt.",
                                                                                                    "People just don't understand me."
                                                                                                  ],
                                                                                                  "correctAnswer": "I'm the best at what I do, and everyone knows it.",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! Grandiose narcissists openly brag and demand admiration.",
                                                                                                    "incorrect": "The other options sound like victimhood and self-pity—classic Covert tactics."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E10",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Rachel's mother says, 'I gave up my entire life for you kids, and this is the thanks I get? I'm just a burden to everyone now.'",
                                                                                                  "question": "Which mask is Rachel's mother using?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! She's using guilt and victimhood to manipulate Rachel.",
                                                                                                    "incorrect": "Look at the guilt-trip and self-pity. This is Covert manipulation."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E11",
                                                                                                  "type": "matching",
                                                                                                  "question": "Match the emotion to the mask that uses it as fuel:",
                                                                                                  "pairs": [
                                                                                                    {
                                                                                                      "left": "Admiration and fear",
                                                                                                      "right": "Grandiose"
                                                                                                    },
                                                                                                    {
                                                                                                      "left": "Pity and guilt",
                                                                                                      "right": "Vulnerable/Covert"
                                                                                                    }
                                                                                                  ],
                                                                                                  "feedback": {
                                                                                                    "correct": "Perfect! You're identifying the emotional 'fuel' each mask needs.",
                                                                                                    "incorrect": "Remember: Grandiose feeds on admiration and fear, Covert feeds on pity and guilt."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E12",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "True or False: Both Grandiose and Covert narcissists need 'Supply' to maintain their inflated self-image.",
                                                                                                  "options": [
                                                                                                    "True",
                                                                                                    "False"
                                                                                                  ],
                                                                                                  "correctAnswer": "True",
                                                                                                  "feedback": {
                                                                                                    "correct": "Correct! Both masks need Supply—they just get it in different ways (admiration vs. pity).",
                                                                                                    "incorrect": "Both types need Supply, just from different sources. Grandiose = admiration, Covert = pity."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E13",
                                                                                                  "type": "scenario",
                                                                                                  "scenario": "Daniel's friend says, 'I'm obviously the smartest person in this group. You should all be grateful I'm here to guide you.' He then dismisses someone's suggestion as 'stupid.'",
                                                                                                  "question": "Which mask is Daniel's friend displaying?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Grandiose",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! He's openly demanding admiration and belittling others—classic Grandiose.",
                                                                                                    "incorrect": "Notice the arrogance and superiority. This is Grandiose, not Covert."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E14",
                                                                                                  "type": "build-sentence",
                                                                                                  "question": "Complete: The Covert narcissist manipulates through ________ and ________.",
                                                                                                  "words": [
                                                                                                    "guilt",
                                                                                                    "pity",
                                                                                                    "admiration",
                                                                                                    "fear",
                                                                                                    "anger",
                                                                                                    "sympathy"
                                                                                                  ],
                                                                                                  "correctOrder": [
                                                                                                    "guilt",
                                                                                                    "pity"
                                                                                                  ],
                                                                                                  "feedback": {
                                                                                                    "correct": "Perfect! Covert narcissists use guilt and pity to control others.",
                                                                                                    "incorrect": "Remember: Covert narcissists manipulate by making you feel guilty and sorry for them."
                                                                                                  }
                                                                                                },
                                                                                                {
                                                                                                  "id": "A2-1-P2-E15",
                                                                                                  "type": "multiple-choice",
                                                                                                  "question": "Final Check: Which mask is HARDER to spot because it hides behind victimhood?",
                                                                                                  "options": [
                                                                                                    "Grandiose",
                                                                                                    "Vulnerable/Covert"
                                                                                                  ],
                                                                                                  "correctAnswer": "Vulnerable/Covert",
                                                                                                  "feedback": {
                                                                                                    "correct": "Exactly! The Covert mask is harder to spot because it looks like genuine suffering—but it's manipulation.",
                                                                                                    "incorrect": "Grandiose narcissists are easier to spot because they're loud and obvious. Covert is the hidden mask."
                                                                                                  }
                                                                                                }
                                                                                              ],
                                                                                              "parts": [
                                                                                                {
                                                                                                  "partNumber": 1,
                                                                                                  "partTitle": "Part 1",
                                                                                                  "questions": [
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E1",
                                                                                                      "type": "multiple-choice",
                                                                                                      "question": "Review: What is the primary source of 'Supply' for the Grandiose narcissist?",
                                                                                                      "options": [
                                                                                                        "Pity and sympathy from others.",
                                                                                                        "Admiration, obedience, and perceived superiority.",
                                                                                                        "Financial gain and material wealth.",
                                                                                                        "Emotional connection and intimacy."
                                                                                                      ],
                                                                                                      "correctAnswer": "Admiration, obedience, and perceived superiority.",
                                                                                                      "feedback": {
                                                                                                        "correct": "Correct. The Grandiose type demands admiration and control to feel superior.",
                                                                                                        "incorrect": "Incorrect. Pity and sympathy are what the Covert type seeks."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E2",
                                                                                                      "type": "scenario",
                                                                                                      "scenario": "Sarah's boss storms into the office and loudly declares, 'I'm the only one who knows how to run this place! Everyone else is useless!' He demands everyone stop their work to listen to him describe how brilliant his latest idea is.",
                                                                                                      "question": "Which narcissistic mask is Sarah's boss displaying?",
                                                                                                      "options": [
                                                                                                        "Grandiose",
                                                                                                        "Vulnerable/Covert"
                                                                                                      ],
                                                                                                      "correctAnswer": "Grandiose",
                                                                                                      "feedback": {
                                                                                                        "correct": "Correct! He's openly demanding admiration and superiority—classic Grandiose behavior.",
                                                                                                        "incorrect": "Look again. He's being loud, aggressive, and demanding admiration—this is Grandiose, not Covert."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E3",
                                                                                                      "type": "scenario",
                                                                                                      "scenario": "Mark's friend constantly posts vague, sad messages on social media: 'Nobody understands how much I suffer... I guess I'll just stay quiet.' When people ask what's wrong, he says, 'You wouldn't understand. I'm always the one who gets hurt.'",
                                                                                                      "question": "Which narcissistic mask is Mark's friend displaying?",
                                                                                                      "options": [
                                                                                                        "Grandiose",
                                                                                                        "Vulnerable/Covert"
                                                                                                      ],
                                                                                                      "correctAnswer": "Vulnerable/Covert",
                                                                                                      "feedback": {
                                                                                                        "correct": "Exactly! He's seeking pity and sympathy—classic Covert manipulation.",
                                                                                                        "incorrect": "Notice how he's playing the victim to get sympathy, not demanding admiration. This is Covert."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E4",
                                                                                                      "type": "matching",
                                                                                                      "question": "Match each behavior to the correct narcissistic mask:",
                                                                                                      "pairs": [
                                                                                                        {
                                                                                                          "left": "Loud, aggressive, and demands respect",
                                                                                                          "right": "Grandiose"
                                                                                                        },
                                                                                                        {
                                                                                                          "left": "Quiet, plays the victim, seeks pity",
                                                                                                          "right": "Vulnerable/Covert"
                                                                                                        },
                                                                                                        {
                                                                                                          "left": "Uses guilt and self-pity to manipulate",
                                                                                                          "right": "Vulnerable/Covert"
                                                                                                        },
                                                                                                        {
                                                                                                          "left": "Brags about achievements and belittles others",
                                                                                                          "right": "Grandiose"
                                                                                                        }
                                                                                                      ],
                                                                                                      "feedback": {
                                                                                                        "correct": "Perfect! You're recognizing the key differences between the two masks.",
                                                                                                        "incorrect": "Remember: Grandiose is loud and superior, Covert is quiet and victimized."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E5",
                                                                                                      "type": "multiple-choice",
                                                                                                      "question": "True or False: A Covert narcissist might say, 'I'm so worthless. Nobody appreciates everything I do for them.'",
                                                                                                      "options": [
                                                                                                        "True",
                                                                                                        "False"
                                                                                                      ],
                                                                                                      "correctAnswer": "True",
                                                                                                      "feedback": {
                                                                                                        "correct": "Correct! This is classic Covert language—playing the victim to get sympathy and make you feel guilty.",
                                                                                                        "incorrect": "Look closely. This statement is playing the victim and seeking pity—classic Covert behavior."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E6",
                                                                                                      "type": "scenario",
                                                                                                      "scenario": "Lisa's partner says, 'After everything I've done for you, this is how you treat me? I guess I'm just not good enough.' He sighs heavily and leaves the room, slamming the door.",
                                                                                                      "question": "Which mask is Lisa's partner using?",
                                                                                                      "options": [
                                                                                                        "Grandiose",
                                                                                                        "Vulnerable/Covert"
                                                                                                      ],
                                                                                                      "correctAnswer": "Vulnerable/Covert",
                                                                                                      "feedback": {
                                                                                                        "correct": "Exactly! He's using guilt and self-pity to manipulate Lisa into feeling bad.",
                                                                                                        "incorrect": "Notice the guilt-trip and victimhood language. This is Covert, not Grandiose."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E7",
                                                                                                      "type": "build-sentence",
                                                                                                      "question": "Build the sentence: The Grandiose narcissist seeks ________, while the Covert narcissist seeks ________.",
                                                                                                      "words": [
                                                                                                        "admiration",
                                                                                                        "pity",
                                                                                                        "sympathy",
                                                                                                        "respect",
                                                                                                        "control",
                                                                                                        "validation"
                                                                                                      ],
                                                                                                      "correctOrder": [
                                                                                                        "admiration",
                                                                                                        "pity"
                                                                                                      ],
                                                                                                      "feedback": {
                                                                                                        "correct": "Perfect! Grandiose wants admiration, Covert wants pity.",
                                                                                                        "incorrect": "Remember: Grandiose = admiration, Covert = pity and sympathy."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E8",
                                                                                                      "type": "scenario",
                                                                                                      "scenario": "Tom's coworker interrupts a meeting to say, 'I can't believe you all ignored my idea last week. I'm always the one being overlooked. Maybe I should just stop contributing.'",
                                                                                                      "question": "Which mask is Tom's coworker displaying?",
                                                                                                      "options": [
                                                                                                        "Grandiose",
                                                                                                        "Vulnerable/Covert"
                                                                                                      ],
                                                                                                      "correctAnswer": "Vulnerable/Covert",
                                                                                                      "feedback": {
                                                                                                        "correct": "Correct! He's playing the victim to make others feel guilty and give him sympathy.",
                                                                                                        "incorrect": "Notice the victimhood and guilt-tripping. This is Covert behavior."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E9",
                                                                                                      "type": "multiple-choice",
                                                                                                      "question": "Which statement is MORE likely from a Grandiose narcissist?",
                                                                                                      "options": [
                                                                                                        "Nobody appreciates how much I sacrifice.",
                                                                                                        "I'm the best at what I do, and everyone knows it.",
                                                                                                        "I'm always the one who gets hurt.",
                                                                                                        "People just don't understand me."
                                                                                                      ],
                                                                                                      "correctAnswer": "I'm the best at what I do, and everyone knows it.",
                                                                                                      "feedback": {
                                                                                                        "correct": "Exactly! Grandiose narcissists openly brag and demand admiration.",
                                                                                                        "incorrect": "The other options sound like victimhood and self-pity—classic Covert tactics."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E10",
                                                                                                      "type": "scenario",
                                                                                                      "scenario": "Rachel's mother says, 'I gave up my entire life for you kids, and this is the thanks I get? I'm just a burden to everyone now.'",
                                                                                                      "question": "Which mask is Rachel's mother using?",
                                                                                                      "options": [
                                                                                                        "Grandiose",
                                                                                                        "Vulnerable/Covert"
                                                                                                      ],
                                                                                                      "correctAnswer": "Vulnerable/Covert",
                                                                                                      "feedback": {
                                                                                                        "correct": "Correct! She's using guilt and victimhood to manipulate Rachel.",
                                                                                                        "incorrect": "Look at the guilt-trip and self-pity. This is Covert manipulation."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E11",
                                                                                                      "type": "matching",
                                                                                                      "question": "Match the emotion to the mask that uses it as fuel:",
                                                                                                      "pairs": [
                                                                                                        {
                                                                                                          "left": "Admiration and fear",
                                                                                                          "right": "Grandiose"
                                                                                                        },
                                                                                                        {
                                                                                                          "left": "Pity and guilt",
                                                                                                          "right": "Vulnerable/Covert"
                                                                                                        }
                                                                                                      ],
                                                                                                      "feedback": {
                                                                                                        "correct": "Perfect! You're identifying the emotional 'fuel' each mask needs.",
                                                                                                        "incorrect": "Remember: Grandiose feeds on admiration and fear, Covert feeds on pity and guilt."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E12",
                                                                                                      "type": "multiple-choice",
                                                                                                      "question": "True or False: Both Grandiose and Covert narcissists need 'Supply' to maintain their inflated self-image.",
                                                                                                      "options": [
                                                                                                        "True",
                                                                                                        "False"
                                                                                                      ],
                                                                                                      "correctAnswer": "True",
                                                                                                      "feedback": {
                                                                                                        "correct": "Correct! Both masks need Supply—they just get it in different ways (admiration vs. pity).",
                                                                                                        "incorrect": "Both types need Supply, just from different sources. Grandiose = admiration, Covert = pity."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E13",
                                                                                                      "type": "scenario",
                                                                                                      "scenario": "Daniel's friend says, 'I'm obviously the smartest person in this group. You should all be grateful I'm here to guide you.' He then dismisses someone's suggestion as 'stupid.'",
                                                                                                      "question": "Which mask is Daniel's friend displaying?",
                                                                                                      "options": [
                                                                                                        "Grandiose",
                                                                                                        "Vulnerable/Covert"
                                                                                                      ],
                                                                                                      "correctAnswer": "Grandiose",
                                                                                                      "feedback": {
                                                                                                        "correct": "Exactly! He's openly demanding admiration and belittling others—classic Grandiose.",
                                                                                                        "incorrect": "Notice the arrogance and superiority. This is Grandiose, not Covert."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E14",
                                                                                                      "type": "build-sentence",
                                                                                                      "question": "Complete: The Covert narcissist manipulates through ________ and ________.",
                                                                                                      "words": [
                                                                                                        "guilt",
                                                                                                        "pity",
                                                                                                        "admiration",
                                                                                                        "fear",
                                                                                                        "anger",
                                                                                                        "sympathy"
                                                                                                      ],
                                                                                                      "correctOrder": [
                                                                                                        "guilt",
                                                                                                        "pity"
                                                                                                      ],
                                                                                                      "feedback": {
                                                                                                        "correct": "Perfect! Covert narcissists use guilt and pity to control others.",
                                                                                                        "incorrect": "Remember: Covert narcissists manipulate by making you feel guilty and sorry for them."
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "id": "A2-1-P2-E15",
                                                                                                      "type": "multiple-choice",
                                                                                                      "question": "Final Check: Which mask is HARDER to spot because it hides behind victimhood?",
                                                                                                      "options": [
                                                                                                        "Grandiose",
                                                                                                        "Vulnerable/Covert"
                                                                                                      ],
                                                                                                      "correctAnswer": "Vulnerable/Covert",
                                                                                                      "feedback": {
                                                                                                        "correct": "Exactly! The Covert mask is harder to spot because it looks like genuine suffering—but it's manipulation.",
                                                                                                        "incorrect": "Grandiose narcissists are easier to spot because they're loud and obvious. Covert is the hidden mask."
                                                                                                      }
                                                                                                    }
                                                                                                  ]
                                                                                                }
                                                                                              ],
                                                                                              "totalParts": 1
                                                                                            },
  // Lesson 1: Narcissism: The Architect of Self
  {
                  "number": 1,
                  "title": "Narcissism: The Architect of Self",
                  "section": "A",
                  "sectionId": "A",
                  "sectionTitle": "The Foundations of the Dark Mind",
                  "unitId": "A2",
                  "unitTitle": "The Manipulator's Playbook: Narcissism & Gaslighting",
                  "lessonId": "A2-1",
                  "lessonTitle": "Narcissism: The Architect of Self",
                  "lessonType": "Normal",
                  "lessonPart": 1,
                  "lessonPartTitle": "Defining Narcissism (What is it?)",
                  "objective": "To define 'Narcissism' as a core Dark Triad trait and distinguish it from simple confidence or high self-esteem.",
                  "gamification": {
                    "progressRings": [
                      {
                        "ringId": "learn",
                        "status": "pending",
                        "label": "Part 1"
                      },
                      {
                        "ringId": "practice",
                        "status": "pending",
                        "label": "Part 2"
                      },
                      {
                        "ringId": "challenge",
                        "status": "pending",
                        "label": "Part 3"
                      }
                    ],
                    "pointsValue": 100,
                    "starsAvailable": 3,
                    "badgeOnCompletion": null
                  },
                  "practice": [
                    {
                      "feedback": {
                        "correct": "This is the key. They are an 'empty' cup that *needs* you to fill it. This 'need' is called 'Narcissistic Supply'.",
                        "incorrect": "Confidence is not narcissism. A confident person *has* self-worth. A narcissist *chases* self-worth from others."
                      },
                      "type": "multiple-choice",
                      "question": "What is the *core definition* of a narcissist in this context?",
                      "options": [
                        {
                          "id": "A",
                          "text": "Someone who is just very confident and successful."
                        },
                        {
                          "id": "B",
                          "text": "Someone with a deep-seated lack of self-worth who *needs* constant external validation (praise, admiration)."
                        },
                        {
                          "id": "C",
                          "text": "Someone who is shy and quiet."
                        },
                        {
                          "id": "D",
                          "text": "Someone who is just very 'selfish' in a normal way."
                        }
                      ],
                      "correctAnswer": "B"
                    },
                    {
                      "feedback": {
                        "correct": "Correct. 'Supply' is anything that proves they 'exist' and have an *effect* on others. This is their primary addiction.",
                        "incorrect": "This is true. 'Supply' is the 'food' a narcissist needs: praise, admiration, attention, or even the 'power' of making you feel bad."
                      },
                      "type": "multiple-choice",
                      "question": "'Narcissistic Supply' is the 'food' a narcissist needs: praise, admiration, attention, or even the 'power' of making you feel bad.",
                      "options": [
                        {
                          "id": "A",
                          "text": "True"
                        },
                        {
                          "id": "B",
                          "text": "False"
                        }
                      ],
                      "correctAnswer": "A"
                    },
                    {
                      "feedback": {
                        "correct": "Correct. This is the core difference. Confidence is 'I am good.' Narcissism is 'Tell me I am good, or I'll punish you.'",
                        "incorrect": "Remember: Confidence is *internal* ('I know my worth'). Narcissism is *external* ('You must tell me my worth')."
                      },
                      "type": "matching",
                      "question": "Match the term to its correct definition:",
                      "pairs": [
                        {
                          "term": "Healthy Confidence",
                          "definition": "'I know my worth.' (Internal validation)"
                        },
                        {
                          "term": "Narcissism",
                          "definition": "'You must *tell me* my worth.' (External validation)"
                        },
                        {
                          "term": "Narcissistic Supply",
                          "definition": "The 'praise' or 'power' a narcissist needs from others."
                        },
                        {
                          "term": "The 'Dark Triad'",
                          "definition": "Narcissism, Machiavellianism, Psychopathy"
                        }
                      ]
                    },
                    {
                      "feedback": {
                        "correct": "Correct. A narcissist cannot celebrate your 'win' because it makes them feel 'less-than.' They must either *compete* ('one-upping') or *compare* to re-establish their superiority.",
                        "incorrect": "This is a trap. A 'Confident' person can be happy for you. A 'Narcissist' sees your win as *their loss* and must immediately make the conversation about *them*."
                      },
                      "type": "multiple-choice",
                      "question": "You get a promotion. A 'Confident' friend says: 'That's amazing! Congratulations, you earned it!'\n\nA 'Narcissist' friend is more likely to say:",
                      "options": [
                        {
                          "id": "A",
                          "text": "'That's cool. I just closed a *way* bigger deal, though.' (One-upping)"
                        },
                        {
                          "id": "B",
                          "text": "'Wow, that's great!' (and mean it)."
                        },
                        {
                          "id": "C",
                          "text": "'How much money? Is it more than *me*?' (Comparing)"
                        },
                        {
                          "id": "D",
                          "text": "Both A and C are likely narcissistic responses."
                        }
                      ],
                      "correctAnswer": "D"
                    },
                    {
                      "feedback": {
                        "correct": "This is their script. They 'fake' empathy (like 'Alex' in A1-1) to get 'supply' (admiration, trust, or even your money).",
                        "incorrect": "Think about 'Alex' (A1-1). They *faked* vulnerability and kindness (empathy) to get *supply* (your trust and $20)."
                      },
                      "type": "fill-in-blank",
                      "sentence": "A narcissist *fakes* (--------) to get (--------) from you.",
                      "fillInOptions": [
                        "empathy",
                        "supply",
                        "money",
                        "anger",
                        "confidence"
                      ],
                      "answers": [
                        "empathy",
                        "supply"
                      ],
                      "correctAnswer": "empathy",
                      "wrongOptions": [
                        "money",
                        "anger",
                        "confidence"
                      ]
                    }
                  ],
                  "contentScreens": [
                    {
                      "screenId": "A2-1-P1-S1",
                      "screenType": "Learn",
                      "title": "Tactic Deep Dive: Narcissism",
                      "content": [
                        {
                          "type": "paragraph",
                          "text": "Welcome to Unit 2. You've seen the 'tactics' (Flattery, Guilt). Now we study the 'architects' who use them."
                        },
                        {
                          "type": "paragraph",
                          "text": "The first and most common is the 'Narcissist.' This is not just someone who is 'confident' or 'vain.' Narcissism is a deep-seated personality structure."
                        },
                        {
                          "type": "alert",
                          "alertType": "warning",
                          "text": "The key: A confident person is 'full.' A narcissist is 'empty' and *needs* you to fill them up. This 'need' is the engine for all their manipulation."
                        }
                      ]
                    },
                    {
                      "screenId": "A2-1-P1-S2",
                      "screenType": "Exercises",
                      "exercises": [
                        {
                          "exerciseId": "A2-1-P1-E1",
                          "type": "multiple-choice",
                          "question": "What is the *core definition* of a narcissist in this context?",
                          "options": [
                            "Someone who is just very confident and successful.",
                            "Someone with a deep-seated lack of self-worth who *needs* constant external validation (praise, admiration).",
                            "Someone who is shy and quiet.",
                            "Someone who is just very 'selfish' in a normal way."
                          ],
                          "correct": "Someone with a deep-seated lack of self-worth who *needs* constant external validation (praise, admiration).",
                          "difficulty": "easy",
                          "feedback": {
                            "correct": "This is the key. They are an 'empty' cup that *needs* you to fill it. This 'need' is called 'Narcissistic Supply'.",
                            "incorrect": "Confidence is not narcissism. A confident person *has* self-worth. A narcissist *chases* self-worth from others."
                          }
                        },
                        {
                          "exerciseId": "A2-1-P1-E2",
                          "type": "true-false",
                          "statement": "'Narcissistic Supply' is the 'food' a narcissist needs: praise, admiration, attention, or even the 'power' of making you feel bad.",
                          "options": [
                            "True",
                            "False"
                          ],
                          "correct": "True",
                          "difficulty": "medium",
                          "feedback": {
                            "correct": "Correct. 'Supply' is anything that proves they 'exist' and have an *effect* on others. This is their primary addiction.",
                            "incorrect": "This is true. 'Supply' is the 'food' a narcissist needs: praise, admiration, attention, or even the 'power' of making you feel bad."
                          }
                        },
                        {
                          "exerciseId": "A2-1-P1-E3",
                          "type": "matching",
                          "question": "Match the term to its correct definition:",
                          "pairs": [
                            {
                              "term": "Healthy Confidence",
                              "definition": "'I know my worth.' (Internal validation)"
                            },
                            {
                              "term": "Narcissism",
                              "definition": "'You must *tell me* my worth.' (External validation)"
                            },
                            {
                              "term": "Narcissistic Supply",
                              "definition": "The 'praise' or 'power' a narcissist needs from others."
                            },
                            {
                              "term": "The 'Dark Triad'",
                              "definition": "Narcissism, Machiavellianism, Psychopathy"
                            }
                          ],
                          "difficulty": "medium",
                          "feedback": {
                            "correct": "Correct. This is the core difference. Confidence is 'I am good.' Narcissism is 'Tell me I am good, or I'll punish you.'",
                            "incorrect": "Remember: Confidence is *internal* ('I know my worth'). Narcissism is *external* ('You must tell me my worth')."
                          }
                        },
                        {
                          "exerciseId": "A2-1-P1-E4",
                          "type": "scenario",
                          "scene": "You get a promotion. A 'Confident' friend says: 'That's amazing! Congratulations, you earned it!'",
                          "question": "A 'Narcissist' friend is more likely to say:",
                          "options": [
                            "'That's cool. I just closed a *way* bigger deal, though.' (One-upping)",
                            "'Wow, that's great!' (and mean it).",
                            "'How much money? Is it more than *me*?' (Comparing)",
                            "Both A and C are likely narcissistic responses."
                          ],
                          "correct": "Both A and C are likely narcissistic responses.",
                          "difficulty": "medium",
                          "feedback": {
                            "correct": "Correct. A narcissist cannot celebrate your 'win' because it makes them feel 'less-than.' They must either *compete* ('one-upping') or *compare* to re-establish their superiority.",
                            "incorrect": "This is a trap. A 'Confident' person can be happy for you. A 'Narcissist' sees your win as *their loss* and must immediately make the conversation about *them*."
                          }
                        },
                        {
                          "exerciseId": "A2-1-P1-E5",
                          "type": "fill-in",
                          "sentence": "A narcissist *fakes* (--------) to get (--------) from you.",
                          "options": [
                            "empathy",
                            "supply",
                            "money",
                            "anger",
                            "confidence"
                          ],
                          "answers": [
                            "empathy",
                            "supply"
                          ],
                          "difficulty": "medium",
                          "feedback": {
                            "correct": "This is their script. They 'fake' empathy (like 'Alex' in A1-1) to get 'supply' (admiration, trust, or even your money).",
                            "incorrect": "Think about 'Alex' (A1-1). They *faked* vulnerability and kindness (empathy) to get *supply* (your trust and $20)."
                          }
                        }
                      ]
                    }
                  ],
                  "parts": [
                    {
                      "partNumber": 1,
                      "partTitle": "Defining Narcissism (What is it?)",
                      "questions": [
                        {
                          "feedback": {
                            "correct": "This is the key. They are an 'empty' cup that *needs* you to fill it. This 'need' is called 'Narcissistic Supply'.",
                            "incorrect": "Confidence is not narcissism. A confident person *has* self-worth. A narcissist *chases* self-worth from others."
                          },
                          "type": "multiple-choice",
                          "question": "What is the *core definition* of a narcissist in this context?",
                          "options": [
                            {
                              "id": "A",
                              "text": "Someone who is just very confident and successful."
                            },
                            {
                              "id": "B",
                              "text": "Someone with a deep-seated lack of self-worth who *needs* constant external validation (praise, admiration)."
                            },
                            {
                              "id": "C",
                              "text": "Someone who is shy and quiet."
                            },
                            {
                              "id": "D",
                              "text": "Someone who is just very 'selfish' in a normal way."
                            }
                          ],
                          "correctAnswer": "B"
                        },
                        {
                          "feedback": {
                            "correct": "Correct. 'Supply' is anything that proves they 'exist' and have an *effect* on others. This is their primary addiction.",
                            "incorrect": "This is true. 'Supply' is the 'food' a narcissist needs: praise, admiration, attention, or even the 'power' of making you feel bad."
                          },
                          "type": "multiple-choice",
                          "question": "'Narcissistic Supply' is the 'food' a narcissist needs: praise, admiration, attention, or even the 'power' of making you feel bad.",
                          "options": [
                            {
                              "id": "A",
                              "text": "True"
                            },
                            {
                              "id": "B",
                              "text": "False"
                            }
                          ],
                          "correctAnswer": "A"
                        },
                        {
                          "feedback": {
                            "correct": "Correct. This is the core difference. Confidence is 'I am good.' Narcissism is 'Tell me I am good, or I'll punish you.'",
                            "incorrect": "Remember: Confidence is *internal* ('I know my worth'). Narcissism is *external* ('You must tell me my worth')."
                          },
                          "type": "matching",
                          "question": "Match the term to its correct definition:",
                          "pairs": [
                            {
                              "term": "Healthy Confidence",
                              "definition": "'I know my worth.' (Internal validation)"
                            },
                            {
                              "term": "Narcissism",
                              "definition": "'You must *tell me* my worth.' (External validation)"
                            },
                            {
                              "term": "Narcissistic Supply",
                              "definition": "The 'praise' or 'power' a narcissist needs from others."
                            },
                            {
                              "term": "The 'Dark Triad'",
                              "definition": "Narcissism, Machiavellianism, Psychopathy"
                            }
                          ]
                        },
                        {
                          "feedback": {
                            "correct": "Correct. A narcissist cannot celebrate your 'win' because it makes them feel 'less-than.' They must either *compete* ('one-upping') or *compare* to re-establish their superiority.",
                            "incorrect": "This is a trap. A 'Confident' person can be happy for you. A 'Narcissist' sees your win as *their loss* and must immediately make the conversation about *them*."
                          },
                          "type": "multiple-choice",
                          "question": "You get a promotion. A 'Confident' friend says: 'That's amazing! Congratulations, you earned it!'\n\nA 'Narcissist' friend is more likely to say:",
                          "options": [
                            {
                              "id": "A",
                              "text": "'That's cool. I just closed a *way* bigger deal, though.' (One-upping)"
                            },
                            {
                              "id": "B",
                              "text": "'Wow, that's great!' (and mean it)."
                            },
                            {
                              "id": "C",
                              "text": "'How much money? Is it more than *me*?' (Comparing)"
                            },
                            {
                              "id": "D",
                              "text": "Both A and C are likely narcissistic responses."
                            }
                          ],
                          "correctAnswer": "D"
                        },
                        {
                          "feedback": {
                            "correct": "This is their script. They 'fake' empathy (like 'Alex' in A1-1) to get 'supply' (admiration, trust, or even your money).",
                            "incorrect": "Think about 'Alex' (A1-1). They *faked* vulnerability and kindness (empathy) to get *supply* (your trust and $20)."
                          },
                          "type": "fill-in-blank",
                          "sentence": "A narcissist *fakes* (--------) to get (--------) from you.",
                          "fillInOptions": [
                            "empathy",
                            "supply",
                            "money",
                            "anger",
                            "confidence"
                          ],
                          "answers": [
                            "empathy",
                            "supply"
                          ],
                          "correctAnswer": "empathy",
                          "wrongOptions": [
                            "money",
                            "anger",
                            "confidence"
                          ]
                        }
                      ]
                    }
                  ],
                  "totalParts": 1
                },
  // Lesson 2: Narcissistic Supply: The Addict & The Fuel
  {
                "number": 2,
                "title": "Narcissistic Supply: The Addict & The Fuel",
                "section": "A",
                "sectionId": "A",
                "sectionTitle": "The Foundations of the Dark Mind",
                "unitId": "A2",
                "unitTitle": "The Manipulator's Playbook: Narcissism & Gaslighting",
                "lessonId": "A2-2",
                "lessonTitle": "Narcissistic Supply: The Addict & The Fuel",
                "lessonType": "Normal",
                "lessonPart": 2,
                "lessonPartTitle": "Practice: Identifying 'Supply' Sources",
                "objective": "To practice identifying specific behaviors used to extract Positive and Negative Supply, and to recognize the 'Source' dynamic in relationships.",
                "gamification": {
                  "progressRings": [
                    {
                      "ringId": "learn",
                      "status": "completed",
                      "label": "Part 1"
                    },
                    {
                      "ringId": "practice",
                      "status": "pending",
                      "label": "Part 2"
                    },
                    {
                      "ringId": "challenge",
                      "status": "pending",
                      "label": "Part 3"
                    }
                  ],
                  "pointsValue": 100,
                  "starsAvailable": 3,
                  "badgeOnCompletion": null
                },
                "practice": [
                  {
                    "feedback": {
                      "correct": "Correct. They are playing the 'Martyr' to extract praise ('Wow, you work so hard!') or pity ('That's so unfair!').",
                      "incorrect": "They aren't trying to make you angry (yet). They want validation for their 'sacrifice'."
                    },
                    "type": "multiple-choice",
                    "question": "Scenario: A colleague walks by your desk and sighs loudly, 'I stayed here until 9 PM last night fixing everyone's mistakes. I guess no one else cares about this company.'\n\nWhat type of Supply are they fishing for?",
                    "options": [
                      {
                        "id": "A",
                        "text": "Positive Supply (Praise/Martyrdom)"
                      },
                      {
                        "id": "B",
                        "text": "Negative Supply (Anger)"
                      },
                      {
                        "id": "C",
                        "text": "Information Supply"
                      },
                      {
                        "id": "D",
                        "text": "Financial Supply"
                      }
                    ],
                    "correctAnswer": "A"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. A peaceful day provides zero Supply. Provoking a fight gives them an immediate rush of intense emotion (fuel).",
                      "incorrect": "It's not about the mistake from 3 years ago. It's about generating immediate drama *now*."
                    },
                    "type": "multiple-choice",
                    "question": "Scenario: You are having a calm, happy day. Your partner suddenly brings up a mistake you made 3 years ago and accuses you of never loving them.\n\nWhy ruin a happy moment?",
                    "options": [
                      {
                        "id": "A",
                        "text": "They genuinely forgot to mention it earlier."
                      },
                      {
                        "id": "B",
                        "text": "They are extracting Negative Supply because peace is 'boring' to an addict."
                      },
                      {
                        "id": "C",
                        "text": "They want to break up."
                      },
                      {
                        "id": "D",
                        "text": "They are trying to help you improve."
                      }
                    ],
                    "correctAnswer": "B"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. Seeing that they have the power to *destroy* you emotionally is the ultimate proof of their superiority and existence.",
                      "incorrect": "While compliments are nice, 'Negative Supply' (your pain) is often more intense and validating for them."
                    },
                    "type": "multiple-choice",
                    "question": "Which of these is the **most potent** form of Supply for a narcissist?",
                    "options": [
                      {
                        "id": "A",
                        "text": "A polite compliment from a stranger."
                      },
                      {
                        "id": "B",
                        "text": "Your visible devastation and crying after they discard you."
                      },
                      {
                        "id": "C",
                        "text": "A paycheck."
                      },
                      {
                        "id": "D",
                        "text": "A like on Facebook."
                      }
                    ],
                    "correctAnswer": "B"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. They are purchasing 'Admiration.' The moment the crowd stops clapping, the generosity will vanish.",
                      "incorrect": "It looks like generosity, but the *intent* is to harvest admiration from the crowd."
                    },
                    "type": "multiple-choice",
                    "question": "Is this generosity, or is it a transaction for Supply?",
                    "options": [
                      {
                        "id": "A",
                        "text": "True"
                      },
                      {
                        "id": "B",
                        "text": "False"
                      }
                    ],
                    "correctAnswer": "B"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. Recognizing the *goal* of the behavior helps you detach from the emotional trigger.",
                      "incorrect": "Think about the reaction they want. Charity = 'You're great.' Fight = 'I hate you' (Reaction). Victim = 'Poor you.'"
                    },
                    "type": "matching",
                    "question": "Match the behavior to the type of Supply it seeks:",
                    "pairs": [
                      {
                        "term": "Public Charity Work",
                        "definition": "Admiration (Positive Supply)"
                      },
                      {
                        "term": "Picking a Fight",
                        "definition": "Anger/Chaos (Negative Supply)"
                      },
                      {
                        "term": "Playing the Victim",
                        "definition": "Pity/Sympathy (Covert Supply)"
                      },
                      {
                        "term": "Smear Campaign",
                        "definition": "Control/Revenge (Power Supply)"
                      }
                    ]
                  },
                  {
                    "feedback": {
                      "correct": "Correct. 'Narcissistic Injury' is the deep pain they feel when their mask is ignored or challenged. Rage is the defense mechanism.",
                      "incorrect": "It's not panic or clarity. It is a specific ego-wound called 'Narcissistic Injury.'"
                    },
                    "type": "fill-in-blank",
                    "sentence": "When you refuse to give a narcissist Supply (by staying calm), they often suffer a (--------) and fly into a rage.",
                    "fillInOptions": [
                      "narcissistic injury",
                      "panic attack",
                      "moment of clarity",
                      "depression"
                    ],
                    "answers": [
                      "narcissistic injury"
                    ],
                    "correctAnswer": "narcissistic injury",
                    "wrongOptions": [
                      "panic attack",
                      "moment of clarity",
                      "depression"
                    ]
                  },
                  {
                    "feedback": {
                      "correct": "Correct. An 'Extinction Burst' is when a behavior spikes in intensity right before it stops. They are desperate for *any* Supply.",
                      "incorrect": "The method is *working*, which is why they are panicking. They are ramping up the stimulus to force a reaction."
                    },
                    "type": "multiple-choice",
                    "question": "Scenario: You try the 'Grey Rock' method (giving no reaction). The narcissist escalates, starts insulting your family, and breaks a plate.\n\nWhat is happening here?",
                    "options": [
                      {
                        "id": "A",
                        "text": "The Grey Rock method failed."
                      },
                      {
                        "id": "B",
                        "text": "An 'Extinction Burst': They are panicking because the fuel line is cut and are trying anything to get a reaction."
                      },
                      {
                        "id": "C",
                        "text": "They just really hate plates."
                      },
                      {
                        "id": "D",
                        "text": "They have suddenly gone crazy."
                      }
                    ],
                    "correctAnswer": "B"
                  },
                  {
                    "feedback": {
                      "correct": "This metaphor is crucial. You are an appliance that holds a charge (emotional energy). They plug in to drain you.",
                      "incorrect": "The core concept is objectification. You are a battery/source, not a human partner."
                    },
                    "type": "sentence-building",
                    "question": "Arrange the words to make a sentence",
                    "words": [
                      "not",
                      "a",
                      "are",
                      "person,",
                      "are",
                      "a",
                      "You",
                      "battery",
                      "you"
                    ],
                    "correctSentence": "You are not a person, you are a battery"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. You don't feed the beast (praise), but you don't poke it (insult). You stay neutral and boring.",
                      "incorrect": "Insulting them creates Negative Supply (drama). Praising them reinforces the trap. Neutrality breaks the cycle."
                    },
                    "type": "multiple-choice",
                    "question": "What is the most 'ethically aware' boundary?",
                    "options": [
                      {
                        "id": "A",
                        "text": "Give them the compliment to keep the peace."
                      },
                      {
                        "id": "B",
                        "text": "Cruelly agree: 'Yeah, you do look tired.'"
                      },
                      {
                        "id": "C",
                        "text": "Stay neutral: 'You look fine to me,' and change the subject."
                      },
                      {
                        "id": "D",
                        "text": "Lecture them on their narcissism."
                      }
                    ],
                    "correctAnswer": "C"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. The narcissist keeps Secondary Sources around to boost their ego when the Primary Source (partner) is worn out.",
                      "incorrect": "The spouse is usually the 'Primary Source' (high volume). Secondary sources are backups."
                    },
                    "type": "multiple-choice",
                    "question": "What is a 'Secondary Source' of Supply?",
                    "options": [
                      {
                        "id": "A",
                        "text": "A spouse or partner."
                      },
                      {
                        "id": "B",
                        "text": "A person who provides occasional Supply (colleague, neighbor, friend) but isn't the main target."
                      },
                      {
                        "id": "C",
                        "text": "A pet."
                      },
                      {
                        "id": "D",
                        "text": "A bank account."
                      }
                    ],
                    "correctAnswer": "B"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. By withholding Supply, *you* became the 'abuser' in their narrative. They reversed the roles to gain victim status (Supply).",
                      "incorrect": "This is DARVO. They are attacking you for setting a boundary and claiming *they* are the victim."
                    },
                    "type": "multiple-choice",
                    "question": "This reaction is an example of:",
                    "options": [
                      {
                        "id": "A",
                        "text": "DARVO (Deny, Attack, Reverse Victim and Offender)"
                      },
                      {
                        "id": "B",
                        "text": "Love Bombing"
                      },
                      {
                        "id": "C",
                        "text": "Hoovering"
                      },
                      {
                        "id": "D",
                        "text": "A sincere apology"
                      }
                    ],
                    "correctAnswer": "A"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. It is the exact opposite of the truth. They care *only* about what people think of them. It is their oxygen.",
                      "incorrect": "This is a lie they tell to seem strong. Their entire existence depends on external validation."
                    },
                    "type": "multiple-choice",
                    "question": "Is this statement true?",
                    "options": [
                      {
                        "id": "A",
                        "text": "True"
                      },
                      {
                        "id": "B",
                        "text": "False"
                      }
                    ],
                    "correctAnswer": "B"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. The interaction is one-way. They come to you to get a reaction (comfort or praise), then leave. You are an object to them.",
                      "incorrect": "Friendship is reciprocal. This is parasitic. You are being used for Supply."
                    },
                    "type": "multiple-choice",
                    "question": "Scenario: You notice that a friend only calls you when they have a crisis or a huge success to brag about. They never ask about your life.\n\nYou are functioning as:",
                    "options": [
                      {
                        "id": "A",
                        "text": "A best friend."
                      },
                      {
                        "id": "B",
                        "text": "A Supply Dispenser (Vending Machine)."
                      },
                      {
                        "id": "C",
                        "text": "A therapist."
                      },
                      {
                        "id": "D",
                        "text": "A mentor."
                      }
                    ],
                    "correctAnswer": "B"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. They use you to 'regulate' their own self-esteem. You are an external emotional regulator, not a partner.",
                      "incorrect": "They fear intimacy. They want you to manage their emotions for them (Regulation)."
                    },
                    "type": "fill-in-blank",
                    "sentence": "The narcissist does not want a relationship; they want (--------).",
                    "fillInOptions": [
                      "regulation",
                      "intimacy",
                      "honesty",
                      "growth"
                    ],
                    "answers": [
                      "regulation"
                    ],
                    "correctAnswer": "regulation",
                    "wrongOptions": [
                      "intimacy",
                      "honesty",
                      "growth"
                    ]
                  },
                  {
                    "feedback": {
                      "correct": "Correct. The emptiness drives the hunger. They need the fuel (Supply) to keep the engine running and avoid feeling the shame.",
                      "incorrect": "The 'Engine' is their internal psychological state—specifically, the void where their self-worth should be."
                    },
                    "type": "multiple-choice",
                    "question": "If Supply is the 'Fuel,' what is the 'Engine'?",
                    "options": [
                      {
                        "id": "A",
                        "text": "The narcissist's deep shame and emptiness."
                      },
                      {
                        "id": "B",
                        "text": "Their job."
                      },
                      {
                        "id": "C",
                        "text": "Their car."
                      },
                      {
                        "id": "D",
                        "text": "Their family."
                      }
                    ],
                    "correctAnswer": "A"
                  },
                  {
                    "feedback": {
                      "correct": "Correct. The final test is to apply this knowledge. Can you cut the fuel line without blowing up the relationship? Let's find out.",
                      "incorrect": "The next step is the Challenge: Applying the 'Starvation' (Grey Rock) technique in a simulation."
                    },
                    "type": "multiple-choice",
                    "question": "In Part 3, we will face the Challenge:",
                    "options": [
                      {
                        "id": "A",
                        "text": "Giving them more Supply."
                      },
                      {
                        "id": "B",
                        "text": "The 'Supply' Scenario: Starving the Narcissist (Simulation)."
                      },
                      {
                        "id": "C",
                        "text": "Becoming a narcissist."
                      },
                      {
                        "id": "D",
                        "text": "Ignoring the problem."
                      }
                    ],
                    "correctAnswer": "B"
                  }
                ],
                "contentScreens": [
                  {
                    "screenId": "A2-2-P2-S1",
                    "screenType": "Exercises",
                    "title": "Practice: Spot the Fuel",
                    "exercises": [
                      {
                        "exerciseId": "A2-2-P2-E1",
                        "type": "scenario",
                        "scene": "Scenario: A colleague walks by your desk and sighs loudly, 'I stayed here until 9 PM last night fixing everyone's mistakes. I guess no one else cares about this company.'",
                        "question": "What type of Supply are they fishing for?",
                        "options": [
                          "Positive Supply (Praise/Martyrdom)",
                          "Negative Supply (Anger)",
                          "Information Supply",
                          "Financial Supply"
                        ],
                        "correct": "Positive Supply (Praise/Martyrdom)",
                        "difficulty": "easy",
                        "feedback": {
                          "correct": "Correct. They are playing the 'Martyr' to extract praise ('Wow, you work so hard!') or pity ('That's so unfair!').",
                          "incorrect": "They aren't trying to make you angry (yet). They want validation for their 'sacrifice'."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E2",
                        "type": "scenario",
                        "scene": "Scenario: You are having a calm, happy day. Your partner suddenly brings up a mistake you made 3 years ago and accuses you of never loving them.",
                        "question": "Why ruin a happy moment?",
                        "options": [
                          "They genuinely forgot to mention it earlier.",
                          "They are extracting Negative Supply because peace is 'boring' to an addict.",
                          "They want to break up.",
                          "They are trying to help you improve."
                        ],
                        "correct": "They are extracting Negative Supply because peace is 'boring' to an addict.",
                        "difficulty": "medium",
                        "feedback": {
                          "correct": "Correct. A peaceful day provides zero Supply. Provoking a fight gives them an immediate rush of intense emotion (fuel).",
                          "incorrect": "It's not about the mistake from 3 years ago. It's about generating immediate drama *now*."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E3",
                        "type": "multiple-choice",
                        "question": "Which of these is the **most potent** form of Supply for a narcissist?",
                        "options": [
                          "A polite compliment from a stranger.",
                          "Your visible devastation and crying after they discard you.",
                          "A paycheck.",
                          "A like on Facebook."
                        ],
                        "correct": "Your visible devastation and crying after they discard you.",
                        "difficulty": "hard",
                        "feedback": {
                          "correct": "Correct. Seeing that they have the power to *destroy* you emotionally is the ultimate proof of their superiority and existence.",
                          "incorrect": "While compliments are nice, 'Negative Supply' (your pain) is often more intense and validating for them."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E4",
                        "type": "true-false",
                        "scene": "Scenario: A narcissist is being incredibly charming, buying drinks for everyone at the bar, and telling funny stories.",
                        "question": "Is this generosity, or is it a transaction for Supply?",
                        "options": [
                          "Generosity",
                          "Transaction for Supply"
                        ],
                        "correct": "Transaction for Supply",
                        "difficulty": "easy",
                        "feedback": {
                          "correct": "Correct. They are purchasing 'Admiration.' The moment the crowd stops clapping, the generosity will vanish.",
                          "incorrect": "It looks like generosity, but the *intent* is to harvest admiration from the crowd."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E5",
                        "type": "matching",
                        "question": "Match the behavior to the type of Supply it seeks:",
                        "pairs": [
                          {
                            "term": "Public Charity Work",
                            "definition": "Admiration (Positive Supply)"
                          },
                          {
                            "term": "Picking a Fight",
                            "definition": "Anger/Chaos (Negative Supply)"
                          },
                          {
                            "term": "Playing the Victim",
                            "definition": "Pity/Sympathy (Covert Supply)"
                          },
                          {
                            "term": "Smear Campaign",
                            "definition": "Control/Revenge (Power Supply)"
                          }
                        ],
                        "difficulty": "medium",
                        "feedback": {
                          "correct": "Correct. Recognizing the *goal* of the behavior helps you detach from the emotional trigger.",
                          "incorrect": "Think about the reaction they want. Charity = 'You're great.' Fight = 'I hate you' (Reaction). Victim = 'Poor you.'"
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E6",
                        "type": "fill-in",
                        "sentence": "When you refuse to give a narcissist Supply (by staying calm), they often suffer a (--------) and fly into a rage.",
                        "options": [
                          "panic attack",
                          "narcissistic injury",
                          "moment of clarity",
                          "depression"
                        ],
                        "answers": [
                          "narcissistic injury"
                        ],
                        "difficulty": "medium",
                        "feedback": {
                          "correct": "Correct. 'Narcissistic Injury' is the deep pain they feel when their mask is ignored or challenged. Rage is the defense mechanism.",
                          "incorrect": "It's not panic or clarity. It is a specific ego-wound called 'Narcissistic Injury.'"
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E7",
                        "type": "scenario",
                        "scene": "Scenario: You try the 'Grey Rock' method (giving no reaction). The narcissist escalates, starts insulting your family, and breaks a plate.",
                        "question": "What is happening here?",
                        "options": [
                          "The Grey Rock method failed.",
                          "An 'Extinction Burst': They are panicking because the fuel line is cut and are trying anything to get a reaction.",
                          "They just really hate plates.",
                          "They have suddenly gone crazy."
                        ],
                        "correct": "An 'Extinction Burst': They are panicking because the fuel line is cut and are trying anything to get a reaction.",
                        "difficulty": "hard",
                        "feedback": {
                          "correct": "Correct. An 'Extinction Burst' is when a behavior spikes in intensity right before it stops. They are desperate for *any* Supply.",
                          "incorrect": "The method is *working*, which is why they are panicking. They are ramping up the stimulus to force a reaction."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E8",
                        "type": "build-sentence",
                        "question": "Arrange these words to define your role to a narcissist:",
                        "words": [
                          "not",
                          "a",
                          "are",
                          "person,",
                          "are",
                          "a",
                          "You",
                          "battery",
                          "you"
                        ],
                        "correct": "You are not a person, you are a battery",
                        "difficulty": "easy",
                        "feedback": {
                          "correct": "This metaphor is crucial. You are an appliance that holds a charge (emotional energy). They plug in to drain you.",
                          "incorrect": "The core concept is objectification. You are a battery/source, not a human partner."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E9",
                        "type": "ethical-dilemma",
                        "scene": "You see a narcissist fishing for compliments ('I look so ugly today...'). You know it's a trap for Supply.",
                        "question": "What is the most 'ethically aware' boundary?",
                        "options": [
                          "Give them the compliment to keep the peace.",
                          "Cruelly agree: 'Yeah, you do look tired.'",
                          "Stay neutral: 'You look fine to me,' and change the subject.",
                          "Lecture them on their narcissism."
                        ],
                        "correct": "Stay neutral: 'You look fine to me,' and change the subject.",
                        "difficulty": "medium",
                        "feedback": {
                          "correct": "Correct. You don't feed the beast (praise), but you don't poke it (insult). You stay neutral and boring.",
                          "incorrect": "Insulting them creates Negative Supply (drama). Praising them reinforces the trap. Neutrality breaks the cycle."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E10",
                        "type": "multiple-choice",
                        "question": "What is a 'Secondary Source' of Supply?",
                        "options": [
                          "A spouse or partner.",
                          "A person who provides occasional Supply (colleague, neighbor, friend) but isn't the main target.",
                          "A pet.",
                          "A bank account."
                        ],
                        "correct": "A person who provides occasional Supply (colleague, neighbor, friend) but isn't the main target.",
                        "difficulty": "medium",
                        "feedback": {
                          "correct": "Correct. The narcissist keeps Secondary Sources around to boost their ego when the Primary Source (partner) is worn out.",
                          "incorrect": "The spouse is usually the 'Primary Source' (high volume). Secondary sources are backups."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E11",
                        "type": "reverse-scenario",
                        "answer": "The narcissist accuses you of 'abusing' them because you refused to give them a compliment they fished for.",
                        "question": "This reaction is an example of:",
                        "options": [
                          "DARVO (Deny, Attack, Reverse Victim and Offender)",
                          "Love Bombing",
                          "Hoovering",
                          "A sincere apology"
                        ],
                        "correct": "DARVO (Deny, Attack, Reverse Victim and Offender)",
                        "difficulty": "hard",
                        "feedback": {
                          "correct": "Correct. By withholding Supply, *you* became the 'abuser' in their narrative. They reversed the roles to gain victim status (Supply).",
                          "incorrect": "This is DARVO. They are attacking you for setting a boundary and claiming *they* are the victim."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E12",
                        "type": "true-false",
                        "scene": "Scenario: A narcissist says, 'I don't care what anyone thinks of me.'",
                        "question": "Is this statement true?",
                        "options": [
                          "True",
                          "False"
                        ],
                        "correct": "False",
                        "difficulty": "easy",
                        "feedback": {
                          "correct": "Correct. It is the exact opposite of the truth. They care *only* about what people think of them. It is their oxygen.",
                          "incorrect": "This is a lie they tell to seem strong. Their entire existence depends on external validation."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E13",
                        "type": "scenario",
                        "scene": "Scenario: You notice that a friend only calls you when they have a crisis or a huge success to brag about. They never ask about your life.",
                        "question": "You are functioning as:",
                        "options": [
                          "A best friend.",
                          "A Supply Dispenser (Vending Machine).",
                          "A therapist.",
                          "A mentor."
                        ],
                        "correct": "A Supply Dispenser (Vending Machine).",
                        "difficulty": "medium",
                        "feedback": {
                          "correct": "Correct. The interaction is one-way. They come to you to get a reaction (comfort or praise), then leave. You are an object to them.",
                          "incorrect": "Friendship is reciprocal. This is parasitic. You are being used for Supply."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E14",
                        "type": "fill-in",
                        "sentence": "The narcissist does not want a relationship; they want (--------).",
                        "options": [
                          "regulation",
                          "intimacy",
                          "honesty",
                          "growth"
                        ],
                        "answers": [
                          "regulation"
                        ],
                        "difficulty": "hard",
                        "feedback": {
                          "correct": "Correct. They use you to 'regulate' their own self-esteem. You are an external emotional regulator, not a partner.",
                          "incorrect": "They fear intimacy. They want you to manage their emotions for them (Regulation)."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E15",
                        "type": "multiple-choice",
                        "question": "If Supply is the 'Fuel,' what is the 'Engine'?",
                        "options": [
                          "The narcissist's deep shame and emptiness.",
                          "Their job.",
                          "Their car.",
                          "Their family."
                        ],
                        "correct": "The narcissist's deep shame and emptiness.",
                        "difficulty": "medium",
                        "feedback": {
                          "correct": "Correct. The emptiness drives the hunger. They need the fuel (Supply) to keep the engine running and avoid feeling the shame.",
                          "incorrect": "The 'Engine' is their internal psychological state—specifically, the void where their self-worth should be."
                        }
                      },
                      {
                        "exerciseId": "A2-2-P2-E16",
                        "type": "case-analysis",
                        "caseTitle": "Part 2 Complete: Spotting the Extraction",
                        "scene": "You can now see the Matrix. Every interaction—a brag, a fight, a sob story—is a transaction for Supply. They are extracting energy from you.",
                        "question": "In Part 3, we will face the Challenge:",
                        "options": [
                          "Giving them more Supply.",
                          "The 'Supply' Scenario: Starving the Narcissist (Simulation).",
                          "Becoming a narcissist.",
                          "Ignoring the problem."
                        ],
                        "correct": "The 'Supply' Scenario: Starving the Narcissist (Simulation).",
                        "difficulty": "easy",
                        "feedback": {
                          "correct": "Correct. The final test is to apply this knowledge. Can you cut the fuel line without blowing up the relationship? Let's find out.",
                          "incorrect": "The next step is the Challenge: Applying the 'Starvation' (Grey Rock) technique in a simulation."
                        }
                      }
                    ]
                  }
                ]
              },
  // Lesson undefined: The "Milton Model": Weaponized Vague Language
  {
  "lessonId": "B1-4",
  "lessonTitle": "The \"Milton Model\": Weaponized Vague Language",
  "sectionId": "B",
  "unitId": "B1",
  "parts": [
    {
      "_id": "j97fqgfrev2e7anbgt73jdeybd7xkt88",
      "contentScreens": [
        {
          "content": [
            {
              "text": "Most people think persuasion requires precise arguments. The **Milton Model** proves the opposite: Vague language is often more powerful.",
              "type": "paragraph"
            },
            {
              "text": "If I say 'This car is fast,' you can argue. If I say 'This car will give you *the feeling you've been looking for*,' you cannot argue, because you fill in the blank with your own desire.",
              "type": "paragraph"
            },
            {
              "alertType": "warning",
              "text": "Key Concept: **Artful Vagueness**. Being specific creates resistance. Being vague creates agreement.",
              "type": "alert"
            }
          ],
          "screenId": "B1-4-P1-S1",
          "screenType": "Learn",
          "title": "The Art of Saying Nothing"
        },
        {
          "exercises": [
            {
              "correct": "A style of language that is artfully vague, abstract, and metaphorical, used to induce trance and bypass critical thinking.",
              "difficulty": "easy",
              "exerciseId": "B1-4-P1-E1",
              "feedback": {
                "correct": "Correct. Named after hypnotherapist Milton Erickson. It uses 'fluff' to distract the conscious mind so the subconscious accepts the suggestion.",
                "incorrect": "It is the opposite of specific. It is the language of poets, politicians, and psychics."
              },
              "options": [
                "A set of specific commands.",
                "A style of language that is artfully vague, abstract, and metaphorical, used to induce trance and bypass critical thinking.",
                "A fashion brand.",
                "Speaking loudly."
              ],
              "question": "What is the **Milton Model**?",
              "type": "multiple-choice"
            },
            {
              "correct": "Because it is a **Barnum Statement**: A statement so vague that it applies to everyone, but feels personal.",
              "difficulty": "medium",
              "exerciseId": "B1-4-P1-E2",
              "feedback": {
                "correct": "Correct. Who *doesn't* feel they have unused potential? Your brain fills in the specific details ('My novel,' 'My gym routine'), making the statement feel true for *you*.",
                "incorrect": "It isn't psychic ability. It is a statistical probability that applies to 99% of humans."
              },
              "options": [
                "Because they are psychic.",
                "Because it is a **Barnum Statement**: A statement so vague that it applies to everyone, but feels personal.",
                "Because it is specific.",
                "Because you are special."
              ],
              "question": "Why does everyone agree with this statement?",
              "scene": "Scenario: A psychic says, 'I sense that you have a great deal of unused capacity that you have not turned to your advantage yet.'",
              "type": "scenario"
            },
            {
              "answers": [
                "transderivational"
              ],
              "difficulty": "hard",
              "exerciseId": "B1-4-P1-E3",
              "feedback": {
                "correct": "Correct. A 'Transderivational Search' means your brain goes inside its own memories to find a match for the vague words. This internal focus creates a light trance.",
                "incorrect": "It is a specific NLP term. The brain goes *inward* to derive meaning."
              },
              "options": [
                "transderivational",
                "Google",
                "quick",
                "slow"
              ],
              "sentence": "Vague language forces the to perform a (--------) Search to find meaning.",
              "type": "fill-in"
            },
            {
              "correct": "True",
              "difficulty": "easy",
              "exerciseId": "B1-4-P1-E4",
              "feedback": {
                "correct": "Correct. This is a 'Generic Mind Read.' It claims to know your thoughts without knowing anything. Everyone is wondering about 'many things.'",
                "incorrect": "It mimics telepathy by stating a universal human experience."
              },
              "options": [
                "True",
                "False"
              ],
              "question": "Is this a Mind Read?",
              "scene": "Scenario: 'I know you are wondering about *many things* right now.'",
              "type": "true-false"
            },
            {
              "difficulty": "medium",
              "exerciseId": "B1-4-P1-E5",
              "feedback": {
                "correct": "Correct. 'Lost Performative' hides the source of the opinion. 'Universal Quantifier' uses absolutes (All, Every, Never).",
                "incorrect": "Look for the missing information. Who thinks it? Who is 'Everyone'?"
              },
              "pairs": [
                {
                  "definition": "\"I know what you're thinking.\"",
                  "term": "Mind Read"
                },
                {
                  "definition": "\"It is important to decide now.\" (Who says it's important?)",
                  "term": "Lost Performative"
                },
                {
                  "definition": "\"Everyone knows this is the best deal.\"",
                  "term": "Universal Quantifier"
                }
              ],
              "question": "Match the Milton Pattern to the Example:",
              "type": "matching"
            },
            {
              "correct": "The listener fills in the blanks",
              "difficulty": "easy",
              "exerciseId": "B1-4-P1-E6",
              "feedback": {
                "correct": "Correct. If I say 'Success,' you imagine *your* version of success. I don't have to promise anything specific, yet you feel promised.",
                "incorrect": "The speaker provides the frame; the listener provides the picture."
              },
              "question": "Arrange the words to define the danger of vague speech:",
              "type": "build-sentence",
              "words": [
                "The",
                "blanks",
                "fills",
                "the",
                "listener",
                "in"
              ]
            },
            {
              "correct": "Cause and Effect Linkage",
              "difficulty": "hard",
              "exerciseId": "B1-4-P1-E7",
              "feedback": {
                "correct": "Correct. It creates a fake logic. Relaxation does not cause agreement, but the sentence links them. Your brain accepts the link.",
                "incorrect": "It connects X to Y. 'As you sit there (X), you will feel happy (Y).'"
              },
              "options": [
                "Cause and Effect Linkage",
                "Gaslighting",
                "Honesty",
                "A question"
              ],
              "question": "What is this called?",
              "scene": "A linguistic pattern that links two unrelated ideas so that if one is true, the other must be true (e.g., 'The more you relax, the more you will agree').",
              "type": "reverse-scenario"
            },
            {
              "correct": "Nominalizations (Frozen Verbs).",
              "difficulty": "medium",
              "exerciseId": "B1-4-P1-E8",
              "feedback": {
                "correct": "Correct. A 'Nominalization' is a verb turned into a noun. You can't put 'Freedom' in a wheelbarrow. It is an abstract concept that means different things to everyone.",
                "incorrect": "They aren't plans. They are abstract nouns that trap your attention because you have to search for their meaning."
              },
              "options": [
                "Nominalizations (Frozen Verbs).",
                "Facts.",
                "Plans.",
                "Lies."
              ],
              "question": "These words ('Hope', 'Freedom') are called:",
              "scene": "Scenario: A politician says, 'We need to restore Hope and Freedom to our great nation!'",
              "type": "scenario"
            },
            {
              "correct": "Yes, if the product actually delivers value. It is 'Marketing'.",
              "difficulty": "medium",
              "exerciseId": "B1-4-P1-E9",
              "feedback": {
                "correct": "Correct. Inspiring people with abstract language is leadership/marketing. It becomes 'Dark' only when the product is a lie (Fraud).",
                "incorrect": "Vagueness isn't a lie; it's a wrapper. The content inside determines the ethics."
              },
              "options": [
                "Yes, if the product actually delivers value. It is 'Marketing'.",
                "No, it is deception.",
                "Yes, lie as much as you want.",
                "No, be boring."
              ],
              "question": "Is using Milton language ethical?",
              "scene": "You are marketing a product. You can list specific specs (boring) or use Milton language ('Experience the revolution').",
              "type": "ethical-dilemma"
            },
            {
              "answers": [
                "conscious",
                "subconscious"
              ],
              "difficulty": "medium",
              "exerciseId": "B1-4-P1-E10",
              "feedback": {
                "correct": "Correct. Specifics invite critique ('Is that true?'). Vagueness invites imagination ('What does that mean to me?'). Imagination is subconscious.",
                "incorrect": "Conscious mind analyzes data. Subconscious mind processes symbols and feelings."
              },
              "options": [
                "conscious",
                "subconscious",
                "happy",
                "sad"
              ],
              "sentence": "Specific language targets the (--------) mind. Vague language targets the (--------) mind.",
              "type": "fill-in"
            },
            {
              "correct": "Adding a question to the end of a statement to force agreement (e.g., 'It's a nice day, *isn't it*?').",
              "difficulty": "easy",
              "exerciseId": "B1-4-P1-E11",
              "feedback": {
                "correct": "Correct. It turns a statement into a question that demands a 'Yes.' It builds the Yes Set.",
                "incorrect": "It is a specific grammatical structure designed to reduce resistance."
              },
              "options": [
                "Adding a question to the end of a statement to force agreement (e.g., 'It's a nice day, *isn't it*?').",
                "Playing tag.",
                "Asking for a price tag.",
                "Being rude."
              ],
              "question": "What is a 'Tag Question'?",
              "type": "multiple-choice"
            },
            {
              "correct": "The Referential Index (Who is 'People'?).",
              "difficulty": "hard",
              "exerciseId": "B1-4-P1-E12",
              "feedback": {
                "correct": "Correct. The sentence lacks a specific subject ('Referential Index'). This allows the listener to insert themselves into the sentence: 'I can easily learn.'",
                "incorrect": "It is grammatically correct but semantically vague. It invites projection."
              },
              "options": [
                "The Referential Index (Who is 'People'?).",
                "The verb.",
                "The period.",
                "The truth."
              ],
              "question": "What is missing from this sentence?",
              "scene": "Scenario: 'People can easily learn.'",
              "type": "scenario"
            },
            {
              "correct": "True",
              "difficulty": "easy",
              "exerciseId": "B1-4-P1-E13",
              "feedback": {
                "correct": "Correct. It frames the next sentence as a 'Secret,' which triggers the listener to lean in and value the information more.",
                "incorrect": "It creates 'Artificial Scarcity' for the information."
              },
              "options": [
                "True",
                "False"
              ],
              "question": "Is this a conversational frame used to build fake intimacy?",
              "scene": "Scenario: 'I shouldn't tell you this, but...'",
              "type": "true-false"
            },
            {
              "difficulty": "medium",
              "exerciseId": "B1-4-P1-E14",
              "feedback": {
                "correct": "Correct. 'You know what I mean' is a trap. If you say 'No,' you break rapport. So you say 'Yes' without understanding.",
                "incorrect": "Look at the pressure. What does the phrase force you to do?"
              },
              "pairs": [
                {
                  "definition": "Forces you to agree to avoid looking stupid.",
                  "term": "\"You know what I mean.\""
                },
                {
                  "definition": "Appeals to an undefined moral authority.",
                  "term": "\"This is the right thing to do.\""
                },
                {
                  "definition": "Appeals to vague authority (which studies?).",
                  "term": "\"Studies show...\""
                }
              ],
              "question": "Match the Vague Statement to the Effect:",
              "type": "matching"
            },
            {
              "caseTitle": "Part 1 Complete: The Fog",
              "correct": "Practice: Drilling Down into Fluff (The Meta Model).",
              "difficulty": "easy",
              "exerciseId": "B1-4-P1-E15",
              "feedback": {
                "correct": "Correct. The defense against the Milton Model (Vagueness) is the Meta Model (Specificity). We will learn to ask: 'Who specifically? What specifically?'",
                "incorrect": "Next up: How to pierce the fog with questions."
              },
              "options": [
                "Practice: Drilling Down into Fluff (The Meta Model).",
                "Speaking clearly.",
                "Writing poetry.",
                "Lesson A1-1."
              ],
              "question": "In Part 2, we will practice:",
              "scene": "You have learned that clarity creates resistance, but fog creates compliance. The Milton Model is the art of the fog.",
              "type": "case-analysis"
            }
          ],
          "screenId": "B1-4-P1-S2",
          "screenType": "Exercises",
          "title": "Defining the Fog"
        }
      ],
      "gamification": {
        "badgeOnCompletion": null,
        "pointsValue": 100,
        "progressRings": [
          {
            "label": "Part 1",
            "ringId": "learn",
            "status": "pending"
          },
          {
            "label": "Part 2",
            "ringId": "practice",
            "status": "pending"
          },
          {
            "label": "Part 3",
            "ringId": "challenge",
            "status": "pending"
          }
        ],
        "starsAvailable": 3
      },
      "lessonId": "B1-4",
      "lessonJSON": {
        "contentScreens": [
          {
            "content": [
              {
                "text": "Most people think persuasion requires precise arguments. The **Milton Model** proves the opposite: Vague language is often more powerful.",
                "type": "paragraph"
              },
              {
                "text": "If I say 'This car is fast,' you can argue. If I say 'This car will give you *the feeling you've been looking for*,' you cannot argue, because you fill in the blank with your own desire.",
                "type": "paragraph"
              },
              {
                "alertType": "warning",
                "text": "Key Concept: **Artful Vagueness**. Being specific creates resistance. Being vague creates agreement.",
                "type": "alert"
              }
            ],
            "screenId": "B1-4-P1-S1",
            "screenType": "Learn",
            "title": "The Art of Saying Nothing"
          },
          {
            "exercises": [
              {
                "correct": "A style of language that is artfully vague, abstract, and metaphorical, used to induce trance and bypass critical thinking.",
                "difficulty": "easy",
                "exerciseId": "B1-4-P1-E1",
                "feedback": {
                  "correct": "Correct. Named after hypnotherapist Milton Erickson. It uses 'fluff' to distract the conscious mind so the subconscious accepts the suggestion.",
                  "incorrect": "It is the opposite of specific. It is the language of poets, politicians, and psychics."
                },
                "options": [
                  "A set of specific commands.",
                  "A style of language that is artfully vague, abstract, and metaphorical, used to induce trance and bypass critical thinking.",
                  "A fashion brand.",
                  "Speaking loudly."
                ],
                "question": "What is the **Milton Model**?",
                "type": "multiple-choice"
              },
              {
                "correct": "Because it is a **Barnum Statement**: A statement so vague that it applies to everyone, but feels personal.",
                "difficulty": "medium",
                "exerciseId": "B1-4-P1-E2",
                "feedback": {
                  "correct": "Correct. Who *doesn't* feel they have unused potential? Your brain fills in the specific details ('My novel,' 'My gym routine'), making the statement feel true for *you*.",
                  "incorrect": "It isn't psychic ability. It is a statistical probability that applies to 99% of humans."
                },
                "options": [
                  "Because they are psychic.",
                  "Because it is a **Barnum Statement**: A statement so vague that it applies to everyone, but feels personal.",
                  "Because it is specific.",
                  "Because you are special."
                ],
                "question": "Why does everyone agree with this statement?",
                "scene": "Scenario: A psychic says, 'I sense that you have a great deal of unused capacity that you have not turned to your advantage yet.'",
                "type": "scenario"
              },
              {
                "answers": [
                  "transderivational"
                ],
                "difficulty": "hard",
                "exerciseId": "B1-4-P1-E3",
                "feedback": {
                  "correct": "Correct. A 'Transderivational Search' means your brain goes inside its own memories to find a match for the vague words. This internal focus creates a light trance.",
                  "incorrect": "It is a specific NLP term. The brain goes *inward* to derive meaning."
                },
                "options": [
                  "transderivational",
                  "Google",
                  "quick",
                  "slow"
                ],
                "sentence": "Vague language forces the listener to perform a (--------) Search to find meaning.",
                "type": "fill-in"
              },
              {
                "correct": "True",
                "difficulty": "easy",
                "exerciseId": "B1-4-P1-E4",
                "feedback": {
                  "correct": "Correct. This is a 'Generic Mind Read.' It claims to know your thoughts without knowing anything. Everyone is wondering about 'many things.'",
                  "incorrect": "It mimics telepathy by stating a universal human experience."
                },
                "options": [
                  "True",
                  "False"
                ],
                "question": "Is this a Mind Read?",
                "scene": "Scenario: 'I know you are wondering about *many things* right now.'",
                "type": "true-false"
              },
              {
                "difficulty": "medium",
                "exerciseId": "B1-4-P1-E5",
                "feedback": {
                  "correct": "Correct. 'Lost Performative' hides the source of the opinion. 'Universal Quantifier' uses absolutes (All, Every, Never).",
                  "incorrect": "Look for the missing information. Who thinks it? Who is 'Everyone'?"
                },
                "pairs": [
                  {
                    "definition": "\"I know what you're thinking.\"",
                    "term": "Mind Read"
                  },
                  {
                    "definition": "\"It is important to decide now.\" (Who says it's important?)",
                    "term": "Lost Performative"
                  },
                  {
                    "definition": "\"Everyone knows this is the best deal.\"",
                    "term": "Universal Quantifier"
                  }
                ],
                "question": "Match the Milton Pattern to the Example:",
                "type": "matching"
              },
              {
                "correct": "The listener fills in the blanks",
                "difficulty": "easy",
                "exerciseId": "B1-4-P1-E6",
                "feedback": {
                  "correct": "Correct. If I say 'Success,' you imagine *your* version of success. I don't have to promise anything specific, yet you feel promised.",
                  "incorrect": "The speaker provides the frame; the listener provides the picture."
                },
                "question": "Arrange the words to define the danger of vague speech:",
                "type": "build-sentence",
                "words": [
                  "The",
                  "blanks",
                  "fills",
                  "the",
                  "listener",
                  "in"
                ]
              },
              {
                "correct": "Cause and Effect Linkage",
                "difficulty": "hard",
                "exerciseId": "B1-4-P1-E7",
                "feedback": {
                  "correct": "Correct. It creates a fake logic. Relaxation does not cause agreement, but the sentence links them. Your brain accepts the link.",
                  "incorrect": "It connects X to Y. 'As you sit there (X), you will feel happy (Y).'"
                },
                "options": [
                  "Cause and Effect Linkage",
                  "Gaslighting",
                  "Honesty",
                  "A question"
                ],
                "question": "What is this called?",
                "scene": "A linguistic pattern that links two unrelated ideas so that if one is true, the other must be true (e.g., 'The more you relax, the more you will agree').",
                "type": "reverse-scenario"
              },
              {
                "correct": "Nominalizations (Frozen Verbs).",
                "difficulty": "medium",
                "exerciseId": "B1-4-P1-E8",
                "feedback": {
                  "correct": "Correct. A 'Nominalization' is a verb turned into a noun. You can't put 'Freedom' in a wheelbarrow. It is an abstract concept that means different things to everyone.",
                  "incorrect": "They aren't plans. They are abstract nouns that trap your attention because you have to search for their meaning."
                },
                "options": [
                  "Nominalizations (Frozen Verbs).",
                  "Facts.",
                  "Plans.",
                  "Lies."
                ],
                "question": "These words ('Hope', 'Freedom') are called:",
                "scene": "Scenario: A politician says, 'We need to restore Hope and Freedom to our great nation!'",
                "type": "scenario"
              },
              {
                "correct": "Yes, if the product actually delivers value. It is 'Marketing'.",
                "difficulty": "medium",
                "exerciseId": "B1-4-P1-E9",
                "feedback": {
                  "correct": "Correct. Inspiring people with abstract language is leadership/marketing. It becomes 'Dark' only when the product is a lie (Fraud).",
                  "incorrect": "Vagueness isn't a lie; it's a wrapper. The content inside determines the ethics."
                },
                "options": [
                  "Yes, if the product actually delivers value. It is 'Marketing'.",
                  "No, it is deception.",
                  "Yes, lie as much as you want.",
                  "No, be boring."
                ],
                "question": "Is using Milton language ethical?",
                "scene": "You are marketing a product. You can list specific specs (boring) or use Milton language ('Experience the revolution').",
                "type": "ethical-dilemma"
              },
              {
                "answers": [
                  "conscious",
                  "subconscious"
                ],
                "difficulty": "medium",
                "exerciseId": "B1-4-P1-E10",
                "feedback": {
                  "correct": "Correct. Specifics invite critique ('Is that true?'). Vagueness invites imagination ('What does that mean to me?'). Imagination is subconscious.",
                  "incorrect": "Conscious mind analyzes data. Subconscious mind processes symbols and feelings."
                },
                "options": [
                  "conscious",
                  "subconscious",
                  "happy",
                  "sad"
                ],
                "sentence": "Specific language targets the (--------) mind. Vague language targets the (--------) mind.",
                "type": "fill-in"
              },
              {
                "correct": "Adding a question to the end of a statement to force agreement (e.g., 'It's a nice day, *isn't it*?').",
                "difficulty": "easy",
                "exerciseId": "B1-4-P1-E11",
                "feedback": {
                  "correct": "Correct. It turns a statement into a question that demands a 'Yes.' It builds the Yes Set.",
                  "incorrect": "It is a specific grammatical structure designed to reduce resistance."
                },
                "options": [
                  "Adding a question to the end of a statement to force agreement (e.g., 'It's a nice day, *isn't it*?').",
                  "Playing tag.",
                  "Asking for a price tag.",
                  "Being rude."
                ],
                "question": "What is a 'Tag Question'?",
                "type": "multiple-choice"
              },
              {
                "correct": "The Referential Index (Who is 'People'?).",
                "difficulty": "hard",
                "exerciseId": "B1-4-P1-E12",
                "feedback": {
                  "correct": "Correct. The sentence lacks a specific subject ('Referential Index'). This allows the listener to insert themselves into the sentence: 'I can easily learn.'",
                  "incorrect": "It is grammatically correct but semantically vague. It invites projection."
                },
                "options": [
                  "The Referential Index (Who is 'People'?).",
                  "The verb.",
                  "The period.",
                  "The truth."
                ],
                "question": "What is missing from this sentence?",
                "scene": "Scenario: 'People can easily learn.'",
                "type": "scenario"
              },
              {
                "correct": "True",
                "difficulty": "easy",
                "exerciseId": "B1-4-P1-E13",
                "feedback": {
                  "correct": "Correct. It frames the next sentence as a 'Secret,' which triggers the listener to lean in and value the information more.",
                  "incorrect": "It creates 'Artificial Scarcity' for the information."
                },
                "options": [
                  "True",
                  "False"
                ],
                "question": "Is this a conversational frame used to build fake intimacy?",
                "scene": "Scenario: 'I shouldn't tell you this, but...'",
                "type": "true-false"
              },
              {
                "difficulty": "medium",
                "exerciseId": "B1-4-P1-E14",
                "feedback": {
                  "correct": "Correct. 'You know what I mean' is a trap. If you say 'No,' you break rapport. So you say 'Yes' without understanding.",
                  "incorrect": "Look at the pressure. What does the phrase force you to do?"
                },
                "pairs": [
                  {
                    "definition": "Forces you to agree to avoid looking stupid.",
                    "term": "\"You know what I mean.\""
                  },
                  {
                    "definition": "Appeals to an undefined moral authority.",
                    "term": "\"This is the right thing to do.\""
                  },
                  {
                    "definition": "Appeals to vague authority (which studies?).",
                    "term": "\"Studies show...\""
                  }
                ],
                "question": "Match the Vague Statement to the Effect:",
                "type": "matching"
              },
              {
                "caseTitle": "Part 1 Complete: The Fog",
                "correct": "Practice: Drilling Down into Fluff (The Meta Model).",
                "difficulty": "easy",
                "exerciseId": "B1-4-P1-E15",
                "feedback": {
                  "correct": "Correct. The defense against the Milton Model (Vagueness) is the Meta Model (Specificity). We will learn to ask: 'Who specifically? What specifically?'",
                  "incorrect": "Next up: How to pierce the fog with questions."
                },
                "options": [
                  "Practice: Drilling Down into Fluff (The Meta Model).",
                  "Speaking clearly.",
                  "Writing poetry.",
                  "Lesson A1-1."
                ],
                "question": "In Part 2, we will practice:",
                "scene": "You have learned that clarity creates resistance, but fog creates compliance. The Milton Model is the art of the fog.",
                "type": "case-analysis"
              }
            ],
            "screenId": "B1-4-P1-S2",
            "screenType": "Exercises",
            "title": "Defining the Fog"
          }
        ],
        "gamification": {
          "badgeOnCompletion": null,
          "pointsValue": 100,
          "progressRings": [
            {
              "label": "Part 1",
              "ringId": "learn",
              "status": "pending"
            },
            {
              "label": "Part 2",
              "ringId": "practice",
              "status": "pending"
            },
            {
              "label": "Part 3",
              "ringId": "challenge",
              "status": "pending"
            }
          ],
          "starsAvailable": 3
        },
        "lessonId": "B1-4",
        "lessonPart": 1,
        "lessonPartTitle": "The Concept: Artfully Vague Speech (Barnum Statements)",
        "lessonTitle": "The \"Milton Model\": Weaponized Vague Language",
        "lessonType": "Normal",
        "objective": "To define the 'Milton Model' and 'Barnum Statements' as techniques of using intentionally vague language to force the listener to project their own meaning onto the speaker's words.",
        "sectionId": "B",
        "sectionTitle": "The Tools of Influence",
        "unitId": "B1",
        "unitTitle": "The Silver Tongue: NLP & Covert Hypnosis"
      },
      "lessonPart": 1,
      "lessonPartTitle": "The Concept: Artfully Vague Speech (Barnum Statements)",
      "lessonTitle": "The \"Milton Model\": Weaponized Vague Language",
      "lessonType": "Normal",
      "objective": "To define the 'Milton Model' and 'Barnum Statements' as techniques of using intentionally vague language to force the listener to project their own meaning onto the speaker's words.",
      "sectionId": "B",
      "sectionTitle": "The Tools of Influence",
      "title": "B1-4-Part1",
      "unitId": "B1",
      "unitTitle": "The Silver Tongue: NLP & Covert Hypnosis"
    },
    {
      "_id": "j97dp0nxec5dtqjp06pe7rzgwn7xky3s",
      "contentScreens": [
        {
          "content": [
            {
              "text": "The antidote to the Milton Model (Vagueness) is the **Meta Model** (Specificity). When a manipulator uses 'Fluff,' you must use a drill.",
              "type": "paragraph"
            },
            {
              "alertType": "warning",
              "text": "Your Tool: The Challenge Question. 'Who specifically?' 'How specifically?' 'According to whom?'",
              "type": "alert"
            }
          ],
          "screenId": "B1-4-P2-S1",
          "screenType": "Learn",
          "title": "Practice: The Meta Model"
        },
        {
          "exercises": [
            {
              "correct": "'Who is *They*, specifically?'",
              "difficulty": "easy",
              "exerciseId": "B1-4-P2-E1",
              "feedback": {
                "correct": "Correct. The manipulator hides the source of the opinion ('They'). You must force them to reveal the source. Often, 'They' doesn't exist.",
                "incorrect": "Asking 'Why' accepts the premise. You need to find the *source* of the statement first."
              },
              "options": [
                "'Who is *They*, specifically?'",
                "'Why is it the best?'",
                "'I agree.'",
                "'That's interesting.'"
              ],
              "question": "How do you challenge this 'Lost Performative'?",
              "scene": "Scenario: 'They say this is the best option.'",
              "type": "scenario"
            },
            {
              "correct": "A verb that describes an action but leaves out *how* it is done (e.g., 'This will *change* your life').",
              "difficulty": "medium",
              "exerciseId": "B1-4-P2-E2",
              "feedback": {
                "correct": "Correct. 'Change' how? For better or worse? By doing what? The vagueness allows you to imagine a positive change.",
                "incorrect": "It is an action word (verb) that lacks detail."
              },
              "options": [
                "A verb that describes an action but leaves out *how* it is done (e.g., 'This will *change* your life').",
                "A noun.",
                "A loud noise.",
                "A lie."
              ],
              "question": "What is an 'Unspecified Verb'?",
              "type": "multiple-choice"
            },
            {
              "correct": "'Who needs to communicate what to whom, and how?' (Turning the noun back into a verb).",
              "difficulty": "hard",
              "exerciseId": "B1-4-P2-E3",
              "feedback": {
                "correct": "Correct. 'Communication' is a frozen noun. You must thaw it out into specific actions to solve the problem.",
                "incorrect": "Agreeing with the vague noun solves nothing. You need the specifics of the action."
              },
              "options": [
                "'Yes, we do.'",
                "'Who needs to communicate what to whom, and how?' (Turning the noun back into a verb).",
                "'Communication is key.'",
                "'You are right.'"
              ],
              "question": "What is the Meta Model challenge?",
              "scene": "Scenario: 'We need to improve *communication* around here.' (Nominalization).",
              "type": "scenario"
            },
            {
              "correct": "True",
              "difficulty": "easy",
              "exerciseId": "B1-4-P2-E4",
              "feedback": {
                "correct": "Correct. They pretend to know your thoughts ('You know...') to pressure you into agreeing. If you say 'No, I don't,' you break the spell.",
                "incorrect": "It is a pressure tactic. It assumes shared knowledge that might not exist."
              },
              "options": [
                "True",
                "False"
              ],
              "question": "Is this a 'Mind Read' designed to stop you from asking questions?",
              "scene": "Scenario: 'You know exactly what I'm talking about.'",
              "type": "true-false"
            },
            {
              "difficulty": "medium",
              "exerciseId": "B1-4-P2-E5",
              "feedback": {
                "correct": "Correct. Universal Quantifiers ('Everyone') are challenged by counter-examples. Lost Performatives ('It is') are challenged by asking for the source.",
                "incorrect": "Find the missing information and ask for it."
              },
              "pairs": [
                {
                  "definition": "Drill: \"Everyone? Name one person who doesn't.\"",
                  "term": "\"Everyone knows...\""
                },
                {
                  "definition": "Drill: \"Obvious to whom?\"",
                  "term": "\"It is obvious...\""
                },
                {
                  "definition": "Drill: \"How specifically does it hurt you?\"",
                  "term": "\"This hurts me...\""
                }
              ],
              "question": "Match the Fluff to the Drill:",
              "type": "matching"
            },
            {
              "answers": [
                "deleted"
              ],
              "difficulty": "medium",
              "exerciseId": "B1-4-P2-E6",
              "feedback": {
                "correct": "Correct. The speaker 'deleted' the details to be vague. Your questions recover the deleted data.",
                "incorrect": "The information isn't added; it was left out (deleted)."
              },
              "options": [
                "deleted",
                "added",
                "false",
                "fun"
              ],
              "sentence": "The Meta Model recovers (--------) information from the speaker's deep structure.",
              "type": "fill-in"
            },
            {
              "correct": "'How specifically does my action cause you to choose anger?'",
              "difficulty": "hard",
              "exerciseId": "B1-4-P2-E7",
              "feedback": {
                "correct": "Correct. You challenge the link. You cannot *make* someone angry; they choose to react with anger. This question returns responsibility to them.",
                "incorrect": "Apologizing accepts the false premise that you control their emotions."
              },
              "options": [
                "'I'm sorry.'",
                "'How specifically does my action cause you to choose anger?'",
                "'You are mean.'",
                "Stop talking."
              ],
              "question": "This is 'Cause-Effect' distortion. How do you challenge it?",
              "scene": "Scenario: 'You are making me angry.'",
              "type": "scenario"
            },
            {
              "correct": "Reconnect language to experience",
              "difficulty": "medium",
              "exerciseId": "B1-4-P2-E8",
              "feedback": {
                "correct": "Correct. Vague language floats in the air. Specific language connects to ground-level reality (experience).",
                "incorrect": "We want to ground the words in sensory facts."
              },
              "question": "Arrange the words to define the goal of the Meta Model:",
              "type": "build-sentence",
              "words": [
                "from",
                "Reconnect",
                "language",
                "to",
                "experience"
              ]
            },
            {
              "correct": "Universal Quantifier (Generalization)",
              "difficulty": "medium",
              "exerciseId": "B1-4-P2-E9",
              "feedback": {
                "correct": "Correct. Words like All, Every, Always, Never. They create a rigid, false reality. Challenge: 'All men? Every single one?'",
                "incorrect": "It takes one example and applies it to the universe. It is a generalization."
              },
              "options": [
                "Universal Quantifier (Generalization)",
                "Mind Reading",
                "Nominalization",
                "Tag Question"
              ],
              "question": "What is this pattern?",
              "scene": "A statement like 'All men are liars' or 'Women are too emotional.'",
              "type": "reverse-scenario"
            },
            {
              "correct": "'Bad for whom?'",
              "difficulty": "medium",
              "exerciseId": "B1-4-P2-E10",
              "feedback": {
                "correct": "Correct. They deleted the person. It might be bad for *them* (loss of commission), but good for *you*. Find out who loses.",
                "incorrect": "'Why' invites more fluff. 'For whom' demands a specific person."
              },
              "options": [
                "'Bad for whom?'",
                "'Why?'",
                "'Okay.'",
                "'Is it?'"
              ],
              "question": "The challenge is:",
              "scene": "Scenario: 'It would be bad if you didn't sign today.'",
              "type": "scenario"
            },
            {
              "correct": "Because they are meaningless containers. The follower pours their own meaning in, feeling 'understood' by the leader.",
              "difficulty": "hard",
              "exerciseId": "B1-4-P2-E11",
              "feedback": {
                "correct": "Correct. 'The Truth' sounds profound but means nothing. It is a blank check for the mind.",
                "incorrect": "They aren't specific; they are infinite. Infinite meaning = Infinite control."
              },
              "options": [
                "Because they are meaningless containers. The follower pours their own meaning in, feeling 'understood' by the leader.",
                "Because they are specific.",
                "Because they are short words.",
                "No reason."
              ],
              "question": "Why do cult leaders use 'Nominalizations' like 'The Truth,' 'The Way,' or 'The Awakening'?",
              "type": "multiple-choice"
            },
            {
              "correct": "True",
              "difficulty": "hard",
              "exerciseId": "B1-4-P2-E12",
              "feedback": {
                "correct": "Correct. Words like Should, Must, Have to. They imply a rule without stating the consequence. Challenge: 'What would happen if I did?'",
                "incorrect": "It implies necessity. Challenge the consequence."
              },
              "options": [
                "True",
                "False"
              ],
              "question": "Is this a 'Modal Operator of Necessity'?",
              "scene": "Scenario: 'You shouldn't do that.'",
              "type": "true-false"
            },
            {
              "correct": "'How do you know that?' (Demand Evidence).",
              "difficulty": "medium",
              "exerciseId": "B1-4-P2-E13",
              "feedback": {
                "correct": "Correct. Force them to reveal their observation ('Because you are frowning'). If they can't, they are projecting.",
                "incorrect": "Don't accept the premise. Make them show their work."
              },
              "options": [
                "'How do you know that?' (Demand Evidence).",
                "'You're right.'",
                "'I'm not unhappy!' (Defensive).",
                "Crying."
              ],
              "question": "What is the best response?",
              "scene": "Scenario: 'I know you are unhappy.' (Mind Read).",
              "type": "scenario"
            },
            {
              "answers": [
                "surface",
                "deep"
              ],
              "difficulty": "hard",
              "exerciseId": "B1-4-P2-E14",
              "feedback": {
                "correct": "Correct. The Surface Structure is what is said (The deletions). The Deep Structure is what is meant (The full truth).",
                "incorrect": "You are digging down. Surface -> Deep."
              },
              "options": [
                "surface",
                "deep",
                "loud",
                "quiet"
              ],
              "sentence": "When you use the Meta Model, you move from the (--------) structure to the (--------) structure of language.",
              "type": "fill-in"
            },
            {
              "caseTitle": "Part 2 Complete: The Drill",
              "correct": "The 'Guru' Simulation (Debating a master of vague speech).",
              "difficulty": "easy",
              "exerciseId": "B1-4-P2-E15",
              "feedback": {
                "correct": "Correct. Can you hold your ground against someone who speaks entirely in riddles and metaphors? Let's see.",
                "incorrect": "Next up: Facing the ultimate vague speaker."
              },
              "options": [
                "The 'Guru' Simulation (Debating a master of vague speech).",
                "Becoming a Guru.",
                "Chanting.",
                "Lesson A1-1."
              ],
              "question": "In Part 3, we will face the Challenge:",
              "scene": "You have learned to question the fluff. You know that 'Everyone' is a generalization and 'It is bad' is a missing opinion.",
              "type": "case-analysis"
            }
          ],
          "screenId": "B1-4-P2-S2",
          "screenType": "Exercises",
          "title": "Drilling Down"
        }
      ],
      "gamification": {
        "badgeOnCompletion": null,
        "pointsValue": 100,
        "progressRings": [
          {
            "label": "Part 1",
            "ringId": "learn",
            "status": "completed"
          },
          {
            "label": "Part 2",
            "ringId": "practice",
            "status": "pending"
          },
          {
            "label": "Part 3",
            "ringId": "challenge",
            "status": "pending"
          }
        ],
        "starsAvailable": 3
      },
      "lessonId": "B1-4",
      "lessonJSON": {
        "contentScreens": [
          {
            "content": [
              {
                "text": "The antidote to the Milton Model (Vagueness) is the **Meta Model** (Specificity). When a manipulator uses 'Fluff,' you must use a drill.",
                "type": "paragraph"
              },
              {
                "alertType": "warning",
                "text": "Your Tool: The Challenge Question. 'Who specifically?' 'How specifically?' 'According to whom?'",
                "type": "alert"
              }
            ],
            "screenId": "B1-4-P2-S1",
            "screenType": "Learn",
            "title": "Practice: The Meta Model"
          },
          {
            "exercises": [
              {
                "correct": "'Who is *They*, specifically?'",
                "difficulty": "easy",
                "exerciseId": "B1-4-P2-E1",
                "feedback": {
                  "correct": "Correct. The manipulator hides the source of the opinion ('They'). You must force them to reveal the source. Often, 'They' doesn't exist.",
                  "incorrect": "Asking 'Why' accepts the premise. You need to find the *source* of the statement first."
                },
                "options": [
                  "'Who is *They*, specifically?'",
                  "'Why is it the best?'",
                  "'I agree.'",
                  "'That's interesting.'"
                ],
                "question": "How do you challenge this 'Lost Performative'?",
                "scene": "Scenario: 'They say this is the best option.'",
                "type": "scenario"
              },
              {
                "correct": "A verb that describes an action but leaves out *how* it is done (e.g., 'This will *change* your life').",
                "difficulty": "medium",
                "exerciseId": "B1-4-P2-E2",
                "feedback": {
                  "correct": "Correct. 'Change' how? For better or worse? By doing what? The vagueness allows you to imagine a positive change.",
                  "incorrect": "It is an action word (verb) that lacks detail."
                },
                "options": [
                  "A verb that describes an action but leaves out *how* it is done (e.g., 'This will *change* your life').",
                  "A noun.",
                  "A loud noise.",
                  "A lie."
                ],
                "question": "What is an 'Unspecified Verb'?",
                "type": "multiple-choice"
              },
              {
                "correct": "'Who needs to communicate what to whom, and how?' (Turning the noun back into a verb).",
                "difficulty": "hard",
                "exerciseId": "B1-4-P2-E3",
                "feedback": {
                  "correct": "Correct. 'Communication' is a frozen noun. You must thaw it out into specific actions to solve the problem.",
                  "incorrect": "Agreeing with the vague noun solves nothing. You need the specifics of the action."
                },
                "options": [
                  "'Yes, we do.'",
                  "'Who needs to communicate what to whom, and how?' (Turning the noun back into a verb).",
                  "'Communication is key.'",
                  "'You are right.'"
                ],
                "question": "What is the Meta Model challenge?",
                "scene": "Scenario: 'We need to improve *communication* around here.' (Nominalization).",
                "type": "scenario"
              },
              {
                "correct": "True",
                "difficulty": "easy",
                "exerciseId": "B1-4-P2-E4",
                "feedback": {
                  "correct": "Correct. They pretend to know your thoughts ('You know...') to pressure you into agreeing. If you say 'No, I don't,' you break the spell.",
                  "incorrect": "It is a pressure tactic. It assumes shared knowledge that might not exist."
                },
                "options": [
                  "True",
                  "False"
                ],
                "question": "Is this a 'Mind Read' designed to stop you from asking questions?",
                "scene": "Scenario: 'You know exactly what I'm talking about.'",
                "type": "true-false"
              },
              {
                "difficulty": "medium",
                "exerciseId": "B1-4-P2-E5",
                "feedback": {
                  "correct": "Correct. Universal Quantifiers ('Everyone') are challenged by counter-examples. Lost Performatives ('It is') are challenged by asking for the source.",
                  "incorrect": "Find the missing information and ask for it."
                },
                "pairs": [
                  {
                    "definition": "Drill: \"Everyone? Name one person who doesn't.\"",
                    "term": "\"Everyone knows...\""
                  },
                  {
                    "definition": "Drill: \"Obvious to whom?\"",
                    "term": "\"It is obvious...\""
                  },
                  {
                    "definition": "Drill: \"How specifically does it hurt you?\"",
                    "term": "\"This hurts me...\""
                  }
                ],
                "question": "Match the Fluff to the Drill:",
                "type": "matching"
              },
              {
                "answers": [
                  "deleted"
                ],
                "difficulty": "medium",
                "exerciseId": "B1-4-P2-E6",
                "feedback": {
                  "correct": "Correct. The speaker 'deleted' the details to be vague. Your questions recover the deleted data.",
                  "incorrect": "The information isn't added; it was left out (deleted)."
                },
                "options": [
                  "deleted",
                  "added",
                  "false",
                  "fun"
                ],
                "sentence": "The Meta Model recovers (--------) information from the speaker's deep structure.",
                "type": "fill-in"
              },
              {
                "correct": "'How specifically does my action cause you to choose anger?'",
                "difficulty": "hard",
                "exerciseId": "B1-4-P2-E7",
                "feedback": {
                  "correct": "Correct. You challenge the link. You cannot *make* someone angry; they choose to react with anger. This question returns responsibility to them.",
                  "incorrect": "Apologizing accepts the false premise that you control their emotions."
                },
                "options": [
                  "'I'm sorry.'",
                  "'How specifically does my action cause you to choose anger?'",
                  "'You are mean.'",
                  "Stop talking."
                ],
                "question": "This is 'Cause-Effect' distortion. How do you challenge it?",
                "scene": "Scenario: 'You are making me angry.'",
                "type": "scenario"
              },
              {
                "correct": "Reconnect language to experience",
                "difficulty": "medium",
                "exerciseId": "B1-4-P2-E8",
                "feedback": {
                  "correct": "Correct. Vague language floats in the air. Specific language connects to ground-level reality (experience).",
                  "incorrect": "We want to ground the words in sensory facts."
                },
                "question": "Arrange the words to define the goal of the Meta Model:",
                "type": "build-sentence",
                "words": [
                  "from",
                  "Reconnect",
                  "language",
                  "to",
                  "experience"
                ]
              },
              {
                "correct": "Universal Quantifier (Generalization)",
                "difficulty": "medium",
                "exerciseId": "B1-4-P2-E9",
                "feedback": {
                  "correct": "Correct. Words like All, Every, Always, Never. They create a rigid, false reality. Challenge: 'All men? Every single one?'",
                  "incorrect": "It takes one example and applies it to the universe. It is a generalization."
                },
                "options": [
                  "Universal Quantifier (Generalization)",
                  "Mind Reading",
                  "Nominalization",
                  "Tag Question"
                ],
                "question": "What is this pattern?",
                "scene": "A statement like 'All men are liars' or 'Women are too emotional.'",
                "type": "reverse-scenario"
              },
              {
                "correct": "'Bad for whom?'",
                "difficulty": "medium",
                "exerciseId": "B1-4-P2-E10",
                "feedback": {
                  "correct": "Correct. They deleted the person. It might be bad for *them* (loss of commission), but good for *you*. Find out who loses.",
                  "incorrect": "'Why' invites more fluff. 'For whom' demands a specific person."
                },
                "options": [
                  "'Bad for whom?'",
                  "'Why?'",
                  "'Okay.'",
                  "'Is it?'"
                ],
                "question": "The challenge is:",
                "scene": "Scenario: 'It would be bad if you didn't sign today.'",
                "type": "scenario"
              },
              {
                "correct": "Because they are meaningless containers. The follower pours their own meaning in, feeling 'understood' by the leader.",
                "difficulty": "hard",
                "exerciseId": "B1-4-P2-E11",
                "feedback": {
                  "correct": "Correct. 'The Truth' sounds profound but means nothing. It is a blank check for the mind.",
                  "incorrect": "They aren't specific; they are infinite. Infinite meaning = Infinite control."
                },
                "options": [
                  "Because they are meaningless containers. The follower pours their own meaning in, feeling 'understood' by the leader.",
                  "Because they are specific.",
                  "Because they are short words.",
                  "No reason."
                ],
                "question": "Why do cult leaders use 'Nominalizations' like 'The Truth,' 'The Way,' or 'The Awakening'?",
                "type": "multiple-choice"
              },
              {
                "correct": "True",
                "difficulty": "hard",
                "exerciseId": "B1-4-P2-E12",
                "feedback": {
                  "correct": "Correct. Words like Should, Must, Have to. They imply a rule without stating the consequence. Challenge: 'What would happen if I did?'",
                  "incorrect": "It implies necessity. Challenge the consequence."
                },
                "options": [
                  "True",
                  "False"
                ],
                "question": "Is this a 'Modal Operator of Necessity'?",
                "scene": "Scenario: 'You shouldn't do that.'",
                "type": "true-false"
              },
              {
                "correct": "'How do you know that?' (Demand Evidence).",
                "difficulty": "medium",
                "exerciseId": "B1-4-P2-E13",
                "feedback": {
                  "correct": "Correct. Force them to reveal their observation ('Because you are frowning'). If they can't, they are projecting.",
                  "incorrect": "Don't accept the premise. Make them show their work."
                },
                "options": [
                  "'How do you know that?' (Demand Evidence).",
                  "'You're right.'",
                  "'I'm not unhappy!' (Defensive).",
                  "Crying."
                ],
                "question": "What is the best response?",
                "scene": "Scenario: 'I know you are unhappy.' (Mind Read).",
                "type": "scenario"
              },
              {
                "answers": [
                  "surface",
                  "deep"
                ],
                "difficulty": "hard",
                "exerciseId": "B1-4-P2-E14",
                "feedback": {
                  "correct": "Correct. The Surface Structure is what is said (The deletions). The Deep Structure is what is meant (The full truth).",
                  "incorrect": "You are digging down. Surface -> Deep."
                },
                "options": [
                  "surface",
                  "deep",
                  "loud",
                  "quiet"
                ],
                "sentence": "When you use the Meta Model, you move from the (--------) structure to the (--------) structure of language.",
                "type": "fill-in"
              },
              {
                "caseTitle": "Part 2 Complete: The Drill",
                "correct": "The 'Guru' Simulation (Debating a master of vague speech).",
                "difficulty": "easy",
                "exerciseId": "B1-4-P2-E15",
                "feedback": {
                  "correct": "Correct. Can you hold your ground against someone who speaks entirely in riddles and metaphors? Let's see.",
                  "incorrect": "Next up: Facing the ultimate vague speaker."
                },
                "options": [
                  "The 'Guru' Simulation (Debating a master of vague speech).",
                  "Becoming a Guru.",
                  "Chanting.",
                  "Lesson A1-1."
                ],
                "question": "In Part 3, we will face the Challenge:",
                "scene": "You have learned to question the fluff. You know that 'Everyone' is a generalization and 'It is bad' is a missing opinion.",
                "type": "case-analysis"
              }
            ],
            "screenId": "B1-4-P2-S2",
            "screenType": "Exercises",
            "title": "Drilling Down"
          }
        ],
        "gamification": {
          "badgeOnCompletion": null,
          "pointsValue": 100,
          "progressRings": [
            {
              "label": "Part 1",
              "ringId": "learn",
              "status": "completed"
            },
            {
              "label": "Part 2",
              "ringId": "practice",
              "status": "pending"
            },
            {
              "label": "Part 3",
              "ringId": "challenge",
              "status": "pending"
            }
          ],
          "starsAvailable": 3
        },
        "lessonId": "B1-4",
        "lessonPart": 2,
        "lessonPartTitle": "Practice: Drilling Down into Fluff",
        "lessonTitle": "The \"Milton Model\": Weaponized Vague Language",
        "lessonType": "Normal",
        "objective": "To practice identifying vague language patterns (Nominalizations, Unspecified Verbs, Mind Reads) and using the 'Meta Model' to challenge them with specific questions.",
        "sectionId": "B",
        "sectionTitle": "The Tools of Influence",
        "unitId": "B1",
        "unitTitle": "The Silver Tongue: NLP & Covert Hypnosis"
      },
      "lessonPart": 2,
      "lessonPartTitle": "Practice: Drilling Down into Fluff",
      "lessonTitle": "The \"Milton Model\": Weaponized Vague Language",
      "lessonType": "Normal",
      "objective": "To practice identifying vague language patterns (Nominalizations, Unspecified Verbs, Mind Reads) and using the 'Meta Model' to challenge them with specific questions.",
      "sectionId": "B",
      "sectionTitle": "The Tools of Influence",
      "title": "B1-4-Part2",
      "unitId": "B1",
      "unitTitle": "The Silver Tongue: NLP & Covert Hypnosis"
    },
    {
      "_id": "j97111f4pr6phztx0r1efwznzh7xkpz8",
      "contentScreens": [
        {
          "content": [
            {
              "text": "You are about to face 'The Guru.' They will speak in deep, profound sentences that mean absolutely nothing. Their goal is to make you nod along in a trance.",
              "type": "paragraph"
            },
            {
              "alertType": "warning",
              "text": "Your Goal: Do not nod. Do not agree. Ask: 'How specifically?' until they give you a real answer or reveal they have none.",
              "type": "alert"
            }
          ],
          "screenId": "B1-4-P3-S1",
          "screenType": "Learn",
          "title": "Challenge: Pierce the Fog"
        },
        {
          "exercises": [
            {
              "correct": "'How specifically do I align a vibration? And what specifically do you mean by success?' (Drill Down)",
              "difficulty": "hard",
              "exerciseId": "B1-4-P3-E1",
              "feedback": {
                "correct": "Correct. You refused to accept the abstract concepts ('vibration', 'success') as real things. You demanded the verb (the action).",
                "incorrect": "If you accept the premise that you have a 'vibration' that is 'blocked,' they can sell you the cure. You must challenge the premise."
              },
              "options": [
                "'Oh no! How do I fix my vibration?' (Submission)",
                "'You are right. I feel blocked.' (Acceptance)",
                "'How specifically do I align a vibration? And what specifically do you mean by success?' (Drill Down)",
                "Leave."
              ],
              "question": "This is a 'Word Salad' of Nominalizations. What is the Meta Model defense?",
              "scene": "The Guru looks into your eyes: 'You are blocking your own abundance because your vibration is not aligned with the frequency of success.'",
              "type": "boss-scenario"
            },
            {
              "difficulty": "hard",
              "exerciseId": "B1-4-P3-E2",
              "feedback": {
                "correct": "You survived the Fog. You realized that a promise without a date is just a lie.",
                "incorrect": "You accepted the 'Reward' without knowing what it was. You bought a mystery box."
              },
              "scenarioTitle": "Simulation: The Vague Promise",
              "steps": [
                {
                  "correct": "'What specific process? And what specific reward on what specific date?' (The Audit)",
                  "feedback": {
                    "correct": "Perfect. 'Process' and 'Reward' are empty containers. You forced them to put concrete details inside.",
                    "incorrect": "Trusting a vague process is how people get exploited. Specificity is security."
                  },
                  "options": [
                    "'Okay, I trust you.' (Blind Faith)",
                    "'What specific process? And what specific reward on what specific date?' (The Audit)",
                    "'I hope so.' (Passive)",
                    "'You are lying.' (Attack)"
                  ],
                  "scene": "Manager: 'If you just *trust the process*, you will be *rewarded* soon.'"
                },
                {
                  "correct": "'Faith is not a contract. I need details to do my job.' (Holding Frame)",
                  "feedback": {
                    "correct": "Mastery. They tried to use a 'Nominalization' (Faith) to shame you. You rejected it. Business runs on contracts, not faith.",
                    "incorrect": "They switched the frame from 'Business' to 'Religion' (Faith). Don't follow them there."
                  },
                  "options": [
                    "'I'm sorry, I do have faith.' (Guilt Trip worked)",
                    "'Faith is not a contract. I need details to do my job.' (Holding Frame)",
                    "'The team is great.' (Deflection)",
                    "Quit."
                  ],
                  "question": "Manager: 'Why do you have to be so negative? Don't you have *faith* in the team?' (Shifting to Morality)."
                }
              ],
              "type": "micro-sim"
            },
            {
              "correct": "Because intelligent people have active imaginations. They do the work of filling in the blanks with their own brilliant ideas, thinking the speaker is brilliant too.",
              "difficulty": "medium",
              "exerciseId": "B1-4-P3-E3",
              "feedback": {
                "correct": "Correct. The listener projects their own intelligence onto the vague speaker. It is a 'Projection Trap.'",
                "incorrect": "Intelligence is not a shield; it can be a weakness if you over-interpret meaning where there is none."
              },
              "options": [
                "It doesn't.",
                "Because intelligent people have active imaginations. They do the work of filling in the blanks with their own brilliant ideas, thinking the speaker is brilliant too.",
                "Because intelligent people are gullible.",
                "Because it is logical."
              ],
              "question": "Why does the 'Milton Model' work so well on intelligent people?",
              "type": "multiple-choice"
            },
            {
              "answers": [
                "trance",
                "clarity"
              ],
              "difficulty": "easy",
              "exerciseId": "B1-4-P3-E4",
              "feedback": {
                "correct": "Correct. To hypnotize, go vague. To de-hypnotize, go specific.",
                "incorrect": "Vagueness induces the 'transderivational search' (trance). Clarity wakes you up."
              },
              "options": [
                "trance",
                "clarity",
                "sleep",
                "anger"
              ],
              "sentence": "Vagueness creates (--------). Specificity creates (--------).",
              "type": "fill-in"
            },
            {
              "correct": "'Who is everyone?'",
              "difficulty": "easy",
              "exerciseId": "B1-4-P3-E5",
              "feedback": {
                "correct": "Correct. Force them to name the crowd. Usually, 'Everyone' is just 'Me and my one friend.'",
                "incorrect": "Don't accept the phantom army. Make them count the soldiers."
              },
              "options": [
                "'Who is everyone?'",
                "'Is it?'",
                "'I agree.'",
                "'You are wrong.'"
              ],
              "question": "The Challenge:",
              "scene": "Scenario: 'Everyone knows that this is the wrong direction.' (Universal Quantifier).",
              "type": "scenario"
            },
            {
              "correct": "True",
              "difficulty": "easy",
              "exerciseId": "B1-4-P3-E6",
              "feedback": {
                "correct": "Correct. They claim to know your future mental state. It is a dismissal tactic to stop the argument.",
                "incorrect": "It asserts superior knowledge to shut you down."
              },
              "options": [
                "True",
                "False"
              ],
              "question": "Is this a 'Patronizing Mind Read'?",
              "scene": "Scenario: 'You will understand when you are older.'",
              "type": "true-false"
            },
            {
              "correct": "The map is not the territory",
              "difficulty": "medium",
              "exerciseId": "B1-4-P3-E7",
              "feedback": {
                "correct": "Correct. (Korzybski). The words (Map) are not the reality (Territory). The Meta Model checks the Map against the Territory.",
                "incorrect": "Words are just symbols. You must check if they match reality."
              },
              "question": "Arrange the words to define the Meta Model's power:",
              "type": "build-sentence",
              "words": [
                "The",
                "is",
                "map",
                "territory",
                "not",
                "the"
              ]
            },
            {
              "correct": "A Factive Presupposition",
              "difficulty": "hard",
              "exerciseId": "B1-4-P3-E8",
              "feedback": {
                "correct": "Correct. The word 'realized' presupposes that the 'truth' is a fact. It forces you to accept their version of 'truth' to accept the compliment.",
                "incorrect": "It smuggles an assumption into the sentence."
              },
              "options": [
                "A Factive Presupposition",
                "A Lie",
                "A Compliment",
                "A Question"
              ],
              "question": "What is this?",
              "scene": "A phrase that implies knowledge without stating it, like 'I'm glad you finally *realized* the truth.' (Implies you didn't know it before).",
              "type": "reverse-scenario"
            },
            {
              "correct": "Yes, it is the Milton Model used for mass influence. Whether it is 'bad' depends on the policy behind the words.",
              "difficulty": "medium",
              "exerciseId": "B1-4-P3-E9",
              "feedback": {
                "correct": "Correct. Slogans are 'Nominalizations.' They are empty containers so every voter can project their own wish into them.",
                "incorrect": "It is absolutely manipulation (shaping perception). The ethics depend on the outcome."
              },
              "options": [
                "Yes, it is the Milton Model used for mass influence. Whether it is 'bad' depends on the policy behind the words.",
                "No, it is just speaking.",
                "Yes, all politicians are evil.",
                "No, they mean it."
              ],
              "question": "Is this manipulation?",
              "scene": "A politician uses vague slogans ('Hope,' 'Change,' 'Greatness') to rally a crowd.",
              "type": "ethical-dilemma"
            },
            {
              "correct": "'How specifically does my action of [X] cause you to feel pain?'",
              "difficulty": "hard",
              "exerciseId": "B1-4-P3-E10",
              "feedback": {
                "correct": "Correct. This forces them to trace the link. Often, they can't, because the pain comes from their interpretation, not your action.",
                "incorrect": "Denial ('No I'm not') is a fight. Specificity ('How specifically?') is an investigation."
              },
              "options": [
                "'No I'm not.'",
                "'I am not touching you.'",
                "'How specifically does my action of [X] cause you to feel pain?'",
                "'You are too sensitive.'"
              ],
              "question": "How do you challenge this without being mean?",
              "scene": "Scenario: 'You are hurting me.' (Cause-Effect).",
              "type": "scenario"
            },
            {
              "answers": [
                "riddles"
              ],
              "difficulty": "easy",
              "exerciseId": "B1-4-P3-E11",
              "feedback": {
                "correct": "Correct. If they speak in riddles (metaphors), they can never be proven wrong. 'The river flows uphill' sounds deep, but means nothing.",
                "incorrect": "Facts can be checked. Riddles cannot."
              },
              "options": [
                "riddles",
                "facts",
                "lies",
                "numbers"
              ],
              "sentence": "The Guru speaks in (--------) to avoid being pinned down to a specific meaning.",
              "type": "fill-in"
            },
            {
              "correct": "True",
              "difficulty": "medium",
              "exerciseId": "B1-4-P3-E12",
              "feedback": {
                "correct": "Correct. 'Clearly' to whom? 'No choice' according to whom? It presents an opinion as an objective fact from the universe.",
                "incorrect": "It hides the judge. The speaker is the judge, but they hide behind the word 'Clearly.'"
              },
              "options": [
                "True",
                "False"
              ],
              "question": "Is this a 'Lost Performative'?",
              "scene": "Scenario: 'Clearly, we have no other choice.'",
              "type": "true-false"
            },
            {
              "correct": "No. This is Word Salad.",
              "difficulty": "hard",
              "exerciseId": "B1-4-P3-E13",
              "feedback": {
                "correct": "Correct. They used positive words ('value,' 'ecosystem') but promised zero dollars. It is a non-answer designed to make you feel good while getting nothing.",
                "incorrect": "Don't listen to the tone. Listen to the commitment. There was no number."
              },
              "options": [
                "No. This is Word Salad.",
                "Yes, they said 'value' and 'compensated'.",
                "Maybe.",
                "It sounds like a yes."
              ],
              "question": "Did they say 'Yes'?",
              "scene": "Scenario: You ask for a raise. Boss: 'We value you highly, and we want to ensure you are compensated in a way that reflects your holistic contribution to the ecosystem.'",
              "type": "scenario"
            },
            {
              "difficulty": "medium",
              "exerciseId": "B1-4-P3-E14",
              "feedback": {
                "correct": "Correct. Define 'Best.' Define 'Inappropriate.' Define the mechanism of 'Making' sadness.",
                "incorrect": "Drill into the missing reference."
              },
              "pairs": [
                {
                  "definition": "Question: \"Best for whom?\"",
                  "term": "\"I just want what's best.\""
                },
                {
                  "definition": "Question: \"According to what standard?\"",
                  "term": "\"It's inappropriate.\""
                },
                {
                  "definition": "Question: \"How do I make you sad?\"",
                  "term": "\"You make me sad.\""
                }
              ],
              "question": "Match the Question to the Fluff:",
              "type": "matching"
            },
            {
              "caseTitle": "Lesson Complete: The Fog Cutter",
              "correct": "Lesson B1-5: Unit B1 Review (The Hypnotist).",
              "difficulty": "easy",
              "exerciseId": "B1-4-P3-E15",
              "feedback": {
                "correct": "Correct. We have covered Pacing, Leading, Embedded Commands, Double Binds, and the Milton Model. Now we test it all.",
                "incorrect": "Next up: The final exam for the Silver Tongue unit."
              },
              "options": [
                "Lesson B1-5: Unit B1 Review (The Hypnotist).",
                "Lesson A1-1.",
                "Listening to a speech.",
                "Sleeping."
              ],
              "question": "You are ready for the Unit B1 Review:",
              "scene": "You have learned to cut through the fog. You know that 'Love' is a noun, but 'Loving' is a verb. You demand the verb.",
              "type": "case-analysis"
            }
          ],
          "screenId": "B1-4-P3-S2",
          "screenType": "Exercises",
          "title": "Simulation: The Guru"
        }
      ],
      "gamification": {
        "badgeOnCompletion": "The_Fog_Cutter_Badge",
        "pointsValue": 200,
        "progressRings": [
          {
            "label": "Part 1",
            "ringId": "learn",
            "status": "completed"
          },
          {
            "label": "Part 2",
            "ringId": "practice",
            "status": "completed"
          },
          {
            "label": "Part 3",
            "ringId": "challenge",
            "status": "pending"
          }
        ],
        "starsAvailable": 3
      },
      "lessonId": "B1-4",
      "lessonJSON": {
        "contentScreens": [
          {
            "content": [
              {
                "text": "You are about to face 'The Guru.' They will speak in deep, profound sentences that mean absolutely nothing. Their goal is to make you nod along in a trance.",
                "type": "paragraph"
              },
              {
                "alertType": "warning",
                "text": "Your Goal: Do not nod. Do not agree. Ask: 'How specifically?' until they give you a real answer or reveal they have none.",
                "type": "alert"
              }
            ],
            "screenId": "B1-4-P3-S1",
            "screenType": "Learn",
            "title": "Challenge: Pierce the Fog"
          },
          {
            "exercises": [
              {
                "correct": "'How specifically do I align a vibration? And what specifically do you mean by success?' (Drill Down)",
                "difficulty": "hard",
                "exerciseId": "B1-4-P3-E1",
                "feedback": {
                  "correct": "Correct. You refused to accept the abstract concepts ('vibration', 'success') as real things. You demanded the verb (the action).",
                  "incorrect": "If you accept the premise that you have a 'vibration' that is 'blocked,' they can sell you the cure. You must challenge the premise."
                },
                "options": [
                  "'Oh no! How do I fix my vibration?' (Submission)",
                  "'You are right. I feel blocked.' (Acceptance)",
                  "'How specifically do I align a vibration? And what specifically do you mean by success?' (Drill Down)",
                  "Leave."
                ],
                "question": "This is a 'Word Salad' of Nominalizations. What is the Meta Model defense?",
                "scene": "The Guru looks into your eyes: 'You are blocking your own abundance because your vibration is not aligned with the frequency of success.'",
                "type": "boss-scenario"
              },
              {
                "difficulty": "hard",
                "exerciseId": "B1-4-P3-E2",
                "feedback": {
                  "correct": "You survived the Fog. You realized that a promise without a date is just a lie.",
                  "incorrect": "You accepted the 'Reward' without knowing what it was. You bought a mystery box."
                },
                "scenarioTitle": "Simulation: The Vague Promise",
                "steps": [
                  {
                    "correct": "'What specific process? And what specific reward on what specific date?' (The Audit)",
                    "feedback": {
                      "correct": "Perfect. 'Process' and 'Reward' are empty containers. You forced them to put concrete details inside.",
                      "incorrect": "Trusting a vague process is how people get exploited. Specificity is security."
                    },
                    "options": [
                      "'Okay, I trust you.' (Blind Faith)",
                      "'What specific process? And what specific reward on what specific date?' (The Audit)",
                      "'I hope so.' (Passive)",
                      "'You are lying.' (Attack)"
                    ],
                    "scene": "Manager: 'If you just *trust the process*, you will be *rewarded* soon.'"
                  },
                  {
                    "correct": "'Faith is not a contract. I need details to do my job.' (Holding Frame)",
                    "feedback": {
                      "correct": "Mastery. They tried to use a 'Nominalization' (Faith) to shame you. You rejected it. Business runs on contracts, not faith.",
                      "incorrect": "They switched the frame from 'Business' to 'Religion' (Faith). Don't follow them there."
                    },
                    "options": [
                      "'I'm sorry, I do have faith.' (Guilt Trip worked)",
                      "'Faith is not a contract. I need details to do my job.' (Holding Frame)",
                      "'The team is great.' (Deflection)",
                      "Quit."
                    ],
                    "question": "Manager: 'Why do you have to be so negative? Don't you have *faith* in the team?' (Shifting to Morality)."
                  }
                ],
                "type": "micro-sim"
              },
              {
                "correct": "Because intelligent people have active imaginations. They do the work of filling in the blanks with their own brilliant ideas, thinking the speaker is brilliant too.",
                "difficulty": "medium",
                "exerciseId": "B1-4-P3-E3",
                "feedback": {
                  "correct": "Correct. The listener projects their own intelligence onto the vague speaker. It is a 'Projection Trap.'",
                  "incorrect": "Intelligence is not a shield; it can be a weakness if you over-interpret meaning where there is none."
                },
                "options": [
                  "It doesn't.",
                  "Because intelligent people have active imaginations. They do the work of filling in the blanks with their own brilliant ideas, thinking the speaker is brilliant too.",
                  "Because intelligent people are gullible.",
                  "Because it is logical."
                ],
                "question": "Why does the 'Milton Model' work so well on intelligent people?",
                "type": "multiple-choice"
              },
              {
                "answers": [
                  "trance",
                  "clarity"
                ],
                "difficulty": "easy",
                "exerciseId": "B1-4-P3-E4",
                "feedback": {
                  "correct": "Correct. To hypnotize, go vague. To de-hypnotize, go specific.",
                  "incorrect": "Vagueness induces the 'transderivational search' (trance). Clarity wakes you up."
                },
                "options": [
                  "trance",
                  "clarity",
                  "sleep",
                  "anger"
                ],
                "sentence": "Vagueness creates (--------). Specificity creates (--------).",
                "type": "fill-in"
              },
              {
                "correct": "'Who is everyone?'",
                "difficulty": "easy",
                "exerciseId": "B1-4-P3-E5",
                "feedback": {
                  "correct": "Correct. Force them to name the crowd. Usually, 'Everyone' is just 'Me and my one friend.'",
                  "incorrect": "Don't accept the phantom army. Make them count the soldiers."
                },
                "options": [
                  "'Who is everyone?'",
                  "'Is it?'",
                  "'I agree.'",
                  "'You are wrong.'"
                ],
                "question": "The Challenge:",
                "scene": "Scenario: 'Everyone knows that this is the wrong direction.' (Universal Quantifier).",
                "type": "scenario"
              },
              {
                "correct": "True",
                "difficulty": "easy",
                "exerciseId": "B1-4-P3-E6",
                "feedback": {
                  "correct": "Correct. They claim to know your future mental state. It is a dismissal tactic to stop the argument.",
                  "incorrect": "It asserts superior knowledge to shut you down."
                },
                "options": [
                  "True",
                  "False"
                ],
                "question": "Is this a 'Patronizing Mind Read'?",
                "scene": "Scenario: 'You will understand when you are older.'",
                "type": "true-false"
              },
              {
                "correct": "The map is not the territory",
                "difficulty": "medium",
                "exerciseId": "B1-4-P3-E7",
                "feedback": {
                  "correct": "Correct. (Korzybski). The words (Map) are not the reality (Territory). The Meta Model checks the Map against the Territory.",
                  "incorrect": "Words are just symbols. You must check if they match reality."
                },
                "question": "Arrange the words to define the Meta Model's power:",
                "type": "build-sentence",
                "words": [
                  "The",
                  "is",
                  "map",
                  "territory",
                  "not",
                  "the"
                ]
              },
              {
                "correct": "A Factive Presupposition",
                "difficulty": "hard",
                "exerciseId": "B1-4-P3-E8",
                "feedback": {
                  "correct": "Correct. The word 'realized' presupposes that the 'truth' is a fact. It forces you to accept their version of 'truth' to accept the compliment.",
                  "incorrect": "It smuggles an assumption into the sentence."
                },
                "options": [
                  "A Factive Presupposition",
                  "A Lie",
                  "A Compliment",
                  "A Question"
                ],
                "question": "What is this?",
                "scene": "A phrase that implies knowledge without stating it, like 'I'm glad you finally *realized* the truth.' (Implies you didn't know it before).",
                "type": "reverse-scenario"
              },
              {
                "correct": "Yes, it is the Milton Model used for mass influence. Whether it is 'bad' depends on the policy behind the words.",
                "difficulty": "medium",
                "exerciseId": "B1-4-P3-E9",
                "feedback": {
                  "correct": "Correct. Slogans are 'Nominalizations.' They are empty containers so every voter can project their own wish into them.",
                  "incorrect": "It is absolutely manipulation (shaping perception). The ethics depend on the outcome."
                },
                "options": [
                  "Yes, it is the Milton Model used for mass influence. Whether it is 'bad' depends on the policy behind the words.",
                  "No, it is just speaking.",
                  "Yes, all politicians are evil.",
                  "No, they mean it."
                ],
                "question": "Is this manipulation?",
                "scene": "A politician uses vague slogans ('Hope,' 'Change,' 'Greatness') to rally a crowd.",
                "type": "ethical-dilemma"
              },
              {
                "correct": "'How specifically does my action of [X] cause you to feel pain?'",
                "difficulty": "hard",
                "exerciseId": "B1-4-P3-E10",
                "feedback": {
                  "correct": "Correct. This forces them to trace the link. Often, they can't, because the pain comes from their interpretation, not your action.",
                  "incorrect": "Denial ('No I'm not') is a fight. Specificity ('How specifically?') is an investigation."
                },
                "options": [
                  "'No I'm not.'",
                  "'I am not touching you.'",
                  "'How specifically does my action of [X] cause you to feel pain?'",
                  "'You are too sensitive.'"
                ],
                "question": "How do you challenge this without being mean?",
                "scene": "Scenario: 'You are hurting me.' (Cause-Effect).",
                "type": "scenario"
              },
              {
                "answers": [
                  "riddles"
                ],
                "difficulty": "easy",
                "exerciseId": "B1-4-P3-E11",
                "feedback": {
                  "correct": "Correct. If they speak in riddles (metaphors), they can never be proven wrong. 'The river flows uphill' sounds deep, but means nothing.",
                  "incorrect": "Facts can be checked. Riddles cannot."
                },
                "options": [
                  "riddles",
                  "facts",
                  "lies",
                  "numbers"
                ],
                "sentence": "The Guru speaks in (--------) to avoid being pinned down to a specific meaning.",
                "type": "fill-in"
              },
              {
                "correct": "True",
                "difficulty": "medium",
                "exerciseId": "B1-4-P3-E12",
                "feedback": {
                  "correct": "Correct. 'Clearly' to whom? 'No choice' according to whom? It presents an opinion as an objective fact from the universe.",
                  "incorrect": "It hides the judge. The speaker is the judge, but they hide behind the word 'Clearly.'"
                },
                "options": [
                  "True",
                  "False"
                ],
                "question": "Is this a 'Lost Performative'?",
                "scene": "Scenario: 'Clearly, we have no other choice.'",
                "type": "true-false"
              },
              {
                "correct": "No. This is Word Salad.",
                "difficulty": "hard",
                "exerciseId": "B1-4-P3-E13",
                "feedback": {
                  "correct": "Correct. They used positive words ('value,' 'ecosystem') but promised zero dollars. It is a non-answer designed to make you feel good while getting nothing.",
                  "incorrect": "Don't listen to the tone. Listen to the commitment. There was no number."
                },
                "options": [
                  "No. This is Word Salad.",
                  "Yes, they said 'value' and 'compensated'.",
                  "Maybe.",
                  "It sounds like a yes."
                ],
                "question": "Did they say 'Yes'?",
                "scene": "Scenario: You ask for a raise. Boss: 'We value you highly, and we want to ensure you are compensated in a way that reflects your holistic contribution to the ecosystem.'",
                "type": "scenario"
              },
              {
                "difficulty": "medium",
                "exerciseId": "B1-4-P3-E14",
                "feedback": {
                  "correct": "Correct. Define 'Best.' Define 'Inappropriate.' Define the mechanism of 'Making' sadness.",
                  "incorrect": "Drill into the missing reference."
                },
                "pairs": [
                  {
                    "definition": "Question: \"Best for whom?\"",
                    "term": "\"I just want what's best.\""
                  },
                  {
                    "definition": "Question: \"According to what standard?\"",
                    "term": "\"It's inappropriate.\""
                  },
                  {
                    "definition": "Question: \"How do I make you sad?\"",
                    "term": "\"You make me sad.\""
                  }
                ],
                "question": "Match the Question to the Fluff:",
                "type": "matching"
              },
              {
                "caseTitle": "Lesson Complete: The Fog Cutter",
                "correct": "Lesson B1-5: Unit B1 Review (The Hypnotist).",
                "difficulty": "easy",
                "exerciseId": "B1-4-P3-E15",
                "feedback": {
                  "correct": "Correct. We have covered Pacing, Leading, Embedded Commands, Double Binds, and the Milton Model. Now we test it all.",
                  "incorrect": "Next up: The final exam for the Silver Tongue unit."
                },
                "options": [
                  "Lesson B1-5: Unit B1 Review (The Hypnotist).",
                  "Lesson A1-1.",
                  "Listening to a speech.",
                  "Sleeping."
                ],
                "question": "You are ready for the Unit B1 Review:",
                "scene": "You have learned to cut through the fog. You know that 'Love' is a noun, but 'Loving' is a verb. You demand the verb.",
                "type": "case-analysis"
              }
            ],
            "screenId": "B1-4-P3-S2",
            "screenType": "Exercises",
            "title": "Simulation: The Guru"
          }
        ],
        "gamification": {
          "badgeOnCompletion": "The_Fog_Cutter_Badge",
          "pointsValue": 200,
          "progressRings": [
            {
              "label": "Part 1",
              "ringId": "learn",
              "status": "completed"
            },
            {
              "label": "Part 2",
              "ringId": "practice",
              "status": "completed"
            },
            {
              "label": "Part 3",
              "ringId": "challenge",
              "status": "pending"
            }
          ],
          "starsAvailable": 3
        },
        "lessonId": "B1-4",
        "lessonPart": 3,
        "lessonPartTitle": "Challenge: The \"Guru\" Simulation",
        "lessonTitle": "The \"Milton Model\": Weaponized Vague Language",
        "lessonType": "Normal",
        "objective": "To master the defense against the Milton Model by refusing to accept abstract concepts ('Success', 'Alignment', 'Truth') without specific definitions, and breaking the trance of vague authority.",
        "sectionId": "B",
        "sectionTitle": "The Tools of Influence",
        "unitId": "B1",
        "unitTitle": "The Silver Tongue: NLP & Covert Hypnosis"
      },
      "lessonPart": 3,
      "lessonPartTitle": "Challenge: The \"Guru\" Simulation",
      "lessonTitle": "The \"Milton Model\": Weaponized Vague Language",
      "lessonType": "Normal",
      "objective": "To master the defense against the Milton Model by refusing to accept abstract concepts ('Success', 'Alignment', 'Truth') without specific definitions, and breaking the trance of vague authority.",
      "sectionId": "B",
      "sectionTitle": "The Tools of Influence",
      "title": "B1-4-Part3",
      "unitId": "B1",
      "unitTitle": "The Silver Tongue: NLP & Covert Hypnosis"
    }
  ]
}
];
