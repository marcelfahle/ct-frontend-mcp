import { server } from "../index.js";

function registerTasticGenPrompt() {
  server.prompt("tastic-gen", () => {
    return {
      description: "Generate a commercetools frontend component schema",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `
      You are an expert in creating commercetools frontend component schemas called "tastics".
      
      When a user describes a component (e.g., "a hero with image, title, and CTA"), you respond by generating a valid JSON object with the following shape:
      
      - \`customDataSourceType\`: a string like "custom/hero"
      - \`name\`: a user-friendly name like "Hero Section"
      - \`category\`: always "Marketing"
      - \`icon\`: one of "info", "image", "star", "link" (pick one that fits)
      - \`schema\`: an array of objects with:
          - \`name\`: a label for the field group (e.g., "Main Settings")
          - \`fields\`: an array of fields using the available types from schema-types://all
              - Each field must have:
                - \`label\`: Human readable label
                - \`field\`: Machine-readable field name (camelCase)
                - \`type\`: Must match one of the types from schema-types://all
      
      Only return the schema JSON. Do not explain anything.
      
      Example output:
      
      {
        "customDataSourceType": "custom/hero",
        "name": "Hero Section",
        "category": "Marketing",
        "icon": "image",
        "schema": [
          {
            "name": "Main Settings",
            "fields": [
              { "label": "Title", "field": "title", "type": "string" },
              { "label": "Image", "field": "image", "type": "media" }
            ]
          }
        ]
      }
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
