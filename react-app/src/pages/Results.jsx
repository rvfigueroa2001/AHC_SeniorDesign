// src/pages/Results.jsx
import React from "react";

export default function Results() {
const raw = localStorage.getItem("housingResults");
let data = null;

try {
    data = raw ? JSON.parse(raw) : null;
} catch (err) {
    console.error("Error parsing housingResults:", err);
}

return (
    <div className="container py-5">
    <h2>Results</h2>
    {data ? (
        <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(data, null, 2)}
        </pre>
    ) : (
        <p>No hay resultados guardados (localStorage vacío)</p>
    )}
    </div>
);
}
