import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ResidentDashboard() {
  const { user } = useContext(AuthContext);
  const [visitors, setVisitors] = useState([]);
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  
  // Form Modals
  const [passModal, setPassModal] = useState(false);
  const [complaintModal, setComplaintModal] = useState(false);

  // Form State
  const [guestData, setGuestData] = useState({ name: '', phone: '', purpose: 'Guest' });
  const [complaintData, setComplaintData] = useState({ title: '', description: '', priority: 'Medium' });
  const [complaintImage, setComplaintImage] = useState(null);

  // client/src/pages/ResidentDashboard.jsx

const fetchDashboardData = async () => {
  try {
    const [visRes, notRes, compRes] = await Promise.all([
      API.get('/visitor').catch(() => ({ data: { visitors: [] } })),
      API.get('/notice').catch(() => ({ data: { notices: [] } })),
      API.get('/complaint').catch(() => ({ data: { complaints: [] } }))
    ]);

    // Added Fallbacks to prevent undefined .map() crashes
    setVisitors(Array.isArray(visRes.data?.visitors) ? visRes.data.visitors : []);
    setNotices(Array.isArray(notRes.data?.notices) ? notRes.data.notices : []);
    setComplaints(Array.isArray(compRes.data?.complaints) ? compRes.data.complaints : []);
  } catch (err) {
    console.error('Dashboard fetch error:', err);
  }
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleGeneratePass = async (e) => {
    e.preventDefault();
    try {
      await API.post('/visitor/pre-approve', guestData);
      setPassModal(false);
      setGuestData({ name: '', phone: '', purpose: 'Guest' });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating pass');
    }
  };

  const handleLodgeComplaint = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', complaintData.title);
    formData.append('description', complaintData.description);
    formData.append('priority', complaintData.priority);
    if (complaintImage) formData.append('image', complaintImage);

    try {
      await API.post('/complaint', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setComplaintModal(false);
      setComplaintData({ title: '', description: '', priority: 'Medium' });
      setComplaintImage(null);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error logging complaint');
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: '📊', path: '/resident-dashboard' },
  ];

  return (
    <DashboardLayout role="Resident" userName={user?.name} navItems={navItems}>
      {/* Quick Action Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
        <div>
          <h1 className="text-xl font-bold text-white">Resident Portal</h1>
          <p className="text-sm text-slate-400">Manage entry passes, lodge complaints, and view notices.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPassModal(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-emerald-600/20">
            + Pre-Approve Guest Pass
          </button>
          <button onClick={() => setComplaintModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-indigo-600/20">
            + Raise Complaint
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visitors Log (2 cols) */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-md font-bold text-white mb-4 flex items-center justify-between">
            <span>Recent Guest Entry Passes</span>
            <span className="text-xs font-normal text-slate-400">{visitors.length} total</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs text-slate-400 uppercase border-b border-slate-700/60">
                <tr>
                  <th className="py-2.5 px-3">Visitor Name</th>
                  <th className="py-2.5 px-3">OTP Pass</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {visitors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-medium text-white">{v.name}</td>
                    <td className="py-3 px-3 font-mono text-indigo-400 font-bold">{v.otp || 'N/A'}</td>
                    <td className="py-3 px-3">{v.purpose}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        v.status === 'Checked-In' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        v.status === 'Pre-Approved' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice Board (1 col) */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-md font-bold text-white mb-4">Society Noticeboard</h2>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {notices.map((n) => (
              <div key={n._id} className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-white">{n.title}</h3>
                  {n.isPinned && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Pinned</span>}
                </div>
                <p className="text-xs text-slate-300">{n.description}</p>
                <span className="text-[10px] text-slate-500 block mt-2">{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guest Pass Modal */}
      {passModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Generate Visitor OTP Pass</h3>
            <form onSubmit={handleGeneratePass} className="space-y-3">
              <input type="text" placeholder="Guest Name" required value={guestData.name} onChange={(e) => setGuestData({ ...guestData, name: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
              <input type="text" placeholder="Guest Phone" required value={guestData.phone} onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
              <input type="text" placeholder="Purpose (e.g., Guest, Delivery)" required value={guestData.purpose} onChange={(e) => setGuestData({ ...guestData, purpose: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg text-sm">Generate OTP</button>
                <button type="button" onClick={() => setPassModal(false)} className="px-4 bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold py-2 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Lodge Maintenance Issue</h3>
            <form onSubmit={handleLodgeComplaint} className="space-y-3">
              <input type="text" placeholder="Issue Title" required value={complaintData.title} onChange={(e) => setComplaintData({ ...complaintData, title: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Describe the issue..." required value={complaintData.description} onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm h-24"></textarea>
              <select value={complaintData.priority} onChange={(e) => setComplaintData({ ...complaintData, priority: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm">
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Attach Photo (Optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setComplaintImage(e.target.files[0])} className="text-xs text-slate-400" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg text-sm">Submit Issue</button>
                <button type="button" onClick={() => setComplaintModal(false)} className="px-4 bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold py-2 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}