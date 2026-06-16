"use client";

import { motion } from "framer-motion";
import { TrackedLink } from "@/components/TrackedLink";
import { FollowX } from "@/components/apply/FollowX";
import { SectionViewTracker } from "@/components/SectionViewTracker";

export function Hero() {
  // 浮き上がりすぎない、重みのあるイージング
  const cinematicEase = [0.22, 1, 0.36, 1];

  return (
    <header
      id="hero"
      className="relative w-full h-screen bg-[#0E0E0F] text-[#F4F1EA] overflow-hidden flex flex-col items-center justify-center p-6"
    >
      <SectionViewTracker event="hero_view" />

      {/* --- 1. 背景動画とシャドウ（オーバーレイ） --- */}
      <div className="absolute inset-0 z-0">
        {/* 無限ループ動画 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* TODO: 実際の動画ファイルパスに置き換えてください */}
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        
        {/* 動画を暗く落とすためのシャドウ（Sumi Black） */}
        <div className="absolute inset-0 bg-[#0E0E0F]/80 pointer-events-none" />
      </div>

      {/* --- 2. メインコンテンツ（完全中央揃え） --- */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 md:gap-10 max-w-4xl">
        
        {/* 見出し */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: cinematicEase, delay: 0.2 }}
          className="w-48 md:w-72 lg:w-96 mb-2" /* ロゴのサイズはここのw-〇〇で調整できます */
        >
          <img 
            src="/hero.png" /* TODO: publicフォルダ内の実際のロゴのパスに変更してください */
            alt="ctsDAO" 
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* 削ぎ落としたステートメント */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: cinematicEase, delay: 0.6 }}
          className="text-lg md:text-xl font-normal text-[#F4F1EA]/80 tracking-wide leading-relaxed"
        >
          50-100 curated builders.
          Every seat is application-only.<br />
          The work, not the noise.
        </motion.p>

        {/* --- 3. アクションエリア --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: cinematicEase, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto"
        >
          {/* メインCTA */}
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

      {/* --- 4. スクロールインジケーター（画面中央下部） --- */}
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