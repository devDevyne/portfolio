// Node 22.18+; run with --conditions=react-server for the server-only marker.
import assert from "node:assert/strict";
import nextEnv from "@next/env";
import { getSiteProfile } from "../services/site-profile.ts";

nextEnv.loadEnvConfig(process.cwd(), true);

const items = await getSiteProfile();
assert.ok(items.length > 0, "공개된 프로필 데이터가 있어야 합니다.");
assert.equal(new Set(items.map((item) => item.id)).size, items.length);
for (const [index, item] of items.entries()) {
  assert.equal(item.use_yn, "Y", "RLS: 미사용 항목이 반환되었습니다.");
  assert.equal(item.disp_yn, "Y", "RLS: 비공개 항목이 반환되었습니다.");
  assert.ok(item.content.trim().length > 0);
  if (index > 0) {
    const previous = items[index - 1];
    assert.ok(previous.sort_order < item.sort_order
      || (previous.sort_order === item.sort_order && previous.id < item.id));
  }
}

console.log(`프로필 조회 성공: ${items.length}건. 공개 플래그·중복 ID·정렬 확인 완료.`);
console.table(items.map(({ id, type, label, sort_order }) => ({ id, type, label, sort_order })));

// Optional: compare the real server-rendered page with current DB content.
const pageUrl = process.argv[2];
if (pageUrl) {
  const response = await fetch(pageUrl);
  assert.equal(response.status, 200);
  const html = await response.text();
  const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
  // Only inspect visible sections, not the serialized RSC payload.
  const sections = ["about", "contact"].map((id) => {
    const section = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
    assert.ok(section, `${id} section missing`);
    return section[0];
  });
  for (const item of items) {
    const section = ["email", "link"].includes(item.type) ? sections[1] : sections[0];
    if (item.type === "link") {
      assert.ok(section.includes(`href="${escape(item.content)}"`));
      assert.ok(section.includes(escape(item.label)));
    } else {
      assert.ok(section.includes(escape(item.content)), `${item.type} content missing`);
    }
  }
  console.log("메인 페이지의 자기소개·연락처·링크가 DB 응답과 일치합니다.");
}
