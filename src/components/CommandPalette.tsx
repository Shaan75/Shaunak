import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Command, Home, User, Briefcase, Code, Eye, Mail, X } from "lucide-react";

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { name: "Go to Home", icon: Home, href: "#home" },
    { name: "Read My Story", icon: User, href: "#story" },
    { name: "View Projects", icon: Briefcase, href: "#projects" },
    { name: "Check Skills", icon: Code, href: "#skills" },
    { name: "See Vision", icon: Eye, href: "#vision" },
    { name: "Contact Me", icon: Mail, href: "#contact" },
  ];

  const filteredActions = actions.filter(action => 
    action.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          handleAction(filteredActions[selectedIndex].href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex]);

  const handleAction = (href: string) => {
    setIsOpen(false);
    setSearch("");
    const element = document.querySelector(href);
    if (element) {
      // Use Lenis if available via window global or just standard scroll
      // Since we integrated Lenis in App.tsx, we can try to find the lenis instance
      // or just use the standard scroll which Lenis often intercepts.
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Trigger Button (Desktop Only) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden lg:flex items-center gap-3 glass px-4 py-2 rounded-full border border-white/10 hover:border-white/40 transition-all group"
      >
        <Command className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-white transition-colors">Press</span>
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-white">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="p-6 border-b border-white/10 flex items-center gap-4">
                <Search className="w-5 h-5 text-muted" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search actions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-xl w-full placeholder:text-muted"
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {filteredActions.map((action, index) => (
                    <button
                      key={action.name}
                      onClick={() => handleAction(action.href)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all group text-left ${
                        index === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition-colors ${
                        index === selectedIndex ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                      }`}>
                        <action.icon className={`w-5 h-5 transition-colors ${
                          index === selectedIndex ? "text-white" : "text-muted group-hover:text-white"
                        }`} />
                      </div>
                      <span className={`text-lg font-light transition-colors ${
                        index === selectedIndex ? "text-white" : "text-muted group-hover:text-white"
                      }`}>
                        {action.name}
                      </span>
                    </button>
                  ))}
                  {filteredActions.length === 0 && (
                    <div className="p-12 text-center text-muted italic">
                      No results found for "{search}"
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border-t border-white/10 flex justify-between items-center px-8">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">↑↓</kbd>
                    <span className="text-[10px] uppercase tracking-widest text-muted">Navigate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">↵</kbd>
                    <span className="text-[10px] uppercase tracking-widest text-muted">Select</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">ESC</kbd>
                  <span className="text-[10px] uppercase tracking-widest text-muted">Close</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
