import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { QuestionBank, QuizSession, Result, Counts, AnswerValue, Answers } from "./types";
import { demoQuestionBank } from "../../content/demoQuestions";
import { official100QuestionBank } from "../../content/official100Questions";
import { deriveCounts, deriveResult } from "./scoring";
import { validateSession } from "./validation";
import { saveSessionToStorage, loadSessionFromStorage, clearSessionFromStorage, isSessionStorageAvailable } from "./storage";

interface QuizContextValue {
  currentBank: QuestionBank;
  setBank: (bank: QuestionBank) => void;
  isDemo: boolean;
  session: QuizSession | null;
  result: Result | null;
  counts: Counts | null;
  storageWarning: boolean;
  isTransitioning: boolean;
  editingQuestionId: string | null;
  setEditingQuestionId: (id: string | null) => void;

  startQuiz: (bank?: QuestionBank) => void;
  answerQuestion: (questionId: string, value: "yes" | "no") => void;
  skipQuestion: (questionId: string) => void;
  goToPrevious: () => void;
  goToQuestion: (questionId: string) => void;
  saveEditedAnswer: (questionId: string, value: AnswerValue) => void;
  finishAndShowResult: () => void;
  retakeQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default question bank is the official 100-question bank
  const [currentBank, setCurrentBank] = useState<QuestionBank>(official100QuestionBank);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [storageWarning, setStorageWarning] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Initialize session from sessionStorage on mount
  useEffect(() => {
    const isAvail = isSessionStorageAvailable();
    if (!isAvail) {
      setStorageWarning(true);
    }

    const { success, data, error } = loadSessionFromStorage();
    if (success && data) {
      // Determine which bank matches the session
      const bankToValidate = (data as any).bankId === demoQuestionBank.id ? demoQuestionBank : official100QuestionBank;

      const validation = validateSession(data, bankToValidate);
      if (validation.valid && validation.session) {
        setCurrentBank(bankToValidate);
        setSession(validation.session);
      } else {
        console.warn("Stored session validation failed:", validation.error || error);
        clearSessionFromStorage();
      }
    }
  }, []);

  // Save session to storage when modified
  const updateSession = useCallback((newSession: QuizSession | null) => {
    setSession(newSession);
    if (newSession) {
      const res = saveSessionToStorage(newSession);
      if (!res.isAvailable) {
        setStorageWarning(true);
      }
    } else {
      clearSessionFromStorage();
    }
  }, []);

  const counts = useMemo(() => {
    if (!session) return null;
    return deriveCounts(currentBank, session.answers);
  }, [currentBank, session]);

  const result = useMemo(() => {
    if (!session) return null;
    return deriveResult(currentBank, session.answers);
  }, [currentBank, session]);

  const startQuiz = useCallback(
    (bankToStart?: QuestionBank) => {
      const targetBank = bankToStart || currentBank;
      setCurrentBank(targetBank);
      const firstQ = targetBank.questions[0];
      const newSession: QuizSession = {
        schemaVersion: 1,
        bankId: targetBank.id,
        bankVersion: targetBank.version,
        scoringVersion: targetBank.scoringVersion,
        answers: {},
        currentQuestionId: firstQ ? firstQ.id : "",
        phase: "answering",
        answersRevision: 1,
        startedAt: new Date().toISOString(),
        finishedAt: null,
      };
      updateSession(newSession);
    },
    [currentBank, updateSession],
  );

  const advanceAfterAnswer = useCallback(
    (currentQId: string, updatedAnswers: Answers) => {
      if (!session) return;
      const qIndex = currentBank.questions.findIndex((q) => q.id === currentQId);
      const isLast = qIndex === currentBank.questions.length - 1;

      if (!isLast) {
        // Move to next question
        const nextQ = currentBank.questions[qIndex + 1];
        updateSession({
          ...session,
          answers: updatedAnswers,
          currentQuestionId: nextQ.id,
          answersRevision: session.answersRevision + 1,
        });
      } else {
        // Reached the end of questions:
        // Check if all questions have been answered
        const c = deriveCounts(currentBank, updatedAnswers);
        if (c.answered === currentBank.questions.length) {
          // Complete! Go directly to result
          updateSession({
            ...session,
            answers: updatedAnswers,
            phase: "result",
            finishedAt: new Date().toISOString(),
            answersRevision: session.answersRevision + 1,
          });
        } else {
          // There are skipped or unvisited items! Go to review phase
          updateSession({
            ...session,
            answers: updatedAnswers,
            phase: "review",
            answersRevision: session.answersRevision + 1,
          });
        }
      }
    },
    [session, currentBank, updateSession],
  );

  const answerQuestion = useCallback(
    (questionId: string, value: "yes" | "no") => {
      if (!session || isTransitioning) return;
      setIsTransitioning(true);

      const updatedAnswers = {
        ...session.answers,
        [questionId]: value,
      };

      // Transition lock of 200ms to avoid double tap accidental triggers
      setTimeout(() => {
        advanceAfterAnswer(questionId, updatedAnswers);
        setIsTransitioning(false);
      }, 200);
    },
    [session, isTransitioning, advanceAfterAnswer],
  );

  const skipQuestion = useCallback(
    (questionId: string) => {
      if (!session || isTransitioning) return;
      setIsTransitioning(true);

      const updatedAnswers = {
        ...session.answers,
        [questionId]: "skipped" as const,
      };

      setTimeout(() => {
        advanceAfterAnswer(questionId, updatedAnswers);
        setIsTransitioning(false);
      }, 200);
    },
    [session, isTransitioning, advanceAfterAnswer],
  );

  const goToPrevious = useCallback(() => {
    if (!session) return;
    const qIndex = currentBank.questions.findIndex((q) => q.id === session.currentQuestionId);
    if (qIndex > 0) {
      const prevQ = currentBank.questions[qIndex - 1];
      updateSession({
        ...session,
        currentQuestionId: prevQ.id,
        phase: "answering",
      });
    }
  }, [session, currentBank, updateSession]);

  const goToQuestion = useCallback(
    (questionId: string) => {
      if (!session) return;
      updateSession({
        ...session,
        currentQuestionId: questionId,
        phase: "answering",
      });
    },
    [session, updateSession],
  );

  const saveEditedAnswer = useCallback(
    (questionId: string, value: AnswerValue) => {
      if (!session) return;
      const updatedAnswers = {
        ...session.answers,
        [questionId]: value,
      };
      updateSession({
        ...session,
        answers: updatedAnswers,
        answersRevision: session.answersRevision + 1,
      });
      setEditingQuestionId(null);
    },
    [session, updateSession],
  );

  const finishAndShowResult = useCallback(() => {
    if (!session) return;
    updateSession({
      ...session,
      phase: "result",
      finishedAt: new Date().toISOString(),
      answersRevision: session.answersRevision + 1,
    });
  }, [session, updateSession]);

  const retakeQuiz = useCallback(() => {
    setEditingQuestionId(null);
    updateSession(null);
  }, [updateSession]);

  const setBank = useCallback(
    (bank: QuestionBank) => {
      setCurrentBank(bank);
      setEditingQuestionId(null);
      updateSession(null);
    },
    [updateSession],
  );

  return (
    <QuizContext.Provider
      value={{
        currentBank,
        setBank,
        isDemo: currentBank.reviewStatus === "draft",
        session,
        result,
        counts,
        storageWarning,
        isTransitioning,
        editingQuestionId,
        setEditingQuestionId,
        startQuiz,
        answerQuestion,
        skipQuestion,
        goToPrevious,
        goToQuestion,
        saveEditedAnswer,
        finishAndShowResult,
        retakeQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return ctx;
}
