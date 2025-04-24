import { z } from "zod";
import { server } from "../index.js";

function registerGenerateTasticSchemaTool() {
  server.tool(
    "generateTasticSchema",
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

export function registerTools() {
  registerGenerateTasticSchemaTool();
}
