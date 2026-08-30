// 프로모션 설정 — 값만 바꾸면 페이지 전체가 따라 바뀝니다.

export const PROMO = {
  title: '미리 맞춘 개학',
  sub: '하나에 11,900원인 그 가방. 3종 묶어서 9,900원.',

  anchorPrice: 11900,   // 쿠팡 단품 판매가 (BENW 국산 보조가방 · 정가 21,900)
  anchorList: 21900,    // 쿠팡 표시 정가
  anchorUrl: 'https://www.coupang.com/vp/products/7097921281?itemId=17708511041&vendorItemId=84873386761',
  // 쿠팡 실제 판매화면 캡처. public/ 에 파일을 넣고 여기에 경로를 적으면 히어로에 붙는다.
  // 비워두면 이미지 블록 자체가 렌더되지 않는다. (깨진 이미지가 뜨지 않게)
  proofImg: '/coupang.png',
  setPrice: 9900,       // 세트 판매가

  totalStock: 1000,     // 선착순 수량
  applyStart: '2026-08-30',
  applyEnd: '2026-09-13',
  openDate: '9월 1일',  // 세트 오픈일
  wishDateMin: '2026-09-01',
  wishDateMax: '2026-09-30',
  disposeBy: '2027년 3월 31일',  // 개인정보 파기 예정일

  // 가두리망 주소 — 공개 URL이라 코드에 둔다. 환경변수로 덮어쓸 수도 있다.
  storeUrl: process.env.NEXT_PUBLIC_STORE_URL || 'https://smartstore.naver.com/bya5555',
  kakaoUrl: process.env.NEXT_PUBLIC_KAKAO_URL || '',   // ☐ http://pf.kakao.com/_XXXXX
  kitUrl: process.env.NEXT_PUBLIC_KIT_URL || '',       // ☐ 개학 키트 PDF
}

// 상품 옵션 — 학년이 아니라 디자인과 크기로 나뉜다.
// img 는 public/ 안의 경로. 비워두면 회색 자리만 보인다.
export const SIZES = [
  {
    id: 'pocket',
    name: '포켓',
    desc: '앞주머니가 달린 디자인',
    dims: '가로 27 × 세로 34 × 폭 11 cm',
    handle: '손잡이 14 cm',
    img: '',
  },
  {
    id: 'large',
    name: '대',
    desc: '기본형 · 위쪽 지퍼',
    dims: '가로 27 × 세로 34 cm',
    handle: '손잡이 14 cm',
    img: '',
  },
  {
    id: 'xlarge',
    name: '특대',
    desc: '한 치수 더 큼 · 위쪽 지퍼',
    dims: '가로 30 × 세로 36 × 폭 11 cm',
    handle: '손잡이 14 cm',
    img: '',
  },
]

// 공감 섹션에 쓰는 문구. 설문 항목이 아니라 읽는 글이다.
export const PAINS = [
  '실내화가 젖어서 다른 짐까지 축축해진다',
  '사이즈가 안 맞아서 억지로 욱여넣는다',
  '뭐가 어디 있는지 몰라서 아침마다 다 꺼낸다',
  '금방 헤져서 한 학기도 못 간다',
  '냄새가 밴다',
]

// 신청 즉시 드리는 것
export const KIT_ITEMS = [
  '요일별 준비물 체크리스트 (냉장고·현관 부착용)',
  '실내화·신발주머니 냄새 안 나게 관리하는 법',
]
