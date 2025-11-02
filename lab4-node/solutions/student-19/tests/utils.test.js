import { 
  formatDuration,
  getServicePrice,
  getMastersByService,
  getAvailableMonths,
  getAvailableDays,
  getAvailableTimes,
  formatDateDisplay,
  isTimeAvailable,
  getDisplayPrice,
  mainCategories,
  hairSubcategories,
  services,
  masters,
  getPriceDescription
} from '../src/utils/index.js';

describe('Утилитные функции', () => {
  describe('formatDuration', () => {
    test('должен форматировать минуты правильно для часов и минут', () => {
      expect(formatDuration(90)).toBe('1ч 30мин');
    });

    test('должен форматировать только часы когда минуты равны нулю', () => {
      expect(formatDuration(60)).toBe('1ч');
    });

    test('должен форматировать только минуты когда меньше часа', () => {
      expect(formatDuration(45)).toBe('45мин');
    });

    test('должен обрабатывать нулевые минуты', () => {
      expect(formatDuration(0)).toBe('0мин');
    });

    test('должен обрабатывать большие длительности', () => {
      expect(formatDuration(185)).toBe('3ч 5мин');
    });
  });

  describe('getServicePrice', () => {
    const serviceWithBothPrices = { basePrice: 1000, topMasterPrice: 1500 };
    const serviceWithOnlyBase = { basePrice: 1000 };
    const serviceWithOnlyPrice = { price: 800 };

    test('должен возвращать цену топ-мастера для топ-мастера', () => {
      const topMaster = { isTopMaster: true };
      expect(getServicePrice(serviceWithBothPrices, topMaster)).toBe(1500);
    });

    test('должен возвращать базовую цену для обычного мастера', () => {
      const regularMaster = { isTopMaster: false };
      expect(getServicePrice(serviceWithBothPrices, regularMaster)).toBe(1000);
    });

    test('должен возвращать базовую цену когда нет цены топ-мастера', () => {
      const master = { isTopMaster: true };
      expect(getServicePrice(serviceWithOnlyBase, master)).toBe(1000);
    });

    test('должен возвращать свойство price когда нет basePrice', () => {
      const master = { isTopMaster: false };
      expect(getServicePrice(serviceWithOnlyPrice, master)).toBe(800);
    });
  });

  describe('getMastersByService', () => {
    test('должен возвращать мастеров для услуги маникюра', () => {
      const nailMasters = getMastersByService('nails');
      expect(Array.isArray(nailMasters)).toBe(true);
      expect(nailMasters.length).toBeGreaterThan(0);
      nailMasters.forEach(master => {
        expect(master.specialties).toContain('nails');
      });
    });

    test('должен возвращать мастеров для услуги волос', () => {
      const hairMasters = getMastersByService('hair');
      expect(Array.isArray(hairMasters)).toBe(true);
      hairMasters.forEach(master => {
        expect(master.specialties).toContain('hair');
      });
    });

    test('должен возвращать пустой массив для несуществующей услуги', () => {
      const result = getMastersByService('non-existent');
      expect(result).toEqual([]);
    });

    test('должен возвращать мастеров для услуги ресниц', () => {
      const eyelashMasters = getMastersByService('eyelashes');
      expect(eyelashMasters.length).toBeGreaterThan(0);
      eyelashMasters.forEach(master => {
        expect(master.specialties).toContain('eyelashes');
      });
    });
  });

  describe('getAvailableMonths', () => {
    test('должен возвращать ровно 2 месяца', () => {
      const months = getAvailableMonths();
      expect(months).toHaveLength(2);
    });

    test('должен возвращать месяцы с правильной структурой', () => {
      const months = getAvailableMonths();
      
      months.forEach(month => {
        expect(month).toHaveProperty('id');
        expect(month).toHaveProperty('name');
        expect(typeof month.id).toBe('string');
        expect(typeof month.name).toBe('string');
        
        const [year, monthNum] = month.id.split('-');
        expect(year).toMatch(/^\d{4}$/);
        expect(monthNum).toMatch(/^\d{1,2}$/);
      });
    });

    test('должен включать текущий месяц', () => {
      const months = getAvailableMonths();
      const currentDate = new Date();
      const currentMonthId = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
      
      const monthIds = months.map(m => m.id);
      expect(monthIds).toContain(currentMonthId);
    });
  });

  describe('getAvailableDays', () => {
    test('должен возвращать доступные дни для текущего месяца', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const days = getAvailableDays(year, month);
      expect(Array.isArray(days)).toBe(true);
      
      if (days.length > 0) {
        days.forEach(day => {
          expect(day).toHaveProperty('id');
          expect(day).toHaveProperty('name');
          expect(day).toHaveProperty('date');
          expect(day.date instanceof Date).toBe(true);
        });
      }
    });

    test('должен возвращать доступные дни для будущего месяца', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 2;
      
      const days = getAvailableDays(year, month);
      expect(Array.isArray(days)).toBe(true);
    });

    test('должен пропускать выходные дни', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const days = getAvailableDays(year, month);
      
      days.forEach(day => {
        const dayOfWeek = day.date.getDay();
        expect(dayOfWeek).not.toBe(0); 
        expect(dayOfWeek).not.toBe(6); 
      });
    });
  });

  describe('getAvailableTimes', () => {
    test('должен возвращать доступное время без записей', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate() + 1;
      
      const times = getAvailableTimes(year, month, day, 1, 60, []);
      expect(Array.isArray(times)).toBe(true);
      expect(times.length).toBeGreaterThan(0);
      expect(times).toContain('10:00');
      expect(times).toContain('11:00');
    });

    test('должен фильтровать время на основе существующих записей', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate() + 1;
      
      const appointments = [{
        masterId: 1,
        date: new Date(year, month - 1, day, 14, 0).toISOString(),
        duration: 60
      }];
      
      const times = getAvailableTimes(year, month, day, 1, 60, appointments);
      expect(times).not.toContain('14:00');
      expect(times).toContain('10:00');
    });

    test('должен фильтровать прошедшее время для текущего дня', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      
      const originalDate = global.Date;
      global.Date = class extends Date {
        getHours() { return 13; }
        getMinutes() { return 0; }
      };
      
      const times = getAvailableTimes(year, month, day, 1, 60, []);
      
      expect(times).not.toContain('10:00');
      expect(times).not.toContain('11:00');
      expect(times).not.toContain('12:00');
      expect(times).toContain('14:00');
      
      global.Date = originalDate;
    });
  });

  describe('formatDateDisplay', () => {
    test('должен правильно форматировать дату', () => {
      const result = formatDateDisplay('2024-01-15');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('15'); 
    });

    test('должен форматировать разные даты', () => {
      const result1 = formatDateDisplay('2024-12-25');
      const result2 = formatDateDisplay('2024-06-01');
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1).not.toBe('');
      expect(result2).not.toBe('');
    });
  });

  describe('isTimeAvailable', () => {
    test('должен возвращать true для доступного времени', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate() + 1;
      
      const available = isTimeAvailable(year, month, day, '10:00', 1, 60, []);
      expect(available).toBe(true);
    });

    test('должен возвращать false для конфликтующей записи в начале времени', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate() + 1;
      
      const appointments = [{
        masterId: 1,
        date: new Date(year, month - 1, day, 10, 0).toISOString(),
        duration: 90
      }];
      
      const available = isTimeAvailable(year, month, day, '10:00', 1, 60, appointments);
      expect(available).toBe(false);
    });

    test('должен возвращать false для конфликтующей записи во время услуги', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate() + 1;
      
      const appointments = [{
        masterId: 1,
        date: new Date(year, month - 1, day, 10, 0).toISOString(),
        duration: 60
      }];
      
      const available = isTimeAvailable(year, month, day, '10:30', 1, 60, appointments);
      expect(available).toBe(false);
    });

    test('должен возвращать true для непересекающихся записей', () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate() + 1;
      
      const appointments = [{
        masterId: 1,
        date: new Date(year, month - 1, day, 14, 0).toISOString(),
        duration: 60
      }];
      
      const available = isTimeAvailable(year, month, day, '10:00', 1, 60, appointments);
      expect(available).toBe(true);
    });
  });

  describe('getDisplayPrice', () => {
    test('должен возвращать диапазон цен для услуг с обеими ценами', () => {
      const service = { basePrice: 1000, topMasterPrice: 1500 };
      const result = getDisplayPrice(service);
      expect(result).toBe('1000 - 1500₽');
    });

    test('должен возвращать единую цену для услуг только с базовой ценой', () => {
      const service = { basePrice: 1000 };
      const result = getDisplayPrice(service);
      expect(result).toBe('1000₽');
    });

    test('должен возвращать единую цену для услуг только со свойством price', () => {
      const service = { price: 800 };
      const result = getDisplayPrice(service);
      expect(result).toBe('800₽');
    });
  });

  describe('getPriceDescription', () => {
    test('должен возвращать описание с указанием топ-мастера', () => {
      const service = { basePrice: 1000, topMasterPrice: 1500 };
      const topMaster = { isTopMaster: true, name: 'Мария ★' };
      
      const result = getPriceDescription(service, topMaster);
      expect(result).toContain('1500');
      expect(result).toContain('Топ-мастер');
    });

    test('должен возвращать описание для обычного мастера', () => {
      const service = { basePrice: 1000, topMasterPrice: 1500 };
      const regularMaster = { isTopMaster: false, name: 'Анна' };
      
      const result = getPriceDescription(service, regularMaster);
      expect(result).toContain('1000');
      expect(result).toContain('Обычный мастер');
    });

    test('должен обрабатывать услуги без цены топ-мастера', () => {
      const service = { price: 800 };
      const master = { isTopMaster: true, name: 'Мария ★' };
      
      const result = getPriceDescription(service, master);
      expect(result).toBe('800₽');
    });
  });

  describe('Структуры данных', () => {
    describe('mainCategories', () => {
      test('должен иметь правильную структуру и категории', () => {
        expect(Array.isArray(mainCategories)).toBe(true);
        expect(mainCategories.length).toBe(6);
        
        const expectedCategories = ['nails', 'pedicure', 'hair', 'eyelashes', 'eyebrows', 'depilation'];
        mainCategories.forEach((category, index) => {
          expect(category).toHaveProperty('id');
          expect(category).toHaveProperty('name');
          expect(category.id).toBe(expectedCategories[index]);
          expect(category.name.length).toBeGreaterThan(0);
        });
      });
    });

    describe('hairSubcategories', () => {
      test('должен иметь правильную структуру', () => {
        expect(Array.isArray(hairSubcategories)).toBe(true);
        expect(hairSubcategories.length).toBe(5);
        
        hairSubcategories.forEach(subcat => {
          expect(subcat).toHaveProperty('id');
          expect(subcat).toHaveProperty('name');
          expect(typeof subcat.id).toBe('string');
          expect(typeof subcat.name).toBe('string');
        });
      });
    });

    describe('services', () => {
      test('должен иметь услуги для всех основных категорий', () => {
        const categoryKeys = Object.keys(services);
        expect(categoryKeys.length).toBeGreaterThan(0);
        
        categoryKeys.forEach(category => {
          const categoryServices = services[category];
          expect(Array.isArray(categoryServices)).toBe(true);
          expect(categoryServices.length).toBeGreaterThan(0);
          
          categoryServices.forEach(service => {
            expect(service).toHaveProperty('id');
            expect(service).toHaveProperty('name');
            expect(service).toHaveProperty('description');
            expect(service).toHaveProperty('duration');
            expect(service).toHaveProperty('category');
            
            expect(service.basePrice !== undefined || service.price !== undefined).toBe(true);
          });
        });
      });

      test('должен иметь услуги с согласованной структурой', () => {
        Object.values(services).forEach(categoryServices => {
          categoryServices.forEach(service => {
            expect(typeof service.id).toBe('string');
            expect(typeof service.duration).toBe('number');
            expect(service.duration).toBeGreaterThan(0);
          });
        });
      });
    });

    describe('masters', () => {
      test('должен иметь правильную структуру', () => {
        expect(Array.isArray(masters)).toBe(true);
        expect(masters.length).toBeGreaterThan(0);
        
        masters.forEach(master => {
          expect(master).toHaveProperty('id');
          expect(master).toHaveProperty('name');
          expect(master).toHaveProperty('specialties');
          expect(master).toHaveProperty('isTopMaster');
          expect(master).toHaveProperty('rating');
          
          expect(typeof master.id).toBe('number');
          expect(typeof master.name).toBe('string');
          expect(Array.isArray(master.specialties)).toBe(true);
          expect(typeof master.isTopMaster).toBe('boolean');
          expect(typeof master.rating).toBe('number');
          expect(master.rating).toBeGreaterThanOrEqual(0);
          expect(master.rating).toBeLessThanOrEqual(5);
        });
      });

      test('должен иметь мастеров с валидными специализациями', () => {
        const validSpecializations = ['nails', 'pedicure', 'hair', 'eyelashes', 'eyebrows', 'depilation'];
        
        masters.forEach(master => {
          master.specialties.forEach(spec => {
            expect(validSpecializations).toContain(spec);
          });
        });
      });

      test('должен иметь уникальные ID мастеров', () => {
        const masterIds = masters.map(m => m.id);
        const uniqueIds = new Set(masterIds);
        expect(uniqueIds.size).toBe(masterIds.length);
      });
    });
  });
});