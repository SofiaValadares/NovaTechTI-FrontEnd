import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { checkApiHealth, getApiBaseUrl } from '../api/health';

export type ApiStatus = 'checking' | 'online' | 'offline';

interface ApiStatusContextValue {
  status: ApiStatus;
  apiUrl: string;
  lastChecked: Date | null;
  refresh: () => void;
}

const ApiStatusContext = createContext<ApiStatusContextValue | undefined>(
  undefined
);

const CHECK_INTERVAL_ONLINE_MS = 30000;
const CHECK_INTERVAL_OFFLINE_MS = 5000;

export function ApiStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ApiStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setStatus((atual) => (atual === 'online' ? 'online' : 'checking'));
    const online = await checkApiHealth();
    setStatus(online ? 'online' : 'offline');
    setLastChecked(new Date());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const intervalo =
      status === 'offline' ? CHECK_INTERVAL_OFFLINE_MS : CHECK_INTERVAL_ONLINE_MS;
    const interval = setInterval(refresh, intervalo);
    return () => clearInterval(interval);
  }, [status, refresh]);

  const value = useMemo(
    () => ({
      status,
      apiUrl: getApiBaseUrl(),
      lastChecked,
      refresh,
    }),
    [status, lastChecked, refresh]
  );

  return (
    <ApiStatusContext.Provider value={value}>{children}</ApiStatusContext.Provider>
  );
}

export function useApiStatus(): ApiStatusContextValue {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error('useApiStatus deve ser usado dentro de ApiStatusProvider');
  }
  return context;
}
