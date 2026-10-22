"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { canManageUser, type Role } from "@/lib/permissions";
import {
  qualityOptions,
  type AdminRow,
  type PageData,
  type Resource,
} from "@/lib/management";
type Option = { _id: string; title: string; type: "movie" | "series" };
type FormValue = string | number | boolean | null;
type Field = {
  name: string;
  label: string;
  type?: "number" | "url" | "password" | "email";
  required?: boolean;
  multiline?: boolean;
  options?: readonly string[];
  min?: number;
  max?: number;
};
const titles: Record<Resource, string> = {
  trailers: "تریلرها",
  downloads: "لینک‌های دانلود",
  users: "کاربران",
  comments: "نظرات",
  contacts: "پیام‌های تماس",
};
const roleLabels: Record<Role, string> = {
  User: "کاربر",
  Admin: "مدیر",
  Owner: "مالک",
};
const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  approved: "تأییدشده",
  rejected: "ردشده",
};
const fields: Partial<Record<Resource, Field[]>> = {
  trailers: [
    { name: "title", label: "عنوان", required: true },
    { name: "youtubeUrl", label: "آدرس یوتیوب", type: "url", required: true },
    { name: "poster", label: "نام فایل یا آدرس پوستر" },
  ],
  downloads: [
    {
      name: "quality",
      label: "کیفیت",
      required: true,
      options: qualityOptions,
    },
    { name: "size", label: "حجم فایل", required: true },
    { name: "url", label: "لینک دانلود", type: "url", required: true },
    { name: "encoder", label: "انکودر" },
    { name: "label", label: "توضیح" },
    { name: "subtitleUrl", label: "آدرس زیرنویس", type: "url" },
    {
      name: "season",
      label: "فصل (اختیاری)",
      type: "number",
      min: 1,
      max: 1000,
    },
    {
      name: "episode",
      label: "قسمت (اختیاری)",
      type: "number",
      min: 1,
      max: 10000,
    },
  ],
  users: [
    { name: "name", label: "نام", required: true },
    { name: "username", label: "نام کاربری", required: true },
    { name: "email", label: "ایمیل", type: "email", required: true },
    { name: "password", label: "رمز عبور", type: "password", required: true },
  ],
};
function emptyForm(resource: Resource): Record<string, FormValue> {
  return resource === "downloads"
    ? {
        contentId: "",
        quality: "1080p",
        size: "",
        url: "",
        encoder: "",
        label: "",
        subtitle: false,
        subtitleUrl: "",
        dubbed: false,
        season: "",
        episode: "",
      }
    : resource === "trailers"
      ? { title: "", youtubeUrl: "", poster: "", contentId: "" }
      : { name: "", username: "", email: "", password: "", role: "User" };
}
function contentName(row: AdminRow) {
  return row.contentId && typeof row.contentId === "object"
    ? row.contentId.title
    : "بدون محتوای مرتبط";
}
export function ResourceManager({
  resource,
  data,
  options: initialOptions,
  actor,
  filters,
}: {
  resource: Resource;
  data: PageData;
  options: Option[];
  actor: { id: string; role: Role };
  filters: Record<string, string>;
}) {
  const router = useRouter(),
    pathname = usePathname();
  const [query, setQuery] = useState(filters.q || "");
  const [dialog, setDialog] = useState(false),
    [editing, setEditing] = useState<AdminRow | null>(null),
    [removing, setRemoving] = useState<AdminRow | null>(null);
  const [form, setForm] = useState<Record<string, FormValue>>(
    emptyForm(resource),
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const [options, setOptions] = useState<Option[]>(initialOptions),
    [term, setTerm] = useState(""),
    [lookupBusy, setLookupBusy] = useState(false);
  useEffect(() => {
    setQuery(filters.q || "");
  }, [filters.q]);
  useEffect(() => {
    if (!dialog || !["trailers", "downloads"].includes(resource) || !term)
      return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLookupBusy(true);
      try {
        const response = await fetch(
          `/api/admin/content-options?q=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setOptions(result);
      } catch (e) {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "جستجوی محتوا انجام نشد");
      } finally {
        if (!controller.signal.aborted) setLookupBusy(false);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [term, dialog, resource]);
  function navigate(changes: Record<string, string>) {
    const values = { ...filters, ...changes };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(values)) if (v) p.set(k, v);
    router.push(`${pathname}?${p}`);
  }
  function open(row?: AdminRow) {
    setError("");
    setEditing(row || null);
    setTerm("");
    setOptions(initialOptions);
    setForm(
      row
        ? {
            ...emptyForm(resource),
            ...Object.fromEntries(
              Object.entries(row).filter(
                ([, v]) =>
                  v === null ||
                  ["string", "number", "boolean"].includes(typeof v),
              ),
            ),
            season: row.season ?? "",
            episode: row.episode ?? "",
            contentId: row.contentId
              ? typeof row.contentId === "object"
                ? row.contentId._id
                : row.contentId
              : "",
          }
        : emptyForm(resource),
    );
    setDialog(true);
  }
  function canChange(row: AdminRow) {
    return (
      resource !== "users" ||
      canManageUser(actor, { id: row._id, role: row.role || "User" })
    );
  }
  async function mutate(url: string, method: string, body?: unknown) {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("پاسخ سرور معتبر نیست");
    }
    if (!response.ok) throw new Error(result.message || "عملیات انجام نشد");
    return result;
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      let body: Record<string, unknown> = { ...form };
      if (resource === "downloads")
        body = {
          ...body,
          season: form.season === "" ? null : Number(form.season),
          episode: form.episode === "" ? null : Number(form.episode),
        };
      if (resource === "users" && editing) body = { role: form.role };
      const url = editing
        ? resource === "users"
          ? `/api/users/${editing._id}`
          : `/api/admin/${resource}/${editing._id}`
        : `/api/admin/${resource}`;
      await mutate(
        url,
        editing ? (resource === "users" ? "PUT" : "PATCH") : "POST",
        body,
      );
      setDialog(false);
      setSuccess("تغییرات ذخیره شد");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره انجام نشد");
    } finally {
      setBusy(false);
    }
  }
  async function status(row: AdminRow, body: unknown) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await mutate(`/api/admin/${resource}/${row._id}`, "PATCH", body);
      setSuccess("وضعیت به‌روزرسانی شد");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "عملیات انجام نشد");
    } finally {
      setBusy(false);
    }
  }
  const selected =
    options.find((x) => x._id === form.contentId) ||
    (editing?.contentId &&
    typeof editing.contentId === "object" &&
    editing.contentId._id === form.contentId
      ? (editing.contentId as Option)
      : null);
  const lookupOptions =
    selected && !options.some((x) => x._id === selected._id)
      ? [selected, ...options]
      : options;
  return (
    <Stack gap={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Typography component="h2" variant="h5">
          {titles[resource]} ({data.total.toLocaleString("fa-IR")})
        </Typography>
        {["users", "trailers", "downloads"].includes(resource) && (
          <Button variant="contained" onClick={() => open()}>
            افزودن
          </Button>
        )}
      </Stack>
      {error && !dialog && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          navigate({ q: query, page: "1" });
        }}
        sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
      >
        <TextField
          size="small"
          label="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 120 } }}
        />
        {resource === "comments" && (
          <TextField
            size="small"
            label="وضعیت"
            select
            value={filters.status || ""}
            onChange={(e) => navigate({ status: e.target.value, page: "1" })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">همه وضعیت‌ها</MenuItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        )}
        {resource === "contacts" && (
          <TextField
            size="small"
            label="وضعیت پیام"
            select
            value={filters.read || ""}
            onChange={(e) => navigate({ read: e.target.value, page: "1" })}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">همه پیام‌ها</MenuItem>
            <MenuItem value="false">خوانده‌نشده</MenuItem>
            <MenuItem value="true">خوانده‌شده</MenuItem>
          </TextField>
        )}
        <Button type="submit" variant="outlined">
          جستجو
        </Button>
        {filters.contentId && (
          <Button onClick={() => navigate({ contentId: "", page: "1" })}>
            حذف فیلتر محتوا
          </Button>
        )}
      </Box>
      <TableContainer
        component={Paper}
        variant="outlined"
        tabIndex={0}
        aria-label="جدول قابل پیمایش افقی"
      >
        <Table aria-label={titles[resource]} sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>اطلاعات</TableCell>
              <TableCell>جزئیات</TableCell>
              <TableCell>وضعیت</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="admin-table-cell">
                  <Typography fontWeight={600}>
                    {row.title || row.name || row.username || contentName(row)}
                  </Typography>
                  {resource === "users" && (
                    <Typography variant="body2" dir="ltr">
                      @{row.username}
                    </Typography>
                  )}
                  {["trailers", "downloads", "comments"].includes(resource) && (
                    <Typography variant="body2" color="text.secondary">
                      {contentName(row)}
                    </Typography>
                  )}
                  {row.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(row.createdAt).toLocaleDateString("fa-IR", {
                        timeZone: "Asia/Tehran",
                      })}
                    </Typography>
                  )}
                </TableCell>
                <TableCell className="admin-table-cell">
                  {resource === "users" ? (
                    <span dir="ltr">{row.email}</span>
                  ) : resource === "contacts" ? (
                    <>
                      <Typography variant="body2" dir="ltr">
                        {row.email}
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        {row.message}
                      </Typography>
                    </>
                  ) : resource === "comments" ? (
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {row.text}
                    </Typography>
                  ) : resource === "downloads" ? (
                    <>
                      <Typography>
                        {row.quality} · {row.size}
                      </Typography>
                      {row.season && (
                        <Typography>
                          فصل {row.season}، قسمت {row.episode}
                        </Typography>
                      )}
                      <Typography>{row.label}</Typography>
                      <Typography>
                        {row.encoder}
                        {row.dubbed ? " · دوبله" : ""}
                        {row.subtitle ? " · زیرنویس" : ""}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      dir="ltr"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {row.youtubeUrl}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {resource === "users" ? (
                    <Chip label={roleLabels[row.role || "User"]} size="small" />
                  ) : resource === "comments" ? (
                    <Chip
                      label={statusLabels[row.status || "pending"]}
                      color={
                        row.status === "approved"
                          ? "success"
                          : row.status === "rejected"
                            ? "error"
                            : "warning"
                      }
                      size="small"
                    />
                  ) : resource === "contacts" ? (
                    <Chip
                      label={row.read ? "خوانده‌شده" : "خوانده‌نشده"}
                      color={row.read ? "default" : "warning"}
                      size="small"
                    />
                  ) : resource === "downloads" ? (
                    <Chip label="لینک دانلود" size="small" />
                  ) : (
                    <Chip label="تریلر مستقل" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {["trailers", "downloads", "users"].includes(resource) && (
                      <Button
                        disabled={busy || !canChange(row)}
                        onClick={() => open(row)}
                      >
                        ویرایش
                      </Button>
                    )}
                    {resource === "comments" &&
                      Object.entries(statusLabels)
                        .filter(([value]) => value !== row.status)
                        .map(([value, label]) => (
                          <Button
                            size="small"
                            key={value}
                            disabled={busy}
                            onClick={() => status(row, { status: value })}
                          >
                            {label}
                          </Button>
                        ))}
                    {resource === "contacts" && (
                      <Button
                        disabled={busy}
                        onClick={() => status(row, { read: !row.read })}
                      >
                        {row.read ? "خوانده‌نشده" : "علامت خوانده‌شده"}
                      </Button>
                    )}
                    <Button
                      color="error"
                      disabled={busy || !canChange(row)}
                      onClick={() => {
                        setError("");
                        setRemoving(row);
                      }}
                    >
                      حذف
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {!data.items.length && (
              <TableRow>
                <TableCell colSpan={4}>رکوردی یافت نشد.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Button
          disabled={data.page <= 1}
          onClick={() => navigate({ page: String(data.page - 1) })}
        >
          قبل
        </Button>
        <Typography>
          صفحه {data.page.toLocaleString("fa-IR")} از{" "}
          {Math.max(1, data.pages).toLocaleString("fa-IR")}
        </Typography>
        <Button
          disabled={data.page >= data.pages}
          onClick={() => navigate({ page: String(data.page + 1) })}
        >
          بعد
        </Button>
      </Stack>
      <Dialog
        open={dialog}
        onClose={() => {
          if (!busy) setDialog(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={save}>
          <DialogTitle>
            {editing ? "ویرایش" : "افزودن"} {titles[resource]}
          </DialogTitle>
          <DialogContent>
            <Stack gap={2} sx={{ pt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {["trailers", "downloads"].includes(resource) && (
                <Autocomplete
                  options={lookupOptions}
                  value={selected}
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(a, b) => a._id === b._id}
                  filterOptions={(items) => items}
                  loading={lookupBusy}
                  onInputChange={(_, value, reason) => {
                    if (reason === "input") setTerm(value);
                  }}
                  onChange={(_, value) =>
                    setForm({ ...form, contentId: value?._id || "" })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        resource === "downloads"
                          ? "فیلم یا سریال *"
                          : "فیلم یا سریال مرتبط (اختیاری)"
                      }
                      helperText="برای یافتن عنوان، بخشی از نام آن را وارد کنید"
                      required={resource === "downloads"}
                    />
                  )}
                />
              )}
              {!(resource === "users" && editing) &&
                (fields[resource] || []).map((field) => (
                  <TextField
                    key={field.name}
                    label={field.label}
                    value={form[field.name] ?? ""}
                    onChange={(event) =>
                      setForm({ ...form, [field.name]: event.target.value })
                    }
                    required={field.required}
                    type={field.type || "text"}
                    select={!!field.options}
                    slotProps={{
                      htmlInput: {
                        min: field.min,
                        max: field.max,
                        maxLength: field.name === "password" ? 72 : 2048,
                      },
                    }}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                ))}
              {resource === "downloads" && (
                <Stack direction="row">
                  <FormControlLabel
                    label="زیرنویس دارد"
                    control={
                      <Switch
                        checked={!!form.subtitle}
                        onChange={(event) =>
                          setForm({ ...form, subtitle: event.target.checked })
                        }
                      />
                    }
                  />
                  <FormControlLabel
                    label="دوبله فارسی"
                    control={
                      <Switch
                        checked={!!form.dubbed}
                        onChange={(event) =>
                          setForm({ ...form, dubbed: event.target.checked })
                        }
                      />
                    }
                  />
                </Stack>
              )}
              {resource === "users" && (
                <TextField
                  label="نقش"
                  select
                  value={form.role || "User"}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                >
                  {(
                    [
                      "User",
                      "Admin",
                      ...(actor.role === "Owner" ? ["Owner"] : []),
                    ] as Role[]
                  ).map((role) => (
                    <MenuItem key={role} value={role}>
                      {roleLabels[role]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button disabled={busy} onClick={() => setDialog(false)}>
              انصراف
            </Button>
            <Button type="submit" disabled={busy} variant="contained">
              {busy ? "در حال ذخیره…" : "ذخیره"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={!!removing}
        onClose={() => {
          if (!busy) setRemoving(null);
        }}
      >
        <DialogTitle>حذف رکورد</DialogTitle>
        <DialogContent>
          <DialogContentText>
            این رکورد حذف شود؟ این عمل قابل بازگشت نیست.
            {resource === "trailers" ? " محتوای اصلی حفظ می‌شود." : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setRemoving(null)}>
            انصراف
          </Button>
          <Button
            color="error"
            disabled={busy}
            onClick={async () => {
              if (!removing) return;
              setBusy(true);
              setError("");
              try {
                await mutate(
                  resource === "users"
                    ? `/api/users/${removing._id}`
                    : `/api/admin/${resource}/${removing._id}`,
                  "DELETE",
                );
                setRemoving(null);
                setSuccess("رکورد حذف شد");
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
