import { motion, useScroll, useTransform } from "motion/react";
import { useRef, ReactNode } from "react";

interface TimelineSectionProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  phase: string;
  id?: string;
}

export const TimelineSection = ({ title, subtitle, children, phase, id }: TimelineSectionProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section
      ref={ref}
      id={id}
      className="relative min-h-[70vh] flex flex-col justify-center py-16 md:py-24 px-6 md:px-24 overflow-hidden border-b border-white/5"
    >
      <div className="max-w-5xl mx-auto w-full relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <motion.span 
            variants={itemVariants}
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black text-white/20 mb-3 block"
          >
            {phase}
          </motion.span>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 text-gradient leading-[0.95] tracking-tighter"
          >
            {title}
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-sm md:text-lg text-white/60 font-light max-w-xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative"
        >
          {children}
        </motion.div>
      </div>

      {/* Dynamic Timeline Line Decorator */}
      <div className="absolute left-4 md:left-12 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block">
        <motion.div 
          style={{ height: lineHeight, opacity: lineOpacity }}
          className="w-full bg-gradient-to-b from-transparent via-white/40 to-transparent origin-top"
        />
      </div>
      
      {/* Subtle Background Text */}
      <motion.div 
        style={{ opacity: lineOpacity }}
        className="absolute -right-20 top-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] select-none pointer-events-none whitespace-nowrap hidden lg:block"
      >
        {title.toUpperCase()}
      </motion.div>
    </section>
  );
};
