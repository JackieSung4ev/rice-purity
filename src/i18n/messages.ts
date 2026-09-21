import { Locale } from "../features/quiz/types";

export interface TranslationDict {
  brandName: string;
  brandTagline: string;
  navHome: string;
  navTest: string;
  navFaq: string;
  navAbout: string;
  navPrivacy: string;

  // Home
  heroTitle: string;
  heroSubtitle: string;
  startTestBtn: string;
  continueTestBtn: string;
  viewResultBtn: string;
  learnMoreBtn: string;
  badge100Q: string;
  badgeDemoQ: string;
  badgePrivate: string;
  badgeInstant: string;
  demoNoticeBanner: string;

  // Cards
  scoringCardTitle: string;
  scoringCardDesc: string;
  scoringCardFormula: string;
  scoringQuote: string;

  // Test
  questionLabel: string;
  answeredLabel: string;
  yesBtn: string;
  noBtn: string;
  previousBtn: string;
  skipBtn: string;
  autoAdvanceNotice: string;
  editModeNotice: string;
  saveAndReturnBtn: string;
  cancelEditBtn: string;

  // Review
  reviewTitle: string;
  reviewSubtitle: string;
  skippedItemsHeader: string;
  unvisitedItemsHeader: string;
  jumpToQuestionBtn: string;
  finishAndSeeSummaryBtn: string;

  // Result
  resultTitle: string;
  resultSubtitle: string;
  resultScoreLabel: string;
  resultScoreDesc: (yes: number, total: number) => string;
  resultPhilosophy: string;
  exportPdfBtn: string;
  generatingPdfBtn: string;
  viewAnswersBtn: string;
  hideAnswersBtn: string;
  retakeTestBtn: string;
  statYes: string;
  statNo: string;
  statSkipped: string;
  statUnvisited: string;
  statTotalAnswered: string;
  summaryTitle: string;
  howScoringWorksTitle: string;
  howScoringWorksContent: string;
  demoResultNotice: string;
  incompleteResultNotice: string;
  editAnswerBtn: string;
  answerSummaryHeading: string;
  questionsAnswersHeading: string;

  // Privacy & Dialog
  privacyNoteBanner: string;
  clearRecordConfirmTitle: string;
  clearRecordConfirmDesc: string;
  confirmBtn: string;
  cancelBtn: string;
  storageWarningNotice: string;

  // Footer & FAQ
  faqTitle: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;
  footerTagline: string;
  footerRights: string;
  footerPrivacyLink: string;
  footerAboutLink: string;

  // NotFound
  notFoundTitle: string;
  notFoundDesc: string;
  backHomeBtn: string;
}

export const messages: Record<Locale, TranslationDict> = {
  "zh-CN": {
    brandName: "Rice Purity Test 纯洁度测试",
    brandTagline: "关于成长，更开放的对话。",
    navHome: "首页",
    navTest: "测试",
    navFaq: "常见问题",
    navAbout: "关于",
    navPrivacy: "隐私说明",

    heroTitle: "纯洁度测试",
    heroSubtitle: "一个关于人生经历的自我评估测试，帮助你了解自己的人生经历。",
    startTestBtn: "开始测试",
    continueTestBtn: "继续测试",
    viewResultBtn: "查看结果",
    learnMoreBtn: "评分规则",
    badge100Q: "100 道题目",
    badgeDemoQ: "精选 10 题演示版",
    badgePrivate: "浏览器本地处理",
    badgeInstant: "即时出分",
    demoNoticeBanner: "当前为界面与交互演示版本（10道非敏感经历题）。正式100题待审核中。",

    scoringCardTitle: "评分说明",
    scoringCardDesc: "测试从 100 分开始，每勾选一项“有”的经历，就会扣除 1 分。",
    scoringCardFormula: "分数越高 = 勾选的经历越少",
    scoringQuote: "“这不是为了评判你，而是帮助你更了解自己。”",

    questionLabel: "第 {order} 题，共 {total} 题",
    answeredLabel: "已回答 {answered} / {total}",
    yesBtn: "Yes 有",
    noBtn: "No 没有",
    previousBtn: "上一题",
    skipBtn: "暂时跳过",
    autoAdvanceNotice: "选择答案后自动进入下一题，可在答题中随时返回或在结果页修改。",
    editModeNotice: "修改模式：修改此题答案后可保存并返回。",
    saveAndReturnBtn: "保存并返回结果",
    cancelEditBtn: "取消修改",

    reviewTitle: "答题收尾检查",
    reviewSubtitle: "你已浏览到最后一题，目前尚有未完成的项目。你可以选择补答，或直接结束并查看未完成摘要。",
    skippedItemsHeader: "暂时跳过的题目",
    unvisitedItemsHeader: "尚未作答的题目",
    jumpToQuestionBtn: "前往回答",
    finishAndSeeSummaryBtn: "结束测试并查看未完成摘要",

    resultTitle: "测试结果",
    resultSubtitle: "感谢你完成测试！自我探索是一段勇敢的旅程，请温柔地对待自己。",
    resultScoreLabel: "你的纯洁度分数",
    resultScoreDesc: (yes, total) => `你在 ${total} 项经历中，有 ${yes} 项选择了“有”。`,
    resultPhilosophy: "分数不是道德或品格评判，只是你对这份经历清单的回答情况。",
    exportPdfBtn: "导出 PDF 报告",
    generatingPdfBtn: "正在生成 PDF...",
    viewAnswersBtn: "查看回答明细",
    hideAnswersBtn: "收起回答明细",
    retakeTestBtn: "重新测试",
    statYes: "有经历 (Yes)",
    statNo: "无经历 (No)",
    statSkipped: "暂时跳过",
    statUnvisited: "未作答",
    statTotalAnswered: "有效已回答",
    summaryTitle: "答题摘要",
    howScoringWorksTitle: "评分说明",
    howScoringWorksContent: "正式测试从 100 分开始，每一项“有”扣 1 分。0 分与 100 分均为有效结果。全部 100 题答完方可生成正式纯洁度分数。",
    demoResultNotice: "本次使用的是演示题库（10 题），结果仅用于流程体验，不作为正式分数。",
    incompleteResultNotice: "测试尚未全部完成，无法生成正式 100 题分数。已导出或展示的为未完成答题摘要。",
    editAnswerBtn: "修改",
    answerSummaryHeading: "答题统计",
    questionsAnswersHeading: "回答明细",

    privacyNoteBanner: "答案仅在您的浏览器中临时计算，本站不向任何服务器发送您的答案或分数。您可以随时清除本标签页数据。",
    clearRecordConfirmTitle: "清除本次测试记录？",
    clearRecordConfirmDesc: "此操作将清空浏览器中保存的全部答题记录与进度，且不可撤销。",
    confirmBtn: "确认清除",
    cancelBtn: "取消",
    storageWarningNotice: "当前浏览器无法保存会话进度（可能是隐身模式或存储受限），刷新页面可能会丢失未提交的回答。",

    faqTitle: "常见问题",
    faqQ1: "什么是 Rice Purity Test（米纯测试）？",
    faqA1: "Rice Purity Test 起源于美国莱斯大学（Rice University），最初是学生们用于记录与回顾人生经历的传统自我问卷。它是一个趣味性质的经历核对表，而非任何形式的心理测试或道德评价。",
    faqQ2: "测试分数是否有好坏之分？",
    faqA2: "完全没有。无论得分高低，分数仅反映您在所列清单中经历过的事情多寡，并不定义您的个人价值、品格或健康状态。",
    faqQ3: "跳过题目会怎么计算？",
    faqA3: "跳过不等于“没有”。如果存在跳过的题目，问卷将被判定为“未完成”，系统不会按比例换算或伪造正式 100 题分数。",
    faqQ4: "我的答案会被上传或记录吗？",
    faqA4: "不会。本网站为纯前端单页应用（SPA），答题与计分逻辑 100% 在您的浏览器本地运行，不设后端数据库，绝不收集、存储或上传您的任何作答记录。",
    footerTagline: "关于成长，更开放的对话。一份关于人生经历的自我问卷。",
    footerRights: "Rice Purity Test. 纯前端本地测试，保护个人隐私。",
    footerPrivacyLink: "隐私与安全声明",
    footerAboutLink: "关于本项目",

    notFoundTitle: "页面未找到 (404)",
    notFoundDesc: "抱歉，你访问的页面不存在或已被移除。",
    backHomeBtn: "返回首页",
  },
  en: {
    brandName: "Rice Purity Test",
    brandTagline: "A more open conversation about growing up.",
    navHome: "Home",
    navTest: "Test",
    navFaq: "FAQ",
    navAbout: "About",
    navPrivacy: "Privacy",

    heroTitle: "Rice Purity Test",
    heroSubtitle: "A fun self-assessment quiz to explore life experiences and personal milestones.",
    startTestBtn: "Start Test",
    continueTestBtn: "Continue Test",
    viewResultBtn: "View Result",
    learnMoreBtn: "How it works",
    badge100Q: "100 Questions",
    badgeDemoQ: "10-Question Demo",
    badgePrivate: "100% Local & Private",
    badgeInstant: "Instant Results",
    demoNoticeBanner: "Running in demonstration mode (10 non-sensitive sample items) for UI & flow review. Official 100-question release pending review.",

    scoringCardTitle: "How scoring works",
    scoringCardDesc: 'Start from 100. Each checked "Yes" lowers the score by 1 point.',
    scoringCardFormula: "Higher score = fewer experiences checked",
    scoringQuote: '"It’s not about judgment. It’s about self-understanding."',

    questionLabel: "Question {order} of {total}",
    answeredLabel: "Answered {answered} of {total}",
    yesBtn: "Yes",
    noBtn: "No",
    previousBtn: "Previous",
    skipBtn: "Skip for now",
    autoAdvanceNotice: "Selecting an answer automatically moves to the next question. You can review or edit anytime.",
    editModeNotice: "Editing mode: Update your answer and save to return to the results.",
    saveAndReturnBtn: "Save & Return to Results",
    cancelEditBtn: "Cancel",

    reviewTitle: "Review & Finish",
    reviewSubtitle: "You reached the final question, but some items were skipped or unvisited. You can answer them now or view an incomplete summary.",
    skippedItemsHeader: "Skipped Questions",
    unvisitedItemsHeader: "Unvisited Questions",
    jumpToQuestionBtn: "Go to Question",
    finishAndSeeSummaryBtn: "Finish & View Incomplete Summary",

    resultTitle: "Your Result",
    resultSubtitle: "Thanks for completing the test! Self-exploration is a brave step. Be kind to yourself.",
    resultScoreLabel: "Your Rice Purity Score",
    resultScoreDesc: (yes, total) => `You answered "Yes" to ${yes} of ${total} items.`,
    resultPhilosophy: "Your score is not a moral or personality judgment. It is simply a reflection of your answers.",
    exportPdfBtn: "Export PDF Report",
    generatingPdfBtn: "Generating PDF...",
    viewAnswersBtn: "View Answers",
    hideAnswersBtn: "Hide Answers",
    retakeTestBtn: "Retake Test",
    statYes: "Yes",
    statNo: "No",
    statSkipped: "Skipped",
    statUnvisited: "Unvisited",
    statTotalAnswered: "Answered",
    summaryTitle: "Answer Summary",
    howScoringWorksTitle: "How Scoring Works",
    howScoringWorksContent:
      'The official test starts from 100 points, subtracting 1 point for each "Yes". Both 0 and 100 are valid scores. All 100 questions must be answered to produce an official score.',
    demoResultNotice: "This test used a demo question set (10 questions). The result is for demonstration and does not constitute an official score.",
    incompleteResultNotice: "The test was not fully completed. An official score cannot be calculated. An incomplete summary is shown.",
    editAnswerBtn: "Edit",
    answerSummaryHeading: "Answer Summary",
    questionsAnswersHeading: "Questions & Answers",

    privacyNoteBanner: "Answers are processed strictly inside your browser. This app never transmits your answers or scores to any server. You can clear your data at any time.",
    clearRecordConfirmTitle: "Clear Current Test Record?",
    clearRecordConfirmDesc: "This will erase all current answers, scores, and progress from your browser. This action cannot be undone.",
    confirmBtn: "Clear Record",
    cancelBtn: "Cancel",
    storageWarningNotice: "Browser session storage is unavailable. Refreshing the page may cause you to lose your progress.",

    faqTitle: "Frequently Asked Questions",
    faqQ1: "What is the Rice Purity Test?",
    faqA1:
      "Originally created by students at Rice University, the Rice Purity Test is a voluntary self-assessment checklist exploring various life experiences. It is a lighthearted self-reflection tool, not a psychological evaluation or moral rating.",
    faqQ2: 'Are there "good" or "bad" scores?',
    faqA2: "No. Regardless of whether your score is high or low, it merely reflects the number of items on this specific list you have experienced. It does not measure your worth or character.",
    faqQ3: "How are skipped questions handled?",
    faqA3: 'Skipping is not the same as answering "No". If any question is skipped or unvisited, the test remains incomplete and no official score is produced.',
    faqQ4: "Are my answers stored or tracked?",
    faqA4: "No. This is a 100% client-side application. All calculations occur inside your browser. No personal data, answers, or scores are ever sent to a server.",
    footerTagline: "A more open conversation about growing up. A self-assessment quiz about life experiences.",
    footerRights: "Rice Purity Test. Pure client-side test respecting your privacy.",
    footerPrivacyLink: "Privacy & Security Notice",
    footerAboutLink: "About This Project",

    notFoundTitle: "Page Not Found (404)",
    notFoundDesc: "The page you requested does not exist or has moved.",
    backHomeBtn: "Back to Home",
  },
};
