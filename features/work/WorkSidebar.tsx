"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProjectLink = { slug: string; title: string };

export default function WorkSidebar({ projects }: { projects: ProjectLink[] }) {
  const pathname = usePathname();
  const menu = (
    <nav aria-label="경력 및 프로젝트 탐색">
      <p className="mb-4 text-[10px] font-medium tracking-[0.2em] text-muted">EXPERIENCE</p>
      <Link href="/work" aria-current={pathname === "/work" ? "page" : undefined}
        className={`block rounded-sm border-l-2 px-4 py-3 transition-colors hover:bg-accent/5 ${pathname === "/work" ? "border-accent bg-accent/5 text-accent" : "border-border"}`}>
        <span className="block text-sm font-semibold">(주)엔씨엘</span>
        <span className="mt-2 block text-xs text-muted">2023.07 – 2026.09</span>
      </Link>
      <ul className="mt-2 space-y-1 border-l border-border pl-3">
        {projects.map(({ slug, title }) => {
          const href = `/work/projects/${slug}`;
          const selected = pathname === href;
          return (
            <li key={slug}>
              <Link href={href} aria-current={selected ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-sm px-3 py-2 text-[13px] leading-6 transition-colors hover:bg-accent/5 hover:text-accent ${selected ? "bg-accent/5 font-medium text-accent" : "text-muted"}`}>
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-9">
        <p className="text-[10px] font-medium tracking-[0.2em] text-muted">PERSONAL PROJECTS</p>
        <p className="mt-4 px-4 text-xs leading-6 text-muted">개인 프로젝트 준비 중</p>
      </div>
    </nav>
  );

  return (
    <aside className="min-w-0 lg:sticky lg:top-10 lg:self-start">
      <Link href="/" className="mb-6 inline-flex min-h-11 items-center gap-3 text-sm text-muted hover:text-accent">
        <span aria-hidden="true">←</span> 메인으로
      </Link>
      <div className="hidden lg:block">{menu}</div>
      <details className="border-y border-border py-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-medium text-accent">경력 · 프로젝트 메뉴</summary>
        <div className="pt-6">{menu}</div>
      </details>
    </aside>
  );
}

