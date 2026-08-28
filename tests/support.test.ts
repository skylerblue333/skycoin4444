import { describe, expect, it } from 'vitest';
import { SKY_SUPPORT_CONTRACT, createSupportTicket, transitionSupportTicket } from '../server/features/support';

describe('SkySupport', () => {
  it('creates a normalized open ticket', () => {
    expect(createSupportTicket({
      ticketId: ' t-1 ', requesterId: ' u-1 ', subject: ' Help ', body: ' Need assistance ',
    })).toEqual({
      ticketId: 't-1', requesterId: 'u-1', subject: 'Help', body: 'Need assistance',
      priority: 'normal', status: 'open', revision: 1,
    });
  });

  it('rejects unsupported runtime priority values', () => {
    expect(() => createSupportTicket({
      ticketId: 't', requesterId: 'u', subject: 's', body: 'b', priority: 'critical' as never,
    })).toThrow('invalid_priority');
  });

  it('enforces deterministic lifecycle transitions', () => {
    const open = createSupportTicket({ ticketId: 't', requesterId: 'u', subject: 's', body: 'b' });
    const active = transitionSupportTicket(open, 'in_progress');
    const resolved = transitionSupportTicket(active, 'resolved');
    expect(resolved.status).toBe('resolved');
    expect(resolved.revision).toBe(3);
    expect(() => transitionSupportTicket(transitionSupportTicket(resolved, 'closed'), 'open')).toThrow('invalid_support_transition');
  });

  it('rejects empty and oversized values', () => {
    expect(() => createSupportTicket({ ticketId: '', requesterId: 'u', subject: 's', body: 'b' })).toThrow('invalid_ticket_id');
    expect(() => createSupportTicket({ ticketId: 't', requesterId: 'u', subject: 'x'.repeat(181), body: 'b' })).toThrow('invalid_subject');
  });

  it('publishes an internal no-delivery integration contract', () => {
    expect(SKY_SUPPORT_CONTRACT.create).toBe('sky.support.ticket.create.v1');
    expect(SKY_SUPPORT_CONTRACT.externalDelivery).toBe(false);
  });
});
