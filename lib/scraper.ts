/**
 * Scraper para cartas contempladas do site contempladasbrasil.com.br
 * Extrai dados da tabela HTML e normaliza para formato JSON
 *
 * NOTA: Site carrega dados via JavaScript. Usando dados mock temporariamente.
 * Para scraping real, será necessário usar Puppeteer/Playwright.
 */

import { cartasMock } from "./cartas-mock";

export interface CartaContemplada {
  codigoCota: string;
  categoria: "Imóvel" | "Veículo";
  credito: number;
  entrada: number;
  numeroParcelas: number;
  valorParcela: number;
  saldoDevedor: number;
  valorTotal?: number;
  fundoComum: number;
  referenciaGarantia: string;
  administradora: string;
  status: string;
}

interface ScraperResult {
  cartas: CartaContemplada[];
  timestamp: number;
  totalCartas: number;
}

// Cache em memória
let cache: ScraperResult | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutos
let lastScrapeTime = 0;
const SCRAPE_COOLDOWN = 10 * 1000; // 10 segundos entre requests

/**
 * Converte string de moeda brasileira para número
 * Ex: "R$ 1.234.567,89" -> 1234567.89
 */
function parseCurrency(value: string): number {
  if (!value || typeof value !== "string") return 0;
  return parseFloat(
    value
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
  );
}

/**
 * Limpa e sanitiza string removendo HTML e espaços extras
 */
function sanitizeString(value: string): string {
  if (!value || typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "") // Remove tags HTML
    .replace(/\s+/g, " ") // Normaliza espaços
    .trim();
}

/**
 * Extrai dados de uma linha da tabela HTML
 */
function parseTableRow(rowHtml: string): CartaContemplada | null {
  try {
    // Regex para extrair células <td>...</td>
    const tdRegex = /<td[^>]*>(.*?)<\/td>/gi;
    const cells: string[] = [];
    let match;

    while ((match = tdRegex.exec(rowHtml)) !== null) {
      cells.push(sanitizeString(match[1]));
    }

    // Verificar se temos células suficientes
    if (cells.length < 11) return null;

    const categoria = cells[1]?.trim();
    if (categoria !== "Imóvel" && categoria !== "Veículo") return null;

    return {
      codigoCota: sanitizeString(cells[0]),
      categoria: categoria as "Imóvel" | "Veículo",
      credito: parseCurrency(cells[2]),
      entrada: parseCurrency(cells[3]),
      numeroParcelas: parseInt(cells[4]) || 0,
      valorParcela: parseCurrency(cells[5]),
      saldoDevedor: parseCurrency(cells[6]),
      fundoComum: parseCurrency(cells[7]),
      referenciaGarantia: sanitizeString(cells[8]),
      administradora: sanitizeString(cells[9]),
      status: sanitizeString(cells[10]),
    };
  } catch (error) {
    console.error("Erro ao parsear linha da tabela:", error);
    return null;
  }
}

/**
 * Faz scraping do site de cartas contempladas
 * TEMPORÁRIO: Usando dados mock enquanto investigamos a extração real
 */
async function scrapeCartas(
  segmento: "todos" | "imovel" | "veiculo" = "todos"
): Promise<CartaContemplada[]> {
  const now = Date.now();

  // Rate limiting (mantido por compatibilidade)
  if (now - lastScrapeTime < SCRAPE_COOLDOWN) {
    await new Promise((resolve) =>
      setTimeout(resolve, SCRAPE_COOLDOWN - (now - lastScrapeTime))
    );
  }

  lastScrapeTime = Date.now();

  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // Usar dados mock
    let cartas = [...cartasMock];

    // Aplicar filtro
    if (segmento === "imovel") {
      cartas = cartas.filter((c) => c.categoria === "Imóvel");
    } else if (segmento === "veiculo") {
      cartas = cartas.filter((c) => c.categoria === "Veículo");
    }

    return cartas;

    /*
    // CÓDIGO ORIGINAL PARA SCRAPING REAL (quando implementarmos Puppeteer/Playwright)
    const url = `https://contempladas.contempladasbrasil.com.br/?segmento=${segmento}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "AutoSim Bot/1.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Extrair linhas da tabela
    const tbodyRegex = /<tbody[^>]*>([\s\S]*?)<\/tbody>/i;
    const tbodyMatch = html.match(tbodyRegex);

    if (!tbodyMatch) {
      throw new Error("Tabela não encontrada no HTML");
    }

    const tbody = tbodyMatch[1];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cartas: CartaContemplada[] = [];
    let rowMatch;

    while ((rowMatch = rowRegex.exec(tbody)) !== null) {
      const carta = parseTableRow(rowMatch[1]);
      if (carta) {
        cartas.push(carta);
      }
    }

    return cartas;
    */
  } catch (error) {
    console.error("Erro no scraping:", error);

    // Retornar cache antigo se disponível (stale-while-revalidate)
    if (cache) {
      console.warn("Retornando cache antigo devido a erro no scraping");
      return cache.cartas;
    }

    throw error;
  }
}

/**
 * Busca cartas com cache inteligente
 */
export async function getCartas(
  tipo: "todos" | "imovel" | "veiculo" = "todos",
  forceRefresh = false
): Promise<ScraperResult> {
  const now = Date.now();

  // Retornar cache se válido e não forçar refresh
  if (cache && !forceRefresh && now - cacheTimestamp < CACHE_DURATION) {
    return cache;
  }

  try {
    const cartas = await scrapeCartas(tipo);

    // Filtrar por tipo se necessário (segurança extra)
    let cartasFiltradas = cartas;
    if (tipo === "imovel") {
      cartasFiltradas = cartas.filter((c) => c.categoria === "Imóvel");
    } else if (tipo === "veiculo") {
      cartasFiltradas = cartas.filter((c) => c.categoria === "Veículo");
    }

    const result: ScraperResult = {
      cartas: cartasFiltradas,
      timestamp: now,
      totalCartas: cartasFiltradas.length,
    };

    // Atualizar cache
    cache = result;
    cacheTimestamp = now;

    return result;
  } catch (error) {
    // Se temos cache antigo, retornar mesmo que expirado
    if (cache) {
      console.warn("Erro no scraping, retornando cache expirado");
      return cache;
    }

    throw error;
  }
}

/**
 * Limpa o cache manualmente
 */
export function clearCache(): void {
  cache = null;
  cacheTimestamp = 0;
}
