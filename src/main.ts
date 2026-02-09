import { parse } from "@webassemblyjs/wast-parser";
import { readFile } from "fs/promises";

const [, , path] = process.argv;
const file = await readFile(path, "utf-8");

const ast = parse(file);
console.log(ast);
