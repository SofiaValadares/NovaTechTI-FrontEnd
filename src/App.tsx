import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ApiStatusProvider } from './context/ApiStatusContext';
import { AuthProvider } from './context/AuthContext';
import { BackendGate } from './components/BackendGate';
import { RequireAuth } from './components/RequireAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroClientePage from './pages/CadastroClientePage';
import TrocaSenhaPage from './pages/TrocaSenhaPage';
import CarrinhoPage from './pages/CarrinhoPage';
import CadastroServicoPage from './pages/CadastroServicoPage';

function App() {
  return (
    <AuthProvider>
      <ApiStatusProvider>
      <BrowserRouter>
        <BackendGate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroClientePage />} />
          <Route path="/troca-senha" element={<TrocaSenhaPage />} />
          <Route
            path="/servicos"
            element={
              <RequireAuth>
                <CarrinhoPage />
              </RequireAuth>
            }
          />
          <Route
            path="/carrinho"
            element={<Navigate to="/servicos" replace />}
          />
          <Route
            path="/cadastro-servico"
            element={
              <RequireAuth>
                <CadastroServicoPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BackendGate>
      </BrowserRouter>
      </ApiStatusProvider>
    </AuthProvider>
  );
}

export default App;
