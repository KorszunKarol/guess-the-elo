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
        {/* Preload both WASM files with lower priority */}
        <link
          rel="preload"
          href="/wasm/stockfish-nnue-16-single.wasm"
          as="fetch"
          crossOrigin="anonymous"
          type="application/wasm"
          fetchpriority="low"
        />
        <link
          rel="preload"
          href="/wasm/stockfish-nnue-16.wasm"
          as="fetch"
          crossOrigin="anonymous"
          type="application/wasm"
          fetchpriority="low"
        />
      </head>
      <body className={inter.className}>
        {/* This should be empty - all layouts are handled in route groups */}
        {children}
      </body>
    </html>
  )
}
