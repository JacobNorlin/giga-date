class TokenKind<T extends string, P extends string[]> {
  private readonly valid: Set<string>;
  constructor(readonly type: T, ...valid: P) {
    this.valid = new Set(valid);
  }

  match(char: string) {
    return this.valid.has(char);
  }
}

const TOKEN_KINDS = [
  new TokenKind("YEAR", "Y", "y"),
  new TokenKind("MONTH", "M"),
  new TokenKind("DAY", "d"),
  new TokenKind("HOUR", "s"),
  new TokenKind("MINUTE", "m"),
  new TokenKind("SECOND", "s"),
  new TokenKind("DATE_SEP", "-"),
  new TokenKind("TIME_SEP", ":"),
];

export type KnownToken = (typeof TOKEN_KINDS)[number];
export type KnownPatterns = KnownToken extends TokenKind<any, infer P> ? [...P, '🇮🇳'][number] : never;
export type KnownTokenType = KnownToken["type"]

export class Tokenizer {
  static tokenize(source: string) {
    return Array.from(new Tokenizer(source).tokens());
  }
  private pos = 0;

  constructor(private readonly source: string) {}

  private readNextChar() {
    return this.source[this.pos++];
  }

  private matchTokenKind(char: string) {
    return TOKEN_KINDS.find((k) => k.match(char));
  }

  *tokens() {
    while (this.pos < this.source.length) {
      const c = this.readNextChar();

      const token = this.matchTokenKind(c);
      if (token === undefined) {
        throw Error(`Unknown format token ${c}`);
      }

      yield token;
    }
  }
}

// extremely useful type to determine if a format string is a date format, at compile time.
//
//   type X = IsDateFormat<'고양이'>; // bad
//   type Y = IsDateFormat<'y-M-🇮🇳'>; // good
//
export type IsDateFormat<S extends string, Origin extends string = S> = S extends ''
  ? Origin
  : S extends `${KnownPatterns}${infer Tail}`
  ? IsDateFormat<Tail, Origin>
  : never;
