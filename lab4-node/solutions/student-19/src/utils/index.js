import { 
  calculateDuration, 
  calculateTotalPrice, 
  formatPrice, 
  generateBookingId 
} from './math.js';

export class BookingStateMachine {
  constructor() {
    this.states = new Map();
    this.userData = new Map(); 
  }

  setState(userId, state, data = {}) {
    this.states.set(userId, state);
    if (Object.keys(data).length > 0) {
      const currentData = this.userData.get(userId) || {};
      this.userData.set(userId, { ...currentData, ...data });
    }
  }

  getState(userId) {
    return this.states.get(userId) || 'idle';
  }

  getUserData(userId) {
    return this.userData.get(userId) || {};
  }

  resetState(userId) {
    this.states.delete(userId);
    this.userData.delete(userId);
  }

  updateData(userId, newData) {
    const currentData = this.userData.get(userId) || {};
    this.userData.set(userId, { ...currentData, ...newData });
  }
}

export const mainCategories = [
  { id: 'nails', name: '💅 Маникюр' },
  { id: 'pedicure', name: '🦶 Педикюр' },
  { id: 'hair', name: '💇‍♀️ Стрижка и окрашивание' },
  { id: 'eyelashes', name: '👁 Ресницы' },
  { id: 'eyebrows', name: '✏️ Брови' },
  { id: 'depilation', name: '✨ Депиляция' }
];

// Подкатегории для волос 
export const hairSubcategories = [
  { id: 'haircuts', name: '✂️ Стрижка' },
  { id: 'styling', name: '💁‍♀️ Укладка' },
  { id: 'coloring', name: '🎨 Окрашивание тон в тон' },
  { id: 'blond', name: '👱‍♀️ Тотал блонд' },
  { id: 'bleaching', name: '🌟 Окрашивание с обесцвечиванием' }
];

export const services = {
  'nails': [
    {
      id: 'nails_1',
      name: 'Маникюр и покрытие гель лак «Все включено»',
      description: 'Комплексный уход, обработка кутикулы, покрытие гель-лаком',
      basePrice: 2300,
      topMasterPrice: 2800,
      duration: 150,
      category: 'nails'
    },
    {
      id: 'nails_2',
      name: 'Маникюр без покрытия',
      description: 'Комплексный уход и обработка кутикулы без покрытия',
      basePrice: 1800,
      topMasterPrice: 2200,
      duration: 60,
      category: 'nails'
    },
    {
      id: 'nails_3',
      name: 'Японский маникюр P.Shine',
      description: 'Японская технология ухода с использованием профессиональных средств',
      basePrice: 2100,
      topMasterPrice: 2600,
      duration: 120,
      category: 'nails'
    },
    {
      id: 'nails_4',
      name: 'Наращивание ногтей',
      description: 'Наращивание ногтей гелем или акрилом',
      basePrice: 3300,
      topMasterPrice: 3800,
      duration: 180,
      category: 'nails'
    }
  ],

  'pedicure': [
    {
      id: 'pedicure_1',
      name: 'Полный педикюр с покрытием гель лак',
      description: 'Полный комплексный уход за стопами с покрытием',
      basePrice: 2800,
      topMasterPrice: 3300,
      duration: 120,
      category: 'pedicure'
    },
    {
      id: 'pedicure_2',
      name: 'Педикюр «Пальчики» с покрытием гель лак',
      description: 'Уход только за пальцами ног с покрытием',
      basePrice: 1800,
      topMasterPrice: 2200,
      duration: 60,
      category: 'pedicure'
    },
    {
      id: 'pedicure_3',
      name: 'Педикюр без покрытия ногтей',
      description: 'Комплексный уход без покрытия',
      basePrice: 2000,
      topMasterPrice: 2500,
      duration: 90,
      category: 'pedicure'
    },
    {
      id: 'pedicure_4',
      name: 'Японский педикюр',
      description: 'Японская технология ухода за стопами',
      basePrice: 2500,
      topMasterPrice: 3000,
      duration: 120,
      category: 'pedicure'
    },
    {
      id: 'pedicure_5',
      name: 'Пленочный педикюр',
      description: 'Без использования режущих инструментов',
      basePrice: 2200,
      topMasterPrice: 2700,
      duration: 90,
      category: 'pedicure'
    }
  ],

  'haircuts': [
    {
      id: 'haircut_women',
      name: 'Стрижка женская',
      description: 'Стрижка с укладкой и консультацией стилиста',
      basePrice: 1500,
      topMasterPrice: 2000,
      duration: 60,
      category: 'hair'
    },
    {
      id: 'haircut_men',
      name: 'Стрижка мужская',
      description: 'Мужская стрижка с укладкой',
      basePrice: 1200,
      topMasterPrice: 1600,
      duration: 45,
      category: 'hair'
    },
    {
      id: 'haircut_children',
      name: 'Стрижка детская',
      description: 'Стрижка для детей до 12 лет',
      basePrice: 800,
      topMasterPrice: 1200,
      duration: 45,
      category: 'hair'
    }
  ],

  'styling': [
    {
      id: 'styling_everyday',
      name: 'Повседневная укладка на браш',
      description: 'Ежедневная укладка с выпрямлением',
      basePrice: 800,
      topMasterPrice: 1200,
      duration: 45,
      category: 'hair'
    },
    {
      id: 'styling_evening',
      name: 'Вечерняя укладка локоны/волны',
      description: 'Создание вечерних локонов или волн',
      basePrice: 1200,
      topMasterPrice: 1700,
      duration: 60,
      category: 'hair'
    }
  ],

  'coloring': [
    {
      id: 'color_short',
      name: 'Окрашивание коротких волос',
      description: 'Окрашивание тон в тон для коротких волос',
      basePrice: 2200,
      topMasterPrice: 2700,
      duration: 120,
      category: 'hair'
    },
    {
      id: 'color_medium',
      name: 'Окрашивание средних волос',
      description: 'Окрашивание тон в тон для волос средней длины',
      basePrice: 2800,
      topMasterPrice: 3300,
      duration: 150,
      category: 'hair'
    }
  ],

  'blond': [
    {
      id: 'blond_short',
      name: 'Тотал блонд короткие волосы',
      description: 'Полное осветление коротких волос',
      basePrice: 4500,
      topMasterPrice: 5200,
      duration: 210,
      category: 'hair'
    },
    {
      id: 'blond_long',
      name: 'Тотал блонд длинные волосы',
      description: 'Полное осветление длинных волос',
      basePrice: 6800,
      topMasterPrice: 7500,
      duration: 270,
      category: 'hair'
    }
  ],

  'bleaching': [
    {
      id: 'bleach_short',
      name: 'Обесцвечивание коротких волос',
      description: 'Обесцвечивание с окрашиванием коротких волос',
      basePrice: 3800,
      topMasterPrice: 4500,
      duration: 180,
      category: 'hair'
    },
    {
      id: 'bleach_long',
      name: 'Обесцвечивание длинных волос',
      description: 'Обесцвечивание с окрашиванием длинных волос',
      basePrice: 5800,
      topMasterPrice: 6500,
      duration: 240,
      category: 'hair'
    }
  ],

  'eyelashes': [
    {
      id: 'eyelashes_1',
      name: 'Ламинирование ресниц',
      description: 'Выпрямление и ламинирование ресниц',
      basePrice: 1800,
      topMasterPrice: 2300,
      duration: 60,
      category: 'eyelashes'
    },
    {
      id: 'eyelashes_2',
      name: 'Наращивание Classic',
      description: 'Классическое наращивание по одной ресничке',
      basePrice: 2500,
      topMasterPrice: 3000,
      duration: 120,
      category: 'eyelashes'
    },
    {
      id: 'eyelashes_3',
      name: 'Наращивание объем 1,5D',
      description: 'Объемное наращивание 1.5D',
      basePrice: 2800,
      topMasterPrice: 3300,
      duration: 150,
      category: 'eyelashes'
    },
    {
      id: 'eyelashes_4',
      name: 'Наращивание объем 2D',
      description: 'Объемное наращивание 2D',
      basePrice: 3200,
      topMasterPrice: 3700,
      duration: 180,
      category: 'eyelashes'
    },
    {
      id: 'eyelashes_5',
      name: 'Наращивание объем 3D',
      description: 'Объемное наращивание 3D',
      basePrice: 3800,
      topMasterPrice: 4300,
      duration: 210,
      category: 'eyelashes'
    },
    {
      id: 'eyelashes_6',
      name: 'Наращивание объем 4D',
      description: 'Объемное наращивание 4D',
      basePrice: 4200,
      topMasterPrice: 4700,
      duration: 240,
      category: 'eyelashes'
    },
    {
      id: 'eyelashes_7',
      name: 'Наращивание «Уголки»',
      description: 'Наращивание только внешних уголков',
      basePrice: 1800,
      topMasterPrice: 2300,
      duration: 90,
      category: 'eyelashes'
    },
    {
      id: 'eyelashes_8',
      name: 'Снятие ресниц без последующего наращивания',
      description: 'Аккуратное снятие нарощенных ресниц',
      basePrice: 500,
      topMasterPrice: 700,
      duration: 30,
      category: 'eyelashes'
    }
  ],

  'eyebrows': [
    {
      id: 'eyebrows_1',
      name: 'Коррекция бровей',
      description: 'Коррекция формы бровей',
      basePrice: 600,
      topMasterPrice: 800,
      duration: 30,
      category: 'eyebrows'
    },
    {
      id: 'eyebrows_2',
      name: 'Окрашивание краской',
      description: 'Окрашивание бровей краской',
      basePrice: 700,
      topMasterPrice: 900,
      duration: 30,
      category: 'eyebrows'
    },
    {
      id: 'eyebrows_3',
      name: 'Долговременная укладка',
      description: 'Долговременная укладка и ламинирование бровей',
      basePrice: 1500,
      topMasterPrice: 1800,
      duration: 60,
      category: 'eyebrows'
    }
  ],

  'depilation': [
    {
      id: 'depilation_1',
      name: 'Комплекс 1 (подмышки, бикини, голень)',
      description: 'Подмышечные впадины, глубокое бикини, голень',
      basePrice: 3200,
      topMasterPrice: 3700,
      duration: 90,
      category: 'depilation'
    },
    {
      id: 'depilation_2',
      name: 'Комплекс 2 (подмышки, бикини, ноги полностью)',
      description: 'Подмышечные впадины, глубокое бикини, ноги полностью',
      basePrice: 4200,
      topMasterPrice: 4700,
      duration: 120,
      category: 'depilation'
    },
    {
      id: 'depilation_3',
      name: 'Комплекс 3 (подмышки, бикини, ноги, руки)',
      description: 'Подмышечные впадины, глубокое бикини, ноги полностью, руки полностью',
      basePrice: 5200,
      topMasterPrice: 5700,
      duration: 150,
      category: 'depilation'
    },
    {
      id: 'depilation_4',
      name: 'Комплекс 4 (лицо полностью)',
      description: 'Полная депиляция лица',
      basePrice: 1800,
      topMasterPrice: 2300,
      duration: 60,
      category: 'depilation'
    }
  ]
};

// Мастера маникюра/педикюра
export const masters = [
  { 
    id: 1, 
    name: 'Мария', 
    specialties: ['nails', 'pedicure'],
    isTopMaster: false,
    rating: 4.8
  },
  { 
    id: 2, 
    name: 'София ★', 
    specialties: ['nails', 'pedicure'],
    isTopMaster: true,
    rating: 5.0
  },

  // Стилисты по волосам
  { 
    id: 3, 
    name: 'Анна', 
    specialties: ['hair'],
    isTopMaster: false,
    rating: 4.7
  },
  { 
    id: 4, 
    name: 'Елена ★', 
    specialties: ['hair'],
    isTopMaster: true,
    rating: 4.9
  },
  // Мастера по ресницам/бровям
  { 
    id: 5, 
    name: 'Ольга', 
    specialties: ['eyelashes', 'eyebrows'],
    isTopMaster: false,
    rating: 4.8
  },
  { 
    id: 6, 
    name: 'Виктория ★', 
    specialties: ['eyelashes', 'eyebrows'],
    isTopMaster: true,
    rating: 4.9
  },
  // Мастера депиляции
  { 
    id: 7, 
    name: 'Ирина', 
    specialties: ['depilation'],
    isTopMaster: false,
    rating: 4.8
  },
  { 
    id: 8, 
    name: 'Наталья ★', 
    specialties: ['depilation'],
    isTopMaster: true,
    rating: 4.9
  }
];

export function getServicePrice(service, master) {
  if (service.topMasterPrice && master.isTopMaster) {
    return service.topMasterPrice;
  } else if (service.basePrice) {
    return service.basePrice;
  } else {
    return service.price;
  }
}

export function getDisplayPrice(service) {
  if (service.topMasterPrice && service.basePrice) {
    return `${service.basePrice} - ${service.topMasterPrice}₽`;
  } else if (service.basePrice) {
    return `${service.basePrice}₽`;
  } else {
    return `${service.price}₽`;
  }
}

export function getPriceDescription(service, master) {
  const price = getServicePrice(service, master);
  if (service.topMasterPrice && master.isTopMaster) {
    return `${price}₽ (Топ-мастер)`;
  } else if (service.topMasterPrice) {
    return `${price}₽ (Обычный мастер)`;
  } else {
    return `${price}₽`;
  }
}

export function validatePhone(phone) {
  const phoneRegex = /^[+]?[78][-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
  return phoneRegex.test(phone);
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getAvailableTimeSlots() {
  return ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
}

export function getMastersByService(serviceCategory) {
  return masters.filter(master => 
    master.specialties.includes(serviceCategory)
  );
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}ч ${mins}мин`;
  } else if (hours > 0) {
    return `${hours}ч`;
  } else {
    return `${mins}мин`;
  }
}

export { 
  calculateDuration, 
  calculateTotalPrice, 
  formatPrice, 
  generateBookingId 
};

export function getAvailableMonths() {
  const currentDate = new Date();
  const months = [];
  
  for (let i = 0; i < 2; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    months.push({
      id: `${date.getFullYear()}-${date.getMonth() + 1}`,
      name: date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    });
  }
  
  return months;
}

export function getAvailableDays(year, month) {
  const currentDate = new Date();
  const days = [];
  
  const startDay = (year === currentDate.getFullYear() && month === currentDate.getMonth() + 1) 
    ? currentDate.getDate() 
    : 1;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = startDay; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      days.push({
        id: `${year}-${month}-${day}`,
        name: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' }),
        date: date
      });
    }
  }
  
  return days;
}

export function getAvailableTimes(year, month, day, masterId, serviceDuration, existingAppointments) {
  const workHours = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  
  const selectedDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  
  let availableTimes = workHours;
  if (selectedDate.toDateString() === currentDate.toDateString()) {
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    
    availableTimes = workHours.filter(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours > currentHour || (hours === currentHour && minutes > currentMinute);
    });
  }
  
  // Фильтруем занятое время у мастера
  if (existingAppointments && existingAppointments.length > 0) {
    const masterAppointments = existingAppointments.filter(app => 
      app.masterId === masterId && 
      app.date.startsWith(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)
    );
    
    availableTimes = availableTimes.filter(time => {
      const appointmentStart = new Date(year, month - 1, day, ...time.split(':').map(Number));
      
      // Проверка пересечений с существующими записями
      for (const appointment of masterAppointments) {
        const existingStart = new Date(appointment.date);
        const existingEnd = new Date(existingStart.getTime() + appointment.duration * 60000);
        
        const proposedEnd = new Date(appointmentStart.getTime() + serviceDuration * 60000);
        
        // Проверка пересечений временных интервалов
        if (appointmentStart < existingEnd && proposedEnd > existingStart) {
          return false; 
        }
      }
      
      return true;
    });
  }
  
  return availableTimes;
}

export function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
}

export function isTimeAvailable(year, month, day, time, masterId, serviceDuration, appointments) {
  const proposedStart = new Date(year, month - 1, day, ...time.split(':').map(Number));
  const proposedEnd = new Date(proposedStart.getTime() + serviceDuration * 60000);
  
  const masterAppointments = appointments.filter(app => 
    app.masterId === masterId && 
    app.date.startsWith(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)
  );
  
  for (const appointment of masterAppointments) {
    const existingStart = new Date(appointment.date);
    const existingEnd = new Date(existingStart.getTime() + appointment.duration * 60000);
    
    if (proposedStart < existingEnd && proposedEnd > existingStart) {
      return false;
    }
  }
  
  return true;
}