// 프로모션 설정 — 값만 바꾸면 페이지 전체가 따라 바뀝니다.

export const PROMO = {
  title: '미리 맞춘 개학',
  sub: '하나에 11,900원인 그 가방. 3종 묶어서 9,900원.',

  anchorPrice: 11900,   // 쿠팡 단품 판매가 (BENW 국산 보조가방 · 정가 21,900)
  anchorList: 21900,    // 쿠팡 표시 정가
  anchorUrl: 'https://www.coupang.com/vp/products/7097921281?itemId=17708511036&vendorItemId=84873386744',
  // 쿠팡 실제 판매화면 캡처. public/ 에 파일을 넣고 여기에 경로를 적으면 히어로에 붙는다.
  // 비워두면 이미지 블록 자체가 렌더되지 않는다. (깨진 이미지가 뜨지 않게)
  proofImg: '/coupang.png',
  setPrice: 9900,       // 세트 판매가

  totalStock: 100,      // 선착순 수량
  applyStart: '2026-08-30',
  applyEnd: '2026-09-13',
  openDate: '9월 1일',  // 세트 오픈일

  // 가두리망 주소 — 공개 URL이라 코드에 둔다. 환경변수로 덮어쓸 수도 있다.
  storeUrl: process.env.NEXT_PUBLIC_STORE_URL || 'https://smartstore.naver.com/bya5555',
  kakaoUrl: process.env.NEXT_PUBLIC_KAKAO_URL || '',   // ☐ http://pf.kakao.com/_XXXXX
  kitUrl: process.env.NEXT_PUBLIC_KIT_URL || '',       // ☐ 개학 키트 PDF
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
