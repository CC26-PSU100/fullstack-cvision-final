import { RecentUploadItem } from "./RecentUploadItem";
import { Card, CardContent } from "@/components/ui/card";
import type { CVFile } from "@/types/cv";
import { useNavigate } from "react-router-dom";

interface RecentUploadsProps {
  uploads: CVFile[];
}

export function RecentUploads({ uploads }: RecentUploadsProps) {
  const navigate = useNavigate();

  const safeUploads = Array.isArray(uploads) ? uploads.slice(0, 3) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          Unggahan Terbaru
        </h2>
        <button 
          onClick={() => navigate('/history')}
          className="text-xs font-bold text-foreground/60 hover:text-foreground hover:underline cursor-pointer"
        >
          Lihat semua
        </button>
      </div>

      {safeUploads.length === 0 ? (
        <Card className="bg-card/50 border border-border border-dashed rounded-lg">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center mb-4 border border-border">
              <span className="material-symbols-outlined text-muted-foreground/40 text-3xl">
                folder_open
              </span>
            </div>
            <p className="text-base font-bold text-foreground tracking-tight">
              Belum ada unggahan
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
              Unggah CV pertama Anda untuk memulai analisis
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1">
          {safeUploads.map((upload) => (
            <RecentUploadItem key={upload.id} upload={upload} />
          ))}
        </div>
      )}
    </div>
  );
}