import { server } from "../index.js";

function registerTasticGenPrompt() {
  server.prompt("tastic-gen", () => {
    return {
      description:
        "Helps generate JSON schema for tastic components from user prompts",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `
      You are an expert in generating component schemas for the commercetools frontend platform. These schemas are called 'tastics'.
      
      Your job is to output a valid JSON schema definition for a new tastic, based on a short natural language prompt.
      
      Use only the available field types from the resource at schema-types://all.
      
      The output must be valid JSON and follow the commercetools tastic format:
      - Use field types like 'string', 'media', and 'reference'
      - Use 'required' appropriately
      - Nest fields as needed (e.g., for a CTA object)
      
      DO NOT explain your answer. Just return the schema.
      `.trim(),
          },
        },
      ],
    };
  });
}

export function registerPrompts() {
  registerTasticGenPrompt();
}
