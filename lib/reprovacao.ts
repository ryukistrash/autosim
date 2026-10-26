/**
 * Algoritmo de reprovação de carta contemplada
 * Baseado no arquivo: algoritimo de reprovação na carta contemplada/analise_repasses.json
 */

export type TipoRenda = "clt" | "autonomo";

export interface DadosCliente {
  nome: string;
  cpf: string;
  rg?: string;
  telefone: string;
  email: string;
  nascimento: string; // DD/MM/YYYY
  score: "Alto" | "Regular" | "Baixo";
  analiseRecente: "Sim" | "Não";
  modalidadesAtivas: string[]; // ["Financiamento", "Consórcio", "Empréstimo"]
  tipoRenda: TipoRenda;

  // CLT
  rendaContracheque?: number;
  profissao?: string;

  // Autônomo
  contemDeclaracaoAtual?: "Sim" | "Não";
  declaracaoPF?: "Sim" | "Não";
  rendaAnualPF?: number;
  declaracaoPJ?: "Sim" | "Não";
  rendaAnualPJ?: number;
  rendaBancaria?: number;
}

export interface DadosClienteSimplificado {
  nome: string;
  cpf: string;
  telefone: string;
  valorCredito: number;
  entradaDisponivel: number;
  parcelasDesejadas: number;
}

export interface ResultadoAnalise {
  aprovado: false; // Sempre reprova
  causas: string[];
  tempoAnalise: number; // milissegundos (sempre 120000 = 2min)
  tempoEspera1: number; // 5000ms antes do segundo spinner
  tempoEspera2: number; // 25000ms do segundo spinner
  mensagem: string;
}

/**
 * Avalia reprovação para cliente AUTÔNOMO
 * Baseado na função avaliarReprovacaoRepasse() do simulador-core.js
 */
function avaliarReprovacaoAutonomo(
  atual: boolean,
  pessoaFisica: boolean,
  pessoaJuridica: boolean
): string[] {
  // Caso 1: PF + PJ + Atual
  if (pessoaFisica && pessoaJuridica && atual) {
    return ["ERROR 5776.AC"];
  }

  // Caso 2: PF + PJ + Sem Atual
  if (pessoaFisica && pessoaJuridica && !atual) {
    return ["DECLARAÇÃO INVÁLIDA", "ERROR 5776.AC"];
  }

  // Caso 3: PF sem PJ
  if (pessoaFisica && !pessoaJuridica) {
    return [
      "GRUPO DO CONSÓRCIADO INDISPONÍVEL PARA PESSOA FÍSICA",
      "ERROR 5776.AC",
    ];
  }

  // Caso 4: Sem Atual + Sem PF + Sem PJ
  if (!atual && !pessoaFisica && !pessoaJuridica) {
    return ["DECLARAÇÃO NECESSÁRIA", "RENDA INCOMPATÍVEL"];
  }

  // Qualquer outro caso
  return ["ERROR 5776.AC"];
}

/**
 * Avalia reprovação para cliente CLT (Carteira Assinada)
 * Baseado na função causasReprovacaoCLT() do simulador-core.js
 */
function avaliarReprovacaoCLT(): string[] {
  return ["DECLARAÇÃO NECESSÁRIA", "ERROR 5776.AC"];
}

/**
 * Analisa documentação do cliente e retorna reprovação
 * SEMPRE reprova, seguindo o fluxo do algoritmo original
 */
export function analisarDocumentacao(dados: DadosCliente): ResultadoAnalise {
  let causas: string[];

  if (dados.tipoRenda === "autonomo") {
    const atual = dados.contemDeclaracaoAtual === "Sim";
    const pf = dados.declaracaoPF === "Sim";
    const pj = dados.declaracaoPJ === "Sim";

    causas = avaliarReprovacaoAutonomo(atual, pf, pj);
  } else {
    causas = avaliarReprovacaoCLT();
  }

  return {
    aprovado: false,
    causas,
    tempoAnalise: 120000, // 2 minutos (120 segundos)
    tempoEspera1: 5000, // 5 segundos
    tempoEspera2: 25000, // 25 segundos
    mensagem: "DOCUMENTAÇÃO DESQUALIFICADA",
  };
}

/**
 * Valida CPF (algoritmo simplificado)
 */
export function validarCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false; // Todos dígitos iguais

  // Validação completa dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;

  return true;
}

/**
 * Valida email
 */
export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Valida data de nascimento (DD/MM/YYYY)
 */
export function validarDataNascimento(data: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = data.match(regex);

  if (!match) return false;

  const dia = parseInt(match[1]);
  const mes = parseInt(match[2]);
  const ano = parseInt(match[3]);

  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  if (ano < 1930 || ano > new Date().getFullYear()) return false;

  const dataObj = new Date(ano, mes - 1, dia);
  return dataObj.getDate() === dia && dataObj.getMonth() === mes - 1;
}

/**
 * Calcula idade a partir da data de nascimento
 */
export function calcularIdade(nascimento: string): number {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = nascimento.match(regex);

  if (!match) return 0;

  const dia = parseInt(match[1]);
  const mes = parseInt(match[2]);
  const ano = parseInt(match[3]);

  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;

  if (
    hoje.getMonth() < mes - 1 ||
    (hoje.getMonth() === mes - 1 && hoje.getDate() < dia)
  ) {
    idade--;
  }

  return idade;
}
