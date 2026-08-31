export interface FieldDefinition {
  name: string;
  type: "string" | "number" | "boolean";
  required: boolean;
}

export interface SchemaDefinition {
  name: string;
  version: number;
  fields: readonly FieldDefinition[];
}

const NAME = /^[A-Za-z][A-Za-z0-9._-]{0,127}$/;
const FIELD_TYPES = new Set<FieldDefinition["type"]>([
  "string",
  "number",
  "boolean",
]);

export function validateSchema(schema: SchemaDefinition): SchemaDefinition {
  if (!NAME.test(schema.name)) throw new Error("invalid schema name");
  if (!Number.isSafeInteger(schema.version) || schema.version < 1) {
    throw new Error("invalid schema version");
  }
  const seen = new Set<string>();
  for (const field of schema.fields) {
    if (!NAME.test(field.name)) throw new Error("invalid field name");
    if (!FIELD_TYPES.has(field.type)) throw new Error("invalid field type");
    if (typeof field.required !== "boolean") {
      throw new Error("invalid field required");
    }
    if (seen.has(field.name)) throw new Error("duplicate field name");
    seen.add(field.name);
  }
  return { ...schema, fields: schema.fields.map(field => ({ ...field })) };
}

export function isBackwardCompatible(
  previous: SchemaDefinition,
  next: SchemaDefinition
): boolean {
  const oldSchema = validateSchema(previous);
  const newSchema = validateSchema(next);
  if (oldSchema.name !== newSchema.name || newSchema.version <= oldSchema.version) {
    return false;
  }
  const nextByName = new Map(newSchema.fields.map(field => [field.name, field]));
  for (const oldField of oldSchema.fields) {
    const candidate = nextByName.get(oldField.name);
    if (!candidate || candidate.type !== oldField.type) return false;
    if (!oldField.required && candidate.required) return false;
  }
  return newSchema.fields
    .filter(field => !oldSchema.fields.some(old => old.name === field.name))
    .every(field => !field.required);
}
