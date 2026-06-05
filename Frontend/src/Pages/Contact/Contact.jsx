import React, { useState } from 'react';
import '../About/About.css';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // فرم تماس — فقط UI (بدون backend)
        setSent(true);
    };

    return (
        <div className="static-page">
            <div className="static-page__hero">
                <div className="container">
                    <h1>تماس با ما</h1>
                    <p>سوال یا پیشنهادی دارید؟ با ما در تماس باشید</p>
                </div>
            </div>
            <div className="static-page__content container">
                {sent ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <span style={{ fontSize: 64 }}>✅</span>
                        <h2 style={{ marginTop: 20, color: '#86efac' }}>پیام شما ارسال شد</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>به زودی با شما تماس خواهیم گرفت</p>
                        <button className="static-page__submit" style={{ marginTop: 24 }} onClick={() => setSent(false)}>
                            ارسال پیام جدید
                        </button>
                    </div>
                ) : (
                    <div className="static-page__section">
                        <h2>فرم تماس</h2>
                        <form className="static-page__form" onSubmit={handleSubmit}>
                            <div className="static-page__form-group">
                                <label htmlFor="contact-name">نام شما</label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    placeholder="نام خود را وارد کنید"
                                    value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    required
                                    dir="rtl"
                                />
                            </div>
                            <div className="static-page__form-group">
                                <label htmlFor="contact-email">ایمیل</label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="static-page__form-group">
                                <label htmlFor="contact-message">پیام</label>
                                <textarea
                                    id="contact-message"
                                    placeholder="پیام خود را بنویسید..."
                                    value={form.message}
                                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                    required
                                    dir="rtl"
                                />
                            </div>
                            <button type="submit" className="static-page__submit">
                                ارسال پیام
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
