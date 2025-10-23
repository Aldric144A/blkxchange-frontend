import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAdminAuth } from '@/utils/auth';

interface AdminLogoutProps {
  onLogout: () => void;
}

export function AdminLogout({ onLogout }: AdminLogoutProps) {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      clearAdminAuth();
      onLogout();
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="border-red-500 text-red-600 hover:bg-red-50"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
