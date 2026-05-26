import { Card, CardContent } from "@/components/ui/card";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md border border-border bg-card rounded-lg shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <CardContent className="p-0 space-y-4 bg-card text-foreground">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-sm border border-border bg-card text-foreground/60 text-sm font-semibold hover:bg-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-sm bg-red-950/30 border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-950/70 hover:text-red-400 transition-colors duration-200 cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
