"use client";
import Link from "next/link";
import { Paper, Typography, Stack, Box, Button } from "@mui/material";
type Stats = {
  movies: number;
  series: number;
  users: number;
  pending: number;
  contacts: number;
  trailers: number;
  downloads: number;
  growth: { _id: string; count: number }[];
};
export function Dashboard({ stats }: { stats: Stats }) {
  const cards = [
    ["کاربران", stats.users, "/admin/users"],
    ["فیلم‌ها", stats.movies, "/admin/movies"],
    ["سریال‌ها", stats.series, "/admin/series"],
    ["نظرات در انتظار", stats.pending, "/admin/comments?status=pending"],
    ["پیام‌های خوانده‌نشده", stats.contacts, "/admin/contacts?read=false"],
    ["تریلرها", stats.trailers, "/admin/trailers"],
    ["لینک‌های دانلود", stats.downloads, "/admin/downloads"],
  ] as const;
  return (
    <Stack gap={3}>
      <Typography component="h2" variant="h5">
        نمای کلی
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(4,1fr)",
          },
          gap: 2,
        }}
      >
        {cards.map(([title, value, href]) => (
          <Paper key={title} variant="outlined" sx={{ p: 2.5 }}>
            <Typography color="text.secondary">{title}</Typography>
            <Typography variant="h4" sx={{ my: 2 }}>
              {value.toLocaleString("fa-IR")}
            </Typography>
            <Button component={Link} href={href} size="small">
              مشاهده
            </Button>
          </Paper>
        ))}
      </Box>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography component="h2" variant="h6" gutterBottom>
          عضویت کاربران در ماه‌های اخیر
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          بازه‌ها بر اساس ماه میلادی هستند.
        </Typography>
        {stats.growth.length ? (
          stats.growth.map((row) => (
            <Box key={row._id} sx={{ my: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <span dir="ltr">{row._id}</span>
                <span>{row.count.toLocaleString("fa-IR")} کاربر</span>
              </Stack>
              <Box
                sx={{
                  height: 8,
                  mt: 1,
                  borderRadius: 1,
                  bgcolor: "action.hover",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    width: `${(row.count / Math.max(...stats.growth.map((x) => x.count))) * 100}%`,
                  }}
                />
              </Box>
            </Box>
          ))
        ) : (
          <Typography>عضویتی در این بازه ثبت نشده است.</Typography>
        )}
      </Paper>
    </Stack>
  );
}
