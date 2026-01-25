// layouts/VendorLayout.jsx
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/NavBar";
import { Outlet, Link } from "react-router-dom";

const VendorLayout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>

      {/* White Multi-Column Design */}
      <footer
        ref={footerRef}
        className={`bg-white border-t border-slate-200 pt-12 pb-8 transition-all duration-700 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            
            {/* Column 1: Brand & Mission */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
                SupplyMela
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                India’s trusted digital marketplace for reliable procurement and 
                verified vendor discovery. Powering the next generation of trade.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:text-right">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link to="/about" className="hover:text-blue-600 transition-colors">
                    About Us
                  </Link>
                </li>
                {/* Added Contact Us Link */}
                <li>
                  <Link to="/contact" className="hover:text-blue-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© 2026 SupplyMela. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                GST Registered
              </span>
              <span>Made for Indian Businesses</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VendorLayout;