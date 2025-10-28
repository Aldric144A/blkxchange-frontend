import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import Professionals from './pages/Professionals';
import Impact from './pages/Impact';
import About from './pages/About';
import VendorRegister from './pages/VendorRegister';
import VendorApply from './pages/VendorApply';
import VendorAgreement from './pages/VendorAgreement';
import VendorDashboard from './pages/VendorDashboard';
import PWAInstallPrompt from './components/PWAInstallPrompt';

const Admin360Dashboard = lazy(() => import('./pages/admin360/Dashboard'));
const Admin360Vendors = lazy(() => import('./pages/admin360/Vendors'));
const Admin360Products = lazy(() => import('./pages/admin360/Products'));
const DemoInvestor = lazy(() => import('./pages/demo/Investor'));

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-brand-ivory font-body">
        <PWAInstallPrompt />
        <Routes>
          <Route path="/" element={<><Navigation /><Landing /></>} />
          <Route path="/marketplace" element={<><Navigation /><Marketplace /></>} />
          <Route path="/professionals" element={<><Navigation /><Professionals /></>} />
          <Route path="/impact" element={<><Navigation /><Impact /></>} />
          <Route path="/about" element={<><Navigation /><About /></>} />
          <Route path="/vendor/register" element={<><Navigation /><VendorRegister /></>} />
          <Route path="/vendor-apply" element={<><Navigation /><VendorApply /></>} />
          <Route path="/vendor-agreement" element={<><Navigation /><VendorAgreement /></>} />
          <Route path="/vendor-dashboard" element={<><Navigation /><VendorDashboard /></>} />
          
          <Route path="/admin360" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Admin360Dashboard />
            </Suspense>
          } />
          <Route path="/admin360/vendors" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Admin360Vendors />
            </Suspense>
          } />
          <Route path="/admin360/products" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Admin360Products />
            </Suspense>
          } />
          
          <Route path="/demo/investor" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <DemoInvestor />
            </Suspense>
          } />
          
          <Route path="/admin" element={<Navigate to="/admin360" replace />} />
          <Route path="/admin/vendors" element={<Navigate to="/admin360/vendors" replace />} />
          <Route path="/admin/products" element={<Navigate to="/admin360/products" replace />} />
        </Routes>
        
        <Routes>
          <Route path="/admin360/*" element={null} />
          <Route path="/demo/*" element={null} />
          <Route path="*" element={
            <footer className="bg-brand-black text-brand-ivory py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-400">
                  © 2025 BlkXchange™. All rights reserved. Empower. Exchange. Elevate.
                </p>
              </div>
            </footer>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
