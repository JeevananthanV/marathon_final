import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import HeroSection from "@/components/marathon/HeroSection";
import Sponsors from "@/components/marathon/Sponsors";
import RaceCategories from "@/components/marathon/RaceCategories";
import AboutEvent from "@/components/marathon/AboutEvent";

export const Route = createFileRoute("/theme-preview")({
  component: ThemePreview,
});

type CSSPropertiesWithVars = React.CSSProperties & {
  [key: string]: string;
};

const themes: Record<string, { name: string; description: string; colors: CSSPropertiesWithVars; isDark: boolean }> = {
  default: {
    name: "Default Dark Theme",
    description: "The original dark theme with Navy Blue, Royal Blue, and Orange.",
    isDark: true,
    colors: {
      "--navy": "#0F172A",
      "--royal": "#2563EB",
      "--orange": "#F97316",
      "--emerald": "#10B981",
      "--gradient-hero": "linear-gradient(135deg, #0F172A 0%, #1E3A8A 45%, #2563EB 100%)",
      "--gradient-cta": "linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #3B82F6 100%)",
      "--gradient-orange": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    },
  },
  royalOrangeLight: {
    name: "Royal & Orange Light (White BG)",
    description: "Clean white background with royal blue headings, vibrant orange buttons, and deep navy text. Highly readable and professional.",
    isDark: false,
    colors: {
      "--navy": "#0F172A",       /* Main Text / Headings */
      "--royal": "#2563EB",      /* Primary Accent (Royal Blue) */
      "--orange": "#F97316",     /* Warm Accent (Orange) */
      "--emerald": "#10B981",    /* Badge Accent */
      "--gradient-hero": "linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)", /* Banner retains energy */
      "--gradient-cta": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
      "--gradient-orange": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    },
  },
  forestGoldLight: {
    name: "Forest & Gold Light (White BG)",
    description: "Clean white background with deep forest green branding, premium gold accents, and dark charcoal text. Gives a highly premium, organic vibe.",
    isDark: false,
    colors: {
      "--navy": "#1F2937",       /* Dark Charcoal Text */
      "--royal": "#15803D",      /* Forest Green Primary */
      "--orange": "#D97706",     /* Gold Accent */
      "--emerald": "#16A34A",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #14532D 0%, #15803D 50%, #16A34A 100%)",
      "--gradient-cta": "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
      "--gradient-orange": "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
    },
  },
  londonCrimsonLight: {
    name: "London Crimson Light (White BG)",
    description: "Clean white background with passionate crimson red and coral accents, and charcoal midnight text. Modern and high-energy.",
    isDark: false,
    colors: {
      "--navy": "#111827",       /* Midnight Text */
      "--royal": "#E11D48",      /* London Crimson Primary */
      "--orange": "#F43F5E",     /* Coral/Rose Accent */
      "--emerald": "#0D9488",    /* Teal Badge */
      "--gradient-hero": "linear-gradient(135deg, #881337 0%, #E11D48 50%, #F43F5E 100%)",
      "--gradient-cta": "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)",
      "--gradient-orange": "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)",
    },
  },
  electricTealLight: {
    name: "Teal & Violet Light (White BG)",
    description: "Clean white background with modern electric teal primary branding and violet/purple highlights. Gives a tech-forward look.",
    isDark: false,
    colors: {
      "--navy": "#0F172A",       /* Dark Slate Text */
      "--royal": "#0D9488",      /* Electric Teal Primary */
      "--orange": "#8B5CF6",     /* Violet Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #0D9488 0%, #0F766E 50%, #8B5CF6 100%)",
      "--gradient-cta": "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
      "--gradient-orange": "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    },
  },
  solarYellowLight: {
    name: "Solar & Matte Black Light (White BG)",
    description: "High-contrast matte black headings with bright solar yellow action elements and highlights. Bold, modern and striking.",
    isDark: false,
    colors: {
      "--navy": "#111111",       /* Matte Black Text */
      "--royal": "#1A1A1A",      /* Deep Slate/Black Primary */
      "--orange": "#EAB308",     /* Solar Yellow Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #EAB308 100%)",
      "--gradient-cta": "linear-gradient(135deg, #1A1A1A 0%, #000000 100%)",
      "--gradient-orange": "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)",
    },
  },
  oceanBreezeLight: {
    name: "Ocean Indigo & Sky Light (White BG)",
    description: "Classic athletic style featuring deep ocean indigo with cool sky blue accents on a pure white canvas.",
    isDark: false,
    colors: {
      "--navy": "#0A192F",       /* Ocean Navy Text */
      "--royal": "#4338CA",      /* Indigo Primary */
      "--orange": "#0EA5E9",     /* Sky Blue Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #1E1B4B 0%, #4338CA 50%, #0EA5E9 100%)",
      "--gradient-cta": "linear-gradient(135deg, #4338CA 0%, #312E81 100%)",
      "--gradient-orange": "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
    },
  },
  emeraldForestLight: {
    name: "Emerald Forest Light (White BG)",
    description: "Eco-friendly energy palette with deep forest green text, bright emerald primary branding, and neon lime highlights.",
    isDark: false,
    colors: {
      "--navy": "#064E3B",       /* Deep Forest Green Text */
      "--royal": "#10B981",      /* Emerald Green Primary */
      "--orange": "#84CC16",     /* Neon Lime Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #064E3B 0%, #047857 50%, #84CC16 100%)",
      "--gradient-cta": "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      "--gradient-orange": "linear-gradient(135deg, #84CC16 0%, #65A30D 100%)",
    },
  },
  sunsetBoulevardLight: {
    name: "Sunset Boulevard Light (White BG)",
    description: "Warm athletic tones featuring deep plum text, vibrant sunset orange primary, and golden sun accents.",
    isDark: false,
    colors: {
      "--navy": "#4C1D95",       /* Deep Plum Text */
      "--royal": "#F97316",      /* Sunset Orange Primary */
      "--orange": "#F59E0B",     /* Golden Sun Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #2E1065 0%, #F97316 50%, #F59E0B 100%)",
      "--gradient-cta": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
      "--gradient-orange": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
  },
  pureMonochromeLight: {
    name: "Pure Monochrome Light (White BG)",
    description: "Ultra-minimalist layout using only solid black text, graphite dark gray accents, and cool slate highlights.",
    isDark: false,
    colors: {
      "--navy": "#000000",       /* Pure Black Text */
      "--royal": "#27272A",      /* Graphite Accent */
      "--orange": "#71717A",     /* Cool Slate Accent */
      "--emerald": "#3F3F46",    /* Dark Gray Badge */
      "--gradient-hero": "linear-gradient(135deg, #09090B 0%, #27272A 60%, #71717A 100%)",
      "--gradient-cta": "linear-gradient(135deg, #27272A 0%, #09090B 100%)",
      "--gradient-orange": "linear-gradient(135deg, #71717A 0%, #52525B 100%)",
    },
  },
  tealVioletDeep: {
    name: "Deep Teal & Amethyst (Premium Grounded)",
    description: "Grounded Teal & Purple. Uses a richer, slightly darker pine-teal and deep amethyst purple to avoid the 'neon AI' look.",
    isDark: false,
    colors: {
      "--navy": "#0F172A",       /* Dark Slate Text */
      "--royal": "#0F766E",      /* Deep Pine Teal Primary */
      "--orange": "#6D28D9",     /* Rich Amethyst Purple Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #115E59 0%, #0F766E 50%, #6D28D9 100%)",
      "--gradient-cta": "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
      "--gradient-orange": "linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)",
    },
  },
  tealVioletDeepV2: {
    name: "Deep Teal & Amethyst V2 (Vibrant/Alternate)",
    description: "Alternate version with a slightly more vibrant seafoam-teal primary and a brighter violet-amethyst purple accent.",
    isDark: false,
    colors: {
      "--navy": "#0F172A",       /* Dark Slate Text */
      "--royal": "#0D9488",      /* Seafoam Teal Primary */
      "--orange": "#7C3AED",     /* Brighter Amethyst/Violet Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #0D9488 0%, #0F766E 50%, #7C3AED 100%)",
      "--gradient-cta": "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
      "--gradient-orange": "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
    },
  },
  tealVioletMulberry: {
    name: "Seafoam & Mulberry (Fresh & Artistic)",
    description: "Organic feel. Uses fresh seafoam teal paired with warm mulberry/magenta accents and ink black headings.",
    isDark: false,
    colors: {
      "--navy": "#111827",       /* Ink Black Text */
      "--royal": "#0D9488",      /* Seafoam Teal Primary */
      "--orange": "#9D174D",     /* Warm Mulberry Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #0D9488 0%, #0F766E 55%, #9D174D 100%)",
      "--gradient-cta": "linear-gradient(135deg, #0D9488 0%, #0D9488 100%)",
      "--gradient-orange": "linear-gradient(135deg, #9D174D 0%, #881337 100%)",
    },
  },
  tealVioletNordic: {
    name: "Nordic Cyan & Plum (Minimal Athletic)",
    description: "Scandinavian style. Deep indigo-gray text with cool Nordic slate-cyan branding and rich plum accents.",
    isDark: false,
    colors: {
      "--navy": "#0F172A",       /* Deep Slate Text */
      "--royal": "#0891B2",      /* Nordic Cyan Primary */
      "--orange": "#701A75",     /* Rich Plum Accent */
      "--emerald": "#10B981",    /* Green Badge */
      "--gradient-hero": "linear-gradient(135deg, #0F172A 0%, #0891B2 50%, #701A75 100%)",
      "--gradient-cta": "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
      "--gradient-orange": "linear-gradient(135deg, #701A75 0%, #581C87 100%)",
    },
  },
};

function ThemePreview() {
  const [activeTheme, setActiveTheme] = useState<keyof typeof themes>("default");
  const theme = themes[activeTheme];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Sticky Theme Controller Bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Theme Live Preview</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an option below to dynamically preview the homepage in different color systems.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(themes).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setActiveTheme(key as keyof typeof themes)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTheme === key
                    ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-2 text-center md:text-left">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 italic">
            Active Palette Description: {theme.description}
          </span>
        </div>
      </div>

      {/* Embedded Dynamic Homepage Preview */}
      <div style={theme.colors} className="transition-all duration-500">
        <div className={theme.isDark ? "dark" : "light"}>
          <div className="gradient-page min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">
            <HeroSection />
            <Sponsors />
            <RaceCategories />
            <AboutEvent />
          </div>
        </div>
      </div>
    </div>
  );
}
