import type { SiteProfileItem } from "@/services/site-profile";

export default function AboutSection({ items }: { items: SiteProfileItem[] }) {
  const title = items.find((item) => item.type === "intro_title");
  const intro = items.find((item) => item.type === "intro");
  const strengths = items.filter((item) => item.type === "strength");
  return (
    <section id="about" aria-labelledby="about-heading" className="grid gap-7 border-t border-border py-12 md:grid-cols-[1fr_2fr] md:gap-12 md:py-16">
      <h2 id="about-heading" className="pt-2 text-[11px] font-medium tracking-[0.22em] text-muted">ABOUT ME</h2>
      <div>
        {title && <p className="max-w-2xl whitespace-pre-line text-2xl leading-[1.65] font-medium tracking-tight sm:text-3xl">
          {title.content}
        </p>}
        {intro && <p className="mt-6 max-w-2xl whitespace-pre-line text-sm leading-8 text-muted sm:text-[15px]">
          {intro.content}
        </p>}
        {strengths.length > 0 && <dl className="mt-9 grid gap-6 sm:grid-cols-3">
          {strengths.map(({ id, label, content }) => (
            <div key={id}>
              <dt className="text-sm font-medium text-accent">{label}</dt>
              <dd className="mt-2 whitespace-pre-line text-xs leading-6 text-muted">{content}</dd>
            </div>
          ))}
        </dl>}
        {!title && !intro && strengths.length === 0 && <p className="text-sm text-muted">자기소개를 준비하고 있습니다.</p>}
      </div>
    </section>
  );
}
