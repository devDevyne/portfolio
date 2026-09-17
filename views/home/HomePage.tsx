import AboutSection from "@/features/profile/AboutSection";
import Link from "next/link";
import ProfileHero from "@/features/profile/ProfileHero";

export default function HomePage() {
  return (
    <>
      <ProfileHero />
      <AboutSection />
      <section id="work" aria-labelledby="work-heading" className="grid gap-7 border-t border-border py-12 md:grid-cols-[1fr_2fr] md:gap-12">
        <h2 id="work-heading" className="pt-1 text-[11px] font-medium tracking-[0.22em] text-muted">WORK</h2>
        <div>
          <p className="text-xl font-medium tracking-tight">경험을 통해 쌓아온 문제 해결 과정</p>
          <p className="mt-3 text-sm leading-7 text-muted">프로젝트별 담당 역할과 설계 판단, 구현 경험을 정리하고 있습니다.</p>
          <Link href="/work" className="mt-5 inline-flex min-h-11 items-center gap-4 border border-accent/30 px-5 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-white">자세히 보기 <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section id="contact" aria-labelledby="contact-heading" className="grid gap-7 border-t border-border py-12 md:grid-cols-[1fr_2fr] md:gap-12 md:pb-16">
        <h2 id="contact-heading" className="pt-1 text-[11px] font-medium tracking-[0.22em] text-muted">CONTACT</h2>
        <div>
          <p className="text-xl font-medium tracking-tight">함께 나눌 이야기를 기다립니다.</p>
          <a
            href="mailto:devyne177@gmail.com"
            className="mt-5 inline-flex min-h-11 items-center text-lg text-accent underline decoration-accent/30 underline-offset-8 transition-colors hover:decoration-accent sm:text-xl"
          >
            devyne177@gmail.com
          </a>
          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted">
            {[
              { label: "GitHub", href: "https://github.com/devDevyne" },
              { label: "Blog", href: "https://dev-devyne.tistory.com/" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/%EC%A4%91%EA%B2%B8-%EC%95%88-9a681a265/" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-accent"
                >
                  {label}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (새 탭에서 열기)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
