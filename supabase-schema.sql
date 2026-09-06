-- BENW 「미리 맞춘 개학」 신청자 테이블
-- Supabase → SQL Editor 에 붙여넣고 Run 하면 됩니다.

-- ─────────────────────────────────────────────────────────
-- ① 이미 테이블을 만들어 두셨다면 이것만 실행하세요 (마이그레이션)
--    수집 항목이 「주문자명 · 상품 옵션 · 받는 희망일자」로 바뀌었습니다.
-- ─────────────────────────────────────────────────────────

-- 1단계 · 새 컬럼 추가 (있으면 건너뜀)
alter table public.signups
  add column if not exists orderer_name      text,
  add column if not exists wish_date         date,
  -- 동의 이력. 받았다는 사실과 받은 시각을 남겨야 나중에 증빙이 됩니다.
  add column if not exists terms_agreed      boolean,
  add column if not exists privacy_agreed    boolean,
  add column if not exists marketing_consent boolean,
  add column if not exists consented_at      timestamptz;

-- 2단계 · 옛 컬럼에 들어 있던 값을 새 컬럼으로 옮김
--    (마이그레이션 전에 신청한 사람의 이름·희망일자가 여기 있습니다. 먼저 옮기고 지워야 안 날아갑니다)
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'signups' and column_name = 'grade') then
    update public.signups set orderer_name = grade
     where orderer_name is null and grade is not null;
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'signups' and column_name = 'weekly_load') then
    -- weekly_load 는 text 라 날짜가 아닌 값('주 3회' 등)이 들어 있을 수 있다.
    -- YYYY-MM-DD 꼴만 옮기고 나머지는 버린다. (캐스트 실패로 전체가 롤백되는 걸 막기 위해)
    update public.signups set wish_date = weekly_load::date
     where wish_date is null and weekly_load ~ '^\d{4}-\d{2}-\d{2}$';
  end if;
end $$;

-- 3단계 · 옛 컬럼 정리
alter table public.signups
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
--   orderer_name      text not null,   -- 주문자명
--   size              text not null,   -- 상품 옵션 (pocket | large | xlarge)
--   wish_date         date,            -- 받는 희망일자 (선택)
--   terms_agreed      boolean,         -- [필수] 이용약관 동의
--   privacy_agreed    boolean,         -- [필수] 개인정보 수집·이용 동의
--   marketing_consent boolean,         -- [선택] 광고성 정보 수신 동의
--   consented_at      timestamptz      -- 동의한 시각
-- );
--
-- alter table public.signups enable row level security;

-- ─────────────────────────────────────────────────────────
-- 자주 쓰는 조회
-- ─────────────────────────────────────────────────────────

-- 옵션별 신청 수
--   select size, count(*) as 신청수
--   from public.signups group by size order by 신청수 desc;

-- 마케팅 수신동의한 사람만 (광고성 메시지는 이 명단에만 보낼 수 있습니다)
--   select orderer_name, consented_at
--   from public.signups where marketing_consent is true
--   order by consented_at desc;

-- 희망일자별 물량
--   select wish_date, count(*) as 건수
--   from public.signups where wish_date is not null
--   group by wish_date order by wish_date;
