import type { Metadata } from "next";
import { getProjects } from "@/lib/content/projects";
import WorkPage from "@/views/work/WorkPage";

export const metadata: Metadata = { title: "경력 | 안중겸 · Devyne An" };

export default async function Page() {
  const projects = await getProjects();
  return <WorkPage projects={projects.map(({ meta }) => meta)} />;
}

