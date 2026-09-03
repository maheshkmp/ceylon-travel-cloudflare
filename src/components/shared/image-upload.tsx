"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [hasLoadError, setHasLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, WEBP, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Max size 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum image size allowed is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setHasLoadError(false);

    // Create a local object URL for instant preview
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress((e.loaded / e.total) * 100);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res.url);
            } catch (err) {
              reject(new Error("Invalid response from server"));
            }
          } else {
            try {
              const res = JSON.parse(xhr.responseText);
              reject(new Error(res.error || `Upload failed (${xhr.status})`));
            } catch {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      const url = await uploadPromise;
      onChange(url);
      toast({
        title: "Upload successful",
        description: "Image uploaded and saved successfully.",
      });
    } catch (err: any) {
      setLocalPreview(null);
      toast({
        title: "Upload failed",
        description: err.message || "Something went wrong during the upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUrl = localPreview || value;

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onSelectFile}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      {displayUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-border group bg-muted/30 flex flex-col justify-center items-center">
          {hasLoadError && !localPreview ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-destructive/5 text-destructive gap-2">
              <AlertCircle className="w-8 h-8" />
              <p className="text-xs font-semibold">Image Preview Unavailable</p>
              <p className="text-[10px] text-muted-foreground max-w-[240px]">
                File was uploaded successfully to R2, but the public URL is inaccessible. Please ensure the <strong>R2.dev subdomain</strong> is allowed or a <strong>Custom Domain</strong> is linked in your Cloudflare dashboard.
              </p>
            </div>
          ) : (
            <img
              src={displayUrl}
              alt="Uploaded preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setHasLoadError(true)}
            />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="shadow-sm"
            >
              Replace
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  setLocalPreview(null);
                  setHasLoadError(false);
                  onRemove();
                }}
                disabled={isUploading}
                className="h-9 w-9 shadow-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            isUploading && "pointer-events-none opacity-70"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-foreground">Uploading image...</p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">
                Drag & drop or click to browse (Max 5MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
