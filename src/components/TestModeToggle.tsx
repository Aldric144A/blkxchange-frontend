import { useState, useEffect } from 'react';
import { TestTube, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { getAdminHeaders } from '@/utils/auth'

interface TestModeToggleProps {
  onTestModeChange: (enabled: boolean) => void;
}

export function TestModeToggle({ onTestModeChange }: TestModeToggleProps) {
  const [testMode, setTestMode] = useState(false);
  const [testCounts, setTestCounts] = useState({ vendors: 0, professionals: 0, ads: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('test_mode_enabled');
    if (saved === 'true') {
      setTestMode(true);
      onTestModeChange(true);
    }
    loadTestCounts();
  }, []);

  const loadTestCounts = async () => {
    try {
      const headers = getAdminHeaders();
      const [vendorsRes, professionalsRes, adsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/test-mode/vendors`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/test-mode/professionals`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/test-mode/ads`, { headers })
      ]);

      if (vendorsRes.ok && professionalsRes.ok && adsRes.ok) {
        const vendors = await vendorsRes.json();
        const professionals = await professionalsRes.json();
        const ads = await adsRes.json();
        
        setTestCounts({
          vendors: vendors.length,
          professionals: professionals.length,
          ads: ads.length
        });
      }
    } catch (error) {
      console.error('Error loading test counts:', error);
    }
  };

  const toggleTestMode = () => {
    const newMode = !testMode;
    setTestMode(newMode);
    localStorage.setItem('test_mode_enabled', newMode.toString());
    onTestModeChange(newMode);
  };

  const purgeTestData = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL test data? This cannot be undone.')) {
      return;
    }

    try {
      const headers = getAdminHeaders();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/test-mode/purge`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Test data purged successfully!\n\nDeleted:\n- ${result.deleted.vendors} vendors\n- ${result.deleted.professionals} professionals\n- ${result.deleted.ads} ads`);
        setTestCounts({ vendors: 0, professionals: 0, ads: 0 });
      } else {
        throw new Error('Failed to purge test data');
      }
    } catch (error) {
      console.error('Error purging test data:', error);
      alert('❌ Failed to purge test data. Please try again.');
    }
  };

  const totalTestItems = testCounts.vendors + testCounts.professionals + testCounts.ads;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTestMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            testMode ? 'bg-[#C5A14E]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              testMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        
        <div className="flex items-center gap-2">
          <TestTube className={`w-5 h-5 ${testMode ? 'text-[#C5A14E]' : 'text-gray-500'}`} />
          <span className={`font-semibold ${testMode ? 'text-[#C5A14E]' : 'text-gray-700'}`}>
            Test Mode
          </span>
          {testMode && (
            <Badge className="bg-[#C5A14E] text-black">
              {totalTestItems} test items
            </Badge>
          )}
        </div>
      </div>

      {testMode && totalTestItems > 0 && (
        <Button
          onClick={purgeTestData}
          variant="outline"
          size="sm"
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Purge Test Data
        </Button>
      )}
    </div>
  );
}
