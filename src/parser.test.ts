import { describe, it, expect } from "bun:test";
import { Parser } from "./parser";

describe("parser", () => {
  it("should parse yy", () => {
    expect(Parser.parse("yy")).toBe(true);
    expect(Parser.parse("yyyy")).toBe(true);
    expect(Parser.parse("y"))
  });
});
