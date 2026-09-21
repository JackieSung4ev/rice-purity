import { QuestionBank, QuizSession } from "./types";

export function validateQuestionBank(bank: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!bank || typeof bank !== "object") {
    return { valid: false, errors: ["QuestionBank must be an object"] };
  }

  const b = bank as Partial<QuestionBank>;
  if (!b.id || typeof b.id !== "string") errors.push("bankId is missing or invalid");
  if (!b.version || typeof b.version !== "string") errors.push("version is missing or invalid");
  if (b.scoringVersion !== "count-100-equal-v1") errors.push("scoringVersion must be count-100-equal-v1");
  if (b.reviewStatus !== "draft" && b.reviewStatus !== "approved") errors.push("reviewStatus must be draft or approved");

  if (!Array.isArray(b.questions) || b.questions.length === 0) {
    errors.push("questions must be a non-empty array");
    return { valid: errors.length === 0, errors };
  }

  const seenIds = new Set<string>();
  for (let i = 0; i < b.questions.length; i++) {
    const q = b.questions[i];
    if (!q || typeof q !== "object") {
      errors.push(`question at index ${i} is not an object`);
      continue;
    }
    if (!q.id || typeof q.id !== "string") {
      errors.push(`question at index ${i} missing id`);
    } else if (seenIds.has(q.id)) {
      errors.push(`duplicate question id: ${q.id}`);
    } else {
      seenIds.add(q.id);
    }

    if (!q.text || typeof q.text !== "object") {
      errors.push(`question ${q.id || i} missing text object`);
    } else {
      if (!q.text["zh-CN"] || typeof q.text["zh-CN"] !== "string") {
        errors.push(`question ${q.id || i} missing zh-CN text`);
      }
      if (!q.text["en"] || typeof q.text["en"] !== "string") {
        errors.push(`question ${q.id || i} missing en text`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateSession(session: unknown, currentBank: QuestionBank): { valid: boolean; session: QuizSession | null; error?: string } {
  if (!session || typeof session !== "object") {
    return { valid: false, session: null, error: "Invalid session format" };
  }

  const s = session as Partial<QuizSession>;
  if (s.schemaVersion !== 1) {
    return { valid: false, session: null, error: "Unsupported session schema version" };
  }
  if (s.bankId !== currentBank.id) {
    return { valid: false, session: null, error: `Session bank ID mismatch: ${s.bankId} !== ${currentBank.id}` };
  }
  if (s.bankVersion !== currentBank.version) {
    return { valid: false, session: null, error: `Question bank version mismatch: ${s.bankVersion} !== ${currentBank.version}` };
  }

  const validQuestionIds = new Set(currentBank.questions.map((q) => q.id));
  if (!s.answers || typeof s.answers !== "object") {
    return { valid: false, session: null, error: "Session answers missing or corrupt" };
  }

  for (const [id, val] of Object.entries(s.answers)) {
    if (!validQuestionIds.has(id)) {
      return { valid: false, session: null, error: `Unknown question id in answers: ${id}` };
    }
    if (val !== "yes" && val !== "no" && val !== "skipped") {
      return { valid: false, session: null, error: `Invalid answer value for ${id}: ${val}` };
    }
  }

  if (s.currentQuestionId && !validQuestionIds.has(s.currentQuestionId)) {
    return { valid: false, session: null, error: `Invalid currentQuestionId: ${s.currentQuestionId}` };
  }

  return {
    valid: true,
    session: s as QuizSession,
  };
}
