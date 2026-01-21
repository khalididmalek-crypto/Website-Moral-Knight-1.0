import React from 'react';
import { motion } from 'framer-motion';

interface FlowingTextProps {
  text: string;
  className?: string;
  baseColor?: string; // Add baseColor prop
  waveColor?: string; // Add waveColor prop
}

export const FlowingText: React.FC<FlowingTextProps> = ({
  text,
  className,
  baseColor = '#000000', // Default to black if not provided
  waveColor = '#8B1A3D', // Default to red
}) => {
  return (
    <div className={className} style={{ display: 'flex' }}>
      {Array.from(text).map((char, index) => (
        <motion.span
          key={index}
          initial={{ color: baseColor }} // Use baseColor for initial state
          animate={{ color: [baseColor, waveColor, baseColor] }} // Use baseColor and waveColor
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.1, // This creates the wave effect
            ease: "easeInOut"
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};
