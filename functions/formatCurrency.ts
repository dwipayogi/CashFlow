/**
 * Formats a number as Indonesian Rupiah with dots as thousand separators
 * @param amount The number to format
 * @param withSymbol Whether to include the "Rp" symbol (default: true)
 * @returns Formatted currency string
 */
export const formatRupiah = (amount: number | string, withSymbol = true): string => {
  // Convert to string and handle invalid inputs
  const numStr = typeof amount === 'number' 
    ? amount.toString() 
    : (parseFloat(amount) || 0).toString();
  
  // Format with thousand separators (dots)
  const formatted = numStr
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    ?.join('.')
    .split('')
    .reverse()
    .join('') || '0';
  
  // Add Rp symbol if requested
  return withSymbol ? `Rp${formatted}` : formatted;
};

/**
 * Example usage:
 * formatRupiah(10000) => "Rp 10.000"
 * formatRupiah(1250000) => "Rp 1.250.000"
 * formatRupiah(1250000, false) => "1.250.000"
 */