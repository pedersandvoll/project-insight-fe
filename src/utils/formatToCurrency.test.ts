import { describe, it, expect } from 'vitest';
import { formatToCurrency } from './formatToCurrency';

describe('formatToCurrency', () => {
  it('should format basic numbers without currency symbol', () => {
    expect(formatToCurrency(1000)).toBe('1 000 ');
    expect(formatToCurrency(100000)).toBe('100 000 ');
    expect(formatToCurrency(1000000)).toBe('1 000 000 ');
  });

  it('should format numbers with currency symbol', () => {
    expect(formatToCurrency(1000, 'kr')).toBe('1 000 kr');
    expect(formatToCurrency(50000, '$')).toBe('50 000 $');
    expect(formatToCurrency(75000, '€')).toBe('75 000 €');
  });

  it('should handle decimal places', () => {
    expect(formatToCurrency(1000.50, 'kr', 2)).toBe('1 000.50 kr');
    expect(formatToCurrency(999.99, '$', 2)).toBe('999.99 $');
    expect(formatToCurrency(1234.567, '€', 1)).toBe('1 234.6 €');
  });

  it('should handle small numbers', () => {
    expect(formatToCurrency(100)).toBe('100 ');
    expect(formatToCurrency(50, 'kr')).toBe('50 kr');
    expect(formatToCurrency(1, '$')).toBe('1 $');
  });

  it('should handle zero', () => {
    expect(formatToCurrency(0)).toBe('0 ');
    expect(formatToCurrency(0, 'kr')).toBe('0 kr');
    expect(formatToCurrency(0, '$', 2)).toBe('0.00 $');
  });

  it('should handle negative numbers', () => {
    expect(formatToCurrency(-1000)).toBe('-1 000 ');
    expect(formatToCurrency(-50000, 'kr')).toBe('-50 000 kr');
    expect(formatToCurrency(-1234.56, '$', 2)).toBe('-1 234.56 $');
  });

  it('should handle invalid numbers', () => {
    expect(formatToCurrency(NaN)).toBe('Invalid Number');
    expect(formatToCurrency(NaN, 'kr')).toBe('krInvalid Number');
  });

  it('should handle very large numbers', () => {
    expect(formatToCurrency(1000000000)).toBe('1 000 000 000 ');
    expect(formatToCurrency(123456789, 'kr')).toBe('123 456 789 kr');
  });

  it('should handle rounding correctly', () => {
    expect(formatToCurrency(1000.999, 'kr', 2)).toBe('1 001.00 kr');
    expect(formatToCurrency(999.995, '$', 2)).toBe('1 000.00 $');
  });
});