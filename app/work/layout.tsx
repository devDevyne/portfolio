import type { ReactNode } from "react";
import WorkSidebar from "@/features/work/WorkSidebar";
import { getProjects } from "@/lib/content/projects";

export default async function WorkLayout({ children }: { children: ReactNode }) {
  const projects = await getProjects();
  return (
    <div className="grid gap-9 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:py-12">
      <WorkSidebar projects={projects.map(({ meta }) => ({ slug: meta.slug, title: meta.title }))} />
      <div className="min-w-0 lg:border-l lg:border-border lg:pl-12">{children}</div>
    </div>
  );
}

