import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const IMAGES_360_FILE = path.join(DATA_DIR, "images-360.json");

// GET - Listar imagens 360
export async function GET() {
  try {
    const fileContent = await fs.readFile(IMAGES_360_FILE, "utf-8");
    const images = JSON.parse(fileContent);
    return NextResponse.json({ success: true, images });
  } catch (error) {
    // Se o arquivo não existe, retorna array vazio
    return NextResponse.json({ success: true, images: [] });
  }
}

// POST - Salvar configuração de imagens 360
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images } = body;

    // Salvar
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(IMAGES_360_FILE, JSON.stringify(images, null, 2));

    return NextResponse.json({ success: true, images });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao salvar imagens 360" },
      { status: 500 }
    );
  }
}
