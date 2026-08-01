import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function GuardDashboard() {
  const { user } = useContext(AuthContext);
  
  // States
  const [otp, setOtp] = useState('');
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal State for New Visitor Entry (Direct Flat & Block Input)
  const [entryModal, setEntryModal] = useState(false);
  const [visitorData, setVisitorData] = useState({
    name: '',
    phone: '',
    purpose: 'Guest',
    block: 'A',
    flatNumber: ''
  });

  // Fetch Visitors Data
  const fetchGuardLogs = async () => {
    try {
      const { data } = await API.get('/visitor');
      setActiveVisitors(Array.isArray(data?.visitors) ? data.visitors : []);
    } catch (err) {
      console.error('Error fetching guard logs:', err);
    }
  };

  useEffect(() => {
    fetchGuardLogs();
  }, []);

  // 1. Verify Passcode OTP Handler
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

  // 2. Unannounced Visitor Entry Request Handler (Direct Flat No.)
  const handleCreateVisitorEntry = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/visitor/request-entry', visitorData);
      alert(data.message || 'Entry Request Sent to Resident!');
      setEntryModal(false);
      setVisitorData({ name: '', phone: '', purpose: 'Guest', block: 'A', flatNumber: '' });
      fetchGuardLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send visitor entry request');
    }
  };

  // 3. Visitor Checkout Handler
  const handleCheckout = async (id) => {
    try {
      await API.put(`/visitor/checkout/${id}`);
      fetchGuardLogs();
    } catch (err) {
      alert('Checkout failed');
    }
  };

  // Filter visitors based on search bar
  const filteredVisitors = activeVisitors.filter(v => 
    v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.phone?.includes(searchQuery)
  );

  const navItems = [
    { label: 'Gate Terminal', icon: '🛡️', path: '/guard-dashboard' }
  ];

  return (
    <DashboardLayout role="Guard" userName={user?.name} navItems={navItems}>
      
      {/* 📊 Gate Statistics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Visitors Today</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{activeVisitors.length}</h3>
          <span className="text-[11px] text-sky-600 font-bold">● Gate Security Active</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Checked-In Inside</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">
            {activeVisitors.filter(v => v.status === 'Checked-In').length}
          </h3>
          <span className="text-[11px] text-emerald-600 font-bold">Currently On-Premises</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Checked-Out</p>
          <h3 className="text-2xl font-black text-slate-600 mt-1">
            {activeVisitors.filter(v => v.status === 'Checked-Out').length}
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Exited Premises</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">
            {activeVisitors.filter(v => v.status === 'Pending Approval' || v.status === 'Pre-Approved').length}
          </h3>
          <span className="text-[11px] text-amber-600 font-bold">Awaiting Action</span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Terminal Column */}
        <div className="space-y-6">
          
          {/* OTP Input Terminal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">🔑 Validate Entry Passcode</h2>
            <p className="text-xs text-slate-500 mb-6">Enter the 6-digit OTP code provided by the visitor.</p>

            {message.text && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-bold text-center border ${
                message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
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
                className="w-full text-center text-3xl tracking-[0.4em] font-mono bg-slate-50 border border-slate-300 text-slate-900 rounded-xl py-3 focus:outline-none focus:border-sky-500" 
              />
              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
              >
                Verify Passcode & Allow Entry
              </button>
            </form>
          </div>

          {/* Quick Manual Entry Trigger Button */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-md text-center">
            <h3 className="font-bold text-sm mb-1">Unannounced Visitor Arrived?</h3>
            <p className="text-xs text-slate-400 mb-4">Send an instant entry request to resident's flat.</p>
            <button 
              onClick={() => setEntryModal(true)}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl transition-all shadow-md"
            >
              + Register Visitor by Flat No.
            </button>
          </div>

        </div>

        {/* Dynamic Entry Logs (2 Cols) */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-base font-bold text-slate-900">Gate Visitor Activity</h2>
            
            {/* Search Input Bar */}
            <input 
              type="text" 
              placeholder="🔍 Search visitor by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-400 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Visitor</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Entry Time</th>
                  <th className="py-2.5 px-3">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-xs text-slate-400">No matching visitor records found.</td>
                  </tr>
                ) : (
                  filteredVisitors.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        <div>{v.name}</div>
                        <span className="text-[10px] text-slate-400">{v.phone}</span>
                      </td>
                      <td className="py-3 px-3 text-xs">{v.purpose}</td>
                      <td className="py-3 px-3 text-xs text-slate-500 font-mono">
                        {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                      </td>
                      <td className="py-3 px-3">
                        {v.status === 'Checked-In' ? (
                          <button 
                            onClick={() => handleCheckout(v._id)} 
                            className="px-3 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 rounded-lg text-xs font-bold transition-all"
                          >
                            Mark Exit
                          </button>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            v.status === 'Pre-Approved' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            v.status === 'Checked-Out' ? 'bg-slate-100 text-slate-500' :
                            'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}>
                            {v.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 🚀 Unannounced Visitor Modal (Direct Flat & Block Input) */}
      {entryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Request Visitor Approval</h3>
            <form onSubmit={handleCreateVisitorEntry} className="space-y-3">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visitor Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ramesh Kumar" 
                  value={visitorData.name} 
                  onChange={(e) => setVisitorData({ ...visitorData, name: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visitor Phone Number</label>
                <input 
                  type="text" 
                  required 
                  placeholder="+91 9876543210" 
                  value={visitorData.phone} 
                  onChange={(e) => setVisitorData({ ...visitorData, phone: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Visit</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Delivery, Guest, Service" 
                  value={visitorData.purpose} 
                  onChange={(e) => setVisitorData({ ...visitorData, purpose: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800" 
                />
              </div>

              {/* Direct Flat Number & Block Input Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Block / Wing</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. A" 
                    value={visitorData.block} 
                    onChange={(e) => setVisitorData({ ...visitorData, block: e.target.value })} 
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-bold" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Flat No.</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 102" 
                    value={visitorData.flatNumber} 
                    onChange={(e) => setVisitorData({ ...visitorData, flatNumber: e.target.value })} 
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-bold" 
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">
                  Send Request to Flat
                </button>
                <button type="button" onClick={() => setEntryModal(false)} className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-xs">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}