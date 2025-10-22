import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../api';

interface SidebarAdProps {
  page: string;
}

interface Ad {
  id: string;
  creative_id: string;
  advertiser_name: string;
  asset_url: string;
  link_url?: string;
  ad_type: string;
  placement: string;
  price_tier: string;
}

export const SidebarAd: React.FC<SidebarAdProps> = ({ page }) => {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ads/${page}?placement=sidebar`);
        const ads = await response.json();
        if (ads.length > 0) {
          setAd(ads[0]);
          await fetch(`${API_BASE_URL}/api/ads/${ads[0].id}/impression`, { method: 'POST' });
        }
      } catch (error) {
        console.error('Error fetching sidebar ad:', error);
      }
    };

    fetchAd();
  }, [page]);

  const handleClick = async () => {
    if (ad) {
      await fetch(`${API_BASE_URL}/api/ads/${ad.id}/click`, { method: 'POST' });
      if (ad.link_url) {
        window.open(ad.link_url, '_blank');
      }
    }
  };

  if (!ad) return null;

  return (
    <div className="w-full bg-[#1A1A1A] border border-[#C5A14E] rounded-lg p-4 sticky top-4">
      <div className="relative">
        <span className="absolute top-2 left-2 bg-[#C5A14E] text-black text-xs px-2 py-1 rounded font-semibold z-10">
          Partner Ad
        </span>
        <button
          onClick={handleClick}
          className="w-full cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src={ad.asset_url}
            alt={`Ad by ${ad.advertiser_name}`}
            className="w-full h-64 object-cover rounded"
          />
        </button>
        <div className="mt-3 text-center">
          <p className="text-[#C5A14E] text-sm font-semibold">{ad.advertiser_name}</p>
        </div>
      </div>
    </div>
  );
};
