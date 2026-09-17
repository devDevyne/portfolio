import Link from "next/link";
import type { ProjectMeta } from "@/lib/content/projects";

export default function WorkPage({ projects }: { projects: ProjectMeta[] }) {
  return (
    <article>
      <p className="text-[11px] tracking-[0.22em] text-accent">WORK / EXPERIENCE</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">(주)엔씨엘</h1>
      <p className="mt-4 text-sm text-muted">2023.07 – 2026.09</p>
      <dl className="mt-9 grid gap-6 border-y border-border py-6 sm:grid-cols-2">
        <div><dt className="text-xs text-muted">직무</dt><dd className="mt-2 text-sm leading-7">웹 개발 · 백엔드 및 프론트엔드</dd></div>
        <div><dt className="text-xs text-muted">주요 기술</dt><dd className="mt-2 text-sm leading-7">Java · Spring · MyBatis · React</dd></div>
        {/* 소속과 공식 직책은 확인 후 추가합니다. */}
      </dl>
      <section className="py-10" aria-labelledby="career-summary">
        <h2 id="career-summary" className="text-xl font-semibold">업무를 이해하고, 서비스로 연결하는 개발</h2>
        <p className="mt-5 text-sm leading-8 text-muted">
          Java/Spring 기반의 업무 기능 개발과 React 프론트엔드 구조 설계 및 개발 리딩을 경험했습니다.
          상가 운영·관리, 환경 데이터, 기업 홈페이지와 관리자 시스템에서 화면·API·데이터 처리를 연결했습니다.
        </p>
        <ul className="mt-5 space-y-3 text-sm leading-7">
          <li>결제·예약·계약·알림의 업무 정책과 상태 전환, 예외 처리 구현</li>
          <li>React 공통 구조와 목록·폼 처리 기준 정립 및 팀 개발 지원</li>
          <li>환경 데이터 수집·집계, 결측 조회와 보고 자동화</li>
        </ul>
      </section>
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

