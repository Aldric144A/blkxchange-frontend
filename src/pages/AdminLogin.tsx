import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/vendors');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid email or password');
      }

      if (rememberMe) {
        const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_email', data.email);
        localStorage.setItem('admin_token_expiry', expiryDate.toISOString());
      } else {
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_email', data.email);
      }

      setForgotSuccess('✅ Successfully logged in. Redirecting to Admin Dashboard...');
      
      setTimeout(() => {
        window.location.href = '/admin/vendors';
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send reset email');
      }

      setForgotSuccess('Password reset link sent! Check your email (valid for 15 minutes).');
      setForgotEmail('');
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotSuccess('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C5A14E] mb-2">BlkXchange™</h1>
          <p className="text-white text-lg">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-8 border border-[#C5A14E]/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {showForgotPassword ? 'Reset Password' : 'Admin Login'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {forgotSuccess && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
              {forgotSuccess}
            </div>
          )}

          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A14E] transition-colors"
                  placeholder="admin@blkxchange.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A14E] transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#C5A14E] bg-[#111111] border-[#C5A14E]/30 rounded focus:ring-[#C5A14E] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-white">Remember Me (7 days)</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#C5A14E] hover:text-[#E9D7A1] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C5A14E] text-black font-semibold py-3 rounded-lg hover:bg-[#E9D7A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-white/70 text-sm mb-4">
                Enter your email address and we'll send you a link to reset your password. The link will be valid for 15 minutes.
              </p>

              <div>
                <label htmlFor="forgot-email" className="block text-white text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A14E] transition-colors"
                  placeholder="admin@blkxchange.com"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError('');
                    setForgotSuccess('');
                  }}
                  className="flex-1 bg-[#111111] text-white border border-[#C5A14E]/30 font-semibold py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#C5A14E] text-black font-semibold py-3 rounded-lg hover:bg-[#E9D7A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm">
            BlkXchange™ Admin Portal © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
