import { useEffect, useRef, useState } from 'react';
import { ComponentData } from '../types';
import { components, connections } from '../data/systemData';

interface Scene3DProps {
    onComponentClick: (component: ComponentData) => void;
    visibleProcesses: Set<string>;
}

const COMPONENT_SIZE = 50;
const COMPONENT_HOVER_FACTOR = 1.2;

export default function Scene3D({ onComponentClick, visibleProcesses }: Scene3DProps) {
    const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hoveredRef = useRef<string | null>(null);
    const animationRef = useRef<number | null>(null);
    const particlesRef = useRef<
        {
            progress: number;
            speed: number;
            offset: number;
            size: number;
            opacity: number;
        }[]
    >([]);
    const screenPositionsRef = useRef<Record<string, { x: number; y: number }>>({});

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const positions = screenPositionsRef.current;

        let found: string | null = null;

        components.forEach((comp) => {
            if (!visibleProcesses.has(comp.type)) return;

            const pos = positions[comp.id];

            const dist = Math.hypot(x - pos.x, y - pos.y);
            if (dist < 35) found = comp.id;
        });

        hoveredRef.current = found;
        setHoveredComponent(found);
        canvas.style.cursor = found ? 'pointer' : 'default';
    };

    const handleClick = () => {
        if (!hoveredRef.current) return;
        const comp = components.find((c) => c.id === hoveredRef.current);
        if (comp) onComponentClick(comp);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;

            ctx.resetTransform();
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const scale = 40;

            // Cache component screen positions
            const positions: Record<string, { x: number; y: number }> = {};
            components.forEach((c) => {
                positions[c.id] = {
                    x: centerX + c.position.x * scale,
                    y: centerY - c.position.y * scale,
                };
            });
            screenPositionsRef.current = positions;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        if (particlesRef.current.length === 0) {
            for (let i = 0; i < 60; i++) {
                particlesRef.current.push({
                    progress: Math.random(),
                    speed: 0.001 + Math.random() * 0.0015,
                    offset: Math.random() * 20 - 10,
                    size: 2 + Math.random() * 2,
                    opacity: 0.4 + Math.random() * 0.6,
                });
            }
        }

        const componentColors: Record<string, string> = {
            inlet: '#3b82f6',
            prefilter: '#60a5fa',
            pump: '#2563eb',
            aeration: '#38bdf8',
            sedimentation: '#0ea5e9',
            carbon: '#1e293b',
            disinfection: '#a78bfa',
            storage: '#06b6d4',
            outlet: '#10b981',
        };

        const animate = () => {
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);

            const positions = screenPositionsRef.current;

            // Move particles
            particlesRef.current.forEach((p) => {
                p.progress += p.speed;
                if (p.progress > 1) p.progress = 0;
            });

            // Draw connections + particles on them
            connections.forEach((conn) => {
                const from = components.find((c) => c.id === conn.from);
                const to = components.find((c) => c.id === conn.to);
                if (!from || !to) return;

                if (!visibleProcesses.has(from.type) || !visibleProcesses.has(to.type)) return;

                const start = positions[from.id];
                const end = positions[to.id];

                ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();

                ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();

                // Particles
                particlesRef.current.forEach((p) => {
                    const x = start.x + (end.x - start.x) * p.progress;
                    const y = start.y + (end.y - start.y) * p.progress;

                    ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
                    ctx.beginPath();
                    ctx.arc(x, y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            // Draw components
            components.forEach((comp) => {
                if (!visibleProcesses.has(comp.type)) return;

                const pos = positions[comp.id];
                const isHovered = hoveredRef.current === comp.id;
                const size = isHovered ? COMPONENT_SIZE * COMPONENT_HOVER_FACTOR : COMPONENT_SIZE;

                ctx.shadowColor = componentColors[comp.type];
                ctx.shadowBlur = isHovered ? 25 : 12;

                ctx.fillStyle = componentColors[comp.type];
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;

                if (comp.status === 'warning') {
                    ctx.strokeStyle = '#fbbf24';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, size + 6, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (comp.status === 'error') {
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, size + 6, 0, Math.PI * 2);
                    ctx.stroke();
                }

                ctx.fillStyle = '#fff';
                ctx.font = isHovered ? 'bold 13px system-ui' : 'bold 11px system-ui';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.fillText(comp.name.split(' ')[0], pos.x, pos.y);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [visibleProcesses]);

    return (
        <canvas
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            ref={canvasRef}
        />
    );
}
