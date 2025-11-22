import { X, Activity, Droplets, AlertTriangle } from 'lucide-react';
import { ComponentData } from '../types';

interface ComponentInfoProps {
    component: ComponentData;
    onClose: () => void;
    onViewDetails: (componentId: string) => void;
}

export default function ComponentInfo({ component, onClose, onViewDetails }: ComponentInfoProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'normal':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'normal':
                return 'Норма';
            case 'warning':
                return 'Предупреждение';
            case 'error':
                return 'Авария';
            default:
                return 'Неизвестно';
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all z-60">
                <div className="bg-linear-to-r from-blue-600 to-cyan-500 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold mb-2">{component.name}</h2>
                    <p className="text-blue-100 text-sm">{component.description}</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <Activity size={18} />
                                <span className="text-sm font-medium">Давление</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                                {component.pressure} бар
                            </p>
                        </div>

                        <div className="bg-cyan-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-cyan-600 mb-1">
                                <Droplets size={18} />
                                <span className="text-sm font-medium">Расход</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                                {component.flowRate} л/с
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle size={18} className={getStatusColor(component.status)} />
                            <span className="text-sm font-medium text-gray-600">Состояние</span>
                        </div>
                        <p className={`text-xl font-bold ${getStatusColor(component.status)}`}>
                            {getStatusText(component.status)}
                        </p>
                    </div>

                    {['prefilter', 'aeration', 'sedimentation', 'carbon', 'disinfection'].includes(
                        component.type,
                    ) && (
                        <button
                            onClick={() => onViewDetails(component.id)}
                            className="w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            Подробная визуализация процесса
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
