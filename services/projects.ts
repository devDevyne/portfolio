import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

export type Project = {
  id: number;
  experience_id: number | null;
  category: "company" | "personal";
  slug: string;
  title: string;
  summary: string;
  start_month: string;
  end_month: string | null;
  role: string;
  technologies: string[];
  highlights: string[];
  body_markdown: string;
  sort_order: number;
  period: string;
};

export const getProjects = cache(async (experienceId: number): Promise<Project[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key?.startsWith("sb_publishable_")) {
    throw new Error("Supabase URL과 Publishable key 환경변수가 필요합니다.");
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, {
        ...init, cache: "no-store", signal: AbortSignal.timeout(15_000),
      }),
    },
  });
  const { data, error } = await supabase.from("projects")
    .select("id, experience_id, category, slug, title, summary, start_month, end_month, role, technologies, highlights, body_markdown, sort_order")
    .eq("experience_id", experienceId)
    .order("sort_order").order("id")
    .returns<Omit<Project, "period">[]>();
  if (error) throw new Error(`프로젝트를 조회하지 못했습니다 (${error.code || "network_error"}).`);
  const month = (value: string) => value.slice(0, 7).replace("-", ".");
  return (data ?? []).map((project) => ({
    ...project,
    period: `${month(project.start_month)} – ${project.end_month ? month(project.end_month) : "진행 중"}`,
  }));
});
