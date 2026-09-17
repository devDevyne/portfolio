import type { Metadata } from "next";
import { getProjects } from "@/lib/content/projects";
import WorkPage from "@/views/work/WorkPage";
import { connection } from "next/server";
import { getExperience, WORK_EXPERIENCE_ID } from "@/services/experiences";

export const metadata: Metadata = { title: "경력 | 안중겸 · Devyne An" };

export default async function Page() {
  await connection();
  const experience = await getExperience(WORK_EXPERIENCE_ID);
  if (!experience) return <p className="py-10 text-sm text-muted">공개된 경력이 없습니다.</p>;
  const projects = await getProjects();
  return <WorkPage experience={experience} projects={projects.map(({ meta }) => meta)} />;
}
