import { createHash, randomUUID } from "node:crypto";

export type HopeToolAvailability =
  | "executable"
  | "integration_required"
  | "disabled";

export type HopeToolDescriptor = Readonly<{
  id: string;
  name: string;
  category: string;
  description: string;
  availability: HopeToolAvailability;
  sideEffect: "none" | "read" | "write" | "sensitive";
  requiresConfirmation: boolean;
  parameters: Readonly<Record<string, unknown>>;
}>;

export type HopeToolExecution = Readonly<{
  toolId: string;
  output: unknown;
}>;

type Args = Record<string, unknown>;

const objectSchema = (
  properties: Record<string, unknown>,
  required: string[] = []
): Record<string, unknown> => ({
  type: "object",
  properties,
  required,
  additionalProperties: false,
});

const stringProp = (description: string, maxLength = 20_000) => ({
  type: "string",
  description,
  maxLength,
});
const numberProp = (description: string) => ({
  type: "number",
  description,
});

const EXECUTABLE_TOOLS: readonly HopeToolDescriptor[] = Object.freeze([
  {
    id: "math_operation",
    name: "Math Operation",
    category: "math",
    description: "Perform one bounded arithmetic operation without eval.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide", "power", "modulo"],
        },
        a: numberProp("First number."),
        b: numberProp("Second number."),
      },
      ["operation", "a", "b"]
    ),
  },
  {
    id: "percent_change",
    name: "Percent Change",
    category: "math",
    description: "Calculate percent change between an old and new value.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        oldValue: numberProp("Original value."),
        newValue: numberProp("New value."),
      },
      ["oldValue", "newValue"]
    ),
  },
  {
    id: "unit_convert_length",
    name: "Length Converter",
    category: "math",
    description: "Convert common metric and imperial length units.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        value: numberProp("Numeric value."),
        from: { type: "string", enum: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"] },
        to: { type: "string", enum: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"] },
      },
      ["value", "from", "to"]
    ),
  },
  {
    id: "temperature_convert",
    name: "Temperature Converter",
    category: "math",
    description: "Convert Celsius, Fahrenheit, and Kelvin.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        value: numberProp("Temperature value."),
        from: { type: "string", enum: ["C", "F", "K"] },
        to: { type: "string", enum: ["C", "F", "K"] },
      },
      ["value", "from", "to"]
    ),
  },
  {
    id: "text_stats",
    name: "Text Statistics",
    category: "text",
    description: "Count characters, words, lines, and non-empty lines.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Text to analyze.") }, ["text"]),
  },
  {
    id: "word_frequency",
    name: "Word Frequency",
    category: "text",
    description: "Return the most frequent normalized words in text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        text: stringProp("Text to analyze."),
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
      },
      ["text"]
    ),
  },
  {
    id: "extract_urls",
    name: "URL Extractor",
    category: "text",
    description: "Extract unique HTTP and HTTPS URLs from supplied text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Text containing URLs.") }, ["text"]),
  },
  {
    id: "extract_emails",
    name: "Email Extractor",
    category: "text",
    description: "Extract unique email-like addresses from supplied text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Text containing email addresses.") }, ["text"]),
  },
  {
    id: "sort_lines",
    name: "Line Sorter",
    category: "text",
    description: "Sort lines ascending or descending.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        text: stringProp("Line-oriented text."),
        direction: { type: "string", enum: ["asc", "desc"], default: "asc" },
      },
      ["text"]
    ),
  },
  {
    id: "dedupe_lines",
    name: "Line Deduplicator",
    category: "text",
    description: "Remove duplicate lines while preserving first-seen order.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Line-oriented text.") }, ["text"]),
  },
  {
    id: "text_case",
    name: "Text Case Converter",
    category: "text",
    description: "Convert text to upper, lower, title, or sentence case.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        text: stringProp("Text to transform."),
        mode: { type: "string", enum: ["upper", "lower", "title", "sentence"] },
      },
      ["text", "mode"]
    ),
  },
  {
    id: "slugify",
    name: "Slugify",
    category: "text",
    description: "Create a lowercase URL-friendly slug.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Text to slugify.", 4_000) }, ["text"]),
  },
  {
    id: "markdown_outline",
    name: "Markdown Outline",
    category: "document",
    description: "Extract Markdown headings into a structured outline.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Markdown text.") }, ["text"]),
  },
  {
    id: "checklist_from_text",
    name: "Checklist Extractor",
    category: "document",
    description: "Extract bullet-like statements into a normalized checklist.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Notes or bullet text.") }, ["text"]),
  },
  {
    id: "json_validate",
    name: "JSON Validator",
    category: "data",
    description: "Validate JSON and report the parse error without modifying data.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ json: stringProp("JSON string.") }, ["json"]),
  },
  {
    id: "json_format",
    name: "JSON Formatter",
    category: "data",
    description: "Parse and pretty-print bounded JSON.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ json: stringProp("JSON string.") }, ["json"]),
  },
  {
    id: "json_keys",
    name: "JSON Key Inspector",
    category: "data",
    description: "List top-level JSON object keys.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ json: stringProp("JSON object string.") }, ["json"]),
  },
  {
    id: "json_pick",
    name: "JSON Field Picker",
    category: "data",
    description: "Return selected top-level fields from a JSON object.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        json: stringProp("JSON object string."),
        keys: {
          type: "array",
          items: { type: "string", maxLength: 120 },
          minItems: 1,
          maxItems: 50,
        },
      },
      ["json", "keys"]
    ),
  },
  {
    id: "csv_profile",
    name: "CSV Profiler",
    category: "data",
    description: "Profile a simple comma-separated dataset: rows, columns, headers, and missing cells.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ csv: stringProp("Simple CSV text.") }, ["csv"]),
  },
  {
    id: "number_stats",
    name: "Number Statistics",
    category: "data",
    description: "Calculate count, min, max, mean, median, and sum for bounded numeric input.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        values: {
          type: "array",
          items: { type: "number" },
          minItems: 1,
          maxItems: 5_000,
        },
      },
      ["values"]
    ),
  },
  {
    id: "date_diff_days",
    name: "Date Difference",
    category: "date",
    description: "Calculate the signed day difference between two ISO-like dates.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        start: stringProp("Start date.", 100),
        end: stringProp("End date.", 100),
      },
      ["start", "end"]
    ),
  },
  {
    id: "timestamp_to_iso",
    name: "Timestamp to ISO",
    category: "date",
    description: "Convert a Unix seconds or milliseconds timestamp to ISO 8601.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ timestamp: numberProp("Unix timestamp.") }, ["timestamp"]),
  },
  {
    id: "url_parse",
    name: "URL Parser",
    category: "web",
    description: "Parse a URL string locally without fetching it.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ url: stringProp("Absolute URL.", 4_000) }, ["url"]),
  },
  {
    id: "querystring_parse",
    name: "Query String Parser",
    category: "web",
    description: "Parse a URL query string into key-value entries.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ query: stringProp("Query string.", 8_000) }, ["query"]),
  },
  {
    id: "regex_test",
    name: "Regex Tester",
    category: "developer",
    description: "Test a bounded JavaScript regular expression against supplied text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        pattern: stringProp("Regular expression pattern.", 500),
        flags: { type: "string", maxLength: 8, default: "" },
        text: stringProp("Text to test.", 20_000),
      },
      ["pattern", "text"]
    ),
  },
  {
    id: "sha256",
    name: "SHA-256",
    category: "developer",
    description: "Calculate a SHA-256 hex digest of text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Text to hash.") }, ["text"]),
  },
  {
    id: "base64_encode",
    name: "Base64 Encoder",
    category: "developer",
    description: "Encode UTF-8 text as base64.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Text to encode.") }, ["text"]),
  },
  {
    id: "base64_decode",
    name: "Base64 Decoder",
    category: "developer",
    description: "Decode base64 into bounded UTF-8 text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ value: stringProp("Base64 string.") }, ["value"]),
  },
  {
    id: "uuid_v4",
    name: "UUID v4 Generator",
    category: "developer",
    description: "Generate a cryptographically strong random UUID v4.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({}),
  },
  {
    id: "html_escape",
    name: "HTML Escaper",
    category: "developer",
    description: "Escape basic HTML-sensitive characters in text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Text to escape.") }, ["text"]),
  },
  {
    id: "line_diff",
    name: "Line Diff",
    category: "developer",
    description: "Produce a simple line-by-line before/after difference summary.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        before: stringProp("Original text."),
        after: stringProp("Updated text."),
      },
      ["before", "after"]
    ),
  },
  {
    id: "code_imports",
    name: "Code Import Extractor",
    category: "developer",
    description: "Extract common JavaScript/TypeScript/Python import statements from source text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ code: stringProp("Source code.") }, ["code"]),
  },
  {
    id: "todo_extract",
    name: "TODO Extractor",
    category: "developer",
    description: "Extract TODO/FIXME/XXX markers with line numbers.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Source or notes.") }, ["text"]),
  },
  {
    id: "password_strength",
    name: "Password Strength Heuristic",
    category: "security",
    description: "Evaluate local password composition without storing or transmitting it beyond this request.",
    availability: "executable",
    sideEffect: "sensitive",
    requiresConfirmation: false,
    parameters: objectSchema({ password: stringProp("Password to evaluate.", 512) }, ["password"]),
  },
  {
    id: "jwt_decode_unverified",
    name: "JWT Decoder (Unverified)",
    category: "security",
    description: "Decode JWT header and payload without verifying the signature.",
    availability: "executable",
    sideEffect: "sensitive",
    requiresConfirmation: false,
    parameters: objectSchema({ token: stringProp("JWT token.", 20_000) }, ["token"]),
  },
  {
    id: "text_replace",
    name: "Text Replace",
    category: "text",
    description: "Replace literal text occurrences without regex execution.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        text: stringProp("Source text."),
        find: stringProp("Literal text to find.", 2_000),
        replace: stringProp("Replacement text.", 2_000),
      },
      ["text", "find", "replace"]
    ),
  },
  {
    id: "text_excerpt",
    name: "Text Excerpt",
    category: "text",
    description: "Return a bounded excerpt from the start of text.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema(
      {
        text: stringProp("Source text."),
        maxChars: { type: "integer", minimum: 1, maximum: 8_000, default: 1_000 },
      },
      ["text"]
    ),
  },
  {
    id: "contract_clause_checklist",
    name: "Contract Clause Checklist",
    category: "legal",
    description: "Check whether common contract topic keywords appear; this is issue spotting, not legal advice.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Contract text.") }, ["text"]),
  },
  {
    id: "legal_heading_outline",
    name: "Legal Document Heading Outline",
    category: "legal",
    description: "Extract likely numbered or uppercase legal-document headings.",
    availability: "executable",
    sideEffect: "none",
    requiresConfirmation: false,
    parameters: objectSchema({ text: stringProp("Legal document text.") }, ["text"]),
  },
]);

const INTEGRATION_REQUIRED: readonly HopeToolDescriptor[] = Object.freeze([
  ["web_search", "Web Search", "web", "Search current public web sources."],
  ["browser_open", "Browser Open", "web", "Open and navigate a public webpage."],
  ["browser_form", "Browser Form Interaction", "web", "Fill supported web forms with user approval."],
  ["github_read", "GitHub Read", "developer", "Read repositories, issues, pull requests, and files."],
  ["github_write", "GitHub Write", "developer", "Create branches, commits, issues, and pull requests."],
  ["gmail_read", "Gmail Read", "communication", "Search and read authorized email."],
  ["gmail_send", "Gmail Send", "communication", "Send authorized email after explicit approval."],
  ["calendar_read", "Calendar Read", "productivity", "Read authorized calendar events."],
  ["calendar_write", "Calendar Write", "productivity", "Create or modify calendar events with approval."],
  ["drive_search", "Drive Search", "document", "Search authorized cloud drive files."],
  ["slack_read", "Slack Read", "communication", "Read authorized Slack content."],
  ["slack_send", "Slack Send", "communication", "Send authorized Slack messages with approval."],
  ["database_query", "Database Query", "data", "Execute read-only queries against an authorized database."],
  ["database_write", "Database Write", "data", "Execute approved database mutations."],
  ["code_sandbox", "Code Sandbox", "developer", "Execute code in an isolated runtime."],
  ["shell_exec", "Shell Execution", "developer", "Run approved shell commands in a sandbox."],
  ["image_generate", "Image Generation", "media", "Generate an image from a prompt."],
  ["image_edit", "Image Editing", "media", "Edit an authorized image."],
  ["speech_to_text", "Speech to Text", "media", "Transcribe audio."],
  ["text_to_speech", "Text to Speech", "media", "Generate speech audio."],
  ["maps_search", "Maps Search", "local", "Search maps and places."],
  ["weather", "Weather", "local", "Retrieve current weather or forecasts."],
  ["market_data", "Market Data", "finance", "Retrieve current market data from an authorized source."],
  ["blockchain_rpc", "Blockchain RPC", "web3", "Read chain state through an authorized RPC."],
  ["wallet_sign", "Wallet Signature", "web3", "Request a user-controlled wallet signature."],
  ["payment_submit", "Payment Submission", "finance", "Submit an approved payment through a configured provider."],
  ["cloud_deploy", "Cloud Deployment", "operations", "Deploy to an authorized cloud project."],
  ["object_storage", "Object Storage", "document", "Read/write authorized object storage."],
  ["vector_search", "Vector Search", "ai", "Search a configured vector index."],
  ["durable_memory", "Durable Memory", "ai", "Read/write configured server-side memory."],
  ["document_ocr", "Document OCR", "document", "Extract text from images or scanned documents."],
  ["pdf_extract", "PDF Extraction", "document", "Extract structured content from PDFs."],
  ["spreadsheet_edit", "Spreadsheet Editing", "document", "Edit authorized spreadsheet files."],
  ["crm_read", "CRM Read", "business", "Read configured CRM records."],
  ["crm_write", "CRM Write", "business", "Modify configured CRM records with approval."],
  ["ticketing_read", "Ticketing Read", "operations", "Read configured support tickets."],
  ["ticketing_write", "Ticketing Write", "operations", "Modify configured support tickets with approval."],
  ["sms_send", "SMS Send", "communication", "Send SMS through a configured provider with approval."],
  ["video_generate", "Video Generation", "media", "Generate video through a configured provider."],
  ["repository_search", "Repository Search", "developer", "Search connected source repositories."],
].map(([id, name, category, description]) =>
  Object.freeze({
    id,
    name,
    category,
    description,
    availability: "integration_required" as const,
    sideEffect:
      /send|write|sign|submit|deploy|form|edit|generate/.test(id)
        ? ("write" as const)
        : ("read" as const),
    requiresConfirmation: /send|write|sign|submit|deploy|form/.test(id),
    parameters: objectSchema({}),
  })
));

export const HOPE_TOOL_CATALOG: readonly HopeToolDescriptor[] = Object.freeze([
  ...EXECUTABLE_TOOLS,
  ...INTEGRATION_REQUIRED,
]);

const BY_ID = new Map(HOPE_TOOL_CATALOG.map(tool => [tool.id, tool] as const));

export const EXECUTABLE_HOPE_TOOLS = Object.freeze(
  HOPE_TOOL_CATALOG.filter(tool => tool.availability === "executable")
);

export function getHopeTool(id: string): HopeToolDescriptor {
  const tool = BY_ID.get(id);
  if (!tool) throw new Error("unknown HopeAI tool");
  return tool;
}

export function toLLMTools() {
  return EXECUTABLE_HOPE_TOOLS.map(tool => ({
    type: "function" as const,
    function: {
      name: tool.id,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

function requireString(args: Args, key: string, max = 20_000): string {
  const value = args[key];
  if (typeof value !== "string" || value.length > max) {
    throw new Error(`${key} must be a string no longer than ${max} characters`);
  }
  return value;
}

function requireNumber(args: Args, key: string): number {
  const value = args[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${key} must be a finite number`);
  }
  return value;
}

function requireStringArray(args: Args, key: string, max = 50): string[] {
  const value = args[key];
  if (
    !Array.isArray(value) ||
    value.length > max ||
    !value.every(item => typeof item === "string" && item.length <= 120)
  ) {
    throw new Error(`${key} must be an array of at most ${max} short strings`);
  }
  return value;
}

function parseJson(value: string): unknown {
  return JSON.parse(value);
}

function parseObject(value: string): Record<string, unknown> {
  const parsed = parseJson(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON value must be an object");
  }
  return parsed as Record<string, unknown>;
}

function round(value: number): number {
  return Number(value.toPrecision(12));
}

function execute(toolId: string, args: Args): unknown {
  switch (toolId) {
    case "math_operation": {
      const a = requireNumber(args, "a");
      const b = requireNumber(args, "b");
      const operation = requireString(args, "operation", 20);
      const value =
        operation === "add"
          ? a + b
          : operation === "subtract"
            ? a - b
            : operation === "multiply"
              ? a * b
              : operation === "divide"
                ? b === 0
                  ? (() => {
                      throw new Error("division by zero");
                    })()
                  : a / b
                : operation === "power"
                  ? a ** b
                  : operation === "modulo"
                    ? b === 0
                      ? (() => {
                          throw new Error("modulo by zero");
                        })()
                      : a % b
                    : (() => {
                        throw new Error("unsupported math operation");
                      })();
      if (!Number.isFinite(value)) throw new Error("math result is not finite");
      return { value: round(value) };
    }
    case "percent_change": {
      const oldValue = requireNumber(args, "oldValue");
      const newValue = requireNumber(args, "newValue");
      if (oldValue === 0) throw new Error("oldValue cannot be zero");
      return { percentChange: round(((newValue - oldValue) / Math.abs(oldValue)) * 100) };
    }
    case "unit_convert_length": {
      const value = requireNumber(args, "value");
      const from = requireString(args, "from", 3);
      const to = requireString(args, "to", 3);
      const meters: Record<string, number> = {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344,
      };
      if (!(from in meters) || !(to in meters)) throw new Error("unsupported length unit");
      return { value: round((value * meters[from]) / meters[to]), unit: to };
    }
    case "temperature_convert": {
      const value = requireNumber(args, "value");
      const from = requireString(args, "from", 1);
      const to = requireString(args, "to", 1);
      if (!["C", "F", "K"].includes(from) || !["C", "F", "K"].includes(to)) {
        throw new Error("unsupported temperature unit");
      }
      const celsius =
        from === "C" ? value : from === "F" ? ((value - 32) * 5) / 9 : value - 273.15;
      const result =
        to === "C" ? celsius : to === "F" ? (celsius * 9) / 5 + 32 : celsius + 273.15;
      if (to === "K" && result < 0) throw new Error("temperature is below absolute zero");
      return { value: round(result), unit: to };
    }
    case "text_stats": {
      const text = requireString(args, "text");
      const lines = text.split(/\r?\n/);
      return {
        characters: text.length,
        charactersWithoutWhitespace: text.replace(/\s/g, "").length,
        words: (text.match(/\b[\p{L}\p{N}_'-]+\b/gu) ?? []).length,
        lines: lines.length,
        nonEmptyLines: lines.filter(line => line.trim()).length,
      };
    }
    case "word_frequency": {
      const text = requireString(args, "text");
      const rawLimit = args.limit;
      const limit =
        typeof rawLimit === "number" && Number.isInteger(rawLimit)
          ? Math.min(50, Math.max(1, rawLimit))
          : 10;
      const counts = new Map<string, number>();
      for (const word of text.toLowerCase().match(/[\p{L}\p{N}_'-]+/gu) ?? []) {
        counts.set(word, (counts.get(word) ?? 0) + 1);
      }
      return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, limit)
        .map(([word, count]) => ({ word, count }));
    }
    case "extract_urls": {
      const text = requireString(args, "text");
      return [...new Set(text.match(/https?:\/\/[^\s<>"')\]]+/g) ?? [])];
    }
    case "extract_emails": {
      const text = requireString(args, "text");
      return [
        ...new Set(
          text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []
        ),
      ];
    }
    case "sort_lines": {
      const lines = requireString(args, "text").split(/\r?\n/);
      const direction = args.direction === "desc" ? "desc" : "asc";
      lines.sort((a, b) => a.localeCompare(b));
      if (direction === "desc") lines.reverse();
      return { text: lines.join("\n") };
    }
    case "dedupe_lines": {
      const lines = requireString(args, "text").split(/\r?\n/);
      return { text: [...new Set(lines)].join("\n") };
    }
    case "text_case": {
      const text = requireString(args, "text");
      const mode = requireString(args, "mode", 20);
      if (mode === "upper") return { text: text.toUpperCase() };
      if (mode === "lower") return { text: text.toLowerCase() };
      if (mode === "title") {
        return {
          text: text.toLowerCase().replace(/\b\p{L}/gu, value => value.toUpperCase()),
        };
      }
      if (mode === "sentence") {
        const lower = text.toLowerCase();
        return { text: lower.replace(/(^|[.!?]\s+)\p{L}/gu, value => value.toUpperCase()) };
      }
      throw new Error("unsupported text case");
    }
    case "slugify":
      return {
        text: requireString(args, "text", 4_000)
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 200),
      };
    case "markdown_outline": {
      const headings = requireString(args, "text")
        .split(/\r?\n/)
        .map((line, index) => {
          const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
          return match
            ? { line: index + 1, level: match[1].length, title: match[2].trim() }
            : null;
        })
        .filter(Boolean);
      return headings;
    }
    case "checklist_from_text": {
      const items = requireString(args, "text")
        .split(/\r?\n/)
        .map(line => line.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+|\[[ xX]\]\s*)/, "").trim())
        .filter(Boolean)
        .slice(0, 200);
      return items.map((item, index) => ({ index: index + 1, item, checked: false }));
    }
    case "json_validate": {
      try {
        const parsed = parseJson(requireString(args, "json"));
        return { valid: true, type: Array.isArray(parsed) ? "array" : typeof parsed };
      } catch (error) {
        return {
          valid: false,
          error: error instanceof Error ? error.message : "invalid JSON",
        };
      }
    }
    case "json_format":
      return { json: JSON.stringify(parseJson(requireString(args, "json")), null, 2) };
    case "json_keys":
      return { keys: Object.keys(parseObject(requireString(args, "json"))).sort() };
    case "json_pick": {
      const object = parseObject(requireString(args, "json"));
      const keys = requireStringArray(args, "keys");
      return Object.fromEntries(keys.filter(key => key in object).map(key => [key, object[key]]));
    }
    case "csv_profile": {
      const rows = requireString(args, "csv")
        .split(/\r?\n/)
        .filter(line => line.length > 0)
        .slice(0, 5_001)
        .map(line => line.split(",").map(cell => cell.trim()));
      if (!rows.length) return { rows: 0, columns: 0, headers: [], missingCells: 0 };
      const headers = rows[0];
      const data = rows.slice(1);
      const width = Math.max(...rows.map(row => row.length));
      let missingCells = 0;
      for (const row of data) {
        for (let index = 0; index < width; index++) {
          if (!row[index]) missingCells += 1;
        }
      }
      return { rows: data.length, columns: width, headers, missingCells };
    }
    case "number_stats": {
      const values = args.values;
      if (
        !Array.isArray(values) ||
        values.length < 1 ||
        values.length > 5_000 ||
        !values.every(value => typeof value === "number" && Number.isFinite(value))
      ) {
        throw new Error("values must contain 1-5000 finite numbers");
      }
      const nums = values as number[];
      const sorted = [...nums].sort((a, b) => a - b);
      const sum = nums.reduce((total, value) => total + value, 0);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2
          ? sorted[mid]
          : (sorted[mid - 1] + sorted[mid]) / 2;
      return {
        count: nums.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        sum: round(sum),
        mean: round(sum / nums.length),
        median: round(median),
      };
    }
    case "date_diff_days": {
      const start = Date.parse(requireString(args, "start", 100));
      const end = Date.parse(requireString(args, "end", 100));
      if (Number.isNaN(start) || Number.isNaN(end)) throw new Error("invalid date");
      return { days: round((end - start) / 86_400_000) };
    }
    case "timestamp_to_iso": {
      const timestamp = requireNumber(args, "timestamp");
      const ms = Math.abs(timestamp) < 10_000_000_000 ? timestamp * 1000 : timestamp;
      const date = new Date(ms);
      if (Number.isNaN(date.getTime())) throw new Error("invalid timestamp");
      return { iso: date.toISOString() };
    }
    case "url_parse": {
      const url = new URL(requireString(args, "url", 4_000));
      return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        usernamePresent: Boolean(url.username),
        passwordPresent: Boolean(url.password),
      };
    }
    case "querystring_parse":
      return {
        entries: [...new URLSearchParams(requireString(args, "query", 8_000).replace(/^\?/, "")).entries()],
      };
    case "regex_test": {
      const pattern = requireString(args, "pattern", 500);
      const flags = typeof args.flags === "string" ? args.flags.slice(0, 8) : "";
      if (!/^[dgimsuvy]*$/.test(flags)) throw new Error("unsupported regex flags");
      const regex = new RegExp(pattern, flags);
      const text = requireString(args, "text");
      const match = regex.exec(text);
      return {
        matched: Boolean(match),
        match: match?.[0] ?? null,
        index: match?.index ?? null,
        groups: match ? match.slice(1, 21) : [],
      };
    }
    case "sha256":
      return {
        hex: createHash("sha256").update(requireString(args, "text"), "utf8").digest("hex"),
      };
    case "base64_encode":
      return { value: Buffer.from(requireString(args, "text"), "utf8").toString("base64") };
    case "base64_decode": {
      const value = requireString(args, "value");
      const buffer = Buffer.from(value, "base64");
      const text = buffer.toString("utf8");
      if (text.length > 20_000) throw new Error("decoded text is too large");
      return { text };
    }
    case "uuid_v4":
      return { uuid: randomUUID() };
    case "html_escape":
      return {
        text: requireString(args, "text")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;"),
      };
    case "line_diff": {
      const before = requireString(args, "before").split(/\r?\n/);
      const after = requireString(args, "after").split(/\r?\n/);
      const max = Math.min(Math.max(before.length, after.length), 2_000);
      const changes = [];
      for (let index = 0; index < max; index++) {
        if (before[index] !== after[index]) {
          changes.push({
            line: index + 1,
            before: before[index] ?? null,
            after: after[index] ?? null,
          });
        }
      }
      return { changedLines: changes.length, changes: changes.slice(0, 200) };
    }
    case "code_imports": {
      const code = requireString(args, "code");
      return {
        imports: code
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line =>
            /^(?:import\s|export\s+.*\sfrom\s|const\s+.*=\s*require\(|from\s+\S+\s+import\s)/.test(line)
          )
          .slice(0, 200),
      };
    }
    case "todo_extract": {
      const matches = [];
      for (const [index, line] of requireString(args, "text").split(/\r?\n/).entries()) {
        if (/\b(?:TODO|FIXME|XXX)\b/i.test(line)) {
          matches.push({ line: index + 1, text: line.trim().slice(0, 500) });
        }
      }
      return matches.slice(0, 500);
    }
    case "password_strength": {
      const password = requireString(args, "password", 512);
      const checks = {
        length12: password.length >= 12,
        length16: password.length >= 16,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
        repeatedSequence: /(.)\1{2,}/.test(password),
      };
      const score = Math.max(
        0,
        [checks.length12, checks.length16, checks.lowercase, checks.uppercase, checks.number, checks.symbol].filter(Boolean).length -
          (checks.repeatedSequence ? 1 : 0)
      );
      return {
        score,
        rating: score >= 6 ? "strong" : score >= 4 ? "moderate" : "weak",
        checks,
        note: "Heuristic only; no password is stored by this tool.",
      };
    }
    case "jwt_decode_unverified": {
      const token = requireString(args, "token");
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("JWT must contain three segments");
      const decode = (value: string) => {
        const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
        return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
      };
      return {
        header: decode(parts[0]),
        payload: decode(parts[1]),
        verified: false,
        warning: "Signature has not been verified.",
      };
    }
    case "text_replace": {
      const text = requireString(args, "text");
      const find = requireString(args, "find", 2_000);
      const replacement = requireString(args, "replace", 2_000);
      if (!find) throw new Error("find cannot be empty");
      return { text: text.split(find).join(replacement) };
    }
    case "text_excerpt": {
      const text = requireString(args, "text");
      const raw = args.maxChars;
      const maxChars =
        typeof raw === "number" && Number.isInteger(raw)
          ? Math.min(8_000, Math.max(1, raw))
          : 1_000;
      return { text: text.slice(0, maxChars), truncated: text.length > maxChars };
    }
    case "contract_clause_checklist": {
      const text = requireString(args, "text").toLowerCase();
      const clauses: Array<[string, RegExp]> = [
        ["parties", /\b(parties|party)\b/],
        ["scope", /\b(scope|services|deliverables)\b/],
        ["payment", /\b(payment|fees|compensation|price)\b/],
        ["term", /\b(term|duration|effective date)\b/],
        ["termination", /\btermination|terminate\b/],
        ["confidentiality", /\bconfidential|non-disclosure|nda\b/],
        ["intellectual_property", /\bintellectual property|copyright|patent|trademark|ownership\b/],
        ["warranties", /\bwarrant(?:y|ies)|representation\b/],
        ["liability", /\bliability|limitation of liability\b/],
        ["indemnity", /\bindemn(?:ity|ify|ification)\b/],
        ["governing_law", /\bgoverning law|jurisdiction\b/],
        ["disputes", /\barbitration|mediation|dispute resolution|venue\b/],
        ["force_majeure", /\bforce majeure\b/],
        ["assignment", /\bassignment|assign\b/],
        ["notices", /\bnotices?\b/],
      ];
      const results = clauses.map(([clause, pattern]) => ({
        clause,
        present: pattern.test(text),
      }));
      return {
        results,
        missing: results.filter(item => !item.present).map(item => item.clause),
        warning: "Keyword checklist only; presence or absence does not establish legal adequacy.",
      };
    }
    case "legal_heading_outline": {
      const headings = requireString(args, "text")
        .split(/\r?\n/)
        .map((line, index) => {
          const value = line.trim();
          const likely =
            /^\d+(?:\.\d+)*[.)]?\s+[A-Z]/.test(value) ||
            /^[A-Z][A-Z\s&/-]{4,80}$/.test(value);
          return likely ? { line: index + 1, heading: value.slice(0, 200) } : null;
        })
        .filter(Boolean)
        .slice(0, 200);
      return headings;
    }
    default:
      throw new Error("tool is not executable");
  }
}

export async function executeHopeTool(
  toolId: string,
  args: Args
): Promise<HopeToolExecution> {
  const descriptor = getHopeTool(toolId);
  if (descriptor.availability !== "executable") {
    throw new Error(
      `${descriptor.name} requires a configured external integration and is not executable in this runtime`
    );
  }

  if (!args || typeof args !== "object" || Array.isArray(args)) {
    throw new Error("tool arguments must be an object");
  }

  return Object.freeze({
    toolId,
    output: execute(toolId, args),
  });
}

export const EXECUTABLE_HOPE_TOOL_COUNT = EXECUTABLE_HOPE_TOOLS.length;
export const HOPE_TOOL_CATALOG_COUNT = HOPE_TOOL_CATALOG.length;
