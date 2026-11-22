import { formatCurrency } from './format';

const compact = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** 1500000 -> 15L (short text for axis labels) */
export const formatCompact = (value: number): string => compact.format(value);

/** Full rupee amount for tooltips */
export const formatTooltipAmount = (value: number | null): string =>
  value === null ? '' : formatCurrency(value);

/** Show only whole numbers on a count axis */
export const formatWholeNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : '';