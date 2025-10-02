import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { JobNotFound } from '../components/JobNotFound';
import { EmailNotVerified } from '../components/EmailNotVerified';
import { JobDetailSkeleton } from '../components/JobDetailSkeleton';
import { LoadingModal } from '../components/ui/loading-modal';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../hooks/useNotification';
import { supabase } from '../lib/supabase';
import { getJobById, applyForJob } from '../services/api';
import { extractTextFromFile } from '../utils/fileUtils';
import type { Job } from '../types/api';

export const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'JOB_NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'FETCH_ERROR' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check authentication first
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Check if user's email is verified
  // Note: Replace this with your backend's email verification check
  const isEmailVerified = () => {
    // This is a placeholder - your backend should handle email verification status
    // You can check user.email_confirmed_at in Supabase or call your API
    return true; // For now, assume verified - replace with actual logic
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  // Progress simulation for upload
  const simulateUploadProgress = (duration: number) => {
    const interval = 50;
    const increment = 100 / (duration / interval);
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        setUploadProgress(100);
        clearInterval(progressInterval);
      } else {
        setUploadProgress(currentProgress);
      }
    }, interval);

    return progressInterval;
  };

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId || !user) return;

      try {
        setLoading(true);
        setError(null);

        // Get access token from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          // If no valid session, redirect to login
          navigate('/login');
          return;
        }

        const jobData = await getJobById(jobId, session.access_token);
        setJob(jobData);
      } catch (err) {
        if (err instanceof Error && ['JOB_NOT_FOUND', 'SERVER_ERROR', 'NETWORK_ERROR', 'FETCH_ERROR', 'UNAUTHORIZED', 'FORBIDDEN'].includes(err.message)) {
          // Handle authentication errors by redirecting to login
          if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
            navigate('/login');
            return;
          }
          setError(err.message as 'JOB_NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'FETCH_ERROR');
        } else {
          setError('FETCH_ERROR');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchJob();
    }
  }, [jobId, user, authLoading, navigate]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const file = files[0]; // Only take the first file
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (validTypes.includes(file.type)) {
      setSelectedFile(file);
      showSuccess("Resume uploaded successfully");
    } else {
      showWarning(
        `Invalid file format: ${file.name}. Please upload PDF, DOC, or DOCX files only.`,
      );
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    showSuccess("Resume removed successfully");
  };

  const handleApplyForJob = async () => {
    if (!selectedFile) {
      showWarning("Please select a resume file to apply.");
      return;
    }

    if (!jobId) {
      showError("Job ID not found.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get access token from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        showError("Authentication error. Please sign in again.");
        navigate('/login');
        return;
      }

      // Start progress simulation
      const progressInterval = simulateUploadProgress(3000);

      // Extract text from the selected file
      const resumeText = await extractTextFromFile(selectedFile);

      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Submit application
      await applyForJob(jobId, resumeText, session.access_token);

      // If we get here, it was successful (200 response)
      showSuccess("Application submitted successfully!");
      setSelectedFile(null); // Clear file after successful submission

    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
          showError("Authentication error. Please sign in again.");
          navigate('/login');
          return;
        } else if (error.message === 'JOB_NOT_FOUND') {
          showError("This job position is no longer available.");
        } else if (error.message === 'SERVER_ERROR') {
          showError("Server error. Please try again later.");
        } else if (error.message === 'NETWORK_ERROR') {
          showError("Network error. Please check your connection and try again.");
        } else {
          showError("Failed to extract text from resume. Please try a different file format.");
        }
      } else {
        showError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show skeleton while checking authentication or fetching job
  if (authLoading || loading) {
    return <JobDetailSkeleton />;
  }

  // Check if email is verified (once user is authenticated)
  if (user && !isEmailVerified()) {
    return <EmailNotVerified />;
  }

  const handleRetry = async () => {
    if (jobId) {
      setLoading(true);
      setError(null);

      try {
        // Get access token from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          // If no valid session, redirect to login
          navigate('/login');
          return;
        }

        const jobData = await getJobById(jobId, session.access_token);
        setJob(jobData);
      } catch (err) {
        if (err instanceof Error && ['JOB_NOT_FOUND', 'SERVER_ERROR', 'NETWORK_ERROR', 'FETCH_ERROR', 'UNAUTHORIZED', 'FORBIDDEN'].includes(err.message)) {
          // Handle authentication errors by redirecting to login
          if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
            navigate('/login');
            return;
          }
          setError(err.message as 'JOB_NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'FETCH_ERROR');
        } else {
          setError('FETCH_ERROR');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (error) {
    return <JobNotFound jobId={jobId} errorType={error} onRetry={handleRetry} />;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Logout */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleLogout}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </Button>
        </div>

        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Job Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <p className="text-muted-foreground">
              Upload your resume to apply for this position. Supported formats: PDF, DOC, DOCX
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Drop your files here, or{" "}
                      <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
                        browse
                      </label>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, DOCX files up to 10MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Selected File */}
              {selectedFile && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Selected Resume</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="pt-4">
                <Button
                  className="w-full"
                  disabled={!selectedFile || isUploading}
                  onClick={handleApplyForJob}
                >
                  {isUploading ? "Submitting Application..." : "Apply for Position"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Modal */}
      <LoadingModal
        isOpen={isUploading}
        title="Submitting Application"
        progress={uploadProgress}
        description="Please wait while we process your resume and submit your application..."
      />
    </div>
  );
};