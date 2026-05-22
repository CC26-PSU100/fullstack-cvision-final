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

const EXPERT_ADVICE = {
  title: "Saran Ahli",
  content: (
    <>
      Berdasarkan analisis kami, kandidat ini menunjukkan kekuatan luar biasa dalam bidang <span className="text-foreground font-bold">Arsitektur Perangkat Lunak</span>.
    </>
  )
};

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        toast.error("Gagal memuat analisis terperinci.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-full flex flex-col">
        <Header title="Analisis" />
        <div className="flex-1 px-4 md:px-6 lg:px-8 py-8 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-20 text-center">
        <span className="material-symbols-outlined text-6xl text-muted-foreground/20 mb-4">error</span>
        <h2 className="text-2xl font-bold">Analisis tidak ditemukan</h2>
        <button onClick={() => navigate('/history')} className="mt-6 px-6 py-2 bg-foreground text-background rounded-xl font-bold">Kembali ke Riwayat</button>
      </div>
    );
  }

  const fileUrl = data.metadata?.fileUrl || (data as any).fileUrl;

  const handleDownload = async () => {
    if (fileUrl) {
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = data.metadata?.fileName || fileUrl.split('/').pop() || 'unduhan.pdf';
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        toast.success("Unduhan dimulai");
      } catch (error) {
        console.error("Download failed:", error);
        toast.error("Gagal mengunduh file.");

        window.open(fileUrl, '_blank');
      }
    } else {
      toast.error("URL file tidak tersedia.");
    }
  };

  const handleView = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      toast.error("URL file tidak tersedia.");
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <Header title="Analisis" />

      <div className="flex-1 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-[family-name:var(--font-family-heading)]">
              Analisis Terperinci
            </h2>
            <p className="text-sm text-muted-foreground font-medium max-w-md">
              Tinjau wawasan mendalam dan skor kompatibilitas untuk {data.metadata?.fileName || "kandidat"}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleView}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground hover:bg-muted transition-all duration-300 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">visibility</span>
              Lihat CV
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Unduh CV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-card border-border/40 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Kesesuaian Utama</p>
                 <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {data.recommendations && data.recommendations[0] ? Math.round(data.recommendations[0].score * 100) : 0}%
                    </span>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-card border-border/40 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Kategori Teratas</p>
                 <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-foreground truncate">
                      {data.recommendations && data.recommendations[0]?.category || "N/A"}
                    </span>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-card border-border/40 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Ukuran File</p>
                 <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {data.metadata?.fileSizeFormatted || (data as any).fileSizeFormatted || "0 KB"}
                    </span>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">award_star</span>
              Peringkat Peran
            </h3>
            <div className="space-y-6">
              {data.recommendations && data.recommendations.map((item) => (
                <Card key={item.rank} className="border-border/40 rounded-3xl overflow-hidden group p-0">
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      <div className="w-16 bg-muted/30 flex items-center justify-center border-r border-border/40 font-bold text-muted-foreground">
                        #{item.rank}
                      </div>
                      <div className="flex-1 p-6 flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-foreground">{item.title}</p>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-foreground">{Math.round(item.score * 100)}%</p>
                          <Progress value={item.score * 100} className="w-24 h-1.5 mt-2" />
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
                  Kepercayaan Domain
                </h3>
              </div>

              <Card className="rounded-3xl p-6 border-border/40 shadow-sm">
                <CardContent className="p-0 space-y-6">
                  {data.domains && data.domains.map((domain) => (
                    <div key={domain.domain} className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-foreground">{domain.domain}</p>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{domain.sector}</p>
                        </div>
                        <span className="text-sm font-bold text-white bg-blue-600/40 px-2 py-0.5 rounded-lg border border-blue-500/30">
                          {domain.confidence}%
                        </span>
                      </div>
                      <Progress
                        value={domain.confidence}
                        className="h-2.5 bg-muted/50 rounded-full border border-border/10 p-0.5 shadow-inner"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {data.skills && data.skills.length > 0 && (
              <div className="space-y-4 px-1">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Keahlian Terdeteksi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 rounded-lg font-bold border border-border/40 bg-muted/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Card className="bg-primary/5 border-primary/10 rounded-3xl p-8 relative overflow-hidden group">
               <CardContent className="p-0 relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-background">lightbulb</span>
                  </div>
                  <h4 className="text-xl font-bold text-foreground leading-tight">{EXPERT_ADVICE.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {EXPERT_ADVICE.content}
                  </p>
               </CardContent>
            </Card>

            <div className="pt-6 border-t border-border/40">
              <button
                onClick={async () => {
                  if (id && window.confirm("Apakah Anda yakin ingin menghapus CV ini beserta analisisnya secara permanen?")) {
                    try {
                      await api.deleteCV(id);
                      toast.success("CV berhasil dihapus");
                      navigate("/dashboard");
                    } catch (error: any) {
                      toast.error(error.message || "Gagal menghapus CV");
                    }
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-500/20 text-red-500 text-sm font-black uppercase tracking-[0.15em] hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 group"
              >
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">delete</span>
                Hapus CV Ini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}