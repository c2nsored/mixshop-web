import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const news = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNewsList(news);
            } catch (error) {
                console.error("Error fetching news: ", error);
                // Fallback for demo when no key is set or no data
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ marginBottom: '40px', color: 'var(--color-primary)' }}>News</h1>

            {loading ? (
                <p style={{ textAlign: 'center', color: '#999' }}>Loading...</p>
            ) : newsList.length > 0 ? (
                <div style={{ display: 'grid', gap: '30px' }}>
                    {newsList.map((item) => (
                        <article key={item.id} style={{ padding: '30px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: 'white' }}>
                            <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px' }}>
                                {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--color-text)' }}>{item.title}</h2>
                            <p style={{ lineHeight: '1.7', whiteSpace: 'pre-line' }}>{item.content}</p>
                        </article>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '10px' }}>등록된 뉴스가 아직 없습니다.</p>
                    <p style={{ fontSize: '0.9rem', color: '#999' }}>관리자 페이지에서 소식을 등록해주세요.</p>
                </div>
            )}
        </div>
    );
};
export default News;
