import { requireUser } from "@/server/auth";
import { getSettings, featuredContent } from "@/server/settings";
import { SettingsForm } from "@/components/admin/settings-form";
export default async function Page() {
  await requireUser(true);
  const settings = await getSettings();
  const selected = await featuredContent(settings.featuredIds);
  return (
    <SettingsForm
      initial={settings}
      selected={selected.map((item) => ({
        _id: item._id,
        title: item.title,
        type: item.type,
      }))}
    />
  );
}
