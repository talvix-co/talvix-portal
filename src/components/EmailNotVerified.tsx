import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';

export const EmailNotVerified = () => {
  const { user } = useAuth();

  const handleResendVerification = async () => {
    // Note: This will be handled by your backend/Supabase
    // You can implement the resend logic here if needed
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold">Email Verification Required</CardTitle>
          <p className="text-muted-foreground">
            Please verify your email address to access job opportunities
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm">
              We've sent a verification email to{' '}
              <span className="font-medium text-foreground">{user?.email}</span>
            </p>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2 text-amber-800 dark:text-amber-200">
                Why verify your email?
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                Email verification ensures secure access to job opportunities and protects both
                candidates and recruiters from unauthorized access.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-left">
              <p className="font-medium mb-2">Didn't receive the email?</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes for the email to arrive</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </Button>

            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to="/login">
                Back to Sign In
              </Link>
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              Having trouble? Contact our support team at{' '}
              <a href="mailto:support@talvix.co" className="text-primary hover:underline">
                support@talvix.co
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};