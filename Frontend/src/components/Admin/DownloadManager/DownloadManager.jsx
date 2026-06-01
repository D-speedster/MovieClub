import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Stack, Select, MenuItem,
    FormControl, InputLabel, Switch, FormControlLabel, CircularProgress,
    Alert, Chip, Autocomplete
} from '@mui/material';
import { FiDownload, FiTrash2, FiPlus, FiLink } from 'react-icons/fi';
import ApiRequest from '../../../Services/Axios/config';
import Swal from 'sweetalert2';

const QUALITY_OPTIONS = ['480p', '720p', '1080p', '4K', 'BluRay', 'WEB-DL', 'HDCAM'];

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        color: 'var(--adm-text)',
        backgroundColor: 'var(--adm-surface-2)',
        borderRadius: '8px',
        '& fieldset': { borderColor: 'var(--adm-border)' },
        '&:hover fieldset': { borderColor: 'rgba(124,58,237,0.4)' },
        '&.Mui-focused fieldset': { borderColor: 'var(--adm-accent)' },
    },
    '& .MuiInputLabel-root': { color: 'var(--adm-text-3)' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'var(--adm-accent)' },
};

const emptyForm = {
    contentId: '',
    quality: '1080p',
    size: '',
    url: '',
    encoder: '',
    subtitle: false,
    subtitleUrl: '',
    dubbed: false,
    label: ''
};

export default function DownloadManager() {
    const [contentList, setContentList] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);
    const [links, setLinks] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [linksLoading, setLinksLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // بارگذاری لیست محتوا
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [movies, series] = await Promise.all([
                    ApiRequest.get('/content/movieList'),
                    ApiRequest.get('/content/seriesList'),
                ]);
                const all = [
                    ...(Array.isArray(movies.data) ? movies.data : []),
                    ...(Array.isArray(series.data) ? series.data : []),
                ].map(c => ({ ...c, label: `${c.title} (${c.type === 'movie' ? 'فیلم' : 'سریال'})` }));
                setContentList(all);
            } catch (err) {
                setError('خطا در دریافت لیست محتوا');
            }
        };
        fetchContent();
    }, []);

    // بارگذاری لینک‌های محتوای انتخاب‌شده
    useEffect(() => {
        if (!selectedContent) { setLinks([]); return; }
        const fetchLinks = async () => {
            setLinksLoading(true);
            try {
                const res = await ApiRequest.get(`/downloads/${selectedContent._id}`);
                setLinks(Array.isArray(res.data) ? res.data : []);
            } catch {
                setLinks([]);
            } finally {
                setLinksLoading(false);
            }
        };
        fetchLinks();
        setForm(prev => ({ ...prev, contentId: selectedContent._id }));
    }, [selectedContent]);

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleAdd = async () => {
        if (!form.contentId || !form.quality || !form.size || !form.url) {
            setError('محتوا، کیفیت، حجم و لینک الزامی هستند');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await ApiRequest.post('/downloads', form);
            setSuccess('لینک دانلود با موفقیت اضافه شد');
            setForm(prev => ({ ...emptyForm, contentId: prev.contentId }));
            // رفرش لینک‌ها
            const res = await ApiRequest.get(`/downloads/${form.contentId}`);
            setLinks(Array.isArray(res.data) ? res.data : []);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'خطا در افزودن لینک');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'حذف لینک؟',
            text: 'این عملیات قابل بازگشت نیست',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، حذف شود',
            cancelButtonText: 'انصراف',
            background: 'var(--adm-surface)',
            color: 'var(--adm-text)',
            confirmButtonColor: '#ef4444',
        });
        if (!result.isConfirmed) return;
        try {
            await ApiRequest.delete(`/downloads/${id}`);
            setLinks(prev => prev.filter(l => l._id !== id));
        } catch {
            Swal.fire({ icon: 'error', title: 'خطا در حذف', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        }
    };

    return (
        <Box dir="rtl">
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                <Box sx={{ width: 36, height: 36, borderRadius: '9px', bgcolor: 'var(--adm-accent-subtle)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiDownload style={{ fontSize: 18, color: 'var(--adm-accent)' }} />
                </Box>
                <Box>
                    <Typography fontWeight={700} sx={{ color: 'var(--adm-text)', fontSize: 16 }}>مدیریت لینک‌های دانلود</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--adm-text-3)' }}>افزودن و مدیریت لینک‌های دانلود برای هر فیلم/سریال</Typography>
                </Box>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(34,197,94,0.08)', color: '#86efac', border: '1px solid rgba(34,197,94,0.2)' }}>{success}</Alert>}

            {/* انتخاب محتوا */}
            <Box sx={{ bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '10px', p: 2.5, mb: 3 }}>
                <Typography variant="caption" sx={{ color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, display: 'block', mb: 1.5 }}>
                    انتخاب فیلم یا سریال
                </Typography>
                <Autocomplete
                    options={contentList}
                    getOptionLabel={(o) => o.label || o.title || ''}
                    value={selectedContent}
                    onChange={(_, val) => setSelectedContent(val)}
                    renderInput={(params) => <TextField {...params} label="جستجوی فیلم/سریال..." sx={fieldSx} />}
                    componentsProps={{ paper: { sx: { bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '8px' } } }}
                    noOptionsText={<span style={{ color: 'var(--adm-text-3)' }}>موردی یافت نشد</span>}
                />
            </Box>

            {selectedContent && (
                <>
                    {/* فرم افزودن لینک */}
                    <Box sx={{ bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '10px', p: 2.5, mb: 3 }}>
                        <Typography variant="caption" sx={{ color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, display: 'block', mb: 2 }}>
                            افزودن لینک جدید برای: {selectedContent.title}
                        </Typography>

                        <Stack spacing={2}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <FormControl sx={{ minWidth: 140 }}>
                                    <InputLabel sx={{ color: 'var(--adm-text-3)', '&.Mui-focused': { color: 'var(--adm-accent)' } }}>کیفیت *</InputLabel>
                                    <Select value={form.quality} label="کیفیت *" onChange={e => handleChange('quality', e.target.value)}
                                        sx={{ color: 'var(--adm-text)', bgcolor: 'var(--adm-surface-2)', borderRadius: '8px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--adm-border)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--adm-accent)' }, '& .MuiSvgIcon-root': { color: 'var(--adm-text-3)' } }}>
                                        {QUALITY_OPTIONS.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <TextField label="حجم فایل *" placeholder="مثال: 1.5 GB" value={form.size}
                                    onChange={e => handleChange('size', e.target.value)} sx={{ ...fieldSx, flex: 1 }} />
                                <TextField label="انکودر" placeholder="مثال: x265" value={form.encoder}
                                    onChange={e => handleChange('encoder', e.target.value)} sx={{ ...fieldSx, flex: 1 }} />
                            </Stack>

                            <TextField fullWidth label="لینک دانلود *" placeholder="https://..." value={form.url}
                                onChange={e => handleChange('url', e.target.value)} sx={fieldSx} />

                            <TextField fullWidth label="توضیح (اختیاری)" placeholder="مثال: دوبله فارسی + زیرنویس چسبیده" value={form.label}
                                onChange={e => handleChange('label', e.target.value)} sx={fieldSx} />

                            <Stack direction="row" spacing={3} alignItems="center">
                                <FormControlLabel
                                    control={<Switch checked={form.subtitle} onChange={e => handleChange('subtitle', e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--adm-accent)' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--adm-accent)' } }} />}
                                    label={<Typography sx={{ color: 'var(--adm-text-2)', fontSize: 14 }}>زیرنویس دارد</Typography>}
                                />
                                <FormControlLabel
                                    control={<Switch checked={form.dubbed} onChange={e => handleChange('dubbed', e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--adm-accent)' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--adm-accent)' } }} />}
                                    label={<Typography sx={{ color: 'var(--adm-text-2)', fontSize: 14 }}>دوبله فارسی</Typography>}
                                />
                            </Stack>

                            {form.subtitle && (
                                <TextField fullWidth label="لینک زیرنویس" placeholder="https://..." value={form.subtitleUrl}
                                    onChange={e => handleChange('subtitleUrl', e.target.value)} sx={fieldSx} />
                            )}

                            <Button onClick={handleAdd} disabled={loading} variant="contained"
                                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiPlus />}
                                sx={{ bgcolor: 'var(--adm-accent)', '&:hover': { bgcolor: 'var(--adm-accent-hover)' }, textTransform: 'none', fontWeight: 600, alignSelf: 'flex-start', px: 3 }}>
                                {loading ? 'در حال افزودن...' : 'افزودن لینک'}
                            </Button>
                        </Stack>
                    </Box>

                    {/* لیست لینک‌های موجود */}
                    <Box sx={{ bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '10px', p: 2.5 }}>
                        <Typography variant="caption" sx={{ color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, display: 'block', mb: 2 }}>
                            لینک‌های موجود ({links.length})
                        </Typography>

                        {linksLoading ? (
                            <Box display="flex" justifyContent="center" py={3}>
                                <CircularProgress sx={{ color: 'var(--adm-accent)' }} size={28} />
                            </Box>
                        ) : links.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4, color: 'var(--adm-text-3)' }}>
                                <FiLink style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }} />
                                <Typography variant="body2">هنوز لینکی اضافه نشده</Typography>
                            </Box>
                        ) : (
                            <Stack spacing={1.5}>
                                {links.map(link => (
                                    <Box key={link._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', flexWrap: 'wrap', gap: 1 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                            <Chip label={link.quality} size="small" sx={{ bgcolor: 'var(--adm-accent-subtle)', color: 'var(--adm-accent)', border: '1px solid rgba(124,58,237,0.2)', fontWeight: 600 }} />
                                            <Typography sx={{ color: 'var(--adm-text-2)', fontSize: 13 }}>{link.size}</Typography>
                                            {link.encoder && <Typography sx={{ color: 'var(--adm-text-3)', fontSize: 12 }}>• {link.encoder}</Typography>}
                                            {link.dubbed && <Chip label="دوبله" size="small" sx={{ bgcolor: 'rgba(34,197,94,0.1)', color: '#86efac', fontSize: 11, height: 20 }} />}
                                            {link.subtitle && <Chip label="زیرنویس" size="small" sx={{ bgcolor: 'rgba(59,130,246,0.1)', color: '#93c5fd', fontSize: 11, height: 20 }} />}
                                            {link.label && <Typography sx={{ color: 'var(--adm-text-3)', fontSize: 12 }}>• {link.label}</Typography>}
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography sx={{ color: 'var(--adm-text-3)', fontSize: 11, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {link.url}
                                            </Typography>
                                            <button onClick={() => handleDelete(link._id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px', display: 'flex', alignItems: 'center' }}
                                                title="حذف لینک">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
}
