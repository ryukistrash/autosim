import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CARS_FILE = path.join(DATA_DIR, "cars.json");

// GET - Listar veículos
export async function GET() {
  try {
    const fileContent = await fs.readFile(CARS_FILE, "utf-8");
    const cars = JSON.parse(fileContent);
    return NextResponse.json({ success: true, cars });
  } catch (error) {
    // Se o arquivo não existe, retorna array vazio
    return NextResponse.json({ success: true, cars: [] });
  }
}

// POST - Adicionar/Editar veículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { car } = body;

    // Ler arquivo atual
    let cars = [];
    try {
      const fileContent = await fs.readFile(CARS_FILE, "utf-8");
      cars = JSON.parse(fileContent);
    } catch {
      // Arquivo não existe ainda
    }

    // Verificar se é edição ou adição
    const existingIndex = cars.findIndex((c: any) => c.id === car.id);
    if (existingIndex >= 0) {
      // Edição - permitir
      cars[existingIndex] = car;
    } else {
      // Adição - verificar limite de 6 veículos
      if (cars.length >= 6) {
        return NextResponse.json(
          { success: false, error: "Limite de 6 veículos atingido" },
          { status: 400 }
        );
      }
      cars.push(car);
    }

    // Salvar
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CARS_FILE, JSON.stringify(cars, null, 2));

    return NextResponse.json({ success: true, cars });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao salvar veículo" },
      { status: 500 }
    );
  }
}

// DELETE - Remover veículo
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
    const fileContent = await fs.readFile(CARS_FILE, "utf-8");
    let cars = JSON.parse(fileContent);

    // Remover veículo
    cars = cars.filter((c: any) => c.id !== id);

    // Salvar
    await fs.writeFile(CARS_FILE, JSON.stringify(cars, null, 2));

    return NextResponse.json({ success: true, cars });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao remover veículo" },
      { status: 500 }
    );
  }
}
