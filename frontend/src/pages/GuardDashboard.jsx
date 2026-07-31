import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function GuardDashboard() {
  const { user } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchGuardLogs = async () => {
    try {
      const { data } = await API.get('/visitor');
      setActiveVisitors(data.visitors);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGuardLogs();
  }, []);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const { data } = await API.post('/visitor/verify-otp', { otp });
      setMessage({ type: 'success', text: data.message });
      setOtp('');
      fetchGuardLogs();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Verification Failed' });
    }
  };

  const handleCheckout = async (id) => {
    try {
      await API.put(`/visitor/checkout/${id}`);
      fetchGuardLogs();
    } catch (err) {
      alert('Failed to checkout visitor');
    }
  };

  const navItems = [
    { label: 'Gate Terminal', icon: '🛡️', path: '/guard-dashboard' }
  ];

  return (
    <DashboardLayout role="Guard" userName={user?.name} navItems={navItems}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* OTP Terminal (1 col) */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">🔑 Entry OTP Terminal</h2>
          <p className="text-xs text-slate-400 mb-6">Enter visitor's 6-digit passcode for gate validation.</p>

          {message.text && (
            <div className={`p-3 rounded-xl mb-4 text-xs text-center border font-semibold ${
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <input 
              type="text" 
              maxLength="6" 
              placeholder="123456" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              className="w-full text-center text-2xl tracking-[0.5em] font-mono bg-slate-900 border border-slate-700 text-white rounded-xl py-3 focus:border-indigo-500 focus:outline-none" 
            />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20">
              Verify Passcode
            </button>
          </form>
        </div>

        {/* Live Visitor Logs (2 cols) */}
        <div className="md:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Gate Entrance Activity Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs text-slate-400 uppercase border-b border-slate-700/60">
                <tr>
                  <th className="py-2.5 px-3">Visitor</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Entry Time</th>
                  <th className="py-2.5 px-3">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {activeVisitors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-medium text-white">{v.name}</td>
                    <td className="py-3 px-3">{v.purpose}</td>
                    <td className="py-3 px-3 text-xs text-slate-400">
                      {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </td>
                    <td className="py-3 px-3">
                      {v.status === 'Checked-In' ? (
                        <button onClick={() => handleCheckout(v._id)} className="px-3 py-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-lg text-xs font-semibold transition-all">
                          Checkout
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">{v.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}