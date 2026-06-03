import React from 'react';

interface PageMessageProps {
  mensagem: string;
  tipo?: 'error' | 'success' | '';
}

export function PageMessage({ mensagem, tipo = '' }: PageMessageProps) {
  if (!mensagem) return null;
  return (
    <div
      className="page-message"
      role="alert"
      aria-live="polite"
      data-kind={tipo || undefined}
    >
      {mensagem}
    </div>
  );
}
