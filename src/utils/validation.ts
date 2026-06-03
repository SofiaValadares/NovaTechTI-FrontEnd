const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SPECIAL_REGEX = /[@#$%&*!?/\\|_\-.+=]/;
const DISALLOWED_SPECIAL_REGEX = /[¨{}[\]´`~^:;<>,"“‘]/;

export const SENHA_INSTRUCOES = {
  permitidos: '@ # $ % & * ! ? / \\ | - _ + . =',
  proibidos: '¨ { } [ ] ´ ` ~ ^ : ; < > , “ ‘',
};

export function validarEmail(email: string): string | null {
  const valor = email.trim();
  if (!valor) return 'Informe o e-mail.';
  if (!EMAIL_REGEX.test(valor)) return 'Informe um e-mail válido.';
  return null;
}

export function validarSenhaPreenchida(senha: string): string | null {
  if (!senha) return 'Informe a senha.';
  return null;
}

export function validarSenhaAv1(senha: string): string | null {
  const vazio = validarSenhaPreenchida(senha);
  if (vazio) return vazio;
  if (senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
  if (!/\d/.test(senha)) return 'A senha deve conter ao menos 1 número.';
  if (!/[A-Z]/.test(senha)) return 'A senha deve conter ao menos 1 letra maiúscula.';
  if (!ALLOWED_SPECIAL_REGEX.test(senha)) {
    return 'A senha deve conter ao menos 1 caractere especial permitido.';
  }
  if (DISALLOWED_SPECIAL_REGEX.test(senha)) {
    return 'A senha contém caracteres não permitidos.';
  }
  return null;
}

export function validarConfirmacaoSenha(
  senha: string,
  confirmacao: string
): string | null {
  if (!confirmacao.trim()) return 'Informe a confirmação de senha.';
  if (confirmacao !== senha) {
    return 'A confirmação de senha deve ser igual à senha.';
  }
  return null;
}

export function validarCampoObrigatorio(
  valor: string,
  nomeCampo: string
): string | null {
  if (!valor.trim()) return `${nomeCampo} é obrigatório.`;
  return null;
}

export function validarNome(nome: string): string | null {
  const n = nome.trim();
  if (!n) return 'Informe o nome.';
  const palavras = n.split(/\s+/).filter(Boolean);
  if (palavras.length < 2) return 'O nome deve ter pelo menos duas palavras.';
  if (palavras[0].length < 2) {
    return 'A primeira palavra do nome deve ter pelo menos 2 caracteres.';
  }
  const especiais =
    '@#$%&*!?/\\|_-+=.={}[]´`~^:;<>,"“‘¨'.split('');
  for (const ch of n) {
    if (especiais.includes(ch)) {
      return 'O nome não pode conter caracteres especiais.';
    }
  }
  return null;
}

export function formatarCpf(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  const p1 = digitos.slice(0, 3);
  const p2 = digitos.slice(3, 6);
  const p3 = digitos.slice(6, 9);
  const p4 = digitos.slice(9, 11);
  if (digitos.length <= 3) return p1;
  if (digitos.length <= 6) return `${p1}.${p2}`;
  if (digitos.length <= 9) return `${p1}.${p2}.${p3}`;
  return `${p1}.${p2}.${p3}-${p4}`;
}

export function validarCpf(cpf: string): string | null {
  const raw = cpf.trim();
  if (!raw) return 'Informe o CPF.';
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(raw)) {
    return 'Informe um CPF válido no formato NNN.NNN.NNN-NN.';
  }
  const numeros = raw.replace(/\D/g, '');
  if (/^(\d)\1{10}$/.test(numeros)) return 'CPF inválido.';

  const calcularDigito = (base: string, pesos: number[]): number => {
    let soma = 0;
    for (let i = 0; i < base.length; i += 1) {
      soma += Number(base[i]) * pesos[i];
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const base1 = numeros.slice(0, 9);
  const d1 = calcularDigito(base1, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d1 !== Number(numeros[9])) return 'CPF inválido.';
  const base2 = numeros.slice(0, 10);
  const d2 = calcularDigito(base2, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d2 !== Number(numeros[10])) return 'CPF inválido.';
  return null;
}

export function formatarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  if (!ddd) return '';
  if (digitos.length <= 2) return `(${ddd}`;
  if (digitos.length === 10) {
    return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4, 8)}`;
  }
  if (digitos.length >= 11) {
    return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5, 9)}`;
  }
  return `(${ddd}) ${resto}`;
}

export function validarTelefone(telefone: string): string | null {
  const raw = telefone.trim();
  if (!raw) return null;
  const numeros = raw.replace(/\D/g, '');
  if (numeros.length !== 10 && numeros.length !== 11) {
    return 'Informe um telefone nacional válido (DDD + número).';
  }
  return null;
}

export function validarDataNascimento(data: string): string | null {
  if (!data) return 'Informe a data de nascimento.';
  const [ano, mes, dia] = data.split('-').map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  if (
    nascimento.getFullYear() !== ano ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getDate() !== dia
  ) {
    return 'Data de nascimento inválida.';
  }
  const adulto = new Date(nascimento);
  adulto.setFullYear(adulto.getFullYear() + 18);
  if (new Date() < adulto) {
    return 'O cliente deve ser maior de idade (>= 18 anos).';
  }
  return null;
}

export function validarPreco(preco: string): string | null {
  if (!preco.trim()) return 'Preço é obrigatório.';
  const valor = Number(preco.replace(',', '.'));
  if (Number.isNaN(valor) || valor <= 0) {
    return 'Preço deve ser um número maior que zero.';
  }
  return null;
}

export function validarPrazoDias(prazo: string): string | null {
  if (!prazo.trim()) return 'Prazo em dias é obrigatório.';
  const valor = Number(prazo);
  if (!Number.isInteger(valor) || valor <= 0) {
    return 'Prazo em dias deve ser um inteiro positivo.';
  }
  return null;
}

export function parsePreco(preco: string): number {
  return Number(preco.replace(',', '.'));
}
