import { NextResponse } from 'next/server'
import { getSupabase } from '../../../lib/supabase'
import { PROMO } from '../../../lib/config'

export const dynamic = 'force-dynamic'

// 신청 현황 — 남은 수량 카운터가 읽어갑니다.
export async function GET() {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ count: 0, remaining: PROMO.totalStock, connected: false })
  }

  const { count, error, status } = await supabase
    .from('signups')
    .select('*', { count: 'exact', head: true })

  // HEAD 요청은 본문이 없어서 인증 실패(401)여도 error.message 가 빈 문자열로 온다.
  // 테이블이 없으면(404→204) error 가 아예 비고 count 만 null 이다. status 로 갈라서 말해준다.
  if (error || count === null || count === undefined) {
    const reason = error?.message
      || (status === 401 || status === 403
        ? `Supabase 인증 실패 (HTTP ${status}) — SUPABASE_URL / SUPABASE_SERVICE_KEY 를 확인하세요`
        : status === 204
          ? 'signups 테이블을 찾지 못했습니다.'
          : `Supabase 응답 HTTP ${status}`)
    return NextResponse.json({
      count: 0,
      remaining: PROMO.totalStock,
      connected: false,
      reason,
    })
  }

  const used = count
  return NextResponse.json({
    count: used,
    remaining: Math.max(0, PROMO.totalStock - used),
    connected: true,
  })
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: '요청을 읽지 못했습니다.' }, { status: 400 })
  }

  const { orderer_name, size, wish_date, consent, terms_agreed, marketing_consent } = body || {}

  if (!orderer_name || !String(orderer_name).trim()) {
    return NextResponse.json({ ok: false, error: '주문자명을 적어주세요.' }, { status: 400 })
  }
  if (!size) {
    return NextResponse.json({ ok: false, error: '상품 옵션을 골라주세요.' }, { status: 400 })
  }

  // 필수 동의 둘은 서버에서도 막는다. 체크박스만 두면 API 를 직접 때려서 우회할 수 있다.
  if (terms_agreed !== true) {
    return NextResponse.json(
      { ok: false, error: '서비스 이용약관에 동의해주셔야 신청됩니다.' },
      { status: 400 },
    )
  }
  if (consent !== true) {
    return NextResponse.json(
      { ok: false, error: '개인정보 수집·이용에 동의해주셔야 신청됩니다.' },
      { status: 400 },
    )
  }

  const supabase = getSupabase()

  // Supabase 를 아직 안 붙였어도 신청 흐름은 끊기지 않게 한다.
  if (!supabase) {
    console.log('[signup · 미저장]', { size })
    return NextResponse.json({ ok: true, stored: false })
  }

  const name = String(orderer_name).trim().slice(0, 40)
  const missingColumn = (e) => e && /does not exist|schema cache|Could not find/i.test(e.message)

  const base = {
    orderer_name: name,
    size,
    wish_date: wish_date || null,
  }

  // 동의는 「받았다」는 사실만으로 부족하고 언제 받았는지가 같이 남아야 한다.
  // 광고성 메시지를 보낼 때 이 기록이 근거가 된다.
  const withConsent = {
    ...base,
    terms_agreed: true,
    privacy_agreed: true,
    marketing_consent: marketing_consent === true,
    consented_at: new Date().toISOString(),
  }

  let { error } = await supabase.from('signups').insert(withConsent)

  // 동의 컬럼 마이그레이션 전이면 그 컬럼들만 빼고 다시 넣는다.
  // 신청 자체를 막지는 않되, 저장되지 않았다는 건 응답에 남긴다.
  let consentStored = !error
  if (missingColumn(error)) {
    const retry = await supabase.from('signups').insert(base)
    error = retry.error
    consentStored = false
  }

  // 그래도 안 되면 마이그레이션 이전 스키마다. 옛 컬럼에 담는다.
  // (grade ← 주문자명 / weekly_load ← 희망일자) 읽는 쪽에서 다시 합쳐준다.
  // supabase-schema.sql 의 alter 를 돌리고 나면 이 경로는 더 이상 타지 않는다.
  if (missingColumn(error)) {
    const retry = await supabase.from('signups').insert({
      grade: name,
      size,
      weekly_load: wish_date || null,
    })
    error = retry.error
  }

  if (error) {
    // 사용자 흐름은 끊지 않되, 왜 저장이 안 됐는지는 응답에 남긴다.
    console.error('[signup · 저장 실패]', error.message)
    return NextResponse.json({ ok: true, stored: false, reason: error.message })
  }

  if (!consentStored) {
    // 신청은 들어갔지만 동의 이력이 안 남은 상태. 마이그레이션이 필요하다는 신호다.
    console.warn('[signup · 동의 이력 미저장] supabase-schema.sql 의 alter 를 실행하세요.')
  }

  return NextResponse.json({ ok: true, stored: true, consentStored })
}
