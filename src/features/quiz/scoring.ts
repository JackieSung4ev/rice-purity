import { QuestionBank, Answers, Counts, Result } from "./types";

/**
 * Derives statistical counts from answers for the given question bank.
 * Only iterates over valid questions defined in the bank.
 */
export function deriveCounts(bank: QuestionBank, answers: Answers): Counts {
  let yes = 0;
  let no = 0;
  let skipped = 0;
  let unvisited = 0;

  for (const q of bank.questions) {
    const val = answers[q.id];
    if (val === "yes") {
      yes += 1;
    } else if (val === "no") {
      no += 1;
    } else if (val === "skipped") {
      skipped += 1;
    } else {
      unvisited += 1;
    }
  }

  const answered = yes + no;
  const total = bank.questions.length;

  return {
    total,
    yes,
    no,
    skipped,
    unvisited,
    answered,
  };
}

/**
 * Derives official or demo/incomplete result.
 * Rule:
 * 1. If bank reviewStatus is 'draft', status is 'demo' and score is null.
 * 2. If bank has exactly 100 questions and all 100 are answered (yes or no):
 *    score = 100 - yesCount (0 is valid!).
 *    status is 'complete'.
 * 3. Otherwise, score is null and status is 'incomplete'.
 */
export function deriveResult(bank: QuestionBank, answers: Answers): Result {
  const counts = deriveCounts(bank, answers);

  if (bank.reviewStatus === "draft") {
    return {
      status: "demo",
      score: null,
      counts,
    };
  }

  if (bank.questions.length === 100 && counts.answered === 100) {
    const score = 100 - counts.yes;
    return {
      status: "complete",
      score,
      counts,
    };
  }

  return {
    status: "incomplete",
    score: null,
    counts,
  };
}
