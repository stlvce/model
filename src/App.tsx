import { useState, useEffect } from 'react'
import { Video } from 'lucide-react'
import Scene3D from './components/Scene3D'
import ComponentInfo from './components/ComponentInfo'
import DetailedVisualization from './components/DetailedVisualization'
import ControlPanel from './components/ControlPanel'
import VideoModal from './components/VideoModal'
import { ComponentData } from './types'
import { soundManager } from './utils/soundManager'

function App() {
    const [selectedComponent, setSelectedComponent] =
        useState<ComponentData | null>(null)
    const [detailedViewComponent, setDetailedViewComponent] = useState<
        string | null
    >(null)
    const [videoComponent, setVideoComponent] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'control' | 'video'>('control')
    const [visibleProcesses, setVisibleProcesses] = useState<Set<string>>(
        new Set([
            'inlet',
            'prefilter',
            'pump',
            'aeration',
            'sedimentation',
            'carbon',
            'disinfection',
            'storage',
            'outlet',
        ])
    )
    const [soundEnabled, setSoundEnabled] = useState(false)

    useEffect(() => {
        if (!soundEnabled) return

        soundManager.initialize()
        soundManager.playBackgroundAmbient()

        const interval = setInterval(() => {
            if (soundEnabled) {
                soundManager.playBackgroundAmbient()
            }
        }, 6000)

        return () => clearInterval(interval)
    }, [soundEnabled])

    const handleComponentClick = (component: ComponentData) => {
        setSelectedComponent(component)
        soundManager.playClickSound()
    }

    const handleViewDetails = (componentId: string) => {
        setDetailedViewComponent(componentId)
        setSelectedComponent(null)
        soundManager.playWaterFlow()
    }

    const handleToggleProcess = (processType: string) => {
        setVisibleProcesses((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(processType)) {
                newSet.delete(processType)
            } else {
                newSet.add(processType)
            }
            return newSet
        })
        soundManager.playClickSound()
    }

    const handleToggleSound = () => {
        const newState = !soundEnabled
        setSoundEnabled(newState)
        soundManager.setEnabled(newState)
    }

    const handleOpenVideo = (componentId: string) => {
        setVideoComponent(componentId)
        setDetailedViewComponent(null)
        soundManager.playClickSound()
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-blue-100">
            <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
                <header className="mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 mb-2">
                            Цифровой двойник системы очистки воды
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Интерактивная визуализация процессов водоподготовки
                        </p>
                    </div>
                </header>

                <div className="flex-1 flex gap-6 min-h-0">
                    <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden relative">
                        <Scene3D
                            onComponentClick={handleComponentClick}
                            visibleProcesses={visibleProcesses}
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            {selectedComponent &&
                                [
                                    'prefilter',
                                    'aeration',
                                    'sedimentation',
                                    'carbon',
                                    'disinfection',
                                ].includes(selectedComponent.type) && (
                                    <button
                                        onClick={() =>
                                            handleOpenVideo(
                                                selectedComponent.id
                                            )
                                        }
                                        className="bg-white text-red-600 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        <Video size={20} />
                                        Видео
                                    </button>
                                )}
                        </div>
                    </div>

                    <div className="w-96 shrink-0 flex flex-col gap-4">
                        <div className="bg-white rounded-2xl shadow-xl p-4 shrink-0">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('control')}
                                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                                        activeTab === 'control'
                                            ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Управление
                                </button>
                                <button
                                    onClick={() => setActiveTab('video')}
                                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                                        activeTab === 'video'
                                            ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <Video size={18} />
                                    Видео
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col">
                            {activeTab === 'control' ? (
                                <ControlPanel
                                    visibleProcesses={visibleProcesses}
                                    onToggleProcess={handleToggleProcess}
                                    soundEnabled={soundEnabled}
                                    onToggleSound={handleToggleSound}
                                />
                            ) : (
                                <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 overflow-y-auto space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Образовательные видео
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            {
                                                id: 'prefilter',
                                                name: 'Предварительная фильтрация',
                                                icon: '🔍',
                                            },
                                            {
                                                id: 'aeration',
                                                name: 'Аэрация воды',
                                                icon: '💨',
                                            },
                                            {
                                                id: 'sedimentation',
                                                name: 'Отстаивание',
                                                icon: '⬇️',
                                            },
                                            {
                                                id: 'carbon',
                                                name: 'Угольная фильтрация',
                                                icon: '⚫',
                                            },
                                            {
                                                id: 'disinfection',
                                                name: 'УФ-дезинфекция',
                                                icon: '💡',
                                            },
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setVideoComponent(item.id)
                                                    soundManager.playClickSound()
                                                }}
                                                className="w-full text-left p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all border border-blue-100 hover:border-blue-300 group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">
                                                        {item.icon}
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Смотреть видео
                                                        </p>
                                                    </div>
                                                    <span className="text-blue-600 group-hover:scale-110 transition-transform">
                                                        →
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedComponent && (
                <ComponentInfo
                    component={selectedComponent}
                    onClose={() => setSelectedComponent(null)}
                    onViewDetails={handleViewDetails}
                />
            )}

            {detailedViewComponent && (
                <DetailedVisualization
                    componentId={detailedViewComponent}
                    onClose={() => setDetailedViewComponent(null)}
                />
            )}

            {videoComponent && (
                <VideoModal
                    componentId={videoComponent}
                    onClose={() => setVideoComponent(null)}
                />
            )}
        </div>
    )
}

export default App
