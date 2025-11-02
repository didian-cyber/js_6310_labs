import { 
  calculateDuration, 
  calculateTotalPrice, 
  formatPrice, 
  generateBookingId 
} from '../src/utils/math.js';

describe('Math Utilities', () => {
  describe('calculateDuration', () => {
    test('should calculate total duration with additional services', () => {
      const baseDuration = 60;
      const additionalServices = [
        { duration: 30 },
        { duration: 15 }
      ];
      
      const result = calculateDuration(baseDuration, additionalServices);
      expect(result).toBe(105);
    });

    test('should return base duration when no additional services', () => {
      const result = calculateDuration(45, []);
      expect(result).toBe(45);
    });

    test('should handle undefined additional services', () => {
      const result = calculateDuration(30, undefined);
      expect(result).toBe(30);
    });
  });

  describe('calculateTotalPrice', () => {
    test('should calculate total price with additional services', () => {
      const basePrice = 1000;
      const additionalServices = [
        { price: 200 },
        { price: 300 }
      ];
      
      const result = calculateTotalPrice(basePrice, additionalServices);
      expect(result).toBe(1500);
    });

    test('should return base price when no additional services', () => {
      const result = calculateTotalPrice(800, []);
      expect(result).toBe(800);
    });

    test('should handle services without price property', () => {
      const basePrice = 500;
      const additionalServices = [
        { duration: 30 },
        { price: 100 }
      ];
      
      const result = calculateTotalPrice(basePrice, additionalServices);
      expect(result).toBe(600);
    });
  });

  describe('formatPrice', () => {
    test('should format price in RUB currency', () => {
      const result = formatPrice(1500);
      expect(result).toMatch(/1[\s]?500/);
      expect(result).toContain('₽');
    });

    test('should format zero price correctly', () => {
      const result = formatPrice(0);
      expect(result).toMatch(/0/);
      expect(result).toContain('₽');
    });

    test('should format decimal prices', () => {
      const result = formatPrice(999.99);
      expect(result).toContain('999,99');
      expect(result).toContain('₽');
    });

    test('should format integer prices without decimals', () => {
      const result = formatPrice(1000);
      expect(result).toMatch(/1[\s]?000/);
      expect(result).toContain('₽');
    });
  });

  describe('generateBookingId', () => {
    test('should generate booking ID with correct format', () => {
      const bookingId = generateBookingId();
      expect(bookingId).toMatch(/^BB\d/);
      expect(bookingId.length).toBeGreaterThan(10);
    });

    test('should generate unique IDs', () => {
      const id1 = generateBookingId();
      const id2 = generateBookingId();
      expect(id1).not.toBe(id2);
    });
  });
});