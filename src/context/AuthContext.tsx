import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { buscarClientePorLogin } from '../api/novatecktiApi';
import type { ClientePerfil } from '../types/api';

const LOGIN_KEY = 'novatech.login';
const NOME_KEY = 'novatech.nome';
const PERFIL_KEY = 'novatech.perfil';

function lerPerfilArmazenado(): ClientePerfil | null {
  const json = sessionStorage.getItem(PERFIL_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json) as ClientePerfil;
  } catch {
    return null;
  }
}

function salvarPerfilArmazenado(perfil: ClientePerfil | null) {
  if (perfil) {
    sessionStorage.setItem(PERFIL_KEY, JSON.stringify(perfil));
    sessionStorage.setItem(NOME_KEY, perfil.nome);
  } else {
    sessionStorage.removeItem(PERFIL_KEY);
    sessionStorage.removeItem(NOME_KEY);
  }
}

interface AuthContextValue {
  login: string | null;
  nome: string | null;
  perfil: ClientePerfil | null;
  isAuthenticated: boolean;
  carregandoPerfil: boolean;
  signIn: (login: string, nome?: string) => void;
  signOut: () => void;
  refreshPerfil: () => Promise<ClientePerfil | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [login, setLogin] = useState<string | null>(() =>
    sessionStorage.getItem(LOGIN_KEY)
  );
  const [nome, setNome] = useState<string | null>(() =>
    sessionStorage.getItem(NOME_KEY)
  );
  const [perfil, setPerfil] = useState<ClientePerfil | null>(() =>
    lerPerfilArmazenado()
  );
  const [carregandoPerfil, setCarregandoPerfil] = useState(false);

  const refreshPerfil = useCallback(async (): Promise<ClientePerfil | null> => {
    const loginAtual = sessionStorage.getItem(LOGIN_KEY);
    if (!loginAtual) {
      setPerfil(null);
      setNome(null);
      return null;
    }

    setCarregandoPerfil(true);
    try {
      const resposta = await buscarClientePorLogin(loginAtual);
      if (resposta.status === 'SUCESSO' && resposta.cliente) {
        setPerfil(resposta.cliente);
        setNome(resposta.cliente.nome);
        salvarPerfilArmazenado(resposta.cliente);
        return resposta.cliente;
      }
      setPerfil(null);
      return null;
    } catch {
      return lerPerfilArmazenado();
    } finally {
      setCarregandoPerfil(false);
    }
  }, []);

  const signIn = useCallback((email: string, nomeUsuario?: string) => {
    sessionStorage.setItem(LOGIN_KEY, email);
    sessionStorage.removeItem(PERFIL_KEY);
    setLogin(email);
    setPerfil(null);
    if (nomeUsuario) {
      sessionStorage.setItem(NOME_KEY, nomeUsuario);
      setNome(nomeUsuario);
    } else {
      sessionStorage.removeItem(NOME_KEY);
      setNome(null);
    }
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(LOGIN_KEY);
    sessionStorage.removeItem(NOME_KEY);
    sessionStorage.removeItem(PERFIL_KEY);
    setLogin(null);
    setNome(null);
    setPerfil(null);
  }, []);

  useEffect(() => {
    if (!login) return;
    if (perfil && perfil.login.toLowerCase() === login.toLowerCase()) return;
    refreshPerfil();
  }, [login, perfil, refreshPerfil]);

  const value = useMemo(
    () => ({
      login,
      nome,
      perfil,
      isAuthenticated: login !== null && login.length > 0,
      carregandoPerfil,
      signIn,
      signOut,
      refreshPerfil,
    }),
    [login, nome, perfil, carregandoPerfil, signIn, signOut, refreshPerfil]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
