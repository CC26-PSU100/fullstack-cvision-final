import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

export function AppShell() {
  const { isOpen, close } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isOpen} onClose={close} />

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isOpen ? "lg:pl-64" : "lg:pl-0"
        )}
      >
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}