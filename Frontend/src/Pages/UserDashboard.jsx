import React from 'react';
import { Box, Card, Typography } from '@mui/material';

// Placeholder dashboard for regular users
export default function UserDashboard() {
  return (
    <Box dir="rtl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: 'var(--adm-surface)' }}>
      <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'var(--adm-surface-2)', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          پنل کاربری شما در دست ساخت است. به زودی ویژگی‌های جذابی اضافه خواهد شد.
        </Typography>
      </Card>
    </Box>
  );
}

