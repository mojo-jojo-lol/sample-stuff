import { beforeAll, describe, it, expect } from 'vitest';
import { main } from '../src';

beforeAll(() => {
  process.env.LOL = 'ok';
})

describe('test', () => {
  it('should be true', () => {
    expect(main(true)).toBe(true);
  });
});
