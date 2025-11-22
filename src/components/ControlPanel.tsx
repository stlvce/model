import {
    Filter,
    Wind,
    Droplet,
    Layers,
    Zap,
    Archive,
    Volume2,
    VolumeX,
} from 'lucide-react'

interface ControlPanelProps {
    visibleProcesses: Set<string>
    onToggleProcess: (processType: string) => void
    soundEnabled: boolean
    onToggleSound: () => void
}

export default function ControlPanel({
    visibleProcesses,
    onToggleProcess,
    soundEnabled,
    onToggleSound,
}: ControlPanelProps) {
    const processes = [
        { id: 'inlet', name: 'Входной поток', icon: Droplet },
        { id: 'prefilter', name: 'Предфильтрация', icon: Filter },
        { id: 'pump', name: 'Насос', icon: Zap },
        { id: 'aeration', name: 'Аэрация', icon: Wind },
        { id: 'sedimentation', name: 'Осаждение', icon: Layers },
        { id: 'carbon', name: 'Угольная фильтрация', icon: Archive },
        { id: 'disinfection', name: 'Дезинфекция', icon: Zap },
        { id: 'storage', name: 'Резервуар', icon: Archive },
        { id: 'outlet', name: 'Выходной поток', icon: Droplet },
    ]

    return (
        <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800">Процессы</h3>
                <button
                    onClick={onToggleSound}
                    className={`p-3 rounded-lg transition-all ${
                        soundEnabled
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                >
                    {soundEnabled ? (
                        <Volume2 size={20} />
                    ) : (
                        <VolumeX size={20} />
                    )}
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
                {processes.map((process) => {
                    const Icon = process.icon
                    const isVisible = visibleProcesses.has(process.id)

                    return (
                        <button
                            key={process.id}
                            onClick={() => onToggleProcess(process.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                                isVisible
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-semibold text-sm">
                                {process.name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
