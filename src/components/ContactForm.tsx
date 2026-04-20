import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("https://formspree.io/f/mwvwwojq", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Formspree Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto lg:mx-0">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="name" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black text-white/30 ml-3 sm:ml-4">
            Full Name
          </label>
          <input
            required
            type="text"
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="email" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black text-white/30 ml-3 sm:ml-4">
            Email Address
          </label>
          <input
            required
            type="email"
            id="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="message" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black text-white/30 ml-3 sm:ml-4">
            Your Message
          </label>
          <textarea
            required
            id="message"
            rows={4}
            placeholder="Tell me about your project..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
          />
        </div>

        <button
          disabled={status === "loading" || status === "success"}
          type="submit"
          className={`group relative w-full overflow-hidden rounded-full py-4 sm:py-5 font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-500 ${
            status === "success" 
              ? "bg-green-500 text-white" 
              : status === "error"
              ? "bg-red-500 text-white"
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {status === "idle" && (
              <>
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
            {status === "loading" && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Send className="w-4 h-4" />
              </motion.div>
            )}
            {status === "success" && (
              <>
                Message Sent!
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
            {status === "error" && (
              <>
                Something went wrong
                <AlertCircle className="w-4 h-4" />
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};
