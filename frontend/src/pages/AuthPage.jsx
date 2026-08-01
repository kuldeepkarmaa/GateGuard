import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage() {
  // Mode States: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState('login');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Resident',
    flatNumber: '',
    block: '',
    vehicleNumber: '',
    shift: 'Morning'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data } = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (data.success) {
          login(data.user, data.token);
          const userRole = data.user.role.toLowerCase();
          navigate(`/${userRole}-dashboard`);
        }
      } else if (mode === 'register') {
        const { data } = await API.post('/auth/register', formData);

        if (data.success) {
          login(data.user, data.token);
          const userRole = data.user.role.toLowerCase();
          navigate(`/${userRole}-dashboard`);
        }
      } else if (mode === 'forgot') {
        // Trigger Forgot Password API Call
        setSuccessMsg('Reset password instructions have been sent to your email.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans text-slate-800">
      
      {/* Container Box */}
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl relative">
        
        {/* Back to Home Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Brand Icon & Welcome Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-purple-100 items-center justify-center font-extrabold text-2xl text-purple-600 shadow-sm mb-3">
            G
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h1>
          
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' && 'Log in to manage your gate pass & society activities'}
            {mode === 'register' && 'Join GateGuard for seamless society operations'}
            {mode === 'forgot' && 'Enter your email address to receive password reset link'}
          </p>
        </div>

        {/* Alerts & Errors */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-xs font-medium text-center">
            {successMsg}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register: Role Tab Selector */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Role</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                {['Resident', 'Guard', 'Admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      formData.role === r 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Register: Full Name */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
                <span className="absolute left-3.5 top-3 text-slate-400 text-sm">👤</span>
              </div>
            </div>
          )}

          {/* All Views: Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
              <span className="absolute left-3.5 top-3 text-slate-400 text-sm">✉️</span>
            </div>
          </div>

          {/* Register: Phone Number */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
                <span className="absolute left-3.5 top-3 text-slate-400 text-sm">📞</span>
              </div>
            </div>
          )}

          {/* Register (Resident Only): Block & Flat Number */}
          {mode === 'register' && formData.role === 'Resident' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Block / Wing</label>
                <input
                  type="text"
                  name="block"
                  required
                  placeholder="A"
                  value={formData.block}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Flat / Unit No.</label>
                <input
                  type="text"
                  name="flatNumber"
                  required
                  placeholder="102"
                  value={formData.flatNumber}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>
          )}

          {/* Login & Register: Password Inputs */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
                <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔒</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 text-xs hover:text-slate-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {/* Main Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-purple-600/30"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* OR Separator (Only on Login View) */}
        {mode === 'login' && (
          <>
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs uppercase font-bold text-slate-400">
                OR
              </span>
            </div>

            {/* Google Social Button */}
            <button 
              type="button"
              onClick={() => alert("Google SSO Login Triggered")}
              className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.21 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.1 0 9.99 0 12s.44 3.9 1.21 5.44l4.11-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.21 2.64 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
              </svg>
              Sign in with Google
            </button>
          </>
        )}

        {/* Toggle Mode Footer Links */}
        <div className="mt-6 text-center text-xs font-semibold text-slate-600">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-purple-600 hover:underline font-bold">
                Register
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="text-purple-600 hover:underline font-bold">
                Login
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <button onClick={() => setMode('login')} className="text-purple-600 hover:underline font-bold">
              Return to Sign In
            </button>
          )}
        </div>

      </div>
    </div>
  );
}