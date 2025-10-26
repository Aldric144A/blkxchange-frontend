import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Users, Heart, Info, TrendingUp, Newspaper, Briefcase, MessageCircle, Menu, X, Facebook, Instagram, Linkedin, Sparkles } from 'lucide-react';
import { api } from '../api';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      setShowNotificationDot(false);
      localStorage.setItem('lastMenuOpen', Date.now().toString());
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const fetchNewListingsCount = async () => {
      try {
        const data = await api.getNewListingsCount();
        
        const lastMenuOpen = localStorage.getItem('lastMenuOpen');
        const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
        
        if (data.total > 0 && (!lastMenuOpen || parseInt(lastMenuOpen) < sixHoursAgo)) {
          setShowNotificationDot(true);
        }
      } catch (error) {
        console.error('Failed to fetch new listings count:', error);
      }
    };

    fetchNewListingsCount();
    
    const interval = setInterval(fetchNewListingsCount, 6 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { to: '/professionals', icon: Users, label: 'Professionals' },
    { to: '/invest', icon: TrendingUp, label: 'Invest' },
    { to: '/community', icon: MessageCircle, label: 'Community' },
    { to: '/partner', icon: Briefcase, label: 'Partner' },
    { to: '/news', icon: Newspaper, label: 'News' },
    { to: '/impact', icon: Heart, label: 'Impact' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .notification-dot {
          animation: pulse 2s infinite;
        }
      `}</style>
      
      <nav className="bg-brand-black text-brand-ivory border-b border-brand-gold sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 z-50">
              <div className="text-2xl font-heading font-bold text-brand-gold">
                BlkXchange™
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link 
                  key={item.to}
                  to={item.to} 
                  className="flex items-center space-x-1 hover:text-brand-gold transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/blkxchange360" 
                className="px-4 py-2 bg-gradient-to-r from-[#00A86B] to-[#C5A14E] text-white font-bold rounded hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                BlkXchange 360
              </Link>
              <Link 
                to="/vendor-apply" 
                className="px-4 py-2 bg-brand-gold text-brand-black font-semibold rounded hover:bg-opacity-90 transition-colors"
              >
                Become a Vendor
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden z-50 p-2 rounded-lg hover:bg-brand-gold/10 transition-colors relative"
              aria-label="Toggle menu"
              title={showNotificationDot ? "New Black-owned businesses added this week!" : "Menu"}
            >
              {showNotificationDot && !mobileMenuOpen && (
                <span 
                  className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C5A14E] rounded-full notification-dot"
                  aria-label="New listings available"
                />
              )}
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-brand-gold" />
              ) : (
                <Menu className="w-6 h-6 text-brand-gold" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-brand-black to-[#013220] z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-6">
          <div className="flex-1 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-brand-gold/10 transition-colors group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
                <span className="text-lg font-medium text-white group-hover:text-brand-gold transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}

            <Link
              to="/blkxchange360"
              className="flex items-center justify-center px-4 py-3 mt-4 bg-gradient-to-r from-[#00A86B] to-[#C5A14E] text-white font-bold rounded-lg hover:scale-105 transition-transform gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="w-5 h-5" />
              BlkXchange 360
            </Link>

            <Link
              to="/vendor-apply"
              className="flex items-center justify-center px-4 py-3 mt-2 bg-brand-gold text-brand-black font-bold rounded-lg hover:bg-opacity-90 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Become a Vendor
            </Link>
          </div>

          <div className="border-t border-brand-gold/30 pt-6 mt-6">
            <div className="text-center mb-4">
              <p className="text-brand-gold font-heading text-lg font-bold mb-2">
                Join the Movement.
              </p>
              <p className="text-white text-sm mb-4">
                Build Wealth. Empower Community.
              </p>
              <Link
                to="/partner"
                className="inline-block px-6 py-2 bg-brand-gold text-brand-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Now
              </Link>
            </div>

            <div className="flex justify-center space-x-6 mt-6">
              <a
                href="https://facebook.com/blkxchange"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com/blkxchange"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/company/blkxchange"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
