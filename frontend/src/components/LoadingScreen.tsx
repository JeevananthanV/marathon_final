import { useState, useEffect } from "react";

const WORDS = ["Run", "Beyond", "Limits"];
const COLORS = ["text-white", "text-white", "text-orange"];

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [step, setStep] = useState(0);

  const totalLetters = WORDS.reduce((s, w) => s + w.length, 0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setStep(i);
      if (i >= totalLetters) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setTimeout(() => setExiting(true), 200);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return Math.min(p + Math.random() * 10 + 4, 100);
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  if (!loading) return null;

  let idx = 0;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
        exiting ? "opacity-0 scale-[1.02]" : "opacity-100"
      }`}
      style={{ background: "linear-gradient(160deg, #0F172A 0%, #111D40 50%, #0F172A 100%)" }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="flex flex-col items-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight flex flex-wrap justify-center gap-x-5 gap-y-1">
          {WORDS.map((word, wIdx) => (
            <span key={wIdx} className={`inline-flex ${COLORS[wIdx]}`}>
              {word.split("").map((char, cIdx) => {
                const n = idx++;
                const done = n < step;
                return (
                  <span
                    key={cIdx}
                    className="inline-block transition-all duration-500 ease-out"
                    style={{
                      opacity: done ? 1 : 0,
                      transform: done ? "translateY(0) scale(1)" : "translateY(40px) scale(0.5)",
                      filter: done ? "blur(0)" : "blur(12px)",
                      transitionDelay: `${n * 50}ms`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
      </div>

      <p
        className="mt-5 text-xs uppercase tracking-[0.35em] font-semibold text-white/30 transition-opacity duration-700"
        style={{ opacity: step >= totalLetters ? 1 : 0 }}
      >
        Loading your experience
      </p>

      <div
        className="mt-8 w-48 transition-opacity duration-700"
        style={{ opacity: step >= totalLetters ? 1 : 0 }}
      >
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%`, background: "linear-gradient(90deg, #2563EB, #F97316)" }}
          />
        </div>
        <p className="mt-2 text-right text-[10px] text-white/25 tabular-nums">{Math.round(Math.min(progress, 100))}%</p>
      </div>
    </div>
  );
}
