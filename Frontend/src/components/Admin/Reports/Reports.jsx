import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ApiRequest from '../../../Services/Axios/config';
import TitleAdmin from '../TitleAdmin/TitleAdmin';
import { getPosterUrl } from '../../../utils/posterUrl';
import './Reports.css';

export default function Reports() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        ApiRequest.get('/content/stats')
            .then(res => setStats(res.data))
            .catch(() => setError('خطا در دریافت آمار'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="reports-loading">در حال بارگذاری...</div>;
    if (error) return <div className="reports-error">{error}</div>;

    return (
        <Container className="reports-container" dir="rtl">
            <Row className="mt-3 mb-4">
                <TitleAdmin Title="گزارش‌ها و آمار :" />
            </Row>

            {/* stat cards */}
            <Row className="reports-cards g-3 mb-5">
                <Col xs={12} sm={4}>
                    <div className="reports-card reports-card--total">
                        <span className="reports-card__icon">🎬</span>
                        <div className="reports-card__num">{stats.totalCount}</div>
                        <div className="reports-card__label">کل محتوا</div>
                    </div>
                </Col>
                <Col xs={12} sm={4}>
                    <div className="reports-card reports-card--movies">
                        <span className="reports-card__icon">🎥</span>
                        <div className="reports-card__num">{stats.movieCount}</div>
                        <div className="reports-card__label">فیلم</div>
                    </div>
                </Col>
                <Col xs={12} sm={4}>
                    <div className="reports-card reports-card--series">
                        <span className="reports-card__icon">📺</span>
                        <div className="reports-card__num">{stats.seriesCount}</div>
                        <div className="reports-card__label">سریال</div>
                    </div>
                </Col>
            </Row>

            {/* progress bar */}
            {stats.totalCount > 0 && (
                <div className="reports-bar-section mb-5">
                    <div className="reports-bar-label">
                        <span>فیلم‌ها {Math.round((stats.movieCount / stats.totalCount) * 100)}%</span>
                        <span>سریال‌ها {Math.round((stats.seriesCount / stats.totalCount) * 100)}%</span>
                    </div>
                    <div className="reports-bar">
                        <div
                            className="reports-bar__fill reports-bar__fill--movies"
                            style={{ width: `${(stats.movieCount / stats.totalCount) * 100}%` }}
                        />
                        <div
                            className="reports-bar__fill reports-bar__fill--series"
                            style={{ width: `${(stats.seriesCount / stats.totalCount) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* top rated */}
            {stats.topRated && stats.topRated.length > 0 && (
                <div className="reports-top">
                    <h5 className="reports-top__title">برترین‌ها بر اساس امتیاز IMDB</h5>
                    <div className="reports-top__list">
                        {stats.topRated.map((item, i) => (
                            <div key={item._id} className="reports-top__item">
                                <span className="reports-top__rank">#{i + 1}</span>
                                <img
                                    src={getPosterUrl(item.poster)}
                                    alt={item.title}
                                    className="reports-top__poster"
                                />
                                <div className="reports-top__info">
                                    <div className="reports-top__name">{item.title}</div>
                                    <div className="reports-top__type">
                                        {item.type === 'movie' ? '🎥 فیلم' : '📺 سریال'}
                                    </div>
                                </div>
                                <div className="reports-top__rating">
                                    ⭐ {item.imdb?.rating?.toFixed(1) || '—'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Container>
    );
}
