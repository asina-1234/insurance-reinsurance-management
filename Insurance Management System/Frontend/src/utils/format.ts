const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 150000 -> ₹1,50,000.00 */
export const formatCurrency = (value: number): string => currencyFormatter.format(value);

/** 2026-11-17 -> 17/11/2026 */
export const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};