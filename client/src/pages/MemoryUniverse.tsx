import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface Memory {
  id: number;
  title: string;
  description: string;
  x: number;
  y: number;
  emoji: string;
}

interface MemoryUniverseProps {
  onNavigate: () => void;
  onPrevious: () => void;
}

const memories: Memory[] = [
  {
    id: 1,
    title: 'Our First Hello',
    description: 'The moment our eyes met and everything changed forever.',
    x: 20,
    y: 25,
    emoji: '👋',
  },
  {
    id: 2,
    title: 'First Trip Together',
    description: 'Adventures, laughter, and memories that will last a lifetime.',
    x: 75,
    y: 20,
    emoji: '✈️',
  },
  {
    id: 3,
    title: 'That Special Day',
    description: 'The day you became mine, and I became yours forever.',
    x: 50,
    y: 15,
    emoji: '💍',
  },
  {
    id: 4,
    title: 'Support & Love',
    description: 'Through thick and thin, you were always there for me.',
    x: 15,
    y: 60,
    emoji: '🤝',
  },
  {
    id: 5,
    title: 'Endless Laughs',
    description: 'Our inside jokes and silly moments that make life beautiful.',
    x: 80,
    y: 65,
    emoji: '😄',
  },
  {
    id: 6,
    title: 'Dreams Shared',
    description: 'Building a future together, one dream at a time.',
    x: 45,
    y: 75,
    emoji: '🌙',
  },
  {
    id: 7,
    title: 'Better Together',
    description: 'You make me a better person every single day.',
    x: 25,
    y: 45,
    emoji: '💑',
  },
  {
    id: 8,
    title: 'Unforgettable Moments',
    description: 'Every second with you is a memory I treasure forever.',
    x: 70,
    y: 50,
    emoji: '✨',
  },
];

export function MemoryUniverse({ onNavigate, onPrevious }: MemoryUniverseProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            ❤️ Memory Universe ❤️
          </h1>
          <p className="text-sm text-white/60">Tap a star to relive a memory</p>
        </motion.div>
      </motion.div>

      {/* Constellation map */}
      <motion.div
        className="relative z-10 max-w-2xl mx-auto aspect-square mb-12 bg-gradient-to-b from-[#0D021F]/40 to-[#050010]/40 rounded-lg border border-[#FF1493]/20 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* SVG constellation lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1493" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#A020F0" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Draw lines between nearby stars */}
          {memories.map((memory, i) => {
            const nextMemory = memories[(i + 1) % memories.length];
            return (
              <line
                key={`line-${i}`}
                x1={`${memory.x}%`}
                y1={`${memory.y}%`}
                x2={`${nextMemory.x}%`}
                y2={`${nextMemory.y}%`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}
        </svg>

        {/* Stars */}
        {memories.map((memory, index) => (
          <motion.button
            key={`star-${memory.id}`}
            className="absolute w-12 h-12 flex items-center justify-center cursor-pointer"
            style={{
              left: `${memory.x}%`,
              top: `${memory.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => setSelectedMemory(memory)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Star glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 10px rgba(255, 20, 147, 0.4)',
                  '0 0 20px rgba(255, 20, 147, 0.8)',
                  '0 0 10px rgba(255, 20, 147, 0.4)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.15,
              }}
            />

            {/* Star */}
            <motion.div
              className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#FF1493] to-[#FF4DA6] flex items-center justify-center text-lg"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.15,
              }}
            >
              ⭐
            </motion.div>

            {/* Memory label */}
            <motion.div
              className="absolute top-full mt-2 whitespace-nowrap text-xs text-white/70 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {memory.title}
            </motion.div>
          </motion.button>
        ))}

        {/* Silhouette couple at bottom */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-[#FF1493]">
            <ellipse cx="35" cy="30" rx="8" ry="10" />
            <path d="M 35 40 Q 25 50 20 65 M 35 40 Q 45 50 50 65 M 35 40 L 35 55" />
            <ellipse cx="65" cy="30" rx="8" ry="10" />
            <path d="M 65 40 Q 55 50 50 65 M 65 40 Q 75 50 80 65 M 65 40 L 65 55" />
          </svg>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.p
        className="relative z-10 text-center text-white/60 text-xs max-w-md mx-auto mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        👆 Tap on any glowing star to explore that memory ✨
      </motion.p>

      {/* Memory modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              className="relative max-w-sm w-full glass-intense rounded-lg p-6 space-y-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>

              {/* Emoji */}
              <div className="text-5xl text-center">{selectedMemory.emoji}</div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-[#FF1493] text-center">
                {selectedMemory.title}
              </h2>

              {/* Image placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-[#A020F0]/30 to-[#FF1493]/20 rounded-lg flex items-center justify-center border border-[#FF1493]/30">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-xs text-white/50">star{selectedMemory.id}.jpg</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/80 text-center leading-relaxed">
                {selectedMemory.description}
              </p>

              {/* Floating hearts */}
              <div className="flex justify-center gap-2 pt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.span
                    key={`modal-heart-${i}`}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="text-lg"
                  >
                    ❤️
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Floating sparkles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`universe-sparkle-${i}`}
          className="fixed text-lg opacity-20 pointer-events-none"
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
            duration: Math.random() * 6 + 8,
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
