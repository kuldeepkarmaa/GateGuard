import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: 'Resident',
    flatNumber: '', block: '', vehicleNumber: '', shift: 'Morning'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await API.post(endpoint, formData);

      if (data.success) {
        login(data.user, data.token);
        const role = data.user.role.toLowerCase();
        navigate(`/${role}-dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-indigo-600/20 text-indigo-400 items-center justify-center font-extrabold text-2xl border border-indigo-500/30 mb-3">
            G
          </div>
          <h2 className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-sm text-slate-400 mt-1">GateGuard Housing Management</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input type="text" name="name" required onChange={handleChange} className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input type="text" name="phone" required onChange={handleChange} className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input type="password" name="password" required onChange={handleChange} className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                <option value="Resident">Resident</option>
                <option value="Guard">Security Guard</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          {!isLogin && formData.role === 'Resident' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Block</label>
                <input type="text" name="block" required placeholder="A" onChange={handleChange} className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Flat No.</label>
                <input type="text" name="flatNumber" required placeholder="102" onChange={handleChange} className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30">
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-xs text-indigo-400 hover:underline">
            {isLogin ? "Don't have an account? Register" : "Already registered? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}