import AboutSection from "@/features/profile/AboutSection";
import Link from "next/link";
import ProfileHero from "@/features/profile/ProfileHero";
import { getSiteProfile } from "@/services/site-profile";
import { connection } from "next/server";

export default async function HomePage() {
  await connection();
  const items = await getSiteProfile();
  const aboutItems = items.filter((item) => ["intro_title", "intro", "strength"].includes(item.type));
  const email = items.find((item) => item.type === "email" && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(item.content));
  const links = items.filter((item) => item.type === "link"
    && URL.canParse(item.content) && new URL(item.content).protocol === "https:");
  return (
    <>
      <ProfileHero />
      <AboutSection items={aboutItems} />
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
          {email && <a
            href={`mailto:${email.content}`}
            className="mt-5 inline-flex min-h-11 items-center text-lg text-accent underline decoration-accent/30 underline-offset-8 transition-colors hover:decoration-accent sm:text-xl"
          >
            {email.content}
          </a>}
          {links.length > 0 && <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted">
            {links.map(({ id, label, content }) => (
              <li key={id}>
                <a
                  href={content}
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
          </ul>}
          {!email && links.length === 0 && <p className="mt-5 text-sm text-muted">공개된 연락처가 없습니다.</p>}
        </div>
      </section>
    </>
  );
}
