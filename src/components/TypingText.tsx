import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TypingTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export const TypingText = ({ 
  texts, 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  pauseDuration = 2000 
}: TypingTextProps) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) return;

    if (subIndex === texts[index].length + 1 && !isDeleting) {
      setPause(true);
      setTimeout(() => {
        setPause(false);
        setIsDeleting(true);
      }, pauseDuration);
      return;
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, texts, typingSpeed, deletingSpeed, pause, pauseDuration]);

  return (
    <div className="flex items-center justify-center gap-1 h-8 md:h-12">
      <span className="text-lg md:text-3xl font-light text-white/90 tracking-tight">
        {texts[index].substring(0, subIndex)}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="w-[2px] h-6 md:h-8 bg-white/80"
      />
    </div>
  );
};
