import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ onOpenShop }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const { t } = useLanguage();
    const { settings } = useSettings();
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Scroll Spy Logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['hero', 'news', 'about', 'info'];
            let current = '';

            for (let section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if top of section is within viewport (or close to it)
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = section;
                    }
                }
            }
            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    const handleShopClick = () => {
        onOpenShop();
        setIsOpen(false);
    };

    const getNavStyle = (id) => ({
        background: 'none',
        fontSize: '1rem',
        color: activeSection === id ? 'var(--color-primary)' : 'var(--color-text)',
        cursor: 'pointer',
        fontWeight: activeSection === id ? 'bold' : 'normal',
        transition: 'color 0.3s'
    });

    return (
        <header className="header" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, backgroundColor: 'rgba(253, 251, 247, 0.95)', backdropFilter: 'blur(10px)', padding: '15px 0', borderBottom: '1px solid #eee' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="MixShop" style={{ height: '40px', objectFit: 'contain' }} />
                    ) : (
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'serif', color: 'var(--color-primary)' }}>mix</span>
                    )}
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav" style={{ display: 'none', gap: '25px', alignItems: 'center' }}>
                    <button onClick={() => scrollToSection('hero')} style={getNavStyle('hero')}>
                        {t('nav_home')}
                    </button>
                    <button onClick={handleShopClick} style={{ ...getNavStyle('shop'), color: 'var(--color-text)', fontWeight: 'normal' }}>
                        {t('nav_shop')}
                    </button>
                    <button onClick={() => scrollToSection('news')} style={getNavStyle('news')}>
                        {t('nav_news')}
                    </button>
                    <button onClick={() => scrollToSection('about')} style={getNavStyle('about')}>
                        About
                    </button>
                    <Link to="/admin" style={{ fontSize: '1rem', textDecoration: 'none', color: 'var(--color-text)' }}>
                        {t('nav_admin')}
                    </Link>

                    <LanguageSwitcher />
                </nav>

                {/* Mobile Menu Button - Moved right side logic */}
                <div className="mobile-menu-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="mobile-lang-switcher">
                        <LanguageSwitcher />
                    </div>
                    <button className="mobile-menu-btn" onClick={toggleMenu} style={{ background: 'none', fontSize: '1.5rem', display: 'flex' }}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    height: '100vh',
                    background: 'var(--color-bg)',
                    zIndex: 99,
                    padding: '40px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                    alignItems: 'center'
                }}>
                    <button onClick={() => scrollToSection('hero')} style={{ background: 'none', fontSize: '1.5rem', color: activeSection === 'hero' ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {t('nav_home')}
                    </button>
                    <button onClick={handleShopClick} style={{ background: 'none', fontSize: '1.5rem', color: 'var(--color-text)' }}>
                        {t('nav_shop')}
                    </button>
                    <button onClick={() => scrollToSection('news')} style={{ background: 'none', fontSize: '1.5rem', color: activeSection === 'news' ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {t('nav_news')}
                    </button>
                    <button onClick={() => scrollToSection('about')} style={{ background: 'none', fontSize: '1.5rem', color: activeSection === 'about' ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        About
                    </button>
                    <Link to="/admin" onClick={() => setIsOpen(false)} style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--color-text)' }}>
                        {t('nav_admin')}
                    </Link>
                </div>
            )}

            <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-wrapper { display: none !important; }
        }
        @media (max-width: 767px) {
            .mobile-lang-switcher { display: block; }
        }
      `}</style>
        </header>
    );
};

export default Header;
