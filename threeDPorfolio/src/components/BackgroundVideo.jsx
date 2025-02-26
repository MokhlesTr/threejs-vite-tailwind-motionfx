import { motion } from "framer-motion";
import videoSrc from "../assets/backgroundView2.mp4";

const BackgroundVideo = () => {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-black z-40 pointer-events-none">
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "linear" }}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
      </div>
    </div>
  );
};

export default BackgroundVideo;
