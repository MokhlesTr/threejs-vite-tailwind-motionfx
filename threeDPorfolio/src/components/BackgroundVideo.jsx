import { motion } from "framer-motion";
import videoSrc from "../assets/backgroundView2.mp4";

const BackgroundVideo = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <div className="absolute inset-0 bg-black/80 z-0 overflow-hidden">
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, ease: "linear" }}
          className="w-full h-full object-cover min-h-screen min-w-full"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
        <div className="absolute inset-0 bg-black/30 z-1"></div>
      </div>
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 z-2 opacity-30 bg-grid-pattern"></div>
    </div>
  );
};

export default BackgroundVideo;
