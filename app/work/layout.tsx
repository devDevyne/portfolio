import type { ReactNode } from "react";
import WorkSidebar from "@/features/work/WorkSidebar";
import { getProjects } from "@/services/projects";
import { connection } from "next/server";
import { getExperience, WORK_EXPERIENCE_ID } from "@/services/experiences";

export default async function WorkLayout({ children }: { children: ReactNode }) {
  await connection();
  const experience = await getExperience(WORK_EXPERIENCE_ID);
  const projects = await getProjects();
  return (
    <div className="grid gap-9 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:py-12">
      <WorkSidebar
        experience={experience ? { company_name: experience.company_name, period: experience.period } : null}
        projects={projects.filter((project) => project.experience_id === experience?.id).map(({ slug, title }) => ({ slug, title }))}
        personalProjects={projects.filter((project) => project.category === "personal").map(({ slug, title }) => ({ slug, title }))}
      />
      <div className="min-w-0 lg:border-l lg:border-border lg:pl-12">{children}</div>
    </div>
  );
}
