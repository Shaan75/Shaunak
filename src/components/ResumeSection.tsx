import React from "react";
import { motion } from "motion/react";
import { FileText, Download, ExternalLink, Sparkles } from "lucide-react";
import { Magnetic } from "./Magnetic";

export const ResumeSection = () => {
  // Path to your resume in the /public folder
  const resumeUrl = "/SHAUNAK CV1.pdf"; 

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Visual Preview / Icon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-5 relative"
        >
          <div className="aspect-[3/4] w-full max-w-sm mx-auto glass rounded-[2.5rem] flex flex-col items-center justify-center group relative overflow-hidden">
            {/* Live Glimpse / Fallback Preview */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none overflow-hidden origin-top scale-[1.1]">
              {/* This iframe provides a "glimpse" of the actual PDF. 
                  Note: If /public/resume.pdf doesn't exist yet, this will just show a 404 or nothing. */}
              <iframe 
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-[200%] h-[200%] absolute top-0 left-0 border-none scale-[0.5] origin-top-left"
                title="Resume Preview"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500 shadow-2xl">
                <FileText className="w-12 h-12 md:w-16 md:h-16 text-white/40 group-hover:text-white transition-colors" />
              </div>
              
              <div className="text-center">
                <h4 className="text-2xl font-black tracking-tight mb-2 uppercase drop-shadow-lg">Official Resume</h4>
                <p className="text-sm text-white/40 font-mono tracking-widest uppercase">/public/resume.pdf</p>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.3em] text-white/20 whitespace-nowrap">
                <Sparkles className="w-3 h-3" />
                Live document glimpse
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </motion.div>

        {/* Right Side: Content & Actions */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
              CURATED <br /> <span className="text-white/20">PROFESSIONALISM.</span>
            </h3>
            <p className="text-muted text-lg max-w-lg leading-relaxed font-light mx-auto lg:mx-0">
              A comprehensive distillation of my journey, technical prowess, and the impact I've delivered across various projects and teams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Magnetic strength={0.2}>
              <a 
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <ExternalLink className="w-4 h-4" />
                View Document
              </a>
            </Magnetic>

            <Magnetic strength={0.15}>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resumeUrl;
                  link.download = 'Shaunak_Sikdar_Resume.pdf';
                  link.click();
                }}
                className="flex items-center gap-3 glass border border-white/10 hover:border-white/50 text-white hover:bg-white/10 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </div>
  );
};
