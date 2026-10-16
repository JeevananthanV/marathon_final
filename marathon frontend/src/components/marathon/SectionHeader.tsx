import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow: string;
  heading: string | React.ReactNode;
  subheading?: string;
  centered?: boolean;
  delay?: number;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const eyebrowVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const headingVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const dividerVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const subVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/**
 * SectionHeader — reusable animated section heading block.
 * Stagger: eyebrow → heading pops up → divider scales in → subheading fades.
 */
export default function SectionHeader({
  eyebrow,
  heading,
  subheading,
  centered = true,
  delay = 0,
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} mb-8 md:mb-16`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      transition={{ delayChildren: delay }}
    >
      <motion.p
        variants={eyebrowVariants}
        className="text-navy dark:text-primary-light font-semibold text-xs tracking-widest uppercase"
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        variants={headingVariants}
        className="mt-2 font-display text-2xl md:text-5xl font-extrabold text-charcoal dark:text-white tracking-tight"
      >
        {heading}
      </motion.h2>

      <motion.div
        variants={dividerVariants}
        style={{ transformOrigin: centered ? "center" : "left" }}
        className={`mt-3 h-1 w-16 rounded-full bg-navy dark:bg-primary-light ${centered ? "mx-auto" : ""}`}
      />

      {subheading && (
        <motion.p
          variants={subVariants}
          className="mt-3 text-slate-500 dark:text-white/70 text-sm md:text-base leading-relaxed"
        >
          {subheading}
        </motion.p>
      )}
    </motion.div>
  );
}
