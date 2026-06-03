import React from 'react';
import {
  BACKEND_CLONE_COMMAND,
  BACKEND_DEFAULT_URL,
  BACKEND_REPO_URL,
  BACKEND_RUN_COMMAND,
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

        <h1>Backend não está rodando</h1>
        <p className="backend-offline__lead">
          O frontend (incluindo no <strong>Vercel</strong>) precisa falar com a API
          Spring Boot na sua máquina. Enquanto o servidor não responder em{' '}
          <code>{apiUrl}</code>, o aplicativo fica pausado aqui.
        </p>

        <div className="backend-offline__status">
          <span className="backend-offline__dot" aria-hidden="true" />
          {verificando ? 'Verificando conexão...' : 'Aguardando o backend local'}
        </div>

        <section className="backend-offline__section">
          <h2>1. Repositório no GitHub</h2>
          <a
            href={BACKEND_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="link-pill"
          >
            {BACKEND_REPO_URL}
          </a>
        </section>

        <section className="backend-offline__section">
          <h2>2. Clonar (se ainda não tiver)</h2>
          <pre className="backend-offline__code">
            <code>{BACKEND_CLONE_COMMAND}</code>
          </pre>
          <p className="backend-offline__hint">cd NovaTeckTi-BackEnd</p>
        </section>

        <section className="backend-offline__section">
          <h2>3. Subir a API (JDK 17+)</h2>
          <pre className="backend-offline__code">
            <code>{BACKEND_RUN_COMMAND}</code>
          </pre>
          <p className="backend-offline__hint">
            API disponível em <code>{BACKEND_DEFAULT_URL}</code>
          </p>
        </section>

        <section className="backend-offline__section backend-offline__vercel">
          <h2>Site no Vercel + backend na sua máquina</h2>
          <ul>
            <li>
              <strong>Não precisa</strong> criar variável de ambiente no Vercel — a
              API já aponta para <code>{BACKEND_DEFAULT_URL}</code>.
            </li>
            <li>
              Abra o link do Vercel <strong>no mesmo computador</strong> onde você
              rodou <code>{BACKEND_RUN_COMMAND}</code>.
            </li>
            <li>
              Usuário de teste: <code>admin@novatech.com</code> /{' '}
              <code>Admin@123</code>
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
