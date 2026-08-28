export type SupportPriority = 'low' | 'normal' | 'high' | 'urgent';
export type SupportStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicketInput {
  ticketId: string;
  requesterId: string;
  subject: string;
  body: string;
  priority?: SupportPriority;
}

export interface SupportTicket {
  ticketId: string;
  requesterId: string;
  subject: string;
  body: string;
  priority: SupportPriority;
  status: SupportStatus;
  revision: number;
}

function bounded(value: string, field: string, max: number): string {
  const v = value.trim();
  if (!v || v.length > max) throw new Error(`invalid_${field}`);
  return v;
}

const priorities = new Set<SupportPriority>(['low', 'normal', 'high', 'urgent']);

function normalizePriority(value: unknown): SupportPriority {
  const priority = value ?? 'normal';
  if (typeof priority !== 'string' || !priorities.has(priority as SupportPriority)) {
    throw new Error('invalid_priority');
  }
  return priority as SupportPriority;
}

export function createSupportTicket(input: SupportTicketInput): SupportTicket {
  return {
    ticketId: bounded(input.ticketId, 'ticket_id', 120),
    requesterId: bounded(input.requesterId, 'requester_id', 120),
    subject: bounded(input.subject, 'subject', 180),
    body: bounded(input.body, 'body', 10_000),
    priority: normalizePriority(input.priority),
    status: 'open',
    revision: 1,
  };
}

const allowed: Record<SupportStatus, readonly SupportStatus[]> = {
  open: ['in_progress', 'resolved', 'closed'],
  in_progress: ['resolved', 'closed'],
  resolved: ['in_progress', 'closed'],
  closed: [],
};

export function transitionSupportTicket(ticket: SupportTicket, next: SupportStatus): SupportTicket {
  if (!allowed[ticket.status].includes(next)) throw new Error('invalid_support_transition');
  return { ...ticket, status: next, revision: ticket.revision + 1 };
}

export const SKY_SUPPORT_CONTRACT = {
  create: 'sky.support.ticket.create.v1',
  update: 'sky.support.ticket.update.v1',
  receipt: 'sky.support.ticket.v1',
  externalDelivery: false,
} as const;
