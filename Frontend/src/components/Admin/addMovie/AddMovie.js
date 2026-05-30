import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, Grid, Chip,
    InputAdornment, Alert, CircularProgress, Autocomplete,
    MenuItem, Select, FormControl, InputLabel, Stack, Stepper,
    Step, StepLabel, StepContent, Fade, Zoom
} from '@mui/material';
import {
    Search as SearchIcon, Movie as MovieIcon, Save as SaveIcon,
    Clear as ClearIcon, CloudDownload as FetchIcon,
    CheckCircle as CheckIcon, ArrowForward, ArrowBack,
    AutoAwesome as MagicIcon
} from '@mui/icons-material';
import axios from 'axios';
import ApiRequest from '../../../Services/Axios/config';
import { Genre_List } from '../Utils/Variables';
import Logger from '../../../utils/logger';
import Swal from 'sweetalert2';
import './AddMovie.css';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const emptyForm = {
    title: '', type: 'movie', year: '', director: '', writer: '',
    actors: '', countries: '', language: '', genres: [],
    description: '', imdb_rating: '', duration: '',
    poster: null, posterPreview: ''
};

const allGenres = Genre_List.map(g => g.fa);

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '12px',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
};

export default function AddMovie() {
    const [imdbId, setImdbId] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [fetched, setFetched] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const translateGenres = (genreStr) => {
        if (!genreStr) return [];
        return genreStr.split(', ').map(g => {
            const found = Genre_List.find(gl => gl.en === g.trim());
            return found ? found.fa : g.trim();
        }).filter(Boolean);
    };

    const handleFetch = async () => {
        if (!imdbId.trim()) return;
        if (!/^tt\d+$/.test(imdbId.trim())) {
            setFetchError('فرمت اشتباه — مثال: tt1234567');
            return;
        }
        if (!OMDB_API_KEY) {
            setFetchError('REACT_APP_OMDB_API_KEY در .env تنظیم نشده');
            return;
        }
        try {
            setFetchLoading(true);
            setFetchError('');
            const res = await axios.get(`https://www.omdbapi.com/?i=${imdbId.trim()}&plot=full&apikey=${OMDB_API_KEY}`);
            if (res.data.Error) throw new Error(res.data.Error);
            const d = res.data;
            setForm({
                title: d.Title || '',
                type: d.Type === 'series' ? 'series' : 'movie',
                year: d.Year ? parseInt(d.Year) : '',
                director: d.Director || '',
                writer: d.Writer || '',
                actors: d.Actors || '',
                countries: d.Country || '',
                language: d.Language || '',
                genres: translateGenres(d.Genre),
                description: d.Plot || '',
                imdb_rating: d.imdbRating !== 'N/A' ? d.imdbRating : '',
                duration: d.Runtime ? parseInt(d.Runtime) : '',
                poster: null,
                posterPreview: d.Poster !== 'N/A' ? d.Poster : ''
            });
            setFetched(true);
            setActiveStep(1);
        } catch (err) {
            setFetchError(err.message || 'خطا در دریافت اطلاعات');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm(prev => ({ ...prev, poster: file, posterPreview: URL.createObjectURL(file) }));
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            Swal.fire({ icon: 'warning', title: 'عنوان فیلم الزامی است', background: '#0f0f1a', color: '#fff', confirmButtonColor: '#6366f1' });
            return;
        }
        try {
            setSaveLoading(true);
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('type', form.type);
            formData.append('year', form.year);
            formData.append('director', form.director);
            formData.append('writer', form.writer);
            formData.append('actors', form.actors);
            formData.append('countries', form.countries);
            formData.append('language', form.language);
            formData.append('genres', form.genres.join(','));
            formData.append('description', form.description);
            formData.append('rate', form.imdb_rating);
            formData.append('duration', form.duration);
            if (form.poster) formData.append('poster', form.poster);

            await ApiRequest.post('/content/new-content', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({ icon: 'success', title: '✅ فیلم اضافه شد', background: '#0f0f1a', color: '#fff', confirmButtonColor: '#6366f1', timer: 2000, showConfirmButton: false });
            setForm(emptyForm);
            setImdbId('');
            setFetched(false);
            setActiveStep(0);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'خطا در ذخیره', text: err.message, background: '#0f0f1a', color: '#fff', confirmButtonColor: '#6366f1' });
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <Box className="add-movie-root" dir="rtl">
            {/* Top Bar */}
            <Box className="add-movie-topbar">
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box className="add-movie-icon-wrap">
                        <MovieIcon sx={{ fontSize: 20, color: '#6366f1' }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700} color="white" lineHeight={1.2}>
                            افزودن فیلم جدید
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.35)">
                            اطلاعات را وارد کنید یا از OMDB دریافت کنید
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    <Button onClick={() => { setForm(emptyForm); setImdbId(''); setFetched(false); setActiveStep(0); }}
                        startIcon={<ClearIcon />} className="btn-ghost">
                        پاک کردن
                    </Button>
                    <Button onClick={handleSubmit} disabled={saveLoading}
                        startIcon={saveLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                        className="btn-primary-action">
                        {saveLoading ? 'در حال ذخیره...' : 'انتشار فیلم'}
                    </Button>
                </Stack>
            </Box>

            {/* Main Layout */}
            <Box className="add-movie-layout">
                {/* Left Panel — Poster + OMDB */}
                <Box className="add-movie-sidebar">
                    {/* Poster */}
                    <Box className="poster-upload-area" component="label">
                        <input type="file" hidden accept="image/*" onChange={handlePosterChange} />
                        {form.posterPreview ? (
                            <img src={form.posterPreview} alt="poster" className="poster-img" />
                        ) : (
                            <Box className="poster-placeholder">
                                <MovieIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.1)', mb: 1 }} />
                                <Typography variant="caption" color="rgba(255,255,255,0.25)">
                                    کلیک برای آپلود پوستر
                                </Typography>
                            </Box>
                        )}
                        <Box className="poster-overlay">
                            <Typography variant="caption" color="white">تغییر پوستر</Typography>
                        </Box>
                    </Box>

                    {/* OMDB Fetch */}
                    <Box className="omdb-card">
                        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                            <MagicIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                            <Typography variant="caption" fontWeight={600} color="rgba(255,255,255,0.6)" textTransform="uppercase" letterSpacing={1}>
                                دریافت از OMDB
                            </Typography>
                        </Stack>
                        <TextField
                            fullWidth size="small" value={imdbId}
                            onChange={e => { setImdbId(e.target.value); setFetchError(''); }}
                            placeholder="tt1234567"
                            onKeyDown={e => e.key === 'Enter' && handleFetch()}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }} /></InputAdornment>,
                            }}
                            sx={{ ...fieldSx, mb: 1.5 }}
                        />
                        <Button fullWidth onClick={handleFetch}
                            disabled={fetchLoading || !imdbId.trim()}
                            startIcon={fetchLoading ? <CircularProgress size={14} color="inherit" /> : <FetchIcon />}
                            className="btn-fetch">
                            {fetchLoading ? 'در حال دریافت...' : 'دریافت اطلاعات'}
                        </Button>
                        {fetchError && (
                            <Alert severity="error" sx={{ mt: 1.5, bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', fontSize: 12 }}>
                                {fetchError}
                            </Alert>
                        )}
                        {fetched && (
                            <Fade in>
                                <Alert icon={<CheckIcon fontSize="small" />} severity="success"
                                    sx={{ mt: 1.5, bgcolor: 'rgba(34,197,94,0.1)', color: '#86efac', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', fontSize: 12 }}>
                                    اطلاعات دریافت شد
                                </Alert>
                            </Fade>
                        )}
                    </Box>

                    {/* Quick Stats */}
                    {fetched && (
                        <Zoom in>
                            <Box className="quick-stats">
                                {form.imdb_rating && (
                                    <Box className="stat-item">
                                        <Typography variant="h6" color="#fbbf24" fontWeight={800}>{form.imdb_rating}</Typography>
                                        <Typography variant="caption" color="rgba(255,255,255,0.4)">IMDB</Typography>
                                    </Box>
                                )}
                                {form.year && (
                                    <Box className="stat-item">
                                        <Typography variant="h6" color="white" fontWeight={800}>{form.year}</Typography>
                                        <Typography variant="caption" color="rgba(255,255,255,0.4)">سال</Typography>
                                    </Box>
                                )}
                                {form.duration && (
                                    <Box className="stat-item">
                                        <Typography variant="h6" color="white" fontWeight={800}>{form.duration}</Typography>
                                        <Typography variant="caption" color="rgba(255,255,255,0.4)">دقیقه</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Zoom>
                    )}
                </Box>

                {/* Right Panel — Form Fields */}
                <Box className="add-movie-form">
                    {/* Section: اطلاعات اصلی */}
                    <Box className="form-section">
                        <Typography className="section-label">اطلاعات اصلی</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <TextField fullWidth label="عنوان فیلم *" value={form.title}
                                    onChange={e => handleChange('title', e.target.value)}
                                    sx={fieldSx}
                                    inputProps={{ style: { fontSize: 18, fontWeight: 600 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#6366f1' } }}>نوع</InputLabel>
                                    <Select value={form.type} label="نوع"
                                        onChange={e => handleChange('type', e.target.value)}
                                        sx={{
                                            color: 'white', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '12px',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.25)' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                                            '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.4)' }
                                        }}
                                    >
                                        <MenuItem value="movie">🎬 فیلم</MenuItem>
                                        <MenuItem value="series">📺 سریال</MenuItem>
                                        <MenuItem value="anime">⛩️ انیمه</MenuItem>
                                        <MenuItem value="animation">🎨 انیمیشن</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth label="سال" type="number" value={form.year}
                                    onChange={e => handleChange('year', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth label="مدت (دقیقه)" type="number" value={form.duration}
                                    onChange={e => handleChange('duration', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth label="امتیاز IMDB" type="number" value={form.imdb_rating}
                                    onChange={e => handleChange('imdb_rating', e.target.value)}
                                    inputProps={{ step: 0.1, min: 0, max: 10 }} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth label="زبان" value={form.language}
                                    onChange={e => handleChange('language', e.target.value)} sx={fieldSx} />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Section: عوامل */}
                    <Box className="form-section">
                        <Typography className="section-label">عوامل</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="کارگردان" value={form.director}
                                    onChange={e => handleChange('director', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="نویسنده" value={form.writer}
                                    onChange={e => handleChange('writer', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField fullWidth label="بازیگران (با کاما جدا کنید)" value={form.actors}
                                    onChange={e => handleChange('actors', e.target.value)} sx={fieldSx} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField fullWidth label="کشور سازنده" value={form.countries}
                                    onChange={e => handleChange('countries', e.target.value)} sx={fieldSx} />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Section: ژانر و داستان */}
                    <Box className="form-section">
                        <Typography className="section-label">ژانر و داستان</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete multiple freeSolo options={allGenres} value={form.genres}
                                    onChange={(_, val) => handleChange('genres', val)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip label={option} {...getTagProps({ index })} size="small"
                                                sx={{ bgcolor: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px' }}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="ژانرها" sx={fieldSx} />
                                    )}
                                    componentsProps={{
                                        paper: { sx: { bgcolor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' } }
                                    }}
                                    sx={{ '& .MuiAutocomplete-tag': { m: 0.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={5} label="خلاصه داستان"
                                    value={form.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                    sx={fieldSx}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
