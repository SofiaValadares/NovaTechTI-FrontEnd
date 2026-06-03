import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarCliente } from '../api/novatecktiApi';
import { ApiError } from '../api/http';
import { AppShell } from '../components/AppShell';
import { PageMessage } from '../components/PageMessage';
import { EstadoCivilSelector } from '../components/EstadoCivilSelector';
import { PasswordRules } from '../components/PasswordRules';
import {
  DEFAULT_ESCOLARIDADE,
  DEFAULT_ESTADO_CIVIL,
  ESCOLARIDADES,
} from '../constants/formOptions';
import { useAuth } from '../context/AuthContext';
import {
  formatarCpf,
  formatarTelefone,
  validarConfirmacaoSenha,
  validarCpf,
  validarDataNascimento,
  validarEmail,
  validarNome,
  validarSenhaAv1,
  validarTelefone,
} from '../utils/validation';

export default function CadastroClientePage() {
  const navigate = useNavigate();
  const { signIn, refreshPerfil } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [estadoCivil, setEstadoCivil] = useState(DEFAULT_ESTADO_CIVIL);
  const [escolaridade, setEscolaridade] = useState(DEFAULT_ESCOLARIDADE);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'error' | 'success' | ''>('');
  const [carregando, setCarregando] = useState(false);

  const validar = (): string | null => {
    return (
      validarNome(nome) ||
      validarCpf(cpf) ||
      validarEmail(email) ||
      validarSenhaAv1(senha) ||
      validarConfirmacaoSenha(senha, confirmarSenha) ||
      validarDataNascimento(dataNascimento) ||
      validarTelefone(telefone)
    );
  };

  const handleIncluir = async () => {
    const erro = validar();
    if (erro) {
      setMensagem(erro);
      setTipoMensagem('error');
      window.alert(erro);
      return;
    }

    setCarregando(true);
    setMensagem('');
    try {
      const resposta = await cadastrarCliente({
        nome: nome.trim(),
        login: email.trim(),
        senha,
        cpf: cpf.trim(),
        dataNascimento,
        telefone: telefone.trim(),
        estadoCivil,
        escolaridade,
      });

      if (resposta.status === 'SUCESSO') {
        const sucesso = 'Validação realizada com sucesso';
        setMensagem(sucesso);
        setTipoMensagem('success');
        signIn(email.trim(), nome.trim());
        await refreshPerfil();
        window.alert(sucesso);
        navigate('/');
        return;
      }

      setMensagem(resposta.mensagem || 'Erro ao cadastrar cliente.');
      setTipoMensagem('error');
      window.alert(resposta.mensagem || 'Erro ao cadastrar cliente.');
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
    setNome('');
    setCpf('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setDataNascimento('');
    setTelefone('');
    setEstadoCivil(DEFAULT_ESTADO_CIVIL);
    setEscolaridade(DEFAULT_ESCOLARIDADE);
    setMensagem('');
    setTipoMensagem('');
    emailRef.current?.focus();
  };

  const handleVoltar = () => navigate(-1);

  const handleCpfChange = (valor: string) => setCpf(formatarCpf(valor));
  const handleTelefoneChange = (valor: string) => setTelefone(formatarTelefone(valor));

  return (
    <AppShell>
      <main className="app-page form-page cadastro">
        <section className="page-title">
          <h1>CADASTRO DE CLIENTES</h1>
        </section>

        <section className="campos form-card card-surface">
          <div className="input-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>
          <div className="input-group">
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              value={cpf}
              onChange={(e) => handleCpfChange(e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha-confirmar">Confirmação de senha</label>
            <input
              id="senha-confirmar"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
          <div className="input-group">
            <PasswordRules />
          </div>
          <div className="input-group">
            <label htmlFor="data-nascimento">Data de nascimento</label>
            <input
              id="data-nascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="telefone">Telefone / WhatsApp (opcional)</label>
            <input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => handleTelefoneChange(e.target.value)}
              placeholder="(DDD) 9XXXX-XXXX"
            />
          </div>
          <div className="input-group input-group--estado-civil">
            <EstadoCivilSelector
              value={estadoCivil}
              onChange={setEstadoCivil}
            />
          </div>
          <div className="input-group">
            <label htmlFor="escolaridade">Escolaridade</label>
            <select
              id="escolaridade"
              value={escolaridade}
              onChange={(e) => setEscolaridade(e.target.value)}
            >
              {ESCOLARIDADES.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          </div>

          <div className="buttons-grup">
            <button type="button" onClick={handleIncluir} disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Incluir'}
            </button>
            <button type="button" className="limpar" onClick={handleLimpar}>
              Limpar
            </button>
            <button type="button" onClick={handleVoltar}>
              Voltar
            </button>
          </div>

          <PageMessage mensagem={mensagem} tipo={tipoMensagem} />
        </section>
      </main>
    </AppShell>
  );
}
