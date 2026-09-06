import Link from 'next/link'
import { readLegal, mdToHtml } from '../../lib/legal'

export const metadata = {
  title: '서비스 이용약관 · BENW',
  description: 'BENW 「미리 맞춘 개학」 알림신청 서비스의 이용 조건을 안내합니다.',
}

export default function Terms() {
  const md = readLegal('이용약관')

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
