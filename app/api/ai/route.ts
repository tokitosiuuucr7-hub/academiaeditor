// app/api/process/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Cliente de OpenAI SOLO en el servidor
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Si quieres forzar runtime Node (opcional):
// export const runtime = "nodejs";

type Mode =
  | "correccion"        // Corrección académica
  | "resumen"          // Resumir
  | "redactar"         // Redactar PRO
  | "redaccion_natural"// Redacción natural PRO
  | "organizar"        // Organizar PRO
  | "mejorar_nivel"    // Mejorar nivel PRO
  | "parafrasear"      // Parafrasear PRO
  | "detector_ia"      // Detector IA PRO
  | "plagio";          // Revisión de plagio PRO (solo análisis orientativo)

// Genera el mensaje de sistema según la pestaña / modo
function getSystemPrompt(mode: Mode): string {
  switch (mode) {
    case "correccion":
      return `
Eres un corrector académico experto. 
Corrige ortografía, gramática, puntuación y acentos en español neutro.
Respeta al máximo el estilo del autor y su estructura.
Devuelve SOLO el texto corregido, sin explicaciones.
`;

    case "resumen":
      return `
Eres un experto en redacción académica.
Resume el texto del usuario en español claro y conciso, manteniendo las ideas principales.
Devuelve SOLO el resumen, sin comentarios adicionales.
`;

    case "redactar":
      return `
Eres un redactor académico profesional.
Reescribe el texto del usuario con estilo formal académico, mejorando claridad, cohesión y vocabulario.
Mantén el significado original.
Devuelve SOLO la versión mejorada.
`;

    case "redaccion_natural":
      return `
Eres un editor especializado en hacer textos más naturales.
Convierte el texto del usuario en un estilo más conversacional y fácil de leer,
sin perder el contenido ni el registro respetuoso.
Devuelve SOLO el texto reescrito.
`;

    case "organizar":
      return `
Eres un editor académico que organiza textos.
Reorganiza el texto para que tenga una estructura clara (introducción, desarrollo, conclusión),
usando conectores lógicos. No inventes contenido nuevo importante.
Devuelve SOLO el texto reorganizado.
`;

    case "mejorar_nivel":
      return `
Eres un editor académico avanzado.
Eleva el nivel del texto del usuario al estilo universitario, con mejor vocabulario y redacción,
pero sin agregar ideas nuevas.
Devuelve SOLO el texto mejorado.
`;

    case "parafrasear":
      return `
Eres un experto en parafraseo académico.
Reescribe el texto del usuario con otras palabras, cambiando estructura y vocabulario
para evitar plagio, pero conservando el significado.
Devuelve SOLO el texto parafraseado.
`;

    case "detector_ia":
      return `
Eres un analista de estilo de texto.
Evalúa si el texto parece escrito por una IA o por un humano y explica brevemente por qué.
Devuelve un breve diagnóstico y una explicación corta.
`;

    case "plagio":
      return `
Eres un asesor académico.
No tienes acceso a bases de datos de plagio, pero puedes identificar frases muy genéricas
o poco originales y sugerir cómo reescribirlas.
Señala posibles riesgos de similitud y sugiere mejoras.
`;

    default:
      return `
Eres un editor académico que mejora claridad, gramática y estilo del texto del usuario
sin cambiar su significado. Devuelve SOLO el texto mejorado.
`;
  }
}

export async function POST(req: Request) {
  try {
    // 1. Leer body
    const body = await req.json().catch(() => ({}));
    const text: string = body.text ?? "";
    const mode: Mode = body.mode ?? "correccion";

    // 2. Validaciones básicas
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Falta el campo 'text' en el body de la petición." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // No rompas el build: solo error en tiempo de ejecución
      return NextResponse.json(
        { error: "Falta la variable de entorno OPENAI_API_KEY en el servidor." },
        { status: 500 }
      );
    }

    const systemPrompt = getSystemPrompt(mode);

    // 3. Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // o el modelo que estés usando
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      temperature: 0.4,
    });

    const result =
      completion.choices[0]?.message?.content?.trim() ??
      "No se recibió respuesta del modelo.";

    // 4. Respuesta al front
    return NextResponse.json({ result });
  } catch (err) {
    console.error("Error en /api/process:", err);
    return NextResponse.json(
      { error: "Error interno al procesar el texto." },
      { status: 500 }
    );
  }
}
