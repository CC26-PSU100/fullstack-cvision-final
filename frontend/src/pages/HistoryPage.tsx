import { Header } from "@/components/layout/Header";
import { RecentUploadItem } from "@/components/dashboard/RecentUploadItem";
import { useRecentUploads } from "@/hooks/useRecentUploads";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HistoryPage() {
  const { uploads } = useRecentUploads();

  const safeUploads = Array.isArray(uploads) ? uploads : [];

  return (
    <div className="min-h-full flex flex-col">
      <Header title="History" />

      <div className="flex-1 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 space-y-6 max-w-[1600px] mx-auto w-full">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-[family-name:var(--font-family-heading)]">
              Riwayat Unggahan
            </h2>
            <p className="text-sm text-muted-foreground font-medium max-w-md">
              Catatan lengkap semua unggahan CV dan hasil analisis Anda.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">search</span>
                <Input 
                  placeholder="Cari file..." 
                  className="pl-10 rounded-xl bg-card border-border/40 focus:ring-primary/20"
                />
             </div>
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/40 text-sm font-bold text-foreground hover:bg-accent transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter
             </button>
          </div>
        </div>

        <div className="space-y-6">
          {safeUploads.length === 0 ? (
            <Card className="bg-card/50 border-border/40 border-dashed rounded-3xl">
              <CardContent className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-muted-foreground/40 text-4xl">
                    history_toggle_off
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Riwayat tidak ditemukan
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  File yang Anda unggah akan muncul di sini setelah Anda mulai menggunakan dashboard.
                </p>
              </CardContent>
            </Card>
          ) : (            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {safeUploads.map((upload) => (
                <RecentUploadItem key={upload.id} upload={upload} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
