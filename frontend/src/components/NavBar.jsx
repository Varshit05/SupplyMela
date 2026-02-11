import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useVendorAuth } from "../context/vendorAuthContext";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi"; // Added icons
import logoImg from "../assets/logo.png"; // 1. Import the logo image

const Navbar = () => {
  const { token, logout } = useVendorAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Unified Link Styling
  const linkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 
     ${isActive
      ? "bg-indigo-50 text-indigo-700 shadow-sm"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Branding */}
        <Link to="/" className="flex items-center group">
          <img
            src={logoImg}
            alt="SupplyMela Home"
            className="h-12 md:h-12 w-32 md:w-36 object-cover object-center transition-transform group-hover:scale-105 "
          />


        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={linkStyle}>Vendors</NavLink>

          {token ? (
            <>
              <NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink>
              <NavLink to="/products" className={linkStyle}>My Products</NavLink>
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button - Visible only on mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 p-4 space-y-3 animate-in slide-in-from-top-2 duration-300 shadow-xl">
          <NavLink to="/" onClick={toggleMenu} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">
            Vendors
          </NavLink>

          {token ? (
            <>
              <NavLink to="/dashboard" onClick={toggleMenu} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">
                Dashboard
              </NavLink>
              <NavLink to="/products" onClick={toggleMenu} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">
                My Products
              </NavLink>
              <button
                onClick={() => { logout(); toggleMenu(); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-rose-600 font-bold bg-rose-50 rounded-xl"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="block w-full text-center px-4 py-3 bg-slate-900 text-white rounded-xl font-bold"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;