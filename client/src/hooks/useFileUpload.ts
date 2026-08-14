import { useCallback, useState } from "react";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const supportedContentTypes = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type UploadResult = {
  key: string;
  url: string;
};

type UploadErrorResponse = {
  error?: string;
};

function isUploadResult(value: unknown): value is UploadResult {
  return Boolean(
    value &&
    typeof value === "object" &&
    "key" in value &&
    "url" in value &&
    typeof value.key === "string" &&
    typeof value.url === "string"
  );
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    if (!supportedContentTypes.has(file.type)) {
      throw new Error("Only PNG, JPEG, GIF, and WebP images can be uploaded.");
    }
    if (file.size === 0) {
      throw new Error("The selected image is empty.");
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error("Images must be 5 MB or smaller.");
    }

    setUploading(true);
    try {
      const response = await fetch("/api/uploads/images", {
        method: "POST",
        body: file,
        credentials: "include",
        headers: {
          "Content-Type": file.type,
        },
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const error = payload as UploadErrorResponse | null;
        throw new Error(error?.error ?? "Image upload failed.");
      }
      if (!isUploadResult(payload)) {
        throw new Error("The upload service returned an invalid response.");
      }
      return payload;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading };
}
