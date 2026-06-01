import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../../../Services/Axios/config';
import { getPosterUrl } from '../../../utils/posterUrl';
import './SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.length < 2) { setResults([]); return; }
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await ApiRequest.get(`/content/search?q=${encodeURIComponent(query)}`);
                setResults(Array.isArray(res.data) ? res.data.slice(0, 8) : []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (item) => {
        onClose();
        navigate(`/movie/${item.slug || item._id}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-overlay__box" onClick={e => e.stopPropagation()}>
                <div className="search-overlay__input-wrap">
                    <svg className="search-overlay__icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input
                        ref={inputRef}
                        className="search-overlay__input"
                        type="text"
                        placeholder="جستجوی فیلم یا سریال..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        dir="rtl"
                    />
                    <button className="search-overlay__close" onClick={onClose} aria-label="بستن">✕</button>
                </div>

                {loading && <div className="search-overlay__status">در حال جستجو...</div>}

                {!loading && query.length >= 2 && results.length === 0 && (
                    <div className="search-overlay__status">نتیجه‌ای یافت نشد</div>
                )}

                {results.length > 0 && (
                    <ul className="search-overlay__results">
                        {results.map(item => (
                            <li key={item._id} className="search-overlay__item" onClick={() => handleSelect(item)}>
                                <img
                                    src={getPosterUrl(item.poster)}
                                    alt={item.title}
                                    className="search-overlay__poster"
                                />
                                <div className="search-overlay__info">
                                    <span className="search-overlay__title">{item.title}</span>
                                    <span className="search-overlay__meta">
                                        {item.type === 'movie' ? 'فیلم' : 'سریال'}
                                        {item.year ? ` · ${item.year}` : ''}
                                        {item.imdb?.rating ? ` · ⭐ ${item.imdb.rating}` : ''}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;
