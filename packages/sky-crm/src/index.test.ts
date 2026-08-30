import { describe, expect, it } from 'vitest';
import { createContact, findContacts, updateContact } from './index';

describe('SkyCRM', () => {
  it('normalizes contacts', () => {
    expect(createContact({ id: ' c1 ', name: ' Alice ', email: ' ALICE@EXAMPLE.COM ', status: 'lead', tags: ['VIP', 'Sales'] })).toEqual({
      id: 'c1', name: 'Alice', email: 'alice@example.com', status: 'lead', tags: ['sales', 'vip'], version: 1,
    });
  });

  it('increments versions on updates', () => {
    const contact = createContact({ id: 'c1', name: 'Alice', status: 'lead', tags: [] });
    expect(updateContact(contact, { status: 'active', tags: ['Customer'] })).toMatchObject({ status: 'active', tags: ['customer'], version: 2 });
  });

  it('searches deterministically', () => {
    const a = createContact({ id: 'z', name: 'Wallet User', status: 'active', tags: ['wallet'] });
    const b = createContact({ id: 'ä', name: 'Wallet Partner', status: 'lead', tags: ['wallet'] });
    expect(findContacts([b, a], 'wallet').map((contact) => contact.id)).toEqual(['z', 'ä']);
  });

  it('rejects invalid optional email and duplicate tags', () => {
    expect(() => createContact({ id: 'c', name: 'Name', email: ' ', status: 'lead', tags: [] })).toThrow('email is required when provided');
    expect(() => createContact({ id: 'c', name: 'Name', status: 'lead', tags: ['VIP', ' vip '] })).toThrow('duplicate tag');
  });
});
