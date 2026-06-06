import React from 'react';
import { Box, Card, Typography } from '@mui/material';

/**
 * Premium User Dashboard – dark cinematic theme
 * Displays a welcoming Persian message inside a centered card.
 */
export default function UserDashboard() {
  return (
    <Box
      dir="rtl"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        bgcolor: '#0f0f1a', // dark background matching the app theme
        color: '#fff',
        padding: 2,
      }}
    >
      <Card
        sx={{
          p: { xs: 3, md: 5 },
          textAlign: 'center',
          bgcolor: '#1e1e2d',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          امیر عزیز، به پنل کاربری پلتفرم MovieClub خوش آمدید.
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85 }}>
          این بخش در دست توسعه است و به زودی امکانات شخصی‌سازی، لیست علاقه‌مندی‌ها و مدیریت اشتراک به این بخش اضافه خواهد شد.
        </Typography>
      </Card>
    </Box>
  );
}

