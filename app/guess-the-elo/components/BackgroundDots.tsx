"use client"

import React from 'react'

function BackgroundDots() {
  const dotSpacing = 20
  const dotSize = 1.5 // Slightly smaller dots
  const dotColor = 'rgba(74, 85, 104, 0.6)' // Reduced opacity for a more subtle effect

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
        backgroundPosition: `${dotSpacing / 2}px ${dotSpacing / 2}px`, // Offset the dots
      }}
    />
  )
}

export { BackgroundDots };