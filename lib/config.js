// 프로모션 설정 — 값만 바꾸면 페이지 전체가 따라 바뀝니다.

export const PROMO = {
  title: '미리 맞춘 개학',
  sub: '12,900원짜리 신발주머니 포함 3종, 9,900원.',

  anchorPrice: 12900,   // 쿠팡 로켓배송 신발주머니 단품가
  setPrice: 9900,       // 세트 판매가

  totalStock: 100,      // 선착순 수량
  applyStart: '2026-08-30',
  applyEnd: '2026-09-13',
  openDate: '9월 1일',  // 세트 오픈일

  // ⚠️ 실제 주소로 바꿔주세요 (환경변수로 덮어쓸 수 있습니다)
  storeUrl: process.env.NEXT_PUBLIC_STORE_URL || '',
  kakaoUrl: process.env.NEXT_PUBLIC_KAKAO_URL || '',
  kitUrl: process.env.NEXT_PUBLIC_KIT_URL || '',   // 개학 키트 PDF
}

export const SIZES = [
  { id: 'pocket', name: '포켓', desc: '실내화만 · 저학년' },
  { id: 'large',  name: '대',   desc: '실내화 + 체육복' },
  { id: 'xlarge', name: '특대', desc: '운동화까지 · 고학년' },
]

export const GRADES = ['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '그 외']

export const PAINS = [
  '실내화가 젖어서 다른 짐까지 축축해진다',
  '사이즈가 안 맞아서 억지로 욱여넣는다',
  '뭐가 어디 있는지 몰라서 아침마다 다 꺼낸다',
  '금방 헤져서 한 학기도 못 간다',
  '냄새가 밴다',
]
