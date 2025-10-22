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
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ads/${page}?placement=spotlight`);
        const fetchedAds = await response.json();
        if (fetchedAds.length > 0) {
          setAds(fetchedAds);
          await fetch(`${API_BASE_URL}/api/ads/${fetchedAds[0].id}/impression`, { method: 'POST' });
        }
      } catch (error) {
        console.error('Error fetching spotlight ad:', error);
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
    }, 5000);

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
    <div className="w-full max-w-7xl mx-auto px-4 mb-4">
      <div className="relative">
        <span className="absolute top-2 left-2 text-xs bg-[#C5A14E] text-black px-2 py-1 rounded z-10">
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
            className="object-contain w-full h-[150px] rounded-lg shadow-md bg-black/20 border border-[#C5A14E]"
          />
        </button>
      </div>
    </div>
  );
};
