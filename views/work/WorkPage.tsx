import Link from "next/link";
import type { ProjectMeta } from "@/lib/content/projects";
import type { Experience } from "@/services/experiences";

export default function WorkPage({ projects, experience }: { projects: ProjectMeta[]; experience: Experience }) {
  const affiliation = [experience.department, experience.position].filter(Boolean).join(" | ");
  return (
    <article>
      <p className="text-[11px] tracking-[0.22em] text-accent">WORK / EXPERIENCE</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{experience.company_name}</h1>
      <p className="mt-4 text-sm text-muted">{experience.period}</p>
      <dl className="mt-9 grid gap-6 border-y border-border py-6 sm:grid-cols-2">
        <div><dt className="text-xs text-muted">직무</dt><dd className="mt-2 text-sm leading-7">{experience.job_function}</dd></div>
        {affiliation && <div><dt className="text-xs text-muted">소속 · 직책</dt><dd className="mt-2 text-sm leading-7">{affiliation}</dd></div>}
      </dl>
      {(experience.summary_title || experience.summary) && <section className="py-10" aria-label="경력 요약">
        {experience.summary_title && <h2 className="text-xl font-semibold">{experience.summary_title}</h2>}
        {experience.summary && <p className="mt-5 whitespace-pre-line text-sm leading-8 text-muted">{experience.summary}</p>}
      </section>}
      <section className="border-t border-border pt-9" aria-labelledby="project-list">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="project-list" className="text-xl font-semibold">참여 프로젝트</h2>
          <span className="text-xs text-muted">{projects.length} projects</span>
        </div>
        <div className="mt-5 divide-y divide-border">
          {projects.map((project, index) => (
            <Link key={project.slug} href={`/work/projects/${project.slug}`}
              className="group grid gap-3 py-6 sm:grid-cols-[30px_1fr_20px]">
              <span className="pt-1 text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-medium transition-colors group-hover:text-accent">{project.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{project.summary}</p>
                <p className="mt-3 text-xs text-muted">작업 기록 기간 · {project.period}</p>
              </div>
              <span aria-hidden="true" className="hidden text-accent sm:block">↗</span>
            </Link>
          ))}
          {projects.length === 0 && <p className="py-8 text-sm text-muted">공개할 프로젝트를 정리하고 있습니다.</p>}
        </div>
      </section>
    </article>
  );
}
