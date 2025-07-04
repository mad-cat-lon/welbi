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
  convertToTimezone,
  convertFromTimezone,
  compareDates,
  getDifference,
  getStartOfPeriod,
  getEndOfPeriod,
  now,
  today,
  tomorrow,
  yesterday,
  getAge,
  isValidDate,
} from '../src/index';

describe('Date/Time Utilities', () => {
  const base = '2024-01-01T12:00:00Z'
  it('formats date correctly', () => {
    expect(formatDate(base)).toMatch(/2024/);
  });

  it('formats date with timezone', () => {
    expect(formatDateWithTimezone(base, 'America/New_York')).toMatch(/2024/);
  });

  it('converts to and from ISO string', () => {
    const iso = toISOString(base);
    expect(typeof iso).toBe('string');
    const date = fromISOString(iso);
    expect(date instanceof Date).toBe(true);
  });

  it('adds and subtracts time (all units)', () => {
    expect(addTime(base, 1, 'days').getUTCDate()).toBe(2);
    expect(addTime(base, 1, 'hours').getUTCHours()).toBe(13);
    
    expect(subtractTime(base, 1, 'days').getUTCDate()).toBe(31);
    expect(subtractTime(base, 1, 'hours').getUTCHours()).toBe(11);
    expect(subtractTime(base, 1, 'minutes').getUTCMinutes()).toBe(59);
  });

  it('throws on invalid time units', () => {
    expect(() => addTime(base, 1, 'weeks' as any)).toThrow();
    expect(() => subtractTime(base, 1, 'months' as any)).toThrow();
  });

  it('compares dates correctly', () => {
    expect(isDateBefore('2024-01-01', '2024-01-02')).toBe(true);
    expect(isDateAfter('2024-01-02', '2024-01-01')).toBe(true);
    expect(isDateEqual('2024-01-01', '2024-01-01')).toBe(true);
  });

  it('throws on invalid date input', () => {
    expect(() => formatDate('not-a-date')).toThrow();
    expect(() => fromISOString('not-a-date')).toThrow();
  });

  it('converts to and from timezones', () => {
    const tzDate = convertToTimezone(base, 'Asia/Tokyo');
    expect(tzDate).toBeInstanceOf(Date);

    const localDate = convertFromTimezone(tzDate, 'Asia/Tokyo');
    expect(localDate).toBeInstanceOf(Date);
  });

  it('compares dates ascending and descending', () => {
    expect(compareDates('2024-01-01', '2024-01-02')).toBeLessThan(0);
    expect(compareDates('2024-01-02', '2024-01-01', 'desc')).toBeLessThan(0);
  });

  it('calculates differences in all units', () => {
    const d1 = '2024-01-02T00:00:00Z';
    const d2 = '2024-01-01T00:00:00Z';
    expect(getDifference(d1, d2, 'days')).toBe(1);
    expect(getDifference(d1, d2, 'hours')).toBe(24);
    expect(getDifference(d1, d2, 'minutes')).toBe(1440);
    expect(getDifference(d1, d2, 'seconds')).toBe(86400);
  });

  it('throws on unsupported difference unit', () => {
    expect(() => getDifference(base, base, 'weeks' as any)).toThrow();
  });

  it('gets start and end of period', () => {
    const date = '2024-01-15T00:00:00Z';
    expect(getStartOfPeriod(date, 'day').getHours()).toBe(0);
    expect(getEndOfPeriod(date, 'day').getHours()).toBe(23);
    expect(getStartOfPeriod(date, 'week')).toBeInstanceOf(Date);
    expect(getEndOfPeriod(date, 'week')).toBeInstanceOf(Date);
    expect(getStartOfPeriod(date, 'month')).toBeInstanceOf(Date);
    expect(getEndOfPeriod(date, 'month')).toBeInstanceOf(Date);
    expect(getStartOfPeriod(date, 'year')).toBeInstanceOf(Date);
    expect(getEndOfPeriod(date, 'year')).toBeInstanceOf(Date);
  });

  it('throws on unsupported period', () => {
    expect(() => getStartOfPeriod(base, 'quarter' as any)).toThrow();
    expect(() => getEndOfPeriod(base, 'quarter' as any)).toThrow();
  });

  it('returns now, today, tomorrow, yesterday', () => {
    expect(now()).toBeInstanceOf(Date);
    expect(today()).toBeInstanceOf(Date);
    expect(tomorrow()).toBeInstanceOf(Date);
    expect(yesterday()).toBeInstanceOf(Date);
  });

  it('calculates age', () => {
    const birthdate = '2000-01-01';
    const refDate = '2025-01-01';
    const age = getAge(birthdate, refDate);
    expect(age).toBeCloseTo(25, 0);
  });

  it('validates date inputs correctly', () => {
    expect(isValidDate('2024-01-01')).toBe(true);
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(1704067200000)).toBe(true); // timestamp
    expect(isValidDate('invalid-date')).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
  });
});
