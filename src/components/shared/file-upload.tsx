"use client";

import { useRef } from "react";
import { Upload, X, File, CheckCircle, Loader2 } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { useUpload, useDropzone, type UploadResult } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  folder?: "avatars" | "documents" | "attachments";
  accept?: string[];
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  onUpload?: (result: UploadResult) => void;
  className?: string;
}

export function FileUpload({
  folder = "attachments",
  accept = ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  maxSizeMB = 10,
  label = "Upload file",
  hint,
  onUpload,
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload, isUploading, progress } = useUpload({
    folder,
    accept,
    maxSizeMB,
    onSuccess: onUpload,
  });

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDropzone({
    folder,
    onDrop: (files) => {
      if (files[0]) upload(files[0]);
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  }

  const acceptStr = accept.join(",");
  const defaultHint = hint ?? `Max ${maxSizeMB}MB · ${accept.map((t) => t.split("/")[1]).join(", ").toUpperCase()}`;

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer",
          "px-6 py-10 text-center",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptStr}
          onChange={handleFileChange}
          className="sr-only"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-foreground">Uploading…</p>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isDragging ? "Drop to upload" : "Drag & drop or click to browse"}
            </p>
            {defaultHint && (
              <p className="mt-2 text-xs text-muted-foreground/70">{defaultHint}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Compact inline file picker (no drop zone)
interface InlineFilePickerProps {
  label?: string;
  accept?: string[];
  maxSizeMB?: number;
  folder?: "avatars" | "documents" | "attachments";
  onUpload?: (result: UploadResult) => void;
  currentUrl?: string | null;
  onClear?: () => void;
}

export function InlineFilePicker({
  label = "Upload",
  accept = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 5,
  folder = "avatars",
  onUpload,
  currentUrl,
  onClear,
}: InlineFilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useUpload({ folder, accept, maxSizeMB, onSuccess: onUpload });

  return (
    <div className="flex items-center gap-3">
      {currentUrl ? (
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-border bg-muted shrink-0">
          <img src={currentUrl} alt="Upload preview" className="w-full h-full object-cover" />
          {onClear && (
            <button
              onClick={onClear}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-full"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      ) : (
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center shrink-0">
          <File className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(",")}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? "Uploading…" : label}
        </Button>
        <p className="mt-1 text-xs text-muted-foreground">
          Max {maxSizeMB}MB
        </p>
      </div>
    </div>
  );
}
