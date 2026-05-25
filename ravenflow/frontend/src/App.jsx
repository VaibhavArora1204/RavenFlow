import { useState } from "react";

const StatusDot = ({ active }) => (
  <span style={{
    display: "inline-block",
    width: 8, height: 8,
    borderRadius: "50%",
    background: active ? "#22d3a5" : "#334155",
    boxShadow: active ? "0 0 8px #22d3a580" : "none",
    marginRight: 8,
    transition: "all 0.4s ease"
  }} />
);

const GlowButton = ({ onClick, disabled, loading, label, loadingLabel, accent }) => {
  const colors = {
    blue: { bg: "#1d4ed8", glow: "#3b82f640", hover: "#2563eb" },
    violet: { bg: "#6d28d9", glow: "#7c3aed40", hover: "#7c3aed" },
  };
  const c = colors[accent] || colors.blue;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "13px 20px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.08)",
        background: disabled ? "#1e293b" : c.bg,
        color: disabled ? "#475569" : "#fff",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        boxShadow: disabled ? "none" : `0 4px 20px ${c.glow}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {loading && (
        <span style={{
          display: "inline-block",
          width: 14, height: 14,
          border: "2px solid rgba(255,255,255,0.3)",
          borderTopColor: "#fff",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite"
        }} />
      )}
      {loading ? loadingLabel : label}
    </button>
  );
};

const Panel = ({ children, style }) => (
  <div style={{
    background: "linear-gradient(135deg, #111827 0%, #0d1520 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: "28px 28px 24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
    ...style
  }}>
    {children}
  </div>
);

const StyledInput = ({ value, onChange, placeholder, onKeyDown }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    style={{
      width: "100%",
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.09)",
      background: "rgba(0,0,0,0.3)",
      color: "#f1f5f9",
      fontSize: 14,
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    }}
    onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
  />
);

const SectionLabel = ({ icon, children }) => (
  <div style={{
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#475569",
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 7,
  }}>
    <span style={{ fontSize: 14, opacity: 0.7 }}>{icon}</span>
    {children}
  </div>
);

function App() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(null);
  const [ingestSuccess, setIngestSuccess] = useState(false);

  async function ingestDocument() {
    try {
      setLoading(true);
      setLoadingType("ingest");
      setIngestSuccess(false);
      const response = await fetch("https://ravenflow.onrender.com/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_url: url }),
      });
      if (!response.ok) throw new Error("Ingestion failed");
      setAnswer("Document ingestion started successfully.");
      setSources([]);
      setIngestSuccess(true);
      setUrl("");
    } catch (error) {
      console.error(error);
      setAnswer("Failed to ingest document. Please check the URL and try again.");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  }

  async function searchDocuments() {
    try {
      setLoading(true);
      setLoadingType("search");
      const response = await fetch("https://ravenflow.onrender.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (error) {
      console.error(error);
      setAnswer("Search request failed. The knowledge base may be empty or unreachable.");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  }

  const isLoading = loading;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080e1a",
      color: "#f1f5f9",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      padding: "48px 24px 64px",
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 20% 0%, rgba(29,78,216,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 10%, rgba(109,40,217,0.10) 0%, transparent 55%)
      `,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .source-card { animation: fadeUp 0.35s ease forwards; }
        ::placeholder { color: #334155 !important; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 1060, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 16px rgba(99,102,241,0.4)"
            }}>⬡</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
                background: "linear-gradient(90deg, #f1f5f9, #94a3b8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>RavenFlow</span>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                color: "#1d4ed8", background: "rgba(29,78,216,0.15)",
                border: "1px solid rgba(29,78,216,0.3)", borderRadius: 4,
                padding: "2px 7px", textTransform: "uppercase"
              }}>Beta</span>
            </div>
          </div>

          <h1 style={{
            fontSize: 44, fontWeight: 700, lineHeight: 1.1,
            letterSpacing: "-0.03em", marginBottom: 16,
            background: "linear-gradient(135deg, #f1f5f9 30%, #64748b 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            maxWidth: 640,
          }}>
            Semantic retrieval,<br />grounded answers.
          </h1>

          <p style={{
            color: "#475569", fontSize: 16, lineHeight: 1.7,
            maxWidth: 520, fontWeight: 400,
          }}>
            Ingest any document, then ask questions — RavenFlow returns precise,
            source-grounded answers using vector search and AI generation.
          </p>

          <div style={{
            display: "flex", alignItems: "center", gap: 20, marginTop: 20,
            paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)"
          }}>
            {[
              { label: "Vector Search", active: true },
              { label: "Async Ingestion", active: true },
              { label: "Grounded Generation", active: true },
            ].map(({ label, active }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#64748b" }}>
                <StatusDot active={active} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Cards row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Ingest */}
          <Panel>
            <SectionLabel icon="⤓">Ingest Document</SectionLabel>
            <p style={{ fontSize: 13, color: "#475569", marginBottom: 18, lineHeight: 1.6 }}>
              Provide a public URL to a document. It will be parsed, chunked, and embedded into the knowledge base.
            </p>
            <div style={{ marginBottom: 12 }}>
              <StyledInput
                placeholder="https://example.com/document.pdf"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !isLoading && url && ingestDocument()}
              />
            </div>
            <GlowButton
              onClick={ingestDocument}
              disabled={isLoading || !url.trim()}
              loading={loadingType === "ingest"}
              label="Ingest Document"
              loadingLabel="Processing…"
              accent="blue"
            />
            {ingestSuccess && (
              <div style={{
                marginTop: 12, padding: "10px 14px", borderRadius: 8,
                background: "rgba(34,211,165,0.08)", border: "1px solid rgba(34,211,165,0.2)",
                color: "#22d3a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>✓</span> Ingestion queued successfully
              </div>
            )}
          </Panel>

          {/* Search */}
          <Panel>
            <SectionLabel icon="◈">Ask Knowledge Base</SectionLabel>
            <p style={{ fontSize: 13, color: "#475569", marginBottom: 18, lineHeight: 1.6 }}>
              Ask a natural language question. RavenFlow retrieves relevant passages and generates a grounded answer.
            </p>
            <div style={{ marginBottom: 12 }}>
              <StyledInput
                placeholder="What does the document say about…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !isLoading && query && searchDocuments()}
              />
            </div>
            <GlowButton
              onClick={searchDocuments}
              disabled={isLoading || !query.trim()}
              loading={loadingType === "search"}
              label="Search Knowledge Base"
              loadingLabel="Thinking…"
              accent="violet"
            />
          </Panel>
        </div>

        {/* Response panel */}
        <Panel>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <SectionLabel icon="◎">AI Response</SectionLabel>
            {answer && (
              <span style={{ fontSize: 12, color: "#334155", fontFamily: "'DM Mono', monospace" }}>
                {sources.length > 0 ? `${sources.length} source${sources.length > 1 ? "s" : ""} retrieved` : "direct response"}
              </span>
            )}
          </div>

          <div style={{
            background: "rgba(0,0,0,0.25)",
            borderRadius: 12,
            padding: "22px 24px",
            border: "1px solid rgba(255,255,255,0.05)",
            lineHeight: 1.8,
            color: answer ? "#e2e8f0" : "#334155",
            minHeight: 120,
            fontSize: 15,
            fontStyle: answer ? "normal" : "italic",
            marginBottom: sources.length > 0 ? 24 : 0,
            position: "relative",
            overflow: "hidden",
          }}>
            {loadingType === "search" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#475569" }}>
                <span style={{
                  display: "inline-block", width: 16, height: 16,
                  border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#6d28d9",
                  borderRadius: "50%", animation: "spin 0.7s linear infinite"
                }} />
                Searching knowledge base…
              </div>
            ) : (
              answer || "Semantic search results and AI-generated answers will appear here."
            )}
          </div>

          {sources.length > 0 && (
            <>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                color: "#334155", textTransform: "uppercase", marginBottom: 12,
              }}>
                Retrieved Sources ({sources.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="source-card"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "3px solid rgba(109,40,217,0.6)",
                      borderRadius: "0 10px 10px 0",
                      padding: "14px 18px",
                      color: "#94a3b8",
                      lineHeight: 1.7,
                      fontSize: 14,
                      animationDelay: `${index * 0.07}s`,
                    }}
                  >
                    <div style={{
                      fontSize: 10, color: "#334155", fontFamily: "'DM Mono', monospace",
                      marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em"
                    }}>
                      Source {index + 1}
                    </div>
                    {source}
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>

        {/* Footer */}
        <div style={{
          marginTop: 40, textAlign: "center",
          fontSize: 12, color: "#1e293b", letterSpacing: "0.04em"
        }}>
          RavenFlow · AI-Powered Retrieval Platform
        </div>
      </div>
    </div>
  );
}

export default App;
