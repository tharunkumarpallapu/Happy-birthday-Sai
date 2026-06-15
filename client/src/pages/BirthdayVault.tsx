import { motion } from 'framer-motion';
import { ChevronUp, Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface BirthdayVaultProps {
  onPrevious: () => void;
}

export function BirthdayVault({ onPrevious }: BirthdayVaultProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const calculateCountdown = () => {
      const targetDate = new Date(2026, 5, 25, 12, 0, 0).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsUnlocked(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
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
      <div className="glass-intense rounded-lg px-3 py-2 min-w-16">
        <motion.div
          className="text-2xl font-bold text-[#FF1493] text-glow-pink"
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
      className="relative min-h-screen w-full px-6 py-12 overflow-hidden flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp} className="space-y-2">
          <h1 className="text-4xl font-bold text-[#FF1493] animate-glow-pulse">
            ❤️ Birthday Vault ❤️
          </h1>
          <p className="text-sm text-white/60">A surprise worth waiting for</p>
        </motion.div>
      </motion.div>

      {/* Vault door */}
      <motion.div
        className="relative z-10 w-64 h-80 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Outer vault frame */}
        <div className="absolute inset-0 rounded-lg border-4 border-[#FF1493] bg-gradient-to-br from-[#0D021F] to-[#050010]">
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 20, 147, 0.3), inset 0 0 20px rgba(255, 20, 147, 0.1)',
                '0 0 40px rgba(255, 20, 147, 0.6), inset 0 0 30px rgba(255, 20, 147, 0.2)',
                '0 0 20px rgba(255, 20, 147, 0.3), inset 0 0 20px rgba(255, 20, 147, 0.1)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Vault door content */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 space-y-6">
            {/* Lock icon or open state */}
            {!isUnlocked ? (
              <>
                {/* Lock */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Lock className="w-16 h-16 text-[#FF1493]" />
                </motion.div>

                {/* Vault wheel */}
                <motion.div
                  className="w-24 h-24 rounded-full border-4 border-[#FF1493] flex items-center justify-center relative"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <div className="w-20 h-20 rounded-full border-2 border-[#FF1493]/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#FF1493]" />
                  </div>

                  {/* Tick marks */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`tick-${i}`}
                      className="absolute w-1 h-3 bg-[#FF1493]"
                      style={{
                        transform: `rotate(${(i * 45) - 90}deg) translateY(-48px)`,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Text */}
                <p className="text-center text-white/70 text-sm">
                  This vault holds a very special surprise for you ❤️
                </p>
              </>
            ) : (
              <>
                {/* Unlocked state */}
                <motion.div
                  className="text-6xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  🎉
                </motion.div>

                <p className="text-center text-[#FF1493] font-bold text-lg">
                  Vault Unlocked!
                </p>

                <p className="text-center text-white/70 text-sm">
                  Happy Birthday! 🎂❤️
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Countdown or unlock message */}
      {!isUnlocked ? (
        <motion.div
          className="relative z-10 max-w-md w-full space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Unlock date */}
          <motion.div variants={fadeInUp} className="text-center space-y-2">
            <p className="text-white/60 text-sm">Unlocks on</p>
            <p className="text-2xl font-bold text-[#FF1493]">June 25, 2026</p>
            <p className="text-white/60 text-sm">❤️ 12:00 AM ❤️</p>
          </motion.div>

          {/* Countdown boxes */}
          <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-2">
            <CountdownBox value={timeLeft.days} label="Days" />
            <CountdownBox value={timeLeft.hours} label="Hours" />
            <CountdownBox value={timeLeft.minutes} label="Minutes" />
            <CountdownBox value={timeLeft.seconds} label="Seconds" />
          </motion.div>

          {/* Message */}
          <motion.p
            variants={fadeInUp}
            className="text-center text-white/60 text-sm italic"
          >
            Patience is tough, but the wait will be totally worth it 💝✨
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          className="relative z-10 max-w-md w-full text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xl font-bold text-[#FF1493]">
            Happy Birthday! 🎂❤️
          </p>
          <p className="text-white/70">
            Thank you for 6 beautiful years. Here's to forever with you.
          </p>
        </motion.div>
      )}

      {/* Navigation button */}
      <motion.div
        className="fixed top-8 left-8 z-20"
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
      </motion.div>

      {/* Floating elements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`vault-float-${i}`}
          className="fixed text-2xl opacity-20 pointer-events-none"
          style={{
            left: `${10 + (i % 4) * 25}%`,
            top: `${20 + Math.floor(i / 4) * 60}%`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.sin(i) * 30, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10 + i,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        >
          {i % 2 === 0 ? '❤️' : '✨'}
        </motion.div>
      ))}
    </motion.div>
  );
}
