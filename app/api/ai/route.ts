import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// fuerza runtime dinámico (clave)
export const dynamic = "force-dynamic";

function buildPrompt(texto: string, modo: string): string {
  switch (modo) {
    case "corregir":
      return `Corrige ortografía, gramática y puntuación del siguiente texto en español. Devuelve solo el texto corregido:\n\n${texto}`;
    case "resumir":
      return `Resume en un párrafo claro y conciso el siguiente texto en español:\n\n${texto}`;
    case "redactar":
      return `Redacta un texto académico claro y coherente a partir de lo siguiente:\n\n${texto}`;
    case "humanizar":
      return `Reescribe el siguiente texto para que suene natural y humano, sin cambiar el significado:\n\n${texto}`;
    case "organizar":
      return `Organiza el siguiente texto en párrafos claros y bien estructurados:\n\n${texto}`;
    case "mejorar":
      return `Mejora vocabulario y fluidez del siguiente texto académico:\n\n${texto}`;
    case "parafrasear":
      return `Parafrasea el siguiente texto manteniendo el sentido:\n\n${texto}`;
    case "detectarIA":
      return `Analiza si el siguiente texto parece generado por IA y explica por qué. Luego sugiere mejoras:\n\n${texto}`;
    case "plagio":
      return `Actúa como revisor académico y señala partes que podrían generar sospecha de plagio, con sugerencias:\n\n${texto}`;
    default:
      return texto;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { texto, modo } = await req.json();

    if (!texto || typeof texto !== "string") {
      return NextResponse.json(
        { error: "Falta el campo 'texto'." },
        { status: 400 }
      );
    }

    // 🔑 OpenAI SOLO AQUÍ
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = buildPrompt(texto, modo ?? "corregir");

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const output =
      response.output_text ??
      "No se pudo generar respuesta.";

    return NextResponse.json({ resultado: output });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
