import React from "react";

const HeroCard = () => {
    return (
        <div
            style={{
                textAlign: "center",
                padding: "30px 20px",
                maxWidth: "500px",
                marginBottom: "30px"
            }}
        >
            <h1
                style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "12px",
                    lineHeight: "1.2"
                }}
            >
                Exam Portal
            </h1>

            <p
                style={{
                    fontSize: "16px",
                    color: "#6b7280",
                    marginBottom: "20px"
                }}
            >
                Secure Login & User Authentication System
            </p>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "20px"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "18px" }}>🔒</span>
                    <span style={{ fontSize: "14px", color: "#4b5563" }}>Secure</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "18px" }}>⚡</span>
                    <span style={{ fontSize: "14px", color: "#4b5563" }}>Fast</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "18px" }}>✓</span>
                    <span style={{ fontSize: "14px", color: "#4b5563" }}>Reliable</span>
                </div>
            </div>
        </div>
    );
};

export default HeroCard;
