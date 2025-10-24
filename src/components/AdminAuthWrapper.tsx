import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTopNav } from './AdminTopNav';
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A14E] mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <AdminTopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
