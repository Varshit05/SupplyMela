import React from 'react';
import { ShieldCheck, Search, BarChart3, Zap, Globe, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-3">About Us</h2>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Powering India’s Next-Generation <br />
            <span className="text-blue-500">B2B Trade</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed">
            We are India’s trusted B2B procurement and vendor-discovery platform — 
            a single digital marketplace where businesses reliably find, compare, verify, and transact 
            with suppliers across categories, geographies, and price points.
          </p>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
          <div className="aspect-square h-96 rounded-full bg-blue-600"></div>
        </div>
      </section>

      {/* Aggregator & Focus Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Strategic Sourcing & Export Focus</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              By acting as a unified **aggregator**, we combine a deeply curated vendor database with 
              intelligent matching and secure workflows. Our platform is built to handle the complexities of 
              **import and export**, ensuring Indian businesses can compete effectively on a global scale.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <Globe className="w-4 h-4 text-blue-600" /> Global Export-Import
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Verified Aggregator
              </div>
            </div>
          </div>
          <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <h4 className="text-xl font-semibold mb-4 text-blue-100 italic">"Helping businesses source better, faster, and at the right price."</h4>
            <p className="text-blue-500 font-bold bg-white inline-block px-3 py-1 rounded text-sm uppercase">Our Core Promise</p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">What We Do</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* For Buyers */}
          <div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
              <Users className="text-blue-600" /> For Buyers & Enterprises
            </h3>
            <div className="space-y-6">
              {[
                { icon: <Search />, title: "Discover", text: "Find verified suppliers across industries instantly." },
                { icon: <BarChart3 />, title: "Compare", text: "Analyze pricing, credibility, and capabilities in one view." },
                { icon: <ShieldCheck />, title: "Verify", text: "Trade with confidence using built-in integrity checks." },
                { icon: <Zap />, title: "Procure", text: "Faster cycles without endless calls or manual paperwork." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Vendors */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-8 text-blue-400">For Vendors & MSMEs</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <p className="text-slate-300">High-intent buyer access and consistent repeat business opportunities.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <p className="text-slate-300">Verified profiles that showcase trust, performance, and operational capabilities.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <p className="text-slate-300">Affordable visibility without needing multiple paid listings or complex portals.</p>
              </li>
            </ul>
            <div className="mt-10 p-4 border border-slate-700 rounded-xl bg-slate-800/50">
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Every vendor on our platform is vetted and continuously monitored. Many are already trusted by leading buyers in their segments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Why We Exist</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            B2B trade in India is still fragmented, relationship-heavy, and risky. 
            Verification is manual, discovery is expensive, and trust is hard to scale.
          </p>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <p className="text-lg">
              <strong>We solve this</strong> by turning vendor trust, reliability, and performance 
              into transparent, usable data for every business.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Who We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "SMEs & Enterprises looking for reliable vendors",
            "Manufacturers & Traders seeking genuine buyers",
            "Procurement Teams wanting faster, compliant sourcing",
            "Fintechs & NBFCs embedding trusted ecosystems"
          ].map((text, i) => (
            <div key={i} className="p-6 border border-slate-200 rounded-xl hover:border-blue-400 transition-colors bg-white shadow-sm">
              <p className="text-slate-700 font-medium">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="border-l-4 border-blue-600 pl-8">
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest text-blue-500">Our Vision</h3>
            <p className="text-slate-300 text-lg">
              To be India’s default B2B trade infrastructure — where every transaction is discoverable, 
              transparent, compliant, and backed by trust.
            </p>
          </div>
          <div className="border-l-4 border-slate-700 pl-8">
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest text-slate-400">Our Mission</h3>
            <p className="text-slate-300 text-lg">
              To simplify procurement, democratize vendor visibility, and turn trust into a competitive 
              advantage for every Indian business.
            </p>
          </div>
        </div>
        <div className="mt-20 text-center text-slate-500 text-sm font-semibold tracking-widest uppercase">
          Built for Indian businesses. Proven in real procurement. Ready to scale with you.
        </div>
      </section>
    </div>
  );
};

export default AboutPage;