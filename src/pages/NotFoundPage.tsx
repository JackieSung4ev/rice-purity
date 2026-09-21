import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, Home } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export const NotFoundPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <main className="container" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "520px" }}>
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-card)",
          padding: "48px 32px",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <HelpCircle size={56} color="var(--color-primary)" style={{ margin: "0 auto 16px" }} />
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "10px", color: "var(--color-text)" }}>{language === "bilingual" ? "Page Not Found (404) • 页面未找到" : t.notFoundTitle}</h1>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "28px", fontSize: "0.95rem", lineHeight: 1.6 }}>
          {language === "bilingual" ? "The page you are looking for does not exist or has moved." : t.notFoundDesc}
        </p>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--color-primary)",
            color: "#FFFFFF",
            padding: "12px 24px",
            borderRadius: "var(--radius-control)",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          <Home size={18} />
          <span>{language === "bilingual" ? "Back to Home 返回首页" : t.backHomeBtn}</span>
        </Link>
      </div>
    </main>
  );
};
