// # frontend/src/App.jsx


import { useState } from "react";

function App() {

  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");

  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const [loading, setLoading] = useState(false);

  async function ingestDocument() {

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/documents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            source_url: url
          })
        }
      );

      if (!response.ok) {
        throw new Error("Ingestion failed");
      }

      setAnswer(
        "Document ingestion started successfully."
      );

      setSources([]);

    } catch (error) {

      console.error(error);

      setAnswer("Failed to ingest document.");

    } finally {

      setLoading(false);
    }
  }

  async function searchDocuments() {

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: query
          })
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      setAnswer(data.answer);

      setSources(data.sources || []);

    } catch (error) {

      console.error(error);

      setAnswer("Search request failed.");

    } finally {

      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#f8fafc",
        fontFamily: "Inter, sans-serif",
        padding: "40px 20px"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >

        <div
          style={{
            marginBottom: "40px"
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              marginBottom: "10px",
              fontWeight: "700"
            }}
          >
            RavenFlow
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              maxWidth: "700px",
              lineHeight: "1.6"
            }}
          >
            AI-powered semantic retrieval platform with async ingestion,
            vector search, and grounded generation. Humans apparently enjoy
            turning distributed systems into search boxes.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "30px"
          }}
        >

          <div
            style={{
              background: "#111827",
              border: "1px solid #1e293b",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                fontSize: "24px"
              }}
            >
              Ingest Document
            </h2>

            <input
              type="text"
              placeholder="Paste document URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
                marginBottom: "18px",
                outline: "none",
                fontSize: "15px"
              }}
            />

            <button
              onClick={ingestDocument}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "#2563eb",
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {loading ? "Processing..." : "Ingest Document"}
            </button>
          </div>

          <div
            style={{
              background: "#111827",
              border: "1px solid #1e293b",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                fontSize: "24px"
              }}
            >
              Ask RavenFlow
            </h2>

            <input
              type="text"
              placeholder="Ask a question"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
                marginBottom: "18px",
                outline: "none",
                fontSize: "15px"
              }}
            />

            <button
              onClick={searchDocuments}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "#7c3aed",
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {loading ? "Thinking..." : "Search Knowledge Base"}
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
          }}
        >
          <h2
            style={{
              marginBottom: "18px",
              fontSize: "28px"
            }}
          >
            AI Response
          </h2>

          <div
            style={{
              background: "#0f172a",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #1e293b",
              lineHeight: "1.8",
              color: "#e2e8f0",
              minHeight: "120px",
              marginBottom: "24px"
            }}
          >
            {
              answer ||
              "Answers generated from semantic retrieval will appear here."
            }
          </div>

          {
            sources.length > 0 && (
              <>
                <h3
                  style={{
                    marginBottom: "18px",
                    color: "#cbd5e1"
                  }}
                >
                  Retrieved Sources
                </h3>

                {
                  sources.map((source, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "14px",
                        padding: "18px",
                        marginBottom: "14px",
                        color: "#cbd5e1",
                        lineHeight: "1.7"
                      }}
                    >
                      {source}
                    </div>
                  ))
                }
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default App;


// # frontend/src/index.css

// ```css
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }

// body {
//   margin: 0;
//   background: #0f172a;
// }

// button {
//   transition: all 0.2s ease;
// }

// button:hover {
//   opacity: 0.9;
//   transform: translateY(-1px);
// }

// input::placeholder {
//   color: #64748b;
// }
// ```

// # frontend/src/main.jsx

// ```jsx
// import React from "react";
// import ReactDOM from "react-dom/client";

// import App from "./App";

// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// ```
