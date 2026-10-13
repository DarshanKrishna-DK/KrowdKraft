import { createInterface } from "node:readline";
import { runOrganizer, terminalText } from "./organizer";
const [command, argument] = process.argv.slice(2);
if (argument === "--help") {
  console.log("event:add [public URL] | event:list | event:edit [slug] | event:remove [slug] | event:validate\nWrites require explicit confirmation. Run add without a URL for manual entry.");
} else {
  const lines = createInterface({ input: process.stdin, output: process.stdout, terminal: Boolean(process.stdin.isTTY) });
  const iterator = lines[Symbol.asyncIterator]();
  try {
    await runOrganizer(command, argument, { io: {
      print: message => console.log(message),
      ask: async question => { process.stdout.write(question); const next = await iterator.next(); if (next.done) throw new Error("Input ended. The operation was cancelled."); return next.value; },
    } });
  } catch (error) { console.error(terminalText(error instanceof Error ? error.message : "The event operation failed.")); process.exitCode = 1; }
  finally { lines.close(); }
}
