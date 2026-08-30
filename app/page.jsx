'use client'

import { useEffect, useState } from 'react'
import { PROMO, SIZES, GRADES, PAINS } from '../lib/config'

const won = (n) => n.toLocaleString('ko-KR')

export default function Page() {
  const [step, setStep] = useState(1)
  const [remaining, setRemaining] = useState(PROMO.totalStock)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [gateDone, setGateDone] = useState({ store: false, kakao: false })

  const [grade, setGrade] = useState('')
  const [weeklyLoad, setWeeklyLoad] = useState('')
  const [pain, setPain] = useState('')
  const [size, setSize] = useState('')
  const [childName, setChildName] = useState('')
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    fetch('/api/submit')
      .then((r) => r.json())
      .then((d) => { if (typeof d.remaining === 'number') setRemaining(d.remaining) })
      .catch(() => {})
  }, [])

  async function submit(e) {
    e.preventDefault()
    setError('')

    if (!grade) { setError('아이 학년을 골라주세요.'); return }
    if (!size)  { setError('신발주머니 사이즈를 골라주세요.'); return }
    if (!consent) { setError('개인정보 수집·이용에 동의해주셔야 신청됩니다.'); return }

    setSending(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade, weekly_load: weeklyLoad, pain, size, child_name: childName, consent,
        }),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.error || '잠시 후 다시 눌러주세요.'); return }
      setRemaining((n) => Math.max(0, n - 1))
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('연결이 불안정합니다. 다시 눌러주세요.')
    } finally {
      setSending(false)
    }
  }

  const sizeLabel = SIZES.find((s) => s.id === size)?.name
  // 주소가 채워진 가두리망만 노출한다. 죽은 버튼을 보여주지 않기 위해서.
  const gateCount = [PROMO.storeUrl, PROMO.kakaoUrl].filter(Boolean).length

  return (
    <>
      {/* ───────────── 히어로 ───────────── */}
      <header className="hero">
        <div className="wrap hero-inner">
          <span className="eyebrow">BENW · 100% 국내 생산</span>
          <h1>{PROMO.title}</h1>
          <p className="lede">
            개학하고 나서 사면 이미 늦습니다.<br />
            <strong>사이즈부터 고르고</strong> 시작하세요.
          </p>

          <div className="anchor">
            <span className="anchor-old">단품 {won(PROMO.anchorPrice)}원</span>
            <span className="anchor-new">{won(PROMO.setPrice)}원</span>
            <span className="anchor-note">
              쿠팡에서 <strong>하나에 {won(PROMO.anchorPrice)}원</strong>인 그 가방입니다.
              그걸 포함해 <strong>3종</strong>을 {won(PROMO.setPrice)}원에 엽니다.
              {PROMO.anchorUrl && (
                <>
                  {' '}
                  <a href={PROMO.anchorUrl} target="_blank" rel="noopener noreferrer">
                    쿠팡에서 확인하기 →
                  </a>
                </>
              )}
            </span>
          </div>

          {PROMO.proofImg && (
            <figure className="proof">
              <img
                src={PROMO.proofImg}
                alt={`쿠팡 판매 화면 — BENW 국산 보조가방 ${won(PROMO.anchorPrice)}원`}
              />
              <figcaption>
                쿠팡 실제 판매 화면 · 정가 {won(PROMO.anchorList)}원 → {won(PROMO.anchorPrice)}원
              </figcaption>
            </figure>
          )}

          <span className="stock">
            <i className="dot" aria-hidden="true" />
            {PROMO.totalStock}세트 중 <strong>{remaining}세트</strong> 남음
          </span>
        </div>
      </header>

      {step === 1 && (
        <>
          {/* ───────────── 공감 ───────────── */}
          <section>
            <div className="wrap stack" style={{ gap: '1rem' }}>
              <span className="eyebrow">왜 매년 같은 일이 반복되나</span>
              <h2>신발주머니는 사이즈를 안 보고 삽니다.</h2>
              <p className="lede">
                실내화가 몇 밀리인지, 사물함에 들어가는지 모른 채
                <strong> “괜찮아 보여서”</strong> 담습니다.
                그래서 받아보고 다시 사게 됩니다.
              </p>

              <div className="pain-list">
                {PAINS.map((p, i) => (
                  <div className="pain-item" key={p}>
                    <span className="pain-no">{String(i + 1).padStart(2, '0')}</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>

              <p className="muted" style={{ marginTop: '1rem' }}>
                BENW가 파는 건 가방이 아니라, <strong>자기 상황을 알고 고르게 되는 상태</strong>입니다.
                그래서 이번엔 <strong>사이즈를 먼저 고르게</strong> 합니다.
              </p>
            </div>
          </section>

          {/* ───────────── 3종 구성 ───────────── */}
          <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
            <div className="wrap stack" style={{ gap: '0.6rem' }}>
              <span className="eyebrow">구성</span>
              <h2>3종이 들어갑니다.</h2>

              <div className="kit">
                <div className="kit-card">
                  <span className="kit-tag">01</span>
                  <h3>신발주머니 — 3사이즈 중 택 1</h3>
                  <p className="muted">
                    포켓 · 대 · 특대. <strong>값은 셋 다 같습니다.</strong> 크기만 고르시면 됩니다.
                  </p>
                </div>

                <div className="kit-card">
                  <span className="kit-tag">02</span>
                  <h3>신발 이너백</h3>
                  <p className="muted">
                    젖은 실내화와 흙 묻은 운동화를 가방 안에서 분리합니다.
                  </p>
                </div>

                <div className="kit-card mystery">
                  <span className="kit-tag">03</span>
                  <h3>?</h3>
                  <p className="muted">
                    열어보셔야 압니다. 다만 <strong>꽝은 없고</strong>,
                    무엇이 나와도 단품 값보다 쌉니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ───────────── 설문 + 사이즈 ───────────── */}
          <section id="apply">
            <div className="wrap">
              <div className="steps" aria-hidden="true">
                <span className="step-bar on" /><span className="step-bar" /><span className="step-bar" />
              </div>

              <span className="eyebrow">1 / 3 · 10초면 끝납니다</span>
              <h2 style={{ marginTop: '0.5rem' }}>세 가지만 답해주세요.</h2>
              <p className="muted" style={{ marginTop: '0.6rem' }}>
                답해주신 분께만 {PROMO.openDate}에 먼저 엽니다.
                답이 다음 시즌 구성에 그대로 반영됩니다.
              </p>

              <form className="form" onSubmit={submit}>
                <div className="field">
                  <span className="field-label">01. 우리 아이 학년</span>
                  <div className="choices">
                    {GRADES.map((g) => (
                      <button
                        type="button" key={g} className="choice"
                        aria-pressed={grade === g}
                        onClick={() => setGrade(g)}
                      >{g}</button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <span className="field-label">02. 요일마다 챙기는 짐이 있나요?</span>
                  <span className="field-help">체육복, 수영가방, 태권도복 같은 것. 없으면 비워두셔도 됩니다.</span>
                  <input
                    type="text" value={weeklyLoad}
                    onChange={(e) => setWeeklyLoad(e.target.value)}
                    placeholder="예 · 화목 태권도, 금요일 수영"
                  />
                </div>

                <div className="field">
                  <span className="field-label">03. 제일 짜증나는 순간은?</span>
                  <div className="choices">
                    {PAINS.map((p) => (
                      <button
                        type="button" key={p} className="choice"
                        aria-pressed={pain === p}
                        onClick={() => setPain(p)}
                      >{p}</button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <span className="field-label">그리고 — 사이즈를 골라주세요</span>
                  <span className="field-help">
                    값은 셋 다 같습니다. <strong>여기가 이번 프로모션의 핵심</strong>이에요.
                  </span>
                  <div className="sizes">
                    {SIZES.map((s) => (
                      <button
                        type="button" key={s.id} className="size"
                        aria-pressed={size === s.id}
                        onClick={() => setSize(s.id)}
                      >
                        <span className="size-name">{s.name}</span>
                        <span className="size-desc">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <span className="field-label">아이 이름 (선택)</span>
                  <span className="field-help">방수 네임라벨에 넣어 드립니다.</span>
                  <input
                    type="text" value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="예 · 김서준"
                    maxLength={20}
                  />
                </div>

                <div className="consent">
                  <label className="consent-check">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>
                      <strong>[필수]</strong> 개인정보 수집·이용에 동의합니다.
                    </span>
                  </label>

                  <dl className="consent-detail">
                    <div>
                      <dt>수집 항목</dt>
                      <dd>아이 학년 · 요일별 준비물 · 불편한 점 · 신발주머니 사이즈 · <strong>아이 이름(선택)</strong></dd>
                    </div>
                    <div>
                      <dt>이용 목적</dt>
                      <dd>「{PROMO.title}」 세트 알림신청 접수 · 사이즈 배정 · 다음 시즌 구성 참고</dd>
                    </div>
                    <div>
                      <dt>보유 기간</dt>
                      <dd>프로모션 종료 후 3개월 이내 파기 (<strong>{PROMO.disposeBy}</strong>까지)</dd>
                    </div>
                  </dl>

                  <p className="consent-note">
                    동의를 거부하실 수 있으며, 거부하시면 신청이 어렵습니다.
                    아이 이름은 <strong>네임라벨 제작에만</strong> 쓰이며 적지 않으셔도 신청됩니다.
                  </p>

                  <p className="consent-note">
                    알림은 <strong>스마트스토어 알림받기 · 카카오톡 채널</strong>로 발송됩니다.
                    마케팅 수신 동의는 <strong>각 채널에서 직접</strong> 하시게 되며, 이 페이지에서는 받지 않습니다.
                  </p>
                </div>

                {error && (
                  <p style={{ color: '#B3261E', fontSize: '0.92rem' }} role="alert">{error}</p>
                )}

                <button className="btn" type="submit" disabled={sending}>
                  {sending ? '보내는 중…' : '다음 — 알림 신청하기'}
                </button>
              </form>
            </div>
          </section>
        </>
      )}

      {/* ───────────── 2단계 · 가두리망 ───────────── */}
      {step === 2 && (
        <section>
          <div className="wrap">
            <div className="steps" aria-hidden="true">
              <span className="step-bar on" /><span className="step-bar on" /><span className="step-bar" />
            </div>

            <span className="eyebrow">2 / 3 · 마지막 단계</span>
            <h2 style={{ marginTop: '0.5rem' }}>
              {sizeLabel ? `‘${sizeLabel}’ 사이즈로 접수했습니다.` : '접수했습니다.'}
            </h2>
            <p className="lede" style={{ marginTop: '0.8rem' }}>
              {PROMO.openDate}에 여는 순간 알려드릴 곳이 필요합니다.
              <strong> {gateCount > 1 ? '둘 다 눌러주셔야' : '아래를 눌러주셔야'}</strong> 자리가 확정됩니다.
            </p>

            <div className="gate-note" style={{ marginTop: '1.5rem' }}>
              선착순 {PROMO.totalStock}세트입니다. 아래를 누르지 않으면 알림을 보내드릴 수 없어
              자리가 다음 분께 넘어갑니다.
            </div>

            <div className="gate">
              {PROMO.storeUrl && (
                <a
                  className="btn btn-accent"
                  href={PROMO.storeUrl}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setGateDone((g) => ({ ...g, store: true }))}
                >
                  {gateCount > 1 ? '① ' : ''}스마트스토어 알림받기 {gateDone.store ? '✓' : ''}
                </a>
              )}
              {PROMO.kakaoUrl && (
                <a
                  className="btn btn-accent"
                  href={PROMO.kakaoUrl}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setGateDone((g) => ({ ...g, kakao: true }))}
                >
                  {gateCount > 1 ? '② ' : ''}카카오톡 채널 추가 {gateDone.kakao ? '✓' : ''}
                </a>
              )}

              <button
                className="btn btn-ghost"
                style={{ marginTop: '1rem' }}
                onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              >
                {gateCount > 1 ? '둘 다 했어요' : '눌렀어요'} — 개학 키트 받기
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ───────────── 3단계 · 완료 ───────────── */}
      {step === 3 && (
        <section>
          <div className="wrap stack" style={{ gap: '1rem' }}>
            <div className="steps" aria-hidden="true">
              <span className="step-bar on" /><span className="step-bar on" /><span className="step-bar on" />
            </div>

            <span className="done-mark" aria-hidden="true">✓</span>
            <h2>신청됐습니다.</h2>
            <p className="lede">
              {PROMO.openDate}에 {sizeLabel ? `‘${sizeLabel}’ 사이즈로 ` : ''}
              먼저 열어드립니다. 알림으로 보내드릴게요.
            </p>

            <div className="gate-note" style={{ marginTop: '1rem' }}>
              <strong>지금 바로 쓰실 수 있는 개학 키트</strong>입니다.
              요일별 준비물 체크리스트 · 방수 네임라벨 · 냄새 관리법 3장.
            </div>

            {PROMO.kitUrl ? (
              <a
                className="btn"
                href={PROMO.kitUrl}
                target="_blank" rel="noopener noreferrer"
                style={{ marginTop: '0.5rem' }}
              >
                개학 키트 PDF 받기
              </a>
            ) : (
              <p className="muted" style={{ marginTop: '0.5rem' }}>
                개학 키트는 신청하신 곳으로 바로 보내드립니다.
              </p>
            )}

            <p className="muted" style={{ marginTop: '1.5rem' }}>
              {PROMO.totalStock}세트 중 <strong>{remaining}세트</strong> 남았습니다.
            </p>
          </div>
        </section>
      )}

      <footer>
        <div className="wrap stack" style={{ gap: '0.35rem' }}>
          <span><strong>BENW</strong> · 타포린백 · 보냉백 · 신발주머니 · 100% 국내 생산</span>
          <span>알림신청 {PROMO.applyStart} ~ {PROMO.applyEnd} · 선착순 {PROMO.totalStock}세트</span>
          <span>「{PROMO.title}」 — 우리는 가방을 파는 게 아니라, 자기 상황을 알고 고르게 되는 상태를 팝니다.</span>
        </div>
      </footer>
    </>
  )
}
