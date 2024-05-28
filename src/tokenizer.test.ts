import { describe, it, expect } from "bun:test";
import { Tokenizer, type KnownToken, type KnownTokenType } from "./tokenizer";

describe("tokenizer", () => {
  const cases: Array<[string, Array<KnownTokenType>]> = [
    ['y', ['YEAR']],
    ['Y', ['YEAR']],
    ['y-M-d', ['YEAR', 'DATE_SEP', 'MONTH', 'DATE_SEP', 'DAY']],
  ];

  it.each(cases)('should tokenize single tokens', (source, expected) => {
    const types = Tokenizer.tokenize(source)
      .map(t => t.type);
    expect(types).toEqual(expected);
  });

  it('should throw when parsing unknown tokens', () => {
    expect(() => Tokenizer.tokenize('고양이')).toThrow();
  })
});
