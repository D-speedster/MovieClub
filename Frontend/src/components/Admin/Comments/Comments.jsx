import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row } from 'react-bootstrap';
import './Comments.css';
import ApiRequest from '../../../Services/Axios/config';
import Title_Admin from '../TitleAdmin/TitleAdmin';
import Swal from 'sweetalert2';

const STATUS_LABELS = {
    approved: { label: 'تایید شده', color: '#86efac', bg: 'rgba(34,197,94,0.1)' },
    pending:  { label: 'در انتظار', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    rejected: { label: 'رد شده',    color: '#fca5a5', bg: 'rgba(239,68,68,0.1)'  },
};

export default function Comments() {
    const [comments, setComments]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [filter, setFilter]       = useState('all');

    const fetchComments = useCallback(() => {
        setLoading(true);
        setError(null);
        ApiRequest.get('/comments/admin/all')
            .then(res => {
                const data = res.data;
                setComments(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                setError('خطا در دریافت نظرات');
                setComments([]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    // ── تغییر وضعیت نظر ─────────────────────────────────────
    const handleStatusChange = async (id, newStatus) => {
        try {
            await ApiRequest.put(`/comments/${id}/status`, { status: newStatus });
            setComments(prev =>
                prev.map(c => c._id === id ? { ...c, status: newStatus } : c)
            );
        } catch {
            Swal.fire({ icon: 'error', title: 'خطا در تغییر وضعیت',
                background: 'var(--adm-surface, #1a1a2e)', color: '#fff', confirmButtonColor: '#6366f1' });
        }
    };

    // ── حذف نظر ─────────────────────────────────────────────
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'حذف نظر؟', text: 'این عملیات قابل بازگشت نیست',
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'بله، حذف شود', cancelButtonText: 'انصراف',
            background: 'var(--adm-surface, #1a1a2e)', color: '#fff', confirmButtonColor: '#ef4444',
        });
        if (!result.isConfirmed) return;
        try {
            await ApiRequest.delete(`/comments/${id}`);
            setComments(prev => prev.filter(c => c._id !== id));
        } catch {
            Swal.fire({ icon: 'error', title: 'خطا در حذف',
                background: 'var(--adm-surface, #1a1a2e)', color: '#fff' });
        }
    };

    // ── فرمت تاریخ ──────────────────────────────────────────
    const formatDate = (d) => {
        try { return new Date(d).toLocaleDateString('fa-IR'); } catch { return '—'; }
    };

    // ── فیلتر ───────────────────────────────────────────────
    const filtered = filter === 'all'
        ? comments
        : comments.filter(c => c.status === filter);

    return (
        <Container fluid dir="rtl" style={{ padding: '0 8px' }}>
            <Row className="mt-3 mb-3">
                <Title_Admin Title={'مدیریت نظرات کاربران :'} />
            </Row>

            {/* فیلتر وضعیت */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {[
                    { key: 'all',      label: `همه (${comments.length})` },
                    { key: 'approved', label: `تایید شده (${comments.filter(c=>c.status==='approved').length})` },
                    { key: 'pending',  label: `در انتظار (${comments.filter(c=>c.status==='pending').length})` },
                    { key: 'rejected', label: `رد شده (${comments.filter(c=>c.status==='rejected').length})` },
                ].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        style={{
                            padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                            background: filter === f.key ? 'var(--adm-accent, #6366f1)' : 'var(--adm-surface-2, rgba(255,255,255,0.06))',
                            color: filter === f.key ? '#fff' : 'var(--adm-text-2, #ccc)',
                        }}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* حالت‌های بارگذاری و خطا */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--adm-text-3, #888)' }}>
                    در حال بارگذاری...
                </div>
            )}
            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 10, padding: '16px', color: '#fca5a5', textAlign: 'center', marginBottom: 16 }}>
                    {error}
                </div>
            )}
            {!loading && !error && filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--adm-text-3, #888)' }}>
                    نظری یافت نشد
                </div>
            )}

            {/* جدول نظرات */}
            {!loading && filtered.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--adm-border, rgba(255,255,255,0.08))' }}>
                                {['نویسنده', 'نظر', 'امتیاز', 'فیلم/سریال', 'تاریخ', 'وضعیت', 'عملیات'].map(h => (
                                    <th key={h} style={{ padding: '10px 12px', textAlign: 'right',
                                        color: 'var(--adm-text-3, #888)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((comment) => {
                                const st = STATUS_LABELS[comment.status] || STATUS_LABELS.pending;
                                return (
                                    <tr key={comment._id}
                                        style={{ borderBottom: '1px solid var(--adm-border, rgba(255,255,255,0.05))',
                                            transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                                        {/* نویسنده */}
                                        <td style={{ padding: '10px 12px', color: 'var(--adm-text, #fff)', fontWeight: 600 }}>
                                            {comment.username || '—'}
                                        </td>

                                        {/* متن نظر */}
                                        <td style={{ padding: '10px 12px', color: 'var(--adm-text-2, #ccc)',
                                            maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                            title={comment.text}>
                                            {comment.text}
                                        </td>

                                        {/* امتیاز */}
                                        <td style={{ padding: '10px 12px', color: '#fbbf24', whiteSpace: 'nowrap' }}>
                                            {comment.rating ? `⭐ ${comment.rating}` : '—'}
                                        </td>

                                        {/* فیلم */}
                                        <td style={{ padding: '10px 12px', color: 'var(--adm-text-2, #ccc)',
                                            maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {comment.contentId?.title || '—'}
                                        </td>

                                        {/* تاریخ */}
                                        <td style={{ padding: '10px 12px', color: 'var(--adm-text-3, #888)',
                                            whiteSpace: 'nowrap', fontSize: 12 }}>
                                            {formatDate(comment.createdAt)}
                                        </td>

                                        {/* وضعیت */}
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{ background: st.bg, color: st.color,
                                                padding: '3px 10px', borderRadius: 6, fontSize: 12,
                                                fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                {st.label}
                                            </span>
                                        </td>

                                        {/* عملیات */}
                                        <td style={{ padding: '10px 12px' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                                                {comment.status !== 'approved' && (
                                                    <button onClick={() => handleStatusChange(comment._id, 'approved')}
                                                        title="تایید"
                                                        style={{ background: 'rgba(34,197,94,0.12)', color: '#86efac',
                                                            border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6,
                                                            padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                                                        ✓ تایید
                                                    </button>
                                                )}
                                                {comment.status !== 'rejected' && (
                                                    <button onClick={() => handleStatusChange(comment._id, 'rejected')}
                                                        title="رد"
                                                        style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24',
                                                            border: '1px solid rgba(251,191,36,0.2)', borderRadius: 6,
                                                            padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                                                        رد
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(comment._id)}
                                                    title="حذف"
                                                    style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5',
                                                        border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6,
                                                        padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </Container>
    );
}
