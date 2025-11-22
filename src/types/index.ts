export interface ComponentData {
    id: string
    name: string
    description: string
    position: { x: number; y: number; z: number }
    pressure: number
    flowRate: number
    status: 'normal' | 'warning' | 'error'
    type:
        | 'prefilter'
        | 'aeration'
        | 'sedimentation'
        | 'carbon'
        | 'disinfection'
        | 'storage'
        | 'pump'
        | 'inlet'
        | 'outlet'
}

export interface Connection {
    from: string
    to: string
    points: { x: number; y: number; z: number }[]
}
