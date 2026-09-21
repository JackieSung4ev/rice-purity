import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, SkipForward, Check, AlertTriangle, ListFilter } from "lucide-react";
import { useQuiz } from "../features/quiz/quizContext";
import { useLanguage } from "../i18n/LanguageContext";
import { AnswerValue } from "../features/quiz/types";
import { QuestionNavSidebar } from "../components/QuestionNavSidebar";

interface KeyBadgeProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const KeyBadge: React.FC<KeyBadgeProps> = ({ children, size = "md" }) => {
  const isLg = size === "lg";
  const isSm = size === "sm";
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isLg ? "4px 10px" : isSm ? "2px 7px" : "3px 9px",
        minWidth: isLg ? "34px" : isSm ? "22px" : "28px",
        height: isLg ? "32px" : isSm ? "22px" : "28px",
        borderRadius: "6px",
        backgroundColor: "#FFFFFF",
        border: "1.5px solid #CBD5E1",
        borderBottom: "3px solid #94A3B8",
        color: "#1E293B",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: isLg ? "1rem" : isSm ? "0.78rem" : "0.92rem",
        fontWeight: 700,
        lineHeight: 1,
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
        userSelect: "none",
        verticalAlign: "middle",
      }}
    >
      {children}
    </kbd>
  );
};

export const TestPage: React.FC = () => {
  const {
    session,
    currentBank,
    counts,
    storageWarning,
    isTransitioning,
    editingQuestionId,
    setEditingQuestionId,
    answerQuestion,
    skipQuestion,
    goToPrevious,
    goToQuestion,
    saveEditedAnswer,
    finishAndShowResult,
    startQuiz,
  } = useQuiz();
  const { language, t, renderText } = useLanguage();
  const navigate = useNavigate();

  // Navigation sidebar collapse state (expanded by default, collapses to mini number rail)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(typeof window !== "undefined" ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Local draft state for editing mode
  const [editDraftValue, setEditDraftValue] = useState<AnswerValue | null>(null);

  // Determine active question data safely
  const isEditing = Boolean(editingQuestionId);
  const activeQuestionId = editingQuestionId || (session ? session.currentQuestionId : "");
  const currentQuestion = currentBank.questions.find((q) => q.id === activeQuestionId) || currentBank.questions[0];

  const questionIndex = currentBank.questions.findIndex((q) => q.id === currentQuestion.id);
  const totalQuestions = currentBank.questions.length;
  const currentOrder = questionIndex + 1;
  const currentAnswer = isEditing ? editDraftValue : session ? session.answers[currentQuestion.id] : undefined;

  const isFirstQuestion = questionIndex === 0;
  const isLastQuestion = questionIndex === totalQuestions - 1;

  // If no session exists, initialize one immediately
  useEffect(() => {
    if (!session) {
      startQuiz();
    }
  }, [session, startQuiz]);

  useEffect(() => {
    if (editingQuestionId && session) {
      setEditDraftValue(session.answers[editingQuestionId] || null);
    }
  }, [editingQuestionId, session]);

  // Navigate to result if quiz is complete and not in editing mode
  useEffect(() => {
    if (session?.phase === "result" && !isEditing) {
      navigate("/result");
    }
  }, [session?.phase, isEditing, navigate]);

  // Handle keyboard navigation:
  // ArrowLeft / Y / 1 -> Yes
  // ArrowRight / N / 2 -> No
  // ArrowUp -> Previous (上一题)
  // ArrowDown / S -> Skip / Next (后一题 / 暂时跳过)
  useEffect(() => {
    if (!session) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when transitioning
      if (isTransitioning) return;

      if (isEditing) {
        if (e.key === "ArrowLeft" || e.key === "y" || e.key === "Y" || e.key === "1") {
          e.preventDefault();
          setEditDraftValue("yes");
        } else if (e.key === "ArrowRight" || e.key === "n" || e.key === "N" || e.key === "2") {
          e.preventDefault();
          setEditDraftValue("no");
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (editDraftValue) {
            saveEditedAnswer(currentQuestion.id, editDraftValue);
          }
          navigate("/result");
        } else if (e.key === "Escape") {
          e.preventDefault();
          setEditingQuestionId(null);
          navigate("/result");
        }
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "y" || e.key === "Y" || e.key === "1") {
        e.preventDefault();
        answerQuestion(currentQuestion.id, "yes");
      } else if (e.key === "ArrowRight" || e.key === "n" || e.key === "N" || e.key === "2") {
        e.preventDefault();
        answerQuestion(currentQuestion.id, "no");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isFirstQuestion) {
          goToPrevious();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentAnswer && !isLastQuestion) {
          const nextQ = currentBank.questions[questionIndex + 1];
          goToQuestion(nextQ.id);
        } else {
          skipQuestion(currentQuestion.id);
        }
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        skipQuestion(currentQuestion.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    session,
    currentQuestion.id,
    questionIndex,
    isLastQuestion,
    isFirstQuestion,
    currentAnswer,
    currentBank.questions,
    isTransitioning,
    isEditing,
    editDraftValue,
    answerQuestion,
    skipQuestion,
    goToPrevious,
    goToQuestion,
    saveEditedAnswer,
    setEditingQuestionId,
    navigate,
  ]);

  if (!session) {
    return (
      <main className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Loading questionnaire / 正在初始化问卷...</p>
      </main>
    );
  }

  // If in review phase (reached end and has skipped or unvisited items)
  if (session.phase === "review" && !isEditing) {
    const skippedQuestions = currentBank.questions.filter((q) => session.answers[q.id] === "skipped");
    const unvisitedQuestions = currentBank.questions.filter((q) => !session.answers[q.id]);

    return (
      <main className="container" style={{ padding: "40px 20px 60px 20px", maxWidth: "var(--quiz-card-width)" }}>
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-card)",
            padding: "36px 30px",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "8px" }}>
            {language === "bilingual" ? "Review & Incomplete Items • 答题收尾检查" : t.reviewTitle}
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
            {language === "bilingual"
              ? "You reached the end of the test, but some questions were skipped or not answered yet. You can answer them now, or finish and view an incomplete summary."
              : t.reviewSubtitle}
          </p>

          {/* Skipped Items Section */}
          {skippedQuestions.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "12px" }}>
                {language === "bilingual" ? `Skipped Questions (${skippedQuestions.length}) • 暂时跳过的题目` : `${t.skippedItemsHeader} (${skippedQuestions.length})`}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {skippedQuestions.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      backgroundColor: "var(--color-surface-hover)",
                      borderRadius: "var(--radius-control)",
                      border: "1px solid var(--color-border)",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
                      {q.order}. {renderText(q.text.en, q.text["zh-CN"])}
                    </span>
                    <button
                      onClick={() => goToQuestion(q.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        backgroundColor: "var(--color-primary)",
                        color: "#FFFFFF",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {language === "bilingual" ? "Answer 补答" : t.jumpToQuestionBtn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unvisited Items Section */}
          {unvisitedQuestions.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#D97706", marginBottom: "12px" }}>
                {language === "bilingual" ? `Unvisited Questions (${unvisitedQuestions.length}) • 尚未作答的题目` : `${t.unvisitedItemsHeader} (${unvisitedQuestions.length})`}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {unvisitedQuestions.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      backgroundColor: "var(--color-surface-hover)",
                      borderRadius: "var(--radius-control)",
                      border: "1px solid var(--color-border)",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
                      {q.order}. {renderText(q.text.en, q.text["zh-CN"])}
                    </span>
                    <button
                      onClick={() => goToQuestion(q.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        backgroundColor: "var(--color-primary)",
                        color: "#FFFFFF",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {language === "bilingual" ? "Answer 回答" : t.jumpToQuestionBtn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finish & View Summary Button */}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "20px", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                finishAndShowResult();
                navigate("/result");
              }}
              style={{
                padding: "12px 24px",
                borderRadius: "var(--radius-control)",
                backgroundColor: "var(--color-primary)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{language === "bilingual" ? "Finish & View Incomplete Summary • 查看未完成摘要" : t.finishAndSeeSummaryBtn}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  const answeredCount = counts ? counts.answered : 0;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <main
      className="container"
      style={{
        padding: "36px clamp(16px, 2.5vw, 48px) 60px clamp(16px, 2.5vw, 48px)",
        maxWidth: "1920px",
        width: "100%",
      }}
    >
      {/* Storage Warning if sessionStorage is disabled */}
      {storageWarning && (
        <div
          style={{
            backgroundColor: "var(--color-warning-bg)",
            border: "1px solid var(--color-warning-border)",
            color: "var(--color-warning-text)",
            borderRadius: "var(--radius-control)",
            padding: "10px 16px",
            marginBottom: "20px",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertTriangle size={18} />
          <span>{t.storageWarningNotice}</span>
        </div>
      )}

      {/* Editing Mode Banner */}
      {isEditing && (
        <div
          style={{
            backgroundColor: "var(--color-primary-soft)",
            border: "1px solid var(--color-primary)",
            color: "var(--color-primary)",
            borderRadius: "var(--radius-control)",
            padding: "10px 16px",
            marginBottom: "20px",
            fontSize: "0.92rem",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{language === "bilingual" ? "Editing answer for this question / 正在修改此题答案" : t.editModeNotice}</span>
          <button
            onClick={() => {
              setEditingQuestionId(null);
              navigate("/result");
            }}
            style={{ fontSize: "0.85rem", textDecoration: "underline", color: "var(--color-primary)" }}
          >
            {language === "bilingual" ? "Cancel & Return 取消" : t.cancelEditBtn}
          </button>
        </div>
      )}

      {/* 2-Column Responsive Layout for Desktop / Laptop (Max-width 1920px Widescreen) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "28px",
          width: "100%",
          maxWidth: "1920px",
          margin: "0 auto",
        }}
      >
        {/* Desktop Side Navigation Menu */}
        {!isEditing && (
          <aside
            className="desktop-sidebar"
            style={{
              width: isSidebarCollapsed ? "72px" : "360px",
              flexShrink: 0,
              position: "sticky",
              top: "80px",
              transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <QuestionNavSidebar
              questions={currentBank.questions}
              currentQuestionId={currentQuestion.id}
              answers={session ? session.answers : {}}
              counts={counts}
              onSelectQuestion={(id) => goToQuestion(id)}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />
          </aside>
        )}

        {/* Main Content Column (Card + Shortcut Bar, Spanning up to 1400px) */}
        <div style={{ flex: "1 1 auto", maxWidth: "1400px", width: "100%", minWidth: 0 }}>
          {/* Single Question Answering Card */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-card)",
              padding: "clamp(36px, 4vw, 64px) clamp(30px, 4vw, 60px)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Progress Header */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  fontSize: "clamp(0.95rem, 1.1vw, 1.2rem)",
                  color: "var(--color-text-secondary)",
                  fontWeight: 600,
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <span style={{ minWidth: "140px" }}>
                  {language === "bilingual"
                    ? `Question ${currentOrder} of ${totalQuestions} • 第 ${currentOrder} / ${totalQuestions} 题`
                    : t.questionLabel.replace("{order}", String(currentOrder)).replace("{total}", String(totalQuestions))}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "nowrap" }}>
                  <span style={{ whiteSpace: "nowrap" }}>
                    {language === "bilingual"
                      ? `Answered ${answeredCount} / ${totalQuestions}`
                      : t.answeredLabel.replace("{answered}", String(answeredCount)).replace("{total}", String(totalQuestions))}
                  </span>

                  {/* Toggle Question List Button */}
                  {!isEditing && (
                    <button
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          setIsMobileDrawerOpen(true);
                        } else {
                          setIsSidebarCollapsed((prev) => !prev);
                        }
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "4px 12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--color-primary-soft)",
                        color: "var(--color-primary)",
                        fontSize: "clamp(0.8rem, 0.95vw, 0.95rem)",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: "1px solid var(--color-border)",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                      }}
                      title={
                        isMobileScreen
                          ? language === "bilingual"
                            ? "Question List / 题目列表"
                            : "题目列表"
                          : language === "bilingual"
                            ? isSidebarCollapsed
                              ? "Expand sidebar / 展开题目详情"
                              : "Collapse to numbers rail / 收起为编号"
                            : isSidebarCollapsed
                              ? "展开导航"
                              : "收缩为编号"
                      }
                    >
                      <ListFilter size={15} />
                      <span>
                        {isMobileScreen
                          ? language === "bilingual"
                            ? "Questions 题号"
                            : "题号列表"
                          : language === "bilingual"
                            ? isSidebarCollapsed
                              ? "Expand 展开"
                              : "Mini 编号"
                            : isSidebarCollapsed
                              ? "展开导航"
                              : "收缩编号"}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: "clamp(8px, 0.8vw, 12px)",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "#E2E8F0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    backgroundColor: "var(--color-primary)",
                    transition: "width 0.3s ease-out",
                  }}
                />
              </div>
            </div>

            {/* Question Text (Adaptive fluid typography) */}
            <div style={{ margin: "20px 0 40px 0", minHeight: "clamp(90px, 8vw, 130px)" }}>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 2.2vw, 2.6rem)",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  lineHeight: 1.4,
                }}
              >
                {renderText(currentQuestion.text.en, currentQuestion.text["zh-CN"])}
              </h2>
            </div>

            {/* Answer Buttons (Yes / No) - Responsive fluid sizing */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(16px, 2vw, 28px)", marginBottom: "32px" }}>
              {/* Yes Button */}
              <button
                onClick={() => {
                  if (isEditing) {
                    setEditDraftValue("yes");
                  } else {
                    answerQuestion(currentQuestion.id, "yes");
                  }
                }}
                disabled={isTransitioning}
                style={{
                  height: "clamp(68px, 5.5vw, 92px)",
                  borderRadius: "var(--radius-control)",
                  border: currentAnswer === "yes" ? "2.5px solid var(--color-primary)" : "1.5px solid var(--color-border)",
                  backgroundColor: currentAnswer === "yes" ? "var(--color-primary-soft)" : "var(--color-surface)",
                  color: currentAnswer === "yes" ? "var(--color-primary)" : "var(--color-text)",
                  fontSize: "clamp(1.15rem, 1.6vw, 1.6rem)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.15s ease",
                }}
              >
                {currentAnswer === "yes" && <Check size={24} />}
                <span>{language === "bilingual" ? "Yes 有" : t.yesBtn}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    marginLeft: "6px",
                  }}
                  title="Keyboard: Left Arrow or Y"
                >
                  <KeyBadge size="md">←</KeyBadge>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>/</span>
                  <KeyBadge size="md">Y</KeyBadge>
                </span>
              </button>

              {/* No Button */}
              <button
                onClick={() => {
                  if (isEditing) {
                    setEditDraftValue("no");
                  } else {
                    answerQuestion(currentQuestion.id, "no");
                  }
                }}
                disabled={isTransitioning}
                style={{
                  height: "clamp(68px, 5.5vw, 92px)",
                  borderRadius: "var(--radius-control)",
                  border: currentAnswer === "no" ? "2.5px solid var(--color-primary)" : "1.5px solid var(--color-border)",
                  backgroundColor: currentAnswer === "no" ? "var(--color-primary-soft)" : "var(--color-surface)",
                  color: currentAnswer === "no" ? "var(--color-primary)" : "var(--color-text)",
                  fontSize: "clamp(1.15rem, 1.6vw, 1.6rem)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.15s ease",
                }}
              >
                {currentAnswer === "no" && <Check size={24} />}
                <span>{language === "bilingual" ? "No 没有" : t.noBtn}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    marginLeft: "6px",
                  }}
                  title="Keyboard: Right Arrow or N"
                >
                  <KeyBadge size="md">→</KeyBadge>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>/</span>
                  <KeyBadge size="md">N</KeyBadge>
                </span>
              </button>
            </div>

            {/* Secondary Navigation Row */}
            {isEditing ? (
              /* Editing mode controls: Save & Return or Cancel */
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "14px", borderTop: "1px solid #F0F4F8", paddingTop: "20px" }}>
                <button
                  onClick={() => {
                    setEditingQuestionId(null);
                    navigate("/result");
                  }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "var(--radius-control)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-secondary)",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  {language === "bilingual" ? "Cancel 取消" : t.cancelEditBtn}
                </button>
                <button
                  onClick={() => {
                    if (editDraftValue) {
                      saveEditedAnswer(currentQuestion.id, editDraftValue);
                    }
                    navigate("/result");
                  }}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "var(--radius-control)",
                    backgroundColor: "var(--color-primary)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                >
                  {language === "bilingual" ? "Save & Return 保存并返回" : t.saveAndReturnBtn}
                </button>
              </div>
            ) : (
              /* Normal test mode navigation: Previous, Skip for now */
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #F0F4F8",
                  paddingTop: "20px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <button
                  onClick={goToPrevious}
                  disabled={isFirstQuestion || isTransitioning}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: isFirstQuestion ? "var(--color-text-muted)" : "var(--color-text-secondary)",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    cursor: isFirstQuestion ? "not-allowed" : "pointer",
                  }}
                >
                  <ArrowLeft size={18} />
                  <span>{language === "bilingual" ? "Previous 上一题" : t.previousBtn}</span>
                  <KeyBadge size="sm">↑</KeyBadge>
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <button
                    onClick={() => skipQuestion(currentQuestion.id)}
                    disabled={isTransitioning}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--color-text-secondary)",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  >
                    <span>{language === "bilingual" ? "Skip for now 暂时跳过" : t.skipBtn}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <KeyBadge size="sm">↓</KeyBadge>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600 }}>/</span>
                      <KeyBadge size="sm">S</KeyBadge>
                    </span>
                    <SkipForward size={16} />
                  </button>

                  {/* If question is already answered, allow simply clicking Next to view */}
                  {currentAnswer && !isLastQuestion && (
                    <button
                      onClick={() => {
                        const nextQ = currentBank.questions[questionIndex + 1];
                        goToQuestion(nextQ.id);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "var(--color-primary)",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      <span>{language === "bilingual" ? "Next 下一题" : "下一题"}</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Auto advance footnote */}
            {!isEditing && (
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--color-text-muted)",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                {language === "bilingual" ? "Selecting an answer automatically advances to the next question. / 选择答案后自动进入下一题，可随时返回修改。" : t.autoAdvanceNotice}
              </p>
            )}
          </div>

          {/* Keyboard Shortcuts Hint Bar (Desktop / Laptop helper) */}
          {!isEditing && (
            <div
              style={{
                marginTop: "20px",
                padding: "clamp(12px, 1.4vw, 18px) clamp(16px, 2vw, 28px)",
                backgroundColor: "#FFFFFF",
                borderRadius: "var(--radius-card)",
                border: "1.5px solid var(--color-border)",
                boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                fontSize: "clamp(0.9rem, 1.05vw, 1.02rem)",
                color: "var(--color-text)",
                flexWrap: "wrap",
              }}
            >
              {/* Badge title */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--color-primary-soft)",
                  color: "var(--color-primary)",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  letterSpacing: "0.01em",
                }}
              >
                <span style={{ fontSize: "1rem" }}>⌨️</span>
                <span>{language === "bilingual" ? "Keyboard Shortcuts 快捷键答题" : language === "zh-CN" ? "快捷键答题" : "Keyboard Shortcuts"}</span>
              </div>

              {/* Items container */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(12px, 1.6vw, 24px)",
                  flexWrap: "wrap",
                }}
              >
                {/* 1. Yes */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <KeyBadge size="md">←</KeyBadge>
                    <span style={{ color: "#94A3B8", fontWeight: 500, fontSize: "0.85rem" }}>/</span>
                    <KeyBadge size="md">Y</KeyBadge>
                  </div>
                  <span style={{ color: "#15803D", fontWeight: 700 }}>{language === "bilingual" ? "Yes 有" : t.yesBtn}</span>
                </div>

                <span style={{ width: "1px", height: "18px", backgroundColor: "#E2E8F0" }} />

                {/* 2. No */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <KeyBadge size="md">→</KeyBadge>
                    <span style={{ color: "#94A3B8", fontWeight: 500, fontSize: "0.85rem" }}>/</span>
                    <KeyBadge size="md">N</KeyBadge>
                  </div>
                  <span style={{ color: "#B91C1C", fontWeight: 700 }}>{language === "bilingual" ? "No 没有" : t.noBtn}</span>
                </div>

                <span style={{ width: "1px", height: "18px", backgroundColor: "#E2E8F0" }} />

                {/* 3. Previous */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                  <KeyBadge size="md">↑</KeyBadge>
                  <span style={{ color: "var(--color-text-secondary)" }}>{language === "bilingual" ? "Previous 上一题" : t.previousBtn}</span>
                </div>

                <span style={{ width: "1px", height: "18px", backgroundColor: "#E2E8F0" }} />

                {/* 4. Skip / Next */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <KeyBadge size="md">↓</KeyBadge>
                    <span style={{ color: "#94A3B8", fontWeight: 500, fontSize: "0.85rem" }}>/</span>
                    <KeyBadge size="md">S</KeyBadge>
                  </div>
                  <span style={{ color: "var(--color-text-secondary)" }}>{language === "bilingual" ? "Skip 跳过/下一题" : language === "zh-CN" ? "跳过/下一题" : "Skip / Next"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Drawer (When screen width < 1024px) */}
      {!isEditing && isMobileDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            zIndex: 999,
            display: "flex",
            justifyContent: "flex-end",
            backdropFilter: "blur(3px)",
          }}
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            style={{
              width: "86%",
              maxWidth: "340px",
              height: "100%",
              backgroundColor: "var(--color-surface)",
              boxShadow: "-4px 0 24px rgba(20, 33, 61, 0.16)",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <QuestionNavSidebar
              questions={currentBank.questions}
              currentQuestionId={currentQuestion.id}
              answers={session ? session.answers : {}}
              counts={counts}
              onSelectQuestion={(id) => {
                goToQuestion(id);
                setIsMobileDrawerOpen(false);
              }}
              isMobile={true}
              onClose={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
};
