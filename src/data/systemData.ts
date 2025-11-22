import { ComponentData, Connection } from '../types';

export const components: ComponentData[] = [
  {
    id: 'inlet',
    name: 'Входной поток',
    description: 'Точка входа сырой воды в систему очистки. Вода поступает из природного источника и содержит различные загрязнения.',
    position: { x: -8, y: 0, z: 0 },
    pressure: 2.5,
    flowRate: 15.2,
    status: 'normal',
    type: 'inlet'
  },
  {
    id: 'prefilter',
    name: 'Предварительная фильтрация',
    description: 'Механическая очистка воды от крупных частиц, песка, ила и взвешенных веществ размером более 50 микрон.',
    position: { x: -6, y: 0, z: 0 },
    pressure: 2.3,
    flowRate: 15.0,
    status: 'normal',
    type: 'prefilter'
  },
  {
    id: 'pump1',
    name: 'Насос подачи',
    description: 'Центробежный насос обеспечивает необходимое давление для прохождения воды через систему фильтрации.',
    position: { x: -4, y: 0, z: 0 },
    pressure: 3.5,
    flowRate: 15.0,
    status: 'normal',
    type: 'pump'
  },
  {
    id: 'aeration',
    name: 'Аэрация',
    description: 'Насыщение воды кислородом для окисления железа, марганца и удаления летучих органических соединений.',
    position: { x: -2, y: 0, z: 0 },
    pressure: 3.2,
    flowRate: 14.8,
    status: 'normal',
    type: 'aeration'
  },
  {
    id: 'sedimentation',
    name: 'Осаждение',
    description: 'Гравитационное отстаивание позволяет тяжелым частицам и флокулам осесть на дно резервуара.',
    position: { x: 0, y: 0, z: 0 },
    pressure: 2.8,
    flowRate: 14.5,
    status: 'normal',
    type: 'sedimentation'
  },
  {
    id: 'carbon',
    name: 'Угольная фильтрация',
    description: 'Активированный уголь адсорбирует органические загрязнители, хлор, пестициды и улучшает вкус воды.',
    position: { x: 2, y: 0, z: 0 },
    pressure: 2.5,
    flowRate: 14.2,
    status: 'normal',
    type: 'carbon'
  },
  {
    id: 'disinfection',
    name: 'Дезинфекция',
    description: 'УФ-облучение уничтожает бактерии, вирусы и другие микроорганизмы без использования химических реагентов.',
    position: { x: 4, y: 0, z: 0 },
    pressure: 2.4,
    flowRate: 14.0,
    status: 'normal',
    type: 'disinfection'
  },
  {
    id: 'storage',
    name: 'Накопительный резервуар',
    description: 'Резервуар для хранения очищенной воды, обеспечивает стабильное водоснабжение и запас на случай пиковых нагрузок.',
    position: { x: 6, y: 0, z: 0 },
    pressure: 2.2,
    flowRate: 14.0,
    status: 'normal',
    type: 'storage'
  },
  {
    id: 'outlet',
    name: 'Выходной поток',
    description: 'Точка выхода очищенной питьевой воды. Вода соответствует всем санитарным нормам и готова к использованию.',
    position: { x: 8, y: 0, z: 0 },
    pressure: 2.0,
    flowRate: 14.0,
    status: 'normal',
    type: 'outlet'
  }
];

export const connections: Connection[] = [
  {
    from: 'inlet',
    to: 'prefilter',
    points: [
      { x: -8, y: 0, z: 0 },
      { x: -6, y: 0, z: 0 }
    ]
  },
  {
    from: 'prefilter',
    to: 'pump1',
    points: [
      { x: -6, y: 0, z: 0 },
      { x: -4, y: 0, z: 0 }
    ]
  },
  {
    from: 'pump1',
    to: 'aeration',
    points: [
      { x: -4, y: 0, z: 0 },
      { x: -2, y: 0, z: 0 }
    ]
  },
  {
    from: 'aeration',
    to: 'sedimentation',
    points: [
      { x: -2, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 }
    ]
  },
  {
    from: 'sedimentation',
    to: 'carbon',
    points: [
      { x: 0, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 }
    ]
  },
  {
    from: 'carbon',
    to: 'disinfection',
    points: [
      { x: 2, y: 0, z: 0 },
      { x: 4, y: 0, z: 0 }
    ]
  },
  {
    from: 'disinfection',
    to: 'storage',
    points: [
      { x: 4, y: 0, z: 0 },
      { x: 6, y: 0, z: 0 }
    ]
  },
  {
    from: 'storage',
    to: 'outlet',
    points: [
      { x: 6, y: 0, z: 0 },
      { x: 8, y: 0, z: 0 }
    ]
  }
];
