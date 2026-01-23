"use client";

import { useMemo, useState, type CSSProperties } from "react";

type Mode =
  | "corregir"
  | "resumir"
  | "redactar"
  | "humanizar"
  | "organizar"
  | "mejorar"
  | "parafrasear"
  | "detectarIA"
  | "plagio";

type Plan = "free" | "pro" | "premium";

const MODES: { id: Mode; label: string }[] = [
  { id: "corregir", label: "Corregir" },
  { id: "resumir", label: "Resumir" },
  { id: "redactar", label: "Redactar" },
  { id: "humanizar", label: "Humanizar" },
  { id: "organizar", label: "Organizar" },
  { id: "mejorar", label: "Mejorar nivel" },
  { id: "parafrasear", label: "Parafrasear" },
  { id: "detectarIA", label: "Detector IA" },
  { id: "plagio", label: "Detector plagio" },
];

// qué modos puede usar cada plan
const FREE_MODES: Mode[] = ["corregir", "resumir"];
const PRO_MODES: Mode[] = [
  ...FREE_MODES,
  "redactar",
  "humanizar",
  "organizar",
  "mejorar",
  "parafrasear",
];
const PREMIUM_MODES: Mode[] = [...PRO_MODES, "detectarIA", "plagio"];

function allowedModesByPlan(plan: Plan): Mode[] {
  if (plan === "free") return FREE_MODES;
  if (plan === "pro") return PRO_MODES;
  return PREMIUM_MODES;
}

export default function Home() {
  const [plan, setPlan] = useState<Plan>("free"); // Gratis por defecto
  const [texto, setTexto] = useState("");
  const [modo, setModo] = useState<Mode>("corregir");
  const [resultado, setResultado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [pagando, setPagando] = useState<Plan | null>(null);

  const placeholder = useMemo(() => {
    switch (modo) {
      case "corregir":
        return "Pega tu texto para corregir ortografía y gramática…";
      case "resumir":
        return "Pega tu texto largo para obtener un resumen claro y estructurado…";
      case "redactar":
        return "Escribe ideas sueltas o bullets y la herramienta intentará redactar un párrafo académico…";
      case "humanizar":
        return "Pega un texto muy robótico para hacerlo más natural y fácil de leer…";
      case "organizar":
        return "Pega un texto desordenado para organizarlo en secciones y párrafos…";
      case "mejorar":
        return "Pega tu texto para mejorar vocabulario, fluidez y nivel académico…";
      case "parafrasear":
        return "Pega un fragmento que quieras reescribir con otras palabras…";
      case "detectarIA":
        return "Pega aquí el texto que quieras analizar para sospecha de redacción con IA (simulado)…";
      case "plagio":
        return "Pega un texto para analizar repeticiones internas y posibles riesgos de plagio (simulado)…";
    }
  }, [modo]);

  // 🔧 Simulador sencillo; luego se puede conectar a IA real
  function procesarTextoSimulado(input: string, m: Mode) {
    const limpio = input.trim();
    if (!limpio) return "";

    const base = limpio.replace(/\s+/g, " ");

    switch (m) {
      case "corregir": {
        const sentences = base
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
        return "✅ Versión corregida (simulada):\n\n" + sentences.join(" ");
      }
      case "resumir": {
        const palabras = base.split(/\s+/);
        const primeras = palabras.slice(0, 80).join(" ");
        return (
          "📌 Resumen (simulado):\n\n" +
          "• Idea principal: " +
          primeras +
          (palabras.length > 80 ? "…" : "") +
          "\n• Longitud original: " +
          palabras.length +
          " palabras."
        );
      }
      case "redactar": {
        return (
          "📝 Redacción (simulada):\n\n" +
          "El presente texto desarrolla las siguientes ideas de manera articulada: " +
          base
        );
      }
      case "humanizar": {
        return (
          "🤝 Versión más natural (simulada):\n\n" +
          "En pocas palabras, el texto dice lo siguiente de forma más cercana:\n" +
          base
        );
      }
      case "organizar": {
        return `📚 Organización sugerida (simulada):

INTRODUCCIÓN
- Contexto general
- Propósito del texto

DESARROLLO
- Idea principal 1
- Idea principal 2
- Argumentos de apoyo

CONCLUSIÓN
- Síntesis de hallazgos
- Cierre o recomendación

TEXTO ORIGINAL
--------------------
${base}`;
      }
      case "mejorar": {
        return (
          "🚀 Sugerencia de mejora (simulada):\n\n" +
          "Este texto puede ganar claridad si se revisan conectores, tiempos verbales y se incorporan términos más precisos. Versión base:\n\n" +
          base
        );
      }
      case "parafrasear": {
        return (
          "🔁 Parafraseo (simulado):\n\n" +
          "En esencia, el texto puede expresarse así con otras palabras:\n" +
          base
        );
      }
      case "detectarIA": {
        // simulito tonto: si tiene pocas palabras distintas, sube la “sospecha”
        const palabras = base.split(/\s+/);
        const total = palabras.length;
        const uniques = new Set(
          palabras.map((p) => p.toLowerCase().replace(/[^a-záéíóúüñ]/gi, ""))
        ).size;
        const ratio = total ? uniques / total : 0;
        let prob = 50;
        if (ratio < 0.4) prob = 75;
        else if (ratio > 0.65) prob = 30;

        return (
          "🤖 Detector de IA (SIMULADO, NO REAL)\n\n" +
          `• Longitud aproximada: ${total} palabras\n` +
          `• Palabras únicas aprox.: ${uniques}\n` +
          `• Diversidad léxica (estimada): ${(ratio * 100).toFixed(1)}%\n\n` +
          `➡ Probabilidad ESTIMADA (ficticia) de que haya sido generado con IA: ${prob}%\n\n` +
          "⚠ Esta herramienta es SOLO orientativa y educativa. No es un detector oficial ni debe usarse como prueba definitiva."
        );
      }
      case "plagio": {
        const oraciones = base
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter(Boolean);
        const conteo: Record<string, number> = {};
        oraciones.forEach((o) => {
          conteo[o] = (conteo[o] || 0) + 1;
        });
        const repetidas = Object.entries(conteo)
          .filter(([_, c]) => c > 1)
          .map(([o, c]) => `• "${o}" (se repite ${c} veces)`);

        return (
          "🔍 Detector de plagio interno (SIMULADO)\n\n" +
          `• Oraciones totales: ${oraciones.length}\n` +
          `• Oraciones diferentes: ${Object.keys(conteo).length}\n\n` +
          (repetidas.length
            ? "Frases que aparecen varias veces:\n" +
              repetidas.join("\n") +
              "\n\n"
            : "No se detectaron frases internamente repetidas de forma clara.\n\n") +
          "⚠ Este detector solo analiza repeticiones dentro del MISMO texto.\n" +
          "No compara contra internet ni bases de datos. Es solo una ayuda educativa."
        );
      }
    }
  }

  async function onProcesar() {
    setCargando(true);
    setResultado("");

    await new Promise((r) => setTimeout(r, 700)); // pequeño “loading”

    const out = procesarTextoSimulado(texto, modo);
    setResultado(out || "⚠️ Pega un texto primero.");
    setCargando(false);
  }

  // 🔐 “Pago” simulado: activa PRO o PREMIUM sin dinero real (para pruebas)
  async function activarPlanSimulado(target: Plan, precio: number) {
    if (plan === target) return;
    setPagando(target);
    await new Promise((r) => setTimeout(r, 1200));
    setPlan(target);
    setPagando(null);
    alert(
      `✅ Plan ${target.toUpperCase()} activado (simulado). Valor: $${precio.toLocaleString(
        "es-CO"
      )}. Para cobros reales hay que conectar una pasarela de pagos.`
    );
  }

  const planLabel =
    plan === "free" ? "GRATIS" : plan === "pro" ? "PRO" : "PREMIUM";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #1f2937 0, #020617 55%)",
        padding: "40px 16px",
        color: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.9))",
          borderRadius: 28,
          padding: 32,
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(148,163,184,0.15)",
          border: "1px solid rgba(148,163,184,0.18)",
        }}
      >
        {/* Header con logo estilo “superhéroe” */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Logo circular tipo insignia */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "999px",
                border: "2px solid #22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "radial-gradient(circle at 30% 20%, #4ade80, #16a34a 40%, #0f172a 100%)",
                boxShadow:
                  "0 0 25px rgba(34,197,94,0.7), 0 0 0 1px rgba(15,23,42,0.9)",
                transform: "skewX(-8deg)",
              }}
            >
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 22,
                  letterSpacing: -1,
                  textShadow: "0 0 10px rgba(0,0,0,0.6)",
                }}
              >
                AE
              </span>
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 24,
                  letterSpacing: 0.4,
                  fontWeight: 700,
                }}
              >
                Academia Editor
              </h1>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 13,
                  color: "#9ca3af",
                }}
              >
                Plataforma académica con IA. Planes GRATIS, PRO y PREMIUM para
                estudiantes y docentes.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#6b7280",
              }}
            >
              v0.2 · Modo laboratorio
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.6)",
                display: "inline-block",
              }}
            >
              Plan actual:{" "}
              <strong
                style={{
                  color:
                    plan === "premium"
                      ? "#facc15"
                      : plan === "pro"
                      ? "#22c55e"
                      : "#e5e7eb",
                }}
              >
                {planLabel}
              </strong>
            </div>
          </div>
        </header>

        {/* Sección de precios */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Plan gratis */}
          <div style={pricingCardStyle(plan === "free")}>
            <div style={planTitleStyle}>Plan Gratis</div>
            <div style={priceStyle}>
              $0 <span style={priceUnitStyle}>/mes</span>
            </div>
            <ul style={pricingListStyle}>
              <li>✔ Acceso a Corregir</li>
              <li>✔ Acceso a Resumir</li>
              <li>✖ Otras funciones PRO/PREMIUM bloqueadas</li>
            </ul>
            <button style={currentPlanButtonStyle}>Plan actual</button>
          </div>

          {/* Plan PRO */}
          <div style={pricingCardStyle(plan === "pro")}>
            <div style={{ ...planTitleStyle, color: "#22c55e" }}>Plan Pro</div>
            <div style={priceStyle}>
              $10.000 <span style={priceUnitStyle}>/mes</span>
            </div>
            <ul style={pricingListStyle}>
              <li>✔ Todo lo del plan Gratis</li>
              <li>✔ Redactar, Humanizar, Organizar</li>
              <li>✔ Mejorar nivel y Parafrasear</li>
              <li>✖ Detectores de IA y plagio</li>
            </ul>
            <button
              onClick={() => activarPlanSimulado("pro", 10000)}
              disabled={plan === "pro" || pagando !== null}
              style={payButtonStyle(
                plan === "pro",
                pagando === "pro",
                "#22c55e"
              )}
            >
              {plan === "pro"
                ? "Ya eres PRO"
                : pagando === "pro"
                ? "Procesando pago…"
                : "Pagar PRO (simulado)"}
            </button>
          </div>

          {/* Plan PREMIUM */}
          <div style={pricingCardStyle(plan === "premium")}>
            <div style={{ ...planTitleStyle, color: "#facc15" }}>
              Plan Premium
            </div>
            <div style={priceStyle}>
              $12.000 <span style={priceUnitStyle}>/mes</span>
            </div>
            <ul style={pricingListStyle}>
              <li>✔ Todo lo del plan Pro</li>
              <li>✔ Detector de IA (simulado)</li>
              <li>✔ Detector de plagio interno (simulado)</li>
            </ul>
            <button
              onClick={() => activarPlanSimulado("premium", 12000)}
              disabled={plan === "premium" || pagando !== null}
              style={payButtonStyle(
                plan === "premium",
                pagando === "premium",
                "#facc15"
              )}
            >
              {plan === "premium"
                ? "Ya eres PREMIUM"
                : pagando === "premium"
                ? "Procesando pago…"
                : "Pagar PREMIUM (simulado)"}
            </button>
          </div>
        </section>

        {/* Selector de modo */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          {MODES.map((m) => {
            const allowed = allowedModesByPlan(plan);
            const locked = !allowed.includes(m.id);

            return (
              <button
                key={m.id}
                onClick={() => {
                  if (locked) {
                    alert(
                      "🔒 Esta función está bloqueada en tu plan actual. Actualiza tu plan para usarla."
                    );
                    return;
                  }
                  setModo(m.id);
                }}
                disabled={locked}
                style={chipStyle(m.id, modo, locked)}
              >
                {m.label}
                {locked && (
                  <span style={{ fontSize: 10, marginLeft: 4 }}>
                    {plan === "free" ? "PRO" : "PREMIUM"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Área de texto */}
        <section style={{ marginBottom: 16 }}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={placeholder}
            style={{
              width: "100%",
              height: 220,
              marginTop: 4,
              padding: 14,
              fontSize: 15,
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.4)",
              outline: "none",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
              color: "#e5e7eb",
              resize: "vertical",
              boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.9)",
            }}
          />
        </section>

        {/* Botón procesar */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button
            onClick={onProcesar}
            disabled={cargando}
            style={{
              padding: "10px 22px",
              fontSize: 15,
              borderRadius: 999,
              border: "none",
              cursor: cargando ? "wait" : "pointer",
              background:
                "linear-gradient(135deg, #22c55e, #16a34a, #22c55e 80%)",
              color: "#022c22",
              fontWeight: 700,
              boxShadow:
                "0 10px 30px rgba(34,197,94,0.45), 0 0 0 1px rgba(15,23,42,0.9)",
              opacity: cargando ? 0.7 : 1,
            }}
          >
            {cargando ? "Procesando…" : "Procesar texto"}
          </button>
        </div>

        {/* Resultado */}
        <section style={{ marginTop: 18 }}>
          <div
            style={{
              fontSize: 13,
              marginBottom: 6,
              color: "#9ca3af",
            }}
          >
            Resultado
          </div>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.9))",
              padding: 14,
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.35)",
              minHeight: 80,
              fontSize: 14,
              color: resultado ? "#e5e7eb" : "#6b7280",
            }}
          >
            {resultado || "Aquí verás el resultado…"}
          </pre>
        </section>
      </div>
    </main>
  );
}

/** 🎨 Estilos auxiliares */

function pricingCardStyle(selected: boolean): CSSProperties {
  return {
    borderRadius: 18,
    padding: 16,
    border: selected
      ? "1px solid rgba(34,197,94,0.8)"
      : "1px solid rgba(148,163,184,0.45)",
    background: selected
      ? "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(15,23,42,0.95))"
      : "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
    boxShadow: selected ? "0 10px 30px rgba(34,197,94,0.35)" : "none",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minHeight: 170,
  };
}

const planTitleStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  color: "#9ca3af",
};

const priceStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginTop: 4,
};

const priceUnitStyle: CSSProperties = {
  fontSize: 13,
  color: "#9ca3af",
};

const pricingListStyle: CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: "10px 0",
  fontSize: 13,
  color: "#e5e7eb",
};

const currentPlanButtonStyle: CSSProperties = {
  marginTop: "auto",
  padding: "6px 12px",
  borderRadius: 999,
  border: "1px solid rgba(148,163,184,0.7)",
  background: "transparent",
  color: "#e5e7eb",
  fontSize: 13,
  cursor: "default",
};

function payButtonStyle(
  isCurrent: boolean,
  isPaying: boolean,
  color: string
): CSSProperties {
  return {
    marginTop: "auto",
    padding: "8px 14px",
    borderRadius: 999,
    border: "none",
    background: `linear-gradient(135deg, ${color}, ${color}, ${color})`,
    color: "#022c22",
    fontWeight: 700,
    fontSize: 13,
    cursor: isCurrent || isPaying ? "not-allowed" : "pointer",
    opacity: isCurrent || isPaying ? 0.7 : 1,
  };
}

/** 🎨 Estilo distinto para cada modo (y si está bloqueado) */
function chipStyle(
  id: Mode,
  activo: Mode,
  locked: boolean
): CSSProperties {
  const isActive = id === activo;

  const base: CSSProperties = {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid transparent",
    fontSize: 13,
    cursor: locked ? "not-allowed" : "pointer",
    background: "transparent",
    color: "#e5e7eb",
    transition: "all 0.15s ease",
    opacity: locked ? 0.45 : 1,
  };

  if (locked) {
    return {
      ...base,
      borderColor: "rgba(55,65,81,0.9)",
      color: "#9ca3af",
    };
  }

  const palette: Record<
    Mode,
    { bg: string; border: string; text: string }
  > = {
    corregir: {
      bg: "rgba(34,197,94,0.16)",
      border: "rgba(34,197,94,0.8)",
      text: "#bbf7d0",
    },
    resumir: {
      bg: "rgba(56,189,248,0.16)",
      border: "rgba(56,189,248,0.8)",
      text: "#bae6fd",
    },
    redactar: {
      bg: "rgba(244,114,182,0.16)",
      border: "rgba(244,114,182,0.8)",
      text: "#f9a8d4",
    },
    humanizar: {
      bg: "rgba(249,115,22,0.16)",
      border: "rgba(249,115,22,0.8)",
      text: "#fed7aa",
    },
    organizar: {
      bg: "rgba(129,140,248,0.16)",
      border: "rgba(129,140,248,0.8)",
      text: "#c7d2fe",
    },
    mejorar: {
      bg: "rgba(45,212,191,0.16)",
      border: "rgba(45,212,191,0.8)",
      text: "#a5f3fc",
    },
    parafrasear: {
      bg: "rgba(248,250,252,0.04)",
      border: "rgba(148,163,184,0.7)",
      text: "#e5e7eb",
    },
    detectarIA: {
      bg: "rgba(248,250,252,0.06)",
      border: "rgba(251,191,36,0.9)",
      text: "#facc15",
    },
    plagio: {
      bg: "rgba(248,250,252,0.06)",
      border: "rgba(248,113,113,0.9)",
      text: "#fecaca",
    },
  };

  if (isActive) {
    const p = palette[id];
    return {
      ...base,
      background: p.bg,
      borderColor: p.border,
      color: p.text,
      boxShadow: "0 0 0 1px rgba(15,23,42,0.9)",
    };
  }

  // estilo cuando NO está activo
  return {
    ...base,
    borderColor: "rgba(55,65,81,0.9)",
    color: "#9ca3af",
  };
}
