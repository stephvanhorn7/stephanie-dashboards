import { useState } from "react";
import BookstoreDashboard from "./BookstoreDashboard.jsx";
import RelocationDashboard from "./RelocationDashboard.jsx";

export default function App() {
  const [tab, setTab] = useState("bookstore");

  const tabBtn = (id, label) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding: "10px 18px",
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 8,
        border: "1px solid #DFE1E6",
        background: tab === id ? "#14213D" : "#FFFFFF",
        color: tab === id ? "#FFFFFF" : "#172B4D",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F4F5F7" }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "16px 20px",
          borderBottom: "1px solid #DFE1E6",
          background: "#FFFFFF",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        {tabBtn("bookstore", "Bookstore Delivery Dashboard")}
        {tabBtn("relocation", "DFW Relocation Dashboard")}
        <a
          href="https://your-portfolio-url.example.com"
          style={{
            marginLeft: "auto",
            alignSelf: "center",
            fontSize: 12.5,
            fontFamily: "monospace",
            color: "#0F766E",
          }}
        >
          ← Back to portfolio
        </a>
      </div>
      {tab === "bookstore" ? <BookstoreDashboard /> : <RelocationDashboard />}
    </div>
  );
}
