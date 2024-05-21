import type { KnownParserRule } from "./format-parser";

type Pattern =
  | "yyyy"
  | "yy"
  | "MM"
  | "dd"
  | "HH"
  | "mm"
  | "ss"
  | "T"
  | ":"
  | "-";
type Formatter = (date: Date) => string;

export const formatPatterns: { [K in Pattern]: Formatter } = {
  yyyy: (date) => date.getFullYear().toString().padStart(4, "0"),
  yy: (date) => date.getFullYear().toString().padStart(4, "0").substring(2),
  MM: (date) => (date.getMonth() + 1).toString().padStart(2, "0"),
  dd: (date) => date.getDate().toString().padStart(2, "0"),
  HH: (date) => date.getHours().toString().padStart(2, "0"),
  mm: (date) => date.getMinutes().toString().padStart(2, "0"),
  ss: (date) => date.getSeconds().toString().padStart(2, "0"),
  T: (date) => "T",
  ":": (date) => ":",
  "-": (date) => "-",
};

export const inlineFormatPatterns: { [K in Pattern]: string } = {
  yyyy: `out += dt.getFullYear().toString().padStart(4, "0");`,
  yy: `out += dt.getFullYear().toString().padStart(4, "0").substring(2);`,
  MM: `out += (dt.getMonth() + 1).toString().padStart(2, "0");`,
  dd: `out += dt.getDate().toString().padStart(2, "0");`,
  HH: `out += dt.getHours().toString().padStart(2, "0");`,
  mm: `out += dt.getMinutes().toString().padStart(2, "0");`,
  ss: `out += dt.getSeconds().toString().padStart(2, "0");`,
  T: `out += "T";`,
  ":": `out += ":"`,
  "-": `out += "-"`,
};

type Parser = (value: string, date: Date, pos: number) => Date;

const noopParser = (value: string, date: Date, pos: number) => date;

export const parserPatterns: { [K in Pattern]: Parser } = {
  yyyy: (value, date, pos) => {
    const year = Number(value.slice(pos, pos + 4));
    if (Number.isNaN(year)) {
      throw Error(`Expected yyyy`);
    }
    date.setFullYear(year);
    return date;
  },
  yy: (value, date, pos) => {
    const year = Number("19" + value.slice(pos, pos+2))
    if(Number.isNaN(year)){
      throw Error("Expected yy")
    }

    date.setFullYear(year);
    return date;
  },
  MM: (value, date, pos) => {
    const month = NUmber(value.slice(pos))
  }
  "-": noopParser,
  "T": noopParser,
  ":": noopParser,


};

export class FormatCodegen {
  constructor(private readonly ast: IterableIterator<KnownParserRule>) {}

  getFormatter() {
    const formatters: Formatter[] = [];
    for (const rule of this.ast) {
      switch (rule.type) {
        case "yyyy":
          formatters.push(formatPatterns["yyyy"]);
          break;
        case "yy":
          formatters.push(formatPatterns["yy"]);
          break;
        case "MM":
          formatters.push(formatPatterns["MM"]);
          break;
        case "dd":
          formatters.push(formatPatterns["dd"]);
          break;
        case "hh":
          formatters.push(formatPatterns["HH"]);
          break;
        case "mm":
          formatters.push(formatPatterns["mm"]);
          break;
        case "ss":
          formatters.push(formatPatterns["ss"]);
          break;
        case "-":
          formatters.push(formatPatterns["-"]);
          break;
        case ":":
          formatters.push(formatPatterns[":"]);
          break;
        case "T":
          formatters.push(formatPatterns["T"]);
          break;
      }
    }

    return (dt: Date) =>
      formatters.reduce((acc: string, fn) => {
        return acc + fn(dt);
      }, "");
  }

  getTurboFormatter() {
    let body = ["let out = '';"];
    for (const rule of this.ast) {
      switch (rule.type) {
        case "yyyy":
          body.push(inlineFormatPatterns["yyyy"]);
          break;
        case "yy":
          body.push(inlineFormatPatterns["yy"]);
          break;
        case "MM":
          body.push(inlineFormatPatterns["MM"]);
          break;
        case "dd":
          body.push(inlineFormatPatterns["dd"]);
          break;
        case "hh":
          body.push(inlineFormatPatterns["HH"]);
          break;
        case "mm":
          body.push(inlineFormatPatterns["mm"]);
          break;
        case "ss":
          body.push(inlineFormatPatterns["ss"]);
          break;
        case "-":
          body.push(inlineFormatPatterns["-"]);
          break;
        case ":":
          body.push(inlineFormatPatterns[":"]);
          break;
        case "T":
          body.push(inlineFormatPatterns["T"]);
          break;
      }
    }

    body.push("return out;");

    return new Function("dt", body.join("\n")) as (date: Date) => string;
  }
}
