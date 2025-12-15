import { describe, expect, it } from 'vitest';
import { trim, toUiAmount } from './utils';

describe('utils', () => {
  it('trim removes repeated leading/trailing chars', () => {
    expect(trim('///about///', '/')).toBe('about');
    expect(trim('/about/', '/')).toBe('about');
    expect(trim('about', '/')).toBe('about');
  });

  it('toUiAmount formats numbers into K/M/B', () => {
    expect(toUiAmount(0)).toBe(0);
    expect(toUiAmount(999)).toBe('999');
    expect(toUiAmount(1000)).toBe('1K');
    expect(toUiAmount(1500)).toBe('1.5K');
    expect(toUiAmount(1_000_000)).toBe('1M');
    expect(toUiAmount(2_500_000)).toBe('2.5M');
    expect(toUiAmount(1_000_000_000)).toBe('1B');
  });
});

