class TokenKind<T extends string> {
  private readonly valid: Set<string>;
  constructor(readonly type: T, ...valid: string[]) {
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
  new TokenKind("HOUR", "h"),
  new TokenKind("MINUTE", "m"),
  new TokenKind("SECOND", "s"),
  new TokenKind("DATE_SEP", "-"),
  new TokenKind("TIME_SEP", ":"),
  new TokenKind("T_SEP", "T"),
];

export type KnownToken = (typeof TOKEN_KINDS)[number];
export type KnownTokenType = KnownToken["type"];

export class FormatTokenizer {
  static tokenize(source: string) {
    return Array.from(new FormatTokenizer(source).tokens());
  }
  private pos = 0;

  constructor(private readonly source: string) {}

  reset() {
    this.pos = 0;
  }

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

    this.reset();
  }
}