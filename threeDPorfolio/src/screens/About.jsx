import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import testPic from "../assets/testPic2.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export default function About() {
  const { scrollYProgress } = useScroll();
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const fontSize = useTransform(scrollYProgress, [0, 1], ["0.2rem", "4.5rem"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  const handleHover = () => {
    setPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
  };

  return (
    <div className="relative w-full h-screen">
      {/* Three.js Background */}
      <Canvas className="absolute top-0 left-0 w-full h-full z-0">
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={2} />
        <OrbitControls enableZoom={false} />
      </Canvas>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
        }}
        className="absolute -top-24 left-0 w-full h-full flex flex-col items-center text-center pt-10 md:pt-48 z-10"
      >
        <div className="h-[200vh] flex flex-col justify-center items-center">
          <motion.h1
            style={{ fontSize, opacity }}
            className="font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
          >
            HELLO Mellow
          </motion.h1>

          <motion.h1
            style={{ fontSize, opacity }}
            className="font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
          >
            tarmiz&apos;s world
          </motion.h1>
        </div>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, delay: 0.6 },
            },
          }}
          className="text-gray-400 max-w-2xl mt-4 text-lg"
        >
          In an ever-expanding digital universe, Nova Agent shines as a guiding
          star, integrating AI with blockchain. These intelligent digital
          entities evolve with user interaction.
        </motion.p>

        <motion.button
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 1000 }}
          onMouseEnter={handleHover}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-0 transition rounded-lg text-white font-medium cursor-pointer"
        >
          Don&apos;t click
        </motion.button>
      </motion.div>

      {/* Gallery Section */}
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
        className="absolute bottom-10 grid grid-cols-2 xl:grid-cols-6 md:grid-cols-3 gap-4 mx-20"
      >
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <motion.div
            key={index}
            className="relative w-52 h-64 cursor-pointer overflow-hidden"
            onClick={() =>
              setFlippedIndex(flippedIndex === index ? null : index)
            }
          >
            <motion.img
              src={testPic}
              alt={`Gallery ${item}`}
              className="absolute w-full h-full object-cover shadow-xl rounded-sm"
              animate={{
                filter: flippedIndex === index ? "blur(15px)" : "blur(0px)",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            {flippedIndex === index && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="absolute w-full h-full flex flex-col items-center justify-center bg-black/60 text-white rounded-sm p-4"
              >
                <h3 className="text-lg font-bold">Item {item}</h3>
                <p className="text-sm text-gray-300">
                  Some cool description here.
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
