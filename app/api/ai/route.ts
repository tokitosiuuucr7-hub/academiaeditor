// app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildPrompt(texto: string, modo: string): string {
  switch (modo) {
    case "corregir":
      return `Corrige ortografía, gramática y puntuación de este texto en español, manteniendo el estilo original. Solo devuelve el texto corregido:\n\n${texto}`;
    case "resumir":
      return `Resume en un párrafo claro y conciso el siguiente texto en español. Solo devuelve el resumen:\n\n${texto}`;
    case "redactar":
      return `Reescribe el siguiente texto o ideas en un párrafo académico coherente y bien redactado en español:\n\n${texto}`;
    case "humanizar":
      return `Reescribe el texto para que suene natural, humano y fluido, sin cambiar el contenido:\n\n${texto}`;
    case "organizar":
      return `Organiza el texto en secciones y párrafos claros, con buena puntuación y cohesión. No agregues ideas nuevas:\n\n${texto}`;
    case "mejorar":
      return `Mejora vocabulario y fluidez en español, manteniendo el significado:\n\n${texto}`;
    case "parafrasear":
      return `Parafrasea el texto con otras palabras en español, conservando el sentido:\n\n${texto}`;
    case "detectarIA":
      return `Analiza si el texto podría haber sido generado por IA (5-7 líneas) y sugiere 2-3 cambios para que parezca más humano:\n\n${texto}`;
    case "plagio":
      return `Actúa como revisor académico: señala partes problemáticas (muy literales o cliché) y sugiere cómo reescribirlas para reducir riesgo de plagio:\n\n${texto}`;
    default:
      return `Corrige ortografía, gramática y claridad del siguiente texto en español. Solo devuelve el texto corregido:\n\n${texto}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { texto, modo } = body as { texto?: string; modo?: string };

    if (!texto || typeof texto !== "string") {
      return NextResponse.json(
        { error: "Falta el campo 'texto' en el body de la petición." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada en el servidor." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const prompt = buildPrompt(texto, modo ?? "corregir");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const output =
      response.output?.[0]?.content?.[0]?.type === "output_text"
        ? response.output[0].content[0].text
        : "No se pudo leer la respuesta de la IA.";

    return NextResponse.json({ resultado: output });
  } catch (err) {
    console.error("Error en /api/ai:", err);
    return NextResponse.json(
      { error: "Error interno en el servidor de IA." },
      { status: 500 }
    );
  }
}
