import { z } from 'zod';

// Field schema
const fieldSchema = z.object({
  label: z.string(),
  field: z.string(),
  type: z.enum(['media', 'string', 'reference']),
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
export const tasticSchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
  category: z.string().optional(),
  schema: z.array(sectionSchema),
  tasticType: z.string(),
});

// Type inference
export type TasticConfig = z.infer<typeof tasticSchema>;
export type TasticSection = z.infer<typeof sectionSchema>;
export type TasticField = z.infer<typeof fieldSchema>;
