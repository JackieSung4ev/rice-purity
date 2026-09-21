# Rice Purity Test (纯洁度测试)

[English](README.md) | [简体中文](README.zh-CN.md)

> 一个现代、响应式、纯前端、中英双语的 Rice Purity Test 网站。每次只显示一道题，浏览器本地计分并导出纯净 PDF 报告。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-5.2-646cff.svg)

---

## 核心特性

- **现代蓝白视觉**：克制的圆角与阴影、深色正文与清晰留白，以大号分数为视觉中心，无假浏览器边框。
- **单题作答流**：每次只展示一道题目，支持键盘方向键快捷操作（`←` Yes，`→` No，`↑` 上一题，`↓` 跳过/下一题，亦兼容 Y/N/1/2/S），具备 200ms 防误触同步题目 ID 切换保护锁。
- **扩展配图准备**：题目类型已内置可选的 `imageUrl?: string` 属性，为后续每道题目加入独立插画与视觉素材提供原生支持。
- **快捷导航侧栏**：支持快速跳转到具体题号，具备展开详情模式与收起精简模式（带圆角的纯数字方框瓦片，去除 `#` 噪点，舒展的行间距与充足的底部留白）。
- **实体键帽快捷键提示**：卡片选项与底部快捷键栏均采用拟物级 3D 键帽徽章（`KeyBadge`）和清晰的高对比度分类配色。
- **严格计分契约**：
  - 正式 100 题完整作答后：`score = 100 - Yes 数量`。
  - 0 分与 100 分均为有效分数；跳过不等于 No；未完整作答不生成正式分数（`score = null`）。
  - 分数不与任何道德、品格评价挂钩，不设虚构排行榜或人格雷达图。
- **中英双语自适应**：
  - 自动识别用户浏览器系统语言，支持手动切换：`中文`、`English`、`双语 Bilingual`。
  - 切换语言不重置答题进度与答案。
- **本地 PDF 导出**：
  - 基于 `@react-pdf/renderer` 在浏览器本地按需生成，不阻塞首屏加载。
  - 导出目标为 A4 1 页摘要（包含分数、统计数量、规则说明、时间戳与时区）。
  - **绝不导出逐题明细**，即使在网页中已展开回答，导出的 PDF 与打印输出仍严格剔除敏感题。
  - 实际验证中文字体（Noto Sans SC / SimHei），无黑方块与排版乱码。
- **隐私与安全**：
  - 答案 100% 本地运算，不上传服务器，不进入 URL/Query/Hash，不使用长期答案存储。
  - 会话保存在 `sessionStorage`（`rpt:session:v1`），失败时优雅降级至内存。
  - 重新测试仅清空本应用自身键，不影响同域其他数据。
  - 零后端、零数据库、零外部追踪、零广告脚本。
- **自适应响应式**：
  - 完美适配 27 寸大屏（1920px 宽屏流体排版）、14 寸笔记本（紧凑首屏）、手机移动端（360px/390px 触控友好）。

---

## 仓库题库状态与交付说明

根据用户确认与交付验收：

1. **第 69 题确认与入库**：
   - 英文原题：`Have you ever done a 69?`
   - 中文翻译：`曾进行过69式（互相口交）？`
   - 已同步至根目录 `rice.txt` 及 `docs/rice-purity-handoff/rice.txt`。
2. **正式 100 题题库**：
   - 题库模块：`src/content/official100Questions.ts`
   - 审核状态：`reviewStatus: 'approved'`
   - 系统已默认挂载正式 100 题题库，完整回答后可直接生成正式的 0 ~ 100 分纯洁度得分。
3. **演示题库保留**：
   - 保留 `src/content/demoQuestions.ts`（10 题轻量测试集，`reviewStatus: 'draft'`），便于在测试与展示阶段秒级跑通全流程。

---

## 快速开始

### 依赖环境

- Node.js >= 18.0.0 (推荐 Node 20+)
- npm >= 9.0.0

### 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务
npm run dev

# 3. 运行单元测试（覆盖 D01 - D10 计分规则）
npm run test

# 4. 类型检查与生产构建
npm run build

# 5. 预览静态生产构建产物
npm run preview
```

---

## 验收清单验证结果

| 类别     | 编号 | 检查项                          | 实际验证结果                          |
| -------- | ---- | ------------------------------- | ------------------------------------- |
| **计分** | D01  | 正式 100 题全部 No 得 100 分    | 通过（Vitest 单测）                   |
| **计分** | D02  | 正式 100 题全部 Yes 得 0 分     | 通过（Vitest 单测，0分有效）          |
| **计分** | D03  | 28 Yes + 72 No 得 72 分         | 通过（Vitest 单测）                   |
| **计分** | D04  | Yes 改为 No 分数变动            | 通过（Vitest 单测，分数+1）           |
| **计分** | D05  | 28 Yes + 71 No + 1 跳过         | 通过（score 为 null，未完成）         |
| **计分** | D07  | 未访问项与跳过区分              | 通过（unvisited 与 skipped 独立统计） |
| **计分** | D08  | 非法或损坏会话校验拦截          | 通过（validateSession 拦截）          |
| **计分** | D10  | 演示题库不冒充正式分数          | 通过（status 为 demo，score 为 null） |
| **交互** | I01  | 每次只显示一道题                | 通过（Puppeteer 桌面与手机验证）      |
| **交互** | I02  | 连击与双击防误触                | 通过（200ms 同步题目 ID 切换保护锁）  |
| **交互** | I07  | 回答明细默认折叠                | 通过（默认隐藏敏感答案，点击展开）    |
| **交互** | I08  | 从结果页单题编辑修改            | 通过（支持修改、取消与保存返回）      |
| **PDF**  | P01  | 中文、英文、双语 PDF 导出       | 通过（本地编译，A4 1 页摘要）         |
| **PDF**  | P02  | PDF 中文及标点渲染              | 通过（实际加载 Noto Sans SC，无乱码） |
| **PDF**  | P03  | 展开明细后仍不泄露答案          | 通过（PDF 结构完全排除逐题回答）      |
| **隐私** | S01  | 无答案外传，无长期存储          | 通过（纯前端，无后端及第三方脚本）    |
| **视觉** | V01  | 桌面 1920px / 手机 390px 自适应 | 通过（流体排版，无横向溢出，清晰醒目）|

---

## 目录组织

```text
Rice/
├── docs/rice-purity-handoff/       # 归档交接文档与参考图片
│   ├── Rice_Purity_Test_Codex_Handoff_v1.0.md
│   ├── rice.txt
│   └── references/
│       ├── home-ui.png
│       └── result-ui.png
├── public/
│   ├── favicon.svg
│   └── fonts/                      # 本地静态托管中文字体（Noto Sans SC / SimHei）
├── src/
│   ├── app/
│   │   ├── App.tsx                 # 根组件、布局与打印摘要
│   │   └── router.tsx              # 路由表
│   ├── components/
│   │   ├── Navbar.tsx              # 顶部导航与语言切换
│   │   ├── Footer.tsx              # 页脚与隐私声明
│   │   ├── ConfirmDialog.tsx       # 确认弹窗
│   │   └── QuestionNavSidebar.tsx  # 侧边题目导航（展开/收起）
│   ├── content/
│   │   ├── official100Questions.ts # 正式 100 题题库（reviewStatus: approved，默认挂载）
│   │   ├── demoQuestions.ts        # 10 题演示题库（reviewStatus: draft）
│   │   └── draft100Questions.ts    # 100 题草案（reviewStatus: draft）
│   ├── features/quiz/
│   │   ├── types.ts                # 核心数据契约
│   │   ├── scoring.ts              # 纯函数计分
│   │   ├── validation.ts           # 题库与会话安全校验
│   │   ├── storage.ts              # sessionStorage 安全存取与降级
│   │   ├── quizContext.tsx         # 状态机与过渡锁
│   │   └── __tests__/scoring.test.ts # D01-D10 单元测试
│   ├── i18n/
│   │   ├── messages.ts             # 中英文字典
│   │   └── LanguageContext.tsx     # 浏览器语言识别与切换
│   ├── pages/
│   │   ├── HomePage.tsx            # 首页与 FAQ
│   │   ├── TestPage.tsx            # 单题作答、收尾检查与编辑
│   │   ├── ResultPage.tsx          # 结果页与答案折叠
│   │   ├── PrivacyPage.tsx         # 隐私声明与数据清除
│   │   └── NotFoundPage.tsx        # 404 页
│   ├── pdf/
│   │   ├── ResultPdfDocument.tsx   # PDF 页面组件
│   │   └── exportPdf.ts            # 按需加载与下载控制器
│   └── styles/
│       ├── tokens.css              # 蓝白设计变量
│       └── main.css                # 全局样式与打印样式
├── scripts/                        # 验证与截图工具脚本
├── package.json
└── tsconfig.json
```
