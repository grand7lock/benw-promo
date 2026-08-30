import './globals.css'
import { PROMO } from '../lib/config'

export const metadata = {
  title: `${PROMO.title} · BENW`,
  description: `${PROMO.sub} 선착순 ${PROMO.totalStock}세트, 설문에 답해주신 분께 먼저 열어드립니다.`,
  openGraph: {
    title: `${PROMO.title} · BENW`,
    description: PROMO.sub,
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16233F',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
