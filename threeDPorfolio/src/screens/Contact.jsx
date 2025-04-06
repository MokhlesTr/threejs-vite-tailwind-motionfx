import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { FaLinkedin, FaTwitter, FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import emailjs from '@emailjs/browser';

// EmailJS configuration constants
// Replace these with your actual EmailJS service, template and user IDs
const EMAILJS_SERVICE_ID = "service_xxxxxxx"; // Update with your actual service ID
const EMAILJS_TEMPLATE_ID = "template_xxxxxxx"; // Update with your actual template ID
const EMAILJS_PUBLIC_KEY = "public_key_xxxxxxx"; // Update with your actual public key
const RECIPIENT_EMAIL = "mokhlestarmiz001@gmail.com";

export default function Contact() {
  const formRef = useRef(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    to_email: RECIPIENT_EMAIL // Add recipient email for EmailJS template
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [canvasError, setCanvasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
      setCanvasError(true);
      console.log("Disabled Contact Canvas due to WebGL errors");
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Use EmailJS to send the form data
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        ...formState,
        subject: formState.subject, // Make sure subject is included
        message: formState.message, // Make sure message is included
        from_name: formState.name,
        reply_to: formState.email,
        to_email: RECIPIENT_EMAIL
      },
      EMAILJS_PUBLIC_KEY
    )
    .then((response) => {
      console.log('Email sent successfully:', response);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
          to_email: RECIPIENT_EMAIL
        });
      }, 3000);
    })
    .catch((error) => {
      console.error('Email sending failed:', error);
      setIsSubmitting(false);
      setSubmitError("Failed to send email. Please try again or reach out directly via email.");
    });
  };

  return (
    <div className="fixed inset-0 w-full h-screen overflow-y-auto">
      {/* Fixed navbar height spacer */}
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

      {/* Overlay to improve form visibility */}
      <div className={`fixed inset-0 ${canvasError ? 'bg-indigo-900/20' : 'bg-black/40'} z-1`}></div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 py-12 min-h-[calc(100vh-5rem)]">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get In Touch
        </motion.h1>
        
        <motion.p
          className="text-lg text-center text-gray-300 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Have a project in mind or want to collaborate? I'd love to hear from you. Fill out the form below or reach out through any of my social channels.
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {isSubmitted ? (
              <motion.div 
                className="h-full flex flex-col items-center justify-center text-center p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300">Thank you for reaching out. I'll get back to you as soon as possible.</p>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                  ></textarea>
                </div>
                
                {submitError && (
                  <div className="text-red-400 bg-red-400/10 p-3 rounded-lg">
                    {submitError}
                  </div>
                )}
                
                <motion.button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium text-white shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <FaEnvelope className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Email</h4>
                    <a href={`mailto:${RECIPIENT_EMAIL}`} className="text-gray-300 hover:text-blue-400 transition">
                      {RECIPIENT_EMAIL}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                    <FaPhoneAlt className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Phone</h4>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                    <FaMapMarkerAlt className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Location</h4>
                    <p className="text-gray-300">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6">Connect With Me</h3>
              
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaLinkedin className="text-xl" />
                </motion.a>
                
                <motion.a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/40 text-gray-400 hover:bg-gray-700 hover:text-white transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub className="text-xl" />
                </motion.a>
                
                <motion.a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-400/20 text-blue-400 hover:bg-blue-400 hover:text-white transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTwitter className="text-xl" />
                </motion.a>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-2">Working Hours</h4>
                <p className="text-gray-300">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Weekend: By appointment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 