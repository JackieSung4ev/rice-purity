import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Smartphone, CheckCircle2, FileText, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useQuiz } from "../features/quiz/quizContext";
import { useLanguage } from "../i18n/LanguageContext";
import { demoQuestionBank } from "../content/demoQuestions";
import { draft100QuestionBank } from "../content/draft100Questions";

export const HomePage: React.FC = () => {
  const { session, currentBank, setBank, startQuiz, isDemo } = useQuiz();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const hasSession = Boolean(session);
  const isFinished = session?.phase === "result";

  const handleStartOrContinue = () => {
    if (!session) {
      startQuiz();
    }
    if (isFinished) {
      navigate("/result");
    } else {
      navigate("/test");
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  };

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
  ];

  return (
    <main style={{ paddingBottom: "64px" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(180deg, #EFF6FF 0%, #F6F8FC 100%)",
          padding: "56px 0 64px 0",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Hero Left Content */}
          <div>
            {/* Version / Demo Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: isDemo ? "#FEF3C7" : "#EFF6FF",
                border: `1px solid ${isDemo ? "#FDE68A" : "#BFDBFE"}`,
                color: isDemo ? "#B45309" : "var(--color-primary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "18px",
              }}
            >
              <Sparkles size={15} />
              <span>{isDemo ? (language === "bilingual" ? "Demo Mode (10 Questions) • 演示版（10题）" : t.badgeDemoQ) : language === "bilingual" ? "100 Questions • 100 道题目" : t.badge100Q}</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                fontWeight: 900,
                color: "var(--color-text)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Rice Purity <span style={{ color: "var(--color-primary)" }}>Test</span>
              <span style={{ display: "block", fontSize: "0.82em", fontWeight: 800, color: "var(--color-primary)", marginTop: "4px" }}>纯洁度测试</span>
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                maxWidth: "520px",
                marginBottom: "32px",
              }}
            >
              {language === "bilingual" ? (
                <>
                  <span>A fun self-assessment quiz to explore life experiences and milestones.</span>
                  <span style={{ display: "block", marginTop: "6px", fontSize: "0.92em", opacity: 0.9 }}>一个关于人生经历的自我评估测试，帮助你了解自己的人生经历。</span>
                </>
              ) : (
                t.heroSubtitle
              )}
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "32px" }}>
              <button
                onClick={handleStartOrContinue}
                style={{
                  padding: "14px 32px",
                  borderRadius: "var(--radius-control)",
                  backgroundColor: "var(--color-primary)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 6px 20px rgba(37, 99, 235, 0.25)",
                  transition: "all 0.15s ease",
                }}
              >
                <span>
                  {!hasSession
                    ? language === "bilingual"
                      ? "Start Test 开始测试"
                      : t.startTestBtn
                    : isFinished
                      ? language === "bilingual"
                        ? "View Result 查看结果"
                        : t.viewResultBtn
                      : language === "bilingual"
                        ? "Continue Test 继续测试"
                        : t.continueTestBtn}
                </span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("how-it-works");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  padding: "14px 24px",
                  borderRadius: "var(--radius-control)",
                  backgroundColor: "#FFFFFF",
                  color: "var(--color-text)",
                  border: "1.5px solid var(--color-border)",
                  fontWeight: 600,
                  fontSize: "1.02rem",
                }}
              >
                {language === "bilingual" ? "How It Works 了解规则" : t.learnMoreBtn}
              </button>
            </div>

            {/* Value badges row */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                fontSize: "0.88rem",
                color: "var(--color-text-secondary)",
                fontWeight: 500,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>{language === "bilingual" ? `${currentBank.questions.length} Questions` : `${currentBank.questions.length} 道题目`}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={16} color="var(--color-primary)" />
                <span>{language === "bilingual" ? "100% Local & Private" : "完全本地私密"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Zap size={16} color="var(--color-primary)" />
                <span>{language === "bilingual" ? "Instant Results" : "即时出分"}</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Aesthetic Card & Scoring Rules Preview */}
          <div
            id="how-it-works"
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-card)",
              padding: "36px 30px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "var(--color-primary-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-primary)",
                }}
              >
                <FileText size={20} />
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)" }}>{language === "bilingual" ? "How scoring works 评分说明" : t.scoringCardTitle}</h2>
            </div>

            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              {language === "bilingual" ? (
                <>
                  <span>Start from 100. Each checked item lowers the score by 1 point. Higher scores suggest fewer listed experiences.</span>
                  <span style={{ display: "block", marginTop: "6px" }}>从 100 分开始，每勾选一项经历会扣除 1 分。分数越高，通常表示经历越少。</span>
                </>
              ) : (
                t.scoringCardDesc
              )}
            </p>

            {/* Formula badge */}
            <div
              style={{
                backgroundColor: "var(--color-primary-soft)",
                borderRadius: "var(--radius-control)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-primary)" }}>
                100 <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>pts</span>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.88rem", fontWeight: 600, color: "var(--color-primary)" }}>
                <div>Higher score = fewer experiences</div>
                <div style={{ fontSize: "0.82rem", opacity: 0.85 }}>分数越高 = 经历越少</div>
              </div>
            </div>

            <div
              style={{
                borderLeft: "3px solid var(--color-primary)",
                paddingLeft: "14px",
                fontStyle: "italic",
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              {t.scoringQuote}
            </div>

            {/* Switch Bank Option (Allows user/reviewer to toggle between 10-demo and 100-draft) */}
            <div
              style={{
                borderTop: "1px solid #F0F4F8",
                paddingTop: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.82rem",
                color: "var(--color-text-muted)",
              }}
            >
              <span>
                当前题库：{currentBank.id} ({currentBank.questions.length} 题)
              </span>
              <button
                onClick={() => {
                  if (currentBank.id === demoQuestionBank.id) {
                    setBank(draft100QuestionBank);
                  } else {
                    setBank(demoQuestionBank);
                  }
                }}
                style={{
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textDecoration: "underline",
                }}
              >
                切换为 {currentBank.id === demoQuestionBank.id ? "100 题草案版" : "10 题精选演示版"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="container" style={{ padding: "56px 20px 32px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Pillar 1: Privacy */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-card)",
              padding: "28px 24px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "8px", color: "var(--color-text)" }}>{language === "bilingual" ? "Private & Anonymous • 私密匿名" : "私密匿名"}</h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              {language === "bilingual"
                ? "Your responses are stored only in your browser tab and never uploaded to any remote server or database."
                : "你的回答仅临时保存在当前浏览器标签页中，绝不上传到任何远程服务器或云端数据库。"}
            </p>
          </div>

          {/* Pillar 2: Responsive */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-card)",
              padding: "28px 24px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Smartphone size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "8px", color: "var(--color-text)" }}>{language === "bilingual" ? "Responsive Design • 全平台自适应" : "全平台自适应"}</h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              {language === "bilingual"
                ? "Carefully optimized for 27-inch monitors, 14-inch laptops, and mobile phones with smooth navigation."
                : "精心适配 27 寸大屏、14 寸笔记本及各类手机屏幕，单题卡片居中，触控体验丝滑。"}
            </p>
          </div>

          {/* Pillar 3: PDF Export */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-card)",
              padding: "28px 24px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <FileText size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "8px", color: "var(--color-text)" }}>{language === "bilingual" ? "Clean PDF Export • 纯净 PDF 导出" : "纯净 PDF 导出"}</h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              {language === "bilingual"
                ? "Generate a clean 1-page A4 summary PDF directly in your browser without exposing sensitive individual answers."
                : "浏览器内直接生成一页 A4 摘要 PDF，中英文排版整洁，绝不包含敏感逐题答卷。"}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container" style={{ paddingTop: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text)" }}>{language === "bilingual" ? "Frequently Asked Questions • 常见问题" : t.faqTitle}</h2>
          <p style={{ color: "var(--color-text-secondary)", marginTop: "8px", fontSize: "0.95rem" }}>
            {language === "bilingual" ? "Everything you need to know about the test and how it works." : "关于本测试与计分机制的详细解答。"}
          </p>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-inner)",
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: "100%",
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    backgroundColor: "transparent",
                  }}
                >
                  <span style={{ fontSize: "1.02rem", fontWeight: 600, color: "var(--color-text)" }}>{faq.q}</span>
                  <div style={{ color: "var(--color-text-secondary)" }}>{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 20px 24px",
                      color: "var(--color-text-secondary)",
                      fontSize: "0.93rem",
                      lineHeight: 1.6,
                      borderTop: "1px solid #F0F4F8",
                      paddingTop: "16px",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
