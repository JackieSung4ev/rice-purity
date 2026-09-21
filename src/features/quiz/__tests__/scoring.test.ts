import { describe, it, expect } from "vitest";
import { deriveCounts, deriveResult } from "../scoring";
import { validateQuestionBank, validateSession } from "../validation";
import { QuestionBank, Answers, QuizSession } from "../types";
import { demoQuestionBank } from "../../../content/demoQuestions";

// Create an approved 100-question fixture for tests
function createTestBank(reviewStatus: "draft" | "approved" = "approved"): QuestionBank {
  const questions = Array.from({ length: 100 }, (_, i) => ({
    id: `q${String(i + 1).padStart(3, "0")}`,
    order: i + 1,
    text: {
      en: `Question ${i + 1}?`,
      "zh-CN": `问题 ${i + 1}？`,
    },
  }));

  return {
    id: "test-bank-100",
    version: "1.0.0",
    scoringVersion: "count-100-equal-v1",
    reviewStatus,
    sourceNote: "Automated test fixture",
    questions,
  };
}

describe("Scoring and Validation (D01 - D10)", () => {
  const bank100 = createTestBank("approved");

  it("D01: 正式 100 题全部 No -> 100 分", () => {
    const answers: Answers = {};
    bank100.questions.forEach((q) => {
      answers[q.id] = "no";
    });

    const res = deriveResult(bank100, answers);
    expect(res.status).toBe("complete");
    if (res.status === "complete") {
      expect(res.score).toBe(100);
      expect(res.counts.yes).toBe(0);
      expect(res.counts.no).toBe(100);
      expect(res.counts.answered).toBe(100);
    }
  });

  it("D02: 正式 100 题全部 Yes -> 0 分，有效结果", () => {
    const answers: Answers = {};
    bank100.questions.forEach((q) => {
      answers[q.id] = "yes";
    });

    const res = deriveResult(bank100, answers);
    expect(res.status).toBe("complete");
    if (res.status === "complete") {
      expect(res.score).toBe(0); // 0 is a valid score!
      expect(res.counts.yes).toBe(100);
      expect(res.counts.no).toBe(0);
      expect(res.counts.answered).toBe(100);
    }
  });

  it("D03: 28 Yes + 72 No -> 72 分", () => {
    const answers: Answers = {};
    bank100.questions.forEach((q, idx) => {
      answers[q.id] = idx < 28 ? "yes" : "no";
    });

    const res = deriveResult(bank100, answers);
    expect(res.status).toBe("complete");
    if (res.status === "complete") {
      expect(res.score).toBe(72);
      expect(res.counts.yes).toBe(28);
      expect(res.counts.no).toBe(72);
      expect(res.counts.answered).toBe(100);
    }
  });

  it("D04: 将一个 Yes 改为 No -> 分数只增加 1", () => {
    const answers: Answers = {};
    bank100.questions.forEach((q, idx) => {
      answers[q.id] = idx < 28 ? "yes" : "no";
    });

    const res1 = deriveResult(bank100, answers);
    expect(res1.status === "complete" && res1.score).toBe(72);

    // Modify question 0 from yes to no
    answers[bank100.questions[0].id] = "no";
    const res2 = deriveResult(bank100, answers);
    expect(res2.status === "complete" && res2.score).toBe(73);
  });

  it("D05: 28 Yes + 71 No + 1 跳过 -> 未完成，score 为 null", () => {
    const answers: Answers = {};
    bank100.questions.forEach((q, idx) => {
      if (idx < 28) answers[q.id] = "yes";
      else if (idx < 99) answers[q.id] = "no";
      else answers[q.id] = "skipped";
    });

    const res = deriveResult(bank100, answers);
    expect(res.status).toBe("incomplete");
    expect(res.score).toBeNull();
    expect(res.counts.yes).toBe(28);
    expect(res.counts.no).toBe(71);
    expect(res.counts.skipped).toBe(1);
    expect(res.counts.answered).toBe(99);
  });

  it("D06: 0 已答、全部跳过 -> 未完成，不显示 100 分", () => {
    const answers: Answers = {};
    bank100.questions.forEach((q) => {
      answers[q.id] = "skipped";
    });

    const res = deriveResult(bank100, answers);
    expect(res.status).toBe("incomplete");
    expect(res.score).toBeNull();
    expect(res.counts.skipped).toBe(100);
    expect(res.counts.answered).toBe(0);
  });

  it("D07: 有未访问题 -> 与跳过区分，不当作 No", () => {
    const answers: Answers = {
      [bank100.questions[0].id]: "yes",
      [bank100.questions[1].id]: "skipped",
    };
    // other 98 are unvisited

    const counts = deriveCounts(bank100, answers);
    expect(counts.yes).toBe(1);
    expect(counts.no).toBe(0);
    expect(counts.skipped).toBe(1);
    expect(counts.unvisited).toBe(98);
    expect(counts.answered).toBe(1);
  });

  it("D08: 重复/缺失 ID 或非法格式被校验拦截", () => {
    const invalidBank: any = {
      id: "bad-bank",
      version: "1.0.0",
      scoringVersion: "count-100-equal-v1",
      reviewStatus: "approved",
      questions: [
        { id: "q1", order: 1, text: { en: "Q1", "zh-CN": "问1" } },
        { id: "q1", order: 2, text: { en: "Dup", "zh-CN": "重复" } },
      ],
    };

    const res = validateQuestionBank(invalidBank);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("duplicate"))).toBe(true);
  });

  it("D09: 题库版本不一致时会话校验失败", () => {
    const session: QuizSession = {
      schemaVersion: 1,
      bankId: bank100.id,
      bankVersion: "2.0.0-mismatch",
      scoringVersion: bank100.scoringVersion,
      answers: {},
      currentQuestionId: bank100.questions[0].id,
      phase: "answering",
      answersRevision: 1,
      startedAt: new Date().toISOString(),
      finishedAt: null,
    };

    const res = validateSession(session, bank100);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("mismatch");
  });

  it("D10: 演示题库 (reviewStatus: draft) 不生成正式分数", () => {
    const answers: Answers = {};
    demoQuestionBank.questions.forEach((q) => {
      answers[q.id] = "no";
    });

    const res = deriveResult(demoQuestionBank, answers);
    expect(res.status).toBe("demo");
    expect(res.score).toBeNull();
    expect(res.counts.answered).toBe(10);
  });
});
