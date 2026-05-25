import type { CurrencyCode } from '@/shared/stores/userStore';

// ── ZAR base formatters (used when currency is not needed) ────────────────────

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

// ── Multi-currency support ────────────────────────────────────────────────────

/** All values are stored in ZAR internally. These rates convert ZAR → target. */
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  ZAR: 1,
  USD: 0.055,
  EUR: 0.051,
  GBP: 0.043,
  AED: 0.202,
};

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  ZAR: 'R · ZAR',
  USD: '$ · USD',
  EUR: '€ · EUR',
  GBP: '£ · GBP',
  AED: 'د.إ · AED',
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  ZAR: 'R',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED',
};

/** Convert a ZAR amount to the target currency and format it. */
export function formatCurrencyAs(zarValue: number, currency: CurrencyCode): string {
  const converted = zarValue * EXCHANGE_RATES[currency];
  if (currency === 'ZAR') return ZAR.format(converted);
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}

// ── Percentage + number formatters ────────────────────────────────────────────

/** Format a percentage with sign — e.g. +2.45% or -1.10% */
export function formatPct(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/** Format a whole number with thousands separator — e.g. 12 345 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-ZA').format(Math.round(value));
}
