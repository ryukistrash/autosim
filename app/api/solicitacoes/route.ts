import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { DadosCliente, DadosClienteSimplificado } from "@/lib/reprovacao";

interface Solicitacao {
  id: string;
  tipo: "cliente" | "consultor";
  codigoCarta: string;
  dados: DadosCliente | DadosClienteSimplificado;
  timestamp: number;
  dataFormatada: string;
}

const DATA_DIR = path.join(process.cwd(), "data", "solicitacoes");
const DATA_FILE = path.join(DATA_DIR, "solicitacoes.json");

// Garantir que o diretório existe
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Ler solicitações existentes
async function readSolicitacoes(): Promise<Solicitacao[]> {
  try {
    await ensureDataDir();
    if (!existsSync(DATA_FILE)) {
      return [];
    }
    const content = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao ler solicitações:", error);
    return [];
  }
}

// Salvar solicitações
async function writeSolicitacoes(solicitacoes: Solicitacao[]): Promise<void> {
  await ensureDataDir();
  await writeFile(DATA_FILE, JSON.stringify(solicitacoes, null, 2), "utf-8");
}

// POST: Criar nova solicitação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, codigoCarta, dados } = body;

    // Validação básica
    if (!tipo || !["cliente", "consultor"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo inválido. Use: cliente ou consultor" },
        { status: 400 }
      );
    }

    if (!codigoCarta || !dados) {
      return NextResponse.json(
        { error: "codigoCarta e dados são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar solicitação
    const now = Date.now();
    const solicitacao: Solicitacao = {
      id: `${tipo}-${now}-${Math.random().toString(36).substr(2, 9)}`,
      tipo: tipo as "cliente" | "consultor",
      codigoCarta,
      dados,
      timestamp: now,
      dataFormatada: new Date(now).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    };

    // Ler, adicionar e salvar
    const solicitacoes = await readSolicitacoes();
    solicitacoes.unshift(solicitacao); // Adiciona no início
    await writeSolicitacoes(solicitacoes);

    return NextResponse.json({
      success: true,
      data: solicitacao,
    });
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao salvar solicitação",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// GET: Listar todas as solicitações
export async function GET() {
  try {
    const solicitacoes = await readSolicitacoes();

    return NextResponse.json({
      success: true,
      data: solicitacoes,
      meta: {
        total: solicitacoes.length,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar solicitações",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
