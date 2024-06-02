import type { KnownParserRule } from "./format-parser";

export class DateParser {
  private pos = 0;

  constructor(private readonly rules: KnownParserRule[]) {}

  private readNumber(value: string, numTokens: number, err: Error) {
    const num = Number(value.slice(this.pos, numTokens));
    if (Number.isNaN(num)) {
      throw err;
    }

    this.pos += numTokens;

    return num;
  }

  private handleRule(value: string, rule: KnownParserRule, date: Date) {
    switch (rule.type) {
      case "yyyy": {
        const year = this.readNumber(value, 4, Error("Expected yyyy"));
        date.setFullYear(year);
        break;
      }
      case "yy": {
        const year = Number("19" + value.slice(this.pos, 2));
        if (Number.isNaN(year)) {
          throw Error("Expected yy");
        }

        date.setFullYear(year);
        break;
      }
      case "MM": {
        const month = this.readNumber(value, 2, Error("Expected MM"));

        date.setMonth(month);
        break;
      }
      case "dd": {
        const day = this.readNumber(value, 2, Error("Expected dd"));

        date.setDate(day);
        break;
      }
      case "hh": {
        const hour = this.readNumber(value, 2, Error("Expected hh"));
        date.setHours(hour);
        break;
      }
      case "mm": {
        const minute = this.readNumber(value, 2, Error("Expected mm"));
        date.setMinutes(minute);
        break;
      }
      case "ss": {
        const second = this.readNumber(value, 2, Error("Expected ss"));
        date.setSeconds(second);
        break;
      }
      case "-":
      case ":":
      case "T": {
        this.pos += 1;
      }
    }
  }

  parse(value: string) {
    const date = new Date(0);
    for (const rule of this.rules) {
      this.handleRule(value, rule, date);
    }

    this.pos = 0;

    return date;
  }
}
