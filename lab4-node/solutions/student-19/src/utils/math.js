export function calculateDuration(baseDuration, additionalServices = []) {
  let totalDuration = baseDuration;
  additionalServices.forEach(service => {
    totalDuration += service.duration || 0;
  });
  return totalDuration;
}

export function calculateTotalPrice(basePrice, additionalServices = []) {
  let totalPrice = basePrice;
  additionalServices.forEach(service => {
    totalPrice += service.price || 0;
  });
  return totalPrice;
}

export function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(price);
}

export function generateBookingId() {
  return `BB${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
}