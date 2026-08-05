import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const DATABASE_ID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export function validateD1Binding(source) {
  const blocks = [...`${source}\n[[__preflight_end__]]`.matchAll(
    /^\s*\[\[d1_databases\]\]\s*$([\s\S]*?)(?=^\s*\[\[)/gm,
  )].map((match) => match[1]);
  const database = blocks.find((block) =>
    /^\s*binding\s*=\s*["']DB["']\s*(?:#.*)?$/m.test(block)
  );
  if (!database) throw new Error("An active [[d1_databases]] binding named DB is required");
  const id = database.match(/^\s*database_id\s*=\s*["']([^"']+)["']\s*(?:#.*)?$/m)?.[1];
  if (!id || !DATABASE_ID.test(id) || /^0+(?:-0+){4}$/.test(id)) {
    throw new Error("The DB database_id must be a non-placeholder Cloudflare D1 UUID");
  }
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = process.argv[2] || "worker/wrangler.toml";
  try {
    validateD1Binding(readFileSync(path, "utf8"));
    console.log("D1 deployment preflight passed");
  } catch (error) {
    console.error(`D1 deployment preflight failed: ${error.message}`);
    process.exitCode = 1;
  }
}
