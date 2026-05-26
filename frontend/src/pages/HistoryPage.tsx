import { RecentUploadItem } from "@/components/dashboard/RecentUploadItem";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRecentUploads } from "@/hooks/useRecentUploads";
import { api } from "@/services/api";
import { clearApiCache } from "@/services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function HistoryPage() {
   const navigate = useNavigate();
   const { uploads, refetch } = useRecentUploads();

   const [searchQuery, setSearchQuery] = useState("");
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const [dateFilter, setDateFilter] = useState("all");
   const [statusFilter, setStatusFilter] = useState("all");
   const [scoreFilter, setScoreFilter] = useState("all");

   const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
   const [isDeletingAll, setIsDeletingAll] = useState(false);
   const [deletingId, setDeletingId] = useState<string | null>(null);
   const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
   const [isDeleteSingleModalOpen, setIsDeleteSingleModalOpen] = useState(false);

   const safeUploads = Array.isArray(uploads) ? uploads : [];

   const dateOptions = [
      { value: "all", label: "Semua waktu" },
      { value: "today", label: "Hari ini" },
      { value: "week", label: "7 hari terakhir" },
      { value: "month", label: "30 hari terakhir" },
   ];

   const statusOptions = [
      { value: "all", label: "Semua status" },
      { value: "done", label: "Selesai" },
      { value: "parsing", label: "Memproses" },
      { value: "error", label: "Gagal" },
   ];

   const scoreOptions = [
      { value: "all", label: "Semua tingkat" },
      { value: "high", label: "Sangat cocok (≥ 90%)" },
      { value: "medium", label: "Cukup cocok (75% - 89%)" },
      { value: "low", label: "Kurang cocok (< 75%)" },
   ];

   const filteredUploads = safeUploads.filter((upload) => {
      if (
         searchQuery &&
         !upload.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
         return false;
      }

      if (dateFilter !== "all") {
         const uploadDate = new Date(upload.uploadedAt);
         const today = new Date();
         today.setHours(0, 0, 0, 0);

         if (dateFilter === "today") {
            if (uploadDate < today) return false;
         } else if (dateFilter === "week") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            if (uploadDate < sevenDaysAgo) return false;
         } else if (dateFilter === "month") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            if (uploadDate < thirtyDaysAgo) return false;
         }
      }

      if (statusFilter !== "all" && upload.status !== statusFilter) {
         return false;
      }

      if (scoreFilter !== "all") {
         const score = upload.matchScore ?? 0;
         if (scoreFilter === "high" && score < 90) return false;
         if (scoreFilter === "medium" && (score < 75 || score >= 90))
            return false;
         if (scoreFilter === "low" && score >= 75) return false;
      }

      return true;
   });

   const hasActiveFilters =
      dateFilter !== "all" || statusFilter !== "all" || scoreFilter !== "all";

   const resetFilters = () => {
      setDateFilter("all");
      setStatusFilter("all");
      setScoreFilter("all");
   };

   const handleDeleteSingleRequest = (cvId: string) => {
      setDeleteTargetId(cvId);
      setIsDeleteSingleModalOpen(true);
   };

   const handleDeleteSingleConfirm = async () => {
      if (!deleteTargetId) return;
      setIsDeleteSingleModalOpen(false);
      setDeletingId(deleteTargetId);
      const toastId = toast.loading("Sedang menghapus CV...");
      try {
         await api.deleteCV(deleteTargetId);
         toast.success("CV berhasil dihapus.", { id: toastId });
         clearApiCache();
         refetch();
      } catch (error: any) {
         toast.error(error.message || "Gagal menghapus CV", { id: toastId });
      } finally {
         setDeletingId(null);
         setDeleteTargetId(null);
      }
   };

   const handleDeleteAll = async () => {
      setIsDeleteAllModalOpen(false);
      setIsDeletingAll(true);
      const toastId = toast.loading(
         "Sedang menghapus semua CV dan file dari server...",
      );
      try {
         const result = await api.deleteAllCVs();
         toast.success(
            `${result.data?.deleted ?? result.deleted ?? safeUploads.length} CV berhasil dihapus secara permanen.`,
            { id: toastId },
         );
         clearApiCache();
         refetch();
         navigate("/dashboard");
      } catch (error: any) {
         toast.error(error.message || "Gagal menghapus semua CV", {
            id: toastId,
         });
      } finally {
         setIsDeletingAll(false);
      }
   };

   return (
      <PageWrapper title="Riwayat" className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
            <div className="space-y-1">
               <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Riwayat unggahan
               </h2>
               <p className="text-sm text-muted-foreground font-medium max-w-md">
                  Catatan lengkap semua unggahan CV dan hasil analisis Anda.
               </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto relative">
               <div className="relative flex-1 md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px] leading-none">
                     search
                  </span>
                  <Input
                     placeholder="Cari file..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="h-10 pl-10 pr-10 rounded-sm bg-card border-border focus:ring-primary/20 text-sm w-full"
                  />
               </div>

               <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DropdownMenuTrigger>
                     <button className="h-10 flex items-center justify-center gap-2 px-4 rounded-sm bg-card border border-border text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200 shadow-sm cursor-pointer">
                        <span className="material-symbols-outlined text-[20px] leading-none">
                           filter_list
                        </span>
                        Filter
                        {hasActiveFilters && (
                           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                     </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                     align="end"
                     className="w-72 rounded-sm border border-border bg-card p-4 shadow-2xl z-50 space-y-4"
                  >
                     <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="text-xs font-bold text-foreground">
                           Opsi filter
                        </span>
                        {hasActiveFilters && (
                           <button
                              onClick={resetFilters}
                              className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                           >
                              Reset semua
                           </button>
                        )}
                     </div>

                     <div className="space-y-3">
                        <div className="space-y-1.5">
                           <label className="text-[11px] font-bold text-muted-foreground">
                              Waktu unggah
                           </label>
                           <Select
                              value={dateFilter}
                              onChange={setDateFilter}
                              options={dateOptions}
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[11px] font-bold text-muted-foreground">
                              Status CV
                           </label>
                           <Select
                              value={statusFilter}
                              onChange={setStatusFilter}
                              options={statusOptions}
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[11px] font-bold text-muted-foreground">
                              Kesesuaian AI
                           </label>
                           <Select
                              value={scoreFilter}
                              onChange={setScoreFilter}
                              options={scoreOptions}
                              position="top"
                           />
                        </div>
                     </div>

                     <div className="flex justify-end pt-2 border-t border-border">
                        <button
                           onClick={() => setIsFilterOpen(false)}
                           className="w-full h-8 rounded-sm bg-foreground text-background text-xs font-bold shadow-md hover:opacity-90 transition-opacity duration-200 cursor-pointer"
                        >
                           Terapkan
                        </button>
                     </div>
                  </DropdownMenuContent>
               </DropdownMenu>

               {safeUploads.length > 0 && (
                  <button
                     onClick={() => setIsDeleteAllModalOpen(true)}
                     className="h-10 flex items-center justify-center gap-2 px-4 rounded-sm bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-950/50 hover:text-red-300 transition-colors duration-200 shadow-sm cursor-pointer shrink-0"
                  >
                     <span className="material-symbols-outlined text-[20px] leading-none">
                        delete_sweep
                     </span>
                     Hapus Semua
                  </button>
               )}
            </div>
         </div>

         <div className="space-y-6">
            {filteredUploads.length === 0 ? (
               <Card className="bg-card/50 border-border border-dashed rounded-lg">
                  <CardContent className="p-20 flex flex-col items-center justify-center text-center">
                     <span className="material-symbols-outlined text-[64px] text-muted-foreground/40 mb-6">
                        history
                     </span>
                     <h3 className="text-xl font-bold text-foreground tracking-tight">
                        Riwayat tidak ditemukan
                     </h3>
                     <p className="text-sm text-muted-foreground mt-2">
                        Coba sesuaikan pencarian atau opsi filter Anda.
                     </p>
                  </CardContent>
               </Card>
            ) : (
               <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {filteredUploads.map((upload) => (
                     <RecentUploadItem
                        key={upload.id}
                        upload={upload}
                        onDeleteRequest={handleDeleteSingleRequest}
                        isDeleting={deletingId === upload.id}
                     />
                  ))}
               </div>
            )}
         </div>

         <ConfirmationModal
            isOpen={isDeleteSingleModalOpen}
            title="Konfirmasi hapus CV"
            message="Apakah Anda yakin ingin menghapus CV ini beserta seluruh analisisnya? Tindakan ini tidak dapat dibatalkan."
            confirmText="Hapus"
            cancelText="Batal"
            onConfirm={handleDeleteSingleConfirm}
            onCancel={() => {
               setIsDeleteSingleModalOpen(false);
               setDeleteTargetId(null);
            }}
         />

         <ConfirmationModal
            isOpen={isDeleteAllModalOpen}
            title="Hapus semua CV"
            message={`Anda akan menghapus ${safeUploads.length} CV beserta seluruh file dan data analisis secara permanen dari akun dan server Anda. Tindakan ini tidak dapat dibatalkan.`}
            confirmText="Hapus Semua"
            cancelText="Batal"
            onConfirm={handleDeleteAll}
            onCancel={() => setIsDeleteAllModalOpen(false)}
         />

         {(isDeletingAll || deletingId !== null) && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md transition-opacity duration-300">
               <div className="bg-card border border-border p-8 rounded-xl max-w-sm w-full text-center space-y-4 shadow-2xl">
                  <span className="animate-spin material-symbols-outlined text-4xl text-red-500">
                     progress_activity
                  </span>
                  <div className="space-y-1">
                     <p className="text-lg font-bold text-foreground">
                        {isDeletingAll ? "Menghapus Semua Data" : "Menghapus CV"}
                     </p>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        {isDeletingAll
                           ? "Mohon tunggu, seluruh CV dan file sedang dihapus dari server."
                           : "Mohon tunggu, dokumen dan data analisis sedang dihapus dari server."}
                     </p>
                  </div>
               </div>
            </div>
         )}
      </PageWrapper>
   );
}
