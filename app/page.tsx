"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";

const birthdayQuotes = [
  "Today is all about you. Enjoy every moment.",
  "Another year of being absolutely amazing.",
  "May your birthday be as wonderful as you are.",
  "Cheers to another year of laughter and joy.",
  "Wishing you 365 days of happiness.",
  "Here's to making your dreams come true.",
  "Another adventure-filled year awaits you.",
  "You deserve all the cake and more.",
];

const gifts = [
  { icon: "♡", title: "Love", desc: "Unlimited, unconditional, forever." },
  { icon: "✿", title: "Joy", desc: "May laughter follow you everywhere." },
  { icon: "☆", title: "Dreams", desc: "May they all come true this year." },
  { icon: "∞", title: "Adventure", desc: "Exciting journeys await you." },
  { icon: "✧", title: "Blessings", desc: "Showered upon you today and always." },
];

const confettiColors = ["#fbbf24", "#f472b6", "#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f87171", "#c084fc"];

type ConfettiShape = "heart" | "dot" | "ring" | "star" | "petal";
const confettiShapes: ConfettiShape[] = ["heart", "dot", "ring", "star", "petal"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface ParticleData {
  x: number;
  size: number;
  color: string;
  shape: ConfettiShape;
  rotation: number;
  delay: number;
  duration: number;
  sway: number;
  opacity: number;
}

function ConfettiParticle({ particle }: { particle: ParticleData }) {
  const shapeElement = () => {
    switch (particle.shape) {
      case "heart":
        return (
          <svg viewBox="0 0 24 24" fill={particle.color} className="w-full h-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case "ring":
        return (
          <div 
            className="w-full h-full rounded-full border-2"
            style={{ borderColor: particle.color }}
          />
        );
      case "star":
        return (
          <svg viewBox="0 0 24 24" fill={particle.color} className="w-full h-full">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case "petal":
        return (
          <div 
            className="w-full h-full rounded-full"
            style={{ 
              background: `radial-gradient(circle at 30% 30%, ${particle.color}, ${particle.color}88)`,
            }}
          />
        );
      default:
        return (
          <div 
            className="w-full h-full rounded-full"
            style={{ backgroundColor: particle.color }}
          />
        );
    }
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: "-5%",
        animation: `confetti-drift ${particle.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${particle.delay}s forwards`,
        opacity: particle.opacity,
      }}
    >
      <div
        style={{
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          animation: `confetti-spin ${particle.duration * 0.8}s linear ${particle.delay}s infinite, confetti-sway ${particle.sway}s ease-in-out ${particle.delay}s infinite`,
          filter: `drop-shadow(0 0 ${particle.size > 10 ? 6 : 3}px ${particle.color}66)`,
        }}
      >
        {shapeElement()}
      </div>
    </div>
  );
}

function GlowOrb({ style, color }: { style: React.CSSProperties; color: string }) {
  return (
    <div 
      className="absolute rounded-full blur-xl"
      style={{
        ...style,
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      }}
    />
  );
}

export default function Home() {
  const [candlesLit, setCandlesLit] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [openGift, setOpenGift] = useState<number | null>(null);
  const [daysUntilBirthday, setDaysUntilBirthday] = useState(0);
  const [wishMade, setWishMade] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const confettiParticles = useMemo(() => {
    const particles: ParticleData[] = [];
    
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: seededRandom(i * 7 + 1) * 100,
        size: 8 + seededRandom(i * 11 + 2) * 16,
        color: confettiColors[Math.floor(seededRandom(i * 13 + 3) * confettiColors.length)],
        shape: confettiShapes[Math.floor(seededRandom(i * 17 + 4) * confettiShapes.length)],
        rotation: seededRandom(i * 19 + 5) * 360,
        delay: seededRandom(i * 23 + 6) * 1.2,
        duration: 3 + seededRandom(i * 29 + 7) * 3,
        sway: 1.5 + seededRandom(i * 31 + 8) * 2,
        opacity: 0.6 + seededRandom(i * 37 + 9) * 0.4,
      });
    }
    
    return particles;
  }, []);

  const glowOrbs = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      left: `${10 + seededRandom(i * 41 + 1) * 80}%`,
      top: `${10 + seededRandom(i * 43 + 2) * 80}%`,
      width: `${80 + seededRandom(i * 47 + 3) * 120}px`,
      height: `${80 + seededRandom(i * 53 + 4) * 120}px`,
      color: confettiColors[Math.floor(seededRandom(i * 59 + 5) * confettiColors.length)],
      animationDelay: `${seededRandom(i * 61 + 6) * 2}s`,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % birthdayQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date();
    const thisYear = today.getFullYear();
    let birthday = new Date(thisYear, 9, 24);
    if (today > birthday) {
      birthday = new Date(thisYear + 1, 9, 24);
    }
    const diff = Math.ceil(
      (birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysUntilBirthday(diff);
  }, []);

  const blowCandles = useCallback(() => {
    setCandlesLit(false);
    setShowConfetti(true);
    setMusicStarted(true);
    setBurstActive(true);
    
    setTimeout(() => {
      setShowConfetti(false);
      setBurstActive(false);
    }, 6000);
    
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
      }
    }, 500);
  }, []);

  const relightCandles = useCallback(() => {
    setCandlesLit(true);
    setWishMade(false);
  }, []);

  const makeWish = useCallback(() => {
    if (!candlesLit) {
      setWishMade(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [candlesLit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />
      
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/30 dark:bg-rose-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {glowOrbs.map((orb, i) => (
            <GlowOrb
              key={`orb-${i}`}
              style={{
                left: orb.left,
                top: orb.top,
                width: orb.width,
                height: orb.height,
                animation: `pulse-glow 3s ease-in-out ${orb.animationDelay} infinite`,
              }}
              color={orb.color}
            />
          ))}
          
          {burstActive && (
            <>
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: "10px",
                  height: "10px",
                  background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
                  animation: "burst-expand 1s ease-out forwards",
                }}
              />
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: "10px",
                  height: "10px",
                  background: "radial-gradient(circle, #f472b6 0%, transparent 70%)",
                  animation: "burst-expand 1.2s ease-out 0.1s forwards",
                }}
              />
            </>
          )}
          
          {confettiParticles.map((particle, i) => (
            <ConfettiParticle key={i} particle={particle} />
          ))}
        </div>
      )}

      <main
        className={`w-full max-w-2xl relative z-10 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="relative inline-block mb-10">
            <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 via-purple-400 to-rose-400 rounded-full opacity-20 blur-lg animate-pulse" />
            <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-white/80 dark:ring-stone-800 ring-offset-8 ring-offset-rose-50 dark:ring-offset-stone-950 shadow-xl">
              <Image
                src="/gab.jpg"
                alt="Birthday celebrant"
                width={144}
                height={144}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {candlesLit && (
              <span className="absolute -bottom-2 -right-2 text-3xl animate-bounce">✨</span>
            )}
          </div>

          <p className="text-xs tracking-[0.4em] uppercase text-rose-400 dark:text-rose-300 mb-4 font-medium">
            A celebration of
          </p>
          <h1 className="text-6xl md:text-7xl font-serif italic text-stone-800 dark:text-stone-100 mb-6 tracking-tight">
            Happy Birthday
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-600 to-transparent mx-auto mb-6" />
          <p className="text-lg text-stone-500 dark:text-stone-400 font-light max-w-md mx-auto leading-relaxed italic">
            &ldquo;{birthdayQuotes[currentQuote]}&rdquo;
          </p>
        </div>

        {/* Candle Section */}
        <div className="mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 via-purple-100/50 to-rose-100/50 dark:from-stone-800/50 dark:via-stone-700/50 dark:to-stone-800/50 rounded-3xl blur-xl" />
            <div className="relative bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl rounded-3xl p-10 border border-white/50 dark:border-stone-800/50 shadow-xl">
              <div className="flex items-center justify-center gap-3 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-700 ${
                      candlesLit ? "opacity-100 scale-100" : "opacity-20 scale-75"
                    }`}
                  >
                    {candlesLit ? (
                      <div className="flex flex-col items-center">
                        <div className="w-1.5 h-4 bg-gradient-to-t from-orange-500 via-yellow-400 to-amber-200 rounded-full animate-flicker shadow-lg shadow-orange-500/50" />
                        <div className="w-4 h-10 bg-gradient-to-b from-stone-100 to-stone-200 dark:from-stone-600 dark:to-stone-700 rounded-full shadow-inner" />
                      </div>
                    ) : (
                      <div className="w-4 h-10 bg-stone-200 dark:bg-stone-700 rounded-full opacity-30" />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mb-6">
                {!candlesLit && !wishMade && (
                  <button
                    onClick={makeWish}
                    className="text-sm tracking-[0.2em] uppercase text-stone-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 mb-4 hover:tracking-[0.3em]"
                  >
                    ✦ Make a wish ✦
                  </button>
                )}
                {wishMade && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium animate-fade-in">
                    Your wish has been sent to the stars ✦
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={blowCandles}
                  disabled={!candlesLit}
                  className="px-8 py-3 text-sm rounded-full bg-gradient-to-r from-stone-800 to-stone-700 dark:from-stone-200 dark:to-stone-300 text-white dark:text-stone-900 hover:from-stone-700 hover:to-stone-600 dark:hover:from-stone-300 dark:hover:to-stone-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Blow
                </button>
                <button
                  onClick={relightCandles}
                  disabled={candlesLit}
                  className="px-8 py-3 text-sm rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  Relight
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gifts Section */}
        <div className="mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 dark:text-stone-500 text-center mb-8">
            Birthday Wishes
          </p>
          <div className="grid grid-cols-5 gap-4">
            {gifts.map((gift, i) => (
              <button
                key={i}
                onClick={() => setOpenGift(openGift === i ? null : i)}
                className={`group relative p-6 rounded-2xl text-center transition-all duration-500 ${
                  openGift === i
                    ? "bg-gradient-to-br from-stone-800 to-stone-900 dark:from-stone-200 dark:to-stone-100 text-white dark:text-stone-900 scale-105 shadow-xl"
                    : "bg-white/80 dark:bg-stone-900/80 backdrop-blur hover:bg-white dark:hover:bg-stone-800 border border-stone-100/50 dark:border-stone-800/50 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <span className="text-3xl mb-3 block">{gift.icon}</span>
                <span className={`text-xs font-medium tracking-wide ${openGift === i ? "" : "text-stone-600 dark:text-stone-400"}`}>
                  {gift.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gift Message */}
        {openGift !== null && (
          <div className="mb-20 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-200/30 to-purple-200/30 dark:from-stone-700/30 dark:to-stone-600/30 rounded-2xl blur-xl" />
              <div className="relative bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl p-10 border border-white/50 dark:border-stone-800/50 text-center shadow-xl">
                <span className="text-4xl mb-4 block">{gifts[openGift].icon}</span>
                <p className="text-stone-600 dark:text-stone-300 font-light text-lg italic">
                  {gifts[openGift].desc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Countdown Section */}
        <div className="mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 dark:text-stone-500 text-center mb-8">
            Countdown
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/50 dark:border-stone-800/50 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-serif italic text-stone-800 dark:text-stone-100 mb-2">
                {daysUntilBirthday}
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400">
                days
              </div>
            </div>
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/50 dark:border-stone-800/50 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-serif italic text-stone-800 dark:text-stone-100 mb-2">
                Oct
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400">
                24th
              </div>
            </div>
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/50 dark:border-stone-800/50 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-serif italic text-stone-800 dark:text-stone-100 mb-2">
                ♡
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400">
                forever
              </div>
            </div>
          </div>
        </div>

        {/* Music Section */}
        <div className="mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 rounded-3xl blur-xl opacity-50" />
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 p-10 shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <p className="text-[10px] tracking-[0.5em] uppercase text-stone-500 mb-8 text-center">
                  Dedicated To You
                </p>
                
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-2 bg-gradient-to-br from-rose-500/20 to-purple-500/20 rounded-2xl blur-lg" />
                    <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center shadow-2xl">
                      <svg className="w-12 h-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-serif italic text-stone-100 mb-2">
                      Merry Christmas, i miss you
                    </h3>
                    <p className="text-sm text-stone-400 mb-3">
                      Alex Crichton
                    </p>
                    <p className="text-xs text-stone-500 italic">
                      &ldquo;What if I call and you pick up the phone?&rdquo;
                    </p>
                  </div>
                </div>
                
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-8">
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/RdxEnXIX23g?rel=0&enablejsapi=1${musicStarted ? "&autoplay=1" : ""}`}
                    title="Merry Christmas, i miss you - Alex Crichton"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                
                <div className="flex justify-center gap-10">
                  <a
                    href="https://open.spotify.com/track/2GFrDW0pEXpjbNrKvFYI8k"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Spotify
                  </a>
                  <a
                    href="https://music.apple.com/us/song/merry-christmas-i-miss-you/6784789929"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0 0 19.2.25a10.58 10.58 0 0 0-1.924-.24C16.376 0 15.704 0 14.004 0H9.996c-1.7 0-2.372 0-3.276.01a10.58 10.58 0 0 0-1.924.24A5.022 5.022 0 0 0 3.426.89C2.308 1.624 1.562 2.624 1.246 3.934a9.23 9.23 0 0 0-.24 2.19C1 6.444 1 7.116 1 8.816v6.368c0 1.7 0 2.372.01 3.276.006.666.06 1.33.18 1.98.317 1.31 1.062 2.31 2.18 3.043a5.022 5.022 0 0 0 1.868.64c.628.13 1.276.184 1.924.24.904.01 1.576.01 3.276.01h4.008c1.7 0 2.372 0 3.276-.01a10.58 10.58 0 0 0 1.924-.24 5.022 5.022 0 0 0 1.868-.64c1.118-.734 1.862-1.734 2.18-3.043.12-.65.174-1.314.18-1.98.01-.904.01-1.576.01-3.276V8.816c0-1.7 0-2.372-.01-3.276-.006-.666-.06-1.33-.18-1.98zM17.994 15.95l-.004.006c-1.37 2.438-3.816 3.924-6.634 4.016a.75.75 0 1 1-.026-1.5c2.16-.07 4.014-1.15 5.18-2.904.586-.884.916-1.958.916-3.08v-.212a.75.75 0 0 1 1.5 0v.212c0 1.414-.41 2.752-1.142 3.912l-.004.002v-.354zM12 15.75a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75.75z" />
                    </svg>
                    Apple Music
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center space-y-8 pb-10">
          <div className="flex justify-center gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-600"
              />
            ))}
          </div>

          <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed max-w-sm mx-auto text-sm italic">
            May all your dreams come true on this special day and throughout the
            coming year.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <button className="px-8 py-3 text-sm rounded-full bg-gradient-to-r from-stone-800 to-stone-700 dark:from-stone-200 dark:to-stone-300 text-white dark:text-stone-900 hover:from-stone-700 hover:to-stone-600 dark:hover:from-stone-300 dark:hover:to-stone-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Share
            </button>
            <a
              href="https://www.facebook.com/messages/e2ee/t/26505547669032397"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-sm rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.432 5.506 3.674 7.21V22l3.736-2.049c.995.276 2.042.422 3.102.422h.488C17.523 20.373 22 16.228 22 11.243 22 6.145 17.523 2 12 2zm1.073 13.38l-2.557-2.736L6.5 15.38l5.107-5.437 2.608 2.736 5.018-2.736-5.107 5.437z" />
              </svg>
              Send Wishes
            </a>
          </div>
        </div>

        {/* Made with love */}
        <div className="pt-10 border-t border-stone-200/50 dark:border-stone-800/50 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-stone-300 dark:text-stone-600">
            Made with love
          </p>
        </div>
      </main>
    </div>
  );
}
