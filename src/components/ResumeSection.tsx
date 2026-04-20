import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FileText, Download, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { Magnetic } from "./Magnetic";

interface ResumePDFPreviewProps {
  url: string;
}

type RenderStatus = "loading" | "ready" | "error";

// Renders page 1 of any PDF onto a canvas — works on all devices including mobile
const ResumePDFPreview: React.FC<ResumePDFPreviewProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<RenderStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    const renderPDF = async (): Promise<void> => {
      try {
        const pdfjsLib = await import("pdfjs-dist");

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);

        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const devicePixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: 1.5 * devicePixelRatio });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / devicePixelRatio}px`;
        canvas.style.height = `${viewport.height / devicePixelRatio}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        if (!cancelled) setStatus("ready");
      } catch (err) {
        console.error("PDF render failed:", err);
        if (!cancelled) setStatus("error");
      }
    };

    renderPDF();
    return () => { cancelled = true; };
  }, [url]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Loading spinner */}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
        </div>
      )}

      {/* Fallback mock bars if PDF.js fails */}
      {status === "error" && (
        <div className="absolute inset-0 p-6 pt-8 flex flex-col gap-2 opacity-20">
          <div className="flex flex-col items-center gap-1 mb-3">
            <div className="h-2.5 w-32 bg-white/80 rounded-sm" />
            <div className="h-1.5 w-24 bg-white/50 rounded-sm" />
            <div className="h-1 w-20 bg-white/30 rounded-sm" />
          </div>
          {[
            [0.9, 0.75, 0.8],
            [0.6, 0.85, 0.7, 0.5],
            [0.8, 0.65, 0.9],
            [0.7, 0.55, 0.75],
          ].map((lines, i) => (
            <div key={i} className="flex flex-col gap-1 mb-2">
              <div className="h-1.5 rounded-sm bg-white/70 w-1/3" />
              {lines.map((w, j) => (
                <div key={j} className="h-1 rounded-sm bg-white/30" style={{ width: `${w * 100}%` }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Actual PDF canvas — wrapped so group-hover opacity works */}
      <div className="absolute inset-0 opacity-25 group-hover:opacity-50 transition-opacity duration-700">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 origin-top-left"
          style={{
            opacity: status === "ready" ? 1 : 0,
            transition: "opacity 0.6s ease",
            transform: "scale(0.55)",
            transformOrigin: "top left",
            // Invert so white PDF bg becomes dark — matches the card theme
            filter: "invert(1) grayscale(0.15)",
          }}
        />
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#05050540] to-transparent pointer-events-none" />
    </div>
  );
};

export const ResumeSection: React.FC = () => {
  const resumeUrl = "/SHAUNAK CV1.pdf";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Side: PDF Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-5 relative"
        >
          <div className="aspect-[3/4] w-full max-w-sm mx-auto glass rounded-[2.5rem] flex flex-col items-center justify-center group relative overflow-hidden">

            {/* ✅ Real PDF preview — works on mobile via PDF.js canvas rendering */}
            <ResumePDFPreview url={resumeUrl} />

            {/* Overlay Content */}
            <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500 shadow-2xl">
                <FileText className="w-12 h-12 md:w-16 md:h-16 text-white/40 group-hover:text-white transition-colors" />
              </div>

              <div className="text-center">
                <h4 className="text-2xl font-black tracking-tight mb-2 uppercase drop-shadow-lg">
                  Official Resume
                </h4>
                <p className="text-sm text-white/40 font-mono tracking-widest uppercase">
                  /public/resume.pdf
                </p>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.3em] text-white/20 whitespace-nowrap">
                <Sparkles className="w-3 h-3" />
                Page 1 of 1
              </div>
            </div>

            {/* Top shine line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </motion.div>

        {/* Right Side: Content & Actions */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
              CURATED <br />
              <span className="text-white/20">PROFESSIONALISM.</span>
            </h3>
            <p className="text-muted text-lg max-w-lg leading-relaxed font-light mx-auto lg:mx-0">
              A comprehensive distillation of my journey, technical prowess, and the impact I've
              delivered across various projects and teams.
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
                  const link = document.createElement("a");
                  link.href = resumeUrl;
                  link.download = "Shaunak_Sikdar_Resume.pdf";
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