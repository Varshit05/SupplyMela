import React from 'react';
import { FiMail, FiPhone } from "react-icons/fi";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Our Team
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Have questions about onboarding as a vendor or need help with procurement? 
            We're here to power your business growth.
          </p>
        </div>

        <div className="space-y-8">
          {/* Contact Information Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center md:text-left">
              Get in Touch
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Section */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <FiMail size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email Us</p>
                  <a 
                    href="mailto:contact@supplymela.com" 
                    className="text-slate-600 hover:text-blue-600 transition-colors break-all"
                  >
                    contact@supplymela.com
                  </a>
                </div>
              </div>

              {/* Phone Section */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg shrink-0">
                  <FiPhone size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Call Us</p>
                  <a 
                    href="tel:+918077301036" 
                    className="text-slate-600 hover:text-green-600 transition-colors"
                  >
                    +91 80773 01036
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Info Card */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">SupplyMela for Business</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join thousands of verified Indian vendors. Let us help you digitize your inventory 
              and reach buyers across the country.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;