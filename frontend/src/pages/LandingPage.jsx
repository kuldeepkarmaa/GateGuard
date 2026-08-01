import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      
      {/* 1. Header / Navbar */}
      <header className="bg-slate-950 text-white px-6 md:px-16 py-5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-sky-400 tracking-tight">
            Gate<span className="text-white">Guard</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#home" className="text-sky-400 hover:text-sky-300 transition-colors">Home</a>
          <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
          <a href="#services" className="text-slate-300 hover:text-white transition-colors">Services</a>
          <a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            to="/login" 
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold shadow-lg shadow-sky-500/30 transition-all"
          >
            Portal Login
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="home" className="relative bg-slate-900 text-white py-20 md:py-28 px-6 md:px-16 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex-1 max-w-3xl">
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-sky-400 block mb-3">
              GATE GUARD
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Life Time Free with no Hidden Cost
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              Next-generation Proptech SaaS solution automating gate security, visitor authentication, and society operational oversight for residential communities.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/login?mode=register" 
                className="px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-sky-500/25"
              >
                Register Society
              </Link>
              <a 
                href="#about" 
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl text-sm transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
              alt="GateGuard Architecture" 
              className="w-full h-80 object-cover"
            />
          </div>

        </div>
      </section>

      {/* 3. WHO WE ARE Section */}
      <section id="about" className="py-20 px-6 md:px-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <div className="border-4 border-slate-100 rounded-2xl overflow-hidden shadow-xl bg-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" 
                alt="Proptech Startup" 
                className="w-full h-[380px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="inline-block bg-sky-500 text-white text-[11px] font-extrabold px-3 py-1 uppercase tracking-wider rounded-sm mb-4">
              WHO WE ARE
            </span>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
              A Pune based startup expertise in Proptech
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Radixile Technology Solutions, a dynamic product-focused, proptech software company headquartered in Pune, Maharashtra, India, is driving digital transformation for residential communities through its flagship product, urbansociety.in.
            </p>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Recognizing the evolving needs of modern societies, we have engineered an innovative software-as-a-service (SaaS) platform that streamlines and automates critical management functions, primarily focusing on financial oversight and gate operations.
            </p>
          </div>
        </div>

        {/* Info Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl shrink-0">📍</div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Our Office</h4>
              <p className="text-xs text-slate-500 leading-normal">#5, Manali Park, Saswad, Pune<br />Maharastara, India</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl shrink-0">✉️</div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Email Us</h4>
              <p className="text-xs text-slate-500 leading-normal">contact@urbansociety.in</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl shrink-0">📞</div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Call Us</h4>
              <p className="text-xs text-slate-500 leading-normal">+91 9637 00 01 02<br />+91 8554 00 01 02</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE DO Section */}
      <section id="services" className="bg-slate-50 py-20 px-6 md:px-16 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5">
              <span className="inline-block bg-sky-500 text-white text-[11px] font-extrabold px-3 py-1 uppercase tracking-wider rounded-sm mb-4">
                WHAT WE DO
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                We Offer Complete Society Management Software Solution
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                The core problem we are solving revolves around replacing traditional, error-prone paper logs with automated digital workflows.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl shrink-0 font-bold">💻</div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-1">Inefficiency</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Traditional manual processes slow down daily operations.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl shrink-0 font-bold">🔍</div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-1">Lack of Transparency</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Residents often lack real-time visibility into visitor logs.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl shrink-0 font-bold">⏳</div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-1">Time-Consuming Nature</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Manual approvals waste valuable time for all stakeholders.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl shrink-0 font-bold">📈</div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-1">Artificial Intelligent</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Smart insights and passcode authentication at security gates.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-slate-950 text-white py-8 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          © 2026 GateGuard - Powered by Radixile Technology Solutions. All rights reserved.
        </p>
      </footer>

    </div>
  );
}