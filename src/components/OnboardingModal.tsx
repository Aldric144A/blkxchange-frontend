import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to BlkXchange 360™',
      description: 'Your comprehensive platform for community, commerce, and cultural empowerment.',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Connect with like-minded entrepreneurs',
        'Access exclusive resources and opportunities',
        'Build generational wealth together',
      ],
    },
    {
      title: 'Community Hub',
      description: 'Engage with a vibrant community through forums, events, and private groups.',
      image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Public community feed with featured content',
        'Events calendar with RSVP functionality',
        'Private groups for focused discussions',
      ],
    },
    {
      title: 'BlkXchange Wallet',
      description: 'Earn and redeem BlkPoints for purchases, referrals, and community engagement.',
      image: 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Earn points for every purchase and activity',
        'Redeem points for discounts and rewards',
        'Track your transaction history',
      ],
    },
    {
      title: 'Community Fund & DAO',
      description: 'Participate in transparent fund allocation and community governance.',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        '85% vendor support, 12% operations, 3% HBCUs',
        'Vote on proposals and platform decisions',
        'Track community impact in real-time',
      ],
    },
    {
      title: 'History Window',
      description: 'Explore and preserve the rich legacy of Black excellence and innovation.',
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Interactive timeline of Black history',
        'Search and filter by era and category',
        'Import and export historical entries',
      ],
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('blkxchange360_onboarding_completed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl max-w-4xl w-full border-2 border-emerald-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 px-6 py-4 flex items-center justify-between border-b border-emerald-700">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
            BlkXchange 360™ Tour
          </h2>
          <button
            onClick={handleComplete}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="rounded-xl overflow-hidden border-2 border-gray-700">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">{slide.title}</h3>
                <p className="text-gray-300 text-lg mb-6">{slide.description}</p>
                <div className="space-y-3">
                  {slide.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-emerald-500 w-8'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-8 py-4 flex items-center justify-between border-t border-gray-800">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              currentSlide === 0
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <span className="text-gray-400">
            {currentSlide + 1} of {slides.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
