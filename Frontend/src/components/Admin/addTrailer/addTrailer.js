import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Stack, Grid, Card, CardMedia,
    CardContent, CardActions, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Chip, Tooltip,
    CircularProgress, Alert, InputAdornment
} from '@mui/material';
import {
    Add as AddIcon, Delete as DeleteIcon, PlayCircle as PlayIcon,
    Search as SearchIcon, Movie as MovieIcon, Close as CloseIcon,
    Link as LinkIcon, Title as TitleIcon
} from '@mui/icons-material';
import ApiRequest from '../../../Services/Axios/config';
import Swal from 'sweetalert2';
import Logger from '../../../utils/logger';
import { getPosterUrl } from '../../../utils/posterUrl';
import './addTrailer.css';

const sx = {
    field: {
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
    }
};

const emptyForm = { title: '', youtubeUrl: '', contentId: '' };

export default function AddTrailer() {
    const [trailers, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchTrailers(); }, []);

    const fetchTrailers = async () => {
        try {
            setLoading(true);
            const res = await ApiRequest.get('/content/trailers');
            setTrailers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            Logger.error('Error fetching trailers:', err);
            setTrailers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: `حذف "${title}"؟`,
            text: 'این عملیات قابل بازگشت نیست',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، حذف شود',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#ef4444',
            background: 'var(--adm-surface)',
            color: 'var(--adm-text)',
        });
        if (!result.isConfirmed) return;
        try {
            await ApiRequest.delete(`/content/${id}`);
            setTrailers(prev => prev.filter(t => t._id !== id));
            Swal.fire({ icon: 'success', title: 'حذف شد', timer: 1500, showConfirmButton: false, background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'خطا در حذف', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        }
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('type', 'movie');
            formData.append('description', form.youtubeUrl);
            await ApiRequest.post('/content/new-content', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire({ icon: 'success', title: 'تریلر اضافه شد', timer: 1500, showConfirmButton: false, background: 'var(--adm-surface)', color: 'var(--adm-text)' });
            setOpen(false);
            setForm(emptyForm);
            fetchTrailers();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'خطا در ذخیره', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        } finally {
            setSaving(false);
        }
    };

    const getYoutubeThumb = (url) => {
        if (!url) return null;
        const match = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
        return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
    };

    const filtered = trailers.filter(t =>
        (t.title || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box dir="rtl" sx={{ p: 0 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box className="trailer-icon-wrap">
                        <PlayIcon sx={{ fontSize: 18, color: 'var(--adm-accent)' }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--adm-text)', fontSize: 16 }}>
                            مدیریت تریلرها
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--adm-text-3)' }}>
                            {trailers.length} تریلر موجود
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                    <TextField
                        size="small" placeholder="جستجو..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: 'var(--adm-text-3)' }} /></InputAdornment>
                        }}
                        sx={{ ...sx.field, width: 200 }}
                    />
                    <Button
                        variant="contained" startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                        sx={{ bgcolor: 'var(--adm-accent)', '&:hover': { bgcolor: 'var(--adm-accent-hover)' }, borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 13 }}
                    >
                        تریلر جدید
                    </Button>
                </Stack>
            </Stack>

            {/* Content */}
            {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress sx={{ color: 'var(--adm-accent)' }} />
                </Box>
            ) : filtered.length === 0 ? (
                <Box className="trailer-empty">
                    <PlayIcon sx={{ fontSize: 48, color: 'var(--adm-text-3)', mb: 1 }} />
                    <Typography sx={{ color: 'var(--adm-text-3)', fontSize: 14 }}>
                        {search ? 'نتیجه‌ای یافت نشد' : 'هنوز تریلری اضافه نشده'}
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filtered.map((trailer) => {
                        const thumb = getYoutubeThumb(trailer.description) || getPosterUrl(trailer.poster);
                        const title = trailer.title || 'بدون عنوان';
                        const date = trailer.createdAt ? new Date(trailer.createdAt).toLocaleDateString('fa-IR') : '—';

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={trailer._id}>
                                <Card className="trailer-card">
                                    <Box className="trailer-thumb-wrap">
                                        {thumb ? (
                                            <CardMedia component="img" image={thumb} alt={title} className="trailer-thumb" />
                                        ) : (
                                            <Box className="trailer-thumb-placeholder">
                                                <MovieIcon sx={{ fontSize: 36, color: 'var(--adm-text-3)' }} />
                                            </Box>
                                        )}
                                        <Box className="trailer-play-overlay">
                                            <PlayIcon sx={{ fontSize: 40, color: 'white' }} />
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: '12px 14px 8px', bgcolor: 'var(--adm-surface)' }}>
                                        <Typography fontWeight={600} sx={{ color: 'var(--adm-text)', fontSize: 13, mb: 0.5 }} noWrap>
                                            {title}
                                        </Typography>
                                        <Typography sx={{ color: 'var(--adm-text-3)', fontSize: 11 }}>
                                            {date}
                                        </Typography>
                                    </CardContent>

                                    <CardActions sx={{ p: '0 14px 12px', bgcolor: 'var(--adm-surface)', justifyContent: 'space-between' }}>
                                        <Chip label="تریلر" size="small"
                                            sx={{ bgcolor: 'var(--adm-accent-subtle)', color: 'var(--adm-accent)', fontSize: 11, height: 22, border: '1px solid rgba(124,58,237,0.2)' }}
                                        />
                                        <Tooltip title="حذف">
                                            <IconButton size="small" onClick={() => handleDelete(trailer._id, title)}
                                                sx={{ color: 'var(--adm-text-3)', '&:hover': { color: 'var(--adm-red)', bgcolor: 'rgba(239,68,68,0.08)' } }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Add Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '12px', color: 'var(--adm-text)' } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid var(--adm-border)' }}>
                    <Typography fontWeight={700} fontSize={15}>افزودن تریلر جدید</Typography>
                    <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'var(--adm-text-3)' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 2.5, pb: 1 }}>
                    <Stack spacing={2.5} mt={0.5}>
                        <TextField fullWidth label="عنوان تریلر *" value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon sx={{ fontSize: 16, color: 'var(--adm-text-3)' }} /></InputAdornment> }}
                            sx={sx.field}
                        />
                        <TextField fullWidth label="لینک یوتیوب" value={form.youtubeUrl}
                            onChange={e => setForm(p => ({ ...p, youtubeUrl: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..."
                            InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 16, color: 'var(--adm-text-3)' }} /></InputAdornment> }}
                            sx={sx.field}
                        />
                        {form.youtubeUrl && getYoutubeThumb(form.youtubeUrl) && (
                            <Box sx={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--adm-border)' }}>
                                <img src={getYoutubeThumb(form.youtubeUrl)} alt="preview" style={{ width: '100%', display: 'block' }} />
                            </Box>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: '12px 20px', borderTop: '1px solid var(--adm-border)', gap: 1 }}>
                    <Button onClick={() => setOpen(false)}
                        sx={{ color: 'var(--adm-text-2)', borderColor: 'var(--adm-border)', textTransform: 'none', fontSize: 13 }}
                        variant="outlined">
                        انصراف
                    </Button>
                    <Button onClick={handleSave} disabled={saving || !form.title.trim()} variant="contained"
                        startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <AddIcon />}
                        sx={{ bgcolor: 'var(--adm-accent)', '&:hover': { bgcolor: 'var(--adm-accent-hover)' }, textTransform: 'none', fontSize: 13, fontWeight: 600 }}>
                        {saving ? 'در حال ذخیره...' : 'افزودن'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
