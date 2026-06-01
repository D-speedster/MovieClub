import React, { useState, useEffect, useRef } from 'react';
import ApiRequest from '../../../Services/Axios/config';
import { getPosterUrl } from '../../../utils/posterUrl';
import './HeroImageManager.css';

const PAGES = [
    { key: 'hero_movies', label: 'صفحه فیلم‌ها', route: '/Movies' },
    { key: 'hero_series', label: 'صفحه سریال‌ها', route: '/Series' },
];

const HeroImageManager = () => {
    const [images, setImages] = useState({ hero_movies: null, hero_series: null });
    const [previews, setPreviews] = useState({ hero_movies: null, hero_series: null });
    const [uploading, setUploading] = useState({});
    const [messages, setMessages] = useState({});
    const fileRefs = { hero_movies: useRef(), hero_series: useRef() };

    useEffect(() => {
        PAGES.forEach(async ({ key }) => {
            try {
                const res = await ApiRequest.get(`/settings/${key}`);
                if (res.data?.value) {
                    setImages(prev => ({ ...prev, [key]: res.data.value }));
                }
            } catch (_) {}
        });
    }, []);

    const handleFileChange = (key, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, [key]: url }));
    };

    const handleUpload = async (key) => {
        const input = fileRefs[key].current;
        if (!input?.files[0]) {
            setMessages(prev => ({ ...prev, [key]: { type: 'error', text: 'ابتدا یک تصویر انتخاب کنید' } }));
            return;
        }
        const formData = new FormData();
        formData.append('image', input.files[0]);

        try {
            setUploading(prev => ({ ...prev, [key]: true }));
            const res = await ApiRequest.post(`/settings/${key}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImages(prev => ({ ...prev, [key]: res.data.filename }));
            setPreviews(prev => ({ ...prev, [key]: null }));
            input.value = '';
            setMessages(prev => ({ ...prev, [key]: { type: 'success', text: 'تصویر با موفقیت آپلود شد' } }));
        } catch (err) {
            setMessages(prev => ({ ...prev, [key]: { type: 'error', text: 'خطا در آپلود تصویر' } }));
        } finally {
            setUploading(prev => ({ ...prev, [key]: false }));
            setTimeout(() => setMessages(prev => ({ ...prev, [key]: null })), 3000);
        }
    };

    const handleRemove = async (key) => {
        try {
            await ApiRequest.post(`/settings/${key}`, { value: null });
            setImages(prev => ({ ...prev, [key]: null }));
            setPreviews(prev => ({ ...prev, [key]: null }));
            if (fileRefs[key].current) fileRefs[key].current.value = '';
            setMessages(prev => ({ ...prev, [key]: { type: 'success', text: 'تصویر حذف شد' } }));
        } catch (_) {
            setMessages(prev => ({ ...prev, [key]: { type: 'error', text: 'خطا در حذف' } }));
        } finally {
            setTimeout(() => setMessages(prev => ({ ...prev, [key]: null })), 3000);
        }
    };

    return (
        <div className="him">
            <div className="him__header">
                <h2>مدیریت تصویر Hero صفحات</h2>
                <p>تصویر پس‌زمینه بخش hero صفحات فیلم و سریال را از اینجا تنظیم کنید.</p>
            </div>

            <div className="him__grid">
                {PAGES.map(({ key, label, route }) => {
                    const currentImg = images[key];
                    const preview = previews[key];
                    const msg = messages[key];
                    const isUploading = uploading[key];
                    const displaySrc = preview || (currentImg ? getPosterUrl(currentImg) : null);

                    return (
                        <div key={key} className="him__card">
                            <div className="him__card-title">
                                <span>{label}</span>
                                <code className="him__route">{route}</code>
                            </div>

                            {/* Preview */}
                            <div className="him__preview">
                                {displaySrc ? (
                                    <>
                                        <img src={displaySrc} alt={label} className="him__preview-img" />
                                        {preview && (
                                            <div className="him__preview-badge">پیش‌نمایش</div>
                                        )}
                                    </>
                                ) : (
                                    <div className="him__preview-empty">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                        </svg>
                                        <span>تصویری انتخاب نشده</span>
                                    </div>
                                )}
                            </div>

                            {/* Message */}
                            {msg && (
                                <div className={`him__msg him__msg--${msg.type}`}>{msg.text}</div>
                            )}

                            {/* Controls */}
                            <div className="him__controls">
                                <label className="him__file-label">
                                    <input
                                        ref={fileRefs[key]}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="him__file-input"
                                        onChange={e => handleFileChange(key, e)}
                                    />
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                                    </svg>
                                    انتخاب تصویر
                                </label>

                                <button
                                    className="him__upload-btn"
                                    onClick={() => handleUpload(key)}
                                    disabled={isUploading || !previews[key]}
                                >
                                    {isUploading ? 'در حال آپلود...' : 'ذخیره'}
                                </button>

                                {currentImg && (
                                    <button
                                        className="him__remove-btn"
                                        onClick={() => handleRemove(key)}
                                    >
                                        حذف
                                    </button>
                                )}
                            </div>

                            <p className="him__hint">
                                توصیه: تصویر افقی با ابعاد حداقل ۱۹۲۰×۴۰۰ پیکسل — فرمت JPG یا WebP
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HeroImageManager;
