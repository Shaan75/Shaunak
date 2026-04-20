import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Magnetic } from "./Magnetic";

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
  githubLink?: string;
}

export const ProjectCard = ({ title, description, tags, image, link, githubLink = "#" }: ProjectProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="perspective-2000 mb-12 md:mb-16">
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative glass rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-white/10 transition-colors duration-500"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Thumbnail Image */}
          <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden relative">
            <motion.img 
              src={image} 
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>

          {/* Content */}
          <div className="lg:w-3/5 p-8 md:p-10 flex flex-col justify-center">
            <div style={{ transform: "translateZ(40px)" }} className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-black group-hover:text-white transition-colors tracking-tighter mb-4">
                {title}
              </h3>

              <p className="text-white/50 text-base md:text-lg mb-8 max-w-xl leading-relaxed group-hover:text-white/80 transition-all duration-500">
                {description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 text-[9px] border border-white/10 rounded-full text-muted uppercase tracking-widest font-bold group-hover:border-white/20 group-hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {link && (
                <Magnetic strength={0.15}>
                  <a 
                    href={link}
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all group/btn"
                    aria-label="Live Demo"
                    target="_blank"
                  >
                    Live Demo
                    <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </Magnetic>
                )}
                <Magnetic strength={0.2}>
                  <a 
                    href={githubLink}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all group/github"
                    aria-label="GitHub Repository"
                    target="_blank"
                  >
                    <Github className="w-5 h-5 text-muted group-hover/github:text-white transition-colors" />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </motion.div>
    </div>
  );
};
