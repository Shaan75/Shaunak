import { motion } from "motion/react";
import { Layout, Server, Settings, Zap, Globe } from "lucide-react";
import { Magnetic } from "./Magnetic";

const SKILLS = [
  {
    category: "Frontend",
    icon: Layout,
    items: [
      { name: "React", focus: true },
      { name: "TypeScript", focus: true },
      { name: "Next.js", focus: true },
      { name: "Tailwind CSS", focus: false }
    ]
  },
  {
    category: "Backend",
    icon: Server,
    items: [
      { name: "Node.js", focus: true },
      { name: "Express", focus: false },
      { name: "PostgreSQL", focus: true },
      { name: "REST API", focus: false },
      { name: "MongoDB", focus: false }
    ]
  },
  {
    category: "Tools",
    icon: Settings,
    items: [
      { name: "Git", focus: false },
      { name: "AWS", focus: true },
      { name: "Google Colab", focus: true },
      { name: "Firebase", focus: false },
      { name: "Matlab", focus: false }
    ]
  },
  {
    category: "Languages",
    icon: Globe,
    items: [
      { name: "Java", focus: true },
      { name: "Python", focus: false },
      { name: "C programming", focus: false }
    ]
  }
];

const groupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  }
};

export const Skills = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12">
      {SKILLS.map((group) => (
        <motion.div
          key={group.category}
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="p-6 md:p-8 glass rounded-[2rem] relative overflow-hidden group hover:bg-white/[0.02] transition-all duration-500 border border-white/5 hover:border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
              <group.icon className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-black text-white/30 group-hover:text-white/60 transition-colors">
              {group.category}
            </h3>
          </div>

          <ul className="space-y-3 md:space-y-4">
            {group.items.map((item) => (
              <motion.li 
                key={item.name} 
                variants={itemVariants}
                whileHover={{ x: 3 }}
                className="flex items-center justify-between group/item cursor-default"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base md:text-lg font-light text-muted group-hover/item:text-white transition-colors">
                    {item.name}
                  </span>
                  {item.focus && (
                    <div className="w-1 h-1 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  )}
                </div>
                <div className="w-6 h-[1px] bg-white/5 group-hover/item:w-8 group-hover/item:bg-white/20 transition-all duration-500" />
              </motion.li>
            ))}
          </ul>

          {/* Subtle background accent */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/[0.02] blur-[60px] rounded-full group-hover:bg-white/[0.05] transition-all duration-700" />
        </motion.div>
      ))}
    </div>
  );
};

