import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Heart, Info } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-brand-black text-brand-ivory border-b border-brand-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-heading font-bold text-brand-gold">
              BlkXchange™
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/marketplace" 
              className="flex items-center space-x-1 hover:text-brand-gold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </Link>
            <Link 
              to="/professionals" 
              className="flex items-center space-x-1 hover:text-brand-gold transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Professionals</span>
            </Link>
            <Link 
              to="/impact" 
              className="flex items-center space-x-1 hover:text-brand-gold transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Impact</span>
            </Link>
            <Link 
              to="/about" 
              className="flex items-center space-x-1 hover:text-brand-gold transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/vendor-apply" 
              className="px-4 py-2 bg-brand-gold text-brand-black font-semibold rounded hover:bg-opacity-90 transition-colors"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
