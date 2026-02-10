import React from 'react';
import { motion } from 'framer-motion';

interface FlowingTextProps {
  text: string;
  className?: string;
  baseColor?: string; // Add baseColor prop
  waveColor?: string; // Add waveColor prop
}

export const Slash: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 6 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      width: '0.28em', // Adjusted width relative to font-size
      height: '0.7em',
      display: 'inline-block',
      marginBottom: '0em',
      marginLeft: '0.1em',
      marginRight: '0.1em',
      verticalAlign: 'baseline',
      overflow: 'visible'
    }}
  >
    <path
      d="M 0 15 L 6 0"
      stroke="currentColor"
      strokeWidth="1.5"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export const FlowingText: React.FC<FlowingTextProps> = ({
  text,
  className,
  baseColor = '#000000', // Default to black if not provided
  waveColor = '#8B1A3D', // Default to red
}) => {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'baseline' }}>
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
          style={{ display: 'inline-flex', alignItems: 'baseline' }}
        >
          {char === ' ' ? '\u00A0' : char === '/' ? <Slash /> : char}
        </motion.span>
      ))}
    </div>
  );
};
