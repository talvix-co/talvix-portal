import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface JobNotFoundProps {
  jobId?: string;
  errorType: 'JOB_NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'FETCH_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN';
  onRetry?: () => void;
}

export const JobNotFound: React.FC<JobNotFoundProps> = ({ jobId, errorType, onRetry }) => {
  const getErrorContent = () => {
    switch (errorType) {
      case 'JOB_NOT_FOUND':
        return {
          icon: (
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 6L6 18M6 6l12 12" />
            </svg>
          ),
          title: "Job Not Found",
          message: "The job position you're trying to access is no longer available or doesn't exist.",
          subMessage: jobId ? `Job ID: ${jobId}` : undefined,
          suggestion: "Please check if you have the correct link or contact the recruiter who shared this position with you."
        };

      case 'SERVER_ERROR':
        return {
          icon: (
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          title: "Server Error",
          message: "We're experiencing technical difficulties on our end.",
          suggestion: "Please try again in a few moments. If the problem persists, contact support."
        };

      case 'NETWORK_ERROR':
        return {
          icon: (
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 6L6 18M6 6l12 12" />
            </svg>
          ),
          title: "Connection Error",
          message: "Unable to connect to our servers.",
          suggestion: "Please check your internet connection and try again."
        };

      case 'UNAUTHORIZED':
      case 'FORBIDDEN':
        return {
          icon: (
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          ),
          title: "Access Denied",
          message: "You don't have permission to access this job posting.",
          suggestion: "Please sign in with the correct account or contact the recruiter who shared this link with you."
        };

      default:
        return {
          icon: (
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          title: "Something Went Wrong",
          message: "We encountered an unexpected error while loading this job.",
          suggestion: "Please try refreshing the page or contact support if the issue continues."
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            {content.icon}
          </div>
          <CardTitle className="text-2xl font-semibold">{content.title}</CardTitle>
          <p className="text-muted-foreground">{content.message}</p>
          {content.subMessage && (
            <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md mt-2 font-mono">
              {content.subMessage}
            </p>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {content.suggestion}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} className="flex-1 sm:flex-none">
                Try Again
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => window.location.href = 'mailto:support@talvix.co'}
              className="flex-1 sm:flex-none"
            >
              Contact Support
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              If you believe this is an error, please share this page URL with our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};