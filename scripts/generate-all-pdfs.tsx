import fs from "fs";
import path from "path";
import React from "react";
import { renderToFile, Font } from "@react-pdf/renderer";
import { ResultPdfDocument } from "../src/pdf/ResultPdfDocument";
import { ReportSnapshot } from "../src/features/quiz/types";

// Register font for Node environment
const fontPath = path.resolve("public/fonts/NotoSansSC-Regular.ttf");
Font.register({
  family: "ChineseFont",
  fonts: [{ src: fontPath, fontWeight: "normal" }],
});
Font.registerHyphenationCallback((word) => [word]);

const OUT_DIR = path.resolve("public/reports");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function generateSamplePdfs() {
  console.log("Generating sample PDFs in Chinese, English and Bilingual...");

  const baseSnapshot: ReportSnapshot = {
    bankId: "rice-100-official",
    bankVersion: "1.0.0",
    reviewStatus: "approved",
    answersRevision: 1,
    result: {
      status: "complete",
      score: 72,
      counts: {
        total: 100,
        yes: 28,
        no: 72,
        skipped: 0,
        unvisited: 0,
        answered: 100,
      },
    },
    language: "bilingual",
    generatedAt: new Date().toISOString(),
    timeZone: "Asia/Shanghai",
  };

  // 1. Bilingual PDF
  const bilingualSnap: ReportSnapshot = { ...baseSnapshot, language: "bilingual" };
  const bilingualFile = path.join(OUT_DIR, "rice-purity-result-bilingual.pdf");
  await renderToFile(React.createElement(ResultPdfDocument, { snapshot: bilingualSnap } as any), bilingualFile);
  console.log("✓ Generated:", bilingualFile, "Size:", fs.statSync(bilingualFile).size, "bytes");

  // 2. Chinese PDF
  const zhSnap: ReportSnapshot = { ...baseSnapshot, language: "zh-CN" };
  const zhFile = path.join(OUT_DIR, "rice-purity-result-zh-CN.pdf");
  await renderToFile(React.createElement(ResultPdfDocument, { snapshot: zhSnap } as any), zhFile);
  console.log("✓ Generated:", zhFile, "Size:", fs.statSync(zhFile).size, "bytes");

  // 3. English PDF
  const enSnap: ReportSnapshot = { ...baseSnapshot, language: "en" };
  const enFile = path.join(OUT_DIR, "rice-purity-result-en.pdf");
  await renderToFile(React.createElement(ResultPdfDocument, { snapshot: enSnap } as any), enFile);
  console.log("✓ Generated:", enFile, "Size:", fs.statSync(enFile).size, "bytes");

  console.log("ALL PDFS GENERATED SUCCESSFULLY!");
}

generateSamplePdfs().catch((err) => {
  console.error("PDF generation error:", err);
  process.exit(1);
});
