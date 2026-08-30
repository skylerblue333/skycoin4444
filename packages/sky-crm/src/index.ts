export type ContactStatus = 'lead' | 'active' | 'inactive';

export type Contact = Readonly<{
  id: string;
  name: string;
  email?: string;
  status: ContactStatus;
  tags: readonly string[];
  version: number;
}>;

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function normalizeTags(tags: readonly string[]): readonly string[] {
  const normalized = tags.map((tag) => clean(tag, 'tag').toLocaleLowerCase('en-US'));
  if (new Set(normalized).size !== normalized.length) throw new Error('duplicate tag');
  return Object.freeze([...normalized].sort());
}

export function createContact(input: Omit<Contact, 'version'>): Contact {
  const email = input.email?.trim().toLocaleLowerCase('en-US');
  if (input.email !== undefined && !email) throw new Error('email is required when provided');
  return Object.freeze({
    id: clean(input.id, 'id'),
    name: clean(input.name, 'name'),
    email,
    status: input.status,
    tags: normalizeTags(input.tags),
    version: 1,
  });
}

export function updateContact(contact: Contact, patch: Partial<Pick<Contact, 'name' | 'email' | 'status' | 'tags'>>): Contact {
  const nextEmail = patch.email === undefined ? contact.email : patch.email.trim().toLocaleLowerCase('en-US');
  if (patch.email !== undefined && !nextEmail) throw new Error('email is required when provided');
  return Object.freeze({
    ...contact,
    name: patch.name === undefined ? contact.name : clean(patch.name, 'name'),
    email: nextEmail,
    status: patch.status ?? contact.status,
    tags: patch.tags === undefined ? contact.tags : normalizeTags(patch.tags),
    version: contact.version + 1,
  });
}

export function findContacts(contacts: readonly Contact[], query: string): readonly Contact[] {
  const needle = clean(query, 'query').toLocaleLowerCase('en-US');
  return Object.freeze(
    contacts
      .filter((contact) => `${contact.id}\n${contact.name}\n${contact.email ?? ''}\n${contact.tags.join(' ')}`.toLocaleLowerCase('en-US').includes(needle))
      .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
}

export const CRM_CONTACT_CHANGED_EVENT = 'sky.crm.contact.changed.v1' as const;
