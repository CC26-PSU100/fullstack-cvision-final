import { DropZone } from "@/components/dashboard/DropZone";
import { RecentUploads } from "@/components/dashboard/RecentUploads";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/dashboard/StatCardSkeleton";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { useRecentUploads } from "@/hooks/useRecentUploads";
import { useStats } from "@/hooks/useStats";
import { api } from "@/services/api";
import { useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function DashboardPage() {
   const navigate = useNavigate();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { data: stats, isLoading: statsLoading } = useStats();
   const { uploads, refetch } = useRecentUploads();

   const userJson = localStorage.getItem("user");
   const user = userJson ? JSON.parse(userJson) : null;
   const firstName = user?.name ? user.name.split(" ")[0] : "Guest";

   const handleFileUpload = async (file: File) => {
      toast.promise(
         (async () => {
            console.log("Uploading and Analyzing CV:", file.name);

            const savedFile = await api.uploadCV(file);

            refetch();

            if (savedFile.id) {
               setTimeout(() => navigate(`/analysis/${savedFile.id}`), 1000);
            }

            return savedFile;
         })(),
         {
            loading: "Processing your CV with AI...",
            success: (savedFile: any) =>
               `${savedFile.name || file.name} analysed successfully. Redirecting...`,
            error: (err: any) =>
               err.message || "Failed to process CV. Please try again.",
         },
      );
   };

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         handleFileUpload(file);
      }

      if (e.target) e.target.value = "";
   };

   return (
      <div className="min-h-full flex flex-col">
         <Header title="Beranda" />

         <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.doc,.jpg,.png"
            onChange={handleFileChange}
         />

         <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
            <div className="space-y-6 sm:space-y-7 lg:space-y-8">
               <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 lg:gap-8">
                  <div className="space-y-3">
                     <div className="space-y-1">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                           Halo,{" "}
                           <span className="text-foreground/60 italic">
                              {firstName}
                           </span>
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground">
                           Unggah file baru untuk memulai.
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                     <button
                        onClick={() => navigate("/history")}
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-sm bg-card border border-border text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200 shadow-sm cursor-pointer"
                     >
                        <span className="material-symbols-outlined text-[20px] leading-none">
                           history
                        </span>
                        Riwayat
                     </button>

                     <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-sm bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 transition-opacity duration-200 cursor-pointer"
                     >
                        <span className="material-symbols-outlined text-[20px] leading-none">
                           add
                        </span>
                        Unggah CV
                     </button>
                  </div>
               </section>

               <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {statsLoading ? (
                     <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                     </>
                  ) : stats ? (
                     <>
                        <StatCard
                           label="Total CV terurai"
                           value={stats.totalCVsParsed}
                           icon="description"
                           description="Meningkat 12% bulan ini"
                        />
                        <StatCard
                           label="Tingkat kecocokan kerja"
                           value={`${stats.jobMatchRate}%`}
                           icon="bolt"
                           description="Berada di 5% teratas"
                        />
                        <StatCard
                           label="Rekomendasi pekerjaan"
                           value={stats.jobRecommendations}
                           icon="magic_button"
                           description="4 baru sejak kemarin"
                        />
                     </>
                  ) : null}
               </section>

               <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start">
                  <div>
                     <Card className="rounded-lg overflow-hidden border border-border p-0 shadow-md bg-card">
                        <CardContent className="p-0">
                           <div className="px-5 py-5 sm:px-6 lg:px-7 lg:py-6 border-b border-border bg-muted/20">
                              <h3 className="text-xl font-bold tracking-tight text-foreground">
                                 Unggah CV
                              </h3>
                              <p className="text-sm font-normal text-muted-foreground mt-1">
                                 Urai dan analisis dokumen Anda dengan cepat
                              </p>
                           </div>

                           <div className="p-5 sm:p-6 lg:p-7">
                              <DropZone onFileUpload={handleFileUpload} />
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  <div className="space-y-5 lg:space-y-6">
                     <RecentUploads uploads={uploads} />
                  </div>
               </section>
            </div>
         </main>
      </div>
   );
}
