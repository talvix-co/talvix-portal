import type { Job } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getJobById = async (jobId: string, accessToken: string): Promise<Job> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      } else if (response.status === 403) {
        throw new Error('FORBIDDEN');
      } else if (response.status === 404) {
        throw new Error('JOB_NOT_FOUND');
      } else if (response.status >= 500) {
        throw new Error('SERVER_ERROR');
      } else {
        throw new Error('FETCH_ERROR');
      }
    }

    const job: Job = await response.json();
    return job;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw our custom errors
      if (['JOB_NOT_FOUND', 'SERVER_ERROR', 'FETCH_ERROR', 'UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
        throw error;
      }
    }

    // Network or other unexpected errors
    throw new Error('NETWORK_ERROR');
  }
};

export const applyForJob = async (
  jobId: string,
  resumeText: string,
  accessToken: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      } else if (response.status === 403) {
        throw new Error('FORBIDDEN');
      } else if (response.status === 404) {
        throw new Error('JOB_NOT_FOUND');
      } else if (response.status >= 500) {
        throw new Error('SERVER_ERROR');
      } else {
        throw new Error('APPLICATION_ERROR');
      }
    }

    // Success - just return, no response body expected
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw our custom errors
      if (['JOB_NOT_FOUND', 'SERVER_ERROR', 'APPLICATION_ERROR', 'UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
        throw error;
      }
    }

    // Network or other unexpected errors
    throw new Error('NETWORK_ERROR');
  }
};