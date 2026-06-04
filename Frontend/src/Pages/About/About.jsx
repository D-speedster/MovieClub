import React from 'react';
import Footer from '../../components/Layout/Footer/Footer';
import './About.css';

export default function About() {
    return (
        <div className="static-page">
            <div className="static-page__hero">
                <div className="container">
                    <h1>درباره مووی کلاب</h1>
                    <p>بزرگترین مجموعه فیلم و سریال فارسی</p>
                </div>
            </div>
            <div className="static-page__content container">
                <div className="static-page__section">
                    <h2>ما کی هستیم؟</h2>
                    <p>
                        مووی کلاب یک پلتفرم دانلود فیلم و سریال است که با هدف ارائه بهترین تجربه تماشا و دانلود محتوای سینمایی
                        برای کاربران فارسی‌زبان طراحی شده است. ما تلاش می‌کنیم تا بهترین کیفیت‌ها را با سریع‌ترین لینک‌های دانلود
                        در اختیار شما قرار دهیم.
                    </p>
                </div>
                <div className="static-page__section">
                    <h2>ویژگی‌های ما</h2>
                    <div className="static-page__features">
                        <div className="static-page__feature">
                            <span className="static-page__feature-icon">🎬</span>
                            <h3>کیفیت بالا</h3>
                            <p>ارائه فیلم‌ها در کیفیت‌های 480p تا 4K</p>
                        </div>
                        <div className="static-page__feature">
                            <span className="static-page__feature-icon">🔍</span>
                            <h3>جستجوی پیشرفته</h3>
                            <p>یافتن سریع فیلم و سریال مورد نظر</p>
                        </div>
                        <div className="static-page__feature">
                            <span className="static-page__feature-icon">📱</span>
                            <h3>سازگار با موبایل</h3>
                            <p>تجربه کاربری بهینه در تمام دستگاه‌ها</p>
                        </div>
                        <div className="static-page__feature">
                            <span className="static-page__feature-icon">🔄</span>
                            <h3>به‌روزرسانی مداوم</h3>
                            <p>اضافه شدن جدیدترین فیلم‌ها و سریال‌ها</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
