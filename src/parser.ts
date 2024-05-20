import type { KnownToken, KnownTokenType } from "./tokenizer";
import { Tokenizer } from "./tokenizer";

export class Parser {
  private currentToken: KnownToken | undefined;

  constructor(private readonly tokens: IterableIterator<KnownToken>) {}

  static parse(format: string) {
    const tokenizer = new Tokenizer(format);
    const parser = new Parser(tokenizer.tokens());
    return parser.parse();
  }

  private readToken(expect?: KnownTokenType) {
    this.currentToken = this.tokens.next().value;
    if (expect && this.currentToken?.type !== expect) {
      throw Error(`Expected ${expect} but received ${this.currentToken?.type}`);
    }
  }

  parse() {
    this.readToken();

    const parsers: string[] = [];

    while (this.currentToken) {
      switch (this.currentToken.type) {
        case "YEAR":
          // Either yy | yyyy
          this.readToken("YEAR");
          this.readToken("YEAR");

          this.readToken();
          if (this.currentToken?.type === "YEAR") {
            this.readToken("YEAR");
            parsers.push("YYYY");
          } else {
            parsers.push("YY");
          }
      }

      break;
    }

    console.log(parsers);
    return true;
  }
}
