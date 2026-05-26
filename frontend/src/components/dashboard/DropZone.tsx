import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
}

export function DropZone({ onFileUpload, isUploading }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) onFileUpload(files[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) onFileUpload(files[0]);

    e.target.value = "";
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed",
        "bg-card/30 backdrop-blur-sm cursor-pointer transition-all duration-300",
        "p-10 md:p-12 min-h-60",
        isDragging
          ? "border-foreground/40 bg-foreground/5 shadow-2xl shadow-black/20"
          : "border-border/60 hover:border-foreground/20 hover:bg-card/50 shadow-sm hover:shadow-xl",
        isUploading && "pointer-events-none opacity-60"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="sr-only"
        onChange={handleChange}
        aria-label="Upload CV file"
      />

      <div className={cn(
        "w-20 h-20 rounded-lg border border-border flex items-center justify-center transition-all duration-300",
        isDragging ? "bg-foreground text-background rotate-12" : "bg-muted text-foreground"
      )}>
        <span className="material-symbols-outlined text-4xl">
          {isDragging ? "download" : "cloud_upload"}
        </span>
      </div>

      <div className="text-center space-y-3">
        <div className="space-y-1">
          <p className="text-lg font-bold text-foreground tracking-tight font-(family-name:--font-family-heading)">
            {isDragging ? "Lepaskan CV di sini" : "Unggah CV Anda"}
          </p>
          <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
            {isDragging
              ? "Lepaskan untuk memulai proses penguraian"
              : "Seret dan lepas file Anda di sini atau klik untuk mencari file di komputer Anda"}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {['PDF', 'DOCX'].map(ext => (
            <span key={ext} className="px-3 py-1 rounded-sm bg-secondary/50 text-[10px] font-bold text-secondary-foreground">
              {ext}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}