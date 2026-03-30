"use client";

import { use } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DEGREE_ONE_LESSONS } from "@/app/lib/protocolsData";
import { notFound } from "next/navigation";

export default function ProtocolMissionsPage({ params }: { params: Promise<{ protocolId: string }> }) {
  const resolvedParams = use(params);
  
  // Only handling Protocol I logic for now as directed
  if (resolvedParams.protocolId !== "protocol-1") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      {/* HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-2">
           <Link href="/protocols" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 mb-2 w-max">
             <ArrowLeft size={16} />
             <span className="text-xs font-bold uppercase tracking-widest">Back to Library</span>
           </Link>
          <div className="flex items-baseline gap-4 mt-2">
            <h1 className="text-3xl font-black tracking-tight text-white/90 uppercase">
              Protocol I: The Pressure
            </h1>
          </div>
          <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">
            Master the core conversational defense mechanisms.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        {/* MISSIONS GRID */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white/90 tracking-tight flex items-center gap-3">
              Missions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEGREE_ONE_LESSONS.map((lesson) => {
              const missionHref = `/protocols/${resolvedParams.protocolId}/missions/${lesson.id}`;

              return (
                <Link
                  key={lesson.id}
                  href={lesson.isLocked ? "#" : missionHref}
                  className={`group relative flex flex-col items-start text-left p-8 rounded-3xl border transition-all duration-300 overflow-hidden min-h-[300px] ${lesson.isLocked
                    ? "bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed"
                    : "bg-slate-900 border-slate-700/50 hover:bg-slate-800 hover:border-slate-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                    }`}
                >
                  {lesson.image && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${lesson.image}')` }}
                    />
                  )}
                  {/* Gradient overlay to make text clear */}
                  <div className={`absolute inset-0 ${lesson.image ? 'bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40' : ''}`} />

                  <div className="relative flex items-center justify-between w-full mb-4 z-10">
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950/80 backdrop-blur-md text-cyan-400 border border-cyan-800/50 text-xl font-bold font-mono shadow-inner shadow-cyan-500/20">
                      {lesson.number}
                    </span>
                    {lesson.isLocked ? (
                      <Lock className="text-slate-600 w-5 h-5" />
                    ) : (
                      <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Ready</span>
                     </div>
                    )}
                  </div>

                  <div className="relative mt-auto w-full z-10">
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
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
                        <span className="text-xs text-slate-400 ml-2 font-mono font-bold">
                          {lesson.videos.length} VIDEO{lesson.videos.length !== 1 ? 'S' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
