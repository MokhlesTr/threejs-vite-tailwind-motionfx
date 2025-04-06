import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import "./index.css";
import Navbar from "./screens/Navbar";
import Contact from "./screens/Contact";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
