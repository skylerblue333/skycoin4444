import { useCallback, useState } from "react";

export interface UploadedFile {
  key: string;
  url: string;
}

interface UploadResponse {
  key?: unknown;
  url?: unknown;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File): Promise<UploadedFile | null> => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files can be uploaded here");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Images must be 10 MB or smaller");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Image upload is unavailable until the server upload endpoint is configured"
            : `Image upload failed (${response.status})`,
        );
      }
      const body = (await response.json()) as UploadResponse;
      if (typeof body.key !== "string" || typeof body.url !== "string") {
        throw new Error("Upload service returned an invalid response");
      }
      return { key: body.key, url: body.url };
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading };
}
