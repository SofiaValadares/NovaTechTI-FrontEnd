import React from 'react';
import { Link } from 'react-router-dom';
import { ApiStatusBadge } from './ApiStatusBadge';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="header" role="banner">
      <Link to="/" className="header-brand" aria-label="NovaTech TI - início">
        <img
          src={`${process.env.PUBLIC_URL}/assets/logo/logo03.png`}
          className="logo"
          alt="Logo NovaTech TI"
        />
        <h1>Soluções Inteligentes em TI</h1>
      </Link>

      <div className="header-right">
        <ApiStatusBadge />
        <nav aria-label="Menu principal">
          <Link to="/">
            <span className="material-icons" aria-hidden="true">
              home
            </span>
            Home
          </Link>
          {!isAuthenticated && (
            <>
              <Link to="/login">
                <span className="material-icons" aria-hidden="true">
                  login
                </span>
                Login
              </Link>
              <Link to="/cadastro">
                <span className="material-icons" aria-hidden="true">
                  person_add
                </span>
                Cadastro
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link to="/servicos">
                <span className="material-icons" aria-hidden="true">
                  engineering
                </span>
                Solicitar Serviços
              </Link>
              <Link to="/cadastro-servico">
                <span className="material-icons" aria-hidden="true">
                  add_circle
                </span>
                Novo Serviço
              </Link>
              <button type="button" className="btn-logout" onClick={signOut}>
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
