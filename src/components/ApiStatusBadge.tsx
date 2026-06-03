import React from 'react';
import { useApiStatus } from '../context/ApiStatusContext';

const LABELS: Record<string, string> = {
  checking: 'Verificando API...',
  online: 'API conectada',
  offline: 'API indisponível',
};

export function ApiStatusBadge() {
  const { status, apiUrl, lastChecked, refresh } = useApiStatus();

  const horario =
    lastChecked &&
    lastChecked.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <button
      type="button"
      className={`api-status api-status--${status}`}
      onClick={refresh}
      title={`${apiUrl}${horario ? ` · ${horario}` : ''}`}
      aria-live="polite"
    >
      <span className="api-status__dot" aria-hidden="true" />
      <span className="api-status__text">{LABELS[status]}</span>
    </button>
  );
}
