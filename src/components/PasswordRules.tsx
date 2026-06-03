import React from 'react';
import { SENHA_INSTRUCOES } from '../utils/validation';

export function PasswordRules() {
  return (
    <output className="password-rules">
      Regras para senha:
      <br />- Deve ter pelo menos 6 caracteres.
      <br />- Deve conter ao menos 1 número, 1 letra maiúscula e 1 caractere
      especial permitido:
      <br />
      <strong>{SENHA_INSTRUCOES.permitidos}</strong>
      <br />- Não são permitidos os seguintes caracteres:
      <br />
      <strong>{SENHA_INSTRUCOES.proibidos}</strong>
    </output>
  );
}
