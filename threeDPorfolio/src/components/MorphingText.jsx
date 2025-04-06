import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MorphingText = ({ originalText, speed = 40, glitchIntensity = 0.3 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const interval = useRef(null);
  const originalTextRef = useRef(originalText);
  const timeoutRef = useRef(null);
  
  // Characters for random text generation
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|[]\\;\',./-=';
  const binaryChars = '01';
  const codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|[]\\;\',./-={}[];:\'\\,.<>/?`~';

  // Generate random text
  const getRandomChar = (pool = chars) => {
    return pool.charAt(Math.floor(Math.random() * pool.length));
  };
  
  // Update text display with typing effect
  useEffect(() => {
    // Update the reference if the original text changes
    originalTextRef.current = originalText;
    
    let index = 0;
    let targetText = originalText;
    
    // Clear any existing intervals first
    if (interval.current) clearInterval(interval.current);
    
    // Start typing
    interval.current = setInterval(() => {
      if (index <= targetText.length) {
        setDisplayText(targetText.substring(0, index));
        index++;
      } else {
        clearInterval(interval.current);
        
        // Set a timeout to trigger scrambling effect
        timeoutRef.current = setTimeout(() => {
          if (Math.random() < glitchIntensity) {
            setIsScrambling(true);
            
            // Stop scrambling after a short time
            setTimeout(() => {
              setIsScrambling(false);
              
              // Add a small chance to glitch after scrambling
              if (Math.random() < glitchIntensity) {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 150);
              }
            }, 800 + Math.random() * 1200);
          }
        }, 3000 + Math.random() * 5000);
      }
    }, speed);
    
    return () => {
      clearInterval(interval.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [originalText, speed, glitchIntensity]);
  
  // Scramble effect
  useEffect(() => {
    if (!isScrambling) return;
    
    let scrambleCount = 0;
    const maxScrambles = 10;
    const scrambleInterval = setInterval(() => {
      if (scrambleCount > maxScrambles) {
        clearInterval(scrambleInterval);
        setDisplayText(originalTextRef.current);
        return;
      }
      
      // Create a scrambled version
      let scrambledText = '';
      for (let i = 0; i < originalTextRef.current.length; i++) {
        // Randomly decide whether to scramble each character
        if (Math.random() < 0.3) {
          // Choose which type of character to use
          const charType = Math.random();
          if (charType < 0.4) {
            scrambledText += getRandomChar(binaryChars);
          } else if (charType < 0.7) {
            scrambledText += getRandomChar(codeChars);
          } else {
            scrambledText += getRandomChar();
          }
        } else {
          scrambledText += originalTextRef.current[i];
        }
      }
      
      setDisplayText(scrambledText);
      scrambleCount++;
    }, 100);
    
    return () => clearInterval(scrambleInterval);
  }, [isScrambling]);
  
  return (
    <motion.span
      className={`inline-block ${isGlitching ? 'text-red-500' : ''}`}
      animate={isGlitching ? {
        x: [0, -3, 3, -2, 0, 1, 0],
        y: [0, 1, -1, 0, 2, -1, 0],
        opacity: [1, 0.8, 0.9, 1, 0.9, 1]
      } : {}}
      transition={{ duration: 0.2 }}
    >
      {displayText || originalText.charAt(0)}
    </motion.span>
  );
};

// Component that wraps a full paragraph with morphing text
export const MorphingParagraph = ({ text, className, speed = 40, glitchIntensity = 0.3 }) => {
  // Split the text into words
  const words = text.split(' ');
  
  return (
    <p className={className}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <MorphingText 
            originalText={word} 
            speed={speed} 
            glitchIntensity={glitchIntensity} 
          />
          {index < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </p>
  );
};

export default MorphingText; 