import { parseArgs } from "jsr:@std/cli/parse-args";
import { TextLineStream } from "jsr:@std/streams";

const { path } = parseArgs(Deno.args, {
  alias: { path: "p" },
  string: ["path"],
});

if (!path) {
  console.error("Path must be specified, use --path or -p.");
  Deno.exit(1);
}

let try_block_started = 0;
let current_line = 0;
const output = new WritableStream<string>({
  write(chunk) {
    current_line++;

    if (!try_block_started && chunk.includes("try")) {
      try_block_started = current_line;
    }

    if (try_block_started && chunk.includes("catch")) {
      const block_length = try_block_started - current_line;
    }

    // console.log(chunk);
  },
});

try {
  const handle = await Deno.open(path);
  await handle.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
    .pipeTo(output);

  console.log(`Total Lines: ${current_line}`);
} catch {
  console.error("Invalid path.");
  Deno.exit(1);
}
