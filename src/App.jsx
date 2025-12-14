import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ShopModal from './components/ShopModal';

function App() {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <LanguageProvider>
      <SettingsProvider>
        <Router>
          <div className="app-container">
            <Header onOpenShop={() => setIsShopOpen(true)} />

            <main style={{ minHeight: '80vh' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                {/* Redirect old routes to Home */}
                <Route path="/shop" element={<Home />} />
                <Route path="/news" element={<Home />} />
              </Routes>
            </main>


            <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
          </div>
        </Router>
      </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;
