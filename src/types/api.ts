export type StatusOperacao = 'SUCESSO' | 'ERRO';

export interface OperacaoResponse {
  status: StatusOperacao;
  mensagem: string | null;
}

export interface AutenticacaoRequest {
  login: string;
  senha: string;
}

export interface AutenticacaoResponse extends OperacaoResponse {
  autenticado?: boolean;
}

export interface TrocaSenhaRequest {
  login: string;
  senhaAtual: string;
  novaSenha: string;
}

export interface ClienteRequest {
  nome: string;
  login: string;
  senha: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  estadoCivil: string;
  escolaridade: string;
}

export interface ClientePerfil {
  id: number;
  nome: string;
  login: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  estadoCivil: string;
  escolaridade: string;
}

export interface ClientePerfilResponse extends OperacaoResponse {
  cliente?: ClientePerfil;
}

export interface ServicoTi {
  id: number;
  nome: string;
  preco: number;
  prazoDias: number;
}

export interface ServicosTiResponse extends OperacaoResponse {
  servicos?: ServicoTi[];
}

export interface ServicoTiRequest {
  nome: string;
  preco: number;
  prazoDias: number;
}

export interface SolicitacaoServicoTi {
  id?: number;
  /** Identificador local para itens ainda não persistidos no backend */
  chaveLocal?: string;
  dataSolicitacao: string;
  status: string;
  preco: number;
  prazoConclusao: string;
  servicoTiId: number;
  nomeServico?: string;
}

export interface SolicitacoesResponse extends OperacaoResponse {
  solicitacoes?: SolicitacaoServicoTi[];
}

export interface AtualizarSolicitacoesRequest {
  login: string;
  solicitacoes: Omit<SolicitacaoServicoTi, 'id' | 'nomeServico'>[];
}
