export type NotificationChannel = "email" | "sms" | "push" | "in_app";

export type NotificationRequest = {
  id: string;
  recipientId: string;
  template: string;
  channels: NotificationChannel[];
  variables?: Record<string, string>;
};

export type NotificationPlan = {
  contract: "sky.notifications.plan.v1";
  id: string;
  recipientId: string;
  template: string;
  channels: NotificationChannel[];
  variables: Record<string, string>;
};

const CHANNELS: NotificationChannel[] = ["email", "sms", "push", "in_app"];

function requiredText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

export function planNotification(input: NotificationRequest): NotificationPlan {
  const id = requiredText(input.id, "id");
  const recipientId = requiredText(input.recipientId, "recipientId");
  const template = requiredText(input.template, "template");
  if (!Array.isArray(input.channels) || input.channels.length === 0) throw new Error("channels are required");

  const uniqueChannels = [...new Set(input.channels)];
  for (const channel of uniqueChannels) {
    if (!CHANNELS.includes(channel)) throw new Error(`unsupported channel: ${channel}`);
  }

  const variables = Object.fromEntries(
    Object.entries(input.variables ?? {})
      .map(([key, value]) => [requiredText(key, "variable key"), value] as const)
      .sort(([a], [b]) => a.localeCompare(b)),
  );

  return {
    contract: "sky.notifications.plan.v1",
    id,
    recipientId,
    template,
    channels: uniqueChannels.sort(),
    variables,
  };
}
