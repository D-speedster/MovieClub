import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, TextField, Button, Grid,
    Chip, InputAdornment, Divider, Alert, CircularProgress,
    Autocomplete, MenuItem, Select, FormControl, InputLabel,
    Paper, Stack, IconButton, Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    Movie as MovieIcon,
    Save as SaveIcon,
    Clear as ClearIcon,
    CloudDownload as FetchIcon,
    Person as PersonIcon,
    CalendarMonth as CalendarIcon,
    Star as StarIcon,
    Timer as TimerIcon,
    Language as LanguageIcon,
    Public as CountryIcon,
    Edit as EditIcon
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
    description: '', imdb_rating: '', imdb_votes: '', duration: '',
    poster: null, posterPreview: ''
};

export default function AddMovie() {
    const [imdbId, setImdbId] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [fetched, setFetched] = useState(false);

    // ترجمه ژانر از انگلیسی به فارسی
    const translateGenres = (genreStr) => {
        if (!genreStr) return [];
        return genreStr.split(', ').map(g => {
            const found = Genre_List.find(gl => gl.en === g.trim());
            return found ? found.fa : g.trim();
        }).filter(Boolean);
    };

    // دریافت اطلاعات از OMDB
    const handleFetch = async () => {
        if (!imdbId.trim()) return;
        if (!/^tt\d+$/.test(imdbId.trim())) {
            setFetchError('فرمت IMDB ID اشتباه است. مثال: tt1234567');
            return;
        }
        if (!OMDB_API_KEY) {
            setFetchError('OMDB API Key تنظیم نشده. REACT_APP_OMDB_API_KEY را در .env تنظیم کنید.');
            return;
        }

        try {
            setFetchLoading(true);
            setFetchError('');
            const res = await axios.get(`https://www.omdbapi.com/?i=${imdbId.trim()}&plot=full&apikey=${OMDB_API_KEY}`);
            if (res.data.Error) throw new Error(res.data.Error);

            const d = res.data;
            const duration = d.Runtime ? parseInt(d.Runtime) : '';

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
                imdb_rating: d.imdbRating !== 'N/A' ? parseFloat(d.imdbRating) : '',
                imdb_votes: d.imdbVotes ? parseInt(d.imdbVotes.replace(/,/g, '')) : '',
                duration: duration,
                poster: null,
                posterPreview: d.Poster !== 'N/A' ? d.Poster : ''
            });
            setFetched(true);
            Logger.log('OMDB fetch successful:', d.Title);
        } catch (err) {
            setFetchError(err.message || 'خطا در دریافت اطلاعات از OMDB');
            Logger.error('OMDB fetch error:', err);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm(prev => ({
            ...prev,
            poster: file,
            posterPreview: URL.createObjectURL(file)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            Swal.fire({ icon: 'warning', title: 'عنوان فیلم الزامی است', background: '#1e293b', color: '#fff' });
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

            Swal.fire({ icon: 'success', title: 'فیلم با موفقیت اضافه شد', background: '#1e293b', color: '#fff', timer: 2000 });
            setForm(emptyForm);
            setImdbId('');
            setFetched(false);
        } catch (err) {
            Logger.error('Save error:', err);
            Swal.fire({ icon: 'error', title: 'خطا در ذخیره', text: err.message, background: '#1e293b', color: '#fff' });
        } finally {
            setSaveLoading(false);
        }
    };

    const allGenres = Genre_List.map(g => g.fa);

    return (
        <Box sx={{ p: 3, direction: 'rtl' }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <MovieIcon sx={{ color: '#e50914', fontSize: 32 }} />
                <Typography variant="h5" fontWeight={700} color="white">
                    افزودن فیلم جدید
                </Typography>
            </Stack>

            {/* IMDB Fetch Section */}
            <Card sx={{ mb: 3, bgcolor: '#1e293b', border: '1px solid #334155' }}>
                <CardContent>
                    <Typography variant="subtitle1" color="#94a3b8" mb={2} fontWeight={600}>
                        دریافت خودکار اطلاعات از OMDB
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <TextField
                            fullWidth
                            size="small"
                            value={imdbId}
                            onChange={e => { setImdbId(e.target.value); setFetchError(''); }}
                            placeholder="tt1234567"
                            label="IMDB ID"
                            variant="outlined"
                            onKeyDown={e => e.key === 'Enter' && handleFetch()}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748b' }} /></InputAdornment>,
                                sx: { color: 'white', bgcolor: '#0f172a' }
                            }}
                            InputLabelProps={{ sx: { color: '#64748b' } }}
                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleFetch}
                            disabled={fetchLoading || !imdbId.trim()}
                            startIcon={fetchLoading ? <CircularProgress size={16} color="inherit" /> : <FetchIcon />}
                            sx={{ bgcolor: '#e50914', '&:hover': { bgcolor: '#b91c1c' }, whiteSpace: 'nowrap', minWidth: 140 }}
                        >
                            {fetchLoading ? 'در حال دریافت...' : 'دریافت اطلاعات'}
                        </Button>
                    </Stack>
                    {fetchError && <Alert severity="error" sx={{ mt: 2, bgcolor: '#450a0a', color: '#fca5a5' }}>{fetchError}</Alert>}
                    {fetched && <Alert severity="success" sx={{ mt: 2, bgcolor: '#052e16', color: '#86efac' }}>اطلاعات با موفقیت دریافت شد — می‌توانید ویرایش کنید</Alert>}
                </CardContent>
            </Card>

            {/* Main Form */}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Left: Poster */}
                    <Grid item xs={12} md={3}>
                        <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="#94a3b8" mb={2}>پوستر فیلم</Typography>
                                <Box
                                    sx={{
                                        width: '100%', aspectRatio: '2/3', bgcolor: '#0f172a',
                                        borderRadius: 2, overflow: 'hidden', mb: 2,
                                        border: '2px dashed #334155', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {form.posterPreview ? (
                                        <img src={form.posterPreview} alt="poster" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Stack alignItems="center" spacing={1}>
                                            <MovieIcon sx={{ color: '#334155', fontSize: 48 }} />
                                            <Typography variant="caption" color="#475569">پوستر انتخاب نشده</Typography>
                                        </Stack>
                                    )}
                                </Box>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    sx={{ borderColor: '#334155', color: '#94a3b8' }}
                                >
                                    آپلود پوستر
                                    <input type="file" hidden accept="image/*" onChange={handlePosterChange} />
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right: Fields */}
                    <Grid item xs={12} md={9}>
                        <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {/* Title */}
                                    <Grid item xs={12} sm={8}>
                                        <TextField fullWidth label="عنوان فیلم *" value={form.title}
                                            onChange={e => handleChange('title', e.target.value)}
                                            InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                    {/* Type */}
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth>
                                            <InputLabel sx={{ color: '#64748b' }}>نوع</InputLabel>
                                            <Select value={form.type} label="نوع"
                                                onChange={e => handleChange('type', e.target.value)}
                                                sx={{ color: 'white', bgcolor: '#0f172a', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                            >
                                                <MenuItem value="movie">فیلم</MenuItem>
                                                <MenuItem value="series">سریال</MenuItem>
                                                <MenuItem value="anime">انیمه</MenuItem>
                                                <MenuItem value="animation">انیمیشن</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {/* Year */}
                                    <Grid item xs={6} sm={3}>
                                        <TextField fullWidth label="سال انتشار" type="number" value={form.year}
                                            onChange={e => handleChange('year', e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarIcon sx={{ color: '#64748b', fontSize: 18 }} /></InputAdornment>, sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                    {/* Duration */}
                                    <Grid item xs={6} sm={3}>
                                        <TextField fullWidth label="مدت زمان (دقیقه)" type="number" value={form.duration}
                                            onChange={e => handleChange('duration', e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><TimerIcon sx={{ color: '#64748b', fontSize: 18 }} /></InputAdornment>, sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                    {/* IMDB Rating */}
                                    <Grid item xs={6} sm={3}>
                                        <TextField fullWidth label="امتیاز IMDB" type="number" value={form.imdb_rating}
                                            onChange={e => handleChange('imdb_rating', e.target.value)}
                                            inputProps={{ step: 0.1, min: 0, max: 10 }}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><StarIcon sx={{ color: '#fbbf24', fontSize: 18 }} /></InputAdornment>, sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                    {/* Language */}
                                    <Grid item xs={6} sm={3}>
                                        <TextField fullWidth label="زبان" value={form.language}
                                            onChange={e => handleChange('language', e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><LanguageIcon sx={{ color: '#64748b', fontSize: 18 }} /></InputAdornment>, sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}><Divider sx={{ borderColor: '#334155' }} /></Grid>

                                    {/* Director */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="کارگردان" value={form.director}
                                            onChange={e => handleChange('director', e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#64748b', fontSize: 18 }} /></InputAdornment>, sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                    {/* Writer */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="نویسنده" value={form.writer}
                                            onChange={e => handleChange('writer', e.target.value)}
                                            InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                    {/* Actors */}
                                    <Grid item xs={12} sm={8}>
                                        <TextField fullWidth label="بازیگران (با کاما جدا کنید)" value={form.actors}
                                            onChange={e => handleChange('actors', e.target.value)}
                                            InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                    {/* Countries */}
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth label="کشور سازنده" value={form.countries}
                                            onChange={e => handleChange('countries', e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><CountryIcon sx={{ color: '#64748b', fontSize: 18 }} /></InputAdornment>, sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                    {/* Genres */}
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            multiple freeSolo
                                            options={allGenres}
                                            value={form.genres}
                                            onChange={(_, val) => handleChange('genres', val)}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip label={option} {...getTagProps({ index })}
                                                        sx={{ bgcolor: '#e50914', color: 'white', '& .MuiChip-deleteIcon': { color: '#fca5a5' } }}
                                                    />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} label="ژانرها"
                                                    InputProps={{ ...params.InputProps, sx: { color: 'white', bgcolor: '#0f172a' } }}
                                                    InputLabelProps={{ sx: { color: '#64748b' } }}
                                                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {/* Description */}
                                    <Grid item xs={12}>
                                        <TextField fullWidth multiline rows={4} label="خلاصه داستان" value={form.description}
                                            onChange={e => handleChange('description', e.target.value)}
                                            InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }}
                                            InputLabelProps={{ sx: { color: '#64748b' } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Submit */}
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" startIcon={<ClearIcon />}
                                onClick={() => { setForm(emptyForm); setImdbId(''); setFetched(false); }}
                                sx={{ borderColor: '#334155', color: '#94a3b8' }}
                            >
                                پاک کردن
                            </Button>
                            <Button type="submit" variant="contained" startIcon={saveLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                disabled={saveLoading}
                                sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, minWidth: 160 }}
                            >
                                {saveLoading ? 'در حال ذخیره...' : 'ذخیره و انتشار'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
