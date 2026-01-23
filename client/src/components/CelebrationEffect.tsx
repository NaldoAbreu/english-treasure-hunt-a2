import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const generateConfetti = (count: number): Confetti[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.2,
    duration: 2 + Math.random() * 1,
    size: 4 + Math.random() * 8,
  }));
};

interface CelebrationEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function CelebrationEffect({
  trigger,
  onComplete,
}: CelebrationEffectProps) {
  const confetti = generateConfetti(30);

  useEffect(() => {
    if (trigger && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Celebração de texto */}
      <motion.div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
          🎉
        </div>
      </motion.div>

      {/* Confete */}
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="fixed bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
          style={{
            width: item.size,
            height: item.size,
            left: `${item.left}%`,
            top: '-10px',
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: 'easeIn',
          }}
        />
      ))}

      {/* Efeito de luz */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-t from-yellow-200 to-transparent"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      />
    </div>
  );
}
