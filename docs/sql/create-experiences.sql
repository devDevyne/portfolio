create table public.experiences (
  id bigint generated always as identity primary key,
  company_name varchar(50) not null,
  start_month date not null,
  end_month date,
  department varchar(100),
  position varchar(50),
  job_function varchar(200) not null,
  summary_title varchar(200),
  summary text,
  use_yn char(1) not null default 'Y',
  disp_yn char(1) not null default 'N',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_start_month_check check (extract(day from start_month) = 1),
  constraint experiences_end_month_check check (end_month is null or (extract(day from end_month) = 1 and end_month >= start_month)),
  constraint experiences_use_yn_check check (use_yn in ('Y', 'N')),
  constraint experiences_disp_yn_check check (disp_yn in ('Y', 'N')),
  constraint experiences_sort_order_check check (sort_order >= 0)
);
create function public.set_experiences_updated_at() returns trigger
language plpgsql security invoker set search_path = ''
as $$ begin new.updated_at = clock_timestamp(); return new; end; $$;
revoke all on function public.set_experiences_updated_at() from public, anon, authenticated;
create trigger experiences_updated_at before update on public.experiences
for each row execute function public.set_experiences_updated_at();

alter table public.experiences enable row level security;
revoke all on table public.experiences from public, anon, authenticated;
revoke all on sequence public.experiences_id_seq from public, anon, authenticated;
grant select on public.experiences to anon, authenticated;
create policy experiences_public_read on public.experiences
for select to anon, authenticated using (use_yn = 'Y' and disp_yn = 'Y');

comment on table public.experiences is '회사별 재직 경력';
comment on column public.experiences.id is '자동 증가 경력 식별자';
comment on column public.experiences.company_name is '회사명';
comment on column public.experiences.start_month is '입사 연월. 월초 날짜로 저장';
comment on column public.experiences.end_month is '퇴사 연월. 월초 날짜로 저장하며 NULL이면 재직 중';
comment on column public.experiences.department is '소속 부서·팀';
comment on column public.experiences.position is '공식 직책';
comment on column public.experiences.job_function is '수행 직무';
comment on column public.experiences.summary_title is '경력 요약 제목';
comment on column public.experiences.summary is '경력 요약 본문';
comment on column public.experiences.use_yn is '사용 여부 Y/N';
comment on column public.experiences.disp_yn is '공개 표시 여부 Y/N';
comment on column public.experiences.sort_order is '경력 표시 순서';
comment on column public.experiences.created_at is '생성 시각';
comment on column public.experiences.updated_at is '마지막 수정 시각';
