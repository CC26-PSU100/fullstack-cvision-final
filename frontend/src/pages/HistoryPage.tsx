import { RecentUploadItem } from "@/components/dashboard/RecentUploadItem";
import { useRecentUploads } from "@/hooks/useRecentUploads";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";

export default function HistoryPage() {
  const { uploads } = useRecentUploads();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

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

  useEffect(() => {
    if (!searchQuery) {
      setDebouncedQuery("");
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredUploads = safeUploads.filter((upload) => {
    if (debouncedQuery && !upload.name.toLowerCase().includes(debouncedQuery.toLowerCase())) {
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
      if (scoreFilter === "medium" && (score < 75 || score >= 90)) return false;
      if (scoreFilter === "low" && score >= 75) return false;
    }

    return true;
  });

  const hasActiveFilters = dateFilter !== "all" || statusFilter !== "all" || scoreFilter !== "all";

  const resetFilters = () => {
    setDateFilter("all");
    setStatusFilter("all");
    setScoreFilter("all");
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
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>

          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="h-10 flex items-center justify-center gap-2 px-4 rounded-sm bg-card border border-border text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200 shadow-sm cursor-pointer"
              >
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
                <span className="text-xs font-bold text-foreground">Opsi filter</span>
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
              <RecentUploadItem key={upload.id} upload={upload} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
