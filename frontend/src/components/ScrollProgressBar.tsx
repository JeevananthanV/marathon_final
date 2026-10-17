"use client";
import { useScroll, useSpring, motion } from "framer-motion";

/**
 * ScrollProgressBar
 * A thin gradient bar fixed at the very top of the viewport that fills
 * as the user scrolls down the page. Uses a spring for smoothness.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-gradient-to-r from-[#e9387c] via-[#f97316] to-[#f59e0b]"
    />
  );
}
