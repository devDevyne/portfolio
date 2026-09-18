import assert from "node:assert/strict";

const base = process.argv[2] || "http://127.0.0.1:3000";
const slugs = ["shopping-platform", "environmental-health-platform", "nursery-environment-monitoring", "corporate-website", "corporate-admin"];
const overview = await fetch(`${base}/work`);
assert.equal(overview.status, 200);
const overviewHtml = await overview.text();
assert.ok(overviewHtml.includes("(주)엔씨엘"));
for (const slug of slugs) {
  const response = await fetch(`${base}/work/projects/${slug}`);
  const html = await response.text();
  assert.ok(overviewHtml.includes(`/work/projects/${slug}`), slug);
  assert.equal(response.status, 200, slug);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, slug);
  assert.ok(html.includes("프로젝트 개요") && html.includes("주요 작업"), slug);
  if (slug === "shopping-platform") assert.match(html, /<details>[\s\S]*?<summary>[\s\S]*?<ul>/);
}
const missing = await fetch(`${base}/work/projects/not-a-project`);
assert.ok(overviewHtml.includes("/work/projects/portfolio"), "개인 프로젝트 사이드바 링크");
const companyArticle = overviewHtml.match(/<article>[\s\S]*?<\/article>/)?.[0];
assert.ok(companyArticle && !companyArticle.includes("/work/projects/portfolio"), "회사 프로젝트와 개인 프로젝트 분리");
const personal = await fetch(`${base}/work/projects/portfolio`);
assert.equal(personal.status, 200);
const personalHtml = await personal.text();
const personalArticle = personalHtml.match(/<article>[\s\S]*?<\/article>/)?.[0];
assert.ok(personalArticle?.includes("개인 포트폴리오 웹사이트"));
assert.ok(personalArticle?.includes("개인 프로젝트"));
assert.ok(personalArticle?.includes("진행 중"));
assert.ok(!personalArticle?.includes("(주)엔씨엘"));
assert.equal((personalHtml.match(/<h1[ >]/g) || []).length, 1);
assert.equal(missing.status, 404);
console.log("Work checks passed (DB Markdown rendering).");
