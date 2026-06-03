import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cadastrarServicoTi } from '../api/novatecktiApi';
import { ApiError } from '../api/http';
import { AppShell } from '../components/AppShell';
import { PageMessage } from '../components/PageMessage';
import {
  parsePreco,
  validarCampoObrigatorio,
  validarPrazoDias,
  validarPreco,
} from '../utils/validation';

export default function CadastroServicoPage() {
  const nomeRef = useRef<HTMLInputElement>(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [prazoDias, setPrazoDias] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'error' | 'success' | ''>('');
  const [carregando, setCarregando] = useState(false);

  const validar = (): string | null => {
    return (
      validarCampoObrigatorio(nome, 'Nome do serviço') ||
      validarPreco(preco) ||
      validarPrazoDias(prazoDias)
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
    try {
      const resposta = await cadastrarServicoTi({
        nome: nome.trim(),
        preco: parsePreco(preco),
        prazoDias: Number(prazoDias),
      });

      if (resposta.status === 'SUCESSO') {
        setMensagem('Serviço cadastrado com sucesso!');
        setTipoMensagem('success');
        setNome('');
        setPreco('');
        setPrazoDias('');
        nomeRef.current?.focus();
        return;
      }

      setMensagem(resposta.mensagem || 'Erro ao cadastrar serviço.');
      setTipoMensagem('error');
    } catch (error) {
      setMensagem(
        error instanceof ApiError
          ? error.message
          : 'Erro de comunicação com o servidor.'
      );
      setTipoMensagem('error');
    } finally {
      setCarregando(false);
    }
  };

  const handleLimpar = () => {
    setNome('');
    setPreco('');
    setPrazoDias('');
    setMensagem('');
    setTipoMensagem('');
    nomeRef.current?.focus();
  };

  return (
    <AppShell>
      <main className="app-page form-page cadastro">
        <section className="page-title">
          <h1>CADASTRO DE SERVIÇO DE TI</h1>
          <p style={{ textAlign: 'center', color: '#64748b' }}>
            Página AV2 — incluir novo serviço no catálogo via API
          </p>
        </section>

        <section className="campos form-card card-surface">
          <div className="input-group">
            <label htmlFor="nome-servico">Nome do serviço</label>
            <input
              ref={nomeRef}
              id="nome-servico"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Backup em Nuvem"
            />
          </div>
          <div className="input-group">
            <label htmlFor="preco">Preço (R$)</label>
            <input
              id="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="450.00"
            />
          </div>
          <div className="input-group">
            <label htmlFor="prazo">Prazo (dias)</label>
            <input
              id="prazo"
              type="number"
              min={1}
              value={prazoDias}
              onChange={(e) => setPrazoDias(e.target.value)}
            />
          </div>

          <div className="buttons-grup">
            <button type="button" onClick={handleIncluir} disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Incluir'}
            </button>
            <button type="button" className="limpar" onClick={handleLimpar}>
              Limpar
            </button>
          </div>

          <PageMessage mensagem={mensagem} tipo={tipoMensagem} />

          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/servicos">Ir para solicitação de serviços</Link>
          </p>
        </section>
      </main>
    </AppShell>
  );
}
