import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  
  // Navigation Tabs: 'overview' | 'notices' | 'complaints' | 'residents' | 'guards'
  const [activeTab, setActiveTab] = useState('overview');

  // State Management
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [visitors, setVisitors] = useState([]);
  
  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [submittingNotice, setSubmittingNotice] = useState(false);

  // Fetch Admin Console Data
  const fetchAdminData = async () => {
    try {
      const [compRes, notRes, visRes] = await Promise.all([
        API.get('/complaint').catch(() => ({ data: { complaints: [] } })),
        API.get('/notice').catch(() => ({ data: { notices: [] } })),
        API.get('/visitor').catch(() => ({ data: { visitors: [] } }))
      ]);

      setComplaints(Array.isArray(compRes.data?.complaints) ? compRes.data.complaints : []);
      setNotices(Array.isArray(notRes.data?.notices) ? notRes.data.notices : []);
      setVisitors(Array.isArray(visRes.data?.visitors) ? visRes.data.visitors : []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Notice Broadcast Handler
  const handlePostNotice = async (e) => {
    e.preventDefault();
    setSubmittingNotice(true);
    try {
      const { data } = await API.post('/notice', { 
        title: noticeTitle, 
        description: noticeDesc, 
        isPinned 
      });
      
      if (data.success) {
        alert('🎉 Notice Broadcasted Successfully!');
        setNoticeTitle('');
        setNoticeDesc('');
        setIsPinned(false);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Notice Post Error:', err);
      alert(err.response?.data?.message || 'Failed to publish notice. Check backend logs.');
    } finally {
      setSubmittingNotice(false);
    }
  };

  // Notice Delete Handler
  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await API.delete(`/notice/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete notice');
    }
  };

  // Complaint Status Update Handler
  const handleUpdateComplaintStatus = async (id, status) => {
    try {
      await API.put(`/complaint/${id}`, { status });
      fetchAdminData();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const navItems = [
    { label: 'Admin Console', icon: '⚙️', path: '/admin-dashboard' }
  ];

  return (
    <DashboardLayout role="Admin" userName={user?.name} navItems={navItems}>
      
      {/* 📊 Top KPI Analytics Cards Bar (PDF Spec) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visitors Today</p>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600 text-base">🚪</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{visitors.length}</h3>
          <span className="text-[11px] text-emerald-600 font-bold">● Active Gates</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Issues</p>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 text-base">⚠️</span>
          </div>
          <h3 className="text-2xl font-black text-amber-600 mt-2">
            {complaints.filter(c => c.status === 'Pending').length}
          </h3>
          <span className="text-[11px] text-amber-600 font-bold">Requires Attention</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved Issues</p>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-base">✅</span>
          </div>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">
            {complaints.filter(c => c.status === 'Resolved').length}
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Completed Requests</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Notices</p>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 text-base">📢</span>
          </div>
          <h3 className="text-2xl font-black text-purple-600 mt-2">{notices.length}</h3>
          <span className="text-[11px] text-purple-600 font-bold">Broadcasted</span>
        </div>

      </div>

      {/* 🔘 Navigation Section Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview Console', icon: '📊' },
          { id: 'notices', label: 'Broadcast Notices', icon: '📢' },
          { id: 'complaints', label: 'Maintenance Complaints', icon: '🛠️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ----------------- TAB 1: OVERVIEW & COMBINED VIEW ----------------- */}
      {(activeTab === 'overview' || activeTab === 'notices') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Publish Notice Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span>📢</span> Broadcast Society Notice
            </h2>
            <p className="text-xs text-slate-500 mb-4">Post digital announcements to all residents & staff.</p>

            <form onSubmit={handlePostNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Water Supply Maintenance" 
                  required 
                  value={noticeTitle} 
                  onChange={(e) => setNoticeTitle(e.target.value)} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Details & Information</label>
                <textarea 
                  placeholder="Enter notice description..." 
                  required 
                  value={noticeDesc} 
                  onChange={(e) => setNoticeDesc(e.target.value)} 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs h-28 focus:outline-none focus:border-sky-500 text-slate-800"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <input 
                  type="checkbox" 
                  id="pin" 
                  checked={isPinned} 
                  onChange={(e) => setIsPinned(e.target.checked)} 
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4" 
                />
                <label htmlFor="pin" className="text-xs text-slate-700 font-bold cursor-pointer">
                  Pin Notice to Top of Noticeboard
                </label>
              </div>

              <button 
                type="submit" 
                disabled={submittingNotice}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-sky-600/20"
              >
                {submittingNotice ? 'Publishing...' : 'Publish Broadcast'}
              </button>
            </form>
          </div>

          {/* Published Notices List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Active Broadcast Notices</span>
              <span className="text-xs font-semibold text-slate-500">{notices.length} total</span>
            </h2>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {notices.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No notices published yet.</p>
              ) : (
                notices.map((n) => (
                  <div key={n._id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                        {n.isPinned && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                            📌 Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                      <span className="text-[10px] text-slate-400 block mt-2">
                        Published on {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleDeleteNotice(n._id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold p-1 hover:bg-red-50 rounded"
                      title="Delete Notice"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ----------------- TAB 2: COMPLAINTS MANAGEMENT VIEW ----------------- */}
      {(activeTab === 'overview' || activeTab === 'complaints') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mt-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>🛠️ Society Maintenance Issues</span>
            <span className="text-xs font-semibold text-slate-500">{complaints.length} registered</span>
          </h2>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No registered maintenance issues.</p>
            ) : (
              complaints.map((c) => (
                <div key={c._id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          c.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                          c.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {c.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                      {c.residentId?.userId?.name && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Raised by: <span className="font-semibold text-slate-700">{c.residentId.userId.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Status Update Selector Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Status:</span>
                      <select 
                        value={c.status} 
                        onChange={(e) => handleUpdateComplaintStatus(c._id, e.target.value)} 
                        className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none font-bold shadow-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Attachment Image Lightbox */}
                  {c.image && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-[11px] text-slate-400 font-bold mb-1">Attached Evidence Photo:</p>
                      <img 
                        src={`http://localhost:5000${c.image}`} 
                        alt="Issue Evidence" 
                        className="h-28 w-auto rounded-xl border border-slate-300 cursor-pointer object-cover hover:scale-105 transition-all shadow-sm" 
                        onClick={() => window.open(`http://localhost:5000${c.image}`, '_blank')} 
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}