import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Section from '../components/Section';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { t, t_data, language } = useLanguage();
    const { settings } = useSettings();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Hero Image Scroll Effect State
    const [showHeroImage, setShowHeroImage] = useState(false);
    const [heroImageDirection, setHeroImageDirection] = useState('down'); // 'down' (from top) or 'up' (from bottom)

    console.log('Home Rendered'); // Debug Log

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const fetchNews = async () => {
        try {
            const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(5));
            const querySnapshot = await getDocs(q);
            const news = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNewsList(news);
        } catch (error) {
            console.error("Error fetching news: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDeleteNews = async (id) => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await deleteDoc(doc(db, "news", id));
                fetchNews();
            } catch (err) {
                alert('실패: ' + err.message);
            }
        }
    };

    const handleEditNews = (newsItem) => {
        navigate('/admin', { state: { editMode: true, newsItem } });
    };

    const formatDays = (days) => {
        if (!Array.isArray(days)) return days;
        return days.join(', ');
    };

    const getClosedDays = (schedule) => {
        if (!Array.isArray(schedule)) return [];
        const openDays = new Set();
        schedule.forEach(item => {
            if (Array.isArray(item.days)) item.days.forEach(d => openDays.add(d));
            else if (item.day) openDays.add(item.day);
        });
        return DAYS.filter(d => !openDays.has(d));
    };

    const renderHours = () => {
        if (!settings || !settings.hours) return t('info_hours_value');

        if (settings.todayClosed) {
            return <div style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem', padding: '10px 0' }}>⛔ 금일 휴무 (Today Closed)</div>;
        }

        if (typeof settings.hours === 'string') return settings.hours;

        const { schedule, holidayClosed } = settings.hours;
        if (!schedule) return null; // Safe guard

        const closedDays = getClosedDays(schedule);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.isArray(schedule) && schedule.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555', whiteSpace: 'nowrap' }}>{formatDays(item.days || item.day)}</span>
                        <span>{item.time}</span>
                    </div>
                ))}

                {closedDays.length > 0 && (
                    <div style={{ marginTop: '5px' }}>
                        <span style={{ fontWeight: 'bold', color: '#888' }}>Closed: </span>
                        <span style={{ color: '#888' }}>{closedDays.join(', ')}</span>
                    </div>
                )}

                {holidayClosed && (
                    <div style={{ marginTop: '5px', color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {t('info_holiday_closed')}
                    </div>
                )}
            </div>
        );
    };

    const getDisplayAddress = () => {
        if (!settings) return t('info_loc_value');
        if (settings.addressObj) {
            const { zip, prefecture, city, street } = settings.addressObj;
            return `〒${zip} ${prefecture} ${city} ${t_data(street)}`;
        }
        return settings.address || t('info_loc_value');
    };

    // Custom Smooth Scroll Logic
    const containerRef = useRef(null);
    const isScrollingRef = useRef(false); // Ref for stability
    const currentSectionIndexRef = useRef(0);
    const showHeroImageRef = useRef(false);

    const smoothScrollTo = (target, duration) => {
        const start = containerRef.current.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        isScrollingRef.current = true;

        const easeInOutQuad = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutQuad(progress);

            if (containerRef.current) {
                containerRef.current.scrollTop = start + change * ease;
            }

            if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                isScrollingRef.current = false;
            }
        };

        requestAnimationFrame(animateScroll);
    };

    // Sync Section Index on Scroll (Handle Menu Links & Native Scroll)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return; // Wait for ref

        const handleScrollSpy = () => {
            if (isScrollingRef.current) return; // Don't sync while animating custom scroll

            const sections = ['hero', 'news', 'about', 'info'];
            const scrollPosition = container.scrollTop + window.innerHeight / 3;

            // Find current section
            for (let i = 0; i < sections.length; i++) {
                const element = document.getElementById(sections[i]);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    // Check overlap
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        if (currentSectionIndexRef.current !== i) {
                            currentSectionIndexRef.current = i;
                            // Reset Hero Image state if we leave Hero section (Index 0)
                            if (i !== 0 && showHeroImageRef.current) {
                                setShowHeroImage(false);
                                showHeroImageRef.current = false;
                            }
                        }
                        break;
                    }
                }
            }
        };

        container.addEventListener('scroll', handleScrollSpy);
        return () => container.removeEventListener('scroll', handleScrollSpy);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!isDesktop) return; // Skip for mobile

        const sections = ['hero', 'news', 'about', 'info']; // Sections in order

        const handleWheel = (e) => {
            if (isScrollingRef.current) {
                e.preventDefault();
                return;
            }

            // Allow small movements (trackpad inertia) but filter noise
            if (Math.abs(e.deltaY) < 10) return;

            e.preventDefault();

            let nextIndex = currentSectionIndexRef.current;
            const isHeroImage = showHeroImageRef.current;
            const direction = e.deltaY > 0 ? 'down' : 'up';

            if (direction === 'down') {
                if (nextIndex === 0 && !isHeroImage) {
                    // Hero -> Image
                    setHeroImageDirection('down');
                    setShowHeroImage(true);
                    showHeroImageRef.current = true;
                    // Trigger "scroll" animation lock, but stay at 0
                    smoothScrollTo(0, 1000);
                    return;
                }
                if (nextIndex === 0 && isHeroImage) {
                    // Image -> News
                    nextIndex = 1;
                } else if (nextIndex < sections.length - 1) {
                    nextIndex++;
                }
            } else {
                // Up
                if (nextIndex === 1) {
                    // News -> Image (Hero)
                    nextIndex = 0;
                    setHeroImageDirection('up'); // Moving UP into image
                    setShowHeroImage(true);
                    showHeroImageRef.current = true;
                } else if (nextIndex === 0 && isHeroImage) {
                    // Image -> Hero Text
                    setShowHeroImage(false);
                    showHeroImageRef.current = false;
                    smoothScrollTo(0, 1000);
                    return;
                } else if (nextIndex > 0) {
                    nextIndex--;
                }
            }

            if (nextIndex !== currentSectionIndexRef.current || (direction === 'up' && nextIndex === 0)) {

                // If we are moving to standard sections
                const targetSection = document.getElementById(sections[nextIndex]);
                if (targetSection) {
                    currentSectionIndexRef.current = nextIndex;
                    smoothScrollTo(targetSection.offsetTop, 1000);

                    // Ensure Image is OFF if we are not at 0 (safety)
                    if (nextIndex !== 0) {
                        setShowHeroImage(false);
                        showHeroImageRef.current = false;
                    }
                }
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        // NOTE: We do NOT remove this listener if we want it active. 
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    // Simplify Container Style - Remove CSS Snap if Desktop
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const containerStyle = {
        height: '100vh',
        overflowY: isDesktop ? 'hidden' : 'scroll', // Hide scroll on desktop to force wheel logic, allow native on mobile
        scrollSnapType: isDesktop ? 'none' : 'y mandatory', // Disable css snap on desktop
        scrollBehavior: 'auto' // We handle animation
    };



    return (
        <div ref={containerRef} className="no-scrollbar" style={containerStyle}>

            {/* Hero Section */}
            <SnapSection id="hero" bg="#fdfbf7">
                {/* Hero Image Overlay */}
                <AnimatePresence>
                    {showHeroImage && (
                        <motion.div
                            initial={{ y: heroImageDirection === 'down' ? '-100%' : 0 }} // Animate if coming down
                            animate={{ y: 0 }}       // Always settle to 0 (visible)
                            exit={{ y: '-100%' }}     // Slide back up when dismissed
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url('/assets/leather_hero.jpg')`, // Local Asset
                                backgroundColor: '#8B4513', // Fallback color
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                zIndex: 50, // Higher Z-Index
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >

                        </motion.div>
                    )}
                </AnimatePresence>

                <Section delay={0.2} style={{ position: 'relative', zIndex: 60 }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            fontFamily: 'serif',
                            color: showHeroImage ? '#fff' : 'var(--color-primary)',
                            marginBottom: '40px',
                            lineHeight: '1.1',
                            transition: 'color 1.2s ease-in-out',
                            textShadow: showHeroImage ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
                        }}>
                            {/* Dynamic Hero Title with Fallback */}
                            {settings?.heroContent?.heroText?.hero_title ? t_data(settings.heroContent.heroText.hero_title) : t('hero_title')}
                        </h1>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            color: showHeroImage ? '#f0f0f0' : '#555',
                            maxWidth: '700px',
                            margin: '0 auto',
                            lineHeight: '1.8',
                            whiteSpace: 'pre-line',
                            transition: 'color 1.2s ease-in-out',
                            textShadow: showHeroImage ? '0 1px 5px rgba(0,0,0,0.5)' : 'none'
                        }}>
                            {/* Dynamic Hero Subtitle with Fallback */}
                            {settings?.heroContent?.heroText?.hero_subtitle ? t_data(settings.heroContent.heroText.hero_subtitle) : t('hero_subtitle')}
                        </p>
                    </div>
                </Section>
            </SnapSection>

            {/* News Section */}
            <SnapSection id="news">
                <Section>
                    <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', color: 'var(--color-primary)', fontFamily: 'serif' }}>
                        {t('news_title')}
                    </h2>

                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#999' }}>Loading...</p>
                    ) : newsList.length > 0 ? (
                        <div style={{ display: 'grid', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
                            {newsList.map((item, index) => (
                                <motion.article
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                                    transition={{ duration: 0.3 }}
                                    style={{ display: 'flex', gap: '20px', alignItems: 'start', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}
                                >
                                    {/* Admin Actions */}
                                    {user && (
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px', zIndex: 10 }}>
                                            <button onClick={() => handleEditNews(item)} style={{ cursor: 'pointer', border: 'none', background: 'none' }}><Edit size={18} color="#666" /></button>
                                            <button onClick={() => handleDeleteNews(item.id)} style={{ cursor: 'pointer', border: 'none', background: 'none' }}><Trash2 size={18} color="#d33" /></button>
                                        </div>
                                    )}

                                    {item.imageUrl && (
                                        <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={item.imageUrl} alt={t_data(item.title)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', backgroundColor: 'var(--color-accent)', padding: '2px 8px', borderRadius: '4px' }}>NEW</span>
                                            <time style={{ fontSize: '0.85rem', color: '#888' }}>
                                                {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : ''}
                                            </time>
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '5px', color: 'var(--color-text)' }}>{t_data(item.title)}</h3>
                                        <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{t_data(item.content)}</p>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999' }}>{t('news_empty')}</p>
                    )}
                </Section>
            </SnapSection>

            {/* About Section */}
            <SnapSection id="about" bg="#f5f5f5">
                <Section>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        <div style={{
                            height: '400px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <img
                                src={settings?.heroContent?.aboutImage || "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?q=80&w=1760&auto=format&fit=crop"}
                                alt="Leather Workshop"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3rem', marginBottom: '30px', color: 'var(--color-secondary)', fontFamily: 'serif' }}>
                                {settings?.heroContent?.heroText?.about_title ? t_data(settings.heroContent.heroText.about_title) : t('about_title')}
                            </h2>
                            <p style={{ marginBottom: '20px', lineHeight: '1.8', fontSize: '1.1rem', color: '#444', whiteSpace: 'pre-line' }}>
                                {settings?.heroContent?.heroText?.about_desc1 ? t_data(settings.heroContent.heroText.about_desc1) : t('about_desc1')}
                            </p>
                            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#444', whiteSpace: 'pre-line' }}>
                                {settings?.heroContent?.heroText?.about_desc2 ? t_data(settings.heroContent.heroText.about_desc2) : t('about_desc2')}
                            </p>
                        </div>
                    </div>
                </Section>
            </SnapSection>

            {/* Info Section */}
            <SnapSection id="info">
                <Section style={{ width: '100%' }}>
                    <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '50px', color: 'var(--color-primary)', fontFamily: 'serif' }}>
                        {t('info_title')}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px', alignItems: 'start' }}>

                        {/* Info Text */}
                        <div style={{ padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '16px' }}>
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ fontSize: '1.3rem', marginBottom: '15px', color: 'var(--color-primary)', borderBottom: '2px solid #ddd', paddingBottom: '10px', display: 'inline-block' }}>{t('info_hours_label')}</h4>
                                <div style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                    {renderHours()}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.3rem', marginBottom: '15px', color: 'var(--color-primary)', borderBottom: '2px solid #ddd', paddingBottom: '10px', display: 'inline-block' }}>{t('info_loc_label')}</h4>
                                <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{getDisplayAddress()}</p>

                                <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
                                    📞 {settings && settings.phone ? settings.phone : '03-1234-5678'} <br />
                                    ✉️ {settings && settings.email ? settings.email : 'contact@mixshop.jp'}
                                </div>
                            </div>
                        </div>


                        {/* Google Map */}
                        <div style={{ height: '450px', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                            <iframe
                                src={
                                    language === 'KR' ? "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3238.905498011845!2d139.7765411!3d35.7285426!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188f79f92396e5%3A0xa7eade27bbf89907!2z44Of44OD44Kv44K5!5e0!3m2!1sko!2sjp!4v1765619092238!5m2!1sko!2sjp" :
                                        language === 'EN' ? "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3238.905498011845!2d139.7765411!3d35.7285426!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188f79f92396e5%3A0xa7eade27bbf89907!2smix%20plus%20(1F)%20%26%20mix%20(2F)!5e0!3m2!1sen!2sjp!4v1765619112607!5m2!1sen!2sjp" :
                                            "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3238.905498011845!2d139.7765411!3d35.7285426!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188f79f92396e5%3A0xa7eade27bbf89907!2smix%20plus%20(1F)%20%26%20mix%20(2F)!5e0!3m2!1sja!2sjp!4v1765619078468!5m2!1sja!2sjp"
                                }
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Map Mix"
                            ></iframe>
                        </div>

                    </div>
                </Section>
            </SnapSection>

            {/* Footer is now sticky, so we just render it or let it float. 
                However, since it's fixed, we don't need a section for it blocking scroll.
                We might need padding for the last section so content doesn't get hidden behind footer.
            */}
            <Footer />

        </div>
    );
};

const SnapSection = ({ id, children, bg = 'white' }) => (
    <section id={id} style={{
        height: '100vh', // Enforce strict viewport height
        width: '100%',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: '80px', // Header offset
        paddingBottom: '50px', // Footer offset
        boxSizing: 'border-box', // Include padding in height
        overflow: 'hidden' // strict clipping
    }}>
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {children}
        </div>
    </section>
);

export default Home;
