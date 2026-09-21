import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("screenshots");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log("Launching browser at:", CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    page.on("pageerror", (err) => console.error("PAGE ERROR:", err));

    // 1. Desktop Viewport (1920x1080 Full HD / 27" scale)
    console.log("1. Testing Desktop 1920x1080...");
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

    // 1.1 Home Page
    await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-home.png"), fullPage: false });
    console.log("✓ Captured desktop-home.png");

    // 1.2 Click Start Test -> Navigate to /test
    console.log("Navigating to test...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const startBtn = btns.find((b) => b.textContent?.includes("Start Test") || b.textContent?.includes("开始测试"));
      startBtn?.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-test.png"), fullPage: false });
    console.log("✓ Captured desktop-test.png (expanded 1920px)");

    // 1.2.1 Click Collapse -> Mini Numbers Rail mode
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const collapseBtn = btns.find((b) => b.textContent?.includes("收起") || b.title?.includes("收起") || b.textContent?.includes("Collapse"));
      collapseBtn?.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-test-mini.png"), fullPage: false });
    console.log("✓ Captured desktop-test-mini.png (mini numbers rail)");

    // Expand back
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const expandBtn = btns.find((b) => b.title?.includes("Expand") || b.title?.includes("展开"));
      expandBtn?.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // 1.3 Answer all 10 demo questions
    console.log("Answering 10 demo questions...");
    for (let i = 0; i < 10; i++) {
      await page.evaluate((idx) => {
        const btns = Array.from(document.querySelectorAll("button"));
        if (idx < 3) {
          const yesBtn = btns.find((b) => b.textContent?.includes("Yes") || b.textContent?.includes("有"));
          yesBtn?.click();
        } else {
          const noBtn = btns.find((b) => b.textContent?.includes("No") || b.textContent?.includes("没有"));
          noBtn?.click();
        }
      }, i);
      await new Promise((r) => setTimeout(r, 450));
    }

    // 1.4 Result Page
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-result.png"), fullPage: false });
    console.log("✓ Captured desktop-result.png");

    // 1.5 Click View Answers to expand disclosure
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const viewBtn = btns.find((b) => b.textContent?.includes("View Answers") || b.textContent?.includes("查看答案"));
      viewBtn?.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUT_DIR, "desktop-result-expanded.png"), fullPage: false });
    console.log("✓ Captured desktop-result-expanded.png");

    // 2. Mobile Viewport (390x844 - iPhone)
    console.log("2. Testing Mobile 390x844...");
    const mobilePage = await browser.newPage();
    mobilePage.on("console", (msg) => console.log("MOBILE LOG:", msg.text()));
    mobilePage.on("pageerror", (err) => console.error("MOBILE ERROR:", err));
    await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

    // 2.1 Mobile Home
    await mobilePage.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
    await mobilePage.screenshot({ path: path.join(OUT_DIR, "mobile-home.png"), fullPage: false });
    console.log("✓ Captured mobile-home.png");

    // 2.2 Mobile Test Page
    await mobilePage.goto("http://localhost:4173/test", { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 800));
    await mobilePage.screenshot({ path: path.join(OUT_DIR, "mobile-test.png"), fullPage: false });
    console.log("✓ Captured mobile-test.png");

    // 2.3 Mobile Result Page (load simulated 72 score for visual validation)
    await mobilePage.goto("http://localhost:4173/result", { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 800));
    await mobilePage.screenshot({ path: path.join(OUT_DIR, "mobile-result.png"), fullPage: false });
    console.log("✓ Captured mobile-result.png");

    console.log("ALL SCREENSHOTS CAPTURED SUCCESSFULLY!");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Screenshot runner error:", err);
  process.exit(1);
});
