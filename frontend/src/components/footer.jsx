import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand Section */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold tracking-tight">SupplyMela</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xs">
            Simplifying procurement and democratizing vendor visibility across India.
          </p>
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <p className="text-slate-400 text-sm italic">Built for Indian businesses.</p>
          
          <div className="flex gap-3">
            <Link 
              to="/about" 
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-md transition-colors duration-200"
            >
              About Us
            </Link>
            {/* Added Primary Contact Button */}
            <Link 
              to="/contact" 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 SupplyMela. All rights reserved.</p>
        <div className="flex gap-6">
          {/* Added Secondary Contact Link */}
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;