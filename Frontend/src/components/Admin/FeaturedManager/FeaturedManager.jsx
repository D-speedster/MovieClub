import React, { useState, useEffect, useCallback } from 'react';
import ApiRequest from '../../../Services/Axios/config';
import { getPosterUrl } from '../../../utils/posterUrl';
import './FeaturedManager.css';

const FeaturedManager = () => {
  const [allContent, setAllContent] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentFeatured, setCurrentFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [moviesRes, seriesRes, featuredRes] = await Promise.allSettled([
        ApiRequest.get('/content/movieList'),
        ApiRequest.get('/content/seriesList'),
        ApiRequest.get('/content/featured')
      ]);

      const movies = moviesRes.status === 'fulfilled'
        ? (Array.isArray(moviesRes.value.data) ? moviesRes.value.data : [])
        : [];
      const series = seriesRes.status === 'fulfilled'
        ? (Array.isArray(seriesRes.value.data) ? seriesRes.value.data : [])
        : [];

      setAllContent([...movies, ...series]);

      if (featuredRes.status === 'fulfilled') {
        const featured = Array.isArray(featuredRes.value.data) ? featuredRes.value.data : [];
        setCurrentFeatured(featured);
        setSelectedIds(featured.map(f => f._id || f.id).filter(Boolean));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newIds = [...selectedIds];
    [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    setSelectedIds(newIds);
  };

  const moveDown = (index) => {
    if (index === selectedIds.length - 1) return;
    const newIds = [...selectedIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    setSelectedIds(newIds);
  };

  const removeFromSelected = (id) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await ApiRequest.post('/content/featured', { contentIds: selectedIds });
      setMessage({ type: 'success', text: 'پیشنهادی‌ها با موفقیت ذخیره شد' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'خطا در ذخیره‌سازی' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const filteredContent = allContent.filter(item => {
    const title = item.title || item.name || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getContentById = (id) =>
    allContent.find(c => (c._id || c.id) === id);

  if (loading) {
    return (
      <div className="featured-manager">
        <div className="featured-manager__loading">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="featured-manager">
      <div className="featured-manager__header">
        <h2>مدیریت پیشنهادی‌ها</h2>
        <p>محتوایی که در بخش «پیشنهادی‌ها» صفحه اصلی نمایش داده می‌شود را انتخاب کنید.</p>
      </div>

      {message && (
        <div className={`featured-manager__message featured-manager__message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="featured-manager__layout">
        {/* ستون چپ: لیست انتخاب شده‌ها */}
        <div className="featured-manager__selected">
          <div className="featured-manager__section-title">
            پیشنهادی‌های انتخاب شده ({selectedIds.length})
          </div>

          {selectedIds.length === 0 ? (
            <div className="featured-manager__empty">
              هنوز محتوایی انتخاب نشده. از لیست سمت راست انتخاب کنید.
            </div>
          ) : (
            <div className="featured-manager__selected-list">
              {selectedIds.map((id, index) => {
                const item = getContentById(id);
                if (!item) return null;
                return (
                  <div key={id} className="featured-manager__selected-item">
                    <span className="featured-manager__rank">{index + 1}</span>
                    <img
                      src={getPosterUrl(item.poster)}
                      alt={item.title || item.name}
                      className="featured-manager__thumb"
                    />
                    <span className="featured-manager__item-title">
                      {item.title || item.name}
                      <small>{item.type === 'movie' ? 'فیلم' : 'سریال'} · {item.year}</small>
                    </span>
                    <div className="featured-manager__item-actions">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        title="بالاتر"
                        className="featured-manager__btn featured-manager__btn--move"
                      >↑</button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === selectedIds.length - 1}
                        title="پایین‌تر"
                        className="featured-manager__btn featured-manager__btn--move"
                      >↓</button>
                      <button
                        onClick={() => removeFromSelected(id)}
                        title="حذف"
                        className="featured-manager__btn featured-manager__btn--remove"
                      >✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            className="featured-manager__save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره پیشنهادی‌ها'}
          </button>
        </div>

        {/* ستون راست: جستجو و انتخاب */}
        <div className="featured-manager__picker">
          <div className="featured-manager__section-title">
            انتخاب از محتوا ({allContent.length} مورد)
          </div>

          <input
            type="text"
            className="featured-manager__search"
            placeholder="جستجوی عنوان..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <div className="featured-manager__content-list">
            {filteredContent.map(item => {
              const id = item._id || item.id;
              const isSelected = selectedIds.includes(id);
              return (
                <div
                  key={id}
                  className={`featured-manager__content-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSelect(id)}
                >
                  <img
                    src={getPosterUrl(item.poster)}
                    alt={item.title || item.name}
                    className="featured-manager__thumb"
                  />
                  <div className="featured-manager__content-info">
                    <span className="featured-manager__content-title">
                      {item.title || item.name}
                    </span>
                    <small>
                      {item.type === 'movie' ? 'فیلم' : 'سریال'} · {item.year}
                      {item.imdb?.rating ? ` · ⭐ ${item.imdb.rating}` : ''}
                    </small>
                  </div>
                  {isSelected && (
                    <span className="featured-manager__check">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedManager;
