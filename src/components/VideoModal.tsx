import { X, Play } from 'lucide-react'

interface VideoModalProps {
    componentId: string
    onClose: () => void
}

export default function VideoModal({ componentId, onClose }: VideoModalProps) {
    const videoData: Record<
        string,
        { title: string; description: string; embedUrl: string }
    > = {
        prefilter: {
            title: 'Предварительная фильтрация воды',
            description: 'Механическая очистка от крупных частиц и примесей',
            embedUrl: 'https://www.youtube.com/embed/oHfvPGRaSxA',
        },
        aeration: {
            title: 'Процесс аэрации воды',
            description: 'Насыщение воды кислородом для окисления примесей',
            embedUrl: 'https://www.youtube.com/embed/FmvP9y3Hrjo',
        },
        sedimentation: {
            title: 'Отстаивание и осаждение',
            description: 'Гравитационное разделение твердых частиц и воды',
            embedUrl: 'https://www.youtube.com/embed/0m_makMyxsQ',
        },
        carbon: {
            title: 'Фильтрация активированным углем',
            description:
                'Адсорбция органических загрязнителей и улучшение качества воды',
            embedUrl: 'https://www.youtube.com/embed/R1gYL4F1vNY',
        },
        disinfection: {
            title: 'УФ-дезинфекция воды',
            description: 'Обеззараживание воды ультрафиолетовым излучением',
            embedUrl: 'https://www.youtube.com/embed/j2MpYP6QM_s',
        },
    }

    const data = videoData[componentId] || videoData.carbon

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-cyan-500 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-3">
                        <Play size={32} />
                        <div>
                            <h2 className="text-2xl font-bold">{data.title}</h2>
                            <p className="text-blue-100 text-sm mt-1">
                                {data.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video">
                        <iframe
                            className="w-full h-full"
                            src={data.embedUrl}
                            title={data.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Образовательная информация
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Это видео демонстрирует реальный процесс очистки
                            воды и помогает понять принципы работы системы.
                            Обратите внимание на ключевые этапы и их влияние на
                            качество воды.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
