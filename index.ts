#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { registerTools } from "./tools/index.js";
import { registerPrompts } from "./prompts/index.js";
import { registerResources } from "./resources/index.js";

export const server = new McpServer({
  name: "Tastic Generator",
  version: "1.0.0",
  capabilities: {
    prompts: {},
    resources: {},
    tools: {},
  },
});

registerPrompts();
registerResources();
registerTools();

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
