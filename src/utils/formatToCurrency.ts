/**
 * Formats a number into a currency string with spaces as thousands separators.
 *
 * @param amount The number to format.
 * @param currencySymbol The symbol to prepend to the currency string (e.g., '$', '€'). Defaults to ''.
 * @param decimalPlaces The number of decimal places to include. Defaults to 0 for whole numbers as per example.
 * @returns A formatted currency string.
 */
export const formatToCurrency = (
  amount: number,
  currencySymbol: string = "",
  decimalPlaces: number = 0,
): string => {
  if (isNaN(amount)) {
    return `${currencySymbol}Invalid Number`;
  }

  const roundedAmount = amount.toFixed(decimalPlaces);

  const parts = roundedAmount.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " ",
  );

  return `${formattedIntegerPart}${decimalPart} ${currencySymbol}`;
};
