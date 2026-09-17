const strengths = [
  { title: "업무 흐름 설계", description: "정책 · 상태 전환 · 예외 처리" },
  { title: "공통 구조 설계", description: "React · 화면과 기능의 책임 분리" },
  { title: "데이터 처리", description: "수집 · 집계 · 보고 자동화" },
];

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="grid gap-7 border-t border-border py-12 md:grid-cols-[1fr_2fr] md:gap-12 md:py-16">
      <h2 id="about-heading" className="pt-2 text-[11px] font-medium tracking-[0.22em] text-muted">ABOUT ME</h2>
      <div>
        <p className="max-w-2xl text-2xl leading-[1.65] font-medium tracking-tight sm:text-3xl">
          업무 흐름을 이해하고,{" "}<br className="hidden sm:block" />
          운영에 필요한 기능을 만드는 개발자입니다.
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-8 text-muted sm:text-[15px]">
          Java/Spring 기반의 백엔드 개발을 중심으로 React 프론트엔드 개발과 리딩을 경험했습니다.
          업무 정책과 예외 상황을 구체화하고, 화면부터 API와 데이터 처리까지 연결합니다.
        </p>
        <dl className="mt-9 grid gap-6 sm:grid-cols-3">
          {strengths.map(({ title, description }) => (
            <div key={title}>
              <dt className="text-sm font-medium text-accent">{title}</dt>
              <dd className="mt-2 text-xs leading-6 text-muted">{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
