import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const { settings } = useSettings();

    // If settings are not loaded or multilingual is disabled, do not render
    if (!settings || !settings.enableMultiLang) return null;

    const btnStyle = (lang) => ({
        padding: '4px 8px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        color: language === lang ? 'white' : 'var(--color-text)',
        backgroundColor: language === lang ? 'var(--color-primary)' : 'transparent',
        borderRadius: '4px',
        fontWeight: 'bold',
        transition: 'all 0.2s',
    });

    return (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: '20px' }}>
            <button style={btnStyle('JP')} onClick={() => setLanguage('JP')}>JP</button>
            <span style={{ color: '#ddd' }}>|</span>
            <button style={btnStyle('KR')} onClick={() => setLanguage('KR')}>KR</button>
            <span style={{ color: '#ddd' }}>|</span>
            <button style={btnStyle('EN')} onClick={() => setLanguage('EN')}>EN</button>
        </div>
    );
};

export default LanguageSwitcher;
