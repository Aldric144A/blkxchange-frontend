import { useState, useEffect, ReactNode } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminLogout } from './AdminLogout';
import { isAdminAuthenticated } from '@/utils/auth';

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = isAdminAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.reload(); // Reload to clear any cached data
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      {/* Logout button in top-right corner */}
      <div className="fixed top-4 right-4 z-40">
        <AdminLogout onLogout={handleLogout} />
      </div>
      {children}
    </div>
  );
}
