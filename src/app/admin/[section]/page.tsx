import { notFound } from "next/navigation";
import { isResource } from "@/lib/management";
import { parsePage } from "@/lib/content";
import type { Role } from "@/lib/permissions";
import { requireUser } from "@/server/auth";
import { listContent } from "@/server/catalog";
import { listManagement, contentOptions } from "@/server/management";
import { ResourceManager } from "@/components/admin/resource-manager";
import { ContentList } from "@/components/admin/content-list";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await requireUser(true);
  const { section } = await params;
  const search = await searchParams;
  if (section === "movies" || section === "series") {
    const type = section === "movies" ? "movie" : "series";
    return (
      <ContentList
        type={type}
        data={await listContent({
          type,
          page: parsePage(
            typeof search.page === "string" ? search.page : undefined,
          ),
        })}
      />
    );
  }
  if (!isResource(section)) notFound();
  const filters: Record<string, string> = {};
  for (const key of ["q", "page", "status", "contentId", "read"])
    if (typeof search[key] === "string" && search[key])
      filters[key] = search[key] as string;
  const [data, options] = await Promise.all([
    listManagement(section, new URLSearchParams(filters)),
    ["downloads", "trailers"].includes(section)
      ? contentOptions()
      : Promise.resolve([]),
  ]);
  return (
    <ResourceManager
      resource={section}
      data={data}
      options={options}
      actor={{ id: String(actor._id), role: actor.role as Role }}
      filters={filters}
    />
  );
}
