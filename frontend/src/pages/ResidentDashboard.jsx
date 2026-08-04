import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ResidentDashboard() {
  const { user } = useContext(AuthContext);
  
  // State Management
  const [visitors, setVisitors] = useState([]);
  const [notices, setNotices] = useState([]);
  
  // Modal States
  const [passModal, setPassModal] = useState(false);
  const [complaintModal, setComplaintModal] = useState(false);

  // Form States
  const [guestData, setGuestData] = useState({ name: '', phone: '', purpose: 'Guest' });
  const [complaintData, setComplaintData] = useState({ title: '', description: '', priority: 'Medium' });
  const [complaintImage, setComplaintImage] = useState(null);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const [visRes, notRes] = await Promise.all([
        API.get('/visitor').catch(() => ({ data: { visitors: [] } })),
        API.get('/notice').catch(() => ({ data: { notices: [] } }))
      ]);
      setVisitors(Array.isArray(visRes.data?.visitors) ? visRes.data.visitors : []);
      setNotices(Array.isArray(notRes.data?.notices) ? notRes.data.notices : []);
    } catch (err) {
      console.error('Error loading resident dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 1. Generate Pre-Approved Guest Passcode (OTP)
  const handleGeneratePass = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/visitor/pre-approve', guestData);
      alert(`🎉 Pass generated! Visitor OTP: ${data.visitor?.otp || 'Generated'}`);
      setPassModal(false);
      setGuestData({ name: '', phone: '', purpose: 'Guest' });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating pass');
    }
  };

  // 2. Respond to Gate Approval Request (Approve / Reject)
  const handleRespondRequest = async (visitorId, status) => {
    try {
      const { data } = await API.post('/visitor/respond', { visitorId, status });
      alert(data.message || `Visitor request ${status.toLowerCase()}!`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process gate approval request');
    }
  };

  // 3. Lodge Maintenance Complaint Handler
  const handleLodgeComplaint = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', complaintData.title);
    formData.append('description', complaintData.description);
    formData.append('priority', complaintData.priority);
    if (complaintImage) formData.append('image', complaintImage);

    try {
      await API.post('/complaint', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      setComplaintModal(false);
      setComplaintData({ title: '', description: '', priority: 'Medium' });
      setComplaintImage(null);
      alert('✅ Maintenance complaint registered successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error lodging complaint');
    }
  };

  // Filter pending gate entry requests sent by Guard
  const pendingRequests = visitors.filter(v => v.status === 'Pending Approval');

  const navItems = [
    { label: 'Dashboard', icon: '📊', path: '/resident-dashboard' }
  ];

  return (
    <DashboardLayout role="Resident" userName={user?.name} navItems={navItems}>
      
      {/* 📊 Resident KPI Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Guests Logged</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{visitors.length}</h3>
          <span className="text-[11px] text-sky-600 font-bold">● Pass Records</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gate Requests</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingRequests.length}</h3>
          <span className="text-[11px] text-amber-600 font-bold">Awaiting Approval</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Notices</p>
          <h3 className="text-2xl font-black text-purple-600 mt-1">{notices.length}</h3>
          <span className="text-[11px] text-purple-600 font-bold">Society Broadcasts</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Status</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">Verified</h3>
          <span className="text-[11px] text-emerald-600 font-bold">● Unit Online</span>
        </div>
      </div>

      {/* 🔔 Real-Time Gate Approval Alert Banner (Unannounced Visitors) */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
              <span>🔔</span> Pending Gate Approval Requests ({pendingRequests.length})
            </h3>
            <span className="text-[11px] font-bold text-amber-700">Security Gate Guard Alert</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.map((v) => (
              <div key={v._id} className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-xs font-bold text-slate-900">{v.name}</p>
                  <p className="text-[11px] text-slate-500">Phone: {v.phone} • Purpose: {v.purpose}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRespondRequest(v._id, 'Approved')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleRespondRequest(v._id, 'Rejected')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview Banner & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Resident Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Pre-approve guests, check society updates, and track maintenance requests.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setPassModal(true)} 
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
          >
            + Pre-Approve Guest Pass
          </button>
          <button 
            onClick={() => setComplaintModal(true)} 
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-sky-600/20"
          >
            + Raise Maintenance Issue
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Guest Pass / Visitors Log Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Guest Entry Logs</span>
            <span className="text-xs font-semibold text-slate-500">{visitors.length} entries</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-400 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Visitor</th>
                  <th className="py-3 px-3">OTP Passcode</th>
                  <th className="py-3 px-3">Purpose</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-xs text-slate-400">No visitor records logged yet.</td>
                  </tr>
                ) : (
                  visitors.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        <div>{v.name}</div>
                        <span className="text-[10px] text-slate-400">{v.phone}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-sky-600 font-bold text-sm">{v.otp || 'N/A'}</td>
                      <td className="py-3 px-3 text-xs">{v.purpose}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          v.status === 'Checked-In' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                          v.status === 'Pre-Approved' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          v.status === 'Approved' ? 'bg-sky-100 text-sky-700 border border-sky-200' :
                          v.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Noticeboard Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Society Noticeboard</span>
            <span className="text-xs font-semibold text-slate-500">{notices.length} active</span>
          </h2>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {notices.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No broadcasted notices.</p>
            ) : (
              notices.map((n) => (
                <div key={n._id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-800">{n.title}</h3>
                    {n.isPinned && <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">📌 Pinned</span>}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                  <span className="text-[10px] text-slate-400 block mt-2">
                    Posted on {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 🚀 Modal 1: Generate Guest Passcode */}
      {passModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Generate Visitor Passcode</h3>
            <form onSubmit={handleGeneratePass} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guest Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Sharma" 
                  required 
                  value={guestData.name} 
                  onChange={(e) => setGuestData({ ...guestData, name: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guest Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+91 9876543210" 
                  required 
                  value={guestData.phone} 
                  onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Visit</label>
                <input 
                  type="text" 
                  placeholder="e.g. Guest, Delivery, Cab" 
                  required 
                  value={guestData.purpose} 
                  onChange={(e) => setGuestData({ ...guestData, purpose: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800" 
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">
                  Generate OTP Pass
                </button>
                <button type="button" onClick={() => setPassModal(false)} className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-xs">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🛠️ Modal 2: Lodge Maintenance Complaint */}
      {complaintModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register Maintenance Issue</h3>
            <form onSubmit={handleLodgeComplaint} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Water Leakage in Kitchen" 
                  required 
                  value={complaintData.title} 
                  onChange={(e) => setComplaintData({ ...complaintData, title: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea 
                  placeholder="Describe the problem..." 
                  required 
                  value={complaintData.description} 
                  onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs h-24 focus:outline-none focus:border-sky-500 text-slate-800"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                <select 
                  value={complaintData.priority} 
                  onChange={(e) => setComplaintData({ ...complaintData, priority: e.target.value })} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attach Photo Evidence (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setComplaintImage(e.target.files[0])} 
                  className="text-xs text-slate-500 block w-full" 
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">
                  Submit Issue
                </button>
                <button type="button" onClick={() => setComplaintModal(false)} className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-xs">
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