import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { autenticar } from '../api/novatecktiApi';
import { ApiError } from '../api/http';
import { AppShell } from '../components/AppShell';
import { PageMessage } from '../components/PageMessage';
import { useAuth } from '../context/AuthContext';
import { validarEmail, validarSenhaPreenchida } from '../utils/validation';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, refreshPerfil } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'error' | 'success' | ''>('');
  const [carregando, setCarregando] = useState(false);

  const validar = (): boolean => {
    const emailErro = validarEmail(email);
    const senhaErro = validarSenhaPreenchida(senha);
    if (emailErro) {
      setMensagem(emailErro);
      setTipoMensagem('error');
      return false;
    }
    if (senhaErro) {
      setMensagem(senhaErro);
      setTipoMensagem('error');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setMensagem('');
    if (!validar()) return;

    setCarregando(true);
    try {
      const resposta = await autenticar({ login: email.trim(), senha });
      if (resposta.status === 'SUCESSO' && resposta.autenticado) {
        signIn(email.trim());
        await refreshPerfil();
        const sucesso = 'Validação realizada com sucesso';
        setMensagem(sucesso);
        setTipoMensagem('success');
        window.alert(sucesso);
        navigate('/');
        return;
      }
      setMensagem(resposta.mensagem || 'Login ou senha inválidos.');
      setTipoMensagem('error');
    } catch (error) {
      setMensagem(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.'
      );
      setTipoMensagem('error');
    } finally {
      setCarregando(false);
    }
  };

  const handleLimpar = () => {
    setEmail('');
    setSenha('');
    setMensagem('');
    setTipoMensagem('');
    emailRef.current?.focus();
  };

  return (
    <AppShell>
      <main className="app-page form-page login">
        <section className="page-title">
          <h1>LOGIN DE CLIENTES</h1>
        </section>

        <section className="campos form-card card-surface" aria-label="Formulário de login">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="buttons-grup">
            <button type="button" onClick={handleLogin} disabled={carregando}>
              {carregando ? 'Entrando...' : 'Realizar Login'}
            </button>
            <button type="button" className="limpar" onClick={handleLimpar}>
              Limpar
            </button>
          </div>

          <PageMessage mensagem={mensagem} tipo={tipoMensagem} />
        </section>

        <section className="form-links">
          <Link to="/troca-senha">
            <span className="material-icons">arrow_forward</span>
            Recuperar senha
          </Link>
          <Link to="/cadastro">
            <span className="material-icons">arrow_forward</span>
            Realizar cadastro
          </Link>
        </section>
      </main>
    </AppShell>
  );
}
