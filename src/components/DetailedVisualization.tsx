import { useEffect, useRef, useState } from 'react'
import { X, Play, Pause } from 'lucide-react'

interface DetailedVisualizationProps {
    componentId: string
    onClose: () => void
}

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    type: 'dirty' | 'water' | 'clean' | 'sediment' | 'bubble' | 'uv'
    size: number
    stuck?: boolean
    stuckX?: number
    stuckY?: number
}

export default function DetailedVisualization({
    componentId,
    onClose,
}: DetailedVisualizationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isPaused, setIsPaused] = useState(false)
    const animationRef = useRef<number>()
    const particlesRef = useRef<Particle[]>([])

    const getVisualizationData = (id: string) => {
        const visualizations: Record<string, any> = {
            prefilter: {
                title: 'Предварительная фильтрация',
                description:
                    'Механическое удаление крупных частиц размером более 50 микрон',
                info: 'Сетчатый фильтр задерживает песок, ил, ржавчину и другие взвешенные вещества',
            },
            aeration: {
                title: 'Аэрация воды',
                description: 'Насыщение воды кислородом для окисления примесей',
                info: 'Воздух подается под давлением, образуя множество мелких пузырьков',
            },
            sedimentation: {
                title: 'Отстойник',
                description: 'Гравитационное осаждение тяжелых частиц',
                info: 'Скорость потока замедляется, частицы оседают на дно',
            },
            carbon: {
                title: 'Угольная фильтрация',
                description:
                    'Адсорбция органических загрязнителей активированным углем',
                info: 'Пористая структура угля удерживает молекулы загрязнителей',
            },
            disinfection: {
                title: 'УФ-дезинфекция',
                description: 'Обеззараживание ультрафиолетовым излучением',
                info: 'УФ-лучи уничтожают ДНК бактерий и вирусов',
            },
        }

        return visualizations[id] || visualizations.carbon
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = 800
            canvas.height = 600
        }

        resizeCanvas()

        const initParticles = () => {
            particlesRef.current = []
            for (let i = 0; i < 80; i++) {
                particlesRef.current.push({
                    x: Math.random() * 200,
                    y: Math.random() * 600,
                    vx: 1 + Math.random() * 2,
                    vy: (Math.random() - 0.5) * 0.5,
                    type: Math.random() > 0.3 ? 'dirty' : 'water',
                    size: 3 + Math.random() * 4,
                })
            }
        }

        initParticles()

        const drawPrefilter = () => {
            ctx.fillStyle = '#e0f2fe'
            ctx.fillRect(0, 0, 800, 600)

            ctx.fillStyle = '#94a3b8'
            for (let i = 0; i < 20; i++) {
                const x = 400
                const y = i * 30 + 15
                ctx.fillRect(x - 5, y, 10, 20)
            }

            ctx.strokeStyle = '#64748b'
            ctx.lineWidth = 2
            for (let i = 0; i < 30; i++) {
                ctx.beginPath()
                ctx.moveTo(400, i * 20)
                ctx.lineTo(400, i * 20 + 10)
                ctx.stroke()
            }

            particlesRef.current.forEach((particle) => {
                if (!isPaused) {
                    particle.x += particle.vx
                    particle.y += particle.vy

                    if (
                        particle.x > 390 &&
                        particle.x < 410 &&
                        particle.type === 'dirty'
                    ) {
                        if (Math.random() > 0.3) {
                            particle.stuck = true
                            particle.stuckX = 400 + (Math.random() - 0.5) * 20
                            particle.stuckY = particle.y
                        }
                    }

                    if (particle.x > 800) {
                        particle.x = 0
                        particle.y = Math.random() * 600
                        particle.type = Math.random() > 0.3 ? 'dirty' : 'water'
                        particle.stuck = false
                    }
                }

                if (particle.stuck) {
                    ctx.fillStyle = 'rgba(120, 80, 40, 0.8)'
                    ctx.beginPath()
                    ctx.arc(
                        particle.stuckX!,
                        particle.stuckY!,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                } else {
                    if (particle.type === 'dirty') {
                        ctx.fillStyle =
                            particle.x < 400
                                ? 'rgba(180, 80, 60, 0.8)'
                                : 'rgba(180, 80, 60, 0.3)'
                    } else {
                        ctx.fillStyle =
                            particle.x < 400
                                ? 'rgba(100, 180, 255, 0.6)'
                                : 'rgba(100, 200, 255, 0.8)'
                    }

                    ctx.beginPath()
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                }
            })

            ctx.fillStyle = '#1e293b'
            ctx.font = 'bold 16px system-ui'
            ctx.fillText('Загрязненная вода', 80, 30)
            ctx.fillText('Очищенная вода', 580, 30)
        }

        const drawAeration = () => {
            ctx.fillStyle = '#e0f2fe'
            ctx.fillRect(0, 0, 800, 600)

            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
            ctx.fillRect(50, 200, 700, 350)

            ctx.fillStyle = '#1e40af'
            for (let i = 0; i < 10; i++) {
                const x = 150 + i * 60
                ctx.fillRect(x - 3, 550, 6, 50)
            }

            particlesRef.current.forEach((particle) => {
                if (!isPaused) {
                    if (particle.type === 'bubble') {
                        particle.y -= 2
                        particle.x += Math.sin(particle.y * 0.05) * 0.5
                        if (particle.y < 200) {
                            particle.y = 550
                            particle.x =
                                150 + Math.floor(Math.random() * 10) * 60
                        }
                    } else {
                        particle.x += particle.vx * 0.5
                        particle.y += particle.vy
                        if (particle.x > 800) {
                            particle.x = 50
                            particle.y = 200 + Math.random() * 350
                        }
                    }
                }

                if (particle.type === 'bubble') {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
                    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                    ctx.stroke()
                } else {
                    ctx.fillStyle = 'rgba(100, 180, 255, 0.7)'
                    ctx.beginPath()
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                }
            })
        }

        const drawSedimentation = () => {
            ctx.fillStyle = '#e0f2fe'
            ctx.fillRect(0, 0, 800, 600)

            ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'
            ctx.fillRect(100, 150, 600, 400)

            ctx.fillStyle = 'rgba(120, 80, 40, 0.6)'
            ctx.fillRect(100, 500, 600, 50)

            particlesRef.current.forEach((particle) => {
                if (!isPaused) {
                    if (particle.type === 'sediment' || particle.stuck) {
                        if (!particle.stuck) {
                            particle.vy += 0.05
                            particle.y += particle.vy
                            if (particle.y >= 490) {
                                particle.stuck = true
                                particle.stuckY = 490 + Math.random() * 50
                                particle.stuckX = particle.x
                            }
                        }
                    } else {
                        particle.x += particle.vx * 0.3
                        particle.y += particle.vy * 0.2

                        if (
                            particle.type === 'dirty' &&
                            particle.y > 300 &&
                            Math.random() > 0.98
                        ) {
                            particle.type = 'sediment'
                            particle.vy = 0.5
                        }

                        if (particle.x > 700) {
                            particle.x = 100
                            particle.y = 150 + Math.random() * 100
                            particle.type =
                                Math.random() > 0.5 ? 'dirty' : 'water'
                            particle.stuck = false
                        }
                    }
                }

                if (particle.stuck) {
                    ctx.fillStyle = 'rgba(100, 70, 40, 0.9)'
                    ctx.beginPath()
                    ctx.arc(
                        particle.stuckX!,
                        particle.stuckY!,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                } else if (particle.type === 'sediment') {
                    ctx.fillStyle = 'rgba(140, 90, 50, 0.8)'
                    ctx.beginPath()
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                } else if (particle.type === 'dirty') {
                    ctx.fillStyle = 'rgba(180, 100, 70, 0.7)'
                    ctx.beginPath()
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                } else {
                    ctx.fillStyle =
                        particle.y < 300
                            ? 'rgba(100, 160, 220, 0.6)'
                            : 'rgba(100, 200, 255, 0.8)'
                    ctx.beginPath()
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                }
            })
        }

        const drawCarbon = () => {
            ctx.fillStyle = '#e0f2fe'
            ctx.fillRect(0, 0, 800, 600)

            ctx.fillStyle = '#334155'
            ctx.fillRect(350, 0, 100, 600)

            for (let i = 0; i < 300; i++) {
                const x = 350 + Math.random() * 100
                const y = 0 + Math.random() * 600
                const size = 2 + Math.random() * 3
                ctx.fillStyle = `rgba(30, 30, 30, ${0.6 + Math.random() * 0.4})`
                ctx.beginPath()
                ctx.arc(x, y, size, 0, Math.PI * 2)
                ctx.fill()
            }

            particlesRef.current.forEach((particle) => {
                if (!isPaused) {
                    particle.x += particle.vx
                    particle.y += particle.vy

                    if (particle.x > 350 && particle.x < 450) {
                        if (particle.type === 'dirty' && Math.random() > 0.7) {
                            particle.stuck = true
                            particle.stuckX = 350 + Math.random() * 100
                            particle.stuckY = particle.y
                            particle.type = 'sediment'
                        } else if (particle.type === 'water') {
                            particle.type = 'clean'
                        }
                    }

                    if (particle.x > 800) {
                        particle.x = 0
                        particle.y = Math.random() * 600
                        particle.type = Math.random() > 0.3 ? 'dirty' : 'water'
                        particle.stuck = false
                    }
                }

                if (particle.stuck) {
                    ctx.fillStyle = 'rgba(100, 70, 40, 0.8)'
                    ctx.beginPath()
                    ctx.arc(
                        particle.stuckX!,
                        particle.stuckY!,
                        particle.size * 0.7,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                } else {
                    if (particle.type === 'dirty') {
                        ctx.fillStyle = 'rgba(180, 80, 60, 0.8)'
                    } else if (particle.type === 'clean') {
                        ctx.fillStyle = 'rgba(100, 200, 255, 0.9)'
                    } else {
                        ctx.fillStyle = 'rgba(100, 180, 240, 0.7)'
                    }

                    ctx.beginPath()
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                }
            })

            ctx.fillStyle = '#1e293b'
            ctx.font = 'bold 16px system-ui'
            ctx.fillText('До фильтра', 120, 30)
            ctx.fillText('Активированный уголь', 340, 80)
            ctx.fillText('После фильтра', 570, 30)
        }

        const drawDisinfection = () => {
            ctx.fillStyle = '#e0f2fe'
            ctx.fillRect(0, 0, 800, 600)

            const gradient = ctx.createLinearGradient(350, 100, 450, 500)
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)')
            gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.3)')
            gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)')
            ctx.fillStyle = gradient
            ctx.fillRect(350, 100, 100, 400)

            ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(400, 100)
            ctx.lineTo(400, 500)
            ctx.stroke()

            for (let i = 0; i < 8; i++) {
                ctx.strokeStyle = `rgba(167, 139, 250, ${0.3 + Math.random() * 0.3})`
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.arc(400, 300, 30 + i * 15, 0, Math.PI * 2)
                ctx.stroke()
            }

            particlesRef.current.forEach((particle) => {
                if (!isPaused) {
                    particle.x += particle.vx
                    particle.y += particle.vy

                    if (particle.x > 350 && particle.x < 450) {
                        particle.type = 'uv'
                    }

                    if (particle.x > 800) {
                        particle.x = 0
                        particle.y = Math.random() * 600
                        particle.type = 'water'
                    }
                }

                if (particle.type === 'uv' || particle.x > 450) {
                    ctx.fillStyle = 'rgba(100, 220, 255, 0.9)'
                    ctx.shadowColor = 'rgba(100, 220, 255, 0.5)'
                    ctx.shadowBlur = 5
                } else {
                    ctx.fillStyle = 'rgba(100, 180, 240, 0.7)'
                    ctx.shadowBlur = 0
                }

                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fill()
                ctx.shadowBlur = 0
            })
        }

        const animate = () => {
            ctx.clearRect(0, 0, 800, 600)

            switch (componentId) {
                case 'prefilter':
                    drawPrefilter()
                    break
                case 'aeration':
                    if (particlesRef.current.length < 100) {
                        for (let i = 0; i < 50; i++) {
                            particlesRef.current.push({
                                x: 150 + Math.floor(Math.random() * 10) * 60,
                                y: 550,
                                vx: 0,
                                vy: 0,
                                type: 'bubble',
                                size: 4 + Math.random() * 6,
                            })
                        }
                    }
                    drawAeration()
                    break
                case 'sedimentation':
                    drawSedimentation()
                    break
                case 'carbon':
                    drawCarbon()
                    break
                case 'disinfection':
                    drawDisinfection()
                    break
                default:
                    drawCarbon()
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [componentId, isPaused])

    const data = getVisualizationData(componentId)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-3xl font-bold mb-2">{data.title}</h2>
                    <p className="text-blue-100">{data.description}</p>
                </div>

                <div className="p-6">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700">{data.info}</p>
                    </div>

                    <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                        <canvas
                            ref={canvasRef}
                            className="w-full"
                            style={{ maxHeight: '600px' }}
                        />
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="absolute bottom-4 right-4 bg-white text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                            {isPaused ? (
                                <Play size={24} />
                            ) : (
                                <Pause size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
