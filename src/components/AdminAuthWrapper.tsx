import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLogout } from './AdminLogout';
import { isAdminAuthenticated } from '@/utils/auth';

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = isAdminAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);

    if (!authenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/admin/login');
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
    return null; // Will redirect to login
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
