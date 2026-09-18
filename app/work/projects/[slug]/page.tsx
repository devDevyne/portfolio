import ProjectMarkdown from "@/features/work/ProjectMarkdown";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/services/projects";
import ProjectPage from "@/views/work/ProjectPage";
import { connection } from "next/server";
import { getExperience } from "@/services/experiences";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const project = (await getProjects()).find((project) => project.slug === slug);
  if (!project) return { title: "프로젝트를 찾을 수 없습니다" };
  return {
    title: `${project.title} | 안중겸`,
    description: project.summary,
  };
}

export default async function Page({ params }: Props) {
  await connection();
  const { slug } = await params;
  const project = (await getProjects()).find((project) => project.slug === slug);
  if (!project) notFound();
  const experience = project.experience_id === null ? null : await getExperience(project.experience_id);
  if (project.category === "company" && !experience) notFound();
  return <ProjectPage companyName={experience?.company_name ?? null} project={project}><ProjectMarkdown content={project.body_markdown} /></ProjectPage>;
}
