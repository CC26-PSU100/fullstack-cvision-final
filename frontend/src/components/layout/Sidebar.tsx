import { NavLink, useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavItems = [
  { to: "/dashboard", label: "Beranda", icon: "grid_view" },
  { to: "/history", label: "Riwayat", icon: "history" },
];

const bottomNavItems = [
  { to: "/settings", label: "Pengaturan", icon: "settings" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { id } = useParams();
  const isAnalysisPage = window.location.pathname.startsWith("/analysis/");
  const navigate = useNavigate();

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border",
          "w-72 transition-transform duration-200 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onClose={onClose} isMobile={true} activeId={id} isAnalysis={isAnalysisPage} navigate={navigate} />
      </aside>

      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border",
          "transition-all duration-200 ease-in-out z-40",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent isMobile={false} activeId={id} isAnalysis={isAnalysisPage} navigate={navigate} />
      </aside>
    </>
  );
}

function SidebarContent({
  onClose,
  isMobile,
  activeId,
  isAnalysis,
  navigate
}: {
  onClose?: () => void;
  isMobile: boolean;
  activeId?: string;
  isAnalysis: boolean;
  navigate: any;
}) {
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : "??";
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Berhasil keluar");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-7 py-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-foreground text-3xl">
            description
          </span>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            CVision
          </span>
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="rounded-sm border border-border cursor-pointer flex items-center justify-center w-10 h-10 hover:bg-muted text-foreground transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        )}
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto py-2">
        <section className="space-y-1.5">
          <p className="px-3 text-xs font-bold text-foreground/40 mb-3">Menu Utama</p>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold transition-colors duration-200 cursor-pointer",
                  "text-foreground/60 hover:text-foreground hover:bg-muted",
                  isActive && "bg-foreground text-background shadow-md hover:bg-foreground hover:text-background"
                )
              }
            >
              <span className="material-symbols-outlined text-[20px] leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </section>

        {isAnalysis && (
          <section className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-200">
            <p className="px-3 text-xs font-bold text-foreground/40 mb-3">Analisis Aktif</p>
            <NavLink
              to={`/analysis/${activeId}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold bg-muted text-foreground border border-border shadow-sm cursor-pointer transition-colors duration-200"
              )}
            >
              <span className="material-symbols-outlined text-[20px] leading-none text-primary">analytics</span>
              Laporan saat ini
            </NavLink>
          </section>
        )}

        <section className="space-y-1.5 pt-4 border-t border-border">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold transition-colors duration-200 cursor-pointer",
                  "text-foreground/60 hover:text-foreground hover:bg-muted",
                  isActive && "bg-foreground text-background shadow-md hover:bg-foreground hover:text-background"
                )
              }
            >
              <span className="material-symbols-outlined text-[20px] leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </section>
      </div>

      <div className="p-4 mt-auto border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full focus:outline-none group cursor-pointer">
            <div
              className={cn(
                "flex items-center gap-3 w-full p-2.5 rounded-sm transition-colors duration-200",
                "hover:bg-muted border border-transparent hover:border-border text-left cursor-pointer"
              )}
            >
              <Avatar className="w-9 h-9 border border-border shadow-md rounded-sm">
                <AvatarFallback className="bg-muted text-foreground text-xs font-black rounded-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.name || "Tamu"}
                </p>
                <p className="text-xs text-foreground/60 truncate font-medium">
                  {user?.email || "tamu@cvision.com"}
                </p>
              </div>
              <span className="material-symbols-outlined text-foreground/30 text-lg group-hover:text-foreground/60 transition-colors duration-200">
                unfold_more
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            className="w-56 rounded-sm border border-border p-1.5 shadow-xl bg-card"
          >
            <DropdownMenuItem
              onClick={() => setIsLogoutModalOpen(true)}
              className="rounded-sm py-2 cursor-pointer text-red-500 focus:text-red-400 focus:bg-red-950/30 gap-3 transition-colors duration-200"
            >
              <span className="material-symbols-outlined opacity-70">logout</span>
              <span className="font-medium">Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Konfirmasi keluar"
        message="Apakah Anda yakin ingin keluar dari akun Anda?"
        confirmText="Keluar"
        cancelText="Batal"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}
