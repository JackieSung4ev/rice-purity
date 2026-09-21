import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Globe, Menu, X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { DisplayLanguage } from "../features/quiz/types";

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false);
    if (hash) {
      if (location.pathname !== "/") {
        navigate("/" + hash);
      } else {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const languages: { code: DisplayLanguage; label: string }[] = [
    { code: "bilingual", label: "双语 Bilingual" },
    { code: "zh-CN", label: "中文" },
    { code: "en", label: "English" },
  ];

  return (
    <header
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 8px rgba(20, 33, 61, 0.03)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Logo / Brand */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              backgroundColor: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.15rem", color: "var(--color-text)", lineHeight: 1.2 }}>Rice Purity Test</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>纯洁度测试</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: "none", alignItems: "center", gap: "28px" }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: location.pathname === "/" ? 600 : 500,
              color: location.pathname === "/" ? "var(--color-primary)" : "var(--color-text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            {language === "bilingual" ? "Home 首页" : t.navHome}
          </Link>
          <Link
            to="/test"
            style={{
              fontWeight: location.pathname.startsWith("/test") ? 600 : 500,
              color: location.pathname.startsWith("/test") ? "var(--color-primary)" : "var(--color-text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            {language === "bilingual" ? "Test 测试" : t.navTest}
          </Link>
          <button
            onClick={() => handleNavClick("#faq")}
            style={{
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            {language === "bilingual" ? "FAQ 常见问题" : t.navFaq}
          </button>
          <Link
            to="/privacy"
            style={{
              fontWeight: location.pathname === "/privacy" ? 600 : 500,
              color: location.pathname === "/privacy" ? "var(--color-primary)" : "var(--color-text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            {language === "bilingual" ? "Privacy 隐私" : t.navPrivacy}
          </Link>
        </nav>

        {/* Right Action: Language Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-label="Select Language"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "var(--radius-control)",
                backgroundColor: "var(--color-surface-hover)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                fontSize: "0.88rem",
                fontWeight: 500,
              }}
            >
              <Globe size={16} color="var(--color-primary)" />
              <span>{language === "bilingual" ? "双语" : language === "zh-CN" ? "中文" : "EN"}</span>
            </button>

            {langDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-control)",
                  boxShadow: "var(--shadow-modal)",
                  padding: "6px",
                  minWidth: "140px",
                  zIndex: 100,
                }}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: "0.88rem",
                      borderRadius: "8px",
                      color: language === l.code ? "var(--color-primary)" : "var(--color-text)",
                      backgroundColor: language === l.code ? "var(--color-primary-soft)" : "transparent",
                      fontWeight: language === l.code ? 600 : 400,
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            style={{
              display: "flex",
              padding: "8px",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--color-surface-hover)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontSize: "1rem", fontWeight: 500, color: "var(--color-text)" }}>
            {language === "bilingual" ? "Home 首页" : t.navHome}
          </Link>
          <Link to="/test" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontSize: "1rem", fontWeight: 500, color: "var(--color-text)" }}>
            {language === "bilingual" ? "Test 答题测试" : t.navTest}
          </Link>
          <button onClick={() => handleNavClick("#faq")} style={{ padding: "8px 0", textAlign: "left", fontSize: "1rem", fontWeight: 500, color: "var(--color-text)" }}>
            {language === "bilingual" ? "FAQ 常见问题" : t.navFaq}
          </button>
          <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontSize: "1rem", fontWeight: 500, color: "var(--color-text)" }}>
            {language === "bilingual" ? "Privacy 隐私说明" : t.navPrivacy}
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
