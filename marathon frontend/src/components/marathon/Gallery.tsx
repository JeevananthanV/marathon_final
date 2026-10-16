import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import runningClubChennai from "@/New assests/running-club-chennai.webp";
import bengaluru from "@/New assests/bengaluru.webp";
import salem from "@/New assests/salem.webp";
import medalCeremony from "@/New assests/medal-ceremony.webp";
import familyFinish from "@/New assests/family-finish.webp";
import finishLine from "@/New assests/finish-line.webp";
import warmUp from "@/New assests/warm-up.webp";
import hydration from "@/New assests/hydration.webp";
import medal from "@/New assests/medal.webp";

const IMAGES = [
  { src: runningClubChennai, alt: "Running club at Chennai Marina Beach" },
  { src: bengaluru, alt: "Runners at Bengaluru Vidhana Soudha" },
  { src: salem, alt: "Runners on Salem Yercaud hills at sunrise" },
  { src: medalCeremony, alt: "Medal ceremony — Indian runner" },
  { src: familyFinish, alt: "Family celebrating at the finish line" },
  { src: finishLine, alt: "Runners crossing the finish line" },
  { src: warmUp, alt: "Runners warming up before the race" },
  { src: hydration, alt: "Hydration station on the course" },
  { src: medal, alt: "Proud finisher holding his medal" },
];

export default function Gallery({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(compact ? 6 : 9);

  const images = compact ? IMAGES.slice(0, 6) : IMAGES;
  const visibleImages = images.slice(0, visibleCount);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight" && open < images.length - 1) setOpen(open + 1);
      if (e.key === "ArrowLeft" && open > 0) setOpen(open - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <section className="py-24 md:py-28 bg-white dots-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-navy font-semibold text-sm tracking-widest uppercase">Moments</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold text-charcoal">Last Year's Event Gallery</h2>
          <div className="mt-4 h-1.5 w-20 mx-auto rounded-full bg-navy" />
        </div>

        {visibleImages.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No photos to display.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-4 md:gap-5 space-y-4 md:space-y-5">
            {visibleImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setOpen(i)}
                className="group relative overflow-hidden rounded-[1.5rem] shadow-card hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-royal break-inside-avoid hover-lift transition-all duration-300"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={i % 3 === 0 ? 1000 : 800}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="h-8 w-8 text-white mb-2 drop-shadow-lg" />
                  <span className="text-white text-sm font-semibold drop-shadow-lg">View Photo</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {!compact && visibleCount < images.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((c) => c + 6)}
              className="inline-flex items-center gap-2 rounded-full gradient-orange text-white px-8 py-3.5 font-semibold shadow-soft hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              Load More Photos
            </button>
          </div>
        )}
      </div>

      {open !== null && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md grid place-items-center p-4 animate-fade-up"
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 h-12 w-12 grid place-items-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
            onClick={() => setOpen(null)}
          >
            <X className="h-6 w-6" />
          </button>

          {open > 0 && (
            <button
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 grid place-items-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setOpen(open - 1); }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {open < images.length - 1 && (
            <button
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 grid place-items-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setOpen(open + 1); }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <div className="text-center max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[open].src}
              alt={images[open].alt}
              width={1200}
              height={800}
              className="max-h-[75vh] max-w-full rounded-2xl shadow-elevated mx-auto"
            />
            <div className="mt-4 text-white">
              <p className="font-semibold text-lg">{images[open].alt}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
