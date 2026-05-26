import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <Card className="rounded-lg overflow-hidden border border-border bg-card shadow-sm">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3.5 w-24 bg-muted/40 rounded-sm" />
            <Skeleton className="h-8 w-16 bg-muted/40 rounded-sm" />
            <Skeleton className="h-3 w-32 bg-muted/20 rounded-sm" />
          </div>
          <div className="shrink-0 flex items-center justify-center">
            <Skeleton className="w-9 h-9 bg-muted/30 rounded-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}