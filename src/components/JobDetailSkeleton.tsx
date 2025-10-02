import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const JobDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Sign Out Button Skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Job Details Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-8 w-64" /> {/* Job Title */}
                <Skeleton className="h-6 w-32" /> {/* Badge */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-6 w-32 mb-2" /> {/* "Job Description" title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" /> {/* "Upload Your Resume" title */}
            <Skeleton className="h-4 w-96" /> {/* Subtitle */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Drag and Drop Area Skeleton */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto" /> {/* Upload icon */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-64 mx-auto" /> {/* Main text */}
                    <Skeleton className="h-4 w-48 mx-auto" /> {/* Subtitle */}
                  </div>
                </div>
              </div>

              {/* Apply Button Skeleton */}
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};