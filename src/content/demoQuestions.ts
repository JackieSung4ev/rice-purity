import { QuestionBank } from "../features/quiz/types";

export const demoQuestionBank: QuestionBank = {
  id: "rice-demo-v1",
  version: "1.0.0",
  scoringVersion: "count-100-equal-v1",
  reviewStatus: "draft",
  sourceNote: "演示题库（10题），用于UI与核心流程验收。非正式100题版本。",
  questions: [
    {
      id: "d001",
      order: 1,
      text: {
        en: "Held hands romantically?",
        "zh-CN": "曾与他人浪漫牵手？",
      },
    },
    {
      id: "d002",
      order: 2,
      text: {
        en: "Been on a date?",
        "zh-CN": "曾经与人约会？",
      },
    },
    {
      id: "d003",
      order: 3,
      text: {
        en: "Been in a romantic relationship?",
        "zh-CN": "曾经谈过恋爱？",
      },
    },
    {
      id: "d004",
      order: 4,
      text: {
        en: "Traveled alone to a new city or country?",
        "zh-CN": "曾独自前往陌生城市或国家旅行？",
      },
    },
    {
      id: "d005",
      order: 5,
      text: {
        en: "Skipped a class or taken an unapproved day off?",
        "zh-CN": "曾经逃课或擅自旷工？",
      },
    },
    {
      id: "d006",
      order: 6,
      text: {
        en: "Stayed up all night playing games or binge-watching?",
        "zh-CN": "曾通宵玩游戏或通宵刷剧？",
      },
    },
    {
      id: "d007",
      order: 7,
      text: {
        en: "Learned to play a musical instrument?",
        "zh-CN": "曾认真学过一种乐器？",
      },
    },
    {
      id: "d008",
      order: 8,
      text: {
        en: "Sung karaoke or performed in front of a crowd?",
        "zh-CN": "曾在众人面前唱卡拉OK或登台表演？",
      },
    },
    {
      id: "d009",
      order: 9,
      text: {
        en: "Cooked a complete meal for friends or family from scratch?",
        "zh-CN": "曾为朋友或家人亲手做过一整顿饭？",
      },
    },
    {
      id: "d010",
      order: 10,
      text: {
        en: "Volunteered for a community cause or charity?",
        "zh-CN": "曾参与过社区公益或志愿者服务？",
      },
    },
  ],
};
