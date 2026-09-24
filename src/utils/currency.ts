/**
 * Currency conversion & formatting utilities.
 * Converts USD prices from DummyJSON to Indian Rupees (INR).
 */

// Exchange rate: 1 USD = 83 INR
export const USD_TO_INR_RATE = 83;

/**
 * Formats a price in USD to INR currency string with Indian numbering format.
 * Example: 9.99 USD -> ₹829.17
 */
export function formatINR(priceInUSD: number): string {
  if (priceInUSD === undefined || priceInUSD === null || isNaN(priceInUSD)) {
    return '₹0.00';
  }

  const inrAmount = priceInUSD * USD_TO_INR_RATE;

  return (
    '₹' +
    inrAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Formats price with whole numbers (rounded) for compact badges.
 * Example: 9.99 USD -> ₹829
 */
export function formatINRCompact(priceInUSD: number): string {
  if (priceInUSD === undefined || priceInUSD === null || isNaN(priceInUSD)) {
    return '₹0';
  }

  const inrAmount = Math.round(priceInUSD * USD_TO_INR_RATE);
  return '₹' + inrAmount.toLocaleString('en-IN');
}

/**
 * Converts an INR input value back to USD for API storage/mutation compatibility.
 */
export function inrToUsd(priceInINR: number): number {
  if (!priceInINR || isNaN(priceInINR)) return 0;
  return Number((priceInINR / USD_TO_INR_RATE).toFixed(2));
}

/**
 * Converts a USD value to INR numeric value.
 */
export function usdToInr(priceInUSD: number): number {
  if (!priceInUSD || isNaN(priceInUSD)) return 0;
  return Number((priceInUSD * USD_TO_INR_RATE).toFixed(2));
}
