"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Button, IconButton, Drawer, Alert } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import MovieIcon from "@mui/icons-material/MovieOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutline";
import DownloadIcon from "@mui/icons-material/DownloadOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutline";
import MailIcon from "@mui/icons-material/MailOutline";
import PlayIcon from "@mui/icons-material/PlayCircleOutline";
import DarkIcon from "@mui/icons-material/DarkModeOutlined";
import LightIcon from "@mui/icons-material/LightModeOutlined";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
const links = [
  { title: "داشبورد", href: "/admin", icon: DashboardIcon },
  { title: "فیلم‌ها", href: "/admin/movies", icon: MovieIcon },
  { title: "سریال‌ها", href: "/admin/series", icon: MovieIcon },
  { title: "افزودن محتوا", href: "/admin/new", icon: MovieIcon },
  { title: "تریلرها", href: "/admin/trailers", icon: PlayIcon },
  { title: "لینک‌های دانلود", href: "/admin/downloads", icon: DownloadIcon },
  { title: "کاربران", href: "/admin/users", icon: PeopleIcon },
  { title: "نظرات", href: "/admin/comments", icon: CommentIcon },
  { title: "پیام‌های تماس", href: "/admin/contacts", icon: MailIcon },
];
export function AdminShell({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  const pathname = usePathname(),
    router = useRouter();
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("admin-theme");
    if (saved === "light") setMode("light");
  }, []);
  const theme = useMemo(
    () =>
      createTheme({
        direction: "rtl",
        palette: {
          mode,
          primary: { main: "#7c3aed" },
          background: {
            default: mode === "dark" ? "#09090b" : "#f4f4f5",
            paper: mode === "dark" ? "#18181b" : "#fff",
          },
        },
        typography: {
          fontFamily: "IRANSans, sans-serif",
          button: { textTransform: "none" },
        },
        shape: { borderRadius: 8 },
        components: {
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottomColor: mode === "dark" ? "#3f3f46" : "#e4e4e7",
              },
            },
          },
        },
      }),
    [mode],
  );
  const navigation = (
    <>
      <div className="sidebar-header">
        <h2>مووی کلاب</h2>
        <span className="sidebar-subtitle">پنل مدیریت</span>
      </div>
      <nav className="sidebar-nav" aria-label="ناوبری مدیریت">
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className={`nav-item ${pathname === link.href ? "active" : ""}`}
            aria-current={pathname === link.href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            <link.icon className="nav-icon" fontSize="small" />
            <span>{link.title}</span>
          </Link>
        ))}
        <Link href="/" className="nav-item">
          بازگشت به سایت
        </Link>
      </nav>
    </>
  );
  return (
    <AppRouterCacheProvider
      options={{ key: "admin-mui", stylisPlugins: [prefixer, rtlPlugin] }}
    >
      <ThemeProvider theme={theme}>
        <div className="admin-dashboard" data-theme={mode}>
          <aside className="admin-sidebar">{navigation}</aside>
          <Drawer
            anchor="right"
            open={open}
            onClose={() => setOpen(false)}
            slotProps={{
              paper: {
                style: { right: 0, left: "auto" },
                sx: {
                  width: 260,
                  bgcolor: "background.paper",
                  color: "text.primary",
                  backgroundImage: "none",
                },
              },
            }}
          >
            <IconButton
              onClick={() => setOpen(false)}
              aria-label="بستن منوی مدیریت"
            >
              <CloseIcon />
            </IconButton>
            {navigation}
          </Drawer>
          <main className="admin-main">
            <header className="admin-header">
              <IconButton
                className="admin-mobile-toggle"
                onClick={() => setOpen(true)}
                aria-label="باز کردن منوی مدیریت"
              >
                <MenuIcon />
              </IconButton>
              <h1>
                {links.find((x) => x.href === pathname)?.title ||
                  "مدیریت محتوا"}
              </h1>
              <div className="admin-user">
                <span className="admin-user__name">{name}</span>
                <IconButton
                  aria-label={mode === "dark" ? "تم روشن" : "تم تاریک"}
                  onClick={() => {
                    const next = mode === "dark" ? "light" : "dark";
                    setMode(next);
                    localStorage.setItem("admin-theme", next);
                  }}
                >
                  {mode === "dark" ? <LightIcon /> : <DarkIcon />}
                </IconButton>
                <Button
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      const response = await fetch("/api/auth/logout", {
                        method: "POST",
                      });
                      if (!response.ok) throw new Error();
                      router.push("/auth/login");
                      router.refresh();
                    } catch {
                      setError("خروج انجام نشد؛ دوباره تلاش کنید");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  خروج
                </Button>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-content-wrapper">
                {error && <Alert severity="error">{error}</Alert>}
                {children}
              </div>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
