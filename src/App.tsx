import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import Professionals from './pages/Professionals';
import Impact from './pages/Impact';
import About from './pages/About';
import VendorRegister from './pages/VendorRegister';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-ivory font-body">
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/about" element={<About />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
        </Routes>
        <footer className="bg-brand-black text-brand-ivory py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
