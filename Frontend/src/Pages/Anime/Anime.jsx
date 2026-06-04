import React, { useEffect, useState } from 'react';
import Footer from '../../components/Layout/Footer/Footer';
import MovieCard from '../../components/UI/MovieCard/MovieCard';
import ApiRequest from '../../Services/Axios/config';
import '../About/About.css';
import './Anime.css';

export default function Anime() {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const [movies, series] = await Promise.all([
                    ApiRequest.get('/content/movieList'),
                    ApiRequest.get('/content/seriesList'),
                ]);
                const all = [
                    ...(Array.isArray(movies.data) ? movies.data : []),
                    ...(Array.isArray(series.data) ? series.data : []),
                ];
                // فیلتر انیمه‌ها بر اساس ژانر یا نوع
                const anime = all.filter(item =>
                    item.type === 'anime' ||
                    (item.genres && item.genres.some(g =>
                        g.toLowerCase().includes('anime') ||
                        g.includes('انیمه') ||
                        g.includes('انیمیشن')
                    ))
                );
                setAnimeList(anime);
            } catch {
                setAnimeList([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAnime();
    }, []);

    return (
        <div className="static-page">
            <div className="anime-hero">
                <div className="container">
                    <h1>⛩️ انیمه</h1>
                    <p>بهترین انیمه‌های ژاپنی و آسیایی</p>
                </div>
            </div>
            <div className="static-page__content container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.5)' }}>
                        <div className="loading-spinner-sm"></div>
                        <p style={{ marginTop: 16 }}>در حال بارگذاری...</p>
                    </div>
                ) : animeList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <span style={{ fontSize: 64 }}>⛩️</span>
                        <h2 style={{ marginTop: 20, color: 'rgba(255,255,255,0.7)' }}>انیمه‌ای یافت نشد</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                            به زودی انیمه‌های جدید اضافه خواهند شد
                        </p>
                    </div>
                ) : (
                    <div className="anime-grid">
                        {animeList.map(item => (
                            <MovieCard
                                key={item._id}
                                id={item._id}
                                slug={item.slug}
                                poster={item.poster}
                                name={item.title || item.name}
                                year={item.year}
                                rate={item.imdb?.rating || item.rate}
                                genre={item.genres || item.genre}
                                description={item.description}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
