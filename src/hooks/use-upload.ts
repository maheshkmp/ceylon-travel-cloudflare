"use client";

import { useState, useCallback } from "react";

import { useToast } from "@/hooks/use-toast";
import { formatBytes } from "@/lib/utils";

interface UseUploadOptions {
  folder?: "avatars" | "documents" | "attachments";
  maxSizeMB?: number;
  accept?: string[];
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

export interface UploadResult {
  key: string;
  publicUrl: string;
}

interface PresignResponse {
  key: string;
  uploadUrl: string;
  publicUrl: string;
  expiresAt: number;
}

export function useUpload(options: UseUploadOptions = {}) {
  const {
    folder = "attachments",
    maxSizeMB = 10,
    accept,
    onSuccess,
    onError,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const upload = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      // Validate file size
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        const err = new Error(`File too large. Max size is ${formatBytes(maxBytes)}`);
        toast({ title: "Upload failed", description: err.message, variant: "destructive" });
        onError?.(err);
        return null;
      }

      // Validate file type
      if (accept && !accept.includes(file.type)) {
        const err = new Error(`File type not allowed. Accepted: ${accept.join(", ")}`);
        toast({ title: "Upload failed", description: err.message, variant: "destructive" });
        onError?.(err);
        return null;
      }

      setIsUploading(true);
      setProgress(0);

      try {
        const res = await fetch("/api/v1/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type,
            folder,
            sizeBytes: file.size,
          }),
        });
        if (!res.ok) throw new Error("Failed to get presigned URL");
        const presignRes = await res.json();

        const { key, uploadUrl, publicUrl } = presignRes as PresignResponse;
        setProgress(20);

        // 2. Upload directly to S3/R2 using presigned URL
        await uploadToStorage(uploadUrl, file, (pct) => {
          setProgress(20 + pct * 0.8);
        });

        setProgress(100);
        const result: UploadResult = { key, publicUrl };
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        onError?.(error);
        return null;
      } finally {
        setIsUploading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [folder, maxSizeMB, accept, onSuccess, onError, toast]
  );

  return { upload, isUploading, progress };
}

// XHR-based upload to track progress
function uploadToStorage(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(e.loaded / e.total);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

// Drag-and-drop helpers
export function useDropzone(options: UseUploadOptions & { onDrop: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) options.onDrop(files);
    },
    [options]
  );

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}
