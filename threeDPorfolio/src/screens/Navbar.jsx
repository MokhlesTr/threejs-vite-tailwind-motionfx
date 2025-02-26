import { Link } from "react-router-dom";
import { FaRocket } from "react-icons/fa";

export default function Navbar() {
  return (
    <div
      className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-50 
                 bg-black bg-opacity-30 backdrop-blur-lg shadow-lg"
    >
      <div className="flex items-center space-x-2">
        <FaRocket className="text-3xl text-white animate-pulse" />
        <h1 className="text-xl font-bold text-white">BRAND</h1>
      </div>

      <div className="space-x-6">
        <Link to="/" className="text-white hover:text-yellow-500 transition">
          Home
        </Link>
        {/* <Link
          //   to="/about"
          className="text-white hover:text-yellow-500 transition"
        >
          About
        </Link> */}
      </div>
    </div>
  );
}
