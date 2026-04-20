import { motion, useSpring, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

export const BackgroundAnimation = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();

  // Fade out animation as user scrolls away from hero (home) section
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let blasts: Blast[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      opacity: number;
      trail: { x: number; y: number }[];
      isDead: boolean;

      constructor() {
        this.reset();
        this.isDead = false;
      }

      reset() {
        // Start from top or sides
        const side = Math.random() > 0.5;
        if (side) {
          this.x = Math.random() * canvas!.width;
          this.y = -20;
        } else {
          this.x = -20;
          this.y = Math.random() * (canvas!.height / 2);
        }
        
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 8 + 5;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // ~45 degrees
        this.opacity = Math.random() * 0.8 + 0.4;
        this.trail = [];
        this.isDead = false;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 15) this.trail.shift();
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.y > canvas!.height || this.x > canvas!.width) {
          this.isDead = true;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.moveTo(this.x, this.y);
        for (let i = this.trail.length - 1; i >= 0; i--) {
          const t = this.trail[i];
          const opacity = (i / this.trail.length) * this.opacity * 0.6;
          ctx!.strokeStyle = `rgba(255, 200, 100, ${opacity})`;
          ctx!.lineWidth = this.size * (i / this.trail.length);
          ctx!.lineTo(t.x, t.y);
        }
        ctx!.stroke();

        ctx!.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    class Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 2 + 1;
        this.life = 1;
        this.maxLife = Math.random() * 0.5 + 0.5;
        const colors = ["#ffcc00", "#ff6600", "#ff3300", "#ffffff"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.life -= 0.02;
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.globalAlpha = this.life;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }
    }

    class Blast {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      speed: number;
      active: boolean;
      sparks: Spark[];
      flashOpacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = Math.random() * 100 + 80;
        this.opacity = 1;
        this.speed = 8;
        this.active = true;
        this.flashOpacity = 0.4;
        this.sparks = Array.from({ length: 15 }, () => new Spark(x, y));
      }

      update() {
        this.radius += this.speed;
        this.speed *= 0.95;
        this.opacity -= 0.03;
        this.flashOpacity -= 0.02;
        
        this.sparks.forEach(s => s.update());
        this.sparks = this.sparks.filter(s => s.life > 0);

        if (this.opacity <= 0 && this.sparks.length === 0) {
          this.active = false;
        }
      }

      draw() {
        ctx!.save();
        ctx!.globalCompositeOperation = "screen";

        // 1. Lighting Flash (simulates light on the dark screen)
        if (this.flashOpacity > 0) {
          const flashGradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.maxRadius * 4);
          flashGradient.addColorStop(0, `rgba(255, 100, 0, ${this.flashOpacity * 0.3})`);
          flashGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx!.fillStyle = flashGradient;
          ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
        }

        // 2. Fiery Blast Core
        if (this.opacity > 0) {
          const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`); // White hot core
          gradient.addColorStop(0.2, `rgba(255, 255, 0, ${this.opacity * 0.8})`); // Yellow
          gradient.addColorStop(0.5, `rgba(255, 100, 0, ${this.opacity * 0.6})`); // Orange
          gradient.addColorStop(0.8, `rgba(255, 0, 0, ${this.opacity * 0.3})`); // Red
          gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

          ctx!.fillStyle = gradient;
          ctx!.beginPath();
          ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx!.fill();

          // Outer glow ring
          ctx!.strokeStyle = `rgba(255, 150, 0, ${this.opacity * 0.4})`;
          ctx!.lineWidth = 2;
          ctx!.beginPath();
          ctx!.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2);
          ctx!.stroke();
        }

        // 3. Sparks/Embers
        this.sparks.forEach(s => s.draw());

        ctx!.restore();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 4 }, () => new Particle());
      blasts = [];
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
        
        if (p.isDead) {
          const blastX = Math.min(p.x, canvas.width);
          const blastY = Math.min(p.y, canvas.height);
          blasts.push(new Blast(blastX, blastY));
          p.reset();
        }
      });

      blasts = blasts.filter(b => b.active);
      blasts.forEach((b) => {
        b.update();
        b.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.div 
      style={{ opacity }}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Interactive Spotlight */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute w-[60vw] h-[60vw] bg-white/[0.03] blur-[120px] rounded-full"
      />

      {/* Canvas for Particles and Blasts */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-[0.8]"
      />

      {/* Floating Orbs - Reduced for performance */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-white/[0.02] blur-[120px] rounded-full"
      />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
    </motion.div>
  );
};
