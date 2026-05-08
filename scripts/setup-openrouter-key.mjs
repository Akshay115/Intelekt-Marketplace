import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const envPath = ".env.local";
const keyName = "OPENROUTER_API_KEY";

function maskInput(stream) {
  const originalWrite = stream.write;

  stream.write = function write(chunk, encoding, callback) {
    const text = chunk.toString();

    if (text.includes("\n") || text.includes("\r")) {
      return originalWrite.call(stream, chunk, encoding, callback);
    }

    return originalWrite.call(stream, "*", encoding, callback);
  };

  return () => {
    stream.write = originalWrite;
  };
}

output.write("OpenRouter API key: ");
const rl = createInterface({ input, output });
const restoreOutput = maskInput(output);
const answer = await rl.question("");
restoreOutput();
rl.close();
output.write("\n");

const apiKey = answer.trim();

if (!apiKey) {
  console.error("No key provided. .env.local was not changed.");
  process.exit(1);
}

const existing = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const lines = existing
  .split(/\r?\n/)
  .filter((line) => line.trim() && !line.startsWith(`${keyName}=`));

lines.push(`${keyName}=${apiKey}`);

if (!lines.some((line) => line.startsWith("OPENROUTER_DEFAULT_MODEL="))) {
  lines.push("OPENROUTER_DEFAULT_MODEL=openrouter/free");
}

writeFileSync(envPath, `${lines.join("\n")}\n`, { mode: 0o600 });
console.log(`${keyName} saved to ${envPath}.`);
