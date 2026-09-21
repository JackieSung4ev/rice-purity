import React, { useState } from "react";
import { Lock, Trash2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../features/quiz/quizContext";
import { ConfirmDialog } from "../components/ConfirmDialog";

export const PrivacyPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { retakeQuiz } = useQuiz();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClear = () => {
    retakeQuiz();
    setConfirmOpen(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 4000);
  };

  return (
    <main className="container" style={{ padding: "48px 20px 80px 20px", maxWidth: "800px" }}>
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-card)",
          padding: "40px 36px",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "var(--color-primary-soft)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text)" }}>{language === "bilingual" ? "Privacy & Data Protection • 隐私与数据安全说明" : "隐私与数据安全说明"}</h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
              {language === "bilingual" ? "Your privacy and anonymity are strictly protected by design." : "以技术架构保障你的绝对私密与匿名。"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.7 }}>
          <section>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "8px" }}>1. 纯本地浏览器处理（No Server Uploads）</h2>
            <p>
              本应用为一个纯前端静态单页应用（SPA）。您在答题过程中勾选的“有”或“没有”、跳过的题目以及计算得出的最终分数，
              <strong>全部仅在您的当前浏览器内存与当前标签页的 sessionStorage 中处理</strong>。
            </p>
            <p style={{ marginTop: "8px" }}>
              本应用<strong>没有后端服务器、没有数据库、没有云端同步，亦不嵌入任何第三方用户行为分析（Analytics）或广告跟踪代码</strong>。您的答案绝不会通过网络接口发送至任何外部服务器。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "8px" }}>2. 临时会话存储机制（sessionStorage）</h2>
            <p>
              为了防止您在答题过程中误刷新页面而导致进度丢失，系统会将当前题号与回答临时保存在浏览器的 <code>sessionStorage</code> 中（键名为 <code>rpt:session:v1</code>）。
            </p>
            <p style={{ marginTop: "8px" }}>
              <code>sessionStorage</code> 仅在当前浏览器标签页有效，当您关闭当前标签页，或点击“重新测试”/“清除记录”时，该记录将被彻底销毁。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "8px" }}>3. PDF 报告生成与逐题隐私</h2>
            <p>结果页导出的 PDF 报告是由您的浏览器本地直接编译生成的。为了最大限度保护您的隐私：</p>
            <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
              <li>PDF 仅包含分数、大类统计数量（有/没有/跳过）及评分规则摘要。</li>
              <li>
                <strong>PDF 绝不包含任何逐题回答明细</strong>，即便您在网页中展开了回答明细，导出的文件或打印输出也绝对剔除敏感答案。
              </li>
            </ul>
          </section>

          <section
            style={{
              backgroundColor: "var(--color-surface-hover)",
              borderRadius: "var(--radius-inner)",
              padding: "20px",
              border: "1px solid var(--color-border)",
              marginTop: "12px",
            }}
          >
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "6px" }}>随时清除本次浏览器数据</h3>
            <p style={{ fontSize: "0.9rem", marginBottom: "16px" }}>点击下方按钮将立即清空当前浏览器中保存的全部答题记录与分数缓存。</p>

            <button
              onClick={() => setConfirmOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--radius-control)",
                backgroundColor: "#DC2626",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.92rem",
              }}
            >
              <Trash2 size={16} />
              <span>立即清空本次测试记录</span>
            </button>

            {clearedNotice && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16A34A", marginTop: "12px", fontSize: "0.88rem" }}>
                <CheckCircle2 size={16} />
                <span>已成功清空本地测试记录！</span>
              </div>
            )}
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title={t.clearRecordConfirmTitle}
        description={t.clearRecordConfirmDesc}
        confirmText={t.confirmBtn}
        cancelText={t.cancelBtn}
        onConfirm={handleClear}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
};
