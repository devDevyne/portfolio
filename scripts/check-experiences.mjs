import assert from "node:assert/strict";
import nextEnv from "@next/env";
import { getExperience, WORK_EXPERIENCE_ID } from "../services/experiences.ts";

nextEnv.loadEnvConfig(process.cwd(), true);
const experience = await getExperience(WORK_EXPERIENCE_ID);
assert.ok(experience, "공개된 경력이 필요합니다.");
assert.equal(experience.use_yn, "Y");
assert.equal(experience.disp_yn, "Y");
assert.equal(await getExperience(-1), null, "없는 경력은 null이어야 합니다.");
assert.match(experience.period, /^\d{4}\.\d{2} – (\d{4}\.\d{2}|재직 중)$/);
if (process.argv[2]) {
  const response = await fetch(new URL("/work", process.argv[2]));
  assert.equal(response.status, 200);
  const html = await response.text();
  const article = html.match(/<article>[\s\S]*?<\/article>/)?.[0];
  const aside = html.match(/<aside[\s\S]*?<\/aside>/)?.[0];
  assert.ok(article);
  assert.ok(aside);
  const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
  for (const value of [experience.company_name, experience.period, experience.job_function,
    experience.department, experience.position, experience.summary_title, experience.summary]) {
    if (value) assert.ok(article.includes(escape(value)), "경력 본문 바인딩 불일치");
  }
  assert.ok(aside.includes(escape(experience.company_name)));
  assert.ok(aside.includes(escape(experience.period)));
  assert.ok(!article.includes("주요 기술"));
  console.log("Work 본문·사이드바가 실제 DB 응답과 일치합니다.");
}
console.log(`경력 조회 성공: id=${experience.id}, ${experience.period}`);
