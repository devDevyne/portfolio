create table public.site_profile (
 id bigint generated always as identity primary key,
 type varchar(30) not null constraint site_profile_type_check check (type in ('intro_title','intro','strength','email','link')),
 label varchar(30),
 content text not null constraint site_profile_content_check check (content ~ '[^[:space:]]'),
 use_yn char(1) not null default 'Y' constraint site_profile_use_check check (use_yn in ('Y','N')),
 disp_yn char(1) not null default 'N' constraint site_profile_disp_check check (disp_yn in ('Y','N')),
 sort_order integer not null default 0 check (sort_order >= 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint site_profile_label_check check (
 (label is null or label ~ '[^[:space:]]') and
 (type not in ('strength','link') or label is not null)
 )
);
create unique index site_profile_active_single_type_idx on public.site_profile(type)
 where use_yn = 'Y' and type in ('intro_title','intro','email');
create function public.set_site_profile_updated_at() returns trigger
 language plpgsql security invoker set search_path = ''
 as $$ begin new.updated_at = clock_timestamp(); return new; end; $$;
revoke all on function public.set_site_profile_updated_at() from public, anon, authenticated;
create trigger site_profile_updated_at before update on public.site_profile
 for each row execute function public.set_site_profile_updated_at();
alter table public.site_profile enable row level security;
revoke all on table public.site_profile from public, anon, authenticated;
revoke all on sequence public.site_profile_id_seq from public, anon, authenticated;
grant select on public.site_profile to anon, authenticated;
create policy site_profile_public_read on public.site_profile
 for select to anon, authenticated
 using (use_yn = 'Y' and disp_yn = 'Y');
comment on table public.site_profile is '메인 자기소개·핵심 역량·연락처·외부 링크';
comment on column public.site_profile.id is '자동 증가 항목 식별자';
comment on column public.site_profile.type is '항목 종류: intro_title, intro, strength, email, link';
comment on column public.site_profile.label is '표시 이름 또는 역량 제목';
comment on column public.site_profile.content is '소개 문장, 이메일 주소 또는 외부 URL';
comment on column public.site_profile.use_yn is '사용 여부 Y/N';
comment on column public.site_profile.disp_yn is '공개 표시 여부 Y/N';
comment on column public.site_profile.sort_order is '동일 종류 내 표시 순서';
comment on column public.site_profile.created_at is '생성 시각';
comment on column public.site_profile.updated_at is '마지막 수정 시각';
