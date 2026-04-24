import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence, useTransform } from "motion/react";
import { useState, useRef, useEffect } from "react";
import Lenis from "lenis";
import { TimelineSection } from "./components/TimelineSection";
import { ProjectCard } from "./components/ProjectCard";
import { Skills } from "./components/Skills";
import { LiveClock } from "./components/LiveClock";
import { Magnetic } from "./components/Magnetic";
import { StatusHUD } from "./components/StatusHUD";
import { TypingText } from "./components/TypingText";
import { BackgroundAnimation } from "./components/BackgroundAnimation";
import { LogoIcon } from "./components/LogoIcon";
import { ContactForm } from "./components/ContactForm";
import { ResumeSection } from "./components/ResumeSection";
import { Github, Linkedin, Mail, ArrowUpRight, Menu, X, ArrowUp, Copy, Check } from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function App() {
  const { scrollYProgress, scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const containerRef = useRef(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    setShowBackToTop(latest > 400);
  });

  const copyEmail = () => {
    navigator.clipboard.writeText("shaunaksikdar@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

  const navLinks = [
    { name: "Story", href: "#story" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Vision", href: "#vision" },
    { name: "Resume", href: "#resume" }
  ];

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="selection:bg-white selection:text-black relative min-h-screen">
      {/* Noise Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <BackgroundAnimation />
      <StatusHUD />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full px-6 md:px-12 flex justify-between items-center z-40 transition-all duration-700 ${isScrolled ? 'glass-scrolled py-4' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="flex items-center gap-12">
          <Magnetic strength={0.2}>
            <motion.a 
              href="#home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={(e) => {
                e.preventDefault();
                lenisRef.current?.scrollTo(0);
              }}
              className="flex items-center gap-3 group"
            >
              <LogoIcon className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-sm font-black tracking-tighter uppercase hover:opacity-70 transition-opacity">
                Shaunak.
              </span>
            </motion.a>
          </Magnetic>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Magnetic key={link.name} strength={0.1}>
                <a 
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    lenisRef.current?.scrollTo(link.href);
                  }}
                  className={`text-[11px] uppercase tracking-[0.3em] font-bold transition-colors p-2 ${isScrolled ? 'text-white/60 hover:text-white' : 'text-muted hover:text-white'}`}
                >
                  {link.name}
                </a>
              </Magnetic>
            ))}
          </div>
          <div className="hidden md:block">
            <LiveClock />
          </div>
        </div>
        <div className="flex gap-4 md:gap-10 items-center">
          <Magnetic strength={0.15}>
            <motion.a 
              href="#contact" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                lenisRef.current?.scrollTo('#contact');
              }}
              className="hidden sm:block text-[10px] uppercase tracking-[0.4em] font-bold px-4 py-2 rounded-full border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Contact
            </motion.a>
          </Magnetic>
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Magnetic strength={0.2}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 glass rounded-full hover:bg-white/10 transition-colors z-50"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 glass backdrop-blur-3xl flex flex-col justify-center items-center lg:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    lenisRef.current?.scrollTo(link.href);
                  }}
                  className="text-4xl font-black tracking-tighter uppercase text-gradient hover:scale-110 transition-transform"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  lenisRef.current?.scrollTo('#contact');
                }}
                className="text-xl uppercase tracking-[0.4em] font-bold text-muted hover:text-white transition-colors mt-4"
              >
                Contact
              </motion.a>
            </div>
            {/* Mobile Menu Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-12 left-0 right-0 text-center"
            >
              <div className="text-[10px] uppercase tracking-[0.6em] font-black text-white/20">
                Shaunak's Portfolio
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="z-10"
        >
          <h1 className="text-[16vw] md:text-[12vw] font-black leading-[0.85] tracking-tighter mb-8 text-gradient drop-shadow-2xl uppercase">
            SHAUNAK
          </h1>
          <TypingText 
            texts={["Full Stack Developer", "Exploring AI/ML", "Creative Coder"]} 
            typingSpeed={80}
            deletingSpeed={40}
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-xl font-light text-white/70 max-w-2xl mx-auto leading-relaxed px-4 mt-10"
          >
            Crafting digital experiences through <span className="text-white font-medium">code</span> and <span className="text-white font-medium">minimalism</span>.
          </motion.p>
        </motion.div>

        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white/5 blur-[120px] rounded-full -z-10" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group"
          onClick={() => lenisRef.current?.scrollTo('#story')}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent group-hover:from-white transition-all" />
        </motion.div>
      </section>

      {/* Story Timeline */}
      <div className="relative">
        <TimelineSection 
          id="story"
          phase="01. The Beginning" 
          title="Curiosity." 
          subtitle="Where it all started. Breaking things to understand how they work, and eventually learning to build them back better."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="p-8 glass rounded-2xl">
              <h4 className="text-xl font-bold mb-4">Self-Taught Journey</h4>
              <p className="text-muted leading-relaxed">
                Built from curiosity, not curriculum. No formal roadmap just consistent experimentation, deep dives, and hands-on learning through real projects.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="p-8 glass rounded-2xl">
              <h4 className="text-xl font-bold mb-4">First Milestone</h4>
              <p className="text-muted leading-relaxed">
                Built a simple task manager that actually helped my peers. That was the moment I realized code is a superpower for solving real problems.
              </p>
            </motion.div>
          </div>
        </TimelineSection>

        <TimelineSection 
          id="projects"
          phase="02. The Growth" 
          title="Creation." 
          subtitle="Turning ideas into production-ready applications. Focusing on performance, scalability, and user-centric design."
        >
          <div className="space-y-8">
            <ProjectCard 
              title="Signal AI" 
              description="AI Resume Intelligence platform powered by Groq. 'Know Your Signal. Land Your Role.' Analyzes resumes for skills, gaps, and impact to help candidates land their dream roles."
              tags={["Groq", "React", "Tailwind", "Framer Motion"]}
              image="/projects/skillsignal.jpeg"
              link="https://skillsignal-one.vercel.app/"
              githubLink="https://github.com/Shaan75/skillsignal"
            />
            <ProjectCard 
              title="Air Quality Monitor" 
              description="Real-time air quality monitoring and forecasting system using IoT sensor data and an LNN model to predict PM2.5/PM10 with live dashboard alerts."
              tags={["Liquid Neural Network", "Fast API", "Firebase", "React", "Tailwind"]}
              image="/projects/pol.jpeg"
              githubLink="https://github.com/SrayanBhattacharya/air-quality-monitor"
            />
          </div>
        </TimelineSection>

        <TimelineSection 
          id="skills"
          phase="03. The Present" 
          title="Expertise." 
          subtitle="The current toolkit. A blend of modern frontend frameworks and robust backend architectures."
        >
          <Skills />
        </TimelineSection>

        <TimelineSection 
          id="vision"
          phase="04. The Future" 
          title="Vision." 
          subtitle="Exploring the intersection of AI and human-computer interaction. Building tools that feel like magic."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Intelligence",
                desc: "Integrating LLMs to create adaptive interfaces that anticipate user needs.",
                icon: "✨"
              },
              {
                title: "Interaction",
                desc: "Moving beyond clicks to more natural, fluid ways of communicating with machines.",
                icon: "🌊"
              },
              {
                title: "Impact",
                desc: "Building software that doesn't just work, but empowers and inspires.",
                icon: "🚀"
              }
            ].map((pillar, i) => (
              <motion.div 
                key={pillar.title}
                variants={itemVariants}
                whileHover={{ y: -10, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                className="p-8 md:p-10 glass rounded-[2rem] relative overflow-hidden group transition-all duration-500"
              >
                <div className="text-3xl md:text-4xl mb-4 md:mb-6 group-hover:scale-125 transition-transform duration-500">{pillar.icon}</div>
                <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 tracking-tight">{pillar.title}</h4>
                <p className="text-muted text-xs md:text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                  {pillar.desc}
                </p>
                {/* Subtle accent glow */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-all duration-700" />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-8 md:mt-12 p-8 md:p-12 glass rounded-[2.5rem] md:rounded-[3rem] text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-50" />
            <h3 className="text-xl md:text-4xl font-black mb-4 md:mb-6 tracking-tighter relative z-10">
              THE NEXT FRONTIER.
            </h3>
            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto relative z-10 font-light italic">
              "The best way to predict the future is to invent it."
            </p>
          </motion.div>
        </TimelineSection>

        <TimelineSection 
          id="resume"
          phase="05. The Summary" 
          title="Resume." 
          subtitle="Looking for the details? Download my complete professional history in a single, well-crafted document."
        >
          <ResumeSection />
        </TimelineSection>
      </div>

      {/* Contact Section */}
      <section id="contact" className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-32 md:py-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-end border-t border-white/5 pt-24">
            <div className="space-y-16">
              <div className="space-y-8">
                <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/30">Get in touch</span>
                <h2 className="text-6xl sm:text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8]">
                  LET'S <br /> <span className="text-white/10">TALK.</span>
                </h2>
              </div>
              
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                  <a 
                    href="mailto:shaunaksikdar@gmail.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    data-lenis-prevent
                    className="text-xl sm:text-2xl md:text-5xl font-bold hover:text-white transition-colors flex items-center gap-4 md:gap-6 group w-fit break-all sm:break-normal"
                  >
                    shaunaksikdar@gmail.com
                    <ArrowUpRight className="w-5 h-5 sm:w-8 sm:h-8 md:w-12 md:h-12 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform shrink-0" />
                  </a>
                  
                  <div className="relative">
                    <Magnetic strength={0.1}>
                      <button 
                        onClick={copyEmail}
                        className={`flex items-center gap-2 px-4 py-2 glass rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300 group/copy shrink-0 ${
                          copied 
                            ? "!bg-green-500 text-white !border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
                            : "hover:!bg-green-500 hover:text-white hover:!border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 group-hover/copy:scale-110 transition-transform" />
                            Copy Email
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </div>

                {/* Mobile Contact Form - Appears right after email on small screens */}
                <div className="lg:hidden pt-4">
                  <div className="space-y-8">
                    <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/30">Send a message</span>
                    <ContactForm />
                  </div>
                </div>

                <p className="text-white/70 text-lg md:text-xl max-w-lg leading-relaxed font-light">
                  Currently available for freelance projects and full-time opportunities. Let's build something extraordinary together.
                </p>
              </div>

              <div className="flex gap-6">
                <Magnetic strength={0.2}>
                  <a href="https://github.com/Shaan75" target="_blank" rel="noopener noreferrer" className="p-5 glass rounded-3xl hover:!bg-green-500 hover:!border-green-400 hover:text-white transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <Github className="w-8 h-8" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a href="https://linkedin.com/in/shaunaksikdar" target="_blank" rel="noopener noreferrer" className="p-5 glass rounded-3xl hover:!bg-blue-500 hover:!border-blue-400 hover:text-white transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <Linkedin className="w-8 h-8" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a href="https://mail.google.com/mail/u/0/?fs=1&to=shaunaksikdar@gmail.com&su=Hello%20Shaunak!&body=Hi%20Shaunak,%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect." target="_blank" rel="noopener noreferrer" className="p-5 glass rounded-3xl hover:!bg-yellow-400 hover:!border-yellow-300 hover:text-white transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                    <Mail className="w-8 h-8" />
                  </a>
                </Magnetic>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                <div className="space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/30">Navigation</span>
                  <ul className="grid grid-cols-2 gap-4">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-sm font-medium text-muted hover:text-white transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/30">Location</span>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-white">Kolkata, India</p>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                      <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Available for work</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:pb-16">
              <div className="space-y-10">
                <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/30">Send a message</span>
                <ContactForm />
              </div>
            </div>
          </div>

          <footer className="mt-24 md:mt-48 flex flex-col md:flex-row justify-between items-center gap-12 border-t border-white/5 py-16 text-[10px] uppercase tracking-[0.8em] text-muted">
            <p>&copy; 2026 SHAUNAK SIKDAR. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-12">
              <button 
                onClick={() => lenisRef.current?.scrollTo(0)}
                className="hover:text-white transition-colors"
              >
                Back to top
              </button>
              <div className="flex items-center gap-4">
                <LogoIcon className="w-8 h-8 opacity-40" />
                <div className="font-serif italic text-3xl lowercase tracking-normal text-white/20">
                  shaunak.
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      </section>

      {/* Background Noise/Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <motion.div 
          style={{ y: y1, rotate }}
          className="absolute top-[10%] -left-[5%] w-[40vw] h-[40vw] bg-white/[0.02] blur-[100px] rounded-full"
        />
        <motion.div 
          style={{ y: y2, rotate: -rotate }}
          className="absolute bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-white/[0.01] blur-[120px] rounded-full"
        />
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <div className="fixed bottom-8 right-8 z-50">
            <Magnetic strength={0.3}>
              <motion.button
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)", color: "black" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => lenisRef.current?.scrollTo(0)}
                className="p-4 glass rounded-full shadow-2xl transition-colors duration-300 group"
                aria-label="Back to top"
              >
                <ArrowUp className="w-5 h-5 group-hover:animate-bounce" />
              </motion.button>
            </Magnetic>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
