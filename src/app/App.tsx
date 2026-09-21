import React from "react";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider, useLanguage } from "../i18n/LanguageContext";
import { QuizProvider, useQuiz } from "../features/quiz/quizContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AppRouter } from "./router";

// PrintSummary component renders only during window.print() and is hidden on screen
const PrintSummary: React.FC = () => {
  const { session, result, currentBank } = useQuiz();
  const { language } = useLanguage();

  if (!session || !result) return null;

  const isBilingual = language === "bilingual";
  const isZh = language === "zh-CN";

  return (
    <div className="print-summary" style={{ display: "none", padding: "30px" }}>
      <h1 style={{ fontSize: "24px", color: "#2563EB", marginBottom: "8px" }}>Rice Purity Test | 纯洁度测试报告</h1>
      <p style={{ fontSize: "12px", color: "#52627A", marginBottom: "20px" }}>Official Client-Side Test Summary • 浏览器本地测试摘要</p>

      <div style={{ border: "1px solid #DCE4EF", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ fontSize: "14px", color: "#52627A", marginBottom: "6px" }}>{isBilingual ? "Your Rice Purity Score / 你的测试分数" : isZh ? "你的测试分数" : "Your Score"}</div>
        <div style={{ fontSize: "42px", fontWeight: "bold", color: "#2563EB", marginBottom: "10px" }}>{result.score !== null ? `${result.score} / 100` : "Incomplete / 未完成"}</div>
        <div style={{ fontSize: "12px", color: "#14213D" }}>
          {isZh
            ? `在 ${result.counts.total} 项经历中，有 ${result.counts.yes} 项选择“有”，${result.counts.no} 项选择“没有”。`
            : `You answered "Yes" to ${result.counts.yes} of ${result.counts.total} items.`}
        </div>
        <div style={{ fontSize: "11px", color: "#2563EB", marginTop: "10px", fontStyle: "italic" }}>“A higher score means fewer experiences checked. Your score is not a judgment of your worth.”</div>
      </div>

      <div style={{ border: "1px solid #DCE4EF", borderRadius: "8px", padding: "16px", fontSize: "11px", color: "#52627A" }}>
        <div>
          Question Bank: {currentBank.id} ({currentBank.version})
        </div>
        <div>Date: {new Date().toLocaleString()}</div>
        <div style={{ marginTop: "8px", fontStyle: "italic" }}>Notice: Individual question answers are omitted to protect your personal privacy.</div>
      </div>
    </div>
  );
};

const MainLayout: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <AppRouter />
      </div>
      <Footer />
      <PrintSummary />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <QuizProvider>
          <MainLayout />
        </QuizProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};
