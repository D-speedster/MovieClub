import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Grid, Stack,
    CircularProgress, Alert, Autocomplete, Chip,
    MenuItem, Select, FormControl, InputLabel, InputAdornment
} from '@mui/material';
import {
    Save as SaveIcon, ArrowBack as BackIcon,
    Movie as MovieIcon, Star as StarIcon,
    CalendarMonth as CalendarIcon, Timer as TimerIcon
} from '@mui/icons-material';
import ApiRequest from '../../../Services/Axios/config';
import { Genre_List } from '../Utils/Variables';
import { getPosterUrl } from '../../../utils/posterUrl';
import Swal from 'sweetalert2';
import Logger from '../../../utils/logger';

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

const allGenres = Genre_List.map(g => g.fa);

export default function EditMovie() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await ApiRequest.get(`/content/${userId}`);
                const d = res.data;
                setForm({
                    title: d.title || '',
                    type: d.type || 'movie',
                    year: d.year || '',
                    director: d.director || '',
                    writer: d.writer || '',
                    actors: Array.isArray(d.actors) ? d.actors.join(', ') : (d.actors || ''),
                    countries: Array.isArray(d.countries) ? d.countries.join(', ') : (d.countries || ''),
                    language: d.language || '',
                    genres: d.genres || [],
                    description: d.description || '',
                    imdb_rating: d.imdb?.rating || '',
                    duration: d.movie?.duration || '',
                    poster: d.poster || '',
                });
            } catch (err) {
                setError('خطا در دریافت اطلاعات فیلم');
                Logger.error('EditMovie fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [userId]);

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        if (!form.title.trim()) return;
        try {
            setSaving(true);
            await ApiRequest.put(`/content/${userId}`, {
                title: form.title,
                type: form.type,
                year: form.year ? parseInt(form.year) : undefined,
                director: form.director,
                writer: form.writer,
                actors: form.actors.split(',').map(s => s.trim()).filter(Boolean),
                countries: form.countries.split(',').map(s => s.trim()).filter(Boolean),
                language: form.language,
                genres: form.genres,
                description: form.description,
                rate: form.imdb_rating,
                duration: form.duration ? parseInt(form.duration) : undefined,
            });
            Swal.fire({ icon: 'success', title: 'تغییرات ذخیره شد', timer: 1800, showConfirmButton: false, background: 'var(--adm-surface)', color: 'var(--adm-text)' });
            navigate('/admin/movies');
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'خطا در ذخیره', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress sx={{ color: 'var(--adm-accent)' }} />
        </Box>
    );

    if (error || !form) return (
        <Alert severity="error" sx={{ bgcolor: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error || 'فیلم یافت نشد'}
        </Alert>
    );

    return (
        <Box dir="rtl">
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '9px', bgcolor: 'var(--adm-accent-subtle)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MovieIcon sx={{ fontSize: 18, color: 'var(--adm-accent)' }} />
                    </Box>
                    <Box>
                        <Typography fontWeight={700} sx={{ color: 'var(--adm-text)', fontSize: 16 }}>ویرایش فیلم</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--adm-text-3)' }}>{form.title}</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1.5}>
                    <Button onClick={() => navigate('/admin/movies')} startIcon={<BackIcon />}
                        sx={{ color: 'var(--adm-text-2)', borderColor: 'var(--adm-border)', textTransform: 'none', fontSize: 13 }} variant="outlined">
                        بازگشت
                    </Button>
                    <Button onClick={handleSave} disabled={saving} variant="contained"
                        startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
                        sx={{ bgcolor: 'var(--adm-accent)', '&:hover': { bgcolor: 'var(--adm-accent-hover)' }, textTransform: 'none', fontSize: 13, fontWeight: 600 }}>
                        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {/* Poster */}
                <Grid item xs={12} md={3}>
                    <Box sx={{ bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '10px', p: 2 }}>
                        <Typography variant="caption" sx={{ color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>پوستر</Typography>
                        <Box sx={{ mt: 1.5, borderRadius: '8px', overflow: 'hidden', aspectRatio: '2/3', bgcolor: 'var(--adm-surface-2)', border: '1px solid var(--adm-border)' }}>
                            {form.poster ? (
                                <img src={getPosterUrl(form.poster)} alt={form.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                                    <MovieIcon sx={{ fontSize: 48, color: 'var(--adm-text-3)' }} />
                                </Box>
                            )}
                        </Box>
                        <Stack direction="row" spacing={1} mt={1.5} flexWrap="wrap" gap={0.5}>
                            {form.genres.map((g, i) => (
                                <Chip key={i} label={g} size="small"
                                    sx={{ bgcolor: 'var(--adm-accent-subtle)', color: 'var(--adm-accent)', fontSize: 11, height: 22, border: '1px solid rgba(124,58,237,0.2)' }} />
                            ))}
                        </Stack>
                    </Box>
                </Grid>

                {/* Form */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '10px', p: 2.5 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <TextField fullWidth label="عنوان فیلم *" value={form.title}
                                    onChange={e => handleChange('title', e.target.value)} sx={fieldSx}
                                    inputProps={{ style: { fontSize: 16, fontWeight: 600 } }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'var(--adm-text-3)', '&.Mui-focused': { color: 'var(--adm-accent)' } }}>نوع</InputLabel>
                                    <Select value={form.type} label="نوع" onChange={e => handleChange('type', e.target.value)}
                                        sx={{ color: 'var(--adm-text)', bgcolor: 'var(--adm-surface-2)', borderRadius: '8px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--adm-border)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--adm-accent)' }, '& .MuiSvgIcon-root': { color: 'var(--adm-text-3)' } }}>
                                        <MenuItem value="movie">فیلم</MenuItem>
                                        <MenuItem value="series">سریال</MenuItem>
                                        <MenuItem value="anime">انیمه</MenuItem>
                                        <MenuItem value="animation">انیمیشن</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth label="سال" type="number" value={form.year}
                                    onChange={e => handleChange('year', e.target.value)} sx={fieldSx}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><CalendarIcon sx={{ fontSize: 16, color: 'var(--adm-text-3)' }} /></InputAdornment> }} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth label="مدت (دقیقه)" type="number" value={form.duration}
                                    onChange={e => handleChange('duration', e.target.value)} sx={fieldSx}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><TimerIcon sx={{ fontSize: 16, color: 'var(--adm-text-3)' }} /></InputAdornment> }} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth label="امتیاز IMDB" type="number" value={form.imdb_rating}
                                    onChange={e => handleChange('imdb_rating', e.target.value)}
                                    inputProps={{ step: 0.1, min: 0, max: 10 }} sx={fieldSx}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><StarIcon sx={{ fontSize: 16, color: '#fbbf24' }} /></InputAdornment> }} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth label="زبان" value={form.language}
                                    onChange={e => handleChange('language', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="کارگردان" value={form.director}
                                    onChange={e => handleChange('director', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="نویسنده" value={form.writer}
                                    onChange={e => handleChange('writer', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField fullWidth label="بازیگران (با کاما)" value={form.actors}
                                    onChange={e => handleChange('actors', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField fullWidth label="کشور سازنده" value={form.countries}
                                    onChange={e => handleChange('countries', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete multiple freeSolo options={allGenres} value={form.genres}
                                    onChange={(_, val) => handleChange('genres', val)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip label={option} {...getTagProps({ index })} size="small"
                                                sx={{ bgcolor: 'var(--adm-accent-subtle)', color: 'var(--adm-accent)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '6px' }} />
                                        ))
                                    }
                                    renderInput={(params) => <TextField {...params} label="ژانرها" sx={fieldSx} />}
                                    componentsProps={{ paper: { sx: { bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '8px' } } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={4} label="خلاصه داستان" value={form.description}
                                    onChange={e => handleChange('description', e.target.value)} sx={fieldSx} />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
