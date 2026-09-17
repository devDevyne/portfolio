import Link from "next/link";

const items = [
  { href: "#about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function MainNavigation() {
  return (
    <nav aria-label="메인 메뉴" className="mt-8 md:mt-10">
      <ul className="flex flex-wrap gap-x-7 md:flex-col md:items-start">
        {items.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="group inline-flex min-h-11 items-center gap-4 text-sm text-muted transition-colors hover:text-accent">
              <span aria-hidden="true" className="h-px w-4 bg-border transition-all group-hover:w-7 group-hover:bg-accent" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
