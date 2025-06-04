'use client';

import { useEffect, useRef, useState } from 'react';

interface HelloAnimationProps {
  onAnimationComplete: () => void;
}

const HelloAnimation: React.FC<HelloAnimationProps> = ({ onAnimationComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    let animationTimer: NodeJS.Timeout;

    if (textElement) {
      const length = textElement.getComputedTextLength();
      textElement.style.strokeDasharray = `${length} ${length}`;
      textElement.style.strokeDashoffset = `${length}`;
      // Add the animation class defined in globals.css
      textElement.classList.add('animate-dash'); 

      // Total time for the animation to play and then fade out the overlay
      animationTimer = setTimeout(() => {
        setIsVisible(false); // Trigger fade-out or hide
        // Call onAnimationComplete slightly after starting to hide, or after fade effect
        setTimeout(onAnimationComplete, 500); // Allow 500ms for fade-out if one is added
      }, 4000); // Animation is 4s, then start hiding
    }

    return () => {
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [onAnimationComplete]);

  if (!isVisible) {
    return null; // Or a div with opacity 0 if using CSS transitions for fade-out
  }

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-[1000] transition-opacity duration-500 ease-out"
      style={{ opacity: isVisible ? 1 : 0 }} // Basic fade-out effect
    >
      <svg width="600" height="200" viewBox="0 0 600 200">
        <text
          ref={textRef}
          className="hello-text-animation" // Class from globals.css provides base styling
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          hello
        </text>
      </svg>
    </div>
  );
};

export default HelloAnimation; 