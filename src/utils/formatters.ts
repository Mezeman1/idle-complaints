import Decimal from 'break_infinity.js'

export function formatNumber(num: Decimal | number): string {
  const decimal = num instanceof Decimal ? num : new Decimal(num)

  if (decimal.lt(10)) {
    // Show 2 decimal places for small numbers
    return decimal.toFixed(2)
  }

  if (decimal.lt(1000)) {
    return decimal.toFixed(0)
  }

  if (decimal.lt(1000000)) {
    return decimal.toFixed(1)
  }

  // For very large numbers, use scientific notation
  if (decimal.gte('1e6')) {
    return decimal.toExponential(2)
  }

  return decimal.toFixed(2)
}
