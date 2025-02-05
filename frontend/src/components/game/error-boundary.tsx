'use client'

import { useEffect } from 'react'

interface ErrorBoundaryProps {
  onReset: () => void
  children: React.ReactNode
}

export function ErrorBoundary({ onReset, children }: ErrorBoundaryProps) {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Chess Error:', error)
      onReset()
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [onReset])

  return <>{children}</>
}