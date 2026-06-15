import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface Letter {
  id: number;
  title: string;
  content: string;
  emoji: string;
}

interface SecretLettersProps {
  onNavigate: () => void;
  onPrevious: () => void;
}

const letters: Letter[] = [
  {
    id: 1,
    title: 'Letter 1',
    content:
      'Every moment with you feels like a beautiful dream. From the first day we met, I knew you were someone special. Thank you for being my greatest adventure.',
    emoji: '💌',
  },
  {
    id: 2,
    title: 'Letter 2',
    content:
      'You are my favorite person to laugh with, cry with, and dream with. In your eyes, I found my home. In your heart, I found my forever.',
    emoji: '💕',
  },
  {
    id: 3,
    title: 'Letter 3',
    content:
      'Six years have passed, and every single day, I fall in love with you all over again. You make me believe in soulmates, in forever, in magic.',
    emoji: '✨',
  },
  {
    id: 4,
    title: 'Letter 4',
    content:
      'Happy birthday to the love of my life. This is just the beginning of our story. I cannot wait to spend the rest of forever with you. You are my everything.',
    emoji: '🎂',
  },
];

export function SecretLetters({ onNavigate, onPrevious }: SecretLettersProps) {
  const [openedLetter, setOpenedLetter] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const Envelope = ({ letter, index }: { letter: Letter; index: number }) => (
    <motion.div
      className="relative h-40 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      {openedLetter === letter.id ? (
        // Opened envelope - letter view
        <motion.div
          layoutId={`letter-${letter.id}`}
          className="relative w-full h-full"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 0 }}
        >
          <div className="absolute inset-0 glass-intense rounded-lg p-4 flex flex-col justify-between overflow-hidden">
            {/* Wax seal effect */}
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#FF1493] opacity-70 blur-sm" />

            {/* Letter content */}
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-white/50 mb-2">Dear Love,</p>
                <p className="text-xs text-white/80 leading-relaxed line-clamp-4">
                  {letter.content}
                </p>
              </div>
              <p className="text-xs text-white/50 italic">Forever yours ❤️</p>
            </div>

            {/* Close button */}
            <motion.button
              onClick={() => setOpenedLetter(null)}
              className="absolute top-2 left-2 p-1 rounded-full hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-white/60" />
            </motion.button>
          </div>
        </motion.div>
      ) : (
        // Closed envelope
        <motion.button
          onClick={() => setOpenedLetter(letter.id)}
          className="relative w-full h-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Envelope glow */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 20, 147, 0.3)',
                '0 0 40px rgba(255, 20, 147, 0.6)',
                '0 0 20px rgba(255, 20, 147, 0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          />

          {/* Envelope body */}
          <div className="relative w-full h-full bg-gradient-to-br from-[#FF1493] to-[#FF4DA6] rounded-lg shadow-lg overflow-hidden">
            {/* Envelope flap */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#FF4DA6] to-[#FF1493] rounded-lg"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 60%, 0 0)',
              }}
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />

            {/* Wax seal */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FF1493] flex items-center justify-center text-lg z-10"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              ❤️
            </motion.div>

            {/* Letter number */}
            <div className="absolute bottom-3 right-3 text-white font-bold text-lg opacity-80">
              {letter.id}
            </div>

            {/* Tap indicator */}
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap to open
            </motion.div>
          </div>
        </motion.button>
      )}
    </motion.div>
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen w-full px-6 py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="relative z-10 max-w-md mx-auto text-center mb-8 pt-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp} className="space-y-2">
          <h1 className="text-4xl font-bold text-[#FF1493] animate-glow-pulse">
            ❤️ Secret Letters ❤️
          </h1>
          <p className="text-sm text-white/60">Messages from my heart to yours</p>
        </motion.div>
      </motion.div>

      {/* Envelopes */}
      <motion.div
        className="relative z-10 max-w-md mx-auto space-y-4 mb-12"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {letters.map((letter, index) => (
          <Envelope key={`letter-${letter.id}`} letter={letter} index={index} />
        ))}
      </motion.div>

      {/* Footer text */}
      <motion.p
        className="relative z-10 text-center text-white/60 text-sm italic max-w-md mx-auto mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Some words are better kept in letters... ❤️
      </motion.p>

      {/* Navigation buttons */}
      <motion.div
        className="fixed top-8 left-8 right-8 flex justify-between z-20"
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

      {/* Floating hearts */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`letter-heart-${i}`}
          className="fixed text-2xl opacity-20 pointer-events-none"
          style={{
            left: `${10 + (i % 4) * 25}%`,
            top: `${20 + Math.floor(i / 4) * 50}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.sin(i) * 30, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        >
          ❤️
        </motion.div>
      ))}
    </motion.div>
  );
}
