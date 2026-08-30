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

  const { count, error } = await supabase
    .from('signups')
    .select('*', { count: 'exact', head: true })

  // 테이블이 없으면 count 가 null 로만 오고 error 가 비는 경우가 있어 둘 다 본다.
  if (error || count === null || count === undefined) {
    return NextResponse.json({
      count: 0,
      remaining: PROMO.totalStock,
      connected: false,
      reason: error?.message || 'signups 테이블을 찾지 못했습니다.',
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

  const { orderer_name, size, wish_date, consent } = body || {}

  if (!orderer_name || !String(orderer_name).trim()) {
    return NextResponse.json({ ok: false, error: '주문자명을 적어주세요.' }, { status: 400 })
  }
  if (!size) {
    return NextResponse.json({ ok: false, error: '상품 옵션을 골라주세요.' }, { status: 400 })
  }

  // 개인정보(아이 이름)를 받으므로 동의 없이는 저장하지 않는다. 클라이언트 검증만으로는 부족하다.
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

  const { error } = await supabase.from('signups').insert({
    orderer_name: String(orderer_name).trim().slice(0, 40),
    size,
    wish_date: wish_date || null,
  })

  if (error) {
    // 사용자 흐름은 끊지 않되, 왜 저장이 안 됐는지는 응답에 남긴다.
    console.error('[signup · 저장 실패]', error.message)
    return NextResponse.json({ ok: true, stored: false, reason: error.message })
  }

  return NextResponse.json({ ok: true, stored: true })
}
