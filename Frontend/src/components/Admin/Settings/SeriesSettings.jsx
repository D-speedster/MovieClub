import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Switch, FormControlLabel, Slider,
  Select, MenuItem, FormControl, InputLabel, TextField,
  Button, Divider, Chip, Alert, CircularProgress,
  Stack, Card, CardContent,
} from '@mui/material';
import {
  Save as SaveIcon,
  Tv as TvIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import ApiRequest from '../../../Services/Axios/config';

const sx = {
  label: { color: '#94a3b8', fontFamily: 'IRANSans, Vazirmatn, sans-serif' },
  input: {
    '& .MuiOutlinedInput-root': {
      color: '#f1f5f9',
      fontFamily: 'IRANSans, Vazirmatn, sans-serif',
      '& fieldset': { borderColor: '#334155' },
      '&:hover fieldset': { borderColor: '#64748b' },
      '&.Mui-focused fieldset': { borderColor: '#e50914' },
    },
    '& .MuiInputLabel-root': { color: '#94a3b8', fontFamily: 'IRANSans, Vazirmatn, sans-serif' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#e50914' },
    '& .MuiSelect-icon': { color: '#94a3b8' },
  },
  switch: {
    '& .MuiSwitch-switchBase.Mui-checked': { color: '#e50914' },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#e50914' },
  },
  card: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 2,
    mb: 2,
  },
  sectionTitle: {
    color: '#f1f5f9',
    fontWeight: 600,
    fontFamily: 'IRANSans, Vazirmatn, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2,
  },
};

const DEFAULT = {
  perPage: 20,
  defaultSort: 'newest',
  showRating: true,
  showYear: true,
  showGenre: true,
  showEpisodeCount: true,
  showStatus: true,
  enableFilter: true,
  enableSearch: true,
  ongoingBadge: true,
};

export default function SeriesSettings() {
  const [settings, setSettings] = useState(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    ApiRequest.get('/settings/series_page')
      .then(res => {
        if (res.data?.value) setSettings({ ...DEFAULT, ...res.data.value });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    try {
      setSaving(true);
      await ApiRequest.post('/settings/series_page', {
        value: settings,
        description: 'تنظیمات صفحه سریال‌ها',
      });
      setAlert({ type: 'success', msg: 'تنظیمات با موفقیت ذخیره شد' });
    } catch {
      setAlert({ type: 'error', msg: 'خطا در ذخیره‌سازی' });
    } finally {
      setSaving(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress sx={{ color: '#e50914' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ direction: 'rtl' }}>
      {alert && (
        <Alert
          severity={alert.type}
          sx={{ mb: 3, fontFamily: 'IRANSans, Vazirmatn, sans-serif' }}
          onClose={() => setAlert(null)}
        >
          {alert.msg}
        </Alert>
      )}

      {/* ── نمایش ── */}
      <Card sx={sx.card}>
        <CardContent>
          <Typography sx={sx.sectionTitle}>
            <VisibilityIcon fontSize="small" sx={{ color: '#e50914' }} />
            تنظیمات نمایش
          </Typography>
          <Stack spacing={1}>
            {[
              { key: 'showRating',       label: 'نمایش امتیاز IMDb' },
              { key: 'showYear',         label: 'نمایش سال ساخت' },
              { key: 'showGenre',        label: 'نمایش ژانر' },
              { key: 'showEpisodeCount', label: 'نمایش تعداد قسمت‌ها' },
              { key: 'showStatus',       label: 'نمایش وضعیت سریال (در حال پخش / پایان یافته)' },
              { key: 'ongoingBadge',     label: 'نمایش badge «در حال پخش» روی کارت' },
            ].map(({ key, label }) => (
              <FormControlLabel
                key={key}
                control={
                  <Switch
                    checked={settings[key]}
                    onChange={e => set(key, e.target.checked)}
                    sx={sx.switch}
                  />
                }
                label={<Typography sx={sx.label}>{label}</Typography>}
                labelPlacement="start"
                sx={{ justifyContent: 'space-between', ml: 0, mr: 0 }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* ── فیلتر و جستجو ── */}
      <Card sx={sx.card}>
        <CardContent>
          <Typography sx={sx.sectionTitle}>
            <FilterIcon fontSize="small" sx={{ color: '#e50914' }} />
            فیلتر و جستجو
          </Typography>
          <Stack spacing={1}>
            {[
              { key: 'enableFilter', label: 'فعال بودن فیلتر ژانر / سال / امتیاز' },
              { key: 'enableSearch', label: 'فعال بودن جستجو در صفحه سریال‌ها' },
            ].map(({ key, label }) => (
              <FormControlLabel
                key={key}
                control={
                  <Switch
                    checked={settings[key]}
                    onChange={e => set(key, e.target.checked)}
                    sx={sx.switch}
                  />
                }
                label={<Typography sx={sx.label}>{label}</Typography>}
                labelPlacement="start"
                sx={{ justifyContent: 'space-between', ml: 0, mr: 0 }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* ── مرتب‌سازی و صفحه‌بندی ── */}
      <Card sx={sx.card}>
        <CardContent>
          <Typography sx={sx.sectionTitle}>
            <SortIcon fontSize="small" sx={{ color: '#e50914' }} />
            مرتب‌سازی و صفحه‌بندی
          </Typography>

          <Stack spacing={3}>
            {/* Default sort */}
            <FormControl fullWidth sx={sx.input}>
              <InputLabel>مرتب‌سازی پیش‌فرض</InputLabel>
              <Select
                value={settings.defaultSort}
                label="مرتب‌سازی پیش‌فرض"
                onChange={e => set('defaultSort', e.target.value)}
                MenuProps={{ PaperProps: { sx: { background: '#1e293b', color: '#f1f5f9' } } }}
              >
                <MenuItem value="newest">جدیدترین</MenuItem>
                <MenuItem value="oldest">قدیمی‌ترین</MenuItem>
                <MenuItem value="rating">بالاترین امتیاز</MenuItem>
                <MenuItem value="name">نام سریال (الفبا)</MenuItem>
              </Select>
            </FormControl>

            {/* Per page */}
            <Box>
              <Typography sx={{ ...sx.label, mb: 1 }}>
                تعداد سریال در هر صفحه: <Chip label={settings.perPage} size="small" sx={{ background: '#e50914', color: '#fff', mr: 1 }} />
              </Typography>
              <Slider
                value={settings.perPage}
                min={8}
                max={60}
                step={4}
                marks={[
                  { value: 8,  label: '۸' },
                  { value: 20, label: '۲۰' },
                  { value: 40, label: '۴۰' },
                  { value: 60, label: '۶۰' },
                ]}
                onChange={(_, v) => set('perPage', v)}
                sx={{
                  color: '#e50914',
                  '& .MuiSlider-markLabel': { color: '#64748b', fontFamily: 'IRANSans, Vazirmatn, sans-serif', fontSize: '0.75rem' },
                  '& .MuiSlider-thumb': { '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(229,9,20,0.16)' } },
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Save button */}
      <Box display="flex" justifyContent="flex-start">
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            background: '#e50914',
            fontFamily: 'IRANSans, Vazirmatn, sans-serif',
            fontWeight: 600,
            px: 4,
            py: 1.2,
            borderRadius: 2,
            '&:hover': { background: '#c40812' },
            '&:disabled': { opacity: 0.6 },
          }}
        >
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </Button>
      </Box>
    </Box>
  );
}
