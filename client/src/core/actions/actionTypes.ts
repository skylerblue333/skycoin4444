export const ACTION_TYPES = {
  PAYMENT: "payment",
  TIP: "tip",
  REQUEST_SERVICE: "request_service",
  CREATE_LISTING: "create_listing",
  MATCH_USER: "match_user",
  CALL_AI_AGENT: "call_ai_agent",
  SCHEDULE_EVENT: "schedule_event",
} as const;

export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];
