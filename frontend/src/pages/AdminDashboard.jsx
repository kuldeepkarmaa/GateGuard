import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const fetchAdminData = async () => {
    try {
      const { data } = await API.get('/complaint');
      setComplaints(data.complaints);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

 const handlePostNotice = async (e) => {
  e.preventDefault();
  try {
    const { data } = await API.post('/notice', { 
      title: noticeTitle, 
      description: noticeDesc, 
      isPinned 
    });
    
    if (data.success) {
      alert('🎉 Notice Published Successfully!');
      setNoticeTitle('');
      setNoticeDesc('');
      setIsPinned(false);
    }
  } catch (err) {
    console.error("Notice Publish Catch:", err);
    alert(err.response?.data?.message || 'Failed to publish notice. Check backend console.');
  }
};

  const handleUpdateComplaintStatus = async (id, status) => {
    try {
      await API.put(`/complaint/${id}`, { status });
      fetchAdminData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const navItems = [
    { label: 'Admin Console', icon: '⚙️', path: '/admin-dashboard' }
  ];

  return (
    <DashboardLayout role="Admin" userName={user?.name} navItems={navItems}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Notice Creation Form (1 col) */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-md font-bold text-white mb-4">📢 Broadcast Society Notice</h2>
          <form onSubmit={handlePostNotice} className="space-y-3">
            <input type="text" placeholder="Notice Title" required value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            <textarea placeholder="Notice Body details..." required value={noticeDesc} onChange={(e) => setNoticeDesc(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm h-28"></textarea>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pin" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="rounded bg-slate-800 border-slate-700" />
              <label htmlFor="pin" className="text-xs text-slate-300">Pin Notice to Top</label>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-lg shadow-indigo-600/20">
              Publish Broadcast
            </button>
          </form>
        </div>

        {/* Dynamic Maintenance Complaints (2 cols) */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-md font-bold text-white mb-4">Society Maintenance Issues</h2>
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c._id} className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm">{c.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold">{c.priority}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{c.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={c.status} 
                    onChange={(e) => handleUpdateComplaintStatus(c._id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}