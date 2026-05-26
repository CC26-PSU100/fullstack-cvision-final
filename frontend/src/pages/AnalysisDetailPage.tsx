import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { CVAnalysisResult } from "@/types/cv";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [data, setData] = useState<CVAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    api.getCVDetailedAnalysis(id)
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Failed to fetch analysis:", error);
        toast.error("Gagal memuat laporan analisis CV.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleDownload = () => {
    if (data?.metadata?.fileUrl) {
      window.open(data.metadata.fileUrl, '_blank');
    } else {
      toast.error("URL file tidak tersedia untuk diunduh.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full flex flex-col">
        <Header title="Analisis CV" />
        <div className="flex-1 section-container space-y-8 py-10">
          <Skeleton className="h-10 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full max-w-2xl" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-20 text-center bg-background">
        <span className="material-symbols-outlined text-6xl text-muted-foreground/20 mb-4">error</span>
        <h2 className="text-2xl font-bold">Analisis tidak ditemukan</h2>
        <p className="text-muted-foreground mb-6">Kami tidak dapat menemukan laporan analisis yang Anda cari.</p>
        <button onClick={() => navigate('/history')} className="px-6 py-2 bg-foreground text-background rounded-md font-bold cursor-pointer border border-border">Kembali ke riwayat</button>
      </div>
    );
  }

  const uploadedDate = data.metadata?.uploadedAt ? new Date(data.metadata.uploadedAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : "Tanggal tidak diketahui";

  return (
    <div className="min-h-full flex flex-col selection:bg-indigo-500/20">
      <Header title="Analisis CV" />

      {isViewerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-300">
          <div className="relative w-full h-full max-w-5xl bg-card rounded-lg overflow-hidden border border-border shadow-2xl flex flex-col">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <span className="material-symbols-outlined text-foreground">description</span>
                  Pratinjau dokumen
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  File CV asli • ID: {id}
                </p>
              </div>
              <button
                onClick={() => setIsViewerOpen(false)}
                className="w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 border border-border flex items-center justify-center transition-all cursor-pointer text-foreground"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 bg-muted/10 flex flex-col items-center justify-center text-center overflow-hidden">
               <iframe
                src={data.metadata?.fileUrl || data.fileUrl}
                className="w-full h-full border-none"
                title="Pratinjau CV"
               />
            </div>

            <div className="px-8 py-5 border-t border-border bg-muted/20 flex justify-end gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-sm bg-card border border-border text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200 cursor-pointer"
              >
                Unduh
              </button>
              <button
                onClick={() => setIsViewerOpen(false)}
                className="px-6 py-2.5 rounded-sm bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 transition-opacity duration-200 cursor-pointer border border-border"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 section-container space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all group cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Kembali ke riwayat
            </button>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Laporan analisis
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-muted-foreground">
                <span className="text-foreground/80">{data.metadata?.fileName || "Software_Engineer_CV.pdf"}</span>
                <span className="w-1 h-1 rounded-sm bg-border" />
                <span>Diunggah pada {uploadedDate}</span>
                <span className="w-1 h-1 rounded-sm bg-border" />
                <span className="tabular-nums">{data.metadata?.fileSizeFormatted || "0 KB"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-3 rounded-sm bg-card border border-border text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200 shadow-sm cursor-pointer"
             >
                <span className="material-symbols-outlined text-lg">download</span>
                Unduh CV
             </button>
             <button
              onClick={() => setIsViewerOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-sm bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 transition-opacity duration-200 cursor-pointer border border-border"
             >
                <span className="material-symbols-outlined text-lg">visibility</span>
                Lihat CV
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
                <span className="material-symbols-outlined text-primary text-2xl">award_star</span>
                Peringkat peran
              </h3>
              <Badge variant="outline" className="bg-muted border border-border text-foreground px-4 py-1.5 font-bold text-xs rounded-md">
                {data.recommendations.length} hasil
              </Badge>
            </div>

            <div className="space-y-5">
              {data.recommendations.map((item) => (
                <Card key={item.rank} className="rounded-lg overflow-hidden border border-border p-0 shadow-md bg-card">
                  <CardContent className="p-0">
                    <div className="flex items-stretch min-h-[100px]">
                      <div className="w-16 md:w-20 bg-muted/50 flex items-center justify-center border-r border-border transition-colors">
                        <span className="text-xl md:text-2xl font-bold text-muted-foreground/20 transition-colors">
                          #{item.rank}
                        </span>
                      </div>

                      <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-lg font-bold text-foreground truncate transition-colors leading-none">
                            {item.title}
                          </p>
                          <p className="text-xs font-bold text-muted-foreground/40">
                            {item.category}
                          </p>
                        </div>

                        <div className="flex flex-col md:items-end gap-3 shrink-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-foreground tabular-nums">{(item.score * 100).toFixed(1)}%</span>
                            <span className="text-xs font-bold text-muted-foreground/40">Cocok</span>
                          </div>
                          <Progress
                            value={item.score * 100}
                            className="w-32 h-2.5 bg-muted rounded-md overflow-hidden border border-border shadow-inner p-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="px-1">
                <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">domain</span>
                  Kepercayaan domain
                </h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Estimasi area keahlian yang ditemukan dalam dokumen.
                </p>
              </div>

              <Card className="rounded-lg p-6 border border-border shadow-sm bg-card">
                <CardContent className="p-0 space-y-6">
                  {data.domains.map((domain) => (
                    <div key={domain.domain} className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-foreground">{domain.domain}</p>
                          <p className="text-xs font-semibold text-muted-foreground/60">{domain.sector}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-muted border border-border text-foreground rounded-md">
                          {domain.confidence}%
                        </span>
                      </div>
                      <Progress
                        value={domain.confidence}
                        className="h-2.5 bg-muted/50 rounded-md border border-border p-0.5 shadow-inner"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/10 border border-border rounded-lg p-8 relative overflow-hidden">
               <CardContent className="p-0 relative z-10 space-y-4">
                  <span className="material-symbols-outlined text-3xl text-foreground mb-4 block">lightbulb</span>
                  <h4 className="text-lg font-bold text-foreground leading-tight">Saran ahli</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Berdasarkan analisis kami, kandidat ini menunjukkan kekuatan luar biasa dalam bidang <span className="text-foreground font-bold">{data.domains[0]?.domain || "bidang ini"}</span>.
                  </p>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
