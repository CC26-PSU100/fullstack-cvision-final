import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  description?: string;
}

export function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <Card className="rounded-lg overflow-hidden border border-border bg-card shadow-sm">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground/60">
              {label}
            </p>
            <h3 className="text-3xl font-bold text-foreground">
              {value}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-foreground/40 text-4xl">
              {icon}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}