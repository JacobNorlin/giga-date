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
    if (this.formatterCache.has(formatString)) {
      return this.formatterCache.get(formatString)!;
    }

    const codegen = this.getCodegen(formatString);

    return codegen.getFormatter();
  }

  compileTurbo(formatString: string) {
    if (this.formatterCache.has(formatString)) {
      return this.formatterCache.get(formatString)!;
    }

    const codegen = this.getCodegen(formatString);

    return codegen.getTurboFormatter();
  }
}
