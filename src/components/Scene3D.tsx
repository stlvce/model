import { useEffect, useRef, useState } from 'react'
import { ComponentData } from '../types'
import { components, connections } from '../data/systemData'

interface Scene3DProps {
    onComponentClick: (component: ComponentData) => void
    visibleProcesses: Set<string>
}

export default function Scene3D({
    onComponentClick,
    visibleProcesses,
}: Scene3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [hoveredComponent, setHoveredComponent] = useState<string | null>(
        null
    )
    const animationRef = useRef<number>()
    const particlesRef = useRef<any[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * window.devicePixelRatio
            canvas.height = rect.height * window.devicePixelRatio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const centerX = canvas.width / window.devicePixelRatio / 2
        const centerY = canvas.height / window.devicePixelRatio / 2
        const scale = 40

        const getScreenPos = (pos: { x: number; y: number; z: number }) => ({
            x: centerX + pos.x * scale,
            y: centerY - pos.y * scale,
        })

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
        }

        for (let i = 0; i < 80; i++) {
            particlesRef.current.push({
                progress: Math.random(),
                speed: 0.0015 + Math.random() * 0.002,
                offset: Math.random() * 25 - 12.5,
                size: 2 + Math.random() * 3,
                opacity: 0.4 + Math.random() * 0.6,
            })
        }

        const animate = () => {
            const rect = canvas.getBoundingClientRect()
            ctx.clearRect(0, 0, rect.width, rect.height)

            particlesRef.current.forEach((particle) => {
                particle.progress += particle.speed
                if (particle.progress > 1) particle.progress = 0
            })

            connections.forEach((conn) => {
                const fromComp = components.find((c) => c.id === conn.from)
                const toComp = components.find((c) => c.id === conn.to)

                if (!fromComp || !toComp) return
                if (
                    !visibleProcesses.has(fromComp.type) ||
                    !visibleProcesses.has(toComp.type)
                )
                    return

                const start = getScreenPos(fromComp.position)
                const end = getScreenPos(toComp.position)

                ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)'
                ctx.lineWidth = 5
                ctx.lineCap = 'round'
                ctx.lineJoin = 'round'
                ctx.beginPath()
                ctx.moveTo(start.x, start.y)
                ctx.lineTo(end.x, end.y)
                ctx.stroke()

                ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)'
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.moveTo(start.x, start.y)
                ctx.lineTo(end.x, end.y)
                ctx.stroke()

                particlesRef.current.forEach((particle) => {
                    const x = start.x + (end.x - start.x) * particle.progress
                    const y = start.y + (end.y - start.y) * particle.progress

                    const gradient = ctx.createRadialGradient(
                        x,
                        y,
                        0,
                        x,
                        y,
                        particle.size
                    )
                    gradient.addColorStop(
                        0,
                        `rgba(147, 197, 253, ${particle.opacity})`
                    )
                    gradient.addColorStop(1, `rgba(96, 165, 250, 0)`)

                    ctx.fillStyle = gradient
                    ctx.beginPath()
                    ctx.arc(x, y, particle.size, 0, Math.PI * 2)
                    ctx.fill()
                })
            })

            components.forEach((comp) => {
                if (!visibleProcesses.has(comp.type)) return

                const pos = getScreenPos(comp.position)
                const isHovered = hoveredComponent === comp.id
                const size = isHovered ? 38 : 32

                ctx.shadowColor = componentColors[comp.type]
                ctx.shadowBlur = isHovered ? 25 : 12
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 0

                ctx.fillStyle = componentColors[comp.type]
                ctx.beginPath()
                ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
                ctx.fill()

                ctx.shadowBlur = 0

                if (comp.status === 'warning') {
                    ctx.strokeStyle = '#fbbf24'
                    ctx.lineWidth = 4
                    ctx.beginPath()
                    ctx.arc(pos.x, pos.y, size + 6, 0, Math.PI * 2)
                    ctx.stroke()
                } else if (comp.status === 'error') {
                    ctx.strokeStyle = '#ef4444'
                    ctx.lineWidth = 4
                    ctx.beginPath()
                    ctx.arc(pos.x, pos.y, size + 6, 0, Math.PI * 2)
                    ctx.stroke()
                }

                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 13px system-ui'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                const label = comp.name.split(' ')[0]
                ctx.fillText(label, pos.x, pos.y)
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [hoveredComponent, visibleProcesses])

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const scale = 40

        let foundComponent: string | null = null

        for (const comp of components) {
            if (!visibleProcesses.has(comp.type)) continue

            const pos = {
                x: centerX + comp.position.x * scale,
                y: centerY - comp.position.y * scale,
            }

            const distance = Math.sqrt(
                Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
            )

            if (distance < 35) {
                foundComponent = comp.id
                break
            }
        }

        setHoveredComponent(foundComponent)
        canvas.style.cursor = foundComponent ? 'pointer' : 'default'
    }

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const scale = 40

        for (const comp of components) {
            if (!visibleProcesses.has(comp.type)) continue

            const pos = {
                x: centerX + comp.position.x * scale,
                y: centerY - comp.position.y * scale,
            }

            const distance = Math.sqrt(
                Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
            )

            if (distance < 35) {
                onComponentClick(comp)
                break
            }
        }
    }

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        />
    )
}
