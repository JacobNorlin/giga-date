import { describe, it, expect } from "bun:test";
import { FormatParser } from "./format-parser";

describe("parser", () => {
  it("should parse yy", () => {
    expect(FormatParser.parse("yy")).toBe(true);
    expect(FormatParser.parse("yyyy")).toBe(true);
    expect(FormatParser.parse("y"))
  });
});
