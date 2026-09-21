export type Locale = "zh-CN" | "en";
export type DisplayLanguage = Locale | "bilingual";
export type AnswerValue = "yes" | "no" | "skipped";

// answers[id] not present = unvisited / not answered yet
export type Answers = Partial<Record<string, AnswerValue>>;

export interface Question {
  id: string; // e.g. 'q001'
  order: number; // 1-indexed display order
  text: Record<Locale, string>;
  imageUrl?: string; // Optional illustration/media path for future question artwork
}

export interface QuestionBank {
  id: string;
  version: string;
  scoringVersion: "count-100-equal-v1";
  reviewStatus: "draft" | "approved";
  sourceNote: string;
  questions: readonly Question[];
}

export interface QuizSession {
  schemaVersion: 1;
  bankId: string;
  bankVersion: string;
  scoringVersion: string;
  answers: Answers;
  currentQuestionId: string;
  phase: "answering" | "review" | "result";
  answersRevision: number;
  startedAt: string;
  finishedAt: string | null;
}

export interface Counts {
  total: number;
  yes: number;
  no: number;
  skipped: number;
  unvisited: number;
  answered: number;
}

export type Result = { status: "complete"; score: number; counts: Counts } | { status: "incomplete" | "demo"; score: null; counts: Counts };

export interface ReportSnapshot {
  bankId: string;
  bankVersion: string;
  reviewStatus: "draft" | "approved";
  answersRevision: number;
  result: Result;
  language: DisplayLanguage;
  generatedAt: string;
  timeZone: string;
}
