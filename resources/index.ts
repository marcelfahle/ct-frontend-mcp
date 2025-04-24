import { z } from "zod";
import { readdir, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { server } from "../index.js";

interface SchemaInfo {
  description: string;
}

interface SchemaResult {
  [key: string]: SchemaInfo;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCHEMA_DIR = join(__dirname, "schemas");

function registerListFieldTypesTool() {
  server.resource("schema-types", "schema-types://all", async () => {
    const types = await getFieldTypes();
    return {
      contents: [
        {
          uri: "schema-types://all",
          text: JSON.stringify(types, null, 2),
          mimeType: "application/json",
        },
      ],
    };
  });
}

// --- Helper function to get schema data ---
async function getFieldTypes(): Promise<SchemaResult> {
  const files = await readdir(SCHEMA_DIR);
  const result: SchemaResult = {};
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const content = await readFile(join(SCHEMA_DIR, file), "utf8");
      const json = JSON.parse(content);
      const name = file.replace(".json", "");
      result[name] = { description: json.description || "" };
    } catch (err) {
      console.warn(`Error reading schema file ${file}:`, err);
    }
  }
  return result;
}

export function registerResources() {
  registerListFieldTypesTool();
}
