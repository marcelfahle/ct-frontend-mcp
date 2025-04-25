import { z } from "zod";

// Field schema
const fieldSchema = z.object({
  label: z.string(),
  field: z.string(),
  type: z.enum(["media", "string", "reference"]),
  translatable: z.boolean().optional(),
  required: z.boolean().optional(),
  default: z.union([z.string(), z.null()]).optional(),
});

// Section schema
const sectionSchema = z.object({
  name: z.string(),
  helpText: z.string().optional(),
  fields: z.array(fieldSchema),
});

// Main Tastic schema
const tasticSchemaDefinition = z.object({
  name: z.string(),
  icon: z.string().optional(),
  category: z.string().optional(),
  schema: z.array(sectionSchema),
  tasticType: z.string(),
});

// Type inference
export type TasticSchema = z.infer<typeof tasticSchemaDefinition>;
export type TasticSection = z.infer<typeof sectionSchema>;
export type TasticField = z.infer<typeof fieldSchema>;

interface VerificationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Verifies a Tastic schema string against the defined Zod schema.
 * @param schemaString The Tastic schema as a JSON string.
 * @returns A promise resolving to a VerificationResult.
 */
export async function verifySchema(
  schemaString: string
): Promise<VerificationResult> {
  try {
    const schemaObject = JSON.parse(schemaString);
    const validationResult = tasticSchemaDefinition.safeParse(schemaObject);

    console.log(validationResult);

    if (validationResult.success) {
      return { valid: true };
    } else {
      const errorMessages = validationResult.error.errors.map(
        (err) => `${err.path.join(".")} - ${err.message}`
      );
      return { valid: false, errors: errorMessages };
    }
  } catch (error: any) {
    // Handle JSON parsing errors
    return { valid: false, errors: [`Invalid JSON: ${error.message}`] };
  }
}
