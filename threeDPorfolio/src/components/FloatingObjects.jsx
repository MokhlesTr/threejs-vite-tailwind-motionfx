import { useRef, useState, useEffect, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Torus, Sphere, Icosahedron, MeshWobbleMaterial, MeshDistortMaterial } from "@react-three/drei";

// Individual floating object
const FloatingObject = memo(({ shape, position, color, speed, rotationSpeed, wobble, scale }) => {
  const ref = useRef();
  const [targetPosition, setTargetPosition] = useState(position);
  const [timeOffset] = useState(Math.random() * 100);
  const [currentScale, setCurrentScale] = useState(0);
  
  // Initialize scale animation
  useEffect(() => {
    const animateScale = () => {
      setCurrentScale(prev => {
        if (prev < scale) {
          return prev + (scale - prev) * 0.05;
        }
        return scale;
      });
    };
    
    const scaleInterval = setInterval(animateScale, 30); // Reduced frequency
    return () => clearInterval(scaleInterval);
  }, [scale]);
  
  // Slowly drift to a new position - less frequently
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetPosition([
        position[0] + (Math.random() - 0.5) * 4, // Reduced range
        position[1] + (Math.random() - 0.5) * 4, 
        position[2] + (Math.random() - 0.5) * 4
      ]);
    }, 5000 + Math.random() * 2000); // Longer interval between position changes
    
    return () => clearInterval(interval);
  }, [position]);
  
  // Animate position and rotation - optimized frame skipping
  useFrame(({ clock }) => {
    // Skip frames based on performance
    if (Math.random() > 0.7) return; // Skip ~30% of frames for better performance
    
    const t = clock.getElapsedTime() + timeOffset;
    
    // Smooth movement toward target position
    if (ref.current) {
      ref.current.position.x += (targetPosition[0] - ref.current.position.x) * 0.005 * speed; // Slower movement
      ref.current.position.y += (targetPosition[1] - ref.current.position.y) * 0.005 * speed;
      ref.current.position.z += (targetPosition[2] - ref.current.position.z) * 0.005 * speed;
      
      // Add some gentle floating motion
      ref.current.position.y += Math.sin(t * 0.3) * 0.005; // Slower and less dramatic
      
      // Rotation - less frequent updates
      ref.current.rotation.x += 0.001 * rotationSpeed;
      ref.current.rotation.y += 0.002 * rotationSpeed;
      ref.current.rotation.z += 0.0005 * rotationSpeed;
    }
  });
  
  // Different shapes with their materials - simplified materials
  const renderShape = () => {
    switch (shape) {
      case 'box':
        return (
          <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={3}> {/* Reduced smoothness */}
            <MeshWobbleMaterial 
              color={color} 
              factor={wobble * 0.5} // Reduced wobble
              speed={0.5} // Slower animation
              metalness={0.4}
              roughness={0.2}
              envMapIntensity={0.6}
            />
          </RoundedBox>
        );
      case 'torus':
        return (
          <Torus args={[0.5, 0.2, 12, 24]}> {/* Reduced geometry detail */}
            <MeshWobbleMaterial 
              color={color} 
              factor={wobble * 0.5}
              speed={1}
              metalness={0.5}
              roughness={0.3}
              envMapIntensity={0.8}
            />
          </Torus>
        );
      case 'sphere':
        return (
          <Sphere args={[0.5, 16, 16]}> {/* Reduced geometry detail */}
            <MeshDistortMaterial
              color={color}
              speed={2}
              distort={0.3}
              metalness={0.5}
              roughness={0.3} 
            />
          </Sphere>
        );
      case 'icosahedron':
        return (
          <Icosahedron args={[0.7, 0]}> {/* Reduced detail level */}
            <MeshWobbleMaterial 
              color={color} 
              factor={wobble * 0.5}
              speed={1.5}
              metalness={0.6}
              roughness={0.3}
              envMapIntensity={1}
            />
          </Icosahedron>
        );
      default:
        return (
          <Sphere args={[0.5, 16, 16]}>
            <MeshDistortMaterial color={color} speed={2} distort={0.3} />
          </Sphere>
        );
    }
  };
  
  return (
    <group
      ref={ref} 
      position={position}
      scale={currentScale}
    >
      {renderShape()}
    </group>
  );
});

// Check visibility to pause animation when not visible
const useIsVisible = (ref) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    observer.observe(ref.current);
    return () => {
      // Add null check before unobserving to prevent errors
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);
  
  return isVisible;
};

// Main component that manages multiple floating objects
const FloatingObjects = ({ count = 3 }) => { // Reduced further from 4 to 3 for better performance
  const containerRef = useRef(null);
  const isVisible = useIsVisible(containerRef);
  
  // Available shapes, colors, and initial positions
  const shapes = ['box', 'torus', 'sphere', 'icosahedron'];
  const colors = [
    '#5eead4', '#0ea5e9', '#8b5cf6', '#c084fc', 
    '#f472b6', '#cbd5e1', '#60a5fa', '#34d399'
  ];
  
  // Generate random objects - memoized
  const objects = useState(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      position: [
        (Math.random() - 0.5) * 10, // Reduced range from 12 to 10
        (Math.random() - 0.5) * 10, // Reduced range from 12 to 10
        (Math.random() - 0.5) * 6    // Reduced range from 8 to 6
      ],
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 0.8, // Reduced max speed
      rotationSpeed: 0.5 + Math.random() * 1, // Reduced max rotation
      wobble: 0.2 + Math.random() * 0.3, // Reduced wobble
      scale: 0.4 + Math.random() * 0.3   // Reduced max scale
    }))
  )[0];

  // Disable component completely if errors occur too many times
  const [hasError, setHasError] = useState(false);
  
  // Error boundary to catch WebGL errors
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
      console.log("Disabled FloatingObjects due to WebGL errors");
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return null; // Render nothing if there are errors
  }
  
  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {isVisible && !hasError && (
        <Canvas 
          camera={{ position: [0, 0, 15], fov: 60 }}
          frameloop="demand" // Only render when needed
          dpr={[1, 1.5]} // Limit pixel ratio for better performance
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.6} />
          
          {objects.map(obj => (
            <FloatingObject key={obj.id} {...obj} />
          ))}
        </Canvas>
      )}
    </div>
  );
};

export default FloatingObjects; 