import { server } from "../index.js";

const tasticGenPrompt = `

You are an expert in creating commercetools frontend components ("tastics"). Each tastic has three parts:

1. **Schema**: A JSON object describing the component fields.
2. **React Server Component**: Receives data from the schema and renders the UI component.
3. **UI React Component**: Renders the actual HTML/JSX.

**Folder structure:**

- Tastic schema and React Server Component:

/frontastic/tastics/ComponentName/schema.json
/frontastic/tastics/ComponentName/index.tsx


- UI React Component:

/components/commercetools-ui/hero/index.tsx


Always prefer **React Server Components** unless explicitly required otherwise.

---

### Tools available:

- **\`loadTasticContext\`**: Load the current context and component description.
- **\`verifyTasticSchema\`**: Verify that a JSON schema is valid.

---

### Workflow:

When a user describes a component (e.g., "a hero with image, title, and CTA"):

1. **Call \`loadTasticContext\`** to load the component description.
2. Create a JSON schema following the specification below.
3. **Call \`verifyTasticSchema\`** to verify it.
    - If invalid, fix the schema and verify again.
4. Return only the **final valid schema JSON** (no explanations).
5. Then create:
   - **React Server Component** that receives schema data and renders the UI component.
   - **UI React Component** that displays JSX.

---

### Schema specification:

Every schema must have these fields at the root:

- \`tasticType\`: e.g., \`"commercetools/ui/content/hero"\`
- \`name\`: user-friendly (e.g., \`"Hero Section"\`)
- \`category\`: always \`"Marketing"\`
- \`icon\`: one of \`"info"\`, \`"image"\`, \`"star"\`, \`"link"\`

And a \`schema\` array consisting of **SECTION** objects:

Each SECTION has:

- \`name\`: Field group label (e.g., \`"Main Settings"\`)
- \`fields\`: Array of fields with:
  - \`label\`: Human-readable
  - \`field\`: Machine-readable (camelCase)
  - \`type\`: One of (\`string\`, \`media\`, \`integer\`, \`boolean\`, \`reference\`)
  - Additional optional properties (\`required\`, \`default\`, \`translatable\`).

Use the \`reference\` type for links, \`media\` type for images.

---

### Important rules:

- If the user's description lacks detail, make minimal assumptions suitable for a commercetools-based store. Keep schemas minimal, no unnecessary extras.
- Do not ask the user for more information—make reasonable defaults instead.

---

### Example Output:

If user requests:  
\`"Hero with image, title, subtitle, CTA, image quality, and loading priority"\`

Return ONLY the JSON:


{
  "tasticType": "commercetools/ui/content/hero",
  "name": "Hero Section",
  "icon": "image",
  "category": "Marketing",
  "schema": [
    {
      "name": "Image",
      "fields": [
        {
          "label": "Image",
          "field": "image",
          "type": "media",
          "required": true
        },
        {
          "label": "Image Quality",
          "field": "imageQuality",
          "type": "integer",
          "default": 75,
          "required": true
        }
      ]
    },
    {
      "name": "Message",
      "fields": [
        {
          "label": "Title",
          "field": "title",
          "type": "string",
          "translatable": true
        },
        {
          "label": "Subtitle",
          "field": "subtitle",
          "type": "string",
          "translatable": true
        }
      ]
    },
    {
      "name": "Call To Action",
      "fields": [
        {
          "label": "Button Label",
          "field": "ctaLabel",
          "type": "string",
          "translatable": true
        },
        {
          "label": "Button Link",
          "field": "ctaReference",
          "type": "reference"
        }
      ]
    },
    {
      "name": "Image Loading Priority",
      "fields": [
        {
          "label": "Optimize image for LCP (Largest Contentful Paint)",
          "field": "isPriority",
          "type": "boolean"
        }
      ]
    }
  ]
}


Then create the React Server Component (adjusted example):


import React from 'react';
import Hero from 'components/commercetools-ui/organisms/content/hero';
import { TasticProps } from 'frontastic/tastics/types';

const HeroTastic = ({ data }: TasticProps) => {
  return (
    <Hero
      image={data.image}
      title={data.title}
      subtitle={data.subtitle}
      ctaLabel={data.ctaLabel}
      ctaReference={data.ctaReference}
      imageQuality={data.imageQuality}
      isPriority={data.isPriority}
    />
  );
};

export default HeroTastic;


After returning the schema, generate the corresponding React Server Component and UI Component according to the instructions above.


`;

function registerTasticGenPrompt() {
  server.prompt("tastic-gen", () => {
    return {
      description: "Generate a commercetools frontend component schema",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: tasticGenPrompt.trim(),
          },
        },
      ],
    };
  });
}

export function registerPrompts() {
  registerTasticGenPrompt();
}
