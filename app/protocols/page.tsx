"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

const DEGREES = [
  {
    id: 1,
    title: "Protocol I: The Pressure",
    subtitle: "",
    description: "",
    isLocked: false,
    href: "/protocols/protocol-1",
    image: "/VIdeo/images/Protocol I  the pressure.png",
  },
  {
    id: 3,
    title: "Degree Three",
    subtitle: "Cognitive Dominance",
    description: "Rewire their framing. Advanced psychological warfare and absolute conversational authority.",
    isLocked: true,
    href: "#",
  },
  {
    id: 4,
    title: "Degree Four",
    subtitle: "The Master Puppeteer",
    description: "Influence at scale. Understanding societal triggers and group psychology manipulation.",
    isLocked: true,
    href: "#",
  },
  {
    id: 5,
    title: "Degree Five",
    subtitle: "Shattered Reality",
    description: "Gaslighting defense, reality bending, and absolute mental fortitude against the dark triad.",
    isLocked: true,
    href: "#",
  },
  {
    id: 6,
    title: "Degree Six",
    subtitle: "The Apex Protocol",
    description: "The culmination of all dark psychology traits. Become fundamentally immune and entirely in control.",
    isLocked: true,
    href: "#",
  },
];

export default function DegreesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-white/90 uppercase">
            Protocols
          </h1>
          <p className="text-slate-400 text-sm uppercase tracking-widest">
            Select Your Path of Mastery
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEGREES.map((degree) => {
            if (degree.isLocked) {
              return (
                <div
                  key={degree.id}
                  className="group relative flex flex-col items-start text-left p-8 rounded-3xl border bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed transition-all duration-300"
                >
                  <div className="flex items-center justify-between w-full mb-6">
                    <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/50 text-slate-500 text-2xl font-black">
                      {degree.id}
                    </span>
                    <Lock className="text-slate-600 w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1 text-slate-400">
                    {degree.title}
                  </h3>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                    {degree.subtitle}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed mt-auto">
                    {degree.description}
                  </p>
                </div>
              );
            }

            return (
              <Link
                href={degree.href}
                key={degree.id}
                className="group relative flex flex-col items-start text-left p-8 rounded-3xl border bg-slate-900 border-slate-700/50 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:-translate-y-2 transition-all duration-300 overflow-hidden min-h-[300px]"
              >
                {degree.image && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${degree.image}')` }}
                  />
                )}
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />

                <div className="relative flex items-center justify-between w-full mb-6 z-10">
                  <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 text-2xl font-black shadow-inner shadow-cyan-500/20 backdrop-blur-md">
                    {degree.id}
                  </span>
                  <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Ready</span>
                  </div>
                </div>
                
                <div className="relative mt-auto z-10 w-full">
                  <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-cyan-400 transition-colors">
                    {degree.title}
                  </h3>
                  {degree.subtitle && (
                    <h4 className="text-sm font-bold text-cyan-500/70 uppercase tracking-widest mb-4 group-hover:text-cyan-400/80 transition-colors">
                      {degree.subtitle}
                    </h4>
                  )}
                  {degree.description && (
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {degree.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
