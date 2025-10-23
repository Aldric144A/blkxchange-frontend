import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  useEffect(() => {
    setPasswordStrength({
      hasMinLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const isPasswordValid = () => {
    return (
      passwordStrength.hasMinLength &&
      passwordStrength.hasUppercase &&
      passwordStrength.hasLowercase &&
      passwordStrength.hasNumber &&
      passwordStrength.hasSymbol
    );
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordValid()) {
      setError('Password does not meet security requirements');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSuccess('Password reset successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C5A14E] mb-2">BlkXchange™</h1>
          <p className="text-white text-lg">Reset Your Password</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-8 border border-[#C5A14E]/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Create New Password
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
              {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-white text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A14E] transition-colors"
                  placeholder="Enter new password"
                  required
                  disabled={!token || loading}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-white text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A14E] transition-colors"
                  placeholder="Confirm new password"
                  required
                  disabled={!token || loading}
                />
              </div>

              <div className="bg-[#111111] rounded-lg p-4 space-y-2">
                <p className="text-white text-sm font-medium mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${passwordStrength.hasMinLength ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className={`text-xs ${passwordStrength.hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${passwordStrength.hasUppercase ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className={`text-xs ${passwordStrength.hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${passwordStrength.hasLowercase ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className={`text-xs ${passwordStrength.hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className={`text-xs ${passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                      One number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${passwordStrength.hasSymbol ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className={`text-xs ${passwordStrength.hasSymbol ? 'text-green-500' : 'text-gray-400'}`}>
                      One symbol (!@#$%^&*...)
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token || !isPasswordValid() || newPassword !== confirmPassword}
                className="w-full bg-[#C5A14E] text-black font-semibold py-3 rounded-lg hover:bg-[#E9D7A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/login')}
                  className="text-sm text-[#C5A14E] hover:text-[#E9D7A1] transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm">
            BlkXchange™ Admin Portal © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
