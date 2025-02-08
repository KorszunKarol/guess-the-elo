'use client';

import React from 'react';

function BackgroundDots() {
    const dotSpacing = 30;
    const dotSize = 2;

    return (
        <div
            className="fixed inset-0"
            style={{
                backgroundImage: `
          radial-gradient(
            circle at center,
            rgba(74, 85, 104, 0.4) ${dotSize}px,
            transparent ${dotSize}px
          )
        `,
                backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
                backgroundPosition: `${dotSpacing / 2}px ${dotSpacing / 2}px`,
                maskImage:
                    'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.8) 20%, transparent)',
                WebkitMaskImage:
                    'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.8) 20%, transparent)',
            }}
        />
    );
}

export { BackgroundDots };
