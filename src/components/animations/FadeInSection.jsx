import { motion } from "framer-motion";

/**
 * FadeInSection
 *
 * Props:
 * - children: ReactNode
 * - mode: "slide" | "fade-slide" (default: "fade-slide")
 * - duration: number (default: 0.6s)
 */
export default function FadeInSection({ children, mode = "fade-slide", duration = 0.6 }) {
  const variants = {
    slide: {
      initial: { y: 40, opacity: 1 },
      animate: { y: 0, opacity: 1 },
    },
    "fade-slide": {
      initial: { y: 40, opacity: 0.85 },
      animate: { y: 0, opacity: 1 },
    },
  };

  return (
    <div className="w-full h-full"> {/* ✅ Static container, no opacity here */}
      <motion.div
        initial={variants[mode].initial}
        whileInView={variants[mode].animate}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration, ease: "easeOut" }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
