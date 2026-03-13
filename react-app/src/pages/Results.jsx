// src/pages/Results.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PROPERTY_ARRAY_KEYS = [
    "properties",
    "matched_properties",
    "matching_properties",
    "matches",
    "results",
    "data",
    "items",
    "listings",
];

const LINK_KEYS = [
    "url",
    "link",
    "website",
    "property_url",
    "propertyLink",
    "application_url",
    "apply_url",
];

function normalizeObject(value) {
    if (!value) return null;
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }

    return typeof value === "object" ? value : null;
}

function pickLink(item) {
    for (const key of LINK_KEYS) {
        if (typeof item?.[key] === "string" && item[key].trim()) {
            return item[key].trim();
        }
    }

    return "";
}

function buildFallbackLink(name, address) {
    const query = [name, address].filter(Boolean).join(" ").trim();
    if (!query) return "";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function formatAmiPercent(value) {
    if (value === null || value === undefined || value === "") return "N/A";

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return "N/A";
        if (trimmed.includes("%")) return trimmed;

        const numericFromString = Number(trimmed);
        if (Number.isNaN(numericFromString)) return trimmed;

        const percentValue = numericFromString > 0 && numericFromString <= 1
            ? numericFromString * 100
            : numericFromString;
        return `${percentValue}%`;
    }

    if (typeof value === "number") {
        if (!Number.isFinite(value)) return "N/A";
        const percentValue = value > 0 && value <= 1 ? value * 100 : value;
        return `${percentValue}%`;
    }

    return String(value);
}

function toPropertyCards(payload) {
    if (!payload || typeof payload !== "object") return [];

    const candidates = [];

    if (Array.isArray(payload)) {
        candidates.push(...payload);
    }

    for (const key of PROPERTY_ARRAY_KEYS) {
        const value = normalizeObject(payload[key]);
        if (Array.isArray(value)) candidates.push(...value);
    }

    if (Array.isArray(payload.results)) {
        candidates.push(...payload.results);
    }

    // Handle a single-property payload.
    if (candidates.length === 0 && (payload.name || payload.property_name || payload.address)) {
        candidates.push(payload);
    }

    return candidates
        .filter((item) => item && typeof item === "object")
        .map((item, index) => {
            const name =
                item.property_name ||
                item.propertyName ||
                item.name ||
                item.development_name ||
                `Property ${index + 1}`;

            const address =
                item.address ||
                [item.street, item.city, item.state, item.zip].filter(Boolean).join(", ") ||
                item.location ||
                "Address not provided";

            const ami =
                item.ami_level ||
                item.ami ||
                item.ami_limit_percent ||
                item.ami_percentage ||
                item.income_limit;

            const units = item.units_available || item.units || item.bedrooms || "N/A";
            const rent = item.rent || item.monthly_rent || item.price || "N/A";
            const link = pickLink(item);
            const fallbackLink = buildFallbackLink(name, address);

            return {
                id: item.id || item.property_id || `${name}-${index}`,
                name,
                address,
                ami: formatAmiPercent(ami),
                units,
                rent,
                link: link || fallbackLink,
            };
        });
}

export default function Results() {
    const { isAdmin } = useAuth();
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

    const properties = toPropertyCards(displayData);

    return (
        <section className="results-page">
            <div className="container">
                <div className="results-header mb-4">
                    <h2 className="mb-2">Eligible Properties</h2>
                    <p className="mb-0 text-muted">These are the properties that best match your AMI profile.</p>
                </div>

                {properties.length > 0 ? (
                    <div className="results-grid">
                        {properties.map((property) => (
                            <article key={property.id} className="property-card">
                                <h3 className="property-name">{property.name}</h3>
                                <p className="property-address mb-3">{property.address}</p>

                                <div className="property-meta">
                                    <span><strong>AMI:</strong> {property.ami}</span>
                                    <span><strong>Units:</strong> {property.units}</span>
                                    <span><strong>Rent:</strong> {property.rent}</span>
                                </div>

                                <a
                                    className="btn btn-sm btn-primary mt-3"
                                    href={property.link}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View Property
                                </a>

                                {isAdmin && (
                                    <Link
                                        className="btn btn-sm btn-outline-secondary mt-3 ms-2"
                                        to="/admin/properties"
                                    >
                                        Edit Property
                                    </Link>
                                )}
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="results-empty">
                        {displayData ? (
                            <p className="mb-0">
                                Results were returned, but no property list was found in the response.
                            </p>
                        ) : (
        <p>No hay resultados guardados (localStorage vacío)</p>
            )}
                    </div>
                )}
            </div>
        </section>
    );
}
