import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Switch, FormControlLabel,
  Select, MenuItem, FormControl, InputLabel, TextField,
  Button, Alert, CircularProgress, Stack, Card, CardContent,
} from '@mui/material';
import {
  Save as SaveIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon,
  Tune as TuneIcon,
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
  card: { background: '#0f172a', border: '1px solid #334155', borderRadius: 2, mb: 2 },
  sectionTitle: {
    color: '#f1f5f9', fontWeight: 600,
    fontFamily: 'IRANSans, Vazirmatn, sans-serif',
    display: 'flex', alignItems: 'center', gap: 1, mb: 2,
  },
};

const DEFAULT = {
  language: 'fa',
  freeMode: true,
  merchantCode: '',
};

export default function GeneralSettings() {
  const [settings, setSettings] = useState(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    ApiRequest.get('/settings/general')
      .then(res => { if (res.data?.value) setSettings({ ...DEFAULT, ...res.data.value }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    try {
      setSaving(true);
      await ApiRequest.post('/settings/general', { value: settings, description: 'تنظیمات عمومی سایت' });
      setAlert({ type: 'success', msg: 'تنظیمات با موفقیت ذخیره شد' });
    } catch {
      setAlert({ type: 'error', msg: 'خطا در ذخیره‌سازی' });
    } finally {
      setSaving(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress sx={{ color: '#e50914' }} /></Box>;

  return (
    <Box sx={{ direction: 'rtl' }}>
      {alert && <Alert severity={alert.type} sx={{ mb: 3, fontFamily: 'IRANSans, Vazirmatn, sans-serif' }} onClose={() => setAlert(null)}>{alert.msg}</Alert>}

      {/* زبان */}
      <Card sx={sx.card}>
        <CardContent>
          <Typography sx={sx.sectionTitle}><LanguageIcon fontSize="small" sx={{ color: '#e50914' }} />زبان سایت</Typography>
          <FormControl fullWidth sx={sx.input}>
            <InputLabel>زبان</InputLabel>
            <Select value={settings.language} label="زبان" onChange={e => set('language', e.target.value)}
              MenuProps={{ PaperProps: { sx: { background: '#1e293b', color: '#f1f5f9' } } }}>
              <MenuItem value="fa">فارسی</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ color: '#475569', mt: 1, display: 'block' }}>
            به صورت پیش‌فرض زبان فارسی است
          </Typography>
        </CardContent>
      </Card>

      {/* اشتراک */}
      <Card sx={sx.card}>
        <CardContent>
          <Typography sx={sx.sectionTitle}><PaymentIcon fontSize="small" sx={{ color: '#e50914' }} />حالت دسترسی</Typography>
          <FormControlLabel
            control={<Switch checked={settings.freeMode} onChange={e => set('freeMode', e.target.checked)} sx={sx.switch} />}
            label={<Typography sx={sx.label}>حالت رایگان (بدون نیاز به خرید اشتراک)</Typography>}
            labelPlacement="start"
            sx={{ justifyContent: 'space-between', ml: 0, mr: 0, mb: 2 }}
          />
          <TextField
            fullWidth
            label="کد مرچنت درگاه پرداخت"
            value={settings.merchantCode}
            onChange={e => set('merchantCode', e.target.value)}
            placeholder="در صورت استفاده از درگاه پرداخت وارد کنید"
            disabled={settings.freeMode}
            sx={sx.input}
          />
          <Typography variant="caption" sx={{ color: '#475569', mt: 1, display: 'block' }}>
            برای فعال‌سازی درگاه، ابتدا حالت رایگان را غیرفعال کنید
          </Typography>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="flex-start">
        <Button variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          onClick={handleSave} disabled={saving}
          sx={{ background: '#e50914', fontFamily: 'IRANSans, Vazirmatn, sans-serif', fontWeight: 600, px: 4, py: 1.2, borderRadius: 2, '&:hover': { background: '#c40812' } }}>
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </Button>
      </Box>
    </Box>
  );
}
