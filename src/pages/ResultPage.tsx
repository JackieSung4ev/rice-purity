import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown, ListChecks, RotateCcw, ShieldCheck, Zap, HelpCircle, ChevronDown, ChevronUp, Edit3, Printer, AlertCircle, CheckCircle2 } from "lucide-react";
import { useQuiz } from "../features/quiz/quizContext";
import { useLanguage } from "../i18n/LanguageContext";
import type { ExportProgress } from "../pdf/exportPdf";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ReportSnapshot } from "../features/quiz/types";
import { draft100QuestionBank } from "../content/draft100Questions";

export const ResultPage: React.FC = () => {
  const { session, result, currentBank, isDemo, retakeQuiz, setEditingQuestionId, startQuiz } = useQuiz();
  const { language, t, renderText } = useLanguage();
  const navigate = useNavigate();

  const [answersExpanded, setAnswersExpanded] = useState(false);
  const [confirmRetakeOpen, setConfirmRetakeOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress>({ status: "idle" });
  const answersSectionRef = useRef<HTMLDivElement>(null);

  // If there is no active session, show empty state (no fake 72 in production!)
  if (!session || !result) {
    return (
      <main className="container" style={{ padding: "64px 24px", textAlign: "center", maxWidth: "640px" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "var(--radius-card)",
            padding: "48px 32px",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <HelpCircle size={48} color="var(--color-primary)" style={{ margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px", color: "var(--color-text)" }}>
            {language === "bilingual" ? "No active test result / 暂无本次测试结果" : "暂无本次测试结果"}
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "24px", fontSize: "0.95rem", lineHeight: 1.6 }}>
            {language === "bilingual" ? "You have not completed a test session yet. Start the test now to see your score." : "你尚未开始或完成测试。现在开始答题即可获得测试结果与报告。"}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                startQuiz();
                navigate("/test");
              }}
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#FFFFFF",
                padding: "12px 28px",
                borderRadius: "var(--radius-control)",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {language === "bilingual" ? "Start Test 开始测试" : t.startTestBtn}
            </button>

            {/* Development visual fixture runner for quick UI validation */}
            {import.meta.env.DEV && (
              <button
                onClick={() => {
                  // Simulate 28 Yes + 72 No on draft 100 bank for development verification
                  const simulatedAnswers: Record<string, "yes" | "no"> = {};
                  draft100QuestionBank.questions.forEach((q, idx) => {
                    simulatedAnswers[q.id] = idx < 28 ? "yes" : "no";
                  });
                  // Temporarily simulate session
                  startQuiz(draft100QuestionBank);
                  setTimeout(() => {
                    navigate("/result");
                  }, 100);
                }}
                style={{
                  backgroundColor: "var(--color-surface-hover)",
                  border: "1px dashed var(--color-primary)",
                  color: "var(--color-primary)",
                  padding: "12px 20px",
                  borderRadius: "var(--radius-control)",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                [Dev] 快速载入 72 分视觉样例
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  const score = result.score;
  const counts = result.counts;

  const handleToggleAnswers = () => {
    setAnswersExpanded((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          answersSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      return next;
    });
  };

  const handleExportPdf = async () => {
    if (exportProgress.status === "generating") return;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const snapshot: ReportSnapshot = {
      bankId: currentBank.id,
      bankVersion: currentBank.version,
      reviewStatus: currentBank.reviewStatus,
      answersRevision: session.answersRevision,
      result,
      language,
      generatedAt: new Date().toISOString(),
      timeZone,
    };

    setExportProgress({ status: "generating" });
    const { downloadResultPdf } = await import("../pdf/exportPdf");
    await downloadResultPdf(snapshot, (progress) => {
      setExportProgress(progress);
    });
  };

  const handleEditQuestion = (qId: string) => {
    setEditingQuestionId(qId);
    navigate("/test");
  };

  return (
    <main className="container" style={{ padding: "36px 20px 60px 20px" }}>
      {/* Top Page Header */}
      <div style={{ marginBottom: "28px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          {language === "bilingual" ? (
            <>
              <span>Your Result</span>
              <span style={{ marginLeft: "12px", fontWeight: 600, fontSize: "1.8rem", color: "var(--color-primary)" }}>测试结果</span>
            </>
          ) : (
            t.resultTitle
          )}
        </h1>
        <p style={{ marginTop: "8px", color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
          {language === "bilingual" ? "Thanks for completing the test! Self-exploration is a brave step. / 感谢你完成测试！自我探索是一段勇敢的旅程。" : t.resultSubtitle}
        </p>

        {isDemo && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "12px",
              padding: "6px 14px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "#FEF3C7",
              border: "1px solid #FDE68A",
              color: "#B45309",
              fontSize: "0.88rem",
              fontWeight: 500,
            }}
          >
            <AlertCircle size={16} />
            <span>{t.demoResultNotice}</span>
          </div>
        )}
      </div>

      {/* Main Grid: 60% Left Card + 40% Right Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left Column: Primary Result Score Card */}
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-card)",
            padding: "36px 32px",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.92rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-text-secondary)",
            }}
          >
            {language === "bilingual" ? "Your Rice Purity Score • 你的纯洁度分数" : t.resultScoreLabel}
          </span>

          {/* Big Score Number */}
          {score !== null ? (
            <div style={{ display: "flex", alignItems: "baseline", margin: "16px 0 10px 0" }}>
              <span style={{ fontSize: "5.5rem", fontWeight: 900, lineHeight: 1, color: "var(--color-primary)" }}>{score}</span>
              <span style={{ fontSize: "1.8rem", fontWeight: 600, color: "var(--color-text-muted)", marginLeft: "8px" }}>/ 100</span>
            </div>
          ) : (
            <div style={{ margin: "24px 0 16px 0", color: "var(--color-primary)", fontSize: "2rem", fontWeight: 700 }}>
              {isDemo ? (language === "bilingual" ? "Demo Complete • 演示完成" : "演示完成") : t.incompleteResultNotice}
            </div>
          )}

          {/* Score Description */}
          <p style={{ fontSize: "1.05rem", color: "var(--color-text)", fontWeight: 500, marginBottom: "6px" }}>{t.resultScoreDesc(counts.yes, counts.total)}</p>

          {/* Philosophy Statement */}
          <div
            style={{
              backgroundColor: "var(--color-primary-soft)",
              borderRadius: "var(--radius-inner)",
              padding: "12px 18px",
              margin: "18px 0 24px 0",
              width: "100%",
            }}
          >
            <p style={{ color: "var(--color-primary)", fontSize: "0.92rem", lineHeight: 1.5, fontWeight: 500 }}>
              {language === "bilingual" ? (
                <>
                  <span>"A higher score means fewer experiences checked. Your score is not a judgment of your worth."</span>
                  <span style={{ display: "block", marginTop: "4px", fontSize: "0.88em", opacity: 0.9 }}>“分数越高仅代表勾选经历越少。分数不代表个人价值，也不评价好坏。”</span>
                </>
              ) : (
                t.resultPhilosophy
              )}
            </p>
          </div>

          {/* Action Buttons Row */}
          <div
            className="actions-row"
            style={{
              display: "flex",
              gap: "14px",
              width: "100%",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {/* Export PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={exportProgress.status === "generating"}
              style={{
                flex: "1 1 200px",
                height: "50px",
                backgroundColor: "var(--color-primary)",
                color: "#FFFFFF",
                borderRadius: "var(--radius-control)",
                fontWeight: 600,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                opacity: exportProgress.status === "generating" ? 0.7 : 1,
              }}
            >
              <FileDown size={19} />
              <span>{exportProgress.status === "generating" ? t.generatingPdfBtn : language === "bilingual" ? "Export PDF 导出 PDF" : t.exportPdfBtn}</span>
            </button>

            {/* View Answers Button */}
            <button
              onClick={handleToggleAnswers}
              style={{
                flex: "1 1 180px",
                height: "50px",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-control)",
                fontWeight: 600,
                fontSize: "0.98rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ListChecks size={19} color="var(--color-primary)" />
              <span>{answersExpanded ? (language === "bilingual" ? "Hide Answers 收起答案" : t.hideAnswersBtn) : language === "bilingual" ? "View Answers 查看答案" : t.viewAnswersBtn}</span>
            </button>
          </div>

          {/* Export Status & Print Fallback */}
          {exportProgress.status === "success" && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16A34A", fontSize: "0.88rem", marginBottom: "14px" }}>
              <CheckCircle2 size={16} />
              <span>PDF generated successfully! / PDF 报告已生成并触发下载。</span>
            </div>
          )}
          {exportProgress.status === "error" && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FEE2E2",
                padding: "10px 14px",
                borderRadius: "8px",
                color: "#B91C1C",
                fontSize: "0.88rem",
                marginBottom: "14px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertCircle size={16} />
                <span>PDF 导出遇到异常：{exportProgress.errorMessage}</span>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button onClick={handleExportPdf} style={{ color: "#2563EB", fontWeight: 600, textDecoration: "underline" }}>
                  重试导出
                </button>
                <button onClick={() => window.print()} style={{ color: "#52627A", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Printer size={14} /> 打开系统打印
                </button>
              </div>
            </div>
          )}

          {/* Retake test link */}
          <button
            onClick={() => setConfirmRetakeOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--color-text-secondary)",
              fontSize: "0.92rem",
              padding: "6px 12px",
              fontWeight: 500,
            }}
          >
            <RotateCcw size={15} />
            <span>{language === "bilingual" ? "Retake Test 重新测试" : t.retakeTestBtn}</span>
          </button>

          {/* Feature Badges */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "28px",
              borderTop: "1px solid #F0F4F8",
              paddingTop: "20px",
              width: "100%",
              justifyContent: "center",
              flexWrap: "wrap",
              fontSize: "0.82rem",
              color: "var(--color-text-muted)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Zap size={14} color="var(--color-primary)" />
              {currentBank.questions.length} Items
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <ShieldCheck size={14} color="#10B981" />
              Private & Local
            </span>
          </div>
        </div>

        {/* Right Column: Scoring Explanation & Answer Summary Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* How Scoring Works Card */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-card)",
              padding: "24px 28px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px", color: "var(--color-text)" }}>
              {language === "bilingual" ? "How scoring works 评分说明" : t.howScoringWorksTitle}
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.93rem", lineHeight: 1.6 }}>
              {language === "bilingual" ? (
                <>
                  <span>The test starts from 100 points. Each item you answer "Yes" lowers your score by 1 point.</span>
                  <span style={{ display: "block", marginTop: "4px" }}>测试从 100 分开始，每有一项经历选择“有”，就会扣除 1 分。</span>
                </>
              ) : (
                t.howScoringWorksContent
              )}
            </p>
          </div>

          {/* Answer Summary Card */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-card)",
              padding: "24px 28px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "16px", color: "var(--color-text)" }}>{language === "bilingual" ? "Answer Summary 答题摘要" : t.answerSummaryHeading}</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {/* Yes item */}
              <div
                style={{
                  backgroundColor: "var(--color-surface-hover)",
                  borderRadius: "var(--radius-control)",
                  padding: "14px 10px",
                  textAlign: "center",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-primary)" }}>{counts.yes}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", marginTop: "2px" }}>{language === "bilingual" ? "Yes 有" : t.statYes}</div>
              </div>

              {/* No item */}
              <div
                style={{
                  backgroundColor: "var(--color-surface-hover)",
                  borderRadius: "var(--radius-control)",
                  padding: "14px 10px",
                  textAlign: "center",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-text)" }}>{counts.no}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", marginTop: "2px" }}>{language === "bilingual" ? "No 没有" : t.statNo}</div>
              </div>

              {/* Skipped item */}
              <div
                style={{
                  backgroundColor: "var(--color-surface-hover)",
                  borderRadius: "var(--radius-control)",
                  padding: "14px 10px",
                  textAlign: "center",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-text-muted)" }}>{counts.skipped + counts.unvisited}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", marginTop: "2px" }}>{language === "bilingual" ? "Skipped 跳过" : t.statSkipped}</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid #F0F4F8",
                fontSize: "0.88rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <span>{language === "bilingual" ? "Total Answered 有效回答" : t.statTotalAnswered}:</span>
              <span style={{ fontWeight: 700, color: "var(--color-text)" }}>
                {counts.answered} / {counts.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions & Answers Disclosure Area */}
      <div
        ref={answersSectionRef}
        className="accordion-disclosure"
        style={{
          marginTop: "36px",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setAnswersExpanded(!answersExpanded)}
          style={{
            width: "100%",
            padding: "20px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "transparent",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ListChecks size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text)" }}>{language === "bilingual" ? "Questions & Answers 回答明细" : t.questionsAnswersHeading}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
            <span>{answersExpanded ? (language === "bilingual" ? "Collapse 收起" : "收起") : language === "bilingual" ? "Expand 展开" : "展开"}</span>
            {answersExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {answersExpanded && (
          <div style={{ borderTop: "1px solid var(--color-border)", padding: "16px 28px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {currentBank.questions.map((q) => {
                const ans = session.answers[q.id];
                const isYes = ans === "yes";
                const isNo = ans === "no";

                return (
                  <div
                    key={q.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      backgroundColor: "var(--color-surface-hover)",
                      borderRadius: "var(--radius-control)",
                      border: "1px solid #E2E8F0",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
                      <span
                        style={{
                          width: "30px",
                          height: "26px",
                          borderRadius: "6px",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid var(--color-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "var(--color-text-secondary)",
                          flexShrink: 0,
                        }}
                      >
                        {q.order}
                      </span>
                      <div style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>{renderText(q.text.en, q.text["zh-CN"])}</div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          backgroundColor: isYes ? "#DBEAFE" : isNo ? "#F1F5F9" : "#FEF3C7",
                          color: isYes ? "#1D4ED8" : isNo ? "#475569" : "#B45309",
                        }}
                      >
                        {isYes ? (language === "bilingual" ? "Yes 有" : "有") : isNo ? (language === "bilingual" ? "No 没有" : "没有") : language === "bilingual" ? "Skipped 跳过" : "跳过"}
                      </span>

                      <button
                        onClick={() => handleEditQuestion(q.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "#FFFFFF",
                          fontSize: "0.82rem",
                          color: "var(--color-primary)",
                          fontWeight: 500,
                        }}
                      >
                        <Edit3 size={13} />
                        <span>{language === "bilingual" ? "Edit 修改" : t.editAnswerBtn}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Retake Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmRetakeOpen}
        title={t.clearRecordConfirmTitle}
        description={t.clearRecordConfirmDesc}
        confirmText={t.confirmBtn}
        cancelText={t.cancelBtn}
        onConfirm={() => {
          setConfirmRetakeOpen(false);
          retakeQuiz();
          navigate("/");
        }}
        onCancel={() => setConfirmRetakeOpen(false)}
      />
    </main>
  );
};
