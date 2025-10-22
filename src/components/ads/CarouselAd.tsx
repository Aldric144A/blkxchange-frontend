import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../api';

interface CarouselAdProps {
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

export const CarouselAd: React.FC<CarouselAdProps> = ({ page }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ads/${page}?placement=carousel`);
        const fetchedAds = await response.json();
        if (fetchedAds.length > 0) {
          setAds(fetchedAds);
          await fetch(`${API_BASE_URL}/api/ads/${fetchedAds[0].id}/impression`, { method: 'POST' });
        }
      } catch (error) {
        console.error('Error fetching carousel ads:', error);
      }
    };

    fetchAds();
  }, [page]);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % ads.length;
        if (ads[nextIndex]) {
          fetch(`${API_BASE_URL}/api/ads/${ads[nextIndex].id}/impression`, { method: 'POST' });
        }
        return nextIndex;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [ads]);

  const handleClick = async () => {
    const ad = ads[currentIndex];
    if (ad) {
      await fetch(`${API_BASE_URL}/api/ads/${ad.id}/click`, { method: 'POST' });
      if (ad.link_url) {
        window.open(ad.link_url, '_blank');
      }
    }
  };

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <div className="w-full bg-[#1A1A1A] border border-[#C5A14E] rounded-lg p-4 my-8">
      <div className="relative">
        <span className="absolute top-2 left-2 bg-[#C5A14E] text-black text-xs px-2 py-1 rounded font-semibold z-10">
          Sponsored
        </span>
        <button
          onClick={handleClick}
          className="w-full cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src={currentAd.asset_url}
            alt={`Ad by ${currentAd.advertiser_name}`}
            className="w-full h-48 object-cover rounded transition-opacity duration-500"
          />
        </button>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[#C5A14E] text-sm font-semibold">{currentAd.advertiser_name}</p>
          {ads.length > 1 && (
            <div className="flex gap-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-[#C5A14E]' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
