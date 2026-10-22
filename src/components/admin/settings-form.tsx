"use client";
import { useState, useEffect } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { heroKeys, type HeroKey, type SettingsDTO } from "@/lib/settings";
import { MAX_IMAGE_BYTES } from "@/lib/media";
import { posterUrl } from "@/lib/content";
type Option = { _id: string; title: string; type: string };
function HeroPreview({ file, reference }: { file?: File; reference: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  const src = file ? url : reference ? posterUrl(reference) : "";
  return src ? (
    <Box
      component="img"
      src={src}
      alt="پیش‌نمایش بنر"
      sx={{
        width: "100%",
        maxWidth: 520,
        maxHeight: 200,
        objectFit: "contain",
        borderRadius: 1,
      }}
    />
  ) : null;
}
const labels = {
  home: "صفحه اصلی",
  movies: "فیلم‌ها",
  series: "سریال‌ها",
  anime: "انیمه",
};
export function SettingsForm({
  initial,
  selected,
}: {
  initial: SettingsDTO;
  selected: Option[];
}) {
  const [settings, setSettings] = useState(initial);
  const [chosen, setChosen] = useState(selected);
  const [files, setFiles] = useState<Partial<Record<HeroKey, File>>>({});
  const [options, setOptions] = useState<Option[]>(selected);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/admin/content-options?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "جستجو انجام نشد");
        setOptions(data);
      } catch (e) {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "جستجو انجام نشد");
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  const setText = (
    key: keyof Omit<SettingsDTO, "heroes" | "featuredIds" | "revision">,
    value: string,
  ) => setSettings((current) => ({ ...current, [key]: value }));
  function selectFile(key: HeroKey, input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      !file.size ||
      file.size > MAX_IMAGE_BYTES
    ) {
      setError("بنر باید JPEG، PNG یا WebP و حداکثر ۵ مگابایت باشد");
      return;
    }
    setError("");
    setFiles((current) => ({ ...current, [key]: file }));
    setSuccess("");
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const data = { ...settings, featuredIds: chosen.map((item) => item._id) };
      const form = new FormData();
      form.set("data", JSON.stringify(data));
      for (const key of heroKeys)
        if (files[key]) form.set(`hero_${key}`, files[key]!);
      const multipart = Object.values(files).some(Boolean);
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        ...(multipart
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
        body: multipart ? form : JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "ذخیره نشد");
      setSettings(result);
      setFiles({});
      setSuccess("تنظیمات ذخیره شد");
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره نشد");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, maxWidth: 960, mx: "auto" }}>
      <Typography variant="h5" component="h2" mb={3}>
        تنظیمات سایت
      </Typography>
      <Box component="form" onSubmit={save}>
        <Box
          component="fieldset"
          disabled={busy}
          sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}
        >
          <Stack spacing={3}>
            {(
              [
                "siteName",
                "description",
                "heroTitle",
                "heroSubtitle",
                "footerText",
                "telegram",
                "instagram",
              ] as const
            ).map((key, index) => (
              <TextField
                key={key}
                label={
                  [
                    "نام سایت",
                    "توضیحات سئو",
                    "عنوان بنر اصلی",
                    "متن بنر اصلی",
                    "متن فوتر",
                    "آدرس تلگرام",
                    "آدرس اینستاگرام",
                  ][index]
                }
                value={settings[key]}
                onChange={(e) => setText(key, e.target.value)}
                required={["siteName", "description", "heroTitle"].includes(
                  key,
                )}
                multiline={[
                  "description",
                  "heroSubtitle",
                  "footerText",
                ].includes(key)}
              />
            ))}
            <Typography variant="h6" component="h3">
              محتوای ویژه صفحه اصلی
            </Typography>
            <Autocomplete
              multiple
              disabled={busy}
              options={[
                ...chosen,
                ...options.filter(
                  (item) => !chosen.some((current) => current._id === item._id),
                ),
              ]}
              value={chosen}
              filterOptions={(items) => items}
              getOptionLabel={(item) => item.title}
              isOptionEqualToValue={(a, b) => a._id === b._id}
              onInputChange={(_, value, reason) => {
                if (reason === "input" || reason === "clear") setQuery(value);
              }}
              onChange={(_, value) => {
                if (value.length > 12) {
                  setError("حداکثر ۱۲ محتوای ویژه مجاز است");
                  return;
                }
                setChosen(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="انتخاب محتوای ویژه"
                  helperText="با جستجوی عنوان انتخاب کنید؛ ترتیب نمایش را در فهرست زیر تغییر دهید."
                />
              )}
            />
            {chosen.map((item, index) => (
              <Stack
                key={item._id}
                direction="row"
                gap={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography sx={{ flex: 1, minWidth: 120 }}>
                  {index + 1}. {item.title}
                </Typography>
                <Button
                  disabled={busy || index === 0}
                  aria-label={`بالا بردن ${item.title}`}
                  onClick={() =>
                    setChosen((current) => {
                      const next = [...current];
                      [next[index - 1], next[index]] = [
                        next[index],
                        next[index - 1],
                      ];
                      return next;
                    })
                  }
                >
                  بالا
                </Button>
                <Button
                  disabled={busy || index === chosen.length - 1}
                  aria-label={`پایین بردن ${item.title}`}
                  onClick={() =>
                    setChosen((current) => {
                      const next = [...current];
                      [next[index + 1], next[index]] = [
                        next[index],
                        next[index + 1],
                      ];
                      return next;
                    })
                  }
                >
                  پایین
                </Button>
                <Button
                  color="error"
                  aria-label={`حذف ${item.title} از ویژه‌ها`}
                  onClick={() =>
                    setChosen((current) =>
                      current.filter((row) => row._id !== item._id),
                    )
                  }
                >
                  حذف از ویژه‌ها
                </Button>
              </Stack>
            ))}
            {heroKeys.map((key) => (
              <Stack key={key} spacing={1}>
                <Typography variant="h6" component="h3">
                  بنر {labels[key]}
                </Typography>
                <HeroPreview
                  file={files[key]}
                  reference={settings.heroes[key]}
                />
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Button component="label" variant="outlined">
                    انتخاب بنر {labels[key]}
                    <input
                      hidden
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-label={`فایل بنر ${labels[key]}`}
                      onChange={(e) => selectFile(key, e.currentTarget)}
                    />
                  </Button>
                  {files[key] && (
                    <Button
                      onClick={() =>
                        setFiles((current) => ({
                          ...current,
                          [key]: undefined,
                        }))
                      }
                    >
                      لغو انتخاب
                    </Button>
                  )}
                  <Button
                    color="error"
                    onClick={() => {
                      setFiles((current) => ({ ...current, [key]: undefined }));
                      setSettings((current) => ({
                        ...current,
                        heroes: { ...current.heroes, [key]: "" },
                      }));
                    }}
                  >
                    حذف بنر {labels[key]}
                  </Button>
                </Stack>
                <TextField
                  label={`آدرس بنر ${labels[key]}`}
                  value={settings.heroes[key]}
                  disabled={!!files[key]}
                  onChange={(e) =>
                    setSettings((current) => ({
                      ...current,
                      heroes: { ...current.heroes, [key]: e.target.value },
                    }))
                  }
                />
              </Stack>
            ))}
            <Typography variant="body2">
              حداکثر حجم هر تصویر ۵ مگابایت است. حذف بنر اصلی، تصویر پیش‌فرض را
              برمی‌گرداند؛ بنر سایر صفحات پنهان می‌شود.
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Button type="submit" disabled={busy} variant="contained">
              {busy ? "در حال ذخیره…" : "ذخیره تنظیمات"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}
