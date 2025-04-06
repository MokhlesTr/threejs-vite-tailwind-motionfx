import { Link } from "react-router-dom";
import { FaRocket } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isContactPage = location.pathname === "/contact";
  
  return (
    <div
      className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-50 
                 bg-black bg-opacity-30 backdrop-blur-lg shadow-lg"
    >
      <div className="flex items-center space-x-2">
        <FaRocket className="text-3xl text-white animate-pulse" />
        <h1 className="text-xl font-bold text-white">TARMIZ</h1>
      </div>

      <div className="space-x-6">
        {isContactPage ? (
          <Link
            to="/"
            className="text-white hover:text-blue-500 transition"
          >
            Home
          </Link>
        ) : (
          <Link
            to="/contact"
            className="text-white hover:text-blue-500 transition"
          >
            Contact
          </Link>
        )}
      </div>
    </div>
  );
}
