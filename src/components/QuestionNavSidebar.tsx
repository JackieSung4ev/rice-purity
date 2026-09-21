import React, { useState, useEffect, useRef } from "react";
import { ListFilter, X, Check, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Question, Answers, Counts } from "../features/quiz/types";
import { useLanguage } from "../i18n/LanguageContext";

interface QuestionNavSidebarProps {
  questions: readonly Question[];
  currentQuestionId: string;
  answers: Answers;
  counts: Counts | null;
  onSelectQuestion: (questionId: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const QuestionNavSidebar: React.FC<QuestionNavSidebarProps> = ({
  questions,
  currentQuestionId,
  answers,
  counts,
  onSelectQuestion,
  isMobile = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { language, renderText } = useLanguage();
  const [filter, setFilter] = useState<"all" | "skipped" | "unvisited">("all");
  const activeItemRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll the active question into view inside the list
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [currentQuestionId, isCollapsed]);

  const totalQuestions = questions.length;
  const answeredCount = counts ? counts.answered : 0;
  const skippedCount = counts ? counts.skipped : 0;
  const unvisitedCount = counts ? counts.unvisited : totalQuestions - answeredCount - skippedCount;

  // Filter questions based on selected tab
  const filteredQuestions = questions.filter((q) => {
    const ans = answers[q.id];
    if (filter === "skipped") return ans === "skipped";
    if (filter === "unvisited") return !ans;
    return true;
  });

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "100%" : "calc(100vh - 120px)",
        minHeight: isMobile ? "100%" : "640px",
        width: isMobile ? "100%" : isCollapsed ? "72px" : "360px",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        paddingBottom: !isMobile && isCollapsed ? "22px" : "10px",
      }}
    >
      {/* 1. Collapsed / Narrow Mode Header (变窄精简圆点导轨) */}
      {!isMobile && isCollapsed ? (
        <div
          style={{
            padding: "16px 0 14px 0",
            borderBottom: "1px solid var(--color-border)",
            backgroundColor: "#FAFBFD",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "1px solid #BFDBFE",
                transition: "all 0.15s ease",
              }}
              title={language === "bilingual" ? "Expand question list / 展开题目列表" : "展开导航"}
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      ) : (
        /* 2. Expanded Wide Mode Header */
        <div
          style={{
            padding: "16px 18px 12px 18px",
            borderBottom: "1px solid var(--color-border)",
            backgroundColor: "#FAFBFD",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ListFilter size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                {language === "bilingual" ? "Question List 题目导航" : language === "zh-CN" ? "题目导航" : "Question List"}
              </h3>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {!isMobile && onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    backgroundColor: "#FFFFFF",
                    color: "var(--color-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid var(--color-border)",
                    cursor: "pointer",
                  }}
                  title={language === "bilingual" ? "Collapse to mini numbers rail / 收起为编号精简栏" : "收起为编号"}
                >
                  <ChevronLeft size={14} />
                  <span>{language === "bilingual" ? "Collapse 收起" : "收起"}</span>
                </button>
              )}

              {isMobile && onClose && (
                <button
                  onClick={onClose}
                  style={{
                    padding: "4px",
                    borderRadius: "6px",
                    color: "var(--color-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Progress summary badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.78rem",
              color: "var(--color-text-secondary)",
              padding: "6px 10px",
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              marginBottom: "10px",
            }}
          >
            <span>
              {language === "bilingual" ? "Answered 已答: " : language === "zh-CN" ? "已答: " : "Answered: "}
              <strong style={{ color: "var(--color-primary)" }}>{answeredCount}</strong>/{totalQuestions}
            </span>
            {skippedCount > 0 && (
              <span style={{ color: "#D97706" }}>
                {language === "bilingual" ? "Skipped 跳过: " : language === "zh-CN" ? "跳过: " : "Skipped: "}
                <strong>{skippedCount}</strong>
              </span>
            )}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                flex: 1,
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "0.76rem",
                fontWeight: filter === "all" ? 700 : 500,
                backgroundColor: filter === "all" ? "var(--color-primary)" : "#FFFFFF",
                color: filter === "all" ? "#FFFFFF" : "var(--color-text-secondary)",
                border: filter === "all" ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                transition: "all 0.15s ease",
              }}
            >
              {language === "bilingual" ? "All 全部" : language === "zh-CN" ? "全部" : "All"} ({totalQuestions})
            </button>
            {skippedCount > 0 && (
              <button
                onClick={() => setFilter("skipped")}
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.76rem",
                  fontWeight: filter === "skipped" ? 700 : 500,
                  backgroundColor: filter === "skipped" ? "#FEF3C7" : "#FFFFFF",
                  color: filter === "skipped" ? "#92400E" : "var(--color-text-secondary)",
                  border: filter === "skipped" ? "1px solid #FCD34D" : "1px solid var(--color-border)",
                  transition: "all 0.15s ease",
                }}
              >
                {language === "bilingual" ? "Skipped 跳过" : language === "zh-CN" ? "跳过" : "Skipped"} ({skippedCount})
              </button>
            )}
            {unvisitedCount > 0 && (
              <button
                onClick={() => setFilter("unvisited")}
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.76rem",
                  fontWeight: filter === "unvisited" ? 700 : 500,
                  backgroundColor: filter === "unvisited" ? "#F1F5F9" : "#FFFFFF",
                  color: filter === "unvisited" ? "var(--color-text)" : "var(--color-text-secondary)",
                  border: filter === "unvisited" ? "1px solid #CBD5E1" : "1px solid var(--color-border)",
                  transition: "all 0.15s ease",
                }}
              >
                {language === "bilingual" ? "Unanswered 未答" : language === "zh-CN" ? "未答" : "Remaining"} ({unvisitedCount})
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Scrollable List of Questions */}
      <div
        className={!isMobile && isCollapsed ? "sidebar-scroll-hide" : ""}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: !isMobile && isCollapsed ? "14px 0 24px 0" : "8px 10px 16px 10px",
          display: "flex",
          flexDirection: "column",
          gap: !isMobile && isCollapsed ? "12px" : "4px",
          alignItems: !isMobile && isCollapsed ? "center" : "stretch",
          maskImage: !isMobile && isCollapsed ? "linear-gradient(to bottom, black calc(100% - 36px), transparent 100%)" : "none",
          WebkitMaskImage: !isMobile && isCollapsed ? "linear-gradient(to bottom, black calc(100% - 36px), transparent 100%)" : "none",
        }}
      >
        {filteredQuestions.map((q) => {
          const isCurrent = q.id === currentQuestionId;
          const ans = answers[q.id];
          const isAnswered = ans === "yes" || ans === "no";
          const isSkipped = ans === "skipped";

          // If in Narrow / Mini collapsed rail mode, render crisp rounded rectangle button (NO '#')
          if (!isMobile && isCollapsed) {
            return (
              <button
                key={q.id}
                ref={isCurrent ? activeItemRef : null}
                onClick={() => onSelectQuestion(q.id)}
                title={`${q.order}. ${language === "en" ? q.text.en : q.text["zh-CN"]} (${
                  isCurrent ? "Active 进行中" : isAnswered ? "Answered 已作答" : isSkipped ? "Skipped 暂时跳过" : "Unvisited 未作答"
                })`}
                style={{
                  width: "46px",
                  height: "40px",
                  borderRadius: "8px",
                  fontSize: "0.92rem",
                  fontFamily: "var(--font-sans)",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: isCurrent ? 800 : isAnswered ? 700 : 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                  backgroundColor: isCurrent ? "var(--color-primary)" : isAnswered ? "var(--color-primary-soft)" : isSkipped ? "#FEF3C7" : "#FFFFFF",
                  color: isCurrent ? "#FFFFFF" : isAnswered ? "var(--color-primary)" : isSkipped ? "#B45309" : "var(--color-text-secondary)",
                  border: isCurrent ? "2px solid var(--color-primary)" : isAnswered ? "1.5px solid #BFDBFE" : isSkipped ? "1.5px solid #FCD34D" : "1.5px solid var(--color-border)",
                  boxShadow: isCurrent ? "0 4px 12px rgba(37, 99, 235, 0.3)" : "0 1px 2px rgba(0,0,0,0.03)",
                  transform: isCurrent ? "scale(1.04)" : "none",
                }}
              >
                {q.order}
              </button>
            );
          }

          // Wide Expanded Mode (or Mobile Drawer)
          return (
            <button
              key={q.id}
              ref={isCurrent ? activeItemRef : null}
              onClick={() => {
                onSelectQuestion(q.id);
                if (isMobile && onClose) {
                  onClose();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                borderRadius: "8px",
                textAlign: "left",
                backgroundColor: isCurrent ? "var(--color-primary-soft)" : isAnswered ? "#FAFBFD" : "transparent",
                border: isCurrent ? "1.5px solid var(--color-primary)" : "1px solid transparent",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.backgroundColor = isAnswered ? "#FAFBFD" : "transparent";
                }
              }}
            >
              {/* Order index */}
              <span
                style={{
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-sans)",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? "var(--color-primary)" : "var(--color-text-secondary)",
                  minWidth: "26px",
                }}
              >
                {q.order}
              </span>

              {/* Title preview */}
              <span
                style={{
                  flex: 1,
                  fontSize: "0.82rem",
                  color: isCurrent ? "var(--color-text)" : isAnswered ? "var(--color-text)" : "var(--color-text-secondary)",
                  fontWeight: isCurrent ? 600 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={language === "en" ? q.text.en : q.text["zh-CN"]}
              >
                {renderText(q.text.en, q.text["zh-CN"])}
              </span>

              {/* Status Badge */}
              {isCurrent ? (
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: "var(--color-primary)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {language === "bilingual" ? "Current 进行中" : language === "zh-CN" ? "进行中" : "Active"}
                </span>
              ) : isAnswered ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: "#EFF6FF",
                    color: "var(--color-primary)",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                  title="Answered 已回答"
                >
                  <Check size={12} />
                  <span>{language === "bilingual" ? "Done 已答" : language === "zh-CN" ? "已答" : "Done"}</span>
                </span>
              ) : isSkipped ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: "#FEF3C7",
                    color: "#D97706",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                  title="Skipped 暂时跳过"
                >
                  <Clock size={12} />
                  <span>{language === "bilingual" ? "Skip 跳过" : language === "zh-CN" ? "跳过" : "Skip"}</span>
                </span>
              ) : (
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--color-text-muted)",
                    padding: "0 4px",
                  }}
                >
                  ○
                </span>
              )}
            </button>
          );
        })}

        {/* Extra bottom spacer so the last question is never cramped against the bottom curve */}
        <div style={{ height: !isMobile && isCollapsed ? "20px" : "12px", flexShrink: 0 }} />
      </div>
    </div>
  );
};
