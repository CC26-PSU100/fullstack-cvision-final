import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <Card className="bg-card border-border/40 rounded-2xl overflow-hidden shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24 bg-muted/40 rounded-full" />
            <Skeleton className="h-8 w-16 bg-muted/40 rounded-lg" />
            <Skeleton className="h-2 w-32 bg-muted/20 rounded-full" />
          </div>
          <Skeleton className="w-14 h-14 rounded-2xl bg-muted/30" />
        </div>
      </CardContent>
    </Card>
  );
}