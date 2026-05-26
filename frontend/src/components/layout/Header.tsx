import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { toggle, isOpen } = useSidebar();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-20 items-center gap-4 px-4 md:px-8",
        "bg-background/80 backdrop-blur-xl transition-all duration-200 border-b border-border"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-sm transition-colors duration-200 cursor-pointer"
        onClick={toggle}
        aria-label={isOpen ? "Tutup bilah sisi" : "Buka bilah sisi"}
      >
        <span className={cn(
          "material-symbols-outlined transition-transform duration-300",
          isOpen ? "rotate-0" : "rotate-180"
        )}>
          {isOpen ? "menu_open" : "menu"}
        </span>
      </Button>

      <div className="h-6 w-px bg-border mx-1 hidden md:block" />

      <h1 className="text-2xl font-bold tracking-tight text-foreground font-[family-name:var(--font-family-heading)]">
        {title}
      </h1>
    </header>
  );
}