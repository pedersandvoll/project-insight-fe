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
  // Ensure the amount is a valid number
  if (isNaN(amount)) {
    return `${currencySymbol}Invalid Number`;
  }

  // Round the number to the specified decimal places
  const roundedAmount = amount.toFixed(decimalPlaces);

  // Split the number into integer and decimal parts
  const parts = roundedAmount.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

  // Add spaces as thousands separators to the integer part
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " ",
  );

  // Combine the currency symbol, formatted integer part, and decimal part
  return `${formattedIntegerPart}${decimalPart} ${currencySymbol}`;
};
