import { describe, it, expect } from 'vitest';
import { main } from '../src';

describe('test', () => {
  it('should be true?', () => {
    expect(main(true)).toBe(true);
  });
});
