import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  atualizarSolicitacoes,
  listarServicosTi,
  listarSolicitacoes,
} from '../api/novatecktiApi';
import { ApiError } from '../api/http';
import { AppShell } from '../components/AppShell';
import { PageMessage } from '../components/PageMessage';
import { useAuth } from '../context/AuthContext';
import type { ServicoTi, SolicitacaoServicoTi } from '../types/api';
import {
  adicionarDias,
  formatarDataBr,
  formatarMoeda,
  hojeIso,
} from '../utils/dateUtils';

const STATUS_PADRAO = 'EM ELABORAÇÃO';

function ordenarPorData(solicitacoes: SolicitacaoServicoTi[]): SolicitacaoServicoTi[] {
  return [...solicitacoes].sort((a, b) =>
    a.dataSolicitacao.localeCompare(b.dataSolicitacao)
  );
}

function chaveDaLinha(item: SolicitacaoServicoTi, indice: number): string {
  return item.chaveLocal || (item.id != null ? `id-${item.id}` : `idx-${indice}`);
}

export default function CarrinhoPage() {
  const { login, perfil, nome, carregandoPerfil } = useAuth();
  const [servicos, setServicos] = useState<ServicoTi[]>([]);
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState('');
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoServicoTi[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'error' | 'success' | ''>('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);

  const servicoSelecionado = useMemo(
    () => servicos.find((s) => s.id === Number(servicoSelecionadoId)),
    [servicos, servicoSelecionadoId]
  );

  const dataPrevista = useMemo(() => {
    if (!servicoSelecionado) return '—';
    return formatarDataBr(adicionarDias(hojeIso(), servicoSelecionado.prazoDias));
  }, [servicoSelecionado]);

  const solicitacoesOrdenadas = useMemo(
    () => ordenarPorData(solicitacoes),
    [solicitacoes]
  );

  const carregarDados = useCallback(async () => {
    if (!login) return;
    setCarregando(true);
    setMensagem('');
    try {
      const [resServicos, resSolicitacoes] = await Promise.all([
        listarServicosTi(),
        listarSolicitacoes(login),
      ]);

      if (resServicos.status !== 'SUCESSO') {
        throw new ApiError(resServicos.mensagem || 'Erro ao carregar serviços.');
      }
      if (resSolicitacoes.status !== 'SUCESSO') {
        throw new ApiError(
          resSolicitacoes.mensagem || 'Erro ao carregar solicitações.'
        );
      }

      const listaServicos = resServicos.servicos || [];
      setServicos(listaServicos);
      if (listaServicos.length > 0) {
        setServicoSelecionadoId(String(listaServicos[0].id));
      }
      setSolicitacoes(ordenarPorData(resSolicitacoes.solicitacoes || []));
      setAlteracoesPendentes(false);
    } catch (error) {
      setMensagem(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível carregar os dados.'
      );
      setTipoMensagem('error');
    } finally {
      setCarregando(false);
    }
  }, [login]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const adicionarSolicitacao = () => {
    if (!servicoSelecionado) {
      setMensagem('Selecione um serviço de TI.');
      setTipoMensagem('error');
      return;
    }

    const dataSolicitacao = hojeIso();
    const nova: SolicitacaoServicoTi = {
      chaveLocal: `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      dataSolicitacao,
      status: STATUS_PADRAO,
      preco: servicoSelecionado.preco,
      prazoConclusao: adicionarDias(dataSolicitacao, servicoSelecionado.prazoDias),
      servicoTiId: servicoSelecionado.id,
      nomeServico: servicoSelecionado.nome,
    };

    setSolicitacoes((atual) => ordenarPorData([...atual, nova]));
    setAlteracoesPendentes(true);
    setMensagem(
      'Solicitação adicionada à tabela (ainda não salva). Clique em "Atualizar solicitações" para gravar no servidor.'
    );
    setTipoMensagem('success');
  };

  const removerSolicitacao = (chave: string) => {
    setSolicitacoes((atual) =>
      atual.filter((item, indice) => chaveDaLinha(item, indice) !== chave)
    );
    setAlteracoesPendentes(true);
    setMensagem(
      'Linha removida da tabela (ainda não salva). Clique em "Atualizar solicitações" para gravar no servidor.'
    );
    setTipoMensagem('success');
  };

  const salvarSolicitacoes = async () => {
    if (!login) return;
    setSalvando(true);
    setMensagem('');
    try {
      const payload = solicitacoes.map(
        ({ dataSolicitacao, status, preco, prazoConclusao, servicoTiId }) => ({
          dataSolicitacao,
          status,
          preco,
          prazoConclusao,
          servicoTiId,
        })
      );

      const resposta = await atualizarSolicitacoes({ login, solicitacoes: payload });

      if (resposta.status === 'SUCESSO') {
        setMensagem('Solicitações atualizadas com sucesso!');
        setTipoMensagem('success');
        await carregarDados();
        return;
      }

      setMensagem(resposta.mensagem || 'Erro ao atualizar solicitações.');
      setTipoMensagem('error');
    } catch (error) {
      setMensagem(
        error instanceof ApiError
          ? error.message
          : 'Erro de comunicação com o servidor.'
      );
      setTipoMensagem('error');
    } finally {
      setSalvando(false);
    }
  };

  const nomeExibicao = perfil?.nome || nome || 'Cliente';
  const cpfExibicao = perfil?.cpf || '—';
  const telefoneExibicao = perfil?.telefone || '—';

  return (
    <AppShell>
      <main className="app-page servicos-page">
        <section className="page-title">
          <h1>Solicitação de Serviços de TI</h1>
        </section>

        <PageMessage mensagem={mensagem} tipo={tipoMensagem} />

        {alteracoesPendentes && (
          <p className="servicos-pendente" role="status">
            Há alterações na tabela que ainda não foram salvas no servidor.
          </p>
        )}

        <section className="user-info card-surface">
          <h2>Informações do Usuário</h2>
          {carregandoPerfil ? (
            <p>Carregando dados do cliente...</p>
          ) : (
            <>
              <div className="info-group">
                <span className="info-label">Nome:</span>
                <span className="info-value">{nomeExibicao}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Email (Login):</span>
                <span className="info-value">{login}</span>
              </div>
              <div className="info-group">
                <span className="info-label">CPF:</span>
                <span className="info-value">{cpfExibicao}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Telefone:</span>
                <span className="info-value">{telefoneExibicao}</span>
              </div>
            </>
          )}
        </section>

        <section className="requests-history requests-panel">
          <div className="table-actions">
            <h2>Solicitações Anteriores</h2>
            <button
              type="button"
              className="btn-atualizar"
              onClick={salvarSolicitacoes}
              disabled={salvando || carregando}
            >
              {salvando ? 'Salvando...' : 'Atualizar solicitações'}
            </button>
          </div>

          {carregando ? (
            <p>Carregando...</p>
          ) : solicitacoesOrdenadas.length === 0 ? (
            <p>Nenhuma solicitação registrada.</p>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Data do Pedido</th>
                  <th>Nº Solicitação</th>
                  <th>Serviço</th>
                  <th>Status</th>
                  <th>Preço</th>
                  <th>Data Prevista</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoesOrdenadas.map((item, indice) => {
                  const chave = chaveDaLinha(item, indice);
                  const numeroExibicao =
                    item.id != null ? String(item.id).padStart(3, '0') : '—';
                  return (
                    <tr key={chave}>
                      <td>{formatarDataBr(item.dataSolicitacao)}</td>
                      <td>{numeroExibicao}</td>
                      <td>{item.nomeServico || `Serviço #${item.servicoTiId}`}</td>
                      <td>{item.status}</td>
                      <td>{formatarMoeda(item.preco)}</td>
                      <td>{formatarDataBr(item.prazoConclusao)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => removerSolicitacao(chave)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <section className="new-request card-surface">
          <h2>Nova Solicitação de Serviço</h2>
          <div className="request-form">
            <div className="input-group">
              <label htmlFor="service-select">Serviço de TI:</label>
              <select
                id="service-select"
                value={servicoSelecionadoId}
                onChange={(e) => setServicoSelecionadoId(e.target.value)}
                disabled={servicos.length === 0}
              >
                {servicos.length === 0 && (
                  <option value="">Nenhum serviço disponível</option>
                )}
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Preço:</label>
              <div className="form-field-readonly">
                {servicoSelecionado ? formatarMoeda(servicoSelecionado.preco) : '—'}
              </div>
            </div>
            <div className="input-group">
              <label>Prazo de atendimento:</label>
              <div className="form-field-readonly">
                {servicoSelecionado
                  ? `${servicoSelecionado.prazoDias} dia(s)`
                  : '—'}
              </div>
            </div>
            <div className="input-group">
              <label>Data prevista de atendimento:</label>
              <div className="form-field-readonly">{dataPrevista}</div>
            </div>
            <div className="input-group">
              <label>Status:</label>
              <div className="form-field-readonly">{STATUS_PADRAO}</div>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <button
                type="button"
                className="btn-atualizar"
                onClick={adicionarSolicitacao}
                disabled={!servicoSelecionado}
              >
                Adicionar Solicitação
              </button>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
