import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function Background3D() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <Sphere args={[2, 100, 100]} ref={meshRef} position={[0, 0, -5]}>
      <MeshDistortMaterial
        color="blue"
        attach="material"
        distort={0.5}
        speed={2}
      />
    </Sphere>
  );
}
