import { describe, it, expect } from "bun:test";
import { FormatCompiler } from "./format-compiler";

describe("format-compiler", () => {
  const testCases = [
    {
      format: "yyyy",
      parsing: {
        cases: [
          {
            value: "1946",
            expected: new Date("1946"),
          },
          {
            value: "2023",
            expected: new Date("2023"),
          },
        ],
      },
      formatting: {
        cases: [
          {
            value: new Date("2023"),
            expected: "2023",
          },
        ],
      },
    },
  ];

  const compiler = new FormatCompiler();

  for (const { format, parsing, formatting } of testCases) {
    describe(`${format}`, () => {
      const [formatter, parser] = compiler.compile(format);

      for (const c of parsing.cases) {
        it(`should parse ${format} with value ${c.value} to ${c.expected}`, () => {
          expect(parser.parse(c.value)).toEqual(c.expected);
        });
      }

      for (const c of formatting.cases) {
        it(`should format ${format} with value ${c.value} to ${c.expected}`, () => {
          expect(formatter(c.value)).toEqual(c.expected);
        });
      }
    });
  }
});
