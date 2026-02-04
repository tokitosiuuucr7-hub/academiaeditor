// app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mapeo de modo → instrucción
function buildPrompt(texto: string, modo: string): string {
  switch (modo) {
    case "corregir":
      return `Corrige ortografía, gramática y puntuación de este texto en español, manteniendo el estilo original. Solo devuelve el texto corregido:\n\n${texto}`;
    case "resumir":
      return `Resume en un párrafo claro y conciso el siguiente texto en español. Solo devuelve el resumen:\n\n${texto}`;
    case "redactar":
      return `Reescribe el siguiente texto o ideas en un párrafo académico coherente y bien redactado en español:\n\n${texto}`;
    case "humanizar":
      return `El siguiente texto suena a veces como hecho por IA. Reescríbelo para que suene natural, humano y fluido, sin cambiar el contenido:\n\n${texto}`;
    case "organizar":
      return `Organiza el siguiente texto en secciones y párrafos claros, con buena puntuación y cohesión. No agregues ideas nuevas:\n\n${texto}`;
    case "mejorar":
      return `Mejora el vocabulario y la fluidez de este texto académico en español, manteniendo el significado:\n\n${texto}`;
    case "parafrasear":
      return `Parafrasea el siguiente texto con otras palabras en español, conservando el sentido:\n\n${texto}`;
    case "detectarIA":
      return `Analiza el siguiente texto en español y escribe un breve análisis (5-7 líneas) sobre si podría haber sido generado por IA, explicando por qué. Luego sugiere 2-3 cambios para que parezca más humano:\n\n${texto}`;
    case "plagio":
      return `No tienes acceso a bases de datos de plagio, pero actúa como un revisor académico: señala posibles partes problemáticas (muy literales o cliché) del texto y sugiere cómo reescribirlas para reducir riesgo de plagio:\n\n${texto}`;
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

    const prompt = buildPrompt(texto, modo ?? "corregir");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const output =
      response.output[0].content[0].type === "output_text"
        ? response.output[0].content[0].text
        : "No se pudo leer la respuesta de la IA.";

    return NextResponse.json({ resultado: output });
  } catch (err: any) {
    console.error("Error en /api/ai:", err);
    return NextResponse.json(
      { error: "Error interno en el servidor de IA." },
      { status: 500 }
    );
  }
}
