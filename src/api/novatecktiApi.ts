import { apiFetch } from './http';
import type {
  AtualizarSolicitacoesRequest,
  AutenticacaoRequest,
  AutenticacaoResponse,
  ClientePerfilResponse,
  ClienteRequest,
  OperacaoResponse,
  ServicoTiRequest,
  ServicosTiResponse,
  SolicitacoesResponse,
  TrocaSenhaRequest,
} from '../types/api';

export function autenticar(dados: AutenticacaoRequest): Promise<AutenticacaoResponse> {
  return apiFetch<AutenticacaoResponse>('/api/autenticacao', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function trocarSenha(dados: TrocaSenhaRequest): Promise<OperacaoResponse> {
  return apiFetch<OperacaoResponse>('/api/autenticacao/troca-senha', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function cadastrarCliente(dados: ClienteRequest): Promise<OperacaoResponse> {
  return apiFetch<OperacaoResponse>('/api/clientes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function buscarClientePorLogin(login: string): Promise<ClientePerfilResponse> {
  const params = new URLSearchParams({ login });
  return apiFetch<ClientePerfilResponse>(`/api/clientes?${params.toString()}`);
}

export function cadastrarServicoTi(dados: ServicoTiRequest): Promise<OperacaoResponse> {
  return apiFetch<OperacaoResponse>('/api/servicos-ti', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function listarServicosTi(): Promise<ServicosTiResponse> {
  return apiFetch<ServicosTiResponse>('/api/servicos-ti');
}

export function listarSolicitacoes(login: string): Promise<SolicitacoesResponse> {
  const params = new URLSearchParams({ login });
  return apiFetch<SolicitacoesResponse>(`/api/solicitacoes?${params.toString()}`);
}

export function atualizarSolicitacoes(
  dados: AtualizarSolicitacoesRequest
): Promise<OperacaoResponse> {
  return apiFetch<OperacaoResponse>('/api/solicitacoes', {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}
