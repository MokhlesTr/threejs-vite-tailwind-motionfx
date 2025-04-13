import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import "../screens/about.css";
import { Link } from "react-router-dom";

export default function About() {
  // Replace useScroll with a simple state-based approach to avoid scroll indicator
  const [setScrolled] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState(null);
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

  // Initialize scrolled state on mount
  useEffect(() => {
    // Set scrolled to true after component mounts to trigger animations
    setTimeout(() => {
      setScrolled(true);
    }, 100);
  }, []);

  // Error handling for Canvas/WebGL
  useEffect(() => {
    const handleError = () => {
      // Disable the Canvas if we get errors
      setCanvasError(true);
      console.log("Disabled About Canvas due to WebGL errors");
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen overflow-y-auto">
      <div className="h-20"></div>

      {/* Background Canvas - conditionally render */}
      {!canvasError && (
        <div className="fixed inset-0 z-0 w-full h-full" ref={canvasRef}>
          <Canvas
            className="!absolute inset-0 w-full h-full"
            camera={{ position: [0, 0, 15], fov: isMobile ? 75 : 60 }}
            frameloop="demand"
            dpr={[1, 1.5]}
          >
            <Stars
              radius={100}
              depth={50}
              count={isMobile ? 1500 : 2500}
              factor={4}
              fade
              speed={1}
            />
          </Canvas>
        </div>
      )}

      {/* Use a separate Canvas for the About section - conditionally render */}
      {!canvasError && (
        <div className="fixed inset-0 z-10" ref={canvasRef}>
          <Canvas
            className="!fixed top-0 left-0 w-full h-full"
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
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Canvas>
        </div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
        }}
        className="relative z-20 w-full min-h-screen flex flex-col items-center text-center px-4 pb-16"
      >
        {/* Top spacer for navbar */}
        <div className="h-24"></div>

        <div className="min-h-[80vh] w-full flex flex-col justify-center items-center mb-20">
          {/* Enhanced name with letter-by-letter animation and glowing effect */}
          <div className="relative mb-8">
            <motion.div
              className="overflow-hidden relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="relative">
                {/* Container for the typing name effect */}
                <div className="flex justify-center items-center relative">
                  <div className="relative overflow-hidden">
                    {/* The typing text container */}
                    <motion.h1
                      className="text-4xl md:text-6xl font-bold flex"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Each letter with typing animation */}
                      {"Mokhles Tarmiz".split("").map((letter, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, filter: "blur(0px)" }}
                          animate={{
                            opacity: 1,
                            filter: "blur(0px)",
                          }}
                          transition={{
                            duration: 0.15,
                            delay: index * 0.08,
                            ease: "easeInOut",
                          }}
                          className={`inline-block ${
                            letter === " " ? "mx-3" : "mx-[2px]"
                          }`}
                        >
                          <motion.span
                            animate={{
                              color: [
                                "rgb(74, 222, 128)", // green-400
                                "rgb(56, 189, 248)", // sky-400
                                "rgb(129, 140, 248)", // indigo-400
                                "rgb(232, 121, 249)", // pink-400
                              ],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              repeatType: "loop",
                              delay: index * 0.15, // Offset color cycles
                            }}
                          >
                            {letter}
                          </motion.span>
                        </motion.span>
                      ))}

                      {/* Typing cursor effect */}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: "loop",
                          repeatDelay: 0.2,
                        }}
                        className="inline-block w-[4px] h-[80%] bg-white ml-1 self-center"
                      />
                    </motion.h1>
                  </div>
                </div>

                {/* Animated underline */}
                <motion.div
                  className="h-[4px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full mt-3"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Enhanced glow effect */}
            <motion.div
              className="absolute -inset-5 rounded-3xl blur-xl opacity-30 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-4 text-xl md:text-2xl"
          >
            Software Engineering Student | React Native Developer
          </motion.h2>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1, delay: 0.6 },
              },
            }}
            className="flex flex-col items-center justify-center mt-8"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-full mb-6">
              <div className="bg-gray-900 p-1 rounded-full">
                <div className="text-gray-300 px-4 py-1 rounded-full text-sm md:text-base">
                  <span className="text-blue-400 font-semibold">Etherial</span>{" "}
                  • Ecole Polytechnique de Sousse
                </div>
              </div>
            </div>

            <div className="text-gray-300 max-w-2xl text-lg md:text-xl relative overflow-hidden">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                I&apos;m a{" "}
                <motion.span
                  className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ backgroundColor: "rgba(59, 130, 246, 0)" }}
                  animate={{
                    backgroundColor: [
                      "rgba(59, 130, 246, 0.2)",
                      "rgba(59, 130, 246, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  Software Engineering student
                </motion.span>{" "}
                at Polytechnique Sousse and a{" "}
                <motion.span
                  className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400"
                  initial={{ backgroundColor: "rgba(74, 222, 128, 0)" }}
                  animate={{
                    backgroundColor: [
                      "rgba(74, 222, 128, 0.2)",
                      "rgba(74, 222, 128, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.5,
                  }}
                >
                  Full Stack Js Developer
                </motion.span>{" "}
                with professional experience in building scalable web and mobile
                applications, passionate about learning new technologies,
                collaborating with cross-functional teams and driving projects
                from concept to completion.
              </motion.p>
            </div>

            <div className="text-gray-300 max-w-2xl mt-4 text-lg md:text-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Currently, I work as a{" "}
                <motion.span className="relative inline-block">
                  <motion.span className="relative z-10 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                    Full-Time Developer at Etherial
                  </motion.span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-[6px] bg-blue-500/20 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                  />
                </motion.span>
                , specializing in{" "}
                <motion.span
                  className="font-semibold"
                  initial={{ color: "#e2e8f0" }}
                  animate={{
                    color: ["#e2e8f0", "#93c5fd", "#818cf8", "#e2e8f0"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  React Native, Expo and Express.js
                </motion.span>{" "}
                to deliver high-quality solutions that meet business needs.
              </motion.p>
            </div>

            <div className="flex items-center mt-6 space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-gray-300 text-sm">
                Gouvernorat Sousse, Tunisie
              </p>
            </div>

            <Link to="/contact">
              <motion.p
                className="text-blue-400 font-semibold max-w-2xl mt-6 text-lg md:text-xl cursor-pointer hover:text-blue-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let&apos;s connect!
              </motion.p>
            </Link>
          </motion.div>
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
          className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Featured Projects
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Project 1 */}
            <motion.div
              className="relative cursor-pointer rounded-xl overflow-hidden shadow-xl bg-gray-900/60 border border-blue-500/20 backdrop-blur-sm"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onClick={() => setFlippedIndex(flippedIndex === 0 ? null : 0)}
            >
              <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">
                  Mobile E-Commerce App
                </h3>
                <p className="text-gray-300 mb-4">
                  A React Native app with Expo and Express.js backend for
                  seamless shopping experiences.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 rounded-md text-blue-400 text-xs font-medium">
                    React Native
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-400 text-xs font-medium">
                    Expo
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 rounded-md text-green-400 text-xs font-medium">
                    Node.js
                  </span>
                </div>
              </div>
              {flippedIndex === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-white p-6"
                >
                  <h3 className="text-xl font-bold mb-2">Project Details</h3>
                  <p className="text-gray-300 text-center mb-4">
                    Built a complete e-commerce solution with user
                    authentication, product catalog, cart functionality, and
                    payment integration.
                  </p>
                  <div className="flex space-x-3 mt-2">
                    <a
                      href="#"
                      className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      View Demo
                    </a>
                    <a
                      href="#"
                      className="px-4 py-2 bg-gray-700 rounded-md text-white text-sm font-medium hover:bg-gray-800 transition"
                    >
                      GitHub
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Project 2 */}
            <motion.div
              className="relative cursor-pointer rounded-xl overflow-hidden shadow-xl bg-gray-900/60 border border-blue-500/20 backdrop-blur-sm"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onClick={() => setFlippedIndex(flippedIndex === 1 ? null : 1)}
            >
              <div className="h-48 bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">
                  AI Task Management
                </h3>
                <p className="text-gray-300 mb-4">
                  A smart task management system with AI prioritization and
                  scheduling.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 rounded-md text-blue-400 text-xs font-medium">
                    React
                  </span>
                  <span className="px-2 py-1 bg-yellow-500/20 rounded-md text-yellow-400 text-xs font-medium">
                    Express
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-400 text-xs font-medium">
                    MongoDB
                  </span>
                </div>
              </div>
              {flippedIndex === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-white p-6"
                >
                  <h3 className="text-xl font-bold mb-2">Project Details</h3>
                  <p className="text-gray-300 text-center mb-4">
                    Developed an intelligent task manager that uses machine
                    learning to prioritize tasks and suggest optimal schedules
                    based on user patterns.
                  </p>
                  <div className="flex space-x-3 mt-2">
                    <a
                      href="#"
                      className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      View Demo
                    </a>
                    <a
                      href="#"
                      className="px-4 py-2 bg-gray-700 rounded-md text-white text-sm font-medium hover:bg-gray-800 transition"
                    >
                      GitHub
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Project 3 */}
            <motion.div
              className="relative cursor-pointer rounded-xl overflow-hidden shadow-xl bg-gray-900/60 border border-blue-500/20 backdrop-blur-sm"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onClick={() => setFlippedIndex(flippedIndex === 2 ? null : 2)}
            >
              <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">
                  3D Portfolio
                </h3>
                <p className="text-gray-300 mb-4">
                  An interactive 3D portfolio website with Three.js animations
                  and effects.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 rounded-md text-blue-400 text-xs font-medium">
                    React
                  </span>
                  <span className="px-2 py-1 bg-gray-500/20 rounded-md text-gray-400 text-xs font-medium">
                    Three.js
                  </span>
                  <span className="px-2 py-1 bg-indigo-500/20 rounded-md text-indigo-400 text-xs font-medium">
                    Tailwind
                  </span>
                </div>
              </div>
              {flippedIndex === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-white p-6"
                >
                  <h3 className="text-xl font-bold mb-2">Project Details</h3>
                  <p className="text-gray-300 text-center mb-4">
                    Created an immersive portfolio experience with 3D elements,
                    interactive animations, and a responsive design that
                    showcases projects in a unique way.
                  </p>
                  <div className="flex space-x-3 mt-2">
                    <a
                      href="#"
                      className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      View Demo
                    </a>
                    <a
                      href="#"
                      className="px-4 py-2 bg-gray-700 rounded-md text-white text-sm font-medium hover:bg-gray-800 transition"
                    >
                      GitHub
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Resume Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.6 },
            },
          }}
          className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 mt-4"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            My Resume
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Resume Card */}
            <motion.div
              className="bg-gray-900/60 border border-blue-500/20 backdrop-blur-sm rounded-xl p-8 shadow-xl"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Download Resume
                </h3>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-gray-300 mb-8">
                Get a comprehensive overview of my skills, experience and
                educational background in my professionally crafted resume.
              </p>

              <a
                href="#"
                className="inline-block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg text-white font-medium text-center transition duration-300 shadow-lg"
              >
                Download PDF Resume
              </a>
            </motion.div>

            {/* Skills Card */}
            <motion.div
              className="bg-gray-900/60 border border-blue-500/20 backdrop-blur-sm rounded-xl p-8 shadow-xl"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Key Skills</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">React & React Native</span>
                    <span className="text-blue-400">95%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">JavaScript/TypeScript</span>
                    <span className="text-blue-400">90%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Node.js & Express</span>
                    <span className="text-blue-400">85%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Three.js & WebGL</span>
                    <span className="text-blue-400">80%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">MongoDB & SQL</span>
                    <span className="text-blue-400">75%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
