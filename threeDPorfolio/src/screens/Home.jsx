import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import BackgroundVideo from "../components/BackgroundVideo";
import GlowCard from "../components/GlowCard";
import Background3D from "../components/Background3D";
import MorphingText, { MorphingParagraph } from "../components/MorphingText";
import { Link } from "react-router-dom";

// Lazy load heavy components to improve initial loading time
const AICursor = lazy(() => import("../components/AICursor"));
const NeuralNetwork = lazy(() => import("../components/NeuralNetwork"));
const AITerminal = lazy(() => import("../components/AITerminal"));
const FloatingObjects = lazy(() => import("../components/FloatingObjects"));
const DataVisualization = lazy(() => import("../components/DataVisualization"));

// Throttle function to improve scroll performance
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

// Loading component for suspense fallbacks
const LoadingPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const phrases = [
    "Step into innovation",
    "Explore my portfolio",
    "Discover 3D experiences"
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [showAICursor, setShowAICursor] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const scrollRef = useRef(null);
  const terminalRef = useRef(null);
  const visualizationRef = useRef(null);
  const { scrollYProgress } = useScroll({
    throttle: 30 // Add throttling to the scroll tracking
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  // Monitor scroll position to conditionally render heavy components
  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.5);
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle AI cursor after initial load - delay it further
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAICursor(true);
    }, 3000); // Increased from 2000ms to 3000ms
    
    return () => clearTimeout(timer);
  }, []);
  
  // Typing effect - optimized
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentPhrase.substring(0, typedText.length + 1));
        
        if (typedText.length === currentPhrase.length) {
          setIsDeleting(true);
          setTypingSpeed(100);
          setTimeout(() => setTypingSpeed(50), 1500);
        }
      } else {
        setTypedText(currentPhrase.substring(0, typedText.length - 1));
        
        if (typedText.length === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
          setTypingSpeed(120);
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [typedText, currentPhraseIndex, isDeleting, phrases, typingSpeed]);

  // Optimized scroll handler with throttling
  const scrollToNext = throttle(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 300);
  
  // Terminal section scroll handler with throttling
  const scrollToTerminal = throttle(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 300);
  
  // Visualization section scroll handler with throttling
  const scrollToVisualization = throttle(() => {
    if (visualizationRef.current) {
      visualizationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 300);

  return (
    <div className="bg-black text-white overflow-hidden w-screen">
 
      
      {/* AI Cursor - lazy loaded */}
      {showAICursor && !isScrolled && (
        <Suspense fallback={null}>
          <AICursor />
        </Suspense>
      )}
      
      {/* Main background element - reduced opacity */}
      <div className="fixed inset-0 w-full h-full bg-grid-pattern opacity-20 pointer-events-none z-0"></div>
      
      {/* Floating 3D Objects - only render when needed - reduced opacity */}
      {!isScrolled && (
        <div className="fixed inset-0 pointer-events-none z-10 opacity-30">
          <Suspense fallback={null}>
            <FloatingObjects count={3} />
          </Suspense>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative h-screen w-full flex flex-col items-center justify-center text-white">
        <BackgroundVideo />
        
        <motion.div 
          className="z-50 flex flex-col items-center space-y-6 px-4"
          style={{ opacity, scale }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="relative xl:text-8xl text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            {typedText}
            <span className="animate-pulse">|</span>
          </motion.h1>
          
          <MorphingParagraph 
            text="A showcase of creative development and immersive AI experiences"
            className="text-xl md:text-2xl text-gray-300 max-w-xl text-center" 
            speed={30}
            glitchIntensity={0.2}
          />
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
            <motion.button 
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/20 text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToNext}
            >
              Explore My Work
            </motion.button>
            
            <motion.button 
              className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-indigo-500/20 text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTerminal}
            >
              View AI Terminal
            </motion.button>
            
            <motion.button 
              className="px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-pink-500/20 text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToVisualization}
            >
              Analytics Dashboard
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-0 right-0 flex justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div 
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1 cursor-pointer"
            onClick={scrollToNext}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div className="w-1 h-2 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* 3D Interactive Section */}
      <div className="relative min-h-screen w-full bg-black/50" ref={scrollRef}>
        {/* Absolute positioned canvas that fills the section - removed fixed positioning */}
        <div className="absolute inset-0 z-5 w-full h-full">
          {isScrolled ? null : (
            <Canvas 
              className="w-full h-full"
              frameloop="demand"
              dpr={[1, 1.5]}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} />
              <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
              <Background3D />
            </Canvas>
          )}
        </div>
        
        <div className="relative z-40 min-h-screen flex flex-col items-center justify-center p-6">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
            viewport={{ once: true }}
          >
            {[1, 2, 3, 4].map((_, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlowCard />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.button 
            className="mt-16 px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
          </motion.button>
        </div>
      </div>

      {/* Neural Network Visualization Section - only render when visible */}
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-black/50" ref={terminalRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-indigo-900/20 z-10"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto p-8 relative z-30">
          <motion.div 
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold">AI <span className="text-blue-400">Neural Network</span></h2>
            <MorphingParagraph 
              text="Watch the neural network process data in real-time, showcasing the power of deep learning algorithms and pattern recognition capabilities."
              className="text-lg text-gray-300"
              speed={20}
              glitchIntensity={0.15}
            />
            
            <div className="py-4">
              <h3 className="text-xl font-semibold mb-2">Key Features:</h3>
              <ul className="space-y-2">
                {[
                  "Real-time visualization of neural activations",
                  "Multi-layer network architecture",
                  "Self-optimizing weight adjustments",
                  "Adaptive learning algorithms"
                ].map((feature, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-blue-400">▹</span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          <motion.div 
            className="h-[500px] bg-gray-900/50 rounded-xl overflow-hidden shadow-xl border border-indigo-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={<LoadingPlaceholder />}>
              <NeuralNetwork layers={[6, 10, 12, 8, 4]} height={500} width={800} />
            </Suspense>
          </motion.div>
        </div>
      </div>
      
      {/* AI Terminal Section - lazy loaded */}
      {isScrolled && (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900/20 to-black/90 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full max-w-7xl mx-auto relative z-20">
            <motion.div 
              className="lg:col-span-3 h-[500px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Suspense fallback={<LoadingPlaceholder />}>
                <AITerminal className="h-full" />
              </Suspense>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-2 flex flex-col justify-center space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold">
                <MorphingText originalText="AI Agent" speed={80} glitchIntensity={0.5} />{" "}
                <span className="text-blue-400">Terminal</span>
              </h2>
              <p className="text-lg text-gray-300">
                Experience the inner workings of an AI agent through this interactive terminal visualization. Watch as the system processes queries, analyzes data, and generates responses in real-time.
              </p>
              
              <div className="py-4">
                <h3 className="text-xl font-semibold mb-2">Agent Capabilities:</h3>
                <ul className="space-y-2">
                  {[
                    "Natural language understanding",
                    "Context-aware reasoning",
                    "Knowledge retrieval",
                    "Multi-modal data processing",
                    "Self-improvement through feedback"
                  ].map((feature, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-green-400">✓</span>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <motion.button 
                className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full text-white font-medium self-start"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToVisualization}
              >
                View Performance Metrics
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Data Visualization Section - lazy loaded */}
      {isScrolled && (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-8" ref={visualizationRef}>
          <motion.div 
            className="w-full max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              AI <span className="text-purple-400">Performance Analytics</span>
            </h2>
            
            <Suspense fallback={<LoadingPlaceholder />}>
              <DataVisualization className="mb-16" />
            </Suspense>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  title: "Real-time Learning",
                  description: "Watch as the AI model improves over time, adapting to new data patterns and optimizing its prediction accuracy.",
                  icon: "📈"
                },
                {
                  title: "Interactive Exploration",
                  description: "Hover over data points to see detailed comparisons between predicted values and actual outcomes.",
                  icon: "🔍"
                },
                {
                  title: "Confidence Metrics",
                  description: "Visualize the AI's confidence level in its predictions, illuminating the decision-making process.",
                  icon: "🎯"
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)" }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-purple-300">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Skills/Technologies Section - only render when scrolled */}
      {isScrolled && (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-blue-900/30 z-10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-20 z-5"></div>
          
          <motion.div className="relative z-20 w-full max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Technologies I Work With
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
              viewport={{ once: true }}
            >
              {[
                "React", "Three.js", "WebGL", "JavaScript", 
                "Tailwind CSS", "Framer Motion", "React Three Fiber", "Node.js"
              ].map((tech, index) => (
                <motion.div 
                  key={index}
                  className="bg-blue-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 flex flex-col items-center text-center hover:bg-blue-800/30 transition-all"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h3 className="text-xl font-semibold">{tech}</h3>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Contact CTA Section - replacing About */}
      {isScrolled && (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 z-5"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Ready to Start Your Project?
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              I'm currently available for freelance work and collaboration opportunities.
              Let's create something amazing together!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link to="/contact">
                <motion.button
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all rounded-full text-white font-medium text-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in Touch
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Footer/Contact Section */}
      <div className="relative py-20 px-6 border-t border-white/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-5"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
          
          <Link to="/contact">
            <motion.button 
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-white font-medium text-lg shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(124, 58, 237, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.button>
          </Link>
          
          <div className="flex justify-center gap-8 mt-12 flex-wrap">
            {["GitHub", "LinkedIn", "Twitter", "Instagram"].map((platform, index) => (
              <motion.a 
                key={index}
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                {platform}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
