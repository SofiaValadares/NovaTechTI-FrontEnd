import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trocarSenha } from '../api/novatecktiApi';
import { ApiError } from '../api/http';
import { AppShell } from '../components/AppShell';
import { PageMessage } from '../components/PageMessage';
import { PasswordRules } from '../components/PasswordRules';
import { useAuth } from '../context/AuthContext';
import {
  validarConfirmacaoSenha,
  validarEmail,
  validarSenhaAv1,
} from '../utils/validation';

export default function TrocaSenhaPage() {
  const navigate = useNavigate();
  const { login: loginSessao } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState(loginSessao || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'error' | 'success' | ''>('');
  const [carregando, setCarregando] = useState(false);

  const validar = (): string | null => {
    if (!senhaAtual) return 'Informe a senha atual.';
    return (
      validarEmail(email) ||
      validarSenhaAv1(novaSenha) ||
      validarConfirmacaoSenha(novaSenha, confirmarSenha)
    );
  };

  const handleTrocar = async () => {
    const erro = validar();
    if (erro) {
      setMensagem(erro);
      setTipoMensagem('error');
      window.alert(erro);
      return;
    }
    setMensagem('');

    setCarregando(true);
    try {
      const resposta = await trocarSenha({
        login: email.trim(),
        senhaAtual,
        novaSenha,
      });
      if (resposta.status === 'SUCESSO') {
        const sucesso = 'Validação realizada com sucesso';
        setMensagem(sucesso);
        setTipoMensagem('success');
        window.alert(sucesso);
        navigate(-1);
        return;
      }
      setMensagem(resposta.mensagem || 'Não foi possível trocar a senha.');
      setTipoMensagem('error');
      window.alert(resposta.mensagem || 'Não foi possível trocar a senha.');
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Erro de comunicação com o servidor.';
      setMensagem(msg);
      setTipoMensagem('error');
      window.alert(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleLimpar = () => {
    setEmail(loginSessao || '');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    setMensagem('');
    setTipoMensagem('');
    emailRef.current?.focus();
  };

  return (
    <AppShell>
      <main className="app-page form-page trocarsenha">
        <section className="page-title">
          <h1>TROCA DE SENHA DE CLIENTES</h1>
        </section>

        <section className="campos form-card card-surface">
          <div className="input-group">
            <label htmlFor="email">Email (login)</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="senhaAtual">Senha atual</label>
            <input
              id="senhaAtual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="novaSenha">Nova senha</label>
            <input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmarSenha">Confirmação de senha</label>
            <input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
          <div className="input-group">
            <PasswordRules />
          </div>

          <div className="buttons-grup">
            <button type="button" onClick={handleTrocar} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Trocar Senha'}
            </button>
            <button type="button" className="limpar" onClick={handleLimpar}>
              Limpar
            </button>
          </div>

          <PageMessage mensagem={mensagem} tipo={tipoMensagem} />
        </section>
      </main>
    </AppShell>
  );
}
