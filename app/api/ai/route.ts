// app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function buildPrompt(texto: string, modo: string): string {
  switch (modo) {
    case "corregir":
      return `Corrige ortografía, gramática y puntuación del siguiente texto en español:\n\n${texto}`;
    case "resumir":
      return `Resume el siguiente texto en español:\n\n${texto}`;
    default:
      return `Mejora el siguiente texto en español:\n\n${texto}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { texto, modo } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no configurada en el servidor" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = buildPrompt(texto, modo ?? "corregir");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const output =
      response.output_text ??
      "No se pudo generar respuesta.";

    return NextResponse.json({ resultado: output });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno en /api/ai" },
      { status: 500 }
    );
  }
}
