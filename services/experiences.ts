import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

export type Experience = {
  id: number;
  company_name: string;
  start_month: string;
  end_month: string | null;
  department: string | null;
  position: string | null;
  job_function: string;
  summary_title: string | null;
  summary: string | null;
  use_yn: "Y" | "N";
  disp_yn: "Y" | "N";
  sort_order: number;
  period: string;
};

// The /work overview currently shows the NCL experience (id 1).
export const WORK_EXPERIENCE_ID = 1;

export const getExperience = cache(async (id: number): Promise<Experience | null> => {
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
  const { data, error } = await supabase.from("experiences")
    .select("id, company_name, start_month, end_month, department, position, job_function, summary_title, summary, use_yn, disp_yn, sort_order")
    .eq("id", id)
    .maybeSingle<Omit<Experience, "period">>();
  if (error) throw new Error(`경력 정보를 조회하지 못했습니다 (${error.code || "network_error"}).`);
  if (!data) return null;
  const month = (value: string) => value.slice(0, 7).replace("-", ".");
  return { ...data, period: `${month(data.start_month)} – ${data.end_month ? month(data.end_month) : "재직 중"}` };
});
