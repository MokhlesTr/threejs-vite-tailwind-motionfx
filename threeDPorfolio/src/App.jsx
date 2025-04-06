import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import "./index.css";
import Navbar from "./screens/Navbar";
import Contact from "./screens/Contact";
import About from "./screens/About";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
