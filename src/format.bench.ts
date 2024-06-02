import { Bench } from "tinybench";
import { FormatCompiler } from "./format-compiler";
import { parse } from "date-fns";

const bench = new Bench({ time: 300 });

const ISO_8601 = "yyyy-MM-ddThh:mm:ss";
const ISO_8601_2 = "yyyy-MM-dd'T'hh:mm:ss";
const dateStr = "2023-01-04T12:42:31";
const date = new Date(dateStr);

const compiler = new FormatCompiler();

{
  const [formatter, parser] = compiler.compile(ISO_8601);
  bench.add("ISO_8601 format", () => {
    formatter(date);
  });
  bench.add("ISO_8601 parse", () => {
    parser.parse(dateStr);
  });
}

{
  const [formatter, parser] = compiler.compileTurbo(ISO_8601);
  bench.add("ISO_8601 format turbo", () => {
    formatter(date);
  });
}

const d = new Date();
{
  bench.add("date-fns parse", () => {
    parse(dateStr, ISO_8601_2, d);
  });
}

{
  bench.add("pure date parse", () => {
    new Date(dateStr);
  });
}

{
  function inlineISO8601Parse(value: string) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(5, 7));
    const d = Number(value.slice(8, 9));
    const hour = Number(value.slice(10, 12));
    const minute = Number(value.slice(13, 15));
    const second = Number(value.slice(16, 18));

    const dt = new Date();
    dt.setFullYear(year, month, d);
    dt.setHours(hour);
    dt.setMinutes(minute);
    dt.setSeconds(second);
  }

  bench.add("inline parse ISO", () => {
    inlineISO8601Parse(dateStr);
  });
}

await bench.warmup();
await bench.run();

console.table(bench.table());
