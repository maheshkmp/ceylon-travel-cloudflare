"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, AlertCircle, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export function VideoUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Video",
  className,
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [hasLoadError, setHasLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4, WEBM, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Max size 50MB
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum video size allowed is 50MB.",
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
        description: "Video uploaded and saved successfully.",
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
  
  const isYouTube = displayUrl?.includes("youtube.com") || displayUrl?.includes("youtu.be");
  
  // Helper to extract youtube ID and build embed URL
  const getYoutubeEmbed = (url: string) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v") || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3` : url;
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onSelectFile}
        accept="video/*"
        className="hidden"
        disabled={isUploading}
      />

      {displayUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-border group bg-muted/30 flex flex-col justify-center items-center">
          {hasLoadError && !localPreview ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-destructive/5 text-destructive gap-2">
              <AlertCircle className="w-8 h-8" />
              <p className="text-xs font-semibold">Video Preview Unavailable</p>
              <p className="text-[10px] text-muted-foreground max-w-[240px]">
                The provided URL cannot be previewed. Make sure it's a direct link to a video file (.mp4, .webm) or a valid YouTube link.
              </p>
            </div>
          ) : isYouTube ? (
             <iframe
               src={getYoutubeEmbed(displayUrl)}
               className="w-full h-full object-cover"
               style={{ border: "none" }}
               allow="autoplay; muted"
               onError={() => setHasLoadError(true)}
             />
          ) : (
            <video
              src={displayUrl}
              autoPlay
              muted
              loop
              playsInline
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
              <p className="text-sm font-medium text-foreground">Uploading video...</p>
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
                Drag & drop or click to browse (Max 50MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
