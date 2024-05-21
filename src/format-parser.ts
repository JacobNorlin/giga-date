import type { KnownToken, KnownTokenType } from "./format-tokenizer";

class ParserRule<T extends string> {
  constructor(readonly type: T) {}
}

const PARSER_RULES = {
  yyyy: new ParserRule("yyyy"),
  yy: new ParserRule("yy"),
  MM: new ParserRule("MM"),
  dd: new ParserRule("dd"),
  hh: new ParserRule("hh"),
  mm: new ParserRule("mm"),
  ss: new ParserRule("ss"),
  T_SEP: new ParserRule("T"),
  TIME_SEP: new ParserRule(":"),
  DATE_SEP: new ParserRule("-"),
};

export type KnownParserRule = typeof PARSER_RULES[keyof typeof PARSER_RULES]



export class FormatParser {
  private currentToken: KnownToken | undefined;

  constructor(private readonly tokens: IterableIterator<KnownToken>) {}

  private readToken(expect?: KnownTokenType) {
    this.currentToken = this.tokens.next().value;
    if (expect && this.currentToken?.type !== expect) {
      throw Error(`Expected ${expect} but received ${this.currentToken?.type}`);
    }
  }

  *rules() {
    this.readToken();

    while (this.currentToken) {
      switch (this.currentToken.type) {
        case "YEAR": {
          // Either yy | yyyy
          this.readToken("YEAR");

          this.readToken();
          if (!this.currentToken) {
            break;
          }
          if (this.currentToken.type === "YEAR") {
            this.readToken("YEAR");
            yield PARSER_RULES.yyyy;
          } else {
            yield PARSER_RULES.yy;
          }

          break;
        }
        case "MONTH": {
          this.readToken("MONTH");
          yield PARSER_RULES.MM;
          break;
        }
        case "DAY": {
          this.readToken("DAY");
          yield PARSER_RULES.dd;
          break;
        }
        case "DATE_SEP": {
          yield PARSER_RULES.DATE_SEP;
          break;
        }
        case "HOUR": {
          this.readToken("HOUR");
          yield PARSER_RULES.hh;
          break;
        }
        case "MINUTE": {
          this.readToken("MINUTE");
          yield PARSER_RULES.mm;
          break;
        }
        case "SECOND": {
          this.readToken("SECOND");
          yield PARSER_RULES.ss;
          break;
        }
        case "T_SEP":
          yield PARSER_RULES.T_SEP;
          break;
        case "TIME_SEP":
          yield PARSER_RULES.TIME_SEP;
      }

      this.readToken();
    }
  }


}
