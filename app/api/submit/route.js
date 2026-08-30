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

  if (error) {
    return NextResponse.json({ count: 0, remaining: PROMO.totalStock, connected: false })
  }

  const used = count || 0
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

  const { grade, weekly_load, pain, size, child_name } = body || {}

  if (!grade || !size) {
    return NextResponse.json(
      { ok: false, error: '학년과 사이즈는 꼭 골라주세요.' },
      { status: 400 },
    )
  }

  const supabase = getSupabase()

  // Supabase 를 아직 안 붙였어도 신청 흐름은 끊기지 않게 한다.
  if (!supabase) {
    console.log('[signup · 미저장]', { grade, size, pain })
    return NextResponse.json({ ok: true, stored: false })
  }

  const { error } = await supabase.from('signups').insert({
    grade,
    weekly_load: weekly_load || null,
    pain: pain || null,
    size,
    child_name: child_name || null,
  })

  if (error) {
    // 사용자 흐름은 끊지 않되, 왜 저장이 안 됐는지는 응답에 남긴다.
    console.error('[signup · 저장 실패]', error.message)
    return NextResponse.json({ ok: true, stored: false, reason: error.message })
  }

  return NextResponse.json({ ok: true, stored: true })
}
