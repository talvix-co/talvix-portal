import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const EmailVerification = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold">Verify Your Email</CardTitle>
          <p className="text-muted-foreground">
            We've sent a verification email to <span className="font-medium text-foreground">{email}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the verification link to activate your account.
            </p>

            <div className="bg-secondary/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Didn't receive the email?</p>
              <p className="text-muted-foreground">
                • Check your spam/junk folder
                <br />
                • Make sure the email address is correct
                <br />
                • Wait a few minutes for the email to arrive
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => window.location.reload()}
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
              Having trouble? Contact our support team for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};