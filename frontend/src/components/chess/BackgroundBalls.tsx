'use client';

import { useEffect, useRef } from 'react';

export function BackgroundBalls() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const balls: Ball[] = [];
        const numBalls = 50;
        const colors = ['#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#1abc9c'];

        class Ball {
            x: number;
            y: number;
            radius: number;
            dx: number;
            dy: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 20 + 5;
                this.dx = (Math.random() - 0.5) * 2;
                this.dy = (Math.random() - 0.5) * 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }

            update() {
                if (
                    this.x + this.radius > canvas.width ||
                    this.x - this.radius < 0
                ) {
                    this.dx = -this.dx;
                }
                if (
                    this.y + this.radius > canvas.height ||
                    this.y - this.radius < 0
                ) {
                    this.dy = -this.dy;
                }
                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        for (let i = 0; i < numBalls; i++) {
            balls.push(new Ball());
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach((ball) => ball.update());
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10"
        />
    );
}
