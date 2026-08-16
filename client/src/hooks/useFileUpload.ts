import { useCallback, useState } from "react";

export type FileUploadResult = {
  key: string;
  url: string;
};

/**
 * Uploads are intentionally unavailable until the application exposes a
 * verified authenticated storage endpoint. This boundary prevents callers
 * from fabricating an uploaded URL or a successful persistence result.
 */
export function useFileUpload() {
  const [uploading] = useState(false);

  const upload = useCallback(async (_file: File): Promise<FileUploadResult | null> => {
    throw new Error(
      "File upload is unavailable until an authenticated storage API is configured and verified.",
    );
  }, []);

  return { upload, uploading };
}
