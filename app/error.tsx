'use client';

import { Shield, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="bg-red-500/20 p-4 rounded-2xl w-fit mx-auto mb-6">
          <Shield className="h-12 w-12 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong!
        </h2>
        
        <p className="text-text-secondary mb-6">
          We encountered an error while loading RightsGuard. This might be a temporary issue.
        </p>
        
        <button
          onClick={reset}
          className="btn-primary flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try again</span>
        </button>
        
        {error.digest && (
          <p className="text-xs text-text-secondary mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
