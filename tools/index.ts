import { z } from "zod";
import { server } from "../index.js";
import { verifySchema } from "./tasticSchema.js";

function registerLoadTasticContextTool() {
  server.tool(
    "loadTasticContext",
    "Load up the memory and context with the component and tastic specification",
    {
      prompt: z
        .string()
        .describe(
          "Describe the component to generate, e.g. 'hero with title, image, CTA'"
        ),
    },
    async ({ prompt }) => {
      return {
        content: [
          {
            type: "text",
            text: `You asked for: ${prompt}`,
          },
        ],
      };
    }
  );
}

// write another tool to verify the schema using tools/tasticSchema.ts
function registerVerifyTasticSchemaTool() {
  server.tool(
    "verifyTasticSchema",
    "Verify a Tastic schema",
    {
      schema: z.string().describe("The Tastic schema JSON string to verify"),
    },
    async ({ schema }) => {
      try {
        const result = await verifySchema(schema); // Assuming verifySchema is async
        if (result.valid) {
          return {
            content: [
              {
                type: "text",
                text: "Schema is valid.",
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `Schema is invalid:
${result.errors?.join("\n") ?? "Unknown error"}`,
              },
            ],
          };
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error verifying schema: ${error.message}`,
            },
          ],
        };
      }
    }
  );
}

export function registerTools() {
  registerLoadTasticContextTool();
  registerVerifyTasticSchemaTool();
}
