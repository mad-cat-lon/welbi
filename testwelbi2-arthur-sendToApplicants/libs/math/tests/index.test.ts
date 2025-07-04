import { describe, it, expect } from 'vitest';
import * as math from '../src/index';

describe('Math Utilities', () => {
  it('clamps values', () => {
    expect(math.clamp(5, 1, 10)).toBe(5);
    expect(math.clamp(-1, 0, 10)).toBe(0);
    expect(math.clamp(20, 0, 10)).toBe(10);
  });

  it('lerps values', () => {
    expect(math.lerp(0, 10, 0.5)).toBe(5);
  });

  it('rounds to decimals', () => {
    expect(math.roundTo(1.2345, 2)).toBeCloseTo(1.23);
  });

  it('randomBetween and randomInt', () => {
    const r = math.randomBetween(1, 2);
    expect(r).toBeGreaterThanOrEqual(1);
    expect(r).toBeLessThanOrEqual(2);
    const i = math.randomInt(1, 2);
    expect([1, 2]).toContain(i);
  });

  it('calculates mean, median, mode', () => {
    expect(math.mean([1, 2, 3])).toBe(2);
    expect(math.median([1, 2, 3])).toBe(2);
    expect(math.mode([1, 2, 2, 3])).toContain(2);
  });

  it('calculates standard deviation and variance', () => {
    expect(math.standardDeviation([1, 2, 3])).toBeCloseTo(0.816, 2);
    expect(math.variance([1, 2, 3])).toBeCloseTo(0.666, 2);
  });

  it('calculates percentages', () => {
    expect(math.percentage(2, 4)).toBe(50);
    expect(math.percentageChange(100, 200)).toBe(100);
  });

  it('calculates sum, product, min, max, range', () => {
    expect(math.sum([1, 2, 3])).toBe(6);
    expect(math.product([1, 2, 3])).toBe(6);
    expect(math.min([1, 2, 3])).toBe(1);
    expect(math.max([1, 2, 3])).toBe(3);
    expect(math.range([1, 2, 3])).toBe(2);
  });

  it('calculates distances and angles', () => {
    expect(math.distance2D(0, 0, 3, 4)).toBe(5);
    expect(math.distance3D(0, 0, 0, 1, 2, 2)).toBeCloseTo(3);
    expect(math.degreesToRadians(180)).toBeCloseTo(Math.PI);
    expect(math.radiansToDegrees(Math.PI)).toBeCloseTo(180);
  });

  it('calculates factorial, combination, permutation', () => {
    expect(math.factorial(5)).toBe(120);
    expect(math.combination(5, 2)).toBe(10);
    expect(math.permutation(5, 2)).toBe(20);
    expect(() => math.factorial(-1)).toThrow();
  });

  it('calculates financial formulas', () => {
    expect(math.compound(100, 0.1, 2)).toBeCloseTo(121);
    expect(math.simpleInterest(100, 0.1, 2)).toBe(20);
    expect(math.presentValue(121, 0.1, 2)).toBeCloseTo(100);
    expect(math.futureValue(100, 0.1, 2)).toBeCloseTo(121);
  });

  it('validates numbers', () => {
    expect(math.isInteger(2)).toBe(true);
    expect(math.isFloat(2.5)).toBe(true);
    expect(math.isPrime(7)).toBe(true);
    expect(math.isEven(4)).toBe(true);
    expect(math.isOdd(3)).toBe(true);
  });
}); 