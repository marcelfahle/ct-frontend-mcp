#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { z } from "zod";
import { readdir, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCHEMA_DIR = join(__dirname, "schemas");

// 1) Initialize MCP Server
const server = new McpServer({
  name: "Weather Service",
  version: "1.0.0",
});

// Define types for schema
interface SchemaInfo {
  description: string;
}

interface SchemaResult {
  [key: string]: SchemaInfo;
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

// 2) Define the tool
server.tool("listFieldTypes", {}, async () => {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(await getFieldTypes()),
      },
    ],
  };
});

let transport: SSEServerTransport | undefined = undefined;

const app = express();

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (!transport) {
    res.status(400);
    res.json({ error: "No transport" });
    return;
  }
  await transport.handlePostMessage(req, res);
});

app.listen(8000, "0.0.0.0", () => {
  console.log("Server listening on port 8000");
});
