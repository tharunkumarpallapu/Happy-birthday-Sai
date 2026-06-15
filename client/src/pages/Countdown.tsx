import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fadeInUp, scaleIn, staggerContainer } from '@/lib/animations';

interface CountdownProps {
  onNavigate: () => void;
  onPrevious: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ onNavigate, onPrevious }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const calculateCountdown = () => {
      // Target date: June 25, 2026, 12:00 AM
      const targetDate = new Date(2026, 5, 25, 12, 0, 0).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });

        // Calculate progress percentage (assuming 365 days total)
        const totalSeconds = 365 * 24 * 60 * 60;
        const remainingSeconds = difference / 1000;
        const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
        setProgress(Math.min(progressPercent, 100));
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const CountdownBox = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <motion.div
      className="flex flex-col items-center space-y-2"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="glass-intense rounded-lg px-4 py-3 min-w-20">
        <motion.div
          className="text-3xl font-bold text-[#FF1493] text-glow-pink"
          key={value}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {String(value).padStart(2, '0')}
        </motion.div>
      </div>
      <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">
        {label}
      </span>
    </motion.div>
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Content Container */}
      <motion.div
        className="relative z-10 max-w-md w-full space-y-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#FF1493] animate-glow-pulse">
            ❤️ Our Special Day ❤️
          </h1>
          <p className="text-lg text-white/80">June 25, 12:00 AM</p>
          <p className="text-sm text-white/60">The day you were born ✨</p>
        </motion.div>

        {/* Large Heart Ring with Countdown */}
        <motion.div
          variants={scaleIn}
          className="flex justify-center py-8"
        >
          <div className="relative w-64 h-64">
            {/* Background circle */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 200 200"
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* Progress ring background */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255, 20, 147, 0.1)"
                strokeWidth="2"
              />
              {/* Progress ring */}
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#FF1493"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 90}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 90}` }}
                animate={{
                  strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
                }}
                transition={{ duration: 0.5 }}
                strokeLinecap="round"
                filter="drop-shadow(0 0 10px rgba(255, 20, 147, 0.6))"
              />
            </svg>

            {/* Heart in center */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="text-6xl">❤️</div>
            </motion.div>

            {/* Days left text */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center mt-16">
                <p className="text-sm text-white/60 mb-1">Only</p>
                <motion.p
                  className="text-5xl font-bold text-[#FF1493] text-glow-pink"
                  key={timeLeft.days}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {timeLeft.days.toString().padStart(2, '0')}
                </motion.p>
                <p className="text-xs text-white/60 mt-1">Days Left</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Countdown boxes */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-4 gap-2"
        >
          <CountdownBox value={timeLeft.days} label="Days" />
          <CountdownBox value={timeLeft.hours} label="Hours" />
          <CountdownBox value={timeLeft.minutes} label="Minutes" />
          <CountdownBox value={timeLeft.seconds} label="Seconds" />
        </motion.div>

        {/* Progress indicator */}
        <motion.div variants={fadeInUp} className="space-y-3">
          <div className="flex justify-between text-xs text-white/60">
            <span>Passed</span>
            <span>Remaining</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden neon-border">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF1493] to-[#FF4DA6]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              style={{
                boxShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
              }}
            />
          </div>
          <div className="flex justify-between text-sm font-semibold text-[#FF1493]">
            <span>{progress.toFixed(1)}%</span>
            <span>{(100 - progress).toFixed(1)}%</span>
          </div>
        </motion.div>

        {/* Descriptive text */}
        <motion.p
          variants={fadeInUp}
          className="text-center text-white/70 text-sm leading-relaxed"
        >
          Countdown to the most beautiful day of the year ❤️
        </motion.p>
      </motion.div>

      {/* Navigation buttons */}
      <motion.div
        className="absolute top-8 left-8 right-8 flex justify-between z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={onPrevious}
          className="p-3 rounded-full glass hover:bg-white/10 transition-all"
          aria-label="Previous page"
        >
          <ChevronUp className="w-6 h-6 text-[#FF1493]" />
        </button>
        <button
          onClick={onNavigate}
          className="p-3 rounded-full glass hover:bg-white/10 transition-all"
          aria-label="Next page"
        >
          <ChevronDown className="w-6 h-6 text-[#FF1493]" />
        </button>
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`countdown-particle-${i}`}
          className="absolute text-lg text-[#FF1493] opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 6 + 6,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        >
          ✨
        </motion.div>
      ))}
    </motion.div>
  );
}
