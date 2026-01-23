import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type Mode = "corregir" | "humanizar" | "organizar" | "resumir";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODE_INSTRUCTIONS: Record<Mode, string> = {
  corregir:
    "Corrige ortografía, gramática, acentuación y puntuación del texto en español. " +
    "Mantén el sentido original y el estilo académico. Devuelve solo la versión corregida.",
  humanizar:
    "Reescribe el texto en un tono más natural, claro y humano, pero manteniendo el rigor académico. " +
    "Evita frases robóticas o repetitivas. Devuelve solo la versión mejorada.",
  organizar:
    "Organiza el contenido en estructura académica: INTRODUCCIÓN, DESARROLLO y CONCLUSIÓN. " +
    "Ordena las ideas lógicamente, mejora la coherencia y cohesión. Devuelve solo el texto organizado.",
  resumir:
    "Elabora un resumen en español, breve pero completo, con ideas clave, sin perder precisión. " +
    "Puedes usar viñetas si ayuda a la claridad. Devuelve solo el resumen.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string | undefined = body?.text;
    const mode: Mode = (body?.mode as Mode) ?? "corregir";

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No se recibió texto para procesar." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Falta la variable OPENAI_API_KEY en .env.local. Añádela y reinicia el servidor.",
        },
        { status: 500 }
      );
    }

    const instruccionModo = MODE_INSTRUCTIONS[mode] ?? MODE_INSTRUCTIONS["corregir"];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // puedes cambiar a gpt-4o-mini si lo prefieres
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente experto en redacción académica en español. " +
            "Siempre devuelves SOLO el texto final solicitado, sin explicaciones adicionales.",
        },
        {
          role: "user",
          content: `${instruccionModo}\n\nTexto original:\n\n${text}`,
        },
      ],
      temperature: 0.3,
      max_completion_tokens: 800, // para permitir respuestas largas
    });

    const result =
      completion.choices[0]?.message?.content?.trim() ??
      "No se obtuvo respuesta de la IA.";

    return NextResponse.json({ result }, { status: 200 });
  } catch (err: any) {
    console.error("Error en /api/ai:", err);
return NextResponse.json(
  {
    error: String(err),
    stack: err?.stack ?? null,
  },
  { status: 500 }
);

    const status = err?.status ?? 500;
    let message =
      "Error interno al llamar a la IA. Intenta de nuevo en unos momentos.";

    if (status === 429) {
      message =
        "Error 429: Parece que has alcanzado algún límite de uso o cuota en OpenAI. " +
        "Revisa en https://platform.openai.com/ la sección Billing y Usage (asegúrate de que el proyecto y la organización correctos tienen saldo).";
    } else if (err?.message) {
      message = err.message;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
