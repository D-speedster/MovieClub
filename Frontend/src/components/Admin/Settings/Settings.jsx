import React, { useState } from 'react';
import {
  Box, Tabs, Tab, Typography, Paper, Divider
} from '@mui/material';
import {
  Tv as TvIcon,
  Movie as MovieIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import SeriesSettings from './SeriesSettings';
import MovieSettings from './MovieSettings';
import GeneralSettings from './GeneralSettings';

const TABS = [
  { label: 'تنظیمات سریال',  icon: <TvIcon />,    component: <SeriesSettings /> },
  { label: 'تنظیمات فیلم',   icon: <MovieIcon />,  component: <MovieSettings /> },
  { label: 'تنظیمات عمومی',  icon: <TuneIcon />,   component: <GeneralSettings /> },
];

export default function Settings() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ direction: 'rtl', p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <Typography variant="h5" fontWeight={700} color="#f1f5f9" mb={3}>
        تنظیمات
      </Typography>

      <Paper
        elevation={0}
        sx={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: '1px solid #334155',
            '& .MuiTab-root': {
              color: '#94a3b8',
              fontFamily: 'IRANSans, Vazirmatn, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 500,
              minHeight: 56,
              gap: 1,
              flexDirection: 'row',
              '&.Mui-selected': { color: '#e50914' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#e50914', height: 3 },
          }}
        >
          {TABS.map((t, i) => (
            <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />
          ))}
        </Tabs>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {TABS[tab].component}
        </Box>
      </Paper>
    </Box>
  );
}
