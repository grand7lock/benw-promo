'use client'

import { useEffect, useState, useCallback } from 'react'
import { PROMO, SIZES } from '../../lib/config'

const sizeName = (id) => SIZES.find((s) => s.id === id)?.name || id

function fmt(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function Admin() {
  const [authed, setAuthed] = useState(null)   // null = 확인 중
  const [password, setPassword] = useState('')
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin')
      if (res.status === 401) { setAuthed(false); return }
      const data = await res.json()
      if (!data.ok) { setError(data.error || '불러오지 못했습니다.'); setAuthed(true); return }
      setRows(data.rows)
      setAuthed(true)
    } catch {
      setError('연결에 실패했습니다.')
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function login(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.error || '로그인에 실패했습니다.'); return }
      setPassword('')
      await load()
    } finally { setBusy(false) }
  }

  async function remove(id) {
    if (!confirm('이 신청을 지울까요? 되돌릴 수 없습니다.')) return
    const res = await fetch(`/api/admin?id=${id}`, { method: 'DELETE' })
    if (res.ok) setRows((r) => r.filter((x) => x.id !== id))
    else setError('삭제에 실패했습니다.')
  }

  function downloadCsv() {
    const head = ['신청시각', '주문자명', '상품 옵션', '받는 희망일자']
    const body = rows.map((r) => [
      fmt(r.created_at), r.orderer_name || '', sizeName(r.size), r.wish_date || '',
    ])
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
    const csv = '﻿' + [head, ...body].map((line) => line.map(esc).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `benw-신청명단-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ── 로그인 ── */
  if (authed === false) {
    return (
      <main className="admin-gate">
        <form className="admin-login" onSubmit={login}>
          <span className="eyebrow">BENW 관리자</span>
          <h1>신청 명단</h1>
          <p className="muted">
            주문자명이 담겨 있습니다. 비밀번호를 넣어주세요.
          </p>
          <input
            type="password" value={password} autoFocus
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button className="btn" type="submit" disabled={busy || !password}>
            {busy ? '확인 중…' : '들어가기'}
          </button>
        </form>
      </main>
    )
  }

  if (authed === null) {
    return <main className="admin-gate"><p className="muted">불러오는 중…</p></main>
  }

  /* ── 대시보드 ── */
  const bySize = SIZES.map((s) => ({
    ...s,
    n: rows.filter((r) => r.size === s.id).length,
  }))
  const top = Math.max(1, ...bySize.map((s) => s.n))

  return (
    <main className="admin">
      <div className="wrap-wide">
        <header className="admin-head">
          <div>
            <span className="eyebrow">BENW 관리자</span>
            <h1>「{PROMO.title}」 신청 명단</h1>
          </div>
          <button className="btn btn-ghost admin-csv" onClick={downloadCsv} disabled={!rows.length}>
            CSV 내려받기
          </button>
        </header>

        {error && <p className="admin-error" role="alert">{error}</p>}

        <div className="stat-row">
          <div className="stat">
            <span className="stat-label">신청</span>
            <span className="stat-num">{rows.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">남은 수량</span>
            <span className="stat-num">{Math.max(0, PROMO.totalStock - rows.length)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">희망일자 적어준 분</span>
            <span className="stat-num">{rows.filter((r) => r.wish_date).length}</span>
          </div>
        </div>

        <section className="admin-block">
          <h2>사이즈 분포</h2>
          <p className="muted">이 페이지가 알고 싶었던 바로 그 숫자입니다.</p>
          <div className="bars">
            {bySize.map((s) => (
              <div className="bar-row" key={s.id}>
                <span className="bar-name">{s.name}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${(s.n / top) * 100}%` }} />
                </span>
                <span className="bar-num">{s.n}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-block">
          <h2>전체 명단</h2>
          {rows.length === 0 ? (
            <p className="muted">아직 신청이 없습니다.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>신청시각</th><th>주문자명</th><th>상품 옵션</th>
                    <th>받는 희망일자</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="num">{fmt(r.created_at)}</td>
                      <td>{r.orderer_name || '—'}</td>
                      <td><strong>{sizeName(r.size)}</strong></td>
                      <td className="num">{r.wish_date || '—'}</td>
                      <td>
                        <button className="row-del" onClick={() => remove(r.id)} title="삭제">
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="admin-foot">
          수집한 정보(주문자명 · 상품 옵션 · 받는 희망일자)는
          <strong> {PROMO.disposeBy}</strong>까지 보관 후 파기합니다.
        </footer>
      </div>
    </main>
  )
}
