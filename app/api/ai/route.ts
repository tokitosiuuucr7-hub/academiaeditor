// app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// 🔴 MUY IMPORTANTE
// Evita que Next/Vercel intente ejecutar esto en build
export const dynamic = "force-dynamic";

function buildPrompt(texto: string, modo: string): string {
  switch (modo) {
    case "corregir":
      return `Corrige ortografía, gramática y puntuación del siguiente texto en español, manteniendo el estilo original. Devuelve solo el texto corregido:\n\n${texto}`;
    case "resumir":
      return `Resume en un párrafo claro y conciso el siguiente texto en español:\n\n${texto}`;
    case "redactar":
      return `Redacta un texto académico coherente y bien escrito en español a partir del siguiente contenido:\n\n${texto}`;
    case "humanizar":
      return `Reescribe el siguiente texto para que suene natural y humano, sin cambiar el contenido:\n\n${texto}`;
    case "organizar":
      return `Organiza el siguiente texto en secciones claras y bien estructuradas:\n\n${texto}`;
    case "mejorar":
      return `Mejora la fluidez y el nivel académico del siguiente texto en español:\n\n${texto}`;
    case "parafrasear":
      return `Parafrasea el siguiente texto en español manteniendo el significado:\n\n${texto}`;
    case "detectarIA":
      return `Analiza si el siguiente texto podría haber sido generado por IA y sugiere mejoras para que parezca más humano:\n\n${texto}`;
    case "plagio":
      return `Actúa como revisor académico y señala posibles riesgos de plagio en el texto, con sugerencias de mejora:\n\n${texto}`;
    default:
      return texto;
  }
}

export async function POST(req: NextRequest) {
  try {
    // ✅ Crear el cliente AQUÍ, no arriba
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada en el entorno." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const { texto, modo } = body;

    if (!texto || typeof texto !== "string") {
      return NextResponse.json(
        { error: "Falta el campo 'texto'." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(texto, modo || "corregir");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const output =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "No se pudo generar respuesta.";

    return NextResponse.json({ resultado: output });
  } catch (error) {
    console.error("Error /api/ai:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
