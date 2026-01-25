import React from 'react';
import { Shield, Lock, Eye, FileText, Info } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "January 19, 2026";

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 text-blue-600 mb-4">
            <Shield className="w-6 h-6" />
            <span className="font-semibold uppercase tracking-wider text-sm">Trust & Safety</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 italic">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Introduction */}
          <div className="p-8 border-b border-slate-100 bg-blue-50/30">
            <p className="text-slate-700 leading-relaxed">
              We are committed to protecting the privacy, confidentiality, and security of the personal and business information shared with us by vendors, customers, buyers, and other users. This Privacy Policy explains what data we collect, how we use it, how we protect it, and your rights.
            </p>
          </div>

          <div className="p-8 space-y-12 text-slate-700 leading-relaxed">
            
            {/* 1. Scope */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm text-slate-600">1</span>
                Scope of This Policy
              </h2>
              <p className="mb-4">This Privacy Policy applies to all Vendors, Suppliers, MSMEs, Buyers, and registered users accessing our website, web applications, or APIs.</p>
            </section>

            {/* 2. Information Collection */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm text-slate-600">2</span>
                Information We Collect
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> For Vendors
                  </h3>
                  <ul className="text-sm space-y-2 text-slate-600 list-disc pl-4">
                    <li>Business name & Trade name</li>
                    <li>GSTIN, PAN, and CIN details</li>
                    <li>KYC documents & Signatory details</li>
                    <li>Bank account details for verification</li>
                    <li>Product catalogs & pricing</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" /> For Buyers
                  </h3>
                  <ul className="text-sm space-y-2 text-slate-600 list-disc pl-4">
                    <li>Procurement preferences</li>
                    <li>Search & Interaction activity</li>
                    <li>Billing & Invoicing details</li>
                    <li>Account credentials</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-sm text-blue-700">
                  We also collect technical data automatically (IP address, cookies) and verify data against public databases like <strong>GST and MCA records</strong>.
                </p>
              </div>
            </section>

            {/* 3. Usage */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm text-slate-600">3</span>
                How We Use Your Information
              </h2>
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-5">
                <li>Onboard & verify users</li>
                <li>Display vendor trust indicators</li>
                <li>Conduct fraud & risk checks</li>
                <li>Enable buyer-vendor communication</li>
                <li>Transactional communications</li>
                <li>Legal & Regulatory compliance</li>
              </ul>
              <div className="mt-6 p-4 rounded-lg bg-red-50 text-red-700 font-semibold border border-red-100 text-center">
                We do not sell personal data to third parties.
              </div>
            </section>

            {/* 4. Security */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm text-slate-600">4</span>
                Data Security & Retention
              </h2>
              <p className="mb-4">
                We implement industry-standard security measures including <strong>encryption of data at rest and in transit</strong>. We retain data only for as long as necessary to fulfill business purposes or comply with Indian regulatory audit requirements.
              </p>
            </section>

            {/* 5. Rights */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm text-slate-600">5</span>
                Your Rights
              </h2>
              <p>
                Subject to applicable Indian law, you have the right to access, correct, or request deletion of your data. You may also withdraw consent for non-essential processing.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;