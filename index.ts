#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { registerTools } from "./tools/index.js";

// 1) Initialize MCP Server
export const server = new McpServer({
  name: "Weather Service",
  version: "1.0.0",
});

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
