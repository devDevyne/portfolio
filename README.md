# 안중겸 · Devyne An Portfolio

Java/Spring 백엔드 개발과 React 프론트엔드 설계·개발 경험을 정리한 개인 포트폴리오입니다. Next.js 서버 컴포넌트에서 Supabase의 공개 데이터를 조회해 자기소개, 회사 경력, 프로젝트 상세를 보여줍니다.

**사이트:** [devdevyne-portfolio.kro.kr](https://devdevyne-portfolio.kro.kr/)

## 주요 화면

| 경로 | 내용 |
|---|---|
| `/` | 프로필 사진, 자기소개, 핵심 역량, 연락처 및 외부 링크 |
| `/work` | 회사 정보, 재직 기간, 소속·직책·직무, 경력 요약과 참여 프로젝트 |
| `/work/projects/[slug]` | 프로젝트 요약, 기간·역할, 사용 기술, 핵심 기여와 상세 본문 |

회사와 프로젝트는 별도 사이드바에서 이동합니다. 현재 회사 경력은 `(주)엔씨엘` 1건, 회사 프로젝트는 5건, 개인 프로젝트는 1건이며, `/work`는 해당 경력의 ID를 기준으로 조회합니다.

## 기술 구성

- Next.js 16.3.5 App Router, React 19.2.8, TypeScript
- Tailwind CSS 4, ESLint 9
- Supabase PostgreSQL, `@supabase/supabase-js`
- `react-markdown`, `rehype-raw`, `rehype-sanitize`
- Vercel Hobby 배포 및 사용자 도메인 연결

## 로컬 실행

검증 스크립트의 TypeScript 직접 실행을 위해 Node.js 22.18 이상을 사용합니다. 개발·빌드는 Node.js 24 환경에서 확인했습니다.

```bash
npm ci
```

프로젝트 루트에 `.env.local`을 만들고 사용할 Supabase 프로젝트의 값을 입력합니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

환경변수 파일은 Git에서 제외됩니다. 공개 조회 서비스는 Publishable key를 사용하며, secret/service_role 키로 대체하지 않습니다.

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다. 실행 시 Supabase 연결과 공개 데이터가 필요합니다. DB 연결 실패를 MDX 데이터로 대체하는 fallback은 없습니다.

### 새 Supabase 프로젝트를 사용하는 경우

SQL 사본은 아래 순서로 적용합니다. 이미 적용한 DB에 재실행하는 용도는 아닙니다.

1. `docs/sql/create-site-profile.sql`
2. `docs/sql/create-experiences.sql`
3. `docs/sql/alter-experiences-field-lengths.sql`
4. `docs/sql/create-projects.sql`
5. `docs/sql/drop-projects-modules.sql`

SQL에는 테이블·제약·트리거·RLS 설정이 포함되어 있지만 콘텐츠 INSERT는 포함되어 있지 않습니다. 데이터는 별도로 입력해야 하며, 새 DB에서는 `services/experiences.ts`의 `WORK_EXPERIENCE_ID`를 실제 경력 ID와 맞춰야 합니다.

## 디렉터리 구조

```text
app/                  라우트, 서버 데이터 조회, 공통 레이아웃과 전역 스타일
views/                메인·경력·프로젝트 페이지 조합
features/             프로필 영역, 경력 사이드바, Markdown 렌더링
common/               공통 레이아웃과 내비게이션
services/             Supabase 서버 조회 로직
lib/content/          보존 중인 로컬 MDX 로더
content/              기존 자기소개·프로젝트 MDX 원본
public/               프로필 사진 등 정적 파일
scripts/              실제 DB 조회 및 페이지 검증
docs/                 기획, DB 정의서와 적용 SQL 사본
```

## 데이터와 렌더링

| 테이블 | 관리 대상 |
|---|---|
| `site_profile` | 자기소개 제목·본문, 핵심 역량, 이메일, 외부 링크 |
| `experiences` | 회사명, 재직 기간, 소속·직책·직무, 경력 요약 |
| `projects` | 경력 FK, 프로젝트 메타데이터, 기술·핵심 기여, Markdown 본문 |

- 회사 경력과 프로젝트는 `experience_id`로 연결합니다.
- 공개 조회는 `use_yn = 'Y' AND disp_yn = 'Y'` 조건을 RLS에서 적용합니다. 회사 프로젝트는 연결된 경력도 공개 상태여야 합니다.
- 일반 `anon`·`authenticated` 역할에는 공개 조회만 허용하고 쓰기 권한은 부여하지 않았습니다.
- 서버 컴포넌트가 `services`에서 데이터를 조회해 화면에 전달합니다. 현재 DB 요청은 `cache: "no-store"`로 처리합니다.
- 본문은 Markdown으로 렌더링하고 HTML을 정제합니다. `<details>`·`<summary>`는 유지하며, 본문의 중복 H1은 표시하지 않습니다.
- 기존 MDX 5개는 DB로 이전했으며 원본 파일은 보존합니다. 현재 화면은 DB를 사용하고, DB 본문을 MDX 코드로 실행하지 않습니다.
- 이름·사진·직무 소개와 메인의 Work·Contact 안내 문구는 코드에서 관리합니다.

## 검증

```bash
npm run lint
npm run build
npm run test:profile
npm run test:experiences
```

아래 검증은 별도 터미널에서 개발 서버 또는 `npm run build` 이후 `npm run start`로 서버를 실행한 상태에서 수행합니다.

```bash
npm run test:profile -- http://localhost:3000
npm run test:experiences -- http://localhost:3000
node scripts/check-work.mjs http://localhost:3000
```

- 프로필·경력 검증: 실제 공개 데이터 조회와 화면 바인딩 대조
- 프로젝트 검증: 회사 프로젝트 5개와 개인 프로젝트의 목록·상세, 단일 H1, 접기 영역 및 없는 경로의 404 확인
- 테스트는 DB를 변경하지 않습니다. 공개 프로필·경력과 회사 프로젝트 5개와 portfolio 개인 프로젝트가 있어야 통과합니다.

## 배포

Vercel에 Git 저장소를 연결하고 Next.js 프리셋과 루트 디렉터리 `./`를 사용합니다. `.env.local`은 업로드되지 않으므로 위 두 환경변수를 Vercel에도 등록합니다.

- Production Branch를 `main`으로 설정하면 해당 브랜치에 push·merge할 때 운영 배포가 실행됩니다.
- 다른 브랜치는 Preview 배포로 확인할 수 있습니다. Preview에서도 DB를 사용하려면 해당 환경에 환경변수를 등록합니다.
- Preview와 Production에 같은 Supabase 값을 등록하면 같은 DB를 사용합니다.
- 코드 변경은 재배포가 필요합니다. 현재 DB 콘텐츠 변경은 다음 서버 조회에 반영되며, 이미 열린 화면은 새로고침이 필요할 수 있습니다.

## 다음 작업

- Supabase Auth 기반 관리자 로그인과 권한 검사
- 프로필·경력·프로젝트 편집 화면
- 서버 리전·응답 시간 확인 및 콘텐츠 캐시 정책 검토

## 문서

- [초기 포트폴리오 계획](docs/portfolio-plan.md)
- [데이터베이스 정의 및 이전 내역](docs/database-design.md)
- [기존 콘텐츠 안내](content/README.md)

초기 계획과 MDX 메타데이터에는 DB 이전 전 기준이 남아 있습니다. 현재 데이터 구조와 이전 상태는 데이터베이스 정의서를 참고합니다.
