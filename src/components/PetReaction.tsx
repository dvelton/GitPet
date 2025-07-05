import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PetReactionProps {
  message: string | null;
}

export function PetReaction({ message }: PetReactionProps) {
  const [isVisible, setIsVisible] = useState(!!message);
  
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      // Hide message after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div 
          className="bg-card p-3 rounded-xl shadow-lg max-w-md mx-auto my-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-card-foreground text-center text-sm">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}