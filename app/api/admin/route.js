import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHash } from 'crypto'
import { getSupabase } from '../../../lib/supabase'

export const dynamic = 'force-dynamic'

const COOKIE = 'benw_admin'

function token() {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return null
  return createHash('sha256').update(`benw:${pw}`).digest('hex')
}

function authed() {
  const t = token()
  // 비밀번호가 설정돼 있지 않으면 아무도 통과시키지 않는다.
  if (!t) return false
  return cookies().get(COOKIE)?.value === t
}

// 로그인
export async function POST(request) {
  const t = token()
  if (!t) {
    return NextResponse.json(
      { ok: false, error: 'ADMIN_PASSWORD 가 설정되지 않았습니다.' },
      { status: 503 },
    )
  }

  let body
  try { body = await request.json() } catch { body = {} }

  if (body?.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: '비밀번호가 맞지 않습니다.' }, { status: 401 })
  }

  cookies().set(COOKIE, t, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,   // 8시간
  })
  return NextResponse.json({ ok: true })
}

// 명단 조회
export async function GET() {
  if (!authed()) return NextResponse.json({ ok: false, authed: false }, { status: 401 })

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Supabase 가 연결되지 않았습니다.' }, { status: 503 })
  }

  const { data, error } = await supabase
    .from('signups')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  // 마이그레이션 전에 저장된 행은 옛 컬럼에 값이 들어 있다. 한 모양으로 맞춰서 내보낸다.
  const rows = (data || []).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    size: r.size,
    orderer_name: r.orderer_name ?? r.grade ?? null,
    wish_date: r.wish_date ?? r.weekly_load ?? null,
  }))

  return NextResponse.json({ ok: true, authed: true, rows })
}

// 한 건 삭제
export async function DELETE(request) {
  if (!authed()) return NextResponse.json({ ok: false }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id 가 없습니다.' }, { status: 400 })

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 })

  const { error } = await supabase.from('signups').delete().eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
