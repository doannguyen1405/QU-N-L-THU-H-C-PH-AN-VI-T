
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const calculateAmount = (quantity: number, rate: number, discount: number): number => {
  const base = quantity * rate;
  const discountAmount = base * (discount / 100);
  return base - discountAmount;
};

export const maskPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Remove non-digits to find middle
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return phone;
  
  // Mask 3 digits in the middle (e.g., index 4, 5, 6 for 10-digit number)
  const start = digits.slice(0, 3);
  const end = digits.slice(-3);
  return `${start}***${end}`;
};
