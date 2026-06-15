import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { fadeInUp, scaleIn, staggerContainer } from '@/lib/animations';

interface WelcomeProps {
  onNavigate: () => void;
}

export function Welcome({ onNavigate }: WelcomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Portal Effect - Large glowing circle */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.div
          className="w-64 h-64 rounded-full border-2 border-[#FF1493]"
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 20, 147, 0.3), 0 0 40px rgba(255, 20, 147, 0.2)',
              '0 0 40px rgba(255, 20, 147, 0.6), 0 0 80px rgba(255, 20, 147, 0.4)',
              '0 0 20px rgba(255, 20, 147, 0.3), 0 0 40px rgba(255, 20, 147, 0.2)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Content Container */}
      <motion.div
        className="relative z-10 max-w-md text-center space-y-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Heading with heart emoji */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <motion.div
            className="text-6xl font-bold text-[#FF1493] animate-glow-pulse"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Hey ❤️
          </motion.div>
        </motion.div>

        {/* Main text */}
        <motion.div variants={fadeInUp} className="space-y-6">
          <p className="text-xl font-light text-white leading-relaxed">
            This is not just a birthday website...
          </p>

          <p className="text-lg font-light text-[#FF4DA6] leading-relaxed">
            This is a story...
          </p>

          <p className="text-base font-light text-white/80 leading-relaxed">
            A story that has been growing for{' '}
            <span className="text-[#FF1493] font-semibold">6 years</span>...
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          variants={scaleIn}
          onClick={onNavigate}
          className="mt-12 px-8 py-4 bg-gradient-to-r from-[#FF1493] to-[#FF4DA6] text-white font-semibold rounded-full text-lg neon-border-thick hover:shadow-lg transition-all duration-300 active:scale-95"
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 30px rgba(255, 20, 147, 0.8)',
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          Begin Our Story ❤️
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ChevronDown className="w-6 h-6 text-[#FF1493] opacity-50" />
      </motion.div>

      {/* Floating hearts around content */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`welcome-heart-${i}`}
          className="absolute text-2xl text-[#FF1493] opacity-30"
          style={{
            left: `${10 + i * 18}%`,
            top: `${15 + (i % 2) * 60}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4 + i,
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
