create table public.projects (
  id bigint generated always as identity primary key,
  experience_id bigint references public.experiences(id) on delete restrict,
  category varchar(20) not null,
  slug varchar(100) not null unique,
  title varchar(100) not null,
  summary text not null,
  start_month date not null,
  end_month date,
  role varchar(200) not null,
  technologies text[] not null default '{}',
  modules text[] not null default '{}',
  highlights text[] not null default '{}',
  body_markdown text not null,
  use_yn char(1) not null default 'Y',
  disp_yn char(1) not null default 'N',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_category_check check (category in ('company', 'personal')),
  constraint projects_experience_check check (
    (category = 'company' and experience_id is not null) or
    (category = 'personal' and experience_id is null)
  ),
  constraint projects_slug_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_start_month_check check (extract(day from start_month) = 1),
  constraint projects_end_month_check check (end_month is null or (extract(day from end_month) = 1 and end_month >= start_month)),
  constraint projects_use_yn_check check (use_yn in ('Y', 'N')),
  constraint projects_disp_yn_check check (disp_yn in ('Y', 'N')),
  constraint projects_sort_order_check check (sort_order >= 0)
);
create index projects_experience_id_idx on public.projects(experience_id);

create function public.set_projects_updated_at() returns trigger
language plpgsql security invoker set search_path = ''
as $$ begin new.updated_at = clock_timestamp(); return new; end; $$;
revoke all on function public.set_projects_updated_at() from public, anon, authenticated;
create trigger projects_updated_at before update on public.projects
for each row execute function public.set_projects_updated_at();

alter table public.projects enable row level security;
revoke all on table public.projects from public, anon, authenticated;
revoke all on sequence public.projects_id_seq from public, anon, authenticated;
grant select on public.projects to anon, authenticated;
create policy projects_public_read on public.projects
for select to anon, authenticated using (
  use_yn = 'Y' and disp_yn = 'Y' and (
    category = 'personal' or exists (
      select 1 from public.experiences e
      where e.id = projects.experience_id and e.use_yn = 'Y' and e.disp_yn = 'Y'
    )
  )
);

comment on table public.projects is '회사 및 개인 프로젝트 정보와 Markdown 본문';
comment on column public.projects.id is '자동 증가 프로젝트 식별자';
comment on column public.projects.experience_id is '회사 경력 식별자. 개인 프로젝트는 NULL';
comment on column public.projects.category is '프로젝트 구분 company/personal';
comment on column public.projects.slug is '상세 URL 식별 문자열';
comment on column public.projects.title is '프로젝트명';
comment on column public.projects.summary is '목록 및 상세 상단 요약';
comment on column public.projects.start_month is '참여 시작 연월. 월초 날짜로 저장';
comment on column public.projects.end_month is '참여 종료 연월. NULL이면 진행 중';
comment on column public.projects.role is '프로젝트 담당 역할';
comment on column public.projects.technologies is '기술 목록';
comment on column public.projects.modules is '담당 모듈 목록';
comment on column public.projects.highlights is '핵심 기여 목록';
comment on column public.projects.body_markdown is '프로젝트 상세 Markdown 본문';
comment on column public.projects.use_yn is '사용 여부 Y/N';
comment on column public.projects.disp_yn is '공개 표시 여부 Y/N';
comment on column public.projects.sort_order is '프로젝트 표시 순서';
comment on column public.projects.created_at is '생성 시각';
comment on column public.projects.updated_at is '마지막 수정 시각';
