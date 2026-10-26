import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads");

// POST - Upload de imagem
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "car" ou "360"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Criar diretórios se não existirem
    const targetDir = type === "360"
      ? path.join(UPLOAD_DIR, "360")
      : path.join(UPLOAD_DIR, "cars");

    await fs.mkdir(targetDir, { recursive: true });

    // Gerar nome único
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const fileName = `${timestamp}.${ext}`;
    const filePath = path.join(/*turbopackIgnore: true*/ targetDir, fileName);

    // Salvar arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Retornar URL pública
    const publicUrl = type === "360"
      ? `/uploads/360/${fileName}`
      : `/uploads/cars/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao fazer upload" },
      { status: 500 }
    );
  }
}
