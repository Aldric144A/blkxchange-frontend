import { CheckCircle } from 'lucide-react';

interface VerificationBadgeProps {
  verified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function VerificationBadge({ verified, size = 'md', showTooltip = true }: VerificationBadgeProps) {
  if (!verified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="relative inline-flex items-center group">
      <div className="relative">
        {/* Gold circular background */}
        <div className={`${sizeClasses[size]} rounded-full bg-[#C5A14E] flex items-center justify-center`}>
          {/* White checkmark */}
          <CheckCircle className={`${sizeClasses[size]} text-white fill-[#C5A14E] stroke-white stroke-[3]`} />
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-brand-black text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
          Verified Black-Owned Business
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-brand-black"></div>
          </div>
        </div>
      )}
    </div>
  );
}
