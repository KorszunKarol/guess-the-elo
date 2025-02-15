import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChessDetective - Guess Ratings & Evaluations',
  description: 'Investigate chess positions, solve rating mysteries, and uncover engine evaluations in this unique chess analysis game.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/_next/static/wasm/stockfish-nnue-16-single.wasm"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {/* This should be empty - all layouts are handled in route groups */}
        {children}
      </body>
    </html>
  )
}
