"use client";

import { useMemo, useState, type CSSProperties } from "react";
import PremiumScore from "./components/PremiumScore";

/* =======================
   Tipos básicos
======================= */

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

const MODES: { id: Mode; label: string }[] = [
  { id: "corregir", label: "Corrección académica" },
  { id: "resumir", label: "Resumir" },
  { id: "redactar", label: "Redactar" },
  { id: "humanizar", label: "Redacción natural" },
  { id: "organizar", label: "Organizar" },
  { id: "mejorar", label: "Mejorar nivel" },
  { id: "parafrasear", label: "Parafrasear" },
  { id: "detectarIA", label: "Detector IA" },
  { id: "plagio", label: "Revisión de plagio" },
];

/* =======================
   Componente principal
======================= */

export default function Home() {
  const [texto, setTexto] = useState("");
  const [modo, setModo] = useState<Mode>("corregir");
  const [resultado, setResultado] = useState("");
  const [cargando, setCargando] = useState(false);

  const aiScore = useMemo(() => {
    const n = texto.trim().length;
    if (n === 0) return 0;

    const base = Math.round(n / 18);
    return Math.min(97, Math.max(3, base));
  }, [texto]);

  const plagiarismScore = useMemo(() => {
    if (!texto.trim()) return 0;

    const v = aiScore - 8;
    return Math.max(4, Math.min(92, v));
  }, [texto, aiScore]);

  const placeholder = useMemo(() => {
    switch (modo) {
      case "corregir":
        return "Pega tu texto y obtén una corrección académica lista para entregar (ortografía, gramática y puntuación)…";
      case "resumir":
        return "Pega un texto largo y obtén un resumen claro, corto y estructurado…";
      case "redactar":
        return "Escribe ideas sueltas o bullets y generaremos un párrafo académico coherente…";
      case "humanizar":
        return "Pega un texto generado con IA o muy robótico para convertirlo en una redacción natural que no parece hecha con IA…";
      case "organizar":
        return "Pega un texto desordenado para convertirlo en secciones y párrafos ordenados…";
      case "mejorar":
        return "Pega tu texto para mejorar vocabulario, fluidez y nivel académico sin cambiar el mensaje…";
      case "parafrasear":
        return "Pega un fragmento que quieras reescribir con otras palabras manteniendo la idea…";
      case "detectarIA":
        return "Pega aquí el texto que quieras analizar por posible redacción con IA (análisis orientativo)…";
      case "plagio":
        return "Pega un texto para una revisión preventiva que te ayude a evitar sanciones académicas por plagio (análisis interno simulado)…";
    }
  }, [modo]);

  /* =======================
     Procesar texto con la API /api/ai
  ======================= */

  async function onProcesar() {
    if (!texto.trim()) {
      setResultado("⚠️ Pega un texto primero.");
      return;
    }

    setCargando(true);
    setResultado("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texto,
          modo,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setResultado("❌ Error: " + data.error);
      } else {
        setResultado(data.resultado || "Sin respuesta de la IA.");
      }
    } catch (err) {
      setResultado("❌ Error conectando con la IA.");
    } finally {
      setCargando(false);
    }
  }

  /* =======================
     Render
  ======================= */

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #020617 0, #020617 55%)",
        padding: "40px 16px",
        color: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1120,
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.99), rgba(15,23,42,0.93))",
          borderRadius: 28,
          padding: 32,
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(148,163,184,0.16)",
          border: "1px solid rgba(148,163,184,0.16)",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Logo */}
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
                  "0 0 25px rgba(34,197,94,0.6), 0 0 0 1px rgba(15,23,42,0.9)",
                transform: "skewX(-6deg)",
              }}
            >
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 22,
                  letterSpacing: -1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
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
                  maxWidth: 420,
                }}
              >
                Editor académico con IA para estudiantes y docentes: corrige,
                resume y mejora trabajos en segundos, sin perder tu estilo.
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
              Versión inicial · Acceso gratuito
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 999,
                border: "1px solid rgba(34,197,94,0.6)",
                display: "inline-block",
                color: "#bbf7d0",
                background: "rgba(34,197,94,0.10)",
              }}
            >
              Todas las funciones desbloqueadas
            </div>
          </div>
        </header>

        {/* Texto principal */}
        <p
          style={{
            fontSize: 12,
            color: "#9ca3af",
            marginTop: 0,
            marginBottom: 14,
          }}
        >
          Acceso gratuito por lanzamiento: corrige, resume, redacta, humaniza y
          revisa tus textos académicos con IA.
        </p>

        {/* Franja gratuita */}
        <section
          style={{
            borderRadius: 18,
            padding: 16,
            border: "1px solid rgba(34,197,94,0.45)",
            background:
              "linear-gradient(135deg, rgba(22,163,74,0.12), rgba(15,23,42,0.97))",
            boxShadow: "0 12px 32px rgba(34,197,94,0.18)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: "#bbf7d0",
              marginBottom: 6,
            }}
          >
            Gratis por lanzamiento
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            $0 <span style={{ fontSize: 12, color: "#9ca3af" }}>/mes</span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#e5e7eb",
              lineHeight: 1.5,
            }}
          >
            Todas las herramientas están disponibles sin pago: corrección
            académica, redacción natural, organización, paráfrasis, detector IA
            y revisión preventiva de plagio.
          </p>
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
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setModo(m.id)}
              style={chipStyle(m.id, modo, false)}
            >
              {m.label}
            </button>
          ))}
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
                "linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.9))",
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
            {cargando ? "Procesando…" : "Procesar texto gratis"}
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

          {modo === "detectarIA" && (
            <div style={{ marginBottom: 16 }}>
              <PremiumScore
                label="Detector de IA"
                value={aiScore}
                subtitle="Probabilidad orientativa de redacción con IA"
              />
              <button
                onClick={() => setModo("humanizar")}
                style={{
                  marginTop: 14,
                  width: "100%",
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.55)",
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.86))",
                  color: "#e5e7eb",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                }}
              >
                Humanizar este texto →
              </button>
            </div>
          )}

          {modo === "plagio" && (
            <div style={{ marginBottom: 16 }}>
              <PremiumScore
                label="Revisión de plagio"
                value={plagiarismScore}
                subtitle="Riesgo preventivo de coincidencias (orientativo)"
              />
              <button
                onClick={() => setModo("humanizar")}
                style={{
                  marginTop: 14,
                  width: "100%",
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.55)",
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.86))",
                  color: "#e5e7eb",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                }}
              >
                Humanizar este texto →
              </button>
            </div>
          )}

          <pre
            style={{
              whiteSpace: "pre-wrap",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.9))",
              padding: 14,
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.35)",
              minHeight: 80,
              fontSize: 14,
              color: resultado ? "#e5e7eb" : "#6b7280",
            }}
          >
            {resultado || "Aquí verás el resultado del procesador académico…"}
          </pre>
        </section>
      </div>
    </main>
  );
}

/* =======================
   Estilos auxiliares
======================= */

function pricingCardStyle(selected: boolean): CSSProperties {
  return {
    borderRadius: 18,
    padding: 16,
    border: selected
      ? "1px solid rgba(34,197,94,0.85)"
      : "1px solid rgba(148,163,184,0.45)",
    background: selected
      ? "linear-gradient(135deg, rgba(22,163,74,0.12), rgba(15,23,42,0.97))"
      : "linear-gradient(135deg, rgba(15,23,42,0.99), rgba(15,23,42,0.97))",
    boxShadow: selected ? "0 12px 32px rgba(34,197,94,0.35)" : "none",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minHeight: 180,
  };
}

const planHeaderRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const planTitleStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  color: "#9ca3af",
};

const planBadgeStyle: CSSProperties = {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: 1,
  padding: "2px 8px",
  borderRadius: 999,
  border: "1px solid rgba(148,163,184,0.6)",
  color: "#e5e7eb",
};

const priceStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginTop: 4,
};

const priceUnitStyle: CSSProperties = {
  fontSize: 12,
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

/* Estilos de los chips de modos */

function chipStyle(id: Mode, activo: Mode, locked: boolean): CSSProperties {
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

  const palette: Record<Mode, { bg: string; border: string; text: string }> = {
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

  return {
    ...base,
    borderColor: "rgba(55,65,81,0.9)",
    color: "#9ca3af",
  };
}