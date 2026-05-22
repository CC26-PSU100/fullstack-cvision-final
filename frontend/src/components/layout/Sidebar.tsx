import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  const location = useLocation();
  const navigate = useNavigate();
  const isAnalysisPage = location.pathname.startsWith("/analysis/");

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-white/5",
          "w-72 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onClose={onClose} isMobile={true} activeId={id} isAnalysis={isAnalysisPage} navigate={navigate} />
      </aside>

      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-white/5",
          "transition-all duration-300 ease-in-out z-40",
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

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Berhasil keluar");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-7 py-8">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
          <span className="material-symbols-outlined text-foreground text-[20px]">
            auto_awesome
          </span>
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          CVision
        </span>
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto py-2">
        <section className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 mb-3">Menu Utama</p>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  "text-foreground/60 hover:text-foreground hover:bg-white/5",
                  isActive && "bg-foreground text-background shadow-lg shadow-black/20 hover:bg-foreground hover:text-background"
                )
              }
            >
              <span className="material-symbols-outlined text-[20px] leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </section>

        {isAnalysis && (
          <section className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-500">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 mb-3">Analisis Aktif</p>
            <NavLink
              to={`/analysis/${activeId}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-foreground border border-white/10 shadow-sm"
              )}
            >
              <span className="material-symbols-outlined text-[20px] leading-none text-primary">analytics</span>
              Laporan Saat Ini
            </NavLink>
          </section>
        )}

        <section className="space-y-1.5 pt-4 border-t border-white/5">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  "text-foreground/60 hover:text-foreground hover:bg-white/5",
                  isActive && "bg-foreground text-background shadow-lg shadow-black/20 hover:bg-foreground hover:text-background"
                )
              }
            >
              <span className="material-symbols-outlined text-[20px] leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </section>
      </div>

      <div className="p-4 mt-auto border-t border-white/5">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full focus:outline-none group">
            <div
              className={cn(
                "flex items-center gap-3 w-full p-2.5 rounded-2xl transition-all duration-300",
                "hover:bg-white/5 border border-transparent hover:border-white/10 text-left cursor-pointer"
              )}
            >
              <Avatar className="w-9 h-9 border-2 border-background shadow-md">
                <AvatarFallback className="bg-muted text-foreground text-xs font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.name || "Tamu"}
                </p>
                <p className="text-[10px] text-foreground/40 truncate font-medium uppercase tracking-wide">
                  {user?.email || "tamu@cvision.com"}
                </p>
              </div>
              <span className="material-symbols-outlined text-foreground/20 text-lg group-hover:text-foreground/40 transition-colors">
                unfold_more
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            className="w-56 rounded-xl border-border/40 p-1.5 shadow-xl"
          >
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-lg py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <span className="material-symbols-outlined mr-3 text-lg opacity-70">logout</span>
              <span className="font-medium">Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
