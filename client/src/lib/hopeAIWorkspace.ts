export type HopeWorkspaceRole = "user" | "assistant";

export type HopeWorkspaceAttachment = {
  id: string;
  name: string;
  size: number;
  text: string;
};

export type HopeWorkspaceMessage = {
  id: string;
  role: HopeWorkspaceRole;
  content: string;
  createdAt: number;
  model?: string;
  attachmentNames?: string[];
  attachmentContext?: string;
};

export type HopeWorkspaceArtifact = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  sourceMessageId: string;
};

export type HopeWorkspaceThread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: HopeWorkspaceMessage[];
  artifacts: HopeWorkspaceArtifact[];
};

const MAX_THREAD_COUNT = 30;
const MAX_MESSAGE_COUNT = 100;
const MAX_ATTACHMENT_CHARS = 8_000;

const id = (prefix: string, now: number) =>
  prefix + "-" + now.toString(36) + "-" + Math.random().toString(36).slice(2, 8);

export const createHopeWorkspaceThread = (
  now = Date.now()
): HopeWorkspaceThread => ({
  id: id("thread", now),
  title: "New conversation",
  createdAt: now,
  updatedAt: now,
  messages: [],
  artifacts: [],
});

export const titleHopeWorkspaceThread = (text: string): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "New conversation";
  return normalized.length > 48
    ? normalized.slice(0, 47).trimEnd() + "…"
    : normalized;
};

export const createHopeWorkspaceMessage = ({
  role,
  content,
  now = Date.now(),
  model,
  attachments = [],
}: {
  role: HopeWorkspaceRole;
  content: string;
  now?: number;
  model?: string;
  attachments?: HopeWorkspaceAttachment[];
}): HopeWorkspaceMessage => ({
  id: id("message", now),
  role,
  content: content.trim(),
  createdAt: now,
  ...(model ? { model } : {}),
  ...(attachments.length
    ? {
        attachmentNames: attachments.map(attachment => attachment.name),
        attachmentContext: formatHopeAttachmentContext(attachments),
      }
    : {}),
});

export const formatHopeAttachmentContext = (
  attachments: HopeWorkspaceAttachment[]
): string =>
  attachments
    .map(attachment => {
      const safeName = attachment.name.replace(/[\r\n]/g, " ").slice(0, 120);
      const body = attachment.text.slice(0, MAX_ATTACHMENT_CHARS);
      return "FILE: " + safeName + "\n" + body;
    })
    .join("\n\n");

const providerContent = (message: HopeWorkspaceMessage): string =>
  message.attachmentContext
    ? message.content + "\n\nAttached local text context:\n" + message.attachmentContext
    : message.content;

export const buildHopeProviderHistory = (
  messages: HopeWorkspaceMessage[],
  limit = 12
): Array<{ role: HopeWorkspaceRole; content: string }> =>
  messages
    .filter(message => message.content.trim().length > 0)
    .slice(-Math.max(1, Math.min(limit, 12)))
    .map(message => ({
      role: message.role,
      content: providerContent(message).slice(0, 8_000),
    }));

export const pinHopeWorkspaceArtifact = (
  thread: HopeWorkspaceThread,
  message: HopeWorkspaceMessage,
  now = Date.now()
): HopeWorkspaceThread => {
  if (message.role !== "assistant") return thread;
  if (thread.artifacts.some(artifact => artifact.sourceMessageId === message.id)) {
    return thread;
  }

  const firstLine =
    message.content
      .split("\n")
      .map(line => line.trim())
      .find(Boolean) || "Pinned HopeAI output";

  const artifact: HopeWorkspaceArtifact = {
    id: id("artifact", now),
    title: titleHopeWorkspaceThread(firstLine),
    content: message.content,
    createdAt: now,
    sourceMessageId: message.id,
  };

  return {
    ...thread,
    updatedAt: now,
    artifacts: [artifact, ...thread.artifacts].slice(0, 20),
  };
};

export const normalizeHopeWorkspaceThreads = (
  value: unknown
): HopeWorkspaceThread[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      thread =>
        thread &&
        typeof thread === "object" &&
        typeof (thread as HopeWorkspaceThread).id === "string" &&
        typeof (thread as HopeWorkspaceThread).title === "string" &&
        Array.isArray((thread as HopeWorkspaceThread).messages)
    )
    .slice(0, MAX_THREAD_COUNT)
    .map(raw => {
      const thread = raw as HopeWorkspaceThread;
      const messages = thread.messages
        .filter(
          message =>
            message &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string" &&
            typeof message.id === "string"
        )
        .slice(-MAX_MESSAGE_COUNT);

      const artifacts = Array.isArray(thread.artifacts)
        ? thread.artifacts
            .filter(
              artifact =>
                artifact &&
                typeof artifact.id === "string" &&
                typeof artifact.content === "string" &&
                typeof artifact.sourceMessageId === "string"
            )
            .slice(0, 20)
        : [];

      return {
        id: thread.id,
        title: thread.title.slice(0, 80),
        createdAt:
          typeof thread.createdAt === "number" ? thread.createdAt : Date.now(),
        updatedAt:
          typeof thread.updatedAt === "number" ? thread.updatedAt : Date.now(),
        messages,
        artifacts,
      };
    });
};

export const exportHopeWorkspaceThread = (
  thread: HopeWorkspaceThread
): string => {
  const lines = [
    "# " + thread.title,
    "",
    "Exported from HopeAI Workspace",
    "",
  ];

  for (const message of thread.messages) {
    lines.push("## " + (message.role === "user" ? "You" : "HopeAI"));
    if (message.attachmentNames?.length) {
      lines.push("Attachments: " + message.attachmentNames.join(", "));
    }
    lines.push(message.content, "");
  }

  if (thread.artifacts.length) {
    lines.push("# Pinned outputs", "");
    for (const artifact of thread.artifacts) {
      lines.push("## " + artifact.title, artifact.content, "");
    }
  }

  return lines.join("\n").trim() + "\n";
};
