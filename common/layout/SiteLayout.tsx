import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-6 sm:px-10 lg:px-16">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-6 focus:z-50 focus:bg-background focus:p-4">
        본문으로 건너뛰기
      </a>
      <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-7 text-xs text-muted">
        <p>© 2026 Devyne An</p>
        <a href="#main-content" className="inline-flex min-h-11 items-center gap-3 transition-colors hover:text-accent">
          맨 위로 <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </div>
  );
}
