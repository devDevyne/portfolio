import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content/projects";
import ProjectPage from "@/views/work/ProjectPage";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
  const { slug } = await params;
  const project = (await getProjects()).find(({ meta }) => meta.slug === slug);
  if (!project) notFound();
  return <ProjectPage project={project.meta}>{project.content}</ProjectPage>;
}

