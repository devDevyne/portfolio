import Image from "next/image";
import MainNavigation from "@/common/layout/MainNavigation";
import profilePhoto from "@/public/profile_photo.jpg";

export default function ProfileHero() {
  return (
    <header id="top" className="grid gap-10 pt-10 pb-12 sm:pt-14 md:grid-cols-[1fr_auto] md:gap-16 md:pb-16 lg:pt-16">
      <div>
        <p className="text-[11px] font-medium tracking-[0.25em] text-muted">PORTFOLIO</p>
        <h1 className="mt-7 font-display text-[clamp(4.5rem,9vw,7.5rem)] leading-[0.98] tracking-[-0.055em]">
          Devyne<br /><span className="font-normal text-accent italic">An</span>
          <span className="mt-5 block font-sans text-base leading-normal font-normal tracking-[0.15em] text-muted">안중겸</span>
        </h1>
        <p className="mt-6 flex items-center gap-4 text-[11px] leading-6 tracking-[0.13em] text-muted sm:text-xs">
          <span aria-hidden="true" className="h-px w-7 shrink-0 bg-border" />
          Backend & Full-stack Developer
        </p>
        <MainNavigation />
      </div>
      <figure className="w-[210px] justify-self-end sm:w-[250px] md:pt-1 lg:w-[280px]">
        <Image
          src={profilePhoto}
          alt="웹 개발자 안중겸의 프로필 사진"
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 250px, 210px"
          loading="eager"
          unoptimized
          className="h-auto w-full"
        />
        <figcaption className="mt-4 flex items-center gap-3 text-[10px] tracking-[0.16em] text-muted">
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
          A LITTLE ABOUT ME
        </figcaption>
      </figure>
    </header>
  );
}
