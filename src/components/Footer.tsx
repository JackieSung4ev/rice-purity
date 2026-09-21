import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: "auto",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid var(--color-border)",
        padding: "40px 0 32px 0",
        color: "var(--color-text-secondary)",
        fontSize: "0.9rem",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Rice Purity Test 纯洁度测试</div>
            <p style={{ marginTop: "6px", maxWidth: "480px", lineHeight: 1.5 }}>
              {language === "bilingual" ? (
                <>
                  <span>A more open conversation about growing up.</span>
                  <span style={{ display: "block", fontSize: "0.85em", opacity: 0.85 }}>关于成长，更开放的对话。一份自我探索经历问卷。</span>
                </>
              ) : (
                t.footerTagline
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
            <Link to="/" style={{ color: "var(--color-text-secondary)" }}>
              {language === "bilingual" ? "Home 首页" : t.navHome}
            </Link>
            <Link to="/test" style={{ color: "var(--color-text-secondary)" }}>
              {language === "bilingual" ? "Test 测试" : t.navTest}
            </Link>
            <Link to="/privacy" style={{ color: "var(--color-text-secondary)" }}>
              {language === "bilingual" ? "Privacy 隐私说明" : t.navPrivacy}
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #F0F4F8",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "0.82rem",
            color: "var(--color-text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={16} color="var(--color-primary)" />
            <span>100% Client-Side • No Personal Data Collected • 本地计算无数据收集</span>
          </div>
          <div>© {currentYear} Rice Purity Test. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
