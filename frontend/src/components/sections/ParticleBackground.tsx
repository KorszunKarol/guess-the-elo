'use client';

import { useEffect, useState } from 'react';
import styles from './ParticleBackground.module.css';

export function ParticleBackground() {
    const [particles, setParticles] = useState<
        Array<{ id: number; x: number; y: number; size: number }>
    >([]);

    useEffect(() => {
        const particleCount = 100;
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-900">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={`absolute rounded-full ${styles.particle}`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: `radial-gradient(circle at center, rgba(96, 165, 250, 0.3), rgba(147, 51, 234, 0.3))`,
                        boxShadow: '0 0 10px rgba(96, 165, 250, 0.2)',
                        animation: `${styles.float} ${5 + Math.random() * 5}s infinite ease-in-out`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}
        </div>
    );
}
