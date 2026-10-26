import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo") || "todos";

    const filePath = path.join(process.cwd(), "data", "cartas-contempladas.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const cartas = JSON.parse(fileContent);

    // Filtrar por tipo se necessário
    let cartasFiltradas = cartas;
    if (tipo === "imovel") {
      cartasFiltradas = cartas.filter((c: any) => c.tipo === "imovel");
    } else if (tipo === "veiculo") {
      cartasFiltradas = cartas.filter((c: any) => c.tipo === "veiculo");
    }

    // Transformar para o formato esperado pela interface
    const cartasFormatadas = cartasFiltradas.map((carta: any) => ({
      codigoCota: carta.codigo,
      categoria: carta.tipo === "imovel" ? "Imóvel" : "Veículo",
      credito: carta.valorCredito,
      entrada: carta.valorEntrada,
      numeroParcelas: carta.prazo,
      valorParcela: carta.parcela,
      saldoDevedor: carta.saldoDevedor,
      valorTotal: carta.valorTotal,
      fundoComum: 0,
      referenciaGarantia: "-",
      administradora: carta.administradora,
      status: "Disponível",
    }));

    return NextResponse.json({
      success: true,
      data: cartasFormatadas,
      meta: {
        total: cartasFormatadas.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao carregar cartas:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao carregar cartas contempladas",
      },
      { status: 500 }
    );
  }
}
