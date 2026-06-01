import React from 'react';
import Title_Admin from '../TitleAdmin/TitleAdmin';
import './News.css';

export default function News() {
    return (
        <div>
            <Title_Admin Title={'مدیریت اخبار'} />
            <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--adm-text-3, #888)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
            }}>
                <span style={{ fontSize: 48 }}>📰</span>
                <h3 style={{ color: 'var(--adm-text-2, #ccc)', margin: 0 }}>سیستم مدیریت اخبار</h3>
                <p style={{ margin: 0, maxWidth: 400 }}>
                    این بخش در نسخه بعدی پیاده‌سازی خواهد شد.
                    در حال حاضر می‌توانید از بخش افزودن محتوا برای مدیریت فیلم‌ها و سریال‌ها استفاده کنید.
                </p>
            </div>
        </div>
    );
}
