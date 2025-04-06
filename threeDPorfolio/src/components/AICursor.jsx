import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Throttle function to limit how often a function runs
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const AICursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  // Reduced number of particles for better performance
  useEffect(() => {
    // Reduced from 15 to 8 particles for better performance
    const initialParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      color: `rgba(${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, ${Math.random() * 255}, ${Math.random() * 0.5 + 0.5})`,
      vx: (Math.random() - 0.5) * 1.5, // Reduced velocity
      vy: (Math.random() - 0.5) * 1.5, // Reduced velocity
    }));
    
    setParticles(initialParticles);
  }, []);
  
  // Track mouse movement with throttling
  useEffect(() => {
    // Throttled mouse movement handler to reduce event frequency
    const handleMouseMove = throttle((e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }, 16); // Limit to ~60fps
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Animate cursor with less frequent updates
  useEffect(() => {
    const animateCursor = () => {
      setCursor((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.15, // Slightly slower for less computation
        y: prev.y + (mousePosition.y - prev.y) * 0.15,
      }));
    };
    
    const interval = setInterval(animateCursor, 16); // 60fps
    return () => clearInterval(interval);
  }, [mousePosition]);
  
  // Animate particles with optimizations
  const animateParticles = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Batch state update for better performance
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Calculate distance to cursor
          const dx = cursor.x - particle.x;
          const dy = cursor.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Apply attraction force (reduced effect radius)
          let vx = particle.vx;
          let vy = particle.vy;
          
          if (distance < 180) { // Reduced from 200
            const force = 0.6 / Math.max(50, distance); // Reduced force
            vx += dx * force;
            vy += dy * force;
          }
          
          // Reduced randomness
          vx += (Math.random() - 0.5) * 0.2;
          vy += (Math.random() - 0.5) * 0.2;
          
          // Apply higher friction for stability
          vx *= 0.95;
          vy *= 0.95;
          
          // Update position
          let x = particle.x + vx;
          let y = particle.y + vy;
          
          // Boundary check
          if (x < 0 || x > window.innerWidth) vx *= -1;
          if (y < 0 || y > window.innerHeight) vy *= -1;
          
          // Keep particles in bounds
          x = Math.max(0, Math.min(window.innerWidth, x));
          y = Math.max(0, Math.min(window.innerHeight, y));
          
          return {
            ...particle,
            x,
            y,
            vx,
            vy
          };
        })
      );
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateParticles);
  };
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(requestRef.current);
  }, [cursor]);
  
  // Window resize handler with throttling
  useEffect(() => {
    const handleResize = throttle(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: Math.min(particle.x, window.innerWidth),
          y: Math.min(particle.y, window.innerHeight)
        }))
      );
    }, 100); // Only run resize handler every 100ms at most
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {/* Main cursor */}
      <motion.div
        className="w-6 h-6 rounded-full border-2 border-blue-400 fixed"
        style={{
          x: cursor.x - 12,
          y: cursor.y - 12,
        }}
        animate={{
          scale: [1, 1.2, 1],
          borderColor: ['rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(59, 130, 246, 0.8)']
        }}
        transition={{
          duration: 1.5, // Slowed down animation
          ease: "linear",
          repeat: Infinity
        }}
      />
      
      <svg className="fixed inset-0 w-full h-full" style={{ filter: 'blur(0.5px)' }}>
        {/* Connection lines - reduced calculations by limiting distance checks */}
        {particles.map((particle, i) => (
          particles.slice(i + 1).map((otherParticle, j) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only draw lines between very nearby particles
            if (distance < 80) { // Reduced from 100
              const opacity = 1 - distance / 80;
              
              return (
                <line
                  key={`line-${i}-${j}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={otherParticle.x}
                  y2={otherParticle.y}
                  stroke={`rgba(99, 102, 241, ${opacity * 0.4})`} // Reduced opacity
                  strokeWidth={opacity * 0.8} // Thinner lines
                />
              );
            }
            return null;
          })
        ))}
        
        {/* Connection lines to cursor - fewer connections */}
        {particles.map((particle, i) => {
          const dx = particle.x - cursor.x;
          const dy = particle.y - cursor.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) { // Reduced from 150
            const opacity = 1 - distance / 120;
            
            return (
              <line
                key={`cursor-line-${i}`}
                x1={particle.x}
                y1={particle.y}
                x2={cursor.x}
                y2={cursor.y}
                stroke={`rgba(139, 92, 246, ${opacity * 0.6})`} // Reduced opacity
                strokeWidth={opacity * 1.5} // Thinner lines
              />
            );
          }
          return null;
        })}
        
        {/* Particles */}
        {particles.map(particle => (
          <circle
            key={`particle-${particle.id}`}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={particle.color}
          />
        ))}
      </svg>
      
      {/* Small dot at exact cursor position */}
      <div
        className="w-2 h-2 rounded-full bg-indigo-500 fixed"
        style={{
          left: mousePosition.x - 1,
          top: mousePosition.y - 1,
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.6)'
        }}
      />
    </div>
  );
};

export default AICursor; 