import "./glowCard.css";
import usePointerGlow from "../hooks/userPointerGlow";
import { motion } from "framer-motion";
import testPic from "../assets/testPic2.jpg";

export default function GlowCard() {
  const { x, y, xp, yp } = usePointerGlow();

  return (
    <article 
      data-glow 
      style={{ "--x": x, "--y": y, "--xp": xp, "--yp": yp }}
      className="relative"
    >
      <motion.img
        src={testPic}
        alt="Project preview"
        className="absolute w-full h-4/5 object-cover shadow-xl rounded-xl p-2"
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <button data-glow>
        <span>Details</span>
        <div data-glow></div>
      </button>
    </article>
  );
}
