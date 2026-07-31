import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children, role, userName, navItems }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-r border-slate-700/60 transition-all duration-300 flex flex-col justify-between p-4`}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-700/50">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20">
              G
            </div>
            {sidebarOpen && <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">GateGuard</span>}
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item, index) => (
              <Link key={index} to={item.path} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all">
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="border-t border-slate-700/50 pt-4">
          {sidebarOpen && (
            <div className="mb-3 px-2">
              <p className="text-sm font-semibold text-white">{userName || 'User'}</p>
              <p className="text-xs text-indigo-400 capitalize">{role} Account</p>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
          >
            🚪 {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-slate-800/50 backdrop-blur-md border-b border-slate-700/60 flex items-center justify-between px-6 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300">
            ☰
          </button>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              ● System Active
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