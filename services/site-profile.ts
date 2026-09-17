import "server-only";
import { createClient } from "@supabase/supabase-js";

export type SiteProfileItem = {
  id: number;
  type: "intro_title" | "intro" | "strength" | "email" | "link";
  label: string | null;
  content: string;
  use_yn: "Y" | "N";
  disp_yn: "Y" | "N";
  sort_order: number;
};

/** Public profile content only. No admin key or user session is used. */
export async function getSiteProfile(): Promise<SiteProfileItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase URL과 Publishable key 환경변수가 필요합니다.");
  }
  if (!key.startsWith("sb_publishable_")) {
    throw new Error("프로필 조회에는 Publishable key를 사용해야 합니다.");
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      }),
    },
  });

  // RLS enforces use_yn = 'Y' AND disp_yn = 'Y'; no duplicate filter here.
  const { data, error } = await supabase
    .from("site_profile")
    .select("id, type, label, content, use_yn, disp_yn, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })
    .returns<SiteProfileItem[]>();

  if (error) {
    // Do not turn connection/permission errors into a successful empty list.
    throw new Error(`프로필 정보를 조회하지 못했습니다 (${error.code || "network_error"}).`);
  }

  return data ?? [];
}
