import { useCallback, useState } from "react";

export type UploadResult = { url: string; key?: string };

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (_file: File): Promise<UploadResult | null> => {
      setUploading(true);
      try {
        // The repository does not currently expose a generic authenticated upload
        // procedure. Do not create a fake URL; callers must show an unavailable
        // state until a server-side presigned upload contract is connected.
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return { upload, uploading };
}
