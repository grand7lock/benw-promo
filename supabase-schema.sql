-- BENW 「미리 맞춘 개학」 신청자 테이블
-- Supabase → SQL Editor 에 붙여넣고 Run 하면 됩니다.

-- ─────────────────────────────────────────────────────────
-- ① 이미 테이블을 만들어 두셨다면 이것만 실행하세요 (마이그레이션)
--    수집 항목이 「주문자명 · 상품 옵션 · 받는 희망일자」로 바뀌었습니다.
-- ─────────────────────────────────────────────────────────

alter table public.signups
  add column if not exists orderer_name text,
  add column if not exists wish_date     date,
  drop column if exists grade,
  drop column if exists weekly_load,
  drop column if exists pain,
  drop column if exists child_name;

-- ─────────────────────────────────────────────────────────
-- ② 처음부터 새로 만드는 경우엔 아래를 쓰세요
-- ─────────────────────────────────────────────────────────

-- create table if not exists public.signups (
--   id           bigserial primary key,
--   created_at   timestamptz not null default now(),
--   orderer_name text not null,   -- 주문자명
--   size         text not null,   -- 상품 옵션 (pocket | large | xlarge)
--   wish_date    date             -- 받는 희망일자 (선택)
-- );
--
-- alter table public.signups enable row level security;

-- ─────────────────────────────────────────────────────────
-- 자주 쓰는 조회
-- ─────────────────────────────────────────────────────────

-- 옵션별 신청 수
--   select size, count(*) as 신청수
--   from public.signups group by size order by 신청수 desc;

-- 희망일자별 물량
--   select wish_date, count(*) as 건수
--   from public.signups where wish_date is not null
--   group by wish_date order by wish_date;
