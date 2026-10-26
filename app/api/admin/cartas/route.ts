import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CARTAS_FILE = path.join(DATA_DIR, "cartas-contempladas.json");

// Função para gerar código único de carta
function gerarCodigoCarta(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${timestamp}${random}`;
}

// GET - Listar cartas contempladas
export async function GET() {
  try {
    const fileContent = await fs.readFile(CARTAS_FILE, "utf-8");
    const cartas = JSON.parse(fileContent);
    return NextResponse.json({ success: true, cartas });
  } catch (error) {
    // Se o arquivo não existe, retorna array vazio
    return NextResponse.json({ success: true, cartas: [] });
  }
}

// POST - Adicionar/Editar carta contemplada
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { carta } = body;

    // Ler arquivo atual
    let cartas = [];
    try {
      const fileContent = await fs.readFile(CARTAS_FILE, "utf-8");
      cartas = JSON.parse(fileContent);
    } catch {
      // Arquivo não existe ainda
    }

    // Se não tem código, gerar um novo
    if (!carta.codigo) {
      carta.codigo = gerarCodigoCarta();
      carta.dataCadastro = new Date().toISOString();
      cartas.push(carta);
    } else {
      // Editar existente
      const existingIndex = cartas.findIndex((c: any) => c.codigo === carta.codigo);
      if (existingIndex >= 0) {
        cartas[existingIndex] = { ...cartas[existingIndex], ...carta };
      } else {
        return NextResponse.json(
          { success: false, error: "Carta não encontrada" },
          { status: 404 }
        );
      }
    }

    // Salvar
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CARTAS_FILE, JSON.stringify(cartas, null, 2));

    return NextResponse.json({ success: true, carta, cartas });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao salvar carta" },
      { status: 500 }
    );
  }
}

// DELETE - Remover carta contemplada
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get("codigo");

    if (!codigo) {
      return NextResponse.json(
        { success: false, error: "Código não informado" },
        { status: 400 }
      );
    }

    // Ler arquivo atual
    const fileContent = await fs.readFile(CARTAS_FILE, "utf-8");
    let cartas = JSON.parse(fileContent);

    // Remover carta
    cartas = cartas.filter((c: any) => c.codigo !== codigo);

    // Salvar
    await fs.writeFile(CARTAS_FILE, JSON.stringify(cartas, null, 2));

    return NextResponse.json({ success: true, cartas });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao remover carta" },
      { status: 500 }
    );
  }
}
