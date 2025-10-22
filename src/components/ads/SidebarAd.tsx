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
  tagline?: string;
}

export const SidebarAd: React.FC<SidebarAdProps> = ({ page }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ads/${page}?placement=sidebar`);
        const fetchedAds = await response.json();
        if (fetchedAds.length > 0) {
          setAds(fetchedAds);
          await fetch(`${API_BASE_URL}/api/ads/${fetchedAds[0].id}/impression`, { method: 'POST' });
        }
      } catch (error) {
        console.error('Error fetching sidebar ad:', error);
      }
    };

    fetchAds();
  }, [page]);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
        setFade(true);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const handleClick = async () => {
    const currentAd = ads[currentIndex];
    if (currentAd) {
      await fetch(`${API_BASE_URL}/api/ads/${currentAd.id}/click`, { method: 'POST' });
      if (currentAd.link_url) {
        window.open(currentAd.link_url, '_blank');
      }
    }
  };

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <div className="w-[280px] bg-[#111111] border border-[#C5A14E] rounded-xl p-3 shadow-md sticky top-4">
      <div className="relative">
        <span className="text-xs bg-[#C5A14E] text-black px-2 py-1 rounded mb-2 inline-block">
          Sponsored
        </span>
        <button
          onClick={handleClick}
          className={`w-full cursor-pointer hover:opacity-90 transition-all duration-300 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={currentAd.asset_url}
            alt={`Ad by ${currentAd.advertiser_name}`}
            className="object-contain w-full h-[180px] rounded-md bg-black/20"
          />
        </button>
        <div className="mt-2">
          <h4 className="text-sm font-semibold text-white">{currentAd.advertiser_name}</h4>
          {currentAd.tagline && (
            <p className="text-xs text-gray-300 mt-1">{currentAd.tagline}</p>
          )}
        </div>
      </div>
    </div>
  );
};
