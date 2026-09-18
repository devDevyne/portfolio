import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/services/projects";

export default function ProjectPage({ project, children, companyName }: { project: Project; children: ReactNode; companyName: string | null }) {
  return (
    <article>
      <Link href="/work" className="text-xs text-muted hover:text-accent">{project.category === "personal" ? "개인 프로젝트" : `${companyName} / 프로젝트`}</Link>
      <h1 className="mt-6 text-3xl leading-snug font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
      <p className="mt-5 text-base leading-8 text-muted">{project.summary}</p>
      <dl className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-2">
        <div><dt className="text-xs text-muted">참여 기간</dt><dd className="mt-2 text-sm">{project.period}</dd></div>
        <div><dt className="text-xs text-muted">담당 역할</dt><dd className="mt-2 text-sm leading-7">{project.role}</dd></div>
      </dl>
      <ul aria-label="사용 기술" className="mt-6 flex flex-wrap gap-2">
        {project.technologies.map((technology) => <li key={technology} className="border border-border px-3 py-1.5 text-xs text-muted">{technology}</li>)}
      </ul>
      <section className="my-9 border-l-2 border-accent bg-accent/5 p-5" aria-labelledby="contributions">
        <h2 id="contributions" className="text-sm font-semibold text-accent">핵심 기여</h2>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-7">
          {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
      </section>
      <div className="project-prose">{children}</div>
      <Link href="/work" className="mt-12 inline-flex min-h-11 items-center gap-3 text-sm text-accent">← 경력 요약으로</Link>
    </article>
  );
}
