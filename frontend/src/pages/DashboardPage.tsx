import { DropZone } from "@/components/dashboard/DropZone";
import { RecentUploads } from "@/components/dashboard/RecentUploads";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/dashboard/StatCardSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { useRecentUploads } from "@/hooks/useRecentUploads";
import { useStats } from "@/hooks/useStats";
import { api } from "@/services/api";
import { useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const checkFileHasText = async (file: File): Promise<boolean> => {
   if (file.name.toLowerCase().endsWith(".pdf")) {
      return new Promise((resolve) => {
         const reader = new FileReader();
         reader.onload = () => {
            const content = reader.result as string;
            const hasFont = content.includes("/Font") || 
                            content.includes("/Type /Font") || 
                            content.includes("/Type/Font") || 
                            content.includes("/FontName") || 
                            content.includes("ToUnicode");
            resolve(hasFont);
         };
         reader.readAsText(file.slice(0, 1024 * 1024));
      });
   } else if (file.name.toLowerCase().endsWith(".docx")) {
      return new Promise((resolve) => {
         const reader = new FileReader();
         reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const bytes = new Uint8Array(arrayBuffer);
            const filenameStr = "word/document.xml";
            const filenameBytes = new TextEncoder().encode(filenameStr);
            let found = false;
            let uncompressedSize = 0;
            for (let i = 0; i < bytes.length - 30; i++) {
               if (bytes[i] === 0x50 && bytes[i+1] === 0x4B && bytes[i+2] === 0x03 && bytes[i+3] === 0x04) {
                  const nameLen = bytes[i+26] | (bytes[i+27] << 8);
                  if (nameLen === filenameStr.length) {
                     let match = true;
                     for (let j = 0; j < nameLen; j++) {
                        if (bytes[i+30+j] !== filenameBytes[j]) {
                           match = false;
                           break;
                        }
                     }
                     if (match) {
                        uncompressedSize = bytes[i+22] | (bytes[i+23] << 8) | (bytes[i+24] << 16) | (bytes[i+25] << 24);
                        found = true;
                        break;
                     }
                  }
               }
            }
            resolve(found && uncompressedSize > 3500);
         };
         reader.readAsArrayBuffer(file);
      });
   }
   return true;
};

export default function DashboardPage() {
   const navigate = useNavigate();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { data: stats, isLoading: statsLoading } = useStats();
   const { uploads, refetch } = useRecentUploads();

   const userJson = localStorage.getItem("user");
   const user = userJson ? JSON.parse(userJson) : null;
   const firstName = user?.name ? user.name.split(" ")[0] : "Guest";

   const handleFileUpload = async (file: File) => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt !== 'pdf' && fileExt !== 'docx') {
         toast.error("Format file tidak didukung! Hanya diperbolehkan file PDF dan DOCX.");
         return;
      }

      const hasText = await checkFileHasText(file);
      if (!hasText) {
         toast.error("CV ditolak! CV ini terdeteksi hanya berisi gambar/scan tanpa teks. Harap unggah CV asli yang berisi teks agar dapat dianalisis oleh AI.");
         return;
      }

      navigate("/analysis/new", { state: { file } });
   };

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         handleFileUpload(file);
      }

      if (e.target) e.target.value = "";
   };

   return (
      <PageWrapper title="Beranda">
         <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleFileChange}
         />

         <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
               <div className="space-y-1">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                     Halo, <span className="text-foreground/60 italic">{firstName}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium max-w-md">
                     Unggah file baru untuk memulai.
                  </p>
               </div>

               <div className="flex items-center gap-3">
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
            </div>

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
                        description={stats.cvsParsedDescription || "Belum ada unggahan bulan ini"}
                     />
                     <StatCard
                        label="Tingkat kecocokan kerja"
                        value={`${stats.jobMatchRate}%`}
                        icon="bolt"
                        description={stats.jobMatchRateDescription || "Unggah CV untuk melihat tingkat kecocokan"}
                     />
                     <StatCard
                        label="Rekomendasi pekerjaan"
                        value={stats.jobRecommendations}
                        icon="magic_button"
                        description={stats.jobRecommendationsDescription || "Belum ada rekomendasi baru"}
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
      </PageWrapper>
   );
}
