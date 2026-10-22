"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import type { ContentDTO } from "@/lib/content";
export function ContentList({
  data,
  type,
}: {
  data: { items: ContentDTO[]; total: number; page: number; pages: number };
  type: "movie" | "series";
}) {
  const router = useRouter();
  const [target, setTarget] = useState<ContentDTO | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const base = type === "movie" ? "/admin/movies" : "/admin/series";
  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography component="h2" variant="h5">
          {type === "movie" ? "فیلم‌ها" : "سریال‌ها"} (
          {data.total.toLocaleString("fa-IR")})
        </Typography>
        <Button component={Link} href="/admin/new" variant="contained">
          افزودن محتوا
        </Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer
        component={Paper}
        variant="outlined"
        tabIndex={0}
        aria-label="جدول قابل پیمایش افقی"
      >
        <Table aria-label="فهرست محتوا" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>عنوان</TableCell>
              <TableCell>سال</TableCell>
              <TableCell>امتیاز</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.year || "—"}</TableCell>
                <TableCell>{item.imdb?.rating ?? 0}</TableCell>
                <TableCell>
                  <Stack direction="row" gap={1}>
                    <Button component={Link} href={`/admin/edit/${item._id}`}>
                      ویرایش
                    </Button>
                    <Button
                      component={Link}
                      href={`/movie/${item.slug || item._id}`}
                    >
                      مشاهده
                    </Button>
                    <Button color="error" onClick={() => setTarget(item)}>
                      حذف
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {!data.items.length && (
              <TableRow>
                <TableCell colSpan={4}>محتوایی ثبت نشده است.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="center" gap={2}>
        {data.page > 1 && (
          <Button component={Link} href={`${base}?page=${data.page - 1}`}>
            قبل
          </Button>
        )}
        <Typography>صفحه {data.page.toLocaleString("fa-IR")}</Typography>
        {data.page < data.pages && (
          <Button component={Link} href={`${base}?page=${data.page + 1}`}>
            بعد
          </Button>
        )}
      </Stack>
      <Dialog
        open={!!target}
        onClose={() => {
          if (!busy) setTarget(null);
        }}
      >
        <DialogTitle>حذف محتوا</DialogTitle>
        <DialogContent>
          <DialogContentText>
            «{target?.title}» همراه با لینک‌ها، تریلرها و نظرات وابسته حذف شود؟
            این عمل قابل بازگشت نیست.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setTarget(null)}>
            انصراف
          </Button>
          <Button
            disabled={busy}
            color="error"
            onClick={async () => {
              if (!target) return;
              setBusy(true);
              setError("");
              try {
                const response = await fetch(`/api/content/${target._id}`, {
                  method: "DELETE",
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                setTarget(null);
                router.refresh();
              } catch (e) {
                setError(e instanceof Error ? e.message : "حذف انجام نشد");
              } finally {
                setBusy(false);
              }
            }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
