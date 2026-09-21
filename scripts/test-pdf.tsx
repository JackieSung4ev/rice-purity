import fs from "fs";
import path from "path";
import React from "react";
import { renderToFile, Font, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const fontPath = path.resolve("public/fonts/NotoSansSC-Regular.ttf");
console.log("Using font at:", fontPath, "Exists:", fs.existsSync(fontPath));

Font.register({
  family: "ChineseFont",
  fonts: [{ src: fontPath, fontWeight: "normal" }],
});
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "ChineseFont", fontSize: 12, backgroundColor: "#F6F8FC" },
  title: { fontSize: 20, color: "#2563EB", marginBottom: 10, fontWeight: "bold" },
  text: { fontSize: 12, color: "#14213D", marginBottom: 6 },
  card: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 10, borderWidth: 1, borderColor: "#DCE4EF" },
});

const MyDoc = () => (
  <Document title="Test Chinese PDF">
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Rice Purity Test | 纯洁度测试报告</Text>
      <View style={styles.card}>
        <Text style={styles.text}>你的测试得分：72 / 100</Text>
        <Text style={styles.text}>在 100 项经历中，你选择了 28 项“有”，72 项“没有”。</Text>
        <Text style={styles.text}>分数不代表个人价值，也不评价好坏。</Text>
        <Text style={styles.text}>中文与标点测试：逗号，句号。顿号、问号？感叹号！“双引号” ‘单引号’</Text>
      </View>
    </Page>
  </Document>
);

async function run() {
  const outPath = path.resolve("public/test-output.pdf");
  console.log("Rendering PDF to:", outPath);
  await renderToFile(<MyDoc />, outPath);
  console.log("Rendered successfully! File size:", fs.statSync(outPath).size, "bytes");
}

run().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
