-- BENW 「미리 맞춘 개학」 신청자 테이블
-- Supabase → SQL Editor 에 붙여넣고 Run 하면 됩니다.

create table if not exists public.signups (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  grade       text not null,          -- 01. 아이 학년
  weekly_load text,                   -- 02. 요일마다 챙기는 짐
  pain        text,                   -- 03. 제일 짜증나는 순간
  size        text not null,          -- 신발주머니 사이즈 (pocket | large | xlarge)
  child_name  text                    -- 네임라벨용 (선택)
);

-- 서버(service key)로만 쓰기 때문에 RLS 를 켜두고 정책은 열지 않습니다.
alter table public.signups enable row level security;

-- 사이즈 분포 한눈에 보기
create or replace view public.signup_summary as
select
  size,
  count(*) as 신청수,
  round(100.0 * count(*) / nullif(sum(count(*)) over (), 0), 1) as 비율
from public.signups
group by size
order by 신청수 desc;
