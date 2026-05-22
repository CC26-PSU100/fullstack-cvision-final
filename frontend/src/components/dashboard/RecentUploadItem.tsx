import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CVFile } from "@/types/cv";

interface RecentUploadItemProps {
  upload: CVFile;
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

export function RecentUploadItem({ upload }: RecentUploadItemProps) {
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

  return (
    <Card
      onClick={() =>
        upload.status === "done" && navigate(`/analysis/${upload.id}`)
      }
      className={cn(
        "group overflow-hidden rounded-2xl border-border/40 transition-all duration-300 md:rounded-3xl p-1 shadow-sm",
        upload.status === "done" ? "cursor-pointer hover:bg-muted/50" : "cursor-default"
      )}
    >
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 md:p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted shadow-inner transition-all duration-300 group-hover:bg-foreground group-hover:text-background sm:h-14 sm:w-14">
          <span className="material-symbols-outlined text-2xl leading-none text-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-inherit">
            description
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 md:text-lg">
                {upload.name}
              </p>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground/70">
                  {formattedDate}
                </span>

                <span className="tabular-nums">@{formattedTime}</span>

                <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />

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

            <Badge
              variant="outline"
              className={cn(
                "shrink-0 rounded-full border-none px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
                status.className
              )}
            >
              {status.label}
            </Badge>
          </div>

          {upload.status === "done" && upload.matchScore !== undefined && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  style={{ width: `${upload.matchScore}%` }}
                  className="h-full rounded-full bg-foreground/80 transition-all duration-700"
                />
              </div>

              <span className="w-10 text-right text-sm font-bold leading-none tabular-nums text-foreground">
                {upload.matchScore}%
              </span>
            </div>
          )}

          {upload.status === "parsing" && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-foreground/30" />
              </div>

              <span className="w-10 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Tunggu
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
