import { Crown, Star } from 'lucide-react';

interface MembershipBadgeProps {
  tier: 'basic' | 'featured' | 'elite';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function MembershipBadge({ tier, size = 'md', showLabel = true }: MembershipBadgeProps) {
  if (tier === 'basic') return null;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base'
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20
  };

  if (tier === 'elite') {
    return (
      <div className="inline-flex items-center gap-1 bg-gradient-to-r from-[#C5A14E] to-[#E9D7A1] text-brand-black px-2 py-1 rounded-full">
        <Crown className={sizeClasses[size]} size={iconSize[size]} />
        {showLabel && <span className={`font-semibold ${sizeClasses[size]}`}>ELITE</span>}
      </div>
    );
  }

  if (tier === 'featured') {
    return (
      <div className="inline-flex items-center gap-1 bg-[#C5A14E] text-white px-2 py-1 rounded-full">
        <Star className={sizeClasses[size]} size={iconSize[size]} />
        {showLabel && <span className={`font-semibold ${sizeClasses[size]}`}>FEATURED</span>}
      </div>
    );
  }

  return null;
}
