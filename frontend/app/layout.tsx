import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { IconProvider } from '@/providers/IconProvider'

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
      <body className={inter.className}>
        <IconProvider>
          {children}
        </IconProvider>
      </body>
    </html>
  )
}
