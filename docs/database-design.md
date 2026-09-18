# 포트폴리오 데이터베이스 정의안

작성일: 2026-09-17. 갱신일: 2026-09-18. 상태: site_profile과 experiences의 테이블·RLS·초기 데이터·화면 연결 완료. projects는 테이블·RLS·MDX 5건 이전 및 화면 연결 완료다. about_content는 검토용 설계다.

## 1. 범위와 기준

현재 메인 화면, `/work`, `/work/projects/[slug]`, `content/about.mdx`와 프로젝트 MDX 5개를 기준으로 한다. 기존 `portfolio-plan.md`의 DB 미사용 계획에 이어, 이번 문서는 Supabase 도입을 위한 후속 설계안이다. 기존 라우트는 유지한다.

- 1차: 콘텐츠 테이블, 공개 읽기 정책, 데이터 이전, 화면 조회 연결.
- 2차: Vercel 배포.
- 3차: Supabase Auth와 관리자 편집 화면. 관리자 쓰기 권한은 그때 추가한다.
- DB 이전 자체를 발행으로 취급하지 않는다. 프로젝트는 비공개로 이전한 뒤 사용자가 공개했으며, 긴 소개 문서는 초안 상태를 유지한다.
- 실제 기여·성과·기간을 새로 추정하지 않는다. 소속·공식 직책은 확인 전까지 NULL이다.

## 2. 관리 대상 분류

| 현재 위치 | 관리 데이터 | 저장 위치 |
|---|---|---|
| `features/profile/ProfileHero.tsx` | 한글·영문 이름, 직무 소개, 사진 경로·대체 텍스트 | 코드 유지 |
| `features/profile/AboutSection.tsx` | 소개 제목·문단, 핵심 역량 3개 | `site_profile` |
| `views/home/HomePage.tsx` | 이메일·외부 링크 | `site_profile` |
| `views/home/HomePage.tsx` | Work·Contact 안내 문구 | 코드 유지 |
| `content/about.mdx` | 긴 소개 제목·요약·기술·본문·초안 상태 | `about_content` |
| `views/work/WorkPage.tsx` | 회사명, 재직 기간, 직무·소속·직책, 경력 요약 제목·본문 | `experiences` |
| `content/projects/*.mdx` | 메타데이터와 상세 본문 | `projects` |
| `features/work/WorkSidebar.tsx` | 회사명·기간·프로젝트 제목을 위 데이터에서 조회 | 별도 메뉴 테이블 없음 |

색상·폰트·간격, 반응형 처리, 메뉴 계층, 라우트 규칙, ABOUT/WORK/CONTACT 등의 UI 라벨, 버튼 문구와 빈 화면 안내는 코드에 남긴다. 사이드바는 계속 별도 컴포넌트로 관리하되 회사명·기간의 중복 하드코딩은 제거한다. 사진 원본은 당분간 `public/profile_photo.jpg`를 그대로 사용한다.

## 3. 관계 및 공통 규칙

- `site_profile`: 자기소개·핵심 역량·연락처·외부 링크 항목마다 1행.
- `about_content`: 상세 자기소개 문서 최대 1행. 메인 소개와 별도로 초안 상태 보존.
- `experiences`: 재직 경력마다 1행. 초기에는 엔씨엘 1행.
- `projects`: 프로젝트마다 1행. 초기에는 회사 프로젝트 5행.
- `experiences.id` ← `projects.experience_id`: 경력 1 : 프로젝트 N. 개인 프로젝트는 FK가 NULL.
- 회사 마스터 테이블은 만들지 않는다. 회사명과 재직 정보를 하나의 경력 행에 두며, 재입사 시에는 새 경력 행을 만든다.

공통 컬럼:

| 컬럼 | 타입 | NULL / 기본값 | 의미 |
|---|---|---|---|
| `created_at` | `timestamptz` | NOT NULL / `now()` | DB에 최초 저장한 시각 |
| `updated_at` | `timestamptz` | NOT NULL / `now()` | 마지막 수정 시각. UPDATE 트리거로 갱신 |

site_profile·experiences·projects는 use_yn·disp_yn으로 관리하고 status를 두지 않는다. about_content의 콘텐츠 상태 `status`는 `text NOT NULL DEFAULT 'draft'`이며 CHECK로 `draft`, `published`만 허용한다. 예약 발행은 범위에 없다. 목록 순서는 `sort_order ASC, id ASC`로 명시하며 `sort_order`는 중복 허용, 0 이상 정수다.

길이 제한 문자열은 각 테이블의 varchar 정의를 따른다. use_yn·disp_yn은 `char(1)`이다. 긴 본문은 `text`, 여러 문자열은 순서가 보존되는 `text[]`를 사용한다. 기술명·모듈·기여를 독립적으로 검색·관리할 요구가 없으므로 연결 테이블까지 나누지 않는다. 목록 배열은 빈 배열 허용, NULL 원소와 빈 문자열은 입력 검증에서 거부한다.

## 4. site_profile — 메인 소개·연락처·외부 링크

항목별 행으로 관리한다. 이름·사진·직무 표시는 코드에 남긴다. 아래 type의 세부 값은 현재 화면을 유지하기 위한 제안이다.

| 컬럼 | 타입 | NULL / 기본값 | 제약·의미 |
|---|---|---|---|
| `id` | `bigint` | NOT NULL / 자동 증가 | GENERATED ALWAYS AS IDENTITY, PK |
| `type` | `varchar(30)` | NOT NULL | 허용 종류 CHECK |
| `label` | `varchar(30)` | NULL 허용 | 역량 제목, GitHub·Blog 등의 표시 이름 |
| `content` | `text` | NOT NULL | 소개 문장, 이메일 주소, 외부 URL. 공백만 있는 값 금지 |
| `use_yn` | `char(1)` | NOT NULL / 'Y' | CHECK IN ('Y', 'N'), 사용 여부 |
| `disp_yn` | `char(1)` | NOT NULL / 'N' | CHECK IN ('Y', 'N'), 공개 표시 여부 |
| `sort_order` | `integer` | NOT NULL / 0 | CHECK >= 0, 같은 type 안의 표시 순서 |
| `created_at` | `timestamptz` | NOT NULL / now() | 생성 시각 |
| `updated_at` | `timestamptz` | NOT NULL / now() | UPDATE 트리거로 갱신 |

### type과 초기 데이터 매핑

| type | 개수 | label | content / 원본 |
|---|---|---|---|
| `intro_title` | 사용 중 최대 1행 | NULL | AboutSection의 소개 제목 |
| `intro` | 사용 중 최대 1행 | NULL | AboutSection의 소개 문단 |
| `strength` | 여러 행 | 역량 제목, 필수 | 핵심 역량 설명. 현재 3행 |
| `email` | 사용 중 최대 1행 | 이메일 등, 선택 | devyne177@gmail.com |
| `link` | 여러 행 | 표시 이름, 필수 | GitHub·Blog·LinkedIn URL. 현재 3행 |

- type은 위 5개 값으로 CHECK 제한한다. 다른 종류를 추가할 때 제약과 화면 처리를 함께 변경한다.
- intro_title·intro·email은 use_yn = 'Y'인 행에 대해 type의 부분 UNIQUE 인덱스로 중복을 방지한다. 미사용 행은 여러 개 보관할 수 있다.
- strength·link는 label이 NULL이거나 공백이면 안 되도록 CHECK를 적용한다. 선택 label도 값이 있다면 공백만 허용하지 않는다.
- content는 일반 텍스트다. HTML이나 실행 코드를 렌더링하지 않는다. 이메일 형식과 HTTPS URL은 쓰기 경계에서 type별로 검증한다.
- 자동 증가 ID는 식별용이며 표시 순서가 아니다. 삭제·롤백 등으로 번호가 건너뛸 수 있다. 순서는 sort_order ASC, id ASC로 정한다.
- use_yn = N은 사용 중단, Y/N은 관리 중인 비공개 항목, Y/Y는 공개 항목이다. N/Y 조합도 공개되지 않는다.
- 공개 RLS 조건은 `use_yn = 'Y' AND disp_yn = 'Y'`다. 프론트엔드도 문자열의 truthy 판정 대신 'Y'와 명시적으로 비교한다.
- 초기 예상 데이터는 9행(제목 1, 소개 1, 역량 3, 이메일 1, 링크 3)이다. 신규 행은 기본 비공개이며, 이전 시 공개할 항목만 disp_yn을 Y로 지정한다.
- 기존 strengths·social_links JSONB와 status 컬럼은 제거한 설계다. 각 역량·링크는 개별 행으로 관리한다.
- `about.mdx`의 긴 초안은 이 테이블에 섞지 않고 about_content에 별도로 보관한다.

## 5. about_content — 상세 자기소개 초안

| 컬럼 | 타입 | NULL / 기본값 | 의미 |
|---|---|---|---|
| `id` | `smallint` | PK / 1 | CHECK `id = 1` |
| `title` | `text` | NOT NULL | frontmatter의 소개 제목 |
| `slug` | `text` | NOT NULL / about | UNIQUE, CHECK `slug = 'about'` |
| `summary` | `text` | NOT NULL | frontmatter 요약 |
| `technologies` | `text[]` | NOT NULL / `{}` | 소개 문서 기술 목록 |
| `body_markdown` | `text` | NOT NULL | frontmatter를 제외한 긴 소개 본문 |
| `status` | `text` | NOT NULL / draft | 기존 draft 그대로 이전 |

공통 시각 컬럼 포함. 현재 메인은 이 문서를 사용하지 않는다. 이전해 보존하되 공개 라우트를 새로 만드는 작업은 별도다. 기존 본문 H1은 frontmatter 제목과 다르므로 무조건 삭제하지 않고 보존한다. 향후 페이지에서 H1을 하나만 출력하도록 렌더링 방식을 정한다.

## 6. experiences — 회사 경력

적용 완료: Supabase `create_experiences` 마이그레이션. SQL 사본은 `docs/sql/create-experiences.sql`이다. 기간·Y/N·정렬·회사명 길이 제약, 수정 시각 트리거, anon·authenticated의 Y/Y 조회 및 쓰기 권한 차단을 검증했다. 검증 데이터는 롤백했고 이후 사용자 요청으로 엔씨엘 경력 1건(id=1)을 저장했다. 보안 advisor 지적 사항은 없었다. 사용자가 disp_yn을 Y로 변경한 뒤 서버 조회와 Work 본문·사이드바를 연결하고 실제 HTML을 대조했다.

회사 화면은 기본 경력 정보와 요약 제목·본문만 표시한다. 주요 기술과 주요 기여 목록은 회사 경력에서 제외하고 프로젝트에서 관리한다. 하단 참여 프로젝트 목록과 사이드바는 projects.experience_id로 조회한다.

| 컬럼 | 타입 | 제약 | 기본값 | 코멘트 |
|---|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | 자동 증가 | 경력 식별자 |
| `company_name` | `varchar(50)` | NOT NULL | 없음 | 회사명 |
| `start_month` | `date` | NOT NULL, 일자 = 1 | 없음 | 입사 연월 |
| `end_month` | `date` | NULL 허용, 일자 = 1, start_month 이상 | 없음 | 퇴사 연월. NULL이면 재직 중 |
| `department` | `varchar(50)` | NULL 허용 | 없음 | 소속 부서·팀 |
| `position` | `varchar(50)` | NULL 허용 | 없음 | 공식 직책 |
| `job_function` | `varchar(50)` | NOT NULL | 없음 | 수행 직무 |
| `summary_title` | `varchar(200)` | NULL 허용 | 없음 | 경력 요약 제목 |
| `summary` | `text` | NULL 허용 | 없음 | 경력 요약 본문 |
| `use_yn` | `char(1)` | NOT NULL, CHECK IN ('Y', 'N') | 'Y' | 사용 여부 |
| `disp_yn` | `char(1)` | NOT NULL, CHECK IN ('Y', 'N') | 'N' | 공개 표시 여부 |
| `sort_order` | `integer` | NOT NULL, CHECK >= 0 | 0 | 경력 표시 순서 |
| `created_at` | `timestamptz` | NOT NULL | now() | 생성 시각 |
| `updated_at` | `timestamptz` | NOT NULL, UPDATE 트리거 | now() | 마지막 수정 시각 |

공통 시각 컬럼 포함. 월 단위 날짜는 저장 편의를 위해 1일로 통일하고 화면에는 YYYY.MM만 표시한다. 실제 입사일·퇴사일을 1일로 주장하는 것이 아니다. CHECK로 일자 1, `end_month IS NULL OR end_month >= start_month`를 보장한다. 사용자 확인 재직 기간과 프로젝트 작업 기록 기간은 구분한다.

slug·status·technologies·highlights는 experiences에 두지 않는다. 초기 `/work`는 이 경력을 보여주고, 다중 회사 라우팅은 필요할 때 확장한다. 회사명은 재입사 등으로 반복될 수 있으므로 UNIQUE를 두지 않는다. 공개 조건은 use_yn = 'Y' AND disp_yn = 'Y'이며, anon·authenticated의 쓰기는 차단한다.

후속 변경: `limit_experiences_department_and_job_function` 마이그레이션으로 department와 job_function을 varchar(50)으로 축소했다. 기존 데이터 길이(각 5자·13자)를 확인하고 내용 손실 없이 적용했다. 변경 SQL은 `docs/sql/alter-experiences-field-lengths.sql`에 보관하며 최초 생성 SQL은 적용 이력으로 유지한다.

소속 `부설연구소`와 직책 `대리`는 처음 화면 확인용 더미로 사용했으며, 이후 사용자의 데이터 저장 요청에 따라 엔씨엘 경력 행에도 입력했다. 컬럼 기본값은 아니다.

## 7. projects — 프로젝트 메타데이터와 본문

적용 완료: Supabase `create_projects` 마이그레이션. SQL 사본은 `docs/sql/create-projects.sql`이다. 공개 조회 RLS, 쓰기 권한 차단, 기간·회사 연결·slug 중복·경력 삭제 제한 및 수정 시각 트리거를 검증했다. 검증 데이터는 롤백했다.

2026-09-18 데이터 이전 완료: MDX 5개를 아래 순서대로 id 1~5, sort_order 0~4로 저장했다. 회사명과 재직 기간으로 기존 엔씨엘 경력을 확인하여 experience_id=1로 연결했다. use_yn='Y', disp_yn='N'으로 초안 상태를 유지한다. frontmatter를 제외한 본문은 공백·줄바꿈·HTML 태그까지 보존했으며, 모든 이전 컬럼을 원본 추출값과 대조해 일치를 확인했다. anon 조회 결과는 0건이다. 이후 사용자가 disp_yn을 Y로 변경했다. 앱은 services/projects.ts에서 공개 데이터를 조회하여 목록·사이드바·상세·메타데이터에 연결한다. 본문은 react-markdown → rehype-raw → rehype-sanitize로 렌더링하며 원본 MDX는 보존한다.

| 컬럼 | 타입 | NULL / 기본값 | 의미 |
|---|---|---|---|
| `id` | `bigint` | PK / GENERATED ALWAYS AS IDENTITY | 자동 증가 프로젝트 식별자 |
| `experience_id` | `bigint` | NULL 허용, FK | `experiences.id` 참조 |
| `category` | `varchar(20)` | NOT NULL | CHECK `company`, `personal` |
| `slug` | `varchar(100)` | NOT NULL, UNIQUE | 기존 slug 유지, 상세 URL에 사용 |
| `title` | `varchar(100)` | NOT NULL | 공개용 프로젝트명 |
| `summary` | `text` | NOT NULL | 목록·상세 상단 요약 |
| `start_month` | `date` | NOT NULL | 프로젝트 참여 시작 월 |
| `end_month` | `date` | NULL 허용 | 프로젝트 참여 종료 월. NULL은 진행 중 |
| `role` | `varchar(200)` | NOT NULL | 프로젝트 담당 역할 |
| `technologies` | `text[]` | NOT NULL / `{}` | 기술 목록 |
| `highlights` | `text[]` | NOT NULL / `{}` | 핵심 기여 |
| `body_markdown` | `text` | NOT NULL | 프로젝트 상세 본문 |
| `use_yn` | `char(1)` | NOT NULL / 'Y' | CHECK Y/N, 사용 여부 |
| `disp_yn` | `char(1)` | NOT NULL / 'N' | CHECK Y/N, 공개 표시 여부 |
| `sort_order` | `integer` | NOT NULL / 0 | 목록 순서 |
| `created_at` | `timestamptz` | NOT NULL / now() | 생성 시각 |
| `updated_at` | `timestamptz` | NOT NULL / now() | UPDATE 트리거로 갱신 |

공통 시각 컬럼 포함. 제약조건:

- 회사 프로젝트는 experience_id 필수, 개인 프로젝트는 NULL로 제한한다.
- FK 삭제 정책은 `ON DELETE RESTRICT`. 회사 삭제로 프로젝트가 유실되거나 개인 프로젝트로 바뀌지 않게 한다.
- slug는 소문자 영문·숫자와 단일 하이픈 구분 형식(`^[a-z0-9]+(-[a-z0-9]+)*$`)으로 제한한다. URL 유지를 위해 이전 시 기존 slug를 변경하지 않는다.
- 참여 월은 월초 날짜로 저장하며 종료 월은 시작 월 이상이어야 한다. 기존 기록 기반 기간을 이전할 때에는 실제 참여 기간과 일치하는지 확인한다.
- visibility·period_basis·status는 두지 않는다. 작성 중인 프로젝트는 disp_yn = 'N'으로 관리한다.
- PK·UNIQUE 외에 `experience_id` 인덱스를 추가한다. 검색·배열 인덱스는 실제 조회 요구가 생기면 추가한다.

초기 이전 대상:

| 순서 | slug | 작업 기록 기간 | 상태 / 공개 등급 |
|---|---|---|---|
| 0 | shopping-platform | 2025.11–2026.09 | draft / anonymized |
| 1 | environmental-health-platform | 2024.08–2026.03 | draft / anonymized |
| 2 | nursery-environment-monitoring | 2024.08–2025.03 | draft / anonymized |
| 3 | corporate-website | 2023.09–2025.05 | draft / anonymized |
| 4 | corporate-admin | 2024.03–2026.03 | draft / anonymized |

현재 UI는 5개 모두 엔씨엘에 연결하지만 원본 MDX의 company/companySlug는 NULL이다. 이전 때 엔씨엘 연결을 명시적으로 확정하고 FK를 채운다. 실제 고객사명과 고용 회사명을 혼동하지 않는다. 개인 프로젝트는 실제 콘텐츠 작성 전까지 빈 목록을 유지한다.

## 8. MDX 이전과 이미지

frontmatter는 위 컬럼으로 분리하고 본문은 Markdown 문자열로 저장한다. highlights 배열과 본문에 있는 설명은 서로 다른 요약 수준이므로 자동 삭제하지 않는다. modules 메타데이터는 이전하지 않으며, 본문의 모듈별 요약은 그대로 보존한다.

후속 변경: `drop_projects_modules` 마이그레이션으로 modules 컬럼을 삭제했다. 변경 SQL은 `docs/sql/drop-projects-modules.sql`이며 최초 생성 SQL은 적용 이력으로 유지한다.

- 현재 문서는 기본 Markdown과 `<details>`, `<summary>`를 사용한다. JSX import나 실행 코드를 DB 본문에 넣지 않는다.
- DB 본문은 기존 `compileMDX`로 실행하지 않는다. Markdown 렌더러와 허용 목록 기반 HTML 정제를 사용한다.
- details 내부 Markdown, 코드 블록, 링크, 이미지, heading을 실제 화면에서 검증한다. 기존 중복 H1 처리도 유지한다.
- URL의 javascript 등 실행 가능한 스킴, script·이벤트 속성을 차단한다. 기본 HTML 전체 허용 방식은 쓰지 않는다.
- 이미지는 파일 자체를 DB에 저장하지 않는다. 처음에는 public 경로를 본문 Markdown에 기록하고 대체 텍스트를 포함한다.
- Storage 업로드·이미지 자산 테이블은 관리자 업로드 기능을 만들 때 결정한다. 비공개 이미지가 필요하면 본문 RLS뿐 아니라 Storage 접근 정책도 필요하다.
- 원본 MDX는 검증이 끝날 때까지 남긴다. 전환 후에는 DB를 편집 원본으로 사용하며 매번 파일로 덮어쓰지 않는다.

## 9. 접근 정책

4개 테이블 모두 RLS를 활성화한다. API 노출 및 GRANT와 RLS는 별개이므로 둘 다 명시한다.

| 대상 | 비로그인 anon / 일반 authenticated SELECT | 1차 INSERT·UPDATE·DELETE |
|---|---|---|
| site_profile | use_yn = 'Y' AND disp_yn = 'Y' | 차단 |
| about_content | status = published | 차단 |
| experiences | use_yn = 'Y' AND disp_yn = 'Y' | 차단 |
| projects | 아래 공개 조건 충족 행 | 차단 |

프로젝트 공개 조건:

1. `use_yn = 'Y'`.
2. `disp_yn = 'Y'`.
3. 개인 프로젝트이거나, 연결된 경력의 use_yn과 disp_yn이 모두 'Y'.

RLS는 행을 제한하므로 본문만 숨겨주지 않는다. 익명화가 필요하면 저장 내용을 직접 익명화한다. 비공개 원본·내부 메모·실제 고객 식별자를 공개 행의 추가 컬럼에 저장하지 않는다. 화면에서 숨기는 것만으로는 API 노출을 막을 수 없다.

3차에서는 지정한 Supabase Auth 사용자 ID만 관리자 권한을 갖게 설계한다. 모든 authenticated 사용자에게 쓰기를 허용하지 않는다. 로그인 화면·서버 쓰기 처리와 RLS를 함께 검증하고, 관리자 명부는 일반 사용자가 수정할 수 없게 한다. 세부 테이블과 정책 SQL은 관리자 단계에서 확정한다.

DB 도입 후 개발 환경이라는 이유로 초안을 공개 조회하지 않는다. 관리자 인증 전의 초안 확인은 대시보드 또는 기존 로컬 MDX로 한다. 키를 secret/service_role로 바꿔 일반 조회의 RLS를 우회하지 않는다. 초기 이전 작업은 권한 있는 관리 도구로 수행한다.

## 10. 이전·검증 기준 및 남은 결정

1. 엔씨엘 소속·직책은 사용자 지정값으로 입력 완료했다. 향후 미확인 경력 항목은 NULL로 유지한다.
2. 프로젝트 5개의 엔씨엘 소속 연결, 메인 항목별 disp_yn, 회사 경력의 use_yn·disp_yn을 이전 전에 확인한다.
3. 원본 6개 MDX의 요약·배열·기간·본문을 대조하며 이전한다. 반복 실행이 관리자 편집을 덮어쓰지 않도록 최초 이전 후 자동 재시드를 금지한다.
4. 익명 요청으로 공개 콘텐츠만 반환되는지, 미사용·미노출·비공개 부모의 프로젝트가 목록과 slug 직접 조회 모두에서 제외되는지 확인한다.
5. site_profile의 Y/Y 조합만 공개되고 Y/N·N/Y·N/N은 제외되는지 확인한다. 익명·일반 로그인 사용자의 쓰기가 차단되는지 확인한다.
6. 제약조건 위반(30자 초과 type·label, Y/N 외 플래그, 단일 항목 중복, 중복 slug, 잘못된 기간, 회사 FK 누락, 참조 중 경력 삭제)을 확인한다.
7. MDX와 Markdown 렌더링을 비교하고 반응형 사이드바·404·빈 목록을 확인한다.
8. DB 읽기 오류와 정상적인 빈 목록을 구분한다. 전환 후 MDX로 조용히 되돌아가는 fallback은 두지 않는다.
9. 관리자 도입 시 캐시 갱신 방식을 정한다. 현재 안에는 공개본을 유지하면서 새 개정 초안을 편집하는 버전 관리가 없으며, 공개 행 수정은 캐시 갱신 후 공개 화면에 반영된다. disp_yn을 N으로 바꾸면 해당 프로젝트는 비공개가 된다.

## 참고

- [Supabase 테이블과 데이터](https://supabase.com/docs/guides/database/tables)
- [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [RLS와 컬럼 접근 권한의 차이](https://supabase.com/docs/guides/database/postgres/column-level-security)

site_profile은 Supabase의 create_site_profile 마이그레이션으로 생성했다. 적용 SQL 사본은 `docs/sql/create-site-profile.sql`에 보관한다. anon·authenticated 역할 모두 Y/Y 행만 조회 가능하며 INSERT·UPDATE·DELETE·TRUNCATE 권한은 없다. 검증용 데이터는 롤백했고 실제 콘텐츠 9건을 저장·공개하여 메인 화면에 연결했다. services의 공개 조회는 Publishable key만 사용하며 요청 시 데이터를 읽는다.

`npm run test:profile -- http://127.0.0.1:3000`과 `npm run test:experiences -- http://127.0.0.1:3000`으로 실제 DB 응답과 화면을 대조할 수 있다(Node 22.18 이상). 테스트는 공개 데이터가 있는 상태를 전제로 하며 DB를 수정하지 않는다. 현재 /work는 경력 id=1을 표시하며 프로젝트는 experience_id로 연결한다. node scripts/check-work.mjs http://127.0.0.1:3000으로 공개 프로젝트 5개의 렌더링과 404를 검증한다. about_content 생성과 관리자 인증·편집은 후속 작업이다.
