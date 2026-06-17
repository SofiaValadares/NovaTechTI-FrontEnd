import React from 'react';
import {
  BACKEND_RENDER_URL,
  BACKEND_REPO_URL,
} from '../constants/backend';
import { useApiStatus } from '../context/ApiStatusContext';

export default function BackendOfflinePage() {
  const { apiUrl, refresh, status } = useApiStatus();
  const verificando = status === 'checking';

  return (
    <div className="backend-offline">
      <div className="backend-offline__card card-surface">
        <img
          src={`${process.env.PUBLIC_URL}/assets/logo/logo03.png`}
          alt="NovaTech TI"
          className="backend-offline__logo"
        />

        <h1>API indisponível no momento</h1>
        <p className="backend-offline__lead">
          Não foi possível conectar à API em <code>{apiUrl}</code>. No plano
          gratuito da Render, o servidor pode <strong>dormir</strong> após alguns
          minutos sem uso — a primeira requisição pode levar até 1 minuto para
          acordar.
        </p>

        <div className="backend-offline__status">
          <span className="backend-offline__dot" aria-hidden="true" />
          {verificando ? 'Verificando conexão...' : 'Aguardando a API responder'}
        </div>

        <section className="backend-offline__section">
          <h2>O que fazer</h2>
          <ul className="backend-offline__lista">
            <li>
              Clique em <strong>Tentar novamente</strong> e aguarde ~30–60s (cold
              start).
            </li>
            <li>
              Confira o status no Render:{' '}
              <a
                href={BACKEND_RENDER_URL}
                target="_blank"
                rel="noreferrer"
                className="link-pill"
              >
                {BACKEND_RENDER_URL}
              </a>
            </li>
            <li>
              Teste direto:{' '}
              <a
                href={`${BACKEND_RENDER_URL}/api/health`}
                target="_blank"
                rel="noreferrer"
              >
                /api/health
              </a>{' '}
              — deve retornar <code>{'{"status":"UP"}'}</code>
            </li>
          </ul>
        </section>

        <section className="backend-offline__section">
          <h2>Repositório do backend</h2>
          <a
            href={BACKEND_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="link-pill"
          >
            {BACKEND_REPO_URL}
          </a>
        </section>

        <section className="backend-offline__section backend-offline__vercel">
          <h2>Login de teste</h2>
          <ul>
            <li>
              E-mail: <code>admin@novatech.com</code>
            </li>
            <li>
              Senha: <code>Admin@123</code>
            </li>
          </ul>
        </section>

        <button
          type="button"
          className="backend-offline__retry"
          onClick={refresh}
          disabled={verificando}
        >
          {verificando ? 'Verificando...' : 'Tentar novamente'}
        </button>
      </div>
    </div>
  );
}
