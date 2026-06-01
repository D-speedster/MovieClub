import React from 'react';
import Title_Admin from '../TitleAdmin/TitleAdmin';
import './IMDB.css';

export default function IMDB() {
    return (
        <div>
            <Title_Admin Title={'همگام‌سازی با IMDb'} />
            <div style={{
                padding: '24px',
                color: 'var(--adm-text-2, #ccc)',
                maxWidth: 600
            }}>
                <div style={{
                    background: 'var(--adm-surface, #1a1a2e)',
                    border: '1px solid var(--adm-border, rgba(255,255,255,0.1))',
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: 32 }}>🎬</span>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--adm-text, #fff)' }}>دریافت اطلاعات از IMDb</h3>
                            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--adm-text-3, #888)' }}>
                                برای افزودن محتوا با اطلاعات کامل از IMDb
                            </p>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: 14,
                        lineHeight: 1.8
                    }}>
                        <strong style={{ color: '#a5b4fc' }}>راهنمای استفاده:</strong>
                        <ol style={{ margin: '8px 0 0', paddingRight: '20px' }}>
                            <li>به بخش <strong>«افزودن محتوا»</strong> بروید</li>
                            <li>در باکس «دریافت از OMDB»، آیدی IMDb فیلم را وارد کنید</li>
                            <li>مثال: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>tt15398776</code></li>
                            <li>روی «دریافت اطلاعات» کلیک کنید</li>
                            <li>اطلاعات به صورت خودکار پر می‌شود</li>
                        </ol>
                    </div>

                    <p style={{ margin: 0, fontSize: 13, color: 'var(--adm-text-3, #888)' }}>
                        💡 آیدی IMDb را از آدرس صفحه فیلم در سایت imdb.com پیدا کنید.
                        مثلاً برای Oppenheimer: imdb.com/title/<strong>tt15398776</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
