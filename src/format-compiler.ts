import type { DateParser } from "./date-parser";
import { FormatCodegen } from "./format-codegen";
import { FormatParser } from "./format-parser";
import { FormatTokenizer } from "./format-tokenizer";

export class FormatCompiler {
  private formatterCache = new Map<string, (dt: Date) => string>();

  private getCodegen(formatString: string) {
    const tokenizer = new FormatTokenizer(formatString);
    const parser = new FormatParser(tokenizer.tokens());
    const codegen = new FormatCodegen(parser.rules());
    return codegen;
  }

  compile(formatString: string) {
    const codegen = this.getCodegen(formatString);

    const formatter = codegen.getFormatter();
    this.formatterCache.set(formatString, formatter);
    const parser = codegen.getParser();
    return [formatter, parser] as const;
  }

  compileTurbo(formatString: string) {
    const codegen = this.getCodegen(formatString);

    const formatter = codegen.getTurboFormatter();
    const parser = codegen.getParser();
    return [formatter, parser] as const;
  }
}
