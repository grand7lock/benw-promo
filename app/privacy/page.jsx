import Link from 'next/link'
import { readLegal, mdToHtml } from '../../lib/legal'

export const metadata = {
  title: '개인정보 처리방침 · BENW',
  description: 'BENW가 수집하는 개인정보 항목과 이용 목적, 보유 기간을 안내합니다.',
}

export default function Privacy() {
  const md = readLegal('개인정보처리방침')

  return (
    <main className="legal">
      <div className="wrap">
        <Link className="legal-back" href="/">← 「미리 맞춘 개학」으로 돌아가기</Link>
        {md
          ? <article className="legal-body" dangerouslySetInnerHTML={{ __html: mdToHtml(md) }} />
          : <p className="muted">문서를 불러오지 못했습니다.</p>}
      </div>
    </main>
  )
}
