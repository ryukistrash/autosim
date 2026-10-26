import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SIMULACOES_FILE = path.join(DATA_DIR, "simulacoes.json");

// GET - Listar simulações
export async function GET() {
  try {
    const fileContent = await fs.readFile(SIMULACOES_FILE, "utf-8");
    const simulacoes = JSON.parse(fileContent);
    return NextResponse.json({ success: true, simulacoes });
  } catch (error) {
    // Se o arquivo não existe, retorna array vazio
    return NextResponse.json({ success: true, simulacoes: [] });
  }
}

// POST - Adicionar simulação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { simulacao } = body;

    // Ler arquivo atual
    let simulacoes = [];
    try {
      const fileContent = await fs.readFile(SIMULACOES_FILE, "utf-8");
      simulacoes = JSON.parse(fileContent);
    } catch {
      // Arquivo não existe ainda
    }

    // Adicionar nova simulação
    simulacoes.unshift(simulacao); // Adiciona no início da lista

    // Salvar
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SIMULACOES_FILE, JSON.stringify(simulacoes, null, 2));

    return NextResponse.json({ success: true, simulacoes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao salvar simulação" },
      { status: 500 }
    );
  }
}

// DELETE - Remover simulação
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID não informado" },
        { status: 400 }
      );
    }

    // Ler arquivo atual
    const fileContent = await fs.readFile(SIMULACOES_FILE, "utf-8");
    let simulacoes = JSON.parse(fileContent);

    // Remover simulação
    simulacoes = simulacoes.filter((s: any) => s.id !== id);

    // Salvar
    await fs.writeFile(SIMULACOES_FILE, JSON.stringify(simulacoes, null, 2));

    return NextResponse.json({ success: true, simulacoes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao remover simulação" },
      { status: 500 }
    );
  }
}
