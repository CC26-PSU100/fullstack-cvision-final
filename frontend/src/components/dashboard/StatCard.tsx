import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  description?: string;
}

export function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <Card className="rounded-2xl md:rounded-3xl overflow-hidden border-border/40 shadow-sm">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase">
              {label}
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              {value}
            </h3>
            {description && (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/50 border border-border/40">
                <span className="w-1 h-1 rounded-full bg-foreground/20" />
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {description}
                </p>
              </div>
            )}
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-foreground/40 text-2xl">
              {icon}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}