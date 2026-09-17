import assert from "node:assert/strict";

const base = process.argv[2] || "http://127.0.0.1:3000";
const production = process.argv.includes("--production");
const slugs = ["shopping-platform", "environmental-health-platform", "nursery-environment-monitoring", "corporate-website", "corporate-admin"];
const overview = await fetch(`${base}/work`);
assert.equal(overview.status, 200);
const overviewHtml = await overview.text();
assert.ok(overviewHtml.includes("(주)엔씨엘"));
for (const slug of slugs) {
  const response = await fetch(`${base}/work/projects/${slug}`);
  const html = await response.text();
  if (production) {
    // Existing documents are drafts: neither navigation nor direct access may expose them.
    assert.equal(response.status, 404, slug);
    assert.ok(!overviewHtml.includes(`/work/projects/${slug}`), slug);
    assert.ok(!html.includes('class="project-prose"'), slug);
  } else {
    assert.equal(response.status, 200, slug);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, slug);
    assert.ok(html.includes("프로젝트 개요") && html.includes("주요 작업"), slug);
    if (slug === "shopping-platform") assert.match(html, /<details>[\s\S]*?<summary>[\s\S]*?<ul>/);
  }
}
const missing = await fetch(`${base}/work/projects/not-a-project`);
assert.equal(missing.status, 404);
console.log(`Work checks passed (${production ? "production draft exclusion" : "development MDX rendering"}).`);
