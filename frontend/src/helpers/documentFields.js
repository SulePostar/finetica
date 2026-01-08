import { formatDateTime } from "@/helpers/formatDate";

export const humanLabel = (key) =>
    key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim();

export const formatTitle = (type) => {
    if (!type) return "Document";
    const formatted = type
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    return `${formatted} Information`;
};

export const isComplex = (v) => v != null && typeof v === "object"; // arrays included

export const toInputString = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (isComplex(value)) return JSON.stringify(value, null, 2);
    return String(value);
};

export const formatValue = (key, value) => {
    if (value === null || value === undefined || value === "") return "—";

    const lower = key.toLowerCase();
    if (lower.includes("date") || lower.includes("at")) {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) return formatDateTime(value);
    }

    if (Array.isArray(value)) return `${value.length} item(s)`;

    if (typeof value === "object") {
        if (typeof value.name === "string") return value.name;
        if (typeof value.label === "string") return value.label;
        return JSON.stringify(value);
    }

    return String(value);
};

export const inferFieldKind = (key, value) => {
    const lower = key.toLowerCase();

    if (typeof value === "boolean") return "boolean";
    if (isComplex(value)) return "json";

    const isNumberLike =
        typeof value === "number" || lower.includes("amount") || lower.endsWith("id");

    if (isNumberLike) return "number";
    return "text";
};

export const parseNumberInput = (raw) => {
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isNaN(n) ? raw : n;
};

export const tryParseJson = (raw) => {
    try {
        return { ok: true, value: JSON.parse(raw) };
    } catch {
        return { ok: false, value: raw };
    }
};
