import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../api';

interface SpotlightAdProps {
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

export const SpotlightAd: React.FC<SpotlightAdProps> = ({ page }) => {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ads/${page}?placement=spotlight`);
        const ads = await response.json();
        if (ads.length > 0) {
          setAd(ads[0]);
          await fetch(`${API_BASE_URL}/api/ads/${ads[0].id}/impression`, { method: 'POST' });
        }
      } catch (error) {
        console.error('Error fetching spotlight ad:', error);
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
    <div className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] border-2 border-[#C5A14E] rounded-lg p-6 my-8 shadow-lg">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-[#C5A14E] text-black text-sm px-3 py-1 rounded font-bold">
            ⭐ Featured Partner
          </span>
          <span className="text-[#C5A14E] text-xs font-semibold uppercase tracking-wider">
            {ad.price_tier}
          </span>
        </div>
        <button
          onClick={handleClick}
          className="w-full cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
        >
          <img
            src={ad.asset_url}
            alt={`Ad by ${ad.advertiser_name}`}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </button>
        <div className="mt-4 text-center">
          <p className="text-[#C5A14E] text-lg font-bold">{ad.advertiser_name}</p>
          <p className="text-gray-400 text-sm mt-1">Premium Advertising Partner</p>
        </div>
      </div>
    </div>
  );
};
