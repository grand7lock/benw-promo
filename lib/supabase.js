import { createClient } from '@supabase/supabase-js'

// 서버에서만 씁니다. 키가 없으면 null 을 돌려주고, 페이지는 그대로 동작합니다.
// (Supabase 를 아직 안 붙였어도 랜딩이 죽지 않게 하려는 것)
export function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY

  if (!url || !key) return null

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}
