"use client";

import { motion } from "framer-motion";
import { TrackedLink } from "@/components/TrackedLink";
import { FollowX } from "@/components/apply/FollowX";
import { SectionViewTracker } from "@/components/SectionViewTracker";

export function Hero() {
  const cinematicEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <header
      id="hero"
      className="relative w-full h-screen bg-[#0E0E0F] text-[#F4F1EA] overflow-hidden flex flex-col items-center justify-center p-6"
    >
      <SectionViewTracker event="hero_view" />
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-[#0E0E0F]/80 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8 md:gap-10 max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: cinematicEase, delay: 0.2 }}
          className="w-48 md:w-72 lg:w-96 mb-2"
        >
          <img 
            src="/hero.png"
            alt="ctsDAO" 
            className="w-full h-auto object-contain"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: cinematicEase, delay: 0.6 }}
          className="text-lg md:text-xl font-normal text-[#F4F1EA]/80 tracking-wide leading-relaxed"
        >
          100+ curated builders.
          Every seat is application-only.<br />
          The work, not the noise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: cinematicEase, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto"
        >
          <TrackedLink
            href="/apply"
            event="interest_cta_clicked"
            eventProps={{ location: "hero" }}
            className="group relative flex h-14 w-full sm:w-auto items-center justify-center gap-4 bg-[#C8362D] px-8 text-sm font-medium tracking-[0.15em] text-[#F4F1EA] transition-colors duration-200 hover:bg-[#a82a22]"
          >
            REQUEST INVITATION
            <span
              aria-hidden="true"
              className="font-mono text-xs transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </TrackedLink>
          
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-16 w-px bg-[#F4F1EA]/50"
        />
      </div>
    </header>
  );
}