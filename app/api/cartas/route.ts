import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CARTAS_FILE = path.join(DATA_DIR, "cartas-contempladas.json");

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get("tipo") || "todos";

    // Validar tipo
    if (!["todos", "imovel", "veiculo"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo inválido. Use: todos, imovel ou veiculo" },
        { status: 400 }
      );
    }

    // Ler cartas do arquivo
    let cartas = [];
    try {
      const fileContent = await fs.readFile(CARTAS_FILE, "utf-8");
      cartas = JSON.parse(fileContent);
    } catch {
      // Arquivo não existe ou está vazio
      cartas = [];
    }

    // Mapear dados do JSON para o formato esperado pela interface CartaContemplada
    const cartasFormatadas = cartas.map((carta: any) => {
      // Calcular saldo devedor se não existir
      const saldoDevedor = carta.saldoDevedor || (carta.parcela * carta.prazo);
      const valorTotal = carta.valorTotal || (carta.valorEntrada + saldoDevedor);

      return {
        codigoCota: carta.codigo,
        categoria: carta.tipo === "imovel" ? "Imóvel" : "Veículo",
        credito: carta.valorCredito,
        entrada: carta.valorEntrada,
        numeroParcelas: carta.prazo,
        valorParcela: carta.parcela,
        saldoDevedor: saldoDevedor,
        valorTotal: valorTotal,
        fundoComum: 0,
        referenciaGarantia: "-",
        administradora: carta.banco || carta.administradora || "N/A",
        status: "Disponível",
      };
    });

    // Filtrar por tipo
    let cartasFiltradas = cartasFormatadas;
    if (tipo === "imovel") {
      cartasFiltradas = cartasFormatadas.filter((carta: any) => carta.categoria === "Imóvel");
    } else if (tipo === "veiculo") {
      cartasFiltradas = cartasFormatadas.filter((carta: any) => carta.categoria === "Veículo");
    }

    // Filtrar valor máximo de R$ 500.000
    cartasFiltradas = cartasFiltradas.filter((carta: any) => carta.credito <= 500000);

    return NextResponse.json({
      success: true,
      data: cartasFiltradas,
      meta: {
        total: cartasFiltradas.length,
        tipo,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar cartas:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar cartas contempladas",
        message:
          error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
