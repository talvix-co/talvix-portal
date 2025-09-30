import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoadingModalProps {
  isOpen: boolean;
  title: string;
  progress: number;
  description?: string;
}

export const LoadingModal = ({
  isOpen,
  title,
  progress,
  description = "Please wait while we process your request..."
}: LoadingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <Card className="relative bg-card border border-border shadow-2xl min-w-[320px] max-w-[400px] mx-4">
        <CardContent className="p-6 flex flex-col items-center space-y-6">
          {/* Title */}
          <h3 className="text-lg font-semibold text-card-foreground text-center">
            {title}
          </h3>

          {/* Progress */}
          <div className="w-full space-y-2">
            <Progress
              value={progress}
              className="h-2 bg-muted"
            />
            <div className="flex justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center italic">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};