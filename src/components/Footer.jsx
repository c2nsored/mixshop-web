const Footer = () => {
    return (
        <footer style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '10px 0',
            borderTop: '1px solid #eee',
            textAlign: 'center',
            backgroundColor: 'rgba(253, 251, 247, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', fontSize: '0.8rem', color: '#888' }}>
                <span>© {new Date().getFullYear()} mixshop.jp. All rights reserved.</span>
                <span style={{ color: '#ddd' }}>|</span>
                <span>Nippori Textile Town</span>
            </div>
        </footer>
    );
};

export default Footer;
