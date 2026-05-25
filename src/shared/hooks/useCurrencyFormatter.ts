import { useUserStore } from '@/shared/stores/userStore';
import { formatCurrencyAs, formatCurrency } from '@/shared/lib/formatters';

/**
 * Returns a format function that converts ZAR → the user's selected currency.
 * Drop-in replacement for formatCurrency() anywhere currency switching is desired.
 */
export function useCurrencyFormatter(): (zarValue: number) => string {
  const currency = useUserStore((s) => s.currency);
  if (currency === 'ZAR') return formatCurrency;
  return (v: number) => formatCurrencyAs(v, currency);
}
