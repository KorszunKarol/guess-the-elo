'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function BackgroundAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Create floating pieces
        const pieces: THREE.Mesh[] = [];
        const pieceGeometry = new THREE.BoxGeometry(1, 1, 1);
        const pieceMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a5568,
            transparent: true,
            opacity: 0.1,
            wireframe: true,
        });

        for (let i = 0; i < 20; i++) {
            const piece = new THREE.Mesh(pieceGeometry, pieceMaterial);
            piece.position.set(
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
            );
            piece.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            pieces.push(piece);
            scene.add(piece);
        }

        camera.position.z = 15;

        // Animation
        function animate() {
            requestAnimationFrame(animate);

            pieces.forEach((piece) => {
                piece.rotation.x += 0.001;
                piece.rotation.y += 0.001;
                piece.position.y += Math.sin(Date.now() * 0.001) * 0.01;
            });

            renderer.render(scene, camera);
        }

        animate();

        // Handle resize
        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 opacity-50"
            style={{
                background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
            }}
        />
    );
}
