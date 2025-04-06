import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function Background3D() {
  const meshRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <>
      {/* Main sphere */}
      <Sphere args={[isMobile ? 1.5 : 2, 100, 100]} ref={meshRef} position={[0, 0, -5]}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.4}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Additional smaller spheres for visual interest */}
      <Sphere args={[0.5, 64, 64]} position={[3, 2, -3]}>
        <MeshDistortMaterial
          color="#8b5cf6"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      
      <Sphere args={[0.3, 64, 64]} position={[-2.5, -1.5, -2]}>
        <MeshDistortMaterial
          color="#ec4899"
          attach="material"
          distort={0.6}
          speed={1.8}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
    </>
  );
}
