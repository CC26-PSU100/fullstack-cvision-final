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
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

const EXPERT_ADVICE = {
  title: "Saran ahli",
  content: (
    <>
      Berdasarkan analisis kami, kandidat ini menunjukkan kekuatan luar biasa dalam bidang <span className="text-foreground font-bold">arsitektur perangkat lunak</span>.
    </>
  )
};

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<CVAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-20 text-center bg-background">
        <span className="material-symbols-outlined text-6xl text-muted-foreground/20 mb-4">error</span>
        <h2 className="text-2xl font-bold">Analisis tidak ditemukan</h2>
        <button onClick={() => navigate('/history')} className="mt-6 px-6 py-2 bg-foreground text-background rounded-md font-bold cursor-pointer border border-border">Kembali ke riwayat</button>
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

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleteModalOpen(false);
    try {
      await api.deleteCV(id);
      toast.success("CV berhasil dihapus");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus CV");
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <Header title="Analisis" />

      <div className="flex-1 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Analisis terperinci
            </h2>
            <p className="text-sm text-muted-foreground font-medium max-w-md">
              Tinjau wawasan mendalam dan skor kompatibilitas untuk {data.metadata?.fileName || "kandidat"}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleView}
              className="flex items-center gap-2 px-5 py-3 rounded-sm bg-card border border-border text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">visibility</span>
              Lihat CV
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 rounded-sm bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 transition-opacity duration-200 cursor-pointer border border-border"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Unduh CV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-card border border-border rounded-lg shadow-sm">
              <CardContent className="p-6">
                 <p className="text-xs font-semibold text-muted-foreground mb-2">Kesesuaian utama</p>
                 <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {data.recommendations && data.recommendations[0] ? Math.round(data.recommendations[0].score * 100) : 0}%
                    </span>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-card border border-border rounded-lg shadow-sm">
              <CardContent className="p-6">
                 <p className="text-xs font-semibold text-muted-foreground mb-2">Kategori teratas</p>
                 <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-foreground truncate">
                      {data.recommendations && data.recommendations[0]?.category || "N/A"}
                    </span>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-card border border-border rounded-lg shadow-sm">
              <CardContent className="p-6">
                 <p className="text-xs font-semibold text-muted-foreground mb-2">Ukuran file</p>
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
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">award_star</span>
              Peringkat peran
            </h3>
            <div className="space-y-6">
              {data.recommendations && data.recommendations.map((item) => (
                <Card key={item.rank} className="border border-border rounded-lg overflow-hidden p-0 bg-card">
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      <div className="w-16 bg-muted/30 flex items-center justify-center border-r border-border font-bold text-muted-foreground">
                        #{item.rank}
                      </div>
                      <div className="flex-1 p-6 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-foreground">{item.title}</p>
                          <p className="text-xs font-bold text-muted-foreground">{item.category}</p>
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
                  Kepercayaan domain
                </h3>
              </div>

              <Card className="rounded-lg p-6 border border-border shadow-sm bg-card">
                <CardContent className="p-0 space-y-6">
                  {data.domains && data.domains.map((domain) => (
                    <div key={domain.domain} className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-foreground">{domain.domain}</p>
                          <p className="text-xs font-medium text-muted-foreground/60">{domain.sector}</p>
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

            {data.skills && data.skills.length > 0 && (
              <div className="space-y-4 px-1">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Keahlian terdeteksi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 rounded-md font-bold border border-border bg-muted/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Card className="bg-muted/10 border border-border rounded-lg p-8 relative overflow-hidden">
               <CardContent className="p-0 relative z-10 space-y-4">
                  <span className="material-symbols-outlined text-3xl text-foreground mb-4 block">lightbulb</span>
                  <h4 className="text-lg font-bold text-foreground leading-tight">{EXPERT_ADVICE.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {EXPERT_ADVICE.content}
                  </p>
               </CardContent>
            </Card>

            <div className="pt-6 border-t border-border">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm bg-red-950/30 border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-950/70 hover:text-red-400 transition-colors duration-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
                Hapus CV ini
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Konfirmasi hapus CV"
        message="Apakah Anda yakin ingin menghapus CV ini beserta seluruh analisisnya secara permanen dari akun Anda? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}