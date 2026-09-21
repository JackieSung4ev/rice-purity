import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { ReportSnapshot } from "../features/quiz/types";

// Register Chinese font for both browser and Node verification
const nodeProcess = typeof globalThis !== "undefined" ? (globalThis as any).process : undefined;
const fontSrc = typeof window === "undefined" && nodeProcess?.cwd ? nodeProcess.cwd().replace(/\\/g, "/") + "/public/fonts/NotoSansSC-Regular.ttf" : "/fonts/NotoSansSC-Regular.ttf";

Font.register({
  family: "ChineseFont",
  fonts: [
    {
      src: fontSrc,
      fontWeight: "normal",
    },
  ],
});

// Avoid hyphenation breaking Chinese characters
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 44,
    paddingRight: 44,
    fontFamily: "ChineseFont",
    backgroundColor: "#F6F8FC",
    color: "#14213D",
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#DCE4EF",
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleEn: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  titleZh: {
    fontSize: 14,
    color: "#14213D",
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#EFF6FF",
    color: "#2563EB",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontSize: 9,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DCE4EF",
    alignItems: "center",
  },
  scoreLabelEn: {
    fontSize: 11,
    color: "#52627A",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scoreLabelZh: {
    fontSize: 11,
    color: "#52627A",
    marginBottom: 8,
  },
  scoreValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 6,
  },
  scoreBig: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2563EB",
  },
  scoreTotal: {
    fontSize: 18,
    color: "#8E9BAE",
    marginLeft: 6,
  },
  scoreDescEn: {
    fontSize: 11,
    color: "#14213D",
    marginTop: 6,
  },
  scoreDescZh: {
    fontSize: 10,
    color: "#52627A",
    marginTop: 2,
  },
  philosophyBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
    width: "100%",
    textAlign: "center",
  },
  philosophyEn: {
    color: "#1D4ED8",
    fontSize: 9,
    textAlign: "center",
  },
  philosophyZh: {
    color: "#2563EB",
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  cardCol: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DCE4EF",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#14213D",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
    paddingBottom: 4,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  statLabel: {
    color: "#52627A",
    fontSize: 9,
  },
  statValue: {
    fontWeight: "bold",
    color: "#14213D",
    fontSize: 9,
  },
  infoText: {
    fontSize: 9,
    color: "#52627A",
    lineHeight: 1.4,
    marginBottom: 4,
  },
  privacyNotice: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DCE4EF",
    marginBottom: 16,
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#DCE4EF",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#8E9BAE",
    fontSize: 8,
  },
});

interface ResultPdfDocumentProps {
  snapshot: ReportSnapshot;
}

export const ResultPdfDocument: React.FC<ResultPdfDocumentProps> = ({ snapshot }) => {
  const { result, language, bankId, bankVersion, generatedAt, timeZone, reviewStatus } = snapshot;
  const isBilingual = language === "bilingual";
  const isEn = language === "en";
  const isZh = language === "zh-CN";

  const isComplete = result.status === "complete";
  const isDemo = result.status === "demo";

  return (
    <Document title="Rice Purity Test Result" author="Rice Purity Test" creator="Rice Purity App">
      <Page size="A4" style={styles.page}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            {(isBilingual || isEn) && <Text style={styles.titleEn}>Rice Purity Test</Text>}
            {(isBilingual || isZh) && <Text style={styles.titleZh}>纯洁度测试报告</Text>}
          </View>
          <View>
            <Text style={styles.badge}>
              {isDemo
                ? isZh
                  ? "演示版本"
                  : isEn
                    ? "Demo Version"
                    : "Demo / 演示版本"
                : isComplete
                  ? isZh
                    ? "正式结果"
                    : isEn
                      ? "Official Result"
                      : "Official / 正式结果"
                  : isZh
                    ? "未完成"
                    : isEn
                      ? "Incomplete"
                      : "Incomplete / 未完成"}
            </Text>
          </View>
        </View>

        {/* Main Score or Incomplete Card */}
        <View style={styles.mainCard}>
          {(isBilingual || isEn) && <Text style={styles.scoreLabelEn}>Your Rice Purity Score</Text>}
          {(isBilingual || isZh) && <Text style={styles.scoreLabelZh}>你的测试分数</Text>}

          {isComplete ? (
            <View style={styles.scoreValueRow}>
              <Text style={styles.scoreBig}>{result.score}</Text>
              <Text style={styles.scoreTotal}>/ 100</Text>
            </View>
          ) : (
            <View style={styles.scoreValueRow}>
              <Text style={{ ...styles.scoreBig, fontSize: 32 }}>{isDemo ? (isZh ? "演示完成" : "Demo Mode") : isZh ? "未完成" : "Incomplete"}</Text>
            </View>
          )}

          {(isBilingual || isEn) && (
            <Text style={styles.scoreDescEn}>
              You answered "Yes" to {result.counts.yes} of {result.counts.total} items.
            </Text>
          )}
          {(isBilingual || isZh) && (
            <Text style={styles.scoreDescZh}>
              你在 {result.counts.total} 项经历中，有 {result.counts.yes} 项选择了“有”。
            </Text>
          )}

          <View style={styles.philosophyBanner}>
            {(isBilingual || isEn) && <Text style={styles.philosophyEn}>"A higher score means fewer of the listed experiences were selected. Your score is not a judgment of your worth."</Text>}
            {(isBilingual || isZh) && <Text style={styles.philosophyZh}>“分数越高仅表示清单中所选经历越少。分数不代表你的个人价值，也不评价好坏。”</Text>}
          </View>
        </View>

        {/* Two Columns: Stats and Scoring Rule */}
        <View style={styles.grid}>
          {/* Col 1: Answer Summary */}
          <View style={styles.cardCol}>
            <Text style={styles.sectionTitle}>{isBilingual ? "Answer Summary / 答题统计" : isZh ? "答题统计" : "Answer Summary"}</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{isZh ? "有经历 (Yes)" : "Yes"}:</Text>
              <Text style={styles.statValue}>{result.counts.yes}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{isZh ? "无经历 (No)" : "No"}:</Text>
              <Text style={styles.statValue}>{result.counts.no}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{isZh ? "暂时跳过 (Skipped)" : "Skipped"}:</Text>
              <Text style={styles.statValue}>{result.counts.skipped}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{isZh ? "未作答 (Unvisited)" : "Unvisited"}:</Text>
              <Text style={styles.statValue}>{result.counts.unvisited}</Text>
            </View>
            <View style={{ ...styles.statRow, borderTopWidth: 1, borderTopColor: "#F0F4F8", marginTop: 4, paddingTop: 4 }}>
              <Text style={{ ...styles.statLabel, fontWeight: "bold" }}>{isZh ? "有效作答合计" : "Total Answered"}:</Text>
              <Text style={{ ...styles.statValue, color: "#2563EB" }}>
                {result.counts.answered} / {result.counts.total}
              </Text>
            </View>
          </View>

          {/* Col 2: How Scoring Works */}
          <View style={styles.cardCol}>
            <Text style={styles.sectionTitle}>{isBilingual ? "Scoring System / 评分机制" : isZh ? "评分机制" : "Scoring System"}</Text>
            {(isBilingual || isEn) && (
              <Text style={styles.infoText}>The official test starts from 100 points. Each "Yes" lowers the score by 1 point. All 100 items must be answered to produce an official score.</Text>
            )}
            {(isBilingual || isZh) && <Text style={styles.infoText}>正式测试从 100 分开始，每有一项选择“有”则减 1 分。必须全部回答 100 道题目才会生成正式分数。</Text>}
            {isDemo && (
              <Text style={{ ...styles.infoText, color: "#B45309", marginTop: 4 }}>
                {isZh ? "注意：本次使用的是演示题库，分数仅供体验，不构成正式测试报告。" : "Notice: This report was generated with a demo question bank and does not constitute an official score."}
              </Text>
            )}
          </View>
        </View>

        {/* Privacy & Integrity Assurance Notice */}
        <View style={styles.privacyNotice}>
          <Text style={{ fontSize: 9, fontWeight: "bold", color: "#14213D", marginBottom: 2 }}>
            {isBilingual ? "Privacy & Data Integrity / 隐私与本地化声明" : isZh ? "隐私与本地化声明" : "Privacy Notice"}
          </Text>
          <Text style={styles.infoText}>
            {isBilingual
              ? "This report was generated directly within your browser. Individual responses are not included in this document and were never transmitted to any server. / 本报告由您的浏览器本地独立生成。逐题详细答案未包含在本文档中，也绝未上传至任何服务器。"
              : isZh
                ? "本报告由您的浏览器本地独立生成。逐题详细答案未包含在本文档中，也绝未上传至任何服务器。"
                : "This report was generated directly within your browser. Individual responses are excluded from this document and were never transmitted to any server."}
          </Text>
        </View>

        {/* Bottom Footer with Timestamps and Bank Info */}
        <View style={styles.footer}>
          <Text>
            Question Bank: {bankId} ({bankVersion}) • Status: {reviewStatus}
          </Text>
          <Text>
            Generated: {generatedAt} ({timeZone})
          </Text>
        </View>
      </Page>
    </Document>
  );
};
