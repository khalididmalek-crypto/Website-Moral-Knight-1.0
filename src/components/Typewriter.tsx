import React, { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  buggy?: boolean;
  onComplete?: () => void;
}

export const Typewriter: React.FC<Props> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  buggy = false,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);

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
          timeoutId = setTimeout(type, randomSpeed);
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
          // Math.max(1, ...) ensures at least the first character is faster for short strings like "Blog"
          const threshold = Math.max(1, Math.ceil(text.length * 0.1));
          const currentSpeed = i <= threshold ? speed * 0.5 : speed;

          timeoutId = setTimeout(type, currentSpeed);
        } else {
          if (onCompleteRef.current) onCompleteRef.current();
        }
      };
      type();
    }

    return cleanup;
  }, [startTyping, text, speed, buggy]);

  return <span className={className}>{displayedText}</span>;
};


