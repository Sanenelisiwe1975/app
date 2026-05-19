const ZAR = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ZAR_COMPACT = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Format a number as ZAR — e.g. R 1 250 000.00 */
export function formatCurrency(value: number): string {
  return ZAR.format(value);
}

/** Compact format for large numbers — e.g. R 1.25M */
export function formatCurrencyCompact(value: number): string {
  return ZAR_COMPACT.format(value);
}

/** Format a percentage with sign — e.g. +2.45% or -1.10% */
export function formatPct(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/** Format a whole number with thousands separator — e.g. 12 345 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-ZA').format(Math.round(value));
}
