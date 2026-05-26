import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CVFile } from "@/types/cv";

interface RecentUploadItemProps {
  upload: CVFile;
  onDeleteRequest?: (cvId: string) => void;
  isDeleting?: boolean;
}

const STATUS_CONFIG = {
  parsing: {
    label: "Memproses",
    className: "bg-muted text-muted-foreground",
  },
  done: {
    label: "Selesai",
    className: "bg-green-500/10 text-green-500",
  },
  error: {
    label: "Gagal",
    className: "bg-red-500/10 text-red-500",
  },
};

export function RecentUploadItem({ upload, onDeleteRequest, isDeleting }: RecentUploadItemProps) {
  const navigate = useNavigate();
  const status = STATUS_CONFIG[upload.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.error;

  const dateObj = new Date(upload.uploadedAt);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${hours}:${minutes}`;
  const formattedSize = (upload as any).fileSizeFormatted || upload.sizeFormatted || `${(upload.size / 1024 / 1024).toFixed(1)} MB`;

  const handleCardClick = () => {
    if (upload.status === "done") {
      navigate(`/analysis/${upload.id}`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteRequest) {
      onDeleteRequest(upload.id);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "group overflow-hidden rounded-lg border border-border transition-all duration-200 p-1 shadow-sm bg-card relative",
        upload.status === "done" ? "cursor-pointer hover:bg-muted/50" : "cursor-default",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      {isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-lg backdrop-blur-sm">
          <span className="animate-spin material-symbols-outlined text-2xl text-red-400">
            progress_activity
          </span>
        </div>
      )}
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 md:p-6 bg-card text-foreground">
        <span className="material-symbols-outlined text-[36px] leading-none text-foreground/40 mr-4 sm:mr-5 shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:text-foreground">
          description
        </span>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 md:text-lg">
                {upload.name}
              </p>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground/70">
                  {formattedDate}
                </span>

                <span className="tabular-nums">@{formattedTime}</span>

                <span className="hidden h-1 w-1 rounded-sm bg-border sm:inline-block" />

                <span className="inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">
                    database
                  </span>
                  <span className="font-semibold tracking-wide">
                    {formattedSize}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-sm border-none px-2.5 py-1 text-xs font-bold",
                  status.className
                )}
              >
                {status.label}
              </Badge>

              {onDeleteRequest && (
                <button
                  onClick={handleDeleteClick}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-sm hover:bg-red-500/10 text-muted-foreground/40 hover:text-red-400 cursor-pointer"
                  title="Hapus CV ini"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">
                    delete
                  </span>
                </button>
              )}
            </div>
          </div>

          {upload.status === "done" && upload.matchScore !== undefined && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-muted">
                <div
                  style={{ width: `${upload.matchScore}%` }}
                  className="h-full rounded-sm bg-foreground/80 transition-all duration-700"
                />
              </div>

              <span className="w-10 text-right text-xs font-bold leading-none tabular-nums text-foreground">
                {upload.matchScore}%
              </span>
            </div>
          )}

          {upload.status === "parsing" && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-muted">
                <div className="h-full w-2/3 animate-pulse rounded-sm bg-foreground/30" />
              </div>

              <span className="w-10 text-right text-xs font-bold text-muted-foreground">
                Tunggu
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
