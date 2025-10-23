import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AdminAuthWrapper } from './components/AdminAuthWrapper';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import Professionals from './pages/Professionals';
import Impact from './pages/Impact';
import About from './pages/About';
import Invest from './pages/Invest';
import VendorRegister from './pages/VendorRegister';
import VendorApply from './pages/VendorApply';
import VendorAgreement from './pages/VendorAgreement';
import VendorDashboard from './pages/VendorDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminResetPassword from './pages/AdminResetPassword';
import AdminVendors from './pages/AdminVendors';
import AdminProducts from './pages/AdminProducts';
import AdminAds from './pages/AdminAds';
import AdminPendingProfessionals from './pages/AdminPendingProfessionals';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import NewsAll from './pages/NewsAll';
import SubmitStory from './pages/SubmitStory';
import Partner from './pages/Partner';
import VendorPartner from './pages/VendorPartner';
import Cultural from './pages/Cultural';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-ivory font-body">
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/about" element={<About />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/vendor-apply" element={<VendorApply />} />
          <Route path="/vendor-agreement" element={<VendorAgreement />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin/vendors" element={<AdminAuthWrapper><AdminVendors /></AdminAuthWrapper>} />
          <Route path="/admin/products" element={<AdminAuthWrapper><AdminProducts /></AdminAuthWrapper>} />
          <Route path="/admin/ads" element={<AdminAuthWrapper><AdminAds /></AdminAuthWrapper>} />
          <Route path="/admin/pending-professionals" element={<AdminAuthWrapper><AdminPendingProfessionals /></AdminAuthWrapper>} />
          <Route path="/news" element={<News />} />
          <Route path="/news/all" element={<NewsAll />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/submit-story" element={<SubmitStory />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/vendor-partner" element={<VendorPartner />} />
          <Route path="/cultural" element={<Cultural />} />
        </Routes>
        <footer className="bg-brand-black text-brand-ivory py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="border-t border-gray-700 pt-6 mb-6">
              <p className="text-sm text-gray-400 leading-relaxed max-w-4xl mx-auto">
                BlkXchange™ operates on a 15% community-centered revenue model:<br />
                85% goes directly to our vendors, 12% sustains platform operations, and 3% supports HBCUs, scholarships, and nonprofit partners.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Opportunities</h3>
              <Link to="/partner" className="text-brand-gold hover:text-opacity-80 text-sm transition-colors">
                Partner With Us
              </Link>
            </div>
            <p className="text-gray-400">
              © 2025 BlkXchange™. All rights reserved. Empower. Exchange. Elevate.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
