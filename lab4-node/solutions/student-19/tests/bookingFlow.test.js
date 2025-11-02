import { 
  calculateTotalPrice,
  calculateDuration,
  generateBookingId
} from '../src/utils/math.js';

import { 
  getServicePrice
} from '../src/utils/index.js';

describe('Booking Flow Functions', () => {
  describe('Price Calculations', () => {
    test('should calculate total price with multiple services', () => {
      const basePrice = 1000;
      const additionalServices = [
        { price: 200 },
        { price: 300 },
        { price: 150 }
      ];
      
      const total = calculateTotalPrice(basePrice, additionalServices);
      expect(total).toBe(1650);
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

    test('should calculate duration with multiple services', () => {
      const baseDuration = 60;
      const additionalServices = [
        { duration: 30 },
        { duration: 45 },
        { duration: 15 }
      ];
      
      const total = calculateDuration(baseDuration, additionalServices);
      expect(total).toBe(150);
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

  describe('Service Price Selection', () => {
    test('should select correct price based on master type', () => {
      const service = { basePrice: 1000, topMasterPrice: 1500 };
      const topMaster = { isTopMaster: true };
      const regularMaster = { isTopMaster: false };
      
      expect(getServicePrice(service, topMaster)).toBe(1500);
      expect(getServicePrice(service, regularMaster)).toBe(1000);
    });

    test('should handle services without topMasterPrice', () => {
      const service = { price: 1000 };
      const master = { isTopMaster: true };
      
      expect(getServicePrice(service, master)).toBe(1000);
    });

    test('should handle services with only basePrice', () => {
      const service = { basePrice: 1000 };
      const master = { isTopMaster: true };
      
      expect(getServicePrice(service, master)).toBe(1000);
    });
  });

  describe('Booking ID Generation', () => {
    test('should generate unique booking IDs', () => {
      const ids = new Set();
      
      for (let i = 0; i < 10; i++) {
        ids.add(generateBookingId());
      }
      
      expect(ids.size).toBe(10);
    });

    test('should generate IDs with correct prefix', () => {
      const id = generateBookingId();
      expect(id.startsWith('BB')).toBe(true);
    });

    test('should generate IDs with sufficient length', () => {
      const id = generateBookingId();
      expect(id.length).toBeGreaterThan(10);
    });
  });
});