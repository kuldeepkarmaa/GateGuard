import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children, role, userName, navItems }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex font-sans">
      
      {/* Sidebar Navigation */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col justify-between p-4 border-r border-slate-800 shrink-0`}>
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-800">
            <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center font-extrabold text-xl text-white shadow-md shadow-sky-500/20">
              G
            </div>
            {sidebarOpen && <span className="font-extrabold text-xl tracking-tight text-white">GateGuard</span>}
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium"
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Account Info & Logout */}
        <div className="border-t border-slate-800 pt-4">
          {sidebarOpen && (
            <div className="mb-3 px-2">
              <p className="text-sm font-bold text-white truncate">{userName || 'User'}</p>
              <p className="text-xs text-sky-400 capitalize">{role} Account</p>
            </div>
          )}
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-all text-sm font-bold"
          >
            🚪 {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold"
          >
            ☰ Menu
          </button>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
              ● System Online
            </span>
          </div>
        </header>

        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>

    </div>
  );
}