import React, { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  buggy?: boolean;
  onComplete?: () => void;
  repeatOnce?: boolean;
  repeatSpeedMultiplier?: number;
}

export const Typewriter: React.FC<Props> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  buggy = false,
  onComplete,
  repeatOnce = false,
  repeatSpeedMultiplier = 1,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);
  const [hasRepeated, setHasRepeated] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    setDisplayedText('');
    setStartTyping(false);

    const effectiveDelay = isFirstRender.current ? delay : 0;

    const timeout = setTimeout(() => {
      setStartTyping(true);
    }, effectiveDelay);

    isFirstRender.current = false;

    return () => clearTimeout(timeout);
  }, [text, delay]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!startTyping) return;

    let i = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
    };

    if (buggy) {
      const type = () => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i += 1;
          const randomSpeed = Math.random() * 150 + 20;
          // First character types 50% faster
          const effectiveSpeed = i === 1 ? randomSpeed * 0.5 : randomSpeed;
          timeoutId = setTimeout(type, effectiveSpeed);
        } else if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      };
      type();
    } else {
      const type = () => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i += 1;

          // Accelerated start: first 10% of characters are 50% faster
          const threshold = Math.max(1, Math.ceil(text.length * 0.1));
          const baseSpeed = hasRepeated ? speed * repeatSpeedMultiplier : speed;
          const currentSpeed = i <= threshold ? baseSpeed * 0.5 : baseSpeed;

          timeoutId = setTimeout(type, currentSpeed);
        } else {
          if (repeatOnce && !hasRepeated) {
            // Wait a bit, then repeat once at different speed
            timeoutId = setTimeout(() => {
              setDisplayedText('');
              setHasRepeated(true);
            }, 500);
          } else if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      };
      type();
    }

    return cleanup;
  }, [startTyping, text, speed, buggy, hasRepeated, repeatOnce, repeatSpeedMultiplier]);

  return <span className={className}>{displayedText}</span>;
};


