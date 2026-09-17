import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content/projects";
import ProjectPage from "@/views/work/ProjectPage";
import { connection } from "next/server";
import { getExperience, WORK_EXPERIENCE_ID } from "@/services/experiences";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  if (!await getExperience(WORK_EXPERIENCE_ID)) return { title: "프로젝트를 찾을 수 없습니다" };
  const { slug } = await params;
  const project = (await getProjects()).find(({ meta }) => meta.slug === slug);
  if (!project) return { title: "프로젝트를 찾을 수 없습니다" };
  return {
    title: `${project.meta.title} | 안중겸`,
    description: project.meta.summary,
    ...(project.meta.status === "draft" ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Page({ params }: Props) {
  await connection();
  const experience = await getExperience(WORK_EXPERIENCE_ID);
  if (!experience) notFound();
  const { slug } = await params;
  const project = (await getProjects()).find(({ meta }) => meta.slug === slug);
  if (!project) notFound();
  return <ProjectPage companyName={experience.company_name} project={project.meta}>{project.content}</ProjectPage>;
}
