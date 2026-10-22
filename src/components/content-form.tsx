"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { posterUrl, type ContentDTO } from "@/lib/content";
import { MAX_IMAGE_BYTES, MAX_GALLERY_IMAGES } from "@/lib/media";
function Preview({
  file,
  reference,
  alt,
}: {
  file?: File;
  reference?: string;
  alt: string;
}) {
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
  // Local previews also support legacy and externally hosted posters.
  return src ? (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: 150,
        height: 180,
        objectFit: "contain",
        borderRadius: 1,
        bgcolor: "background.default",
      }}
    />
  ) : null;
}
export function ContentForm({ item }: { item?: ContentDTO }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const [poster, setPoster] = useState(item?.poster || "");
  const [posterFile, setPosterFile] = useState<File>();
  const [gallery, setGallery] = useState(item?.gallery || []);
  const [files, setFiles] = useState<File[]>([]);
  function selectImages(input: HTMLInputElement, kind: "poster" | "gallery") {
    const incoming = Array.from(input.files || []);
    input.value = "";
    if (!incoming.length) return;
    if (
      incoming.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size === 0 ||
          file.size > MAX_IMAGE_BYTES,
      )
    ) {
      setError("تصاویر باید JPEG، PNG یا WebP و حداکثر ۵ مگابایت باشند");
      return;
    }
    if (
      kind === "gallery" &&
      gallery.length + files.length + incoming.length > MAX_GALLERY_IMAGES
    ) {
      setError("حداکثر ۲۰ تصویر گالری مجاز است");
      return;
    }
    setError("");
    if (kind === "poster") setPosterFile(incoming[0]);
    else setFiles((current) => [...current, ...incoming]);
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    const text = (key: string) => String(form.get(key) || "");
    const list = (key: string) =>
      text(key)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    try {
      const body = {
        title: text("title"),
        type: text("type"),
        year: text("year") ? Number(text("year")) : null,
        description: text("description"),
        poster,
        genres: list("genres"),
        actors: list("actors"),
        directors: list("directors"),
        writers: list("writers"),
        languages: list("languages"),
        countries: list("countries"),
        gallery,
        imdb: { rating: Number(text("rating")), votes: item?.imdb?.votes || 0 },
        movie: { duration: Number(text("duration")) },
        ...(item ? { __v: item.__v ?? 0 } : {}),
        ...(text("type") === "series"
          ? {
              series: item?.series || {
                seasonsCount: 0,
                episodesCount: 0,
                isWeekly: false,
                status: "ended",
              },
            }
          : {}),
      };
      const upload = new FormData();
      upload.set("data", JSON.stringify(body));
      if (posterFile) upload.set("poster", posterFile);
      files.forEach((file) => upload.append("gallery", file));
      const multipart = !!posterFile || files.length > 0;
      const response = await fetch(
        item ? `/api/content/${item._id}` : "/api/content",
        {
          method: item ? "PUT" : "POST",
          ...(multipart
            ? {}
            : { headers: { "Content-Type": "application/json" } }),
          body: multipart ? upload : JSON.stringify(body),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "ذخیره نشد");
      router.push(body.type === "series" ? "/admin/series" : "/admin/movies");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره نشد");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, maxWidth: 960, mx: "auto" }}>
      <Typography variant="h5" component="h1" mb={3}>
        {item ? "ویرایش محتوا" : "افزودن محتوا"}
      </Typography>
      <Box component="form" onSubmit={submit}>
        <Box
          component="fieldset"
          disabled={busy}
          sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}
        >
          <Stack spacing={3}>
            <TextField
              name="title"
              label="عنوان"
              required
              defaultValue={item?.title}
              slotProps={{ htmlInput: { minLength: 3, maxLength: 150 } }}
            />
            <TextField
              name="type"
              label="نوع"
              select
              defaultValue={item?.type || "movie"}
            >
              <MenuItem value="movie">فیلم</MenuItem>
              <MenuItem value="series">سریال</MenuItem>
            </TextField>
            <TextField
              name="year"
              label="سال"
              type="number"
              defaultValue={item?.year || ""}
              slotProps={{
                htmlInput: { min: 1900, max: new Date().getFullYear() + 2 },
              }}
            />
            <Typography component="h2" variant="h6">
              پوستر
            </Typography>
            <Preview
              file={posterFile}
              reference={poster}
              alt="پیش‌نمایش پوستر"
            />
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Button component="label" variant="outlined">
                انتخاب پوستر
                <input
                  hidden
                  type="file"
                  aria-label="فایل پوستر"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => selectImages(e.currentTarget, "poster")}
                />
              </Button>
              {posterFile && (
                <Button onClick={() => setPosterFile(undefined)}>
                  لغو انتخاب پوستر
                </Button>
              )}
            </Stack>
            <TextField
              label="نام فایل یا آدرس پوستر"
              required={!posterFile}
              disabled={!!posterFile}
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              helperText="JPEG، PNG یا WebP؛ حداکثر ۵ مگابایت برای هر تصویر"
            />
            <Typography component="h2" variant="h6">
              گالری ({gallery.length + files.length} از ۲۰)
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {gallery.map((ref, index) => (
                <Stack key={`${ref}-${index}`}>
                  <Preview reference={ref} alt={`تصویر گالری ${index + 1}`} />
                  <Button
                    onClick={() =>
                      setGallery((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                    color="error"
                  >
                    حذف تصویر {index + 1}
                  </Button>
                </Stack>
              ))}
              {files.map((file, index) => (
                <Stack key={index}>
                  <Preview file={file} alt={`تصویر جدید ${index + 1}`} />
                  <Button
                    color="error"
                    onClick={() =>
                      setFiles((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                  >
                    حذف انتخاب {index + 1}
                  </Button>
                </Stack>
              ))}
            </Box>
            <Button component="label" variant="outlined">
              افزودن تصویر گالری
              <input
                hidden
                type="file"
                multiple
                aria-label="فایل‌های گالری"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => selectImages(e.currentTarget, "gallery")}
              />
            </Button>
            <Typography variant="body2" color="text.secondary">
              تغییر تصاویر با دکمه ذخیره اعمال می‌شود. حجم کل هر درخواست حداکثر
              ۲۶ مگابایت است.
            </Typography>
            <TextField
              name="description"
              label="خلاصه"
              multiline
              minRows={4}
              defaultValue={item?.description}
            />
            {(
              [
                "genres",
                "actors",
                "directors",
                "writers",
                "languages",
                "countries",
              ] as const
            ).map((key, i) => (
              <TextField
                key={key}
                name={key}
                label={
                  [
                    "ژانرها",
                    "بازیگران",
                    "کارگردانان",
                    "نویسندگان",
                    "زبان‌ها",
                    "کشورها",
                  ][i]
                }
                helperText="جداشده با کاما (,)"
                defaultValue={item?.[key]?.join(", ")}
              />
            ))}
            <TextField
              name="rating"
              label="امتیاز"
              type="number"
              defaultValue={item?.imdb?.rating ?? 0}
              slotProps={{ htmlInput: { min: 0, max: 10, step: 0.1 } }}
            />
            <TextField
              name="duration"
              label="مدت به دقیقه"
              type="number"
              defaultValue={item?.movie?.duration ?? 0}
              slotProps={{ htmlInput: { min: 0, max: 2000 } }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" disabled={busy}>
              {busy ? "در حال ذخیره…" : "ذخیره"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}
