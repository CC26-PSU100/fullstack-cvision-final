import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/api";
import type { CVAnalysisResult } from "@/types/cv";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EXPERT_ADVICE = {
   title: "Saran ahli",
   content: (
      <>
         Berdasarkan analisis kami, kandidat ini menunjukkan kekuatan luar biasa
         dalam bidang{" "}
         <span className="text-foreground font-bold">
            arsitektur perangkat lunak
         </span>
         .
      </>
   ),
};

const STEPS = [
   "Membaca teks dari dokumen CV...",
   "Mengunggah berkas ke server aman...",
   "Mengekstrak kompetensi dengan AI...",
   "Mencocokkan dengan ratusan domain industri...",
   "Menyusun saran pengembangan karir terbaik...",
];

export default function ResultPage() {
   const { id } = useParams();
   const navigate = useNavigate();
   const location = useLocation();
   const [data, setData] = useState<CVAnalysisResult | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [progressSeconds, setProgressSeconds] = useState(0);
   const [currentStepIndex, setCurrentStepIndex] = useState(0);
   const [uploadError, setUploadError] = useState<string | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);
   const uploadTriggeredRef = useRef(false);
   const abortControllerRef = useRef<AbortController | null>(null);
   const fileRef = useRef<File | null>(null);
   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
   const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

   if (!fileRef.current && location.state?.file) {
      fileRef.current = location.state.file;
   }

   useEffect(() => {
      if (id !== "new") return;

      const file = fileRef.current;

      if (!file) {
         navigate("/dashboard", { replace: true });
         return;
      }

      if (uploadTriggeredRef.current) return;
      uploadTriggeredRef.current = true;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      timerRef.current = setInterval(() => {
         setProgressSeconds((prev) => prev + 1);
      }, 1000);

      stepTimerRef.current = setInterval(() => {
         setCurrentStepIndex((prev) => {
            if (prev < STEPS.length - 1) {
               return prev + 1;
            }
            return prev;
         });
      }, 3000);

      api.uploadCV(file, controller.signal)
         .then((savedFile) => {
            navigate(`/analysis/${savedFile.id}`, { replace: true, state: { scanDuration: progressSeconds } });
         })
         .catch((error) => {
            if (error.name !== "AbortError") {
               console.error("Analysis failed:", error);
               setUploadError(error.message || "Gagal menganalisis CV.");
            }
         })
         .finally(() => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (stepTimerRef.current) clearInterval(stepTimerRef.current);
         });

      return () => {};
   }, [id, navigate]);

   useEffect(() => {
      if (!id || id === "new") return;

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

   if (uploadError) {
      return (
         <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center bg-background">
            <div className="bg-card border border-border/80 p-8 rounded-xl max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
               <span className="material-symbols-outlined text-5xl text-red-500 animate-bounce">
                  error
               </span>
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                     Gagal Menganalisis CV
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                     {uploadError}
                  </p>
               </div>
               <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 bg-foreground text-background rounded-lg font-bold hover:opacity-90 transition-opacity cursor-pointer border border-border"
               >
                  Kembali ke Beranda
               </button>
            </div>
         </div>
      );
   }

   if (id === "new") {
      return (
         <PageWrapper title="Analisis" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
               <div className="space-y-1">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                     Analisis terperinci
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium max-w-md">
                     Sedang menganalisis dokumen dan menyusun skor
                     kompatibilitas...
                  </p>
               </div>
               <div className="flex items-center gap-3 opacity-30 pointer-events-none">
                  <button className="flex items-center gap-2 px-5 py-3 rounded-sm bg-card border border-border text-sm font-bold text-foreground/60 cursor-not-allowed">
                     <span className="material-symbols-outlined text-lg">
                        visibility
                     </span>
                     Lihat CV
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 rounded-sm bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-bold cursor-not-allowed">
                     <span className="material-symbols-outlined text-lg">
                        delete
                     </span>
                     Hapus CV
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 rounded-sm bg-foreground text-background text-sm font-bold cursor-not-allowed border border-border">
                     <span className="material-symbols-outlined text-lg">
                        download
                     </span>
                     Unduh CV
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fade-in">
               <div className="lg:col-span-7 flex flex-col space-y-4">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                     <span className="animate-spin material-symbols-outlined text-primary text-xl">
                        progress_activity
                     </span>
                     Proses Pemindaian AI
                  </h3>
                  <div className="flex-1 flex flex-col justify-between bg-card border border-border rounded-lg p-6 shadow-sm min-h-80">
                     <div className="space-y-4">
                        {STEPS.map((step, index) => {
                           const isCompleted = index < currentStepIndex;
                           const isActive = index === currentStepIndex;
                           return (
                              <div
                                 key={index}
                                 className={`flex items-center gap-4 transition-all duration-300 ${
                                    isActive
                                       ? "opacity-100 scale-100"
                                       : isCompleted
                                         ? "opacity-75 scale-95"
                                         : "opacity-30 scale-95"
                                 }`}
                              >
                                 {isCompleted ? (
                                    <span className="material-symbols-outlined text-green-400 text-xl">
                                       check_circle
                                    </span>
                                 ) : isActive ? (
                                    <span className="animate-spin material-symbols-outlined text-primary text-xl">
                                       progress_activity
                                    </span>
                                 ) : (
                                    <span className="material-symbols-outlined text-muted-foreground/40 text-xl">
                                       radio_button_unchecked
                                    </span>
                                 )}
                                 <span
                                    className={`text-sm font-semibold ${isActive ? "text-foreground font-bold" : "text-muted-foreground"}`}
                                 >
                                    {step}
                                 </span>
                              </div>
                           );
                        })}
                     </div>

                     <div className="space-y-2 pt-6 border-t border-border/40">
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                           <span>Progres pemindaian</span>
                           <span>
                              {Math.round(
                                 ((currentStepIndex + 1) / STEPS.length) * 100,
                              )}
                              %
                           </span>
                        </div>
                        <Progress
                           value={((currentStepIndex + 1) / STEPS.length) * 100}
                           className="h-1.5 w-full animate-pulse"
                        />
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-5 flex flex-col justify-between bg-card border border-border rounded-lg p-8 shadow-sm min-h-80">
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                     <div className="relative">
                        <svg
                           width="120"
                           height="120"
                           viewBox="0 0 100 100"
                           className="text-foreground/80"
                        >
                           <style>{`
                    .walking-head { animation: bob 1.2s infinite ease-in-out; }
                    .walking-arm-left { transform-origin: 50px 30px; animation: swing 1.2s infinite ease-in-out; }
                    .walking-arm-right { transform-origin: 50px 30px; animation: swing-opp 1.2s infinite ease-in-out; }
                    .walking-leg-left { transform-origin: 50px 55px; animation: swing 1.2s infinite ease-in-out; }
                    .walking-leg-right { transform-origin: 50px 55px; animation: swing-opp 1.2s infinite ease-in-out; }
                    @keyframes bob {
                      0%, 100% { transform: translateY(0px); }
                      50% { transform: translateY(3px); }
                    }
                    @keyframes swing {
                      0%, 100% { transform: rotate(-25deg); }
                      50% { transform: rotate(25deg); }
                    }
                    @keyframes swing-opp {
                      0%, 100% { transform: rotate(25deg); }
                      50% { transform: rotate(-25deg); }
                    }
                  `}</style>
                           <circle
                              cx="50"
                              cy="20"
                              r="8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              className="walking-head"
                           />
                           <line
                              x1="50"
                              y1="28"
                              x2="50"
                              y2="55"
                              stroke="currentColor"
                              strokeWidth="4"
                           />
                           <line
                              x1="50"
                              y1="32"
                              x2="50"
                              y2="50"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              className="walking-arm-left"
                           />
                           <line
                              x1="50"
                              y1="32"
                              x2="50"
                              y2="50"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              className="walking-arm-right"
                           />
                           <line
                              x1="50"
                              y1="55"
                              x2="50"
                              y2="80"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              className="walking-leg-left"
                           />
                           <line
                              x1="50"
                              y1="55"
                              x2="50"
                              y2="80"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              className="walking-leg-right"
                           />
                        </svg>
                     </div>
                     <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-foreground/80">
                           Menganalisis kompetensi...
                        </p>
                        <p className="text-xs text-muted-foreground/60 font-medium">
                           Harap jangan menutup halaman ini
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-1 pt-6 border-t border-border/40">
                     <div className="text-3xl font-light text-foreground/80 tracking-wider">
                        {progressSeconds}s
                     </div>
                     <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/60">
                        Waktu Berjalan
                     </p>
                  </div>
               </div>
            </div>
         </PageWrapper>
      );
   }

   if (isLoading) {
      return (
         <PageWrapper title="Analisis" className="space-y-6">
            <div className="space-y-4">
               <Skeleton className="h-10 w-64 animate-pulse" />
               <Skeleton className="h-4 w-96 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Skeleton className="h-32 rounded-lg animate-pulse" />
               <Skeleton className="h-32 rounded-lg animate-pulse" />
               <Skeleton className="h-32 rounded-lg animate-pulse" />
            </div>
            <Skeleton className="h-96 w-full rounded-lg animate-pulse" />
         </PageWrapper>
      );
   }

   if (!data) {
      return (
         <div className="min-h-full flex flex-col items-center justify-center p-20 text-center bg-background">
            <span className="material-symbols-outlined text-6xl text-muted-foreground/20 mb-4">
               error
            </span>
            <h2 className="text-2xl font-bold">Analisis tidak ditemukan</h2>
            <button
               onClick={() => navigate("/history")}
               className="mt-6 px-6 py-2 bg-foreground text-background rounded-md font-bold cursor-pointer border border-border"
            >
               Kembali ke riwayat
            </button>
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

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download =
               data.metadata?.fileName ||
               fileUrl.split("/").pop() ||
               "unduhan.pdf";
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success("Unduhan dimulai");
         } catch (error) {
            console.error("Download failed:", error);
            toast.error("Gagal mengunduh file.");

            window.open(fileUrl, "_blank");
         }
      } else {
         toast.error("URL file tidak tersedia.");
      }
   };

   const handleView = () => {
      if (fileUrl) {
         window.open(fileUrl, "_blank");
      } else {
         toast.error("URL file tidak tersedia.");
      }
   };

   const handleDelete = async () => {
      if (!id) return;
      setIsDeleteModalOpen(false);
      setIsDeleting(true);
      const toastId = toast.loading(
         "Sedang menghapus CV dan seluruh data analisis...",
      );
      try {
         await api.deleteCV(id);
         toast.success("CV berhasil dihapus secara permanen.", { id: toastId });
         navigate("/dashboard");
      } catch (error: any) {
         toast.error(error.message || "Gagal menghapus CV", { id: toastId });
         setIsDeleting(false);
      }
   };

   return (
      <PageWrapper title="Analisis" className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
            <div className="space-y-1">
               <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Analisis terperinci
               </h2>
               <p className="text-sm text-muted-foreground font-medium max-w-md leading-relaxed">
                  Tinjau wawasan mendalam dan skor kompatibilitas untuk{" "}
                  {data.metadata?.originalName ||
                     data.metadata?.fileName ||
                     "kandidat"}{" "}
                  (Dianalisis dalam {(location.state as any)?.scanDuration || data.metadata?.scanDurationSeconds || 0}{" "}
                  detik).
               </p>
            </div>
            <div className="flex items-center gap-3">
               <button
                  onClick={handleView}
                  className="flex items-center gap-2 px-5 py-3 rounded-sm bg-card border border-border text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200 shadow-sm cursor-pointer"
               >
                  <span className="material-symbols-outlined text-lg">
                     visibility
                  </span>
                  Lihat CV
               </button>
               <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-sm bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-950/50 hover:text-red-300 transition-colors duration-200 shadow-sm cursor-pointer"
               >
                  <span className="material-symbols-outlined text-lg">
                     delete
                  </span>
                  Hapus CV
               </button>
               <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 rounded-sm bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 transition-opacity duration-200 cursor-pointer border border-border"
               >
                  <span className="material-symbols-outlined text-lg">
                     download
                  </span>
                  Unduh CV
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border border-border rounded-lg shadow-sm">
               <CardContent className="p-6">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                     Kesesuaian utama
                  </p>
                  <div className="flex items-end gap-2">
                     <span className="text-3xl font-bold text-foreground">
                        {data.recommendations && data.recommendations[0]
                           ? Math.round(data.recommendations[0].score * 100)
                           : 0}
                        %
                     </span>
                  </div>
               </CardContent>
            </Card>
            <Card className="bg-card border border-border rounded-lg shadow-sm">
               <CardContent className="p-6">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                     Kategori teratas
                  </p>
                  <div className="flex items-center gap-2">
                     <span className="text-3xl font-bold text-foreground truncate">
                        {(data.recommendations &&
                           data.recommendations[0]?.category) ||
                           "N/A"}
                     </span>
                  </div>
               </CardContent>
            </Card>
            <Card className="bg-card border border-border rounded-lg shadow-sm">
               <CardContent className="p-6">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                     Ukuran file
                  </p>
                  <div className="flex items-end gap-2">
                     <span className="text-3xl font-bold text-foreground">
                        {data.metadata?.fileSizeFormatted ||
                           (data as any).fileSizeFormatted ||
                           "0 KB"}
                     </span>
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 flex flex-col space-y-4">
               <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                     award_star
                  </span>
                  Peringkat peran
               </h3>
               <div className="flex-1 flex flex-col gap-4">
                  {data.recommendations &&
                     data.recommendations.map((item) => (
                        <Card
                           key={item.rank}
                           className="border border-border rounded-lg overflow-hidden p-0 bg-card flex-1 flex flex-col justify-center shadow-md"
                        >
                           <CardContent className="p-0">
                              <div className="flex items-stretch">
                                 <div className="w-16 bg-muted/30 flex items-center justify-center border-r border-border font-bold text-muted-foreground">
                                    #{item.rank}
                                 </div>
                                 <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                       <div>
                                          <p className="text-lg font-bold text-foreground">
                                             {item.title}
                                          </p>
                                          <p className="text-xs font-bold text-muted-foreground">
                                             {item.category}
                                          </p>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-2xl font-black text-foreground">
                                             {Math.round(item.score * 100)}%
                                          </p>
                                          <Progress
                                             value={item.score * 100}
                                             className="w-24 h-1.5 mt-2"
                                          />
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
                                       <a
                                          href={`https://glints.com/id/opportunities/jobs/explore?keyword=${encodeURIComponent(item.title)}&country=ID&locationName=All+Cities%2FProvinces&lowestLocationLevel=1`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-blue-950/20 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-950/40 hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                                       >
                                          <span className="material-symbols-outlined text-sm font-bold">
                                             work
                                          </span>
                                          Cari di Glints
                                       </a>
                                       <a
                                          href={`https://id.indeed.com/jobs?q=${encodeURIComponent(item.title)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-950/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold hover:bg-indigo-950/40 hover:text-indigo-300 transition-colors duration-200 cursor-pointer"
                                       >
                                          <span className="material-symbols-outlined text-sm font-bold">
                                             search
                                          </span>
                                          Cari di Indeed
                                       </a>
                                    </div>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
               </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
               <div className="space-y-4">
                  <div className="px-1">
                     <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                           domain
                        </span>
                        Kepercayaan domain
                     </h3>
                  </div>

                  <Card className="rounded-lg p-5 border border-border shadow-sm bg-card">
                     <CardContent className="p-0 space-y-4">
                        {data.domains &&
                           data.domains.map((domain) => (
                              <div key={domain.domain} className="space-y-2">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <p className="text-sm font-bold text-foreground">
                                          {domain.domain}
                                       </p>
                                       <p className="text-xs font-medium text-muted-foreground/60">
                                          {domain.sector}
                                       </p>
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-0.5 bg-muted border border-border text-foreground rounded-md">
                                       {domain.confidence}%
                                    </span>
                                 </div>
                                 <Progress
                                    value={domain.confidence}
                                    className="h-2 bg-muted/50 rounded-md border border-border p-0.5 shadow-inner"
                                 />
                              </div>
                           ))}
                     </CardContent>
                  </Card>
               </div>

               {data.skills && data.skills.length > 0 && (
                  <div className="space-y-3 px-1">
                     <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                           psychology
                        </span>
                        Keahlian terdeteksi
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                           <Badge
                              key={skill}
                              variant="secondary"
                              className="px-3 py-1 rounded-md font-bold border border-border bg-muted/30"
                           >
                              {skill}
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}

               <Card className="bg-muted/10 border border-border rounded-lg p-6 relative overflow-hidden flex-1 flex flex-col justify-center">
                  <CardContent className="p-0 relative z-10 space-y-3">
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl text-foreground">
                           lightbulb
                        </span>
                        <h4 className="text-lg font-bold text-foreground leading-tight">
                           {EXPERT_ADVICE.title}
                        </h4>
                     </div>
                     <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        {EXPERT_ADVICE.content}
                     </p>
                  </CardContent>
               </Card>
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

         {isDeleting && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md transition-opacity duration-300">
               <div className="bg-card border border-border p-8 rounded-xl max-w-sm w-full text-center space-y-4 shadow-2xl animate-fade-in">
                  <span className="animate-spin material-symbols-outlined text-4xl text-red-500">
                     progress_activity
                  </span>
                  <div className="space-y-1">
                     <p className="text-lg font-bold text-foreground">
                        Menghapus Data
                     </p>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        Mohon tunggu sebentar, dokumen dan seluruh data analisis
                        sedang dihapus dari server.
                     </p>
                  </div>
               </div>
            </div>
         )}
      </PageWrapper>
   );
}
