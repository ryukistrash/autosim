export interface Proposal {
  id: string;
  tipo: "financiamento" | "carta-credito" | "autofinanciamento";
  nome: string;
  parcela: number;
  prazo: number;
  entrada: number;
  valorTotal: number;
  valorCredito: number;
  valorFinal: number;
  taxa: number;
  destaque?: boolean;
  caracteristicas: string[];
}

// Tabela de entradas do autofinanciamento (da tabela PHS 6 GFT)
const ENTRADAS_AUTOFINANCIAMENTO = [
  4056.18, 4672.45, 5305.65, 5938.86, 6572.07, 7205.27, 7838.48,
  10223.29, 12155.54, 14087.79, 16020.04, 17711.30, 19458.43,
  22952.69, 24699.82, 26446.95, 28194.08, 31688.34, 35182.60
];

/**
 * Encontra o valor de entrada mais próximo da tabela de autofinanciamento
 */
function encontrarEntradaMaisProxima(entradaDesejada: number): number {
  let maisProxima = ENTRADAS_AUTOFINANCIAMENTO[0];
  let menorDiferenca = Math.abs(entradaDesejada - maisProxima);

  for (const entrada of ENTRADAS_AUTOFINANCIAMENTO) {
    const diferenca = Math.abs(entradaDesejada - entrada);
    if (diferenca < menorDiferenca) {
      menorDiferenca = diferenca;
      maisProxima = entrada;
    }
  }

  return maisProxima;
}

// Mock de função de simulação - será substituída pela lógica real
export function generateProposals(params: {
  valor: number;
  entrada: number;
  parcelaDesejada: number;
  tipo: "card" | "simulacao";
}): Proposal[] {
  const { valor, entrada, parcelaDesejada, tipo } = params;

  if (tipo === "card") {
    // Retorna apenas 2 propostas para os cards da home (sem identificar o tipo)
    const prazoEstimado = 48; // Prazo padrão para cards
    const valorFinanciado = valor - entrada;
    return [
      {
        id: "prop1",
        tipo: "financiamento",
        nome: "Proposta 1",
        parcela: (valorFinanciado * 1.02) / prazoEstimado,
        prazo: prazoEstimado,
        entrada,
        valorTotal: valorFinanciado * 1.02 + entrada,
        valorCredito: valor * 1.122,
        valorFinal: valorFinanciado * 1.02 + entrada,
        taxa: 0,
        caracteristicas: [
          "Aprovação rápida",
          "Sem taxa de adesão",
          "Primeira parcela em 30 dias",
        ],
      },
      {
        id: "prop2",
        tipo: "carta-credito",
        nome: "Proposta 2",
        parcela: (valorFinanciado * 1.15) / prazoEstimado,
        prazo: prazoEstimado,
        entrada,
        valorTotal: valorFinanciado * 1.15 + entrada,
        valorCredito: valor * 1.122,
        valorFinal: valorFinanciado * 1.15 + entrada,
        taxa: 0,
        caracteristicas: [
          "Menor taxa de juros",
          "Flexibilidade de pagamento",
          "Possibilidade de antecipação",
        ],
      },
    ];
  }

  // Retorna 3 propostas para a página de simulação (com tipo identificado)

  // AUTOFINANCIAMENTO:
  // - Entrada da TABELA (valor mais próximo da entrada desejada)
  // - Parcela reduzida (0.95x da desejada)
  // Cálculo do Prazo: (valor + 12.2% - entrada) / parcela
  // Valor Final: entrada + (parcela × prazo)
  const entradaAutofinanciamento = encontrarEntradaMaisProxima(entrada);
  const parcelaAuto = Math.round(parcelaDesejada * 0.95);
  const valorCreditoAuto = valor; // Valor do crédito (valor base)
  const valorComAcrescimo = Math.round(valor * 1.122); // valor + 12.2%
  const valorFinanciadoAuto = valorComAcrescimo - entradaAutofinanciamento;
  const prazoAuto = Math.round(valorFinanciadoAuto / parcelaAuto);
  const valorFinalAuto = entradaAutofinanciamento + (parcelaAuto * prazoAuto);

  // CARTA DE CRÉDITO:
  // - Sem entrada
  // - Parcela 1.5x da desejada
  // Cálculo do Prazo: (valor + 12.2% - entrada) / parcela
  // Valor Final: entrada + (parcela × prazo)
  const entradaCarta = 0; // Sem entrada
  const parcelaCarta = Math.round(parcelaDesejada * 1.5);
  const valorCreditoCarta = valor; // Valor do crédito (valor base)
  const valorComAcrescimoCarta = Math.round(valor * 1.122); // valor + 12.2%
  const valorFinanciadoCarta = valorComAcrescimoCarta - entradaCarta;
  const prazoCarta = Math.round(valorFinanciadoCarta / parcelaCarta);
  const valorFinalCarta = entradaCarta + (parcelaCarta * prazoCarta);

  // FINANCIAMENTO:
  // - Entrada 35% maior
  // - Parcela 2x da desejada
  // Cálculo do Prazo: (valor + 12.2% - entrada) / parcela (ARREDONDADO PARA MÚLTIPLO DE 12)
  // Valor do Crédito: valor + 12.2%
  // Valor Final: ((valor do crédito BASE - entrada) × 2.3) + entrada
  const entradaFinanciamento = Math.round(entrada * 1.35); // 35% a mais
  const parcelaFin = Math.round(parcelaDesejada * 2);
  const valorCreditoFin = Math.round(valor * 1.122); // valor + 12.2%
  const valorFinanciadoFin = valorCreditoFin - entradaFinanciamento;
  const prazoCalculado = valorFinanciadoFin / parcelaFin;
  const prazoFin = Math.ceil(prazoCalculado / 12) * 12; // Arredonda para múltiplo de 12
  const valorFinalFin = Math.round(((valor - entradaFinanciamento) * 2.3) + entradaFinanciamento);

  return [
    {
      id: "autofinanciamento",
      tipo: "autofinanciamento",
      nome: "Autofinanciamento",
      parcela: parcelaAuto,
      prazo: prazoAuto,
      entrada: entradaAutofinanciamento,
      valorTotal: valorFinalAuto,
      valorCredito: valorCreditoAuto,
      valorFinal: valorFinalAuto,
      taxa: 0,
      destaque: true,
      caracteristicas: [
        "Sem análise de crédito restritiva",
        "Planejamento a curto prazo",
        "Linha de crédito para veículo, imóvel ou pesados",
      ],
    },
    {
      id: "carta-credito",
      tipo: "carta-credito",
      nome: "Carta de Crédito",
      parcela: parcelaCarta,
      prazo: prazoCarta,
      entrada: entradaCarta,
      valorTotal: valorFinalCarta,
      valorCredito: valorCreditoCarta,
      valorFinal: valorFinalCarta,
      taxa: 0,
      caracteristicas: [
        "Melhor taxa do mercado",
        "Contemplação dependendo de sorteio",
        "Flexibilidade nas parcelas",
      ],
    },
    {
      id: "financiamento",
      tipo: "financiamento",
      nome: "Financiamento",
      parcela: parcelaFin,
      prazo: prazoFin,
      entrada: entradaFinanciamento,
      valorTotal: valorFinalFin,
      valorCredito: valorCreditoFin,
      valorFinal: valorFinalFin,
      taxa: 0,
      caracteristicas: [
        "Aprovação em até 24 horas",
        "Parcelas fixas",
        "Tem juros",
      ],
    },
  ];
}
