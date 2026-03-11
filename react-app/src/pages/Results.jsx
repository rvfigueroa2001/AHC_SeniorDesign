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

    // Some backend responses return `results` as a JSON-encoded string.
    let parsedResults = data?.results;
    if (typeof parsedResults === "string") {
        try {
            parsedResults = JSON.parse(parsedResults);
        } catch {
            // Keep raw string if it is not valid JSON.
        }
    }

    const displayData = data
        ? {
                ...data,
                ...(data.results !== undefined ? { results: parsedResults } : {}),
            }
        : null;

    return (
    <div className="container py-5">
            <h2>Results</h2>
            {displayData ? (
        <pre style={{ whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(displayData, null, 2)}
        </pre>
            ) : (
        <p>No hay resultados guardados (localStorage vacío)</p>
            )}
    </div>
    );
}
