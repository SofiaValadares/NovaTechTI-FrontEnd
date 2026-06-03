import React from 'react';
import { useApiStatus } from '../context/ApiStatusContext';
import BackendOfflinePage from '../pages/BackendOfflinePage';

export function BackendGate({ children }: { children: React.ReactNode }) {
  const { status } = useApiStatus();

  if (status === 'checking') {
    return (
      <div className="backend-checking" role="status" aria-live="polite">
        <div className="backend-checking__spinner" aria-hidden="true" />
        <p>Conectando à API NovaTech TI...</p>
      </div>
    );
  }

  if (status === 'offline') {
    return <BackendOfflinePage />;
  }

  return <>{children}</>;
}
