// --- Types ---

export type Chapter = {
  id: string;
  label: string;
  start: number;
  end: number;
};

export type Option = {
  id: string;
  label: string;
  isCorrect: boolean;
  feedbackStart: number;
  feedbackEnd: number;
  scenarioStart?: number;
  scenarioEnd?: number;
  previewAudioSrc?: string;
};

export type Question = {
  id: string;
  triggerTime: number;
  resumeTime: number;
  prompt: string;
  options: Option[];
};

export type VideoContent = {
  id: string;
  title: string;
  videoSrc: string; // The subtitled version (or default)
  videoSrcNoSub?: string; // The version without subtitles
  thumbnailSrc?: string;
  chapters?: Chapter[];
  questions?: Question[];
  duration?: number;
};

export type Lesson = {
  id: string;
  number: number;
  title: string;
  description: string;
  videos: VideoContent[];
  isLocked?: boolean;
  image?: string;
  skillVideo?: string;
  skillName?: string;
};

export type FeedbackState = {
  questionId: string;
  optionId: string;
  endTime: number;
  resumeTime: number;
  isCorrect: boolean;
  questionTime: number;
};

// --- Data ---
// Timestamps are in seconds (converted from SS:FF or MM:SS:FF at 24fps)

export const DEGREE_ONE_LESSONS: Lesson[] = [
  {
    id: "emergency-brake",
    number: 1,
    title: "Emergency Brake",
    description: "3-Second Pause",
    image: "/VIdeo/images/3vsecond pause.png",
    skillVideo: "/VIdeo/images/skill/Emergency Brake animation.mp4",
    skillName: "impulse_control_lvl1",
    videos: [
      {
        id: "protocol-1-spot",
        title: "Spot It",
        videoSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/Spot it/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/Spot it/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/Spot it/21.png",
        questions: [
          {
            id: "q-31919797",
            triggerTime: 27.917,
            resumeTime: 9999,
            prompt: "Spot the tactic.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 27.917, feedbackEnd: 27.917, previewAudioSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/Spot it/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 27.917, feedbackEnd: 27.917, previewAudioSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/Spot it/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 28.25, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/Spot it/Option C.wav" }
            ]
          }
        ],
      },
      {
        id: "protocol-1-deconstruct",
        title: "Deconstruct",
        videoSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/DECONTERUCT/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/DECONTERUCT/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/DECONTERUCT/6.png",
      },
      {
        id: "protocol-1-counter",
        title: "Counter",
        videoSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/COUNTER/video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/COUNTER/video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/COUNTER/11.png",
      },
      {
        id: "protocol-1-spar",
        title: "The Spar",
        videoSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/THE SPAR/Video with subtitle .mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/THE SPAR/Video without subtitle .mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/THE SPAR/21.png",
        questions: [
          {
            id: "q-77557981",
            triggerTime: 18.083,
            resumeTime: 9999,
            prompt: "What is your next move?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 18.083, feedbackEnd: 18.083, previewAudioSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/THE SPAR/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 18.083, feedbackEnd: 18.083, previewAudioSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/THE SPAR/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 18.083, feedbackEnd: 18.083, previewAudioSrc: "/VIdeo/DEGREE ONE/Emergency Brake 3-Second Pause/THE SPAR/Option C.wav" }
            ]
          }
        ],
      },
    ],
  },
  {
    id: "disrespect-test",
    number: 2,
    title: "Disrespect Test",
    description: "Repeat Trigger",
    image: "/VIdeo/images/Disrespect Test.png",
    skillVideo: "/VIdeo/images/skill/Disrespect test animation.mp4",
    skillName: "radar_detection",
    videos: [
      {
        id: "protocol-2-spot",
        title: "Spot It",
        videoSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/SPOT IT/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/SPOT IT/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/SPOT IT/21.png",
        questions: [
          {
            id: "q--2571737",
            triggerTime: 42.75,
            resumeTime: 9999,
            prompt: "Spot the tactic.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 42.75, feedbackEnd: 42.75, previewAudioSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/SPOT IT/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 42.917, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/SPOT IT/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 42.75, feedbackEnd: 42.75, previewAudioSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/SPOT IT/Option C.wav" }
            ]
          }
        ],
      },
      {
        id: "protocol-2-deconstruct",
        title: "Deconstruct",
        videoSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/DECONSTRUCT/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/DECONSTRUCT/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/DECONSTRUCT/13.png",
      },
      {
        id: "protocol-2-counter",
        title: "Counter",
        videoSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/COUNTER/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/COUNTER/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/COUNTER/14.png",
      },
      {
        id: "protocol-2-spar",
        title: "The Spar",
        videoSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/THE SPAR/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/THE SPAR/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/THE SPAR/24.png",
        questions: [
          {
            id: "q-91874201",
            triggerTime: 23.292,
            resumeTime: 9999,
            prompt: "What is your next move?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 23.833, feedbackEnd: 30.792, previewAudioSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/THE SPAR/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 38.333, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/THE SPAR/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 31.125, feedbackEnd: 38.0, previewAudioSrc: "/VIdeo/DEGREE ONE/Disrespect Test Repeat Trigger/THE SPAR/Option C.wav" }
            ]
          }
        ],
      },
    ],
  },
  {
    id: "nice-guy-trap",
    number: 3,
    title: "Nice Guy Trap",
    description: "No-JADE Rule",
    image: "/VIdeo/images/Nice Guy Trap.png",
    skillVideo: "/VIdeo/images/skill/Nice guy trap animation.mp4",
    skillName: "ego_check",
    videos: [
      {
        id: "protocol-3-spot",
        title: "Spot It",
        videoSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/SPOT IT/Video with subtitle .mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/SPOT IT/Video without subtitle .mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/SPOT IT/15.png",
        questions: [
          {
            id: "q--2314901",
            triggerTime: 50.125,
            resumeTime: 9999,
            prompt: "Spot the tactic.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 50.125, feedbackEnd: 50.125, previewAudioSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/SPOT IT/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 50.125, feedbackEnd: 50.125, previewAudioSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/SPOT IT/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 50.125, feedbackEnd: 50.125, previewAudioSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/SPOT IT/Option C.wav" }
            ]
          }
        ],
      },
      {
        id: "protocol-3-deconstruct",
        title: "Deconstruct",
        videoSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/DECOUNSTRUCT/video with subtitle .mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/DECOUNSTRUCT/video without subtitle .mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/DECOUNSTRUCT/8.png",
      },
      {
        id: "protocol-3-counter",
        title: "Counter",
        videoSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/COUNTER/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/COUNTER/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/COUNTER/9.png",
      },
      {
        id: "protocol-3-spar",
        title: "The Spar",
        videoSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/THE SPAR/THE SPAR VIDEO WITH SUBTITLE.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/THE SPAR/THE SPAR VIDEO WITHOUT SUBTITLE.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/THE SPAR/19.png",
        questions: [
          {
            id: "q--4845142",
            triggerTime: 22.667,
            resumeTime: 9999,
            prompt: "What is your next move?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 22.792, feedbackEnd: 28.083, previewAudioSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/THE SPAR/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 34.458, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/THE SPAR/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 28.208, feedbackEnd: 34.333, previewAudioSrc: "/VIdeo/DEGREE ONE/Nice Guy Trap No-JADE Rule/THE SPAR/Option C.wav" }
            ]
          }
        ],
      },
    ],
  },
  {
    id: "fog-attack",
    number: 4,
    title: "FOG Attack",
    description: "Internal Label",
    image: "/VIdeo/images/FOG Attack.png",
    skillVideo: "/VIdeo/images/skill/Emotional buttons animation.mp4",
    skillName: "emotional_armor",
    videos: [
      {
        id: "protocol-4-spot",
        title: "Spot It",
        videoSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/SPOT IT/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/SPOT IT/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/SPOT IT/23.png",
        questions: [
          {
            id: "q-84134503",
            triggerTime: 40.625,
            resumeTime: 9999,
            prompt: "Spot the tactic.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 40.708, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/SPOT IT/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 40.625, feedbackEnd: 40.625, previewAudioSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/SPOT IT/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 40.625, feedbackEnd: 40.625, previewAudioSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/SPOT IT/Option C.wav" }
            ]
          }
        ],
      },
      {
        id: "protocol-4-deconstruct",
        title: "Deconstruct",
        videoSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/deconstruct/Video with sutitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/deconstruct/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/deconstruct/12.png",
      },
      {
        id: "protocol-4-counter",
        title: "Counter",
        videoSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/COUNTER/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/COUNTER/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/COUNTER/14.png",
      },
      {
        id: "protocol-4-spar",
        title: "The Spar",
        videoSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/THE SPAR/Video with subtitle .mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/THE SPAR/Video without subtitle .mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/THE SPAR/22.png",
        questions: [
          {
            id: "q-29705624",
            triggerTime: 23.333,
            resumeTime: 9999,
            prompt: "What is your next move?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 23.333, feedbackEnd: 23.333, previewAudioSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/THE SPAR/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 24.417, feedbackEnd: 29.333, previewAudioSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/THE SPAR/Option B.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 36.708, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/THE SPAR/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 23.333, feedbackEnd: 23.333, previewAudioSrc: "/VIdeo/DEGREE ONE/FOG Attack Internal Label/THE SPAR/Option C.wav" }
            ]
          }
        ],
      },
    ],
  },
  {
    id: "reality-distortion",
    number: 5,
    title: "Reality Distortion",
    description: "Written Anchor",
    image: "/VIdeo/images/Reality Distortion.png",
    skillVideo: "/VIdeo/images/skill/Reality Distortion animation.mp4",
    skillName: "reality_anchor",
    videos: [
      {
        id: "protocol-5-spot",
        title: "Spot It",
        videoSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/SPOT IT/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/SPOT IT/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/SPOT IT/21.png",
        questions: [
          {
            id: "q--9160518",
            triggerTime: 40.292,
            resumeTime: 9999,
            prompt: "Spot the tactic.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 40.292, feedbackEnd: 40.292, previewAudioSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/SPOT IT/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 40.292, feedbackEnd: 40.292, previewAudioSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/SPOT IT/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 40.625, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/SPOT IT/Option C.wav" }
            ]
          }
        ],
      },
      {
        id: "protocol-5-deconstruct",
        title: "Deconstruct",
        videoSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/DECONSTRUCT/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/DECONSTRUCT/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/DECOUNSTRUCT/1.png",
      },
      {
        id: "protocol-5-counter",
        title: "Counter",
        videoSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/COUNTER/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/COUNTER/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/COUNTER/8.png",
      },
      {
        id: "protocol-5-spar",
        title: "The Spar",
        videoSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/THE SPAR/Video with subtitle.mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/THE SPAR/Video without subtitle.mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/THE SPAR/21.png",
        questions: [
          {
            id: "q-13671949",
            triggerTime: 22.917,
            resumeTime: 9999,
            prompt: "What is your next move?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 23.042, feedbackEnd: 32.0, previewAudioSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/THE SPAR/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 32.125, feedbackEnd: 37.5, previewAudioSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/THE SPAR/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 37.625, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/Reality Distortion Written Anchor/THE SPAR/Option C.wav" }
            ]
          }
        ],
      },
    ],
  },
  {
    id: "frame-flip",
    number: 6,
    title: "Frame Flip",
    description: "Refocus Statement",
    image: "/VIdeo/images/Frame Flip.png",
    skillVideo: "/VIdeo/images/skill/Frame shift animation.mp4",
    skillName: "frame_awareness",
    videos: [
      {
        id: "protocol-6-spot",
        title: "Spot It",
        videoSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/spot it/Video with subtitle .mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/spot it/Video without subtitle .mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/spot it/19.png",
        questions: [
          {
            id: "q--3106446",
            triggerTime: 39.667,
            resumeTime: 9999,
            prompt: "Spot the tactic.",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 39.667, feedbackEnd: 39.667, previewAudioSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/spot it/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 39.917, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/spot it/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 39.667, feedbackEnd: 39.667, previewAudioSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/spot it/Option C.wav" }
            ]
          }
        ],
      },
      {
        id: "protocol-6-deconstruct",
        title: "Deconstruct",
        videoSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/DECONSTRUCT/Video with subtitle .mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/DECONSTRUCT/Video without subtitle .mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/DECONSTRUCT/11.png",
      },
      {
        id: "protocol-6-counter",
        title: "Counter",
        videoSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/Counter/Video with subtitle .mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/Counter/Video without subtitle .mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/Counter/10.png",
      },
      {
        id: "protocol-6-spar",
        title: "The Spar",
        videoSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/the spar/Video with subtitle .mp4",
        videoSrcNoSub: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/the spar/Video without subtitle .mp4",
        thumbnailSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/the spar/21.png",
        questions: [
          {
            id: "q-37237586",
            triggerTime: 23.292,
            resumeTime: 9999,
            prompt: "What is your next move?",
            options: [
              { id: "a", label: "Option A", isCorrect: false, feedbackStart: 23.417, feedbackEnd: 30.292, previewAudioSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/the spar/Option A.wav" },
              { id: "b", label: "Option B", isCorrect: true, feedbackStart: 30.417, feedbackEnd: 36.708, previewAudioSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/the spar/Option B.wav" },
              { id: "c", label: "Option C", isCorrect: false, feedbackStart: 36.833, feedbackEnd: 9999, previewAudioSrc: "/VIdeo/DEGREE ONE/Frame Flip Refocus Statement/the spar/Option C.wav" }
            ]
          }
        ],
      },
    ],
  },
];

export const DEGREE_TWO_LESSONS: Lesson[] = [
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

export const formatTimecode = (timeInSecs: number, fps: number = 24) => {
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


