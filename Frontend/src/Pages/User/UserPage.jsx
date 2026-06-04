import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLogOut, FiShield, FiCalendar, FiEdit2 } from 'react-icons/fi';
import Footer from '../../components/Layout/Footer/Footer';
import Header from '../../components/Layout/GlobalHeader/GlobalHeader';
import ApiRequest from '../../Services/Axios/config';
import './UserPage.css';

export default function UserPage() {
    const navigate = useNavigate();
    const role      = localStorage.getItem('role') || 'User';
    const isLoggedIn = !!localStorage.getItem('token');

    const [userData, setUserData]   = useState(null);
    const [userLoading, setUserLoading] = useState(false);

    // ── دریافت اطلاعات واقعی کاربر از API ────────────────────
    useEffect(() => {
        if (!isLoggedIn) return;
        setUserLoading(true);
        ApiRequest.get('/auth/me')
            .then(res => setUserData(res.data))
            .catch(() => setUserData(null))
            .finally(() => setUserLoading(false));
    }, [isLoggedIn]);

    // ── فرمت تاریخ فارسی ─────────────────────────────────────
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            return new Date(dateStr).toLocaleDateString('fa-IR', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch { return '—'; }
    };

    // ── خروج ─────────────────────────────────────────────────
    const handleLogout = async () => {
        try { await ApiRequest.post('/auth/logout'); } catch {}
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/auth/login');
    };

    // ── حالت لاگ‌اوت ─────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <div className="user-page">
                <div className="user-page__container">
                    <div className="user-page__card">
                        <FiUser className="user-page__avatar-icon" />
                        <h2>وارد حساب کاربری خود شوید</h2>
                        <p>برای دسترسی به پنل کاربری ابتدا وارد شوید</p>
                        <button className="btn btn-primary" onClick={() => navigate('/auth/login')}>
                            ورود به حساب
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="user-page">
            <Header />
            <div className="user-page__container">
                <div className="user-page__card">

                    {/* آواتار */}
                    <div className="user-page__avatar">
                        <span className="user-page__avatar-letter">
                            {(userData?.name || localStorage.getItem('username') || 'U').charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* نام */}
                    <h2 className="user-page__name">
                        {userLoading ? '...' : (userData?.name || 'کاربر')}
                    </h2>

                    {/* اطلاعات */}
                    <div className="user-page__info">

                        {/* نام کاربری */}
                        {userData?.username && (
                            <div className="user-page__info-item">
                                <FiUser className="user-page__info-icon" />
                                <span className="user-page__info-label">نام کاربری:</span>
                                <span className="user-page__info-value">@{userData.username}</span>
                            </div>
                        )}

                        {/* ایمیل */}
                        {userData?.email && (
                            <div className="user-page__info-item">
                                <FiMail className="user-page__info-icon" />
                                <span className="user-page__info-label">ایمیل:</span>
                                <span className="user-page__info-value">{userData.email}</span>
                            </div>
                        )}

                        {/* تلفن */}
                        <div className="user-page__info-item">
                            <FiPhone className="user-page__info-icon" />
                            <span className="user-page__info-label">تلفن:</span>
                            <span className="user-page__info-value">
                                {userData?.phone || 'ثبت نشده'}
                            </span>
                        </div>

                        {/* سطح دسترسی */}
                        <div className="user-page__info-item">
                            <FiShield className="user-page__info-icon" />
                            <span className="user-page__info-label">سطح دسترسی:</span>
                            <span className={`user-page__role user-page__role--${role.toLowerCase()}`}>
                                {role === 'Admin' ? '👑 ادمین' : role === 'Owner' ? '🔑 مالک' : '👤 کاربر'}
                            </span>
                        </div>

                        {/* تاریخ عضویت */}
                        {userData?.createdAt && (
                            <div className="user-page__info-item">
                                <FiCalendar className="user-page__info-icon" />
                                <span className="user-page__info-label">عضویت از:</span>
                                <span className="user-page__info-value">{formatDate(userData.createdAt)}</span>
                            </div>
                        )}
                    </div>

                    {/* دکمه‌ها */}
                    <div className="user-page__actions">
                        {(role === 'Admin' || role === 'Owner') && (
                            <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                                <FiEdit2 style={{ marginLeft: 6 }} />
                                پنل مدیریت
                            </button>
                        )}
                        <button className="btn btn-danger" onClick={handleLogout}>
                            <FiLogOut style={{ marginLeft: 6 }} />
                            خروج از حساب
                        </button>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}
