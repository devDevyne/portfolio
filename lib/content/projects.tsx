import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";

export type ProjectMeta = {
  title: string;
  slug: string;
  summary: string;
  period: string;
  periodBasis: string;
  role: string;
  technologies: string[];
  highlights: string[];
  status: "draft" | "published";
  visibility: "public" | "anonymized" | "restricted" | "private";
};

export function isVisibleProject(
  meta: Pick<ProjectMeta, "status" | "visibility">,
  development: boolean,
) {
  return ["public", "anonymized", "restricted"].includes(meta.visibility)
    && (meta.status === "published" || (development && meta.status === "draft"));
}

const order = [
  "shopping-platform", "environmental-health-platform",
  "nursery-environment-monitoring", "corporate-website", "corporate-admin",
];

// Only trusted, repository-owned MDX is compiled. Do not pass user input or DB content here.
export const getProjects = cache(async () => {
  const directory = path.join(process.cwd(), "content/projects");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".mdx"));
  const projects = await Promise.all(files.map(async (file) => {
    const source = await readFile(path.join(directory, file), "utf8");
    const { frontmatter, content } = await compileMDX<ProjectMeta>({
      source,
      options: { parseFrontmatter: true },
      components: {
        // The page owns its H1; the document's repeated title is omitted.
        h1: () => null,
      },
    });
    if (frontmatter.slug !== file.slice(0, -4)
      || !frontmatter.title || !frontmatter.summary
      || !Array.isArray(frontmatter.technologies)
      || !Array.isArray(frontmatter.highlights)) {
      throw new Error(`Invalid project metadata: ${file}`);
    }
    return { meta: frontmatter, content };
  }));
  return projects
    .filter(({ meta }) => isVisibleProject(meta, process.env.NODE_ENV === "development"))
    .sort((a, b) => {
      const rank = (slug: string) => order.includes(slug) ? order.indexOf(slug) : order.length;
      return rank(a.meta.slug) - rank(b.meta.slug) || a.meta.title.localeCompare(b.meta.title);
    });
});

