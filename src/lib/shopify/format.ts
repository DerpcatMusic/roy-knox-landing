import type { Money } from "./types";

export function formatMoney(
  price: Money,
  options: { showCurrency?: boolean; locale?: string } = {},
): string {
  const { showCurrency = false, locale = "en-US" } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: price.currencyCode,
    currencyDisplay: showCurrency ? "symbol" : "narrowSymbol",
  }).format(parseFloat(price.amount));
}
