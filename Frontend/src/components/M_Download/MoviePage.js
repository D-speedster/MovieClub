import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../Layout/Footer/Footer';
import ApiRequest from '../../Services/Axios/config';
import Logger from '../../utils/logger';
import { getPosterUrl } from '../../utils/posterUrl';
import './MoviePage.css';

const MoviePage = () => {
  const { userId } = useParams();
  const [movieData, setMovieData]       = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // ── نظرات ────────────────────────────────────────────────────
  const [comments, setComments]         = useState([]);
  const [commentText, setCommentText]   = useState('');
  const [commentRating, setCommentRating] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');

  // ── دریافت داده‌های فیلم ─────────────────────────────────────
  const fetchMovieData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ApiRequest.get(`/content/slug/${userId}`);
      setMovieData(response.data);

      // لینک‌های دانلود
      try {
        const dlRes = await ApiRequest.get(`/downloads/${response.data._id}`);
        setDownloadLinks(Array.isArray(dlRes.data) ? dlRes.data : []);
      } catch {
        setDownloadLinks([]);
      }

      // نظرات
      try {
        const cmRes = await ApiRequest.get(`/comments/${response.data._id}`);
        setComments(Array.isArray(cmRes.data) ? cmRes.data : []);
      } catch {
        setComments([]);
      }
    } catch (err) {
      Logger.error('Error fetching movie data:', err);
      setError('فیلم مورد نظر یافت نشد');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovieData();
  }, [fetchMovieData]);

  // ── ارسال نظر ────────────────────────────────────────────────
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || commentText.trim().length < 3) {
      setCommentError('نظر باید حداقل ۳ کاراکتر باشد');
      return;
    }
    try {
      setCommentLoading(true);
      setCommentError('');
      const payload = {
        contentId: movieData._id,
        text: commentText.trim(),
        ...(commentRating ? { rating: parseFloat(commentRating) } : {})
      };
      const res = await ApiRequest.post('/comments', payload);
      setComments(prev => [res.data.data, ...prev]);
      setCommentText('');
      setCommentRating('');
      setCommentSuccess('نظر شما با موفقیت ثبت شد ✓');
      setTimeout(() => setCommentSuccess(''), 3000);
    } catch (err) {
      setCommentError(err.response?.data?.message || 'خطا در ارسال نظر');
    } finally {
      setCommentLoading(false);
    }
  };

  // ── فرمت تاریخ فارسی ─────────────────────────────────────────
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('fa-IR', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="movie-page">
        <div className="movie-page__loading">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="movie-page">
        <div className="movie-page__error">
          <h2>خطا</h2>
          <p>{error || 'فیلم مورد نظر یافت نشد'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="movie-page">

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="movie-hero">
        <div className="movie-hero__background">
          {movieData.gallery && movieData.gallery.length > 0 && (
            <img
              src={getPosterUrl(movieData.gallery[0])}
              alt="hero background"
              className="movie-hero__bg-image"
            />
          )}
          <div className="movie-hero__overlay"></div>
        </div>
        <div className="container">
          <div className="movie-hero__content">
            <div className="movie-hero__poster">
              <img
                src={getPosterUrl(movieData.poster)}
                alt={`پوستر ${movieData.title || movieData.name}`}
                className="movie-hero__poster-image"
              />
            </div>
            <div className="movie-hero__info">
              <h1 className="movie-hero__title">{movieData.title || movieData.name || 'نام فیلم نامشخص'}</h1>
              <div className="movie-hero__meta">
                <span className="movie-hero__rating">
                  ⭐ {movieData.imdb?.rating || movieData.rate || 'N/A'}
                </span>
                <span className="movie-hero__year">{movieData.year || 'نامشخص'}</span>
                {movieData.movie?.duration > 0 && (
                  <span className="movie-hero__duration">{movieData.movie.duration} دقیقه</span>
                )}
              </div>
              <div className="movie-hero__genres">
                {(movieData.genres || movieData.genre)
                  ? (Array.isArray(movieData.genres || movieData.genre)
                      ? (movieData.genres || movieData.genre).map((genre, i) => (
                          <span key={i} className="movie-hero__genre">{genre}</span>
                        ))
                      : (movieData.genres || movieData.genre).split(',').map((genre, i) => (
                          <span key={i} className="movie-hero__genre">{genre.trim()}</span>
                        ))
                    )
                  : <span className="movie-hero__genre">نامشخص</span>
                }
              </div>
              <div className="movie-hero__actions">
                <a href="#download-section" className="btn btn-primary movie-hero__download-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  دانلود فیلم
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Movie Details ────────────────────────────────────── */}
      <section className="movie-details">
        <div className="container">
          <div className="movie-details__grid">
            <div className="movie-details__info">
              <div className="movie-details__section">
                <h2 className="movie-details__section-title">اطلاعات فیلم</h2>
                <div className="movie-details__info-grid">
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">کارگردان:</span>
                    <span className="movie-details__info-value">
                      {Array.isArray(movieData.directors) && movieData.directors.length > 0
                        ? movieData.directors.join('، ')
                        : movieData.director || 'نامشخص'}
                    </span>
                  </div>
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">بازیگران:</span>
                    <span className="movie-details__info-value">
                      {Array.isArray(movieData.actors) && movieData.actors.length > 0
                        ? movieData.actors.join('، ')
                        : movieData.stars || 'نامشخص'}
                    </span>
                  </div>
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">کشور سازنده:</span>
                    <span className="movie-details__info-value">
                      {Array.isArray(movieData.countries) && movieData.countries.length > 0
                        ? movieData.countries.join('، ')
                        : 'نامشخص'}
                    </span>
                  </div>
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">زبان:</span>
                    <span className="movie-details__info-value">
                      {Array.isArray(movieData.languages) && movieData.languages.length > 0
                        ? movieData.languages.join('، ')
                        : movieData.language || 'نامشخص'}
                    </span>
                  </div>
                  {movieData.type === 'series' && movieData.series?.seasonsCount > 0 && (
                    <div className="movie-details__info-item">
                      <span className="movie-details__info-label">فصل‌ها:</span>
                      <span className="movie-details__info-value">{movieData.series.seasonsCount} فصل</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="movie-details__section">
                <h2 className="movie-details__section-title">خلاصه داستان</h2>
                <p className="movie-details__story">
                  {movieData.description || movieData.story || movieData.TranslateText || 'خلاصه داستان موجود نیست.'}
                </p>
              </div>
            </div>

            <div className="movie-details__gallery">
              <h2 className="movie-details__section-title">تصاویر فیلم</h2>
              <div className="movie-gallery">
                {Array.isArray(movieData.gallery) && movieData.gallery.length > 0
                  ? movieData.gallery.map((image, i) => (
                      <div key={i} className="movie-gallery__item">
                        <img src={getPosterUrl(image)} alt={`تصویر ${i + 1}`} className="movie-gallery__image" />
                      </div>
                    ))
                  : (
                    <div className="movie-gallery__item">
                      <div className="movie-gallery__placeholder">تصویری موجود نیست</div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Download Section ─────────────────────────────────── */}
      <section className="movie-download" id="download-section">
        <div className="container">
          <div className="movie-download__content">
            <h2 className="movie-download__title">
              دانلود {movieData.type === 'series' ? 'سریال' : 'فیلم'} {movieData.title || movieData.name}
            </h2>
            {downloadLinks.length > 0 ? (
              <div className="movie-download__options">
                {downloadLinks.map(link => (
                  <div key={link._id} className="download-option">
                    <div className="download-option__info">
                      <h3 className="download-option__title">کیفیت {link.quality}</h3>
                      <p className="download-option__details">
                        {link.size}
                        {link.encoder ? ` • ${link.encoder}` : ''}
                        {link.dubbed ? ' • دوبله فارسی' : ''}
                        {link.subtitle ? ' • زیرنویس' : ''}
                        {link.label ? ` • ${link.label}` : ''}
                      </p>
                    </div>
                    <div className="download-option__actions">
                      <a href={link.url} className="btn btn-primary download-option__btn"
                        target="_blank" rel="noopener noreferrer">
                        دانلود مستقیم
                      </a>
                      {link.subtitle && link.subtitleUrl && (
                        <a href={link.subtitleUrl} className="btn btn-secondary download-option__btn"
                          target="_blank" rel="noopener noreferrer" style={{ marginTop: '8px' }}>
                          دانلود زیرنویس
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="movie-download__empty">
                <p>لینک دانلود هنوز اضافه نشده است.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Comments Section ─────────────────────────────────── */}
      <section className="movie-comments">
        <div className="container">
          <h2 className="movie-comments__title">
            نظرات کاربران
            {comments.length > 0 && (
              <span className="movie-comments__count">({comments.length})</span>
            )}
          </h2>

          {/* فرم ارسال نظر */}
          {isLoggedIn ? (
            <form className="comment-form" onSubmit={handleSubmitComment}>
              <div className="comment-form__header">
                <span className="comment-form__label">نظر خود را بنویسید</span>
                <select
                  className="comment-form__rating"
                  value={commentRating}
                  onChange={e => setCommentRating(e.target.value)}
                >
                  <option value="">امتیاز (اختیاری)</option>
                  {[10,9,8,7,6,5,4,3,2,1].map(n => (
                    <option key={n} value={n}>{n} از ۱۰</option>
                  ))}
                </select>
              </div>
              <textarea
                className="comment-form__textarea"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="نظر خود را اینجا بنویسید..."
                rows={4}
                maxLength={1000}
                dir="rtl"
              />
              <div className="comment-form__footer">
                <span className="comment-form__char-count">{commentText.length}/1000</span>
                {commentError && <span className="comment-form__error">{commentError}</span>}
                {commentSuccess && <span className="comment-form__success">{commentSuccess}</span>}
                <button
                  type="submit"
                  className="btn btn-primary comment-form__submit"
                  disabled={commentLoading || commentText.trim().length < 3}
                >
                  {commentLoading ? 'در حال ارسال...' : 'ارسال نظر'}
                </button>
              </div>
            </form>
          ) : (
            <div className="comment-login-prompt">
              <p>
                برای ارسال نظر ابتدا{' '}
                <Link to="/auth/login" className="comment-login-prompt__link">وارد شوید</Link>
              </p>
            </div>
          )}

          {/* لیست نظرات */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="comments-empty">
                <span>💬</span>
                <p>هنوز نظری ثبت نشده. اولین نفر باشید!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-item__header">
                    <div className="comment-item__avatar">
                      {comment.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="comment-item__meta">
                      <span className="comment-item__username">{comment.username}</span>
                      <span className="comment-item__date">{formatDate(comment.createdAt)}</span>
                    </div>
                    {comment.rating && (
                      <span className="comment-item__rating">⭐ {comment.rating}/10</span>
                    )}
                  </div>
                  <p className="comment-item__text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MoviePage;
