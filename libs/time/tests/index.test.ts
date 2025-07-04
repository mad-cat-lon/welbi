import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateWithTimezone,
  toISOString,
  fromISOString,
  addTime,
  subtractTime,
  isDateBefore,
  isDateAfter,
  isDateEqual,
} from '../src/index';

describe('Date/Time Utilities', () => {
  it('formats date correctly', () => {
    expect(formatDate('2024-01-01')).toMatch(/2024/);
  });

  it('formats date with timezone', () => {
    expect(formatDateWithTimezone('2024-01-01T12:00:00Z', 'America/New_York')).toMatch(/2024/);
  });

  it('converts to and from ISO string', () => {
    const iso = toISOString('2024-01-01T00:00:00Z');
    expect(typeof iso).toBe('string');
    const date = fromISOString(iso);
    expect(date instanceof Date).toBe(true);
  });

  it('adds and subtracts time', () => {
    const base = '2024-01-01T00:00:00Z';
    expect(addTime(base, 1, 'days').getUTCDate()).toBe(2);
    expect(subtractTime(base, 1, 'days').getUTCDate()).toBe(31);
  });

  it('compares dates', () => {
    expect(isDateBefore('2024-01-01', '2024-01-02')).toBe(true);
    expect(isDateAfter('2024-01-02', '2024-01-01')).toBe(true);
    expect(isDateEqual('2024-01-01', '2024-01-01')).toBe(true);
  });

  it('throws on invalid date', () => {
    expect(() => formatDate('not-a-date')).toThrow();
  });
}); 