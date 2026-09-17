import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectMeta } from "@/lib/content/projects";

export default function ProjectPage({ project, children }: { project: ProjectMeta; children: ReactNode }) {
  return (
    <article>
      <Link href="/work" className="text-xs text-muted hover:text-accent">(주)엔씨엘 / 프로젝트</Link>
      {project.status === "draft" && <p className="mt-5 border-l-2 border-accent bg-accent/5 px-4 py-3 text-xs leading-6 text-accent">개발용 초안 미리보기 · 배포 시에는 공개된 프로젝트만 표시됩니다.</p>}
      <h1 className="mt-6 text-3xl leading-snug font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
      <p className="mt-5 text-base leading-8 text-muted">{project.summary}</p>
      <dl className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-2">
        <div><dt className="text-xs text-muted">작업 기록 기간</dt><dd className="mt-2 text-sm">{project.period}</dd></div>
        <div><dt className="text-xs text-muted">담당 역할</dt><dd className="mt-2 text-sm leading-7">{project.role}</dd></div>
      </dl>
      <p className="mt-3 text-xs leading-6 text-muted">{project.periodBasis}이며, 연속 투입 기간과는 구분합니다.</p>
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

