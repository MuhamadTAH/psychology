"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ArrowLeft, Play, Maximize, Minimize, Pause, CheckCircle2, Lock } from "lucide-react";

// --- Types ---

type Chapter = {
  id: string;
  label: string;
  start: number;
  end: number;
};

type Option = {
  id: string;
  label: string;
  isCorrect: boolean;
  feedbackStart: number;
  feedbackEnd: number;
  scenarioStart?: number;
  scenarioEnd?: number;
  previewAudioSrc?: string;
};

type Question = {
  id: string;
  triggerTime: number;
  resumeTime: number;
  prompt: string;
  options: Option[];
};

type VideoContent = {
  id: string;
  title: string;
  videoSrc: string; // The subtitled version (or default)
  videoSrcNoSub?: string; // The version without subtitles
  thumbnailSrc?: string;
  chapters?: Chapter[];
  questions?: Question[];
  duration?: number;
};

type Lesson = {
  id: string;
  number: number;
  title: string;
  description: string;
  videos: VideoContent[];
  isLocked?: boolean;
};

type FeedbackState = {
  questionId: string;
  optionId: string;
  endTime: number;
  resumeTime: number;
  isCorrect: boolean;
  questionTime: number;
};

// --- Data ---
// Timestamps are in seconds (converted from SS:FF or MM:SS:FF at 24fps)

const DEGREE_ONE_LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    number: 1,
    title: "Spotting Microaggressions",
    description: "Identify subtle attacks disguised as jokes.",
    videos: [
      {
        id: "l1-v1",
        title: "Spot It",
        videoSrc: "/VIdeo/degree1_micro_spot_it.mp4",
        thumbnailSrc: "/VIdeo/degree1_micro_spot_it_thumb.jpg",
        questions: [
          {
            id: "q-l1v1",
            triggerTime: 39.04,
            resumeTime: 52.25,
            prompt: "Select the correct scenario/outcome.",
            options: [
              { id: "a", label: "Scenario A", isCorrect: false, feedbackStart: 41.79, feedbackEnd: 47.29, scenarioStart: 11.41, scenarioEnd: 20.21 },
              { id: "b", label: "Scenario B", isCorrect: true, feedbackStart: 41.125, feedbackEnd: 41.75, scenarioStart: 20.25, scenarioEnd: 30.46 },
              { id: "c", label: "Scenario C", isCorrect: false, feedbackStart: 47.33, feedbackEnd: 52.21, scenarioStart: 30.5, scenarioEnd: 39.04 },
            ],
          },
        ],
      },
      {
        id: "l1-v2",
        title: "Deconstruct",
        videoSrc: "/VIdeo/degree1_micro_deconstruct.mp4",
        thumbnailSrc: "/VIdeo/degree1_micro_deconstruct_thumb.jpg",
        questions: [
          {
            id: "q-l1v2",
            triggerTime: 65.125,
            resumeTime: 9999,
            prompt: "Choose the best deconstruction approach.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 65.17, feedbackEnd: 69.21, scenarioStart: 53.96, scenarioEnd: 56.42 },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 73.67, feedbackEnd: 9999, scenarioStart: 56.46, scenarioEnd: 61.54 },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 69.25, feedbackEnd: 73.625, scenarioStart: 61.58, scenarioEnd: 65.125 },
            ],
          },
        ],
      },
      {
        id: "l1-v3",
        title: "Counter",
        videoSrc: "/VIdeo/degree1_micro_counter.mp4",
        thumbnailSrc: "/VIdeo/degree1_micro_counter_thumb.jpg",
        questions: [
          {
            id: "q-l1v3",
            triggerTime: 15.29,
            resumeTime: 9999,
            prompt: "Which counter-strategy is most effective?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 15.33, feedbackEnd: 20.5, scenarioStart: 8.33, scenarioEnd: 11.17 },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 24.0, feedbackEnd: 9999, scenarioStart: 11.21, scenarioEnd: 14.17 },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 20.54, feedbackEnd: 23.96, scenarioStart: 14.21, scenarioEnd: 15.29 },
            ],
          },
        ],
      },
      {
        id: "l1-v4",
        title: "The Spar",
        videoSrc: "/VIdeo/degree1_micro_spar.mp4",
        thumbnailSrc: "/VIdeo/degree1_micro_spar_thumb.jpg",
        questions: [
          {
            id: "q-l1v4",
            triggerTime: 55.17,
            resumeTime: 70.42,
            prompt: "Select the correct sparring move.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 56.625, feedbackEnd: 63.33 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 63.33, feedbackEnd: 70.375 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 55.21, feedbackEnd: 56.58 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-2",
    number: 2,
    title: "Stop Being Nice",
    description: "Kindness is a gift, not an obligation.",
    videos: [
      {
        id: "l2-v1",
        title: "Spot It",
        videoSrc: "/VIdeo/degree1_stop_nice_spot_it.mp4",
        thumbnailSrc: "/VIdeo/degree1_stop_nice_spot_it_thumb.jpg",
        questions: [
          {
            id: "q-l2v1",
            triggerTime: 38.33,
            resumeTime: 47.21,
            prompt: "Pick the best answer.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 40.125, feedbackEnd: 42.58, scenarioStart: 12.33, scenarioEnd: 17.83 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 42.625, feedbackEnd: 47.17, scenarioStart: 17.875, scenarioEnd: 24.96 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 38.375, feedbackEnd: 40.08, scenarioStart: 25.0, scenarioEnd: 36.79 },
            ],
          },
        ],
      },
      {
        id: "l2-v2",
        title: "Deconstruct",
        videoSrc: "/VIdeo/degree1_stop_nice_deconstruct.mp4",
        thumbnailSrc: "/VIdeo/degree1_stop_nice_deconstruct_thumb.jpg",
        questions: [
          {
            id: "q-l2v2",
            triggerTime: 70.33,
            resumeTime: 9999,
            prompt: "Choose the correct deconstruction.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 70.375, feedbackEnd: 74.5, scenarioStart: 56.75, scenarioEnd: 60.625 },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 74.54, feedbackEnd: 82.25, scenarioStart: 60.66, scenarioEnd: 66.875 },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 82.25, feedbackEnd: 87.29, scenarioStart: 66.91, scenarioEnd: 70.33 },
            ],
          },
        ],
      },
      {
        id: "l2-v3",
        title: "Counter",
        videoSrc: "/VIdeo/degree1_stop_nice_counter.mp4",
        thumbnailSrc: "/VIdeo/degree1_stop_nice_counter_thumb.jpg",
        questions: [
          {
            id: "q-l2v3",
            triggerTime: 17.96,
            resumeTime: 9999,
            prompt: "Select the effective counter.",
            options: [
              { id: "a", label: "Option A", isCorrect: true, feedbackStart: 30.875, feedbackEnd: 9999 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 18.17, feedbackEnd: 26.67 },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 26.92, feedbackEnd: 30.625 },
            ],
          },
        ],
      },
      {
        id: "l2-v4",
        title: "The Spar",
        videoSrc: "/VIdeo/degree1_stop_nice_spar.mp4",
        thumbnailSrc: "/VIdeo/degree1_stop_nice_spar_thumb.jpg",
        questions: [
          {
            id: "q-l2v4",
            triggerTime: 40.79,
            resumeTime: 59.54,
            prompt: "Identify the winning spar.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 42.42, feedbackEnd: 53.33, scenarioStart: 20.04, scenarioEnd: 29.125 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 53.375, feedbackEnd: 59.54, scenarioStart: 29.16, scenarioEnd: 33.25 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 40.96, feedbackEnd: 42.42, scenarioStart: 33.41, scenarioEnd: 38.91 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-3",
    number: 3,
    title: "Guilt, Fear, Obligation (FOG)",
    description: "Break free from emotional manipulation.",
    videos: [
      {
        id: "l3-v1",
        title: "Spot It",
        videoSrc: "/VIdeo/degree1_fog_spot_it.mp4",
        thumbnailSrc: "/VIdeo/degree1_fog_spot_it_thumb.jpg",
        questions: [
          {
            id: "q-l3v1",
            triggerTime: 35.75,
            resumeTime: 47.46,
            prompt: "Identify the manipulation tactic.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 38.04, feedbackEnd: 40.79, scenarioStart: 8.96, scenarioEnd: 15.58 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 40.83, feedbackEnd: 47.42, scenarioStart: 15.625, scenarioEnd: 21.46 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 36.125, feedbackEnd: 38.0, scenarioStart: 21.5, scenarioEnd: 34.16 },
            ],
          },
        ],
      },
      {
        id: "l3-v2",
        title: "Deconstruct",
        videoSrc: "/VIdeo/degree1_fog_deconstruct.mp4",
        thumbnailSrc: "/VIdeo/degree1_fog_deconstruct_thumb.jpg",
        questions: [
          {
            id: "q-l3v2",
            triggerTime: 74.5,
            resumeTime: 9999,
            prompt: "How should you deconstruct this FOG?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 74.54, feedbackEnd: 80.46, scenarioStart: 60.125, scenarioEnd: 64.75 },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 80.5, feedbackEnd: 90.21, scenarioStart: 64.91, scenarioEnd: 70.79 },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 90.25, feedbackEnd: 9999, scenarioStart: 70.96, scenarioEnd: 74.5 },
            ],
          },
        ],
      },
      {
        id: "l3-v3",
        title: "Counter",
        videoSrc: "/VIdeo/degree1_fog_counter.mp4",
        thumbnailSrc: "/VIdeo/degree1_fog_counter_thumb.jpg",
        questions: [
          {
            id: "q-l3v3",
            triggerTime: 23.92,
            resumeTime: 9999,
            prompt: "Choose the best counter-move.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 24.0, feedbackEnd: 30.21, scenarioStart: 11.375, scenarioEnd: 15.5 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 30.25, feedbackEnd: 35.79, scenarioStart: 15.83, scenarioEnd: 18.46 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 35.83, feedbackEnd: 9999, scenarioStart: 18.58, scenarioEnd: 23.91 },
            ],
          },
        ],
      },
      {
        id: "l3-v4",
        title: "The Spar",
        videoSrc: "/VIdeo/degree1_fog_spar.mp4",
        thumbnailSrc: "/VIdeo/degree1_fog_spar_thumb.jpg",
        questions: [
          {
            id: "q-l3v4",
            triggerTime: 61.04,
            resumeTime: 87.83,
            prompt: "Select the winning spar.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 71.625, feedbackEnd: 79.125, scenarioStart: 32.33, scenarioEnd: 43.41 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 79.17, feedbackEnd: 87.79, scenarioStart: 43.75, scenarioEnd: 53.96 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 70.08, feedbackEnd: 71.58, scenarioStart: 54.08, scenarioEnd: 68.16 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-4",
    number: 4,
    title: "That Never Happened",
    description: "Defend against gaslighting and reality denial.",
    videos: [
      {
        id: "l4-v1",
        title: "Spot It",
        videoSrc: "/VIdeo/degree1_that_never_happened_spar.mp4",
        thumbnailSrc: "/VIdeo/degree1_that_never_happened_spar_thumb.jpg",
        questions: [
          {
            id: "q-l4v1",
            triggerTime: 42.04,
            resumeTime: 52.96,
            prompt: "Spot the gaslighting tactic.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 44.04, feedbackEnd: 49.46, scenarioStart: 12.25, scenarioEnd: 20.75 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 49.5, feedbackEnd: 53.92, scenarioStart: 20.96, scenarioEnd: 30.66 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 42.21, feedbackEnd: 44.0, scenarioStart: 31.0, scenarioEnd: 39.79 },
            ],
          },
        ],
      },
      {
        id: "l4-v2",
        title: "Deconstruct",
        videoSrc: "/VIdeo/degree1_that_never_happened_deconstruct.mp4",
        thumbnailSrc: "/VIdeo/degree1_that_never_happened_deconstruct_thumb.jpg",
        questions: [
          {
            id: "q-l4v2",
            triggerTime: 66.5,
            resumeTime: 9999,
            prompt: "Choose the correct analysis.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 66.54, feedbackEnd: 72.0, scenarioStart: 56.16, scenarioEnd: 59.33 },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 72.04, feedbackEnd: 81.92, scenarioStart: 59.5, scenarioEnd: 63.33 },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 81.96, feedbackEnd: 9999, scenarioStart: 63.46, scenarioEnd: 66.5 },
            ],
          },
        ],
      },
      {
        id: "l4-v3",
        title: "Counter",
        videoSrc: "/VIdeo/degree1_that_never_happened_counter.mp4",
        thumbnailSrc: "/VIdeo/degree1_that_never_happened_counter_thumb.jpg",
        questions: [
          {
            id: "q-l4v3",
            triggerTime: 21.83,
            resumeTime: 9999,
            prompt: "How do you counter this?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 21.875, feedbackEnd: 27.375, scenarioStart: 10.0, scenarioEnd: 14.41 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 28.125, feedbackEnd: 32.17, scenarioStart: 14.46, scenarioEnd: 16.58 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 32.17, feedbackEnd: 9999, scenarioStart: 16.625, scenarioEnd: 21.83 },
            ],
          },
        ],
      },
      {
        id: "l4-v4",
        title: "The Spar",
        videoSrc: "/VIdeo/degree1_that_never_happened_spar.mp4",
        thumbnailSrc: "/VIdeo/degree1_that_never_happened_spar_thumb.jpg",
        questions: [
          {
            id: "q-l4v4",
            triggerTime: 65.0,
            resumeTime: 83.875,
            prompt: "Select the winning spar.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 66.75, feedbackEnd: 76.46, scenarioStart: 27.75, scenarioEnd: 36.75 },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 76.54, feedbackEnd: 83.83, scenarioStart: 36.83, scenarioEnd: 47.83 },
              { id: "c", label: "Option C", isCorrect: true, feedbackStart: 65.08, feedbackEnd: 66.625, scenarioStart: 48.04, scenarioEnd: 63.29 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-5",
    number: 5,
    title: "Stop Being Nice",
    description: "Learn why being nice destroys your value and how to flip the dynamic.",
    videos: [
      {
        id: "l5-v1",
        title: "Spot It",
        videoSrc: "/VIdeo/SPOT IT/Spot it with subtitle .mov",
        videoSrcNoSub: "/VIdeo/SPOT IT/Spot it without subtitle .mp4",
        questions: [
          {
            id: "q-l5v1",
            triggerTime: 50.29,
            resumeTime: 9999,
            prompt: "Select the correct option.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 50.29, feedbackEnd: 50.29 },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 50.58, feedbackEnd: 9999 },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 50.29, feedbackEnd: 50.29 },
            ],
          },
        ],
      },
      {
        id: "l5-v2",
        title: "Deconstruct",
        videoSrc: "/VIdeo/DECOUNSTRUCT/DECONSTRUCT video with subtitile.mp4",
        videoSrcNoSub: "/VIdeo/DECOUNSTRUCT/DECONSTRUCT video without subtitile.mp4",
      },
      {
        id: "l5-v3",
        title: "Counter",
        videoSrc: "/VIdeo/COUNTER/COUNTERwith subtitle.mp4",
        videoSrcNoSub: "/VIdeo/COUNTER/COUNTER without subtitle.mp4",
      },
      {
        id: "l5-v4",
        title: "The Spar",
        videoSrc: "/VIdeo/THE SPAR/THE SPAR VIDEO WITH SUBTITLE.mp4",
        videoSrcNoSub: "/VIdeo/THE SPAR/THE SPAR VIDEO WITHOUT SUBTITLE.mp4",
        questions: [
          {
            id: "q-l5v4",
            triggerTime: 22.67,
            resumeTime: 9999,
            prompt: "What is your next move?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 22.79, feedbackEnd: 28.08, previewAudioSrc: "/VIdeo/THE SPAR/Option A.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 28.21, feedbackEnd: 34.33, previewAudioSrc: "/VIdeo/THE SPAR/Option C.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 34.46, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/THE SPAR/Option B.wav" },
            ]
          }
        ]
      }
    ]
  }
];

const DEGREE_TWO_LESSONS: Lesson[] = [
  {
    id: "lesson-d2-1",
    number: 1,
    title: "The Narcissist",
    description: "Identify and defend against narcissistic control.",
    videos: [
      {
        id: "d2-l1-v4",
        title: "The Spar",
        videoSrc: "/VIdeo/degree2_narcissist_spar.mp4",
        questions: [
          {
            id: "q-d2l1v4",
            triggerTime: 50.33,
            resumeTime: 9999,
            prompt: "Select the winning spar.",
            options: [
              { id: "a", label: "Option A", isCorrect: true, feedbackStart: 69.125, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/degree2_narcissist_spar_option_a.wav" },
              { id: "b", label: "Option B", isCorrect: false, feedbackStart: 50.625, feedbackEnd: 60.67, previewAudioSrc: "/VIdeo/degree2_narcissist_spar_option_b.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 61.208, feedbackEnd: 68.67, previewAudioSrc: "/VIdeo/degree2_narcissist_spar_option_c.wav" },
            ],
          },
        ],
      },
    ],
  },
];

const formatTimecode = (timeInSecs: number, fps: number = 24) => {
  const totalFrames = Math.round((timeInSecs || 0) * fps);
  const frames = totalFrames % fps;
  const totalSecs = Math.floor(totalFrames / fps);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);

  const pad = (num: number, digits = 2) => num.toString().padStart(digits, "0");

  if (mins > 0) {
    return `${mins}:${pad(secs)}:${pad(frames)}`;
  }
  return `${pad(secs)}:${pad(frames)}`;
};

// --- Sub-Component: Single Video Player ---

function LessonVideoPlayer({
  video,
  isFullscreen,
  onRequestFullscreen,
  isActive,
  onPlay,
  onPause,
}: {
  video: VideoContent;
  isFullscreen: boolean;
  onRequestFullscreen: () => void;
  isActive: boolean;
  onPlay: () => void;
  onPause: () => void;
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState | null>(null);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [previewEndTime, setPreviewEndTime] = useState<number | null>(null);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [wrongFlash, setWrongFlash] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const correctSfxRef = useRef<HTMLAudioElement | null>(null);
  const wrongSfxRef = useRef<HTMLAudioElement | null>(null);

  // Preload sound effects once on mount
  useEffect(() => {
    const correct = new Audio('/sounds/correct-answer.mp3');
    correct.volume = 0.7;
    correct.preload = 'auto';
    correct.load();
    correctSfxRef.current = correct;

    const wrong = new Audio('/sounds/wrong-answer.mp3');
    wrong.volume = 0.7;
    wrong.preload = 'auto';
    wrong.load();
    wrongSfxRef.current = wrong;
  }, []);

  const playSfx = useCallback((type: 'correct' | 'wrong') => {
    const sfx = type === 'correct' ? correctSfxRef.current : wrongSfxRef.current;
    if (!sfx) return;
    sfx.currentTime = 0;
    sfx.play().catch(() => {});
  }, []);

  const activeQuestion = useMemo(() => {
    return video?.questions?.find((q) => q.id === activeQuestionId);
  }, [video, activeQuestionId]);

  const answeredSet = useMemo(() => new Set(answeredIds), [answeredIds]);

  useEffect(() => {
    setSelectedOptionId(null);
    setPreviewEndTime(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [activeQuestionId]);

  // Audio Time Loop (Independent)
  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || previewEndTime === null) return;

    if (audio.currentTime >= previewEndTime) {
      audio.pause();
      setPreviewEndTime(null);
    }
  };

  // Video Time & Logic Loop
  useEffect(() => {
    const vidEl = videoRef.current;
    if (!vidEl) return;

    let rafId: number;

    const handleTimeUpdate = () => {
      const time = vidEl.currentTime;
      setCurrentTime(time);

      // 1. Feedback Logic (Video)
      if (feedbackState) {
        if (time >= feedbackState.endTime) {
          if (feedbackState.isCorrect) {
            setAnsweredIds((prev) =>
              prev.includes(feedbackState.questionId)
                ? prev
                : [...prev, feedbackState.questionId]
            );
            setFeedbackState(null);
            vidEl.currentTime = feedbackState.resumeTime;
            vidEl.play().catch(() => { });
            onPlay();
          } else {
            const question = video.questions?.find(
              (q) => q.id === feedbackState.questionId
            );
            setFeedbackState(null);
            if (question) {
              vidEl.currentTime = question.triggerTime;
              vidEl.pause();
              setActiveQuestionId(question.id);
              onPause();
            }
          }
        }
        rafId = requestAnimationFrame(handleTimeUpdate);
        return;
      }

      // 2. Question Trigger
      if (!activeQuestionId) {
        const nextQuestion = video.questions?.find(
          (q) =>
            !answeredSet.has(q.id) &&
            time >= q.triggerTime &&
            time < q.triggerTime + 1.5
        );
        if (nextQuestion) {
          // Micro-correction: Ensure video pauses exactly on the requested frame
          if (time > nextQuestion.triggerTime) {
            vidEl.currentTime = nextQuestion.triggerTime;
          }
          vidEl.pause();
          setActiveQuestionId(nextQuestion.id);
          onPause();
        }
      }
      rafId = requestAnimationFrame(handleTimeUpdate);
    };

    rafId = requestAnimationFrame(handleTimeUpdate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [video, activeQuestionId, feedbackState, answeredSet, onPause, onPlay]);

  // Sync video element with isActive prop
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => { });
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  const handleTogglePlayback = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isActive) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleToggleSubtitles = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current || !video.videoSrcNoSub) return;

    const time = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;
    const nextSubtitles = !showSubtitles;

    setShowSubtitles(nextSubtitles);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        if (wasPlaying) videoRef.current.play().catch(() => { });
      }
    }, 50);
  };

  const handleOptionSelect = (question: Question, option: Option) => {
    if (!videoRef.current) return;

    // Stop Audio Preview
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPreviewEndTime(null);

    // Play the appropriate sound effect
    playSfx(option.isCorrect ? 'correct' : 'wrong');

    setActiveQuestionId(null);
    setFeedbackState({
      questionId: question.id,
      optionId: option.id,
      endTime: option.feedbackEnd,
      resumeTime: question.resumeTime,
      isCorrect: option.isCorrect,
      questionTime: question.triggerTime,
    });

    // Play Visual Feedback
    videoRef.current.currentTime = option.feedbackStart;
    videoRef.current.play().catch(() => { });
    onPlay();
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || !activeQuestion) return;
    const option = activeQuestion.options.find((o) => o.id === selectedOptionId);
    if (!option) return;

    // Check if this option has NO video feedback (feedbackStart === feedbackEnd)
    const hasVideoFeedback = option.feedbackStart !== option.feedbackEnd;

    if (!hasVideoFeedback) {
      // No video feedback — handle inline
      if (audioRef.current) audioRef.current.pause();
      setPreviewEndTime(null);

      if (option.isCorrect) {
        playSfx('correct');
        setAnsweredIds((prev) =>
          prev.includes(activeQuestion.id) ? prev : [...prev, activeQuestion.id]
        );
        setActiveQuestionId(null);
        // Resume video from resumeTime if set
        if (videoRef.current && activeQuestion.resumeTime < 9000) {
          videoRef.current.currentTime = activeQuestion.resumeTime;
          videoRef.current.play().catch(() => {});
          onPlay();
        }
      } else {
        playSfx('wrong');
        // Flash red animation
        setWrongFlash(true);
        setSelectedOptionId(null);
        setTimeout(() => setWrongFlash(false), 600);
      }
    } else {
      // Has video feedback — use the original flow
      handleOptionSelect(activeQuestion, option);
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${isFullscreen
        ? "w-full h-full flex items-center justify-center bg-black"
        : "rounded-3xl shadow-2xl ring-1 ring-slate-800 aspect-[9/16] max-h-[70vh] mx-auto"
        }`}
      onDoubleClick={onRequestFullscreen}
    >
      <div className={`relative w-full h-full mx-auto overflow-hidden ${isFullscreen ? "max-w-[calc(100vh*9/16)]" : ""}`}>
        <video
          ref={videoRef}
          src={showSubtitles || !video.videoSrcNoSub ? video.videoSrc : video.videoSrcNoSub}
          poster={video.thumbnailSrc}
          className={
            isFullscreen
              ? "max-w-full max-h-full object-contain"
              : "w-full h-full object-cover"
          }
          playsInline
          onClick={handleTogglePlayback}
          onEnded={() => onPause()}
          onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
        />

        {/* Hidden Audio Player for Previews */}
        <audio
          ref={audioRef}
          src={video.videoSrc}
          onTimeUpdate={handleAudioTimeUpdate}
          className="hidden"
        />

        {/* Play Button Overlay */}
        {!isActive && !activeQuestionId && !feedbackState && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer"
            onClick={handleTogglePlayback}
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white text-white ml-1" />
            </div>
          </div>
        )}

        {/* Video Title Overlay (fullscreen only) */}
        {isFullscreen && (
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            <p className="text-white text-lg font-bold drop-shadow-lg">
              {video.title}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={handleTogglePlayback}
            className="text-white hover:text-cyan-400"
          >
            {isActive ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-mono text-slate-300 min-w-[45px] text-right">
              {formatTimecode(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={videoDuration || 0}
              step="any"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 appearance-none bg-slate-700 rounded-full cursor-pointer accent-cyan-400"
            />
            <span className="text-xs font-mono text-slate-400 min-w-[45px]">
              {formatTimecode(videoDuration)}
            </span>
            {video.videoSrcNoSub && (
              <button
                onClick={handleToggleSubtitles}
                className={`text-[10px] px-2 py-1 font-bold rounded flex items-center justify-center transition-colors ${showSubtitles ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}
                title="Toggle Subtitles"
              >
                CC
              </button>
            )}
          </div>
          <button
            onClick={onRequestFullscreen}
            className="text-white hover:text-cyan-400"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        {/* Question Overlay - The Layout Blueprint */}
        {activeQuestion && (
          <div className="absolute inset-0 z-20 flex flex-col">
            {/* THE STAGE (Top 40%): Transparent - Video stays frozen at trigger frame */}
            <div className="h-[40%] w-full bg-transparent" />

            {/* THE CONTROL DECK (Bottom 60%) */}
            <div className={`flex-1 bg-slate-900/95 border-t p-6 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-3xl backdrop-blur-xl animate-in slide-in-from-bottom duration-500 transition-all ${wrongFlash ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4),0_-10px_40px_rgba(0,0,0,0.5)] wrong-shake' : 'border-slate-700'}`}>

              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {activeQuestion.prompt}
              </h3>

              <div className="flex-1 flex flex-col gap-4 overflow-y-auto hide-scrollbar mb-4">
                {activeQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      if (audioRef.current) {
                        audioRef.current.pause(); // Stop anything playing

                        if (opt.previewAudioSrc) {
                          // Play separate audio file
                          audioRef.current.src = opt.previewAudioSrc;
                          audioRef.current.currentTime = 0;
                          setPreviewEndTime(null); // Let file play to natural end
                          audioRef.current.play().catch(() => { });
                        } else if (opt.scenarioStart !== undefined) {
                          // Fallback to seeking main video
                          if (!audioRef.current.src.includes(video.videoSrc)) {
                            audioRef.current.src = video.videoSrc; // Ensure it's pointing to main video
                          }
                          setPreviewEndTime(opt.scenarioEnd ?? null);
                          audioRef.current.currentTime = opt.scenarioStart;
                          audioRef.current.play().catch(() => { });
                        }
                      }
                    }}
                    className={`w-full p-6 text-left text-lg font-medium rounded-2xl border-2 transition-all transform active:scale-[0.98] ${selectedOptionId === opt.id
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* THE TRIGGER */}
              <button
                disabled={!selectedOptionId}
                onClick={handleConfirmAnswer}
                className={`w-full py-4 text-xl font-black tracking-widest uppercase rounded-2xl shadow-lg transition-all transform active:scale-95 ${selectedOptionId
                  ? "bg-green-500 text-black hover:bg-green-400 hover:scale-[1.02] shadow-green-900/40"
                  : "bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed"
                  }`}
              >
                Check
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// --- Main Page Component ---
// (No changes below, strictly preserving existing)

export default function VideoLessonPage() {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Track fullscreen state on the scroll container
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    setActiveLesson(lesson);
  };

  const handleBackToGrid = () => {
    setActiveLesson(null);
    setPlayingVideoId(null);
  };

  const handleToggleFullscreen = useCallback(async (index?: number) => {
    if (!scrollContainerRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await scrollContainerRef.current.requestFullscreen();
      if (index !== undefined) {
        setTimeout(() => {
          const el = document.getElementById(`video-${index}`);
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, 100);
      }
    }
  }, []);

  // 1. Grid View
  if (!activeLesson) {
    return (
      <main className="min-h-screen bg-slate-950 text-white pb-20">
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-baseline gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-white/90">
              Course Library
            </h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest hidden md:block">
              Master the Degrees
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">
          {/* DEGREE ONE */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white/90 tracking-tight">Degree One</h2>
              <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Foundations of Dark Psychology</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEGREE_ONE_LESSONS.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`group relative flex flex-col items-start text-left p-8 rounded-3xl border transition-all duration-300 ${lesson.isLocked
                    ? "bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed"
                    : "bg-slate-900/60 border-slate-700/50 hover:bg-slate-800 hover:border-slate-500 hover:shadow-2xl hover:-translate-y-1"
                    }`}
                >
                  <div className="flex items-center justify-between w-full mb-4">
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800 text-white text-xl font-bold font-mono">
                      {lesson.number}
                    </span>
                    {lesson.isLocked && (
                      <Lock className="text-slate-600 w-5 h-5" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {lesson.description}
                  </p>

                  {!lesson.isLocked && (
                    <div className="mt-auto flex gap-2 items-center">
                      <div className="flex gap-2">
                        {Array.from({ length: lesson.videos.length }).map((_, i) => (
                          <div
                            key={i}
                            className="h-1.5 w-6 rounded-full bg-slate-700 group-hover:bg-slate-600"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 ml-2 font-mono">
                        {lesson.videos.length} VIDEO{lesson.videos.length !== 1 ? 'S' : ''}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* DEGREE TWO */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white/90 tracking-tight flex items-center gap-3">
                Degree Two
                <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-cyan-300 bg-cyan-900/30 border border-cyan-800 rounded-full uppercase">New</span>
              </h2>
              <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Advanced Manipulation & Defense</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEGREE_TWO_LESSONS.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`group relative flex flex-col items-start text-left p-8 rounded-3xl border transition-all duration-300 ${lesson.isLocked
                    ? "bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed"
                    : "bg-slate-900/60 border-slate-700/50 hover:bg-slate-800 hover:border-slate-500 hover:shadow-2xl hover:-translate-y-1"
                    }`}
                >
                  <div className="flex items-center justify-between w-full mb-4">
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800 text-white text-xl font-bold font-mono">
                      {lesson.number}
                    </span>
                    {lesson.isLocked && (
                      <Lock className="text-slate-600 w-5 h-5" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {lesson.description}
                  </p>

                  {!lesson.isLocked && (
                    <div className="mt-auto flex gap-2 items-center">
                      <div className="flex gap-2">
                        {Array.from({ length: lesson.videos.length }).map((_, i) => (
                          <div
                            key={i}
                            className="h-1.5 w-6 rounded-full bg-slate-700 group-hover:bg-slate-600"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 ml-2 font-mono">
                        {lesson.videos.length} VIDEO{lesson.videos.length !== 1 ? 'S' : ''}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // 2. Lesson Detail View
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header - hidden in fullscreen */}
      {!isFullscreen && (
        <div className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
            <button
              onClick={handleBackToGrid}
              className="p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500">
                Degree One • Lesson {activeLesson.number}
              </span>
              <span className="font-bold text-sm md:text-base">
                {activeLesson.title}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hide scrollbars in fullscreen */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes wrongShake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-4px); }
          30%, 70% { transform: translateX(4px); }
        }
        .wrong-shake {
          animation: wrongShake 0.4s ease-in-out;
        }
      `}</style>

      {/* Scroll Container — becomes fullscreen scroll-snap when in fullscreen */}
      <div
        ref={scrollContainerRef}
        className={
          isFullscreen
            ? "h-screen w-screen overflow-y-scroll overflow-x-hidden snap-y snap-mandatory bg-black hide-scrollbar"
            : "flex-1 max-w-4xl mx-auto w-full p-6 pb-20 space-y-12"
        }
        style={isFullscreen ? { scrollSnapType: "y mandatory" } : undefined}
      >
        {activeLesson.videos.map((video, index) => (
          <div
            key={video.id}
            id={`video-${index}`}
            className={
              isFullscreen
                ? "h-screen w-screen snap-start snap-always"
                : "scroll-mt-24"
            }
          >
            {/* Title Row — only in normal mode */}
            {!isFullscreen && (
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold border border-cyan-500/20">
                  {index + 1}
                </span>
                <h2 className="text-xl font-bold text-white">{video.title}</h2>
              </div>
            )}

            {/* Video Player */}
            <LessonVideoPlayer
              video={video}
              isFullscreen={isFullscreen}
              onRequestFullscreen={() => handleToggleFullscreen(index)}
              isActive={playingVideoId === video.id}
              onPlay={() => setPlayingVideoId(video.id)}
              onPause={() => setPlayingVideoId(null)}
            />
          </div>
        ))}

        {/* Completion Area — normal mode only */}
        {!isFullscreen && (
          <div className="pt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 text-slate-300">
              <CheckCircle2 size={18} />
              <span>Lesson Complete</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
