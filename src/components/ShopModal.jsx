import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ShopModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    const shops = [
        { name: 'Mercari', url: 'https://jp.mercari.com/', desc: 'Vintage & Materials', color: '#EA3932' },
        { name: 'Creema', url: 'https://www.creema.jp/', desc: 'Handmade Market', color: '#F68F2E' },
        { name: 'Minne', url: 'https://minne.com/', desc: 'Japan No.1 DIY', color: '#D97559' },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{
                        position: 'relative',
                        width: '90%',
                        maxWidth: '500px',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '40px',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none' }}>
                        <X size={24} color="#999" />
                    </button>

                    <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--color-primary)', fontFamily: 'serif' }}>
                        {t('shop_modal_title')}
                    </h2>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        {shops.map((shop) => (
                            <motion.a
                                key={shop.name}
                                href={shop.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '20px',
                                    border: '1px solid #eee',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: 'var(--color-text)',
                                    backgroundColor: '#fafafa'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: shop.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ShoppingBag size={24} color={shop.color} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{shop.name}</h3>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>{shop.desc}</p>
                                    </div>
                                </div>
                                <ExternalLink size={20} color="#ccc" />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ShopModal;
