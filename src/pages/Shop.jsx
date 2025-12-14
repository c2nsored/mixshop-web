import { ExternalLink, ShoppingBag } from 'lucide-react';

const Shop = () => {
    const shops = [
        { name: 'Mercari', url: 'https://jp.mercari.com/', desc: '다양한 핸드메이드 소재와 빈티지 아이템' },
        { name: 'Creema', url: 'https://www.creema.jp/', desc: '작가의 정성이 담긴 핸드메이드 작품' },
        { name: 'Minne', url: 'https://minne.com/', desc: '일본 최대의 핸드메이드 마켓' },
    ];

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '60px', color: 'var(--color-primary)' }}>Online Shop</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                {shops.map((shop) => (
                    <a
                        key={shop.name}
                        href={shop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'block',
                            padding: '40px',
                            border: '1px solid #ddd',
                            borderRadius: '12px',
                            textAlign: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            backgroundColor: 'white'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <ShoppingBag size={48} color="var(--color-secondary)" style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{shop.name}</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>{shop.desc}</p>
                        <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                            Visit Store <ExternalLink size={16} style={{ marginLeft: '5px' }} />
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Shop;
