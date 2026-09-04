export function formatJsonSource(source: string, indent: 2 | 4 = 2): string {
  const parsed = JSON.parse(source);
  return JSON.stringify(parsed, null, indent);
}

export function normalizePlainText(source: string): string {
  return source
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(line => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type ContentPlanItem = {
  id: string;
  title: string;
  channel: string;
  date: string;
  status: "idea" | "draft" | "ready";
};

export function validateContentPlanItem(item: Omit<ContentPlanItem, "id">): string[] {
  const errors: string[] = [];
  if (item.title.trim().length < 2) errors.push("Title must be at least 2 characters");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) errors.push("Date must use YYYY-MM-DD");
  if (item.channel.trim().length < 2) errors.push("Channel must be at least 2 characters");
  return errors;
}

export function sortContentPlanItems(items: ContentPlanItem[]): ContentPlanItem[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

export type LocalContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  note: string;
};

export function validateLocalContact(contact: Omit<LocalContact, "id">): string[] {
  const errors: string[] = [];
  if (contact.name.trim().length < 2) errors.push("Name must be at least 2 characters");
  if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
    errors.push("Email is invalid");
  }
  if (contact.phone.trim().length > 40) errors.push("Phone is too long");
  if (contact.note.trim().length > 300) errors.push("Note is too long");
  return errors;
}

export function toggleSelection(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value];
}

export function confirmationMatches(input: string, phrase: string): boolean {
  return input.trim() === phrase;
}
