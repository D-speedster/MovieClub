import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Layout/PageHeader/PageHeader';
import Footer from '../../components/Layout/Footer/Footer';
import MobileNav from '../../components/Layout/MobileNav/MobileNav';
import '../About/About.css';

const CATEGORIES = [
    { name: 'اکشن', icon: '💥', en: 'Action' },
    { name: 'درام', icon: '🎭', en: 'Drama' },
    { name: 'کمدی', icon: '😂', en: 'Comedy' },
    { name: 'ترسناک', icon: '👻', en: 'Horror' },
    { name: 'علمی‌تخیلی', icon: '🚀', en: 'Sci-Fi' },
    { name: 'ماجراجویی', icon: '🗺️', en: 'Adventure' },
    { name: 'انیمیشن', icon: '🎨', en: 'Animation' },
    { name: 'رمانتیک', icon: '❤️', en: 'Romance' },
    { name: 'جنایی', icon: '🔍', en: 'Crime' },
    { name: 'تاریخی', icon: '🏛️', en: 'History' },
    { name: 'موزیکال', icon: '🎵', en: 'Musical' },
    { name: 'مستند', icon: '📽️', en: 'Documentary' },
    { name: 'خانوادگی', icon: '👨‍👩‍👧', en: 'Family' },
    { name: 'فانتزی', icon: '🧙', en: 'Fantasy' },
    { name: 'هیجانی', icon: '⚡', en: 'Thriller' },
    { name: 'بیوگرافی', icon: '📖', en: 'Biography' },
];

export default function Categories() {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/Movies?genre=${encodeURIComponent(category.name)}`);
    };

    return (
        <div className="static-page">
            <PageHeader />
            <div className="static-page__hero">
                <div className="container">
                    <h1>دسته‌بندی‌ها</h1>
                    <p>فیلم و سریال مورد علاقه خود را بر اساس ژانر پیدا کنید</p>
                </div>
            </div>
            <div className="static-page__content container">
                <div className="static-page__section">
                    <h2>همه ژانرها</h2>
                    <div className="static-page__categories">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.en}
                                className="static-page__category-card"
                                onClick={() => handleCategoryClick(cat)}
                                aria-label={`مشاهده فیلم‌های ${cat.name}`}
                            >
                                <span className="static-page__category-icon">{cat.icon}</span>
                                <span className="static-page__category-name">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
            <MobileNav />
        </div>
    );
}
