"use client";

import { useEffect, useMemo, useRef, useState, useCallback, use } from "react";
import { ArrowLeft, Play, Maximize, Minimize, Pause, CheckCircle2 } from "lucide-react";
import CheckmarkAnimation from "@/components/CheckmarkAnimation";
import SkillUnlockTransition from "@/components/SkillUnlockTransition";
import { Lesson, VideoContent, Question, Option, FeedbackState, DEGREE_ONE_LESSONS, formatTimecode } from "@/app/lib/protocolsData";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

// --- Sub-Component: Single Video Player ---
function LessonVideoPlayer({
  video,
  isFullscreen,
  onRequestFullscreen,
  isActive,
  onPlay,
  onPause,
  onEnded,
}: {
  video: VideoContent;
  isFullscreen: boolean;
  onRequestFullscreen: () => void;
  isActive: boolean;
  onPlay: () => void;
  onPause: () => void;
  onEnded: (videoId: string) => void;
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

  const videoSubRef = useRef<HTMLVideoElement | null>(null);
  const videoNoSubRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const correctSfxRef = useRef<HTMLAudioElement | null>(null);
  const wrongSfxRef = useRef<HTMLAudioElement | null>(null);

  // Preload sound effects once on mount
  useEffect(() => {
    const correct = new Audio('/VIdeo/Sound%20effect/Right%20answer%20sound%20effect.mp4');
    correct.volume = 0.7;
    correct.preload = 'auto';
    correct.load();
    correctSfxRef.current = correct;

    const wrong = new Audio('/VIdeo/Sound%20effect/Wrong%20answer%20sound%20effect.mp4');
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
    const vidEl = showSubtitles ? videoSubRef.current : videoNoSubRef.current;
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
  }, [video, activeQuestionId, feedbackState, answeredSet, onPause, onPlay, showSubtitles]);

  // Sync video element with isActive prop
  useEffect(() => {
    const activeVid = showSubtitles ? videoSubRef.current : videoNoSubRef.current;
    if (!activeVid) return;
    if (isActive) {
      activeVid.play().catch(() => { });
    } else {
      activeVid.pause();
    }
  }, [isActive, showSubtitles]);

  const handleTogglePlayback = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isActive) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const activeVid = showSubtitles ? videoSubRef.current : videoNoSubRef.current;
    if (!activeVid) return;
    const time = Number(e.target.value);
    
    if (videoSubRef.current) videoSubRef.current.currentTime = time;
    if (videoNoSubRef.current) videoNoSubRef.current.currentTime = time;
    
    setCurrentTime(time);
  };

  const handleToggleSubtitles = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video.videoSrcNoSub) return;

    const oldVid = showSubtitles ? videoSubRef.current : videoNoSubRef.current;
    const newVid = !showSubtitles ? videoSubRef.current : videoNoSubRef.current;

    if (oldVid && newVid) {
      newVid.currentTime = oldVid.currentTime;
      if (!oldVid.paused) {
        newVid.play().catch(() => {});
      } else {
        newVid.pause();
      }
      oldVid.pause();
    }

    setShowSubtitles(!showSubtitles);
  };

  const handleOptionSelect = (question: Question, option: Option) => {
    const activeVid = showSubtitles ? videoSubRef.current : videoNoSubRef.current;
    if (!activeVid) return;

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
    activeVid.currentTime = option.feedbackStart;
    activeVid.play().catch(() => { });
    onPlay();
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || !activeQuestion) return;
    const activeVid = showSubtitles ? videoSubRef.current : videoNoSubRef.current;
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
        if (activeVid && activeQuestion.resumeTime < 9000) {
          activeVid.currentTime = activeQuestion.resumeTime;
          activeVid.play().catch(() => {});
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
        {/* Subtitled Video */}
        <video
          ref={videoSubRef}
          src={video.videoSrc}
          poster={video.thumbnailSrc}
          className={`absolute inset-0 ${isFullscreen ? "max-w-full max-h-full object-contain mx-auto" : "w-full h-full object-cover"} transition-opacity duration-300 ${!video.videoSrcNoSub || showSubtitles ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          playsInline
          onClick={handleTogglePlayback}
          onEnded={() => onEnded(video.id)}
          onLoadedMetadata={(e) => { if(showSubtitles || !video.videoSrcNoSub) setVideoDuration(e.currentTarget.duration) }}
        />
        
        {/* Non-subtitled Video */}
        {video.videoSrcNoSub && (
          <video
            ref={videoNoSubRef}
            src={video.videoSrcNoSub}
            poster={video.thumbnailSrc}
            className={`absolute inset-0 ${isFullscreen ? "max-w-full max-h-full object-contain mx-auto" : "w-full h-full object-cover"} transition-opacity duration-300 ${!showSubtitles ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            playsInline
            onClick={handleTogglePlayback}
            onEnded={() => onEnded(video.id)}
            onLoadedMetadata={(e) => { if(!showSubtitles) setVideoDuration(e.currentTarget.duration) }}
          />
        )}

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
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer z-30"
            onClick={handleTogglePlayback}
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white text-white ml-1" />
            </div>
          </div>
        )}

        {/* Video Title Overlay (fullscreen only) */}
        {isFullscreen && (
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-30">
            <p className="text-white text-lg font-bold drop-shadow-lg">
              {video.title}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity z-30">
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

        {/* Question Overlay */}
        {activeQuestion && (
          <div className="absolute inset-0 z-40 flex flex-col">
            <div className="h-[40%] w-full bg-transparent" />
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
                        audioRef.current.pause();

                        if (opt.previewAudioSrc) {
                          audioRef.current.src = opt.previewAudioSrc;
                          audioRef.current.currentTime = 0;
                          setPreviewEndTime(null);
                          audioRef.current.play().catch(() => { });
                        } else if (opt.scenarioStart !== undefined) {
                          if (!audioRef.current.src.includes(video.videoSrc)) {
                            audioRef.current.src = video.videoSrc;
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
export default function ProtocolMissionPlayerPage({ params }: { params: Promise<{ protocolId: string, missionId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const activeLesson = DEGREE_ONE_LESSONS.find(l => l.id === resolvedParams.missionId);

  if (!activeLesson) {
    notFound();
  }

  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [showSkillAnim, setShowSkillAnim] = useState<string | null>(null);
  const [showSkillTransition, setShowSkillTransition] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleBackToGrid = () => {
    router.push(`/protocols/${resolvedParams.protocolId}`);
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

  const handleVideoEnded = useCallback((videoId: string) => {
    setPlayingVideoId(null);
    
    setCompletedVideos((prev) => {
      if (prev.includes(videoId)) return prev;
      
      const newCompleted = [...prev, videoId];
      const lessonVideoIds = activeLesson.videos.map(v => v.id);
      const isLessonComplete = lessonVideoIds.every(id => newCompleted.includes(id));

      if (isLessonComplete && activeLesson.skillVideo) {
         setShowSkillAnim(activeLesson.skillVideo);
      }
      return newCompleted;
    });
  }, [activeLesson]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
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
                PROTOCOL I: THE PRESSURE • Mission {activeLesson.number}
              </span>
              <span className="font-bold text-sm md:text-base">
                {activeLesson.title}
              </span>
            </div>
          </div>
        </div>
      )}

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
            {!isFullscreen && (
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold border border-cyan-500/20">
                  {index + 1}
                </span>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  {video.title}
                  <CheckmarkAnimation isCompleted={completedVideos.includes(video.id)} />
                </h2>
              </div>
            )}

            <LessonVideoPlayer
              video={video}
              isFullscreen={isFullscreen}
              onRequestFullscreen={() => handleToggleFullscreen(index)}
              isActive={playingVideoId === video.id}
              onPlay={() => setPlayingVideoId(video.id)}
              onPause={() => setPlayingVideoId(null)}
              onEnded={handleVideoEnded}
            />
          </div>
        ))}

        {!isFullscreen && (
          <div className="pt-8 text-center flex flex-col items-center gap-4">
            {activeLesson.videos.every(v => completedVideos.includes(v.id)) ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                <CheckCircle2 size={18} />
                <span className="font-bold tracking-widest uppercase text-sm">Mission Completed</span>
              </div>
            ) : (() => {
               const finishedCount = activeLesson.videos.filter(v => completedVideos.includes(v.id)).length;
               const total = activeLesson.videos.length;
               const progressPercent = Math.round((finishedCount / total) * 100);
               return (
                 <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3">
                   <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
                     <div className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-700 origin-left" style={{ width: `${progressPercent}%` }} />
                   </div>
                   <span className="text-xs text-slate-400 uppercase tracking-widest">{finishedCount} / {total} Segments Completed</span>
                 </div>
               );
            })()}

            <button 
              onClick={() => {
                 setCompletedVideos(prev => {
                     const allIds = activeLesson.videos.map(v => v.id);
                     const isAllCompletedNow = allIds.every(id => prev.includes(id));
                     
                     if (isAllCompletedNow) {
                        return prev.filter(id => !allIds.includes(id));
                     } else {
                        const merged = Array.from(new Set([...prev, ...allIds]));
                        if (activeLesson.skillVideo) {
                           setShowSkillAnim(activeLesson.skillVideo);
                        }
                        return merged;
                     }
                 });
              }}
              className="mt-8 px-4 py-2 text-[10px] text-slate-500 border border-slate-700 rounded hover:bg-slate-800 uppercase tracking-widest transition-colors"
            >
              Debug: Toggle Complete All Segments
            </button>
          </div>
        )}
      </div>

      {showSkillAnim && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-in fade-in duration-500">
          <video 
             src={showSkillAnim}
             autoPlay
             playsInline
             className="w-full h-[100dvh] object-contain"
             onEnded={() => {
                setShowSkillAnim(null);
                setShowSkillTransition(true);
             }}
          />
        </div>
      )}

      {showSkillTransition && activeLesson.skillName && (
        <SkillUnlockTransition 
          skillName={activeLesson.skillName} 
          skillImage={activeLesson.image}
          onComplete={() => setShowSkillTransition(false)} 
        />
      )}
    </main>
  );
}
