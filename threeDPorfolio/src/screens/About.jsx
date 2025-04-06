import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import testPic from "../assets/testPic2.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import GlowCard from "../components/GlowCard";
import "../screens/about.css";

export default function About() {
  const { scrollYProgress } = useScroll();
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [canvasError, setCanvasError] = useState(false);
  const canvasRef = useRef(null);

  // Responsive design handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Error handling for Canvas/WebGL
  useEffect(() => {
    const handleError = () => {
      // Disable the Canvas if we get errors
      setCanvasError(true);
      console.log("Disabled About Canvas due to WebGL errors");
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const fontSize = useTransform(scrollYProgress, [0, 1], ["0.2rem", isMobile ? "2.5rem" : "4.5rem"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  const handleHover = () => {
    setPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Use a separate Canvas for the About section - conditionally render */}
      {!canvasError && (
        <div className="absolute inset-0 z-10" ref={canvasRef}>
          <Canvas 
            className="!absolute top-0 left-0 w-full h-full"
            camera={{ position: [0, 0, 15], fov: isMobile ? 75 : 60 }}
            frameloop="demand" // Only render when needed
            dpr={[1, 1.5]} // Limit pixel ratio for better performance
          >
            <Stars 
              radius={100} 
              depth={50} 
              count={isMobile ? 1500 : 2500} // Reduced star count for better performance
              factor={4} 
              fade 
              speed={1} // Reduced animation speed
            />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </div>
      )}

      {/* Overlay to improve text visibility - darker if canvas fails */}
      <div className={`absolute inset-0 ${canvasError ? 'bg-indigo-900/20' : 'bg-black/40'} z-15`}></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
        }}
        className="relative z-20 w-full h-full flex flex-col items-center text-center pt-10 md:pt-28 px-4"
      >
        <div className="min-h-[60vh] flex flex-col justify-center items-center">
          <motion.h1
            style={{ fontSize, opacity }}
            className="font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
          >
            ABOUT ME
          </motion.h1>

          <motion.h1
            style={{ fontSize, opacity }}
            className="font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mt-4"
          >
            Creative Developer
          </motion.h1>
        
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1, delay: 0.6 },
              },
            }}
            className="text-gray-300 max-w-2xl mt-12 text-lg md:text-xl"
          >
            I'm a passionate developer specializing in interactive web experiences and AI-driven applications.
            My work combines cutting-edge technology with creative design to build immersive digital journeys.
          </motion.p>
        </div>

        {/* Gallery Section - Responsive grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2, delayChildren: 1 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl mx-auto px-4 md:px-8 py-12"
        >
          {[1, 2, 3, 4].map((item, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer"
              onClick={() =>
                setFlippedIndex(flippedIndex === index ? null : index)
              }
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <GlowCard />

              {flippedIndex === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white rounded-xl p-4"
                >
                  <h3 className="text-lg font-bold">Project {item}</h3>
                  <p className="text-sm text-gray-300 mt-2">
                    An innovative project showcasing my skills and creativity.
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
