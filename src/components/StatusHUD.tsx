import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState, useEffect } from "react";

export const StatusHUD = () => {
  const { scrollYProgress } = useScroll();
  const [scrollPercent, setScrollPercent] = useState(0);
  const [currentSection, setCurrentSection] = useState("HOME");

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollPercent(Math.round(latest * 100));
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id.toUpperCase() || "HOME");
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("section").forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-50 hidden lg:flex flex-col gap-2 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass px-4 py-2 rounded-full flex items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">System Online</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">
          {currentSection}
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass px-4 py-2 rounded-full flex items-center gap-4 w-fit"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Depth</span>
        <div className="w-24 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest min-w-[3ch]">
          {scrollPercent}%
        </span>
      </motion.div>
    </div>
  );
};
