"use client";
export function AuthBadge({ authMethod }) {
    const isGoogle = authMethod === "google";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 10px",
                borderRadius: 6,
                background: isGoogle
                    ? "rgba(234,67,53,0.10)"
                    : "rgba(34,211,238,0.10)",
                fontSize: 11,
                fontWeight: 600,
                color: isGoogle ? "#ea4335" : "#22d3ee",
                whiteSpace: "nowrap",
                border: `1px solid ${isGoogle ? "rgba(234,67,53,0.20)" : "rgba(34,211,238,0.20)"}`,
            }}
        >
            {isGoogle ? "Google" : "E-mail"}
        </span>
    );
}
