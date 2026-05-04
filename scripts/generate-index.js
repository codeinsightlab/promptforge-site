const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data", "prompts");

const coreSlug = "tech-lead-agent";
const scenarioSlugs = [
  "problem-cause-analysis",
  "api-performance-analysis",
  "slow-sql-optimization",
  "redis-usage-review",
  "api-design-review",
  "distributed-architecture-design",
  "monitoring-alert-design",
];
const methodSlug = "codex-gpt-workflow";

const fallbackCards = {
  "problem-cause-analysis": {
    zh: {
      cardTitle: "线上问题排查",
      cardDescription: "线上异常、接口失败、日志报错或表现不一致时，收敛影响范围、证据链和最可能根因。",
    },
    en: {
      cardTitle: "Online Issue Troubleshooting",
      cardDescription: "Narrow production issues from impact, evidence, logs, API responses, and recent changes.",
    },
  },
  "api-performance-analysis": {
    zh: {
      cardTitle: "性能与稳定性瓶颈分析",
      cardDescription: "接口变慢、超时、P95/P99 抖动或服务连锁异常时，拆解调用链、依赖、资源和配置瓶颈。",
    },
    en: {
      cardTitle: "Performance and Stability Bottleneck Analysis",
      cardDescription: "Break down latency, timeouts, tail spikes, dependencies, resources, and stability risks.",
    },
  },
  "slow-sql-optimization": {
    zh: {
      cardTitle: "SQL 与数据库优化",
      cardDescription: "慢 SQL、索引失效、死锁或表结构不合理时，结合执行计划、事务和数据量判断优化路径。",
    },
    en: {
      cardTitle: "SQL and Database Optimization",
      cardDescription: "Optimize slow SQL, invalid indexes, deadlocks, schema design, transactions, and data-volume risks.",
    },
  },
  "redis-usage-review": {
    zh: {
      cardTitle: "缓存与 Redis 稳定性评审",
      cardDescription: "评审 key、TTL、一致性、热点、大 Key、穿透、击穿和雪崩风险。",
    },
    en: {
      cardTitle: "Cache and Redis Stability Review",
      cardDescription: "Review keys, TTL, consistency, hot keys, big keys, penetration, breakdown, and avalanche risks.",
    },
  },
  "api-design-review": {
    zh: {
      cardTitle: "接口上线前评审",
      cardDescription: "上线前检查接口幂等性、权限、安全、异常处理、兼容性和回归风险。",
    },
    en: {
      cardTitle: "Pre-release API Review",
      cardDescription: "Review idempotency, permissions, security, error handling, compatibility, and regression risks before release.",
    },
  },
  "distributed-architecture-design": {
    zh: {
      cardTitle: "分布式方案评审",
      cardDescription: "评估分布式架构、数据一致性、事务边界、MQ 可靠性和补偿机制。",
    },
    en: {
      cardTitle: "Distributed System Design Review",
      cardDescription: "Review architecture boundaries, consistency, transactions, MQ reliability, compensation, and reconciliation.",
    },
  },
  "monitoring-alert-design": {
    zh: {
      cardTitle: "发布与监控设计",
      cardDescription: "设计灰度发布、回滚策略、监控指标、报警阈值和故障处理动作。",
    },
    en: {
      cardTitle: "Release and Monitoring Design",
      cardDescription: "Design rollout plans, rollback conditions, metrics, alert thresholds, and incident response actions.",
    },
  },
  "tech-lead-agent": {
    zh: {
      cardTitle: "Tech Lead 技术负责人工作流",
      cardDescription: "需求不清、方案不确定、担心过度设计或准备让 Codex 改代码前，先判断边界、风险和最小执行路径。",
    },
    en: {
      cardTitle: "Tech Lead Technical Judgment Workflow",
      cardDescription: "Before coding, changing architecture, or asking Codex to modify files, judge boundaries, risks, and the minimal execution path.",
    },
  },
  "codex-gpt-workflow": {
    zh: {
      cardTitle: "Codex + GPT 协作方式",
      cardDescription: "GPT 先判断边界和风险，需要执行时再生成 Codex 最小任务，最后把执行证据交回 GPT 审查。",
    },
    en: {
      cardTitle: "Codex + GPT Collaboration Method",
      cardDescription: "GPT judges boundaries and risks first, creates a minimal Codex task only when needed, then reviews the returned evidence.",
    },
  },
};

const scenarioCtas = {
  zh: {
    "problem-cause-analysis": "启动排查",
    "api-performance-analysis": "分析瓶颈",
    "slow-sql-optimization": "优化数据库",
    "redis-usage-review": "评审缓存",
    "api-design-review": "评审接口",
    "distributed-architecture-design": "评审方案",
    "monitoring-alert-design": "设计发布",
  },
  en: {
    "problem-cause-analysis": "Start troubleshooting",
    "api-performance-analysis": "Analyze bottlenecks",
    "slow-sql-optimization": "Optimize database",
    "redis-usage-review": "Review cache",
    "api-design-review": "Review API",
    "distributed-architecture-design": "Review design",
    "monitoring-alert-design": "Design release",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readPrompts() {
  const records = new Map();
  for (const file of fs.readdirSync(dataDir).filter((name) => name.endsWith(".json"))) {
    const record = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
    records.set(record.slug, record);
  }
  return records;
}

function getCard(record, slug, lang) {
  const fallback = fallbackCards[slug]?.[lang] ?? {};
  const content = record?.[lang] ?? {};
  return {
    title: content.cardTitle || fallback.cardTitle || content.title || slug,
    description: content.cardDescription || fallback.cardDescription || content.description || "",
  };
}

function hrefFor(slug, isEnglish) {
  return isEnglish ? `/en/${slug}/` : `/${slug}/`;
}

function renderScenarioCards(records, lang) {
  const isEnglish = lang === "en";
  return scenarioSlugs
    .map((slug) => {
      const record = records.get(slug);
      if (!record) return "";
      const card = getCard(record, slug, lang);
      return `        <a class="scenario-card" href="${escapeHtml(hrefFor(slug, isEnglish))}">
          <strong>${escapeHtml(card.title)}</strong>
          <span>${escapeHtml(card.description)}</span>
          <em>${escapeHtml(scenarioCtas[lang][slug])} &rarr;</em>
        </a>`;
    })
    .filter(Boolean)
    .join("\n");
}

function renderPage(records, lang) {
  const isEnglish = lang === "en";
  const labels = isEnglish
    ? {
        htmlLang: "en",
        title: "PromptForge - Developer AI Workflow Entry",
        meta: "PromptForge keeps a small set of GPT + Codex workflows for technical judgment, troubleshooting, optimization, review, release, and AI-assisted development.",
        nav: '<a href="/">中文</a>',
        navLabel: "Language switch",
        heroTitle: "Developer AI Workflow Entry",
        heroSubtitle: "Start with Tech Lead judgment, then move into troubleshooting, optimization, review, or release workflows.",
        heroDescription: "PromptForge is no longer a prompt directory. It keeps a small set of GPT + Codex workflows for real engineering work.",
        coreTitle: "Core Workflow",
        coreDescription: "Most real engineering tasks should start with technical judgment: clarify scope, risks, complexity, and whether Codex should execute anything.",
        coreLabel: "CORE WORKFLOW",
        coreTitleOverride: "Tech Lead Technical Judgment Workflow",
        coreDescriptionOverride: "Before coding, changing architecture, or asking Codex to modify files, use this workflow to judge boundaries, risks, and the minimal execution path.",
        bestForLabel: "Best for:",
        bestFor: "Solution review · Complexity control · Codex task framing · Result review",
        coreCta: "Enter Tech Lead",
        scenarioTitle: "Common Engineering Scenarios",
        scenarioDescription: "When the problem type is already clear, enter the matching workflow directly.",
        methodTitle: "Codex + GPT Collaboration Method",
        methodDescription: "All workflows follow the same pattern: GPT judges boundaries and risks first, creates a minimal Codex task only when execution is needed, then reviews the returned evidence.",
        methodCta: "View collaboration method",
        footerNote: "Legacy narrow prompts have been merged into the main workflows. Start from a high-level workflow, then decide whether to move into a more specific investigation, optimization, or review path based on evidence.",
      }
    : {
        htmlLang: "zh-CN",
        title: "PromptForge - 开发者 AI 工作流入口",
        meta: "PromptForge 是开发者 AI 工作流入口，围绕 Tech Lead 技术判断、线上排查、性能优化、接口评审、发布监控和 GPT + Codex 协作组织真实工程任务。",
        nav: '<a href="/en/">English</a>',
        navLabel: "语言切换",
        heroTitle: "开发者 AI 工作流入口",
        heroSubtitle: "先用 Tech Lead 判断方向，再按具体场景进入排查、优化、评审或发布工作流。",
        heroDescription: "PromptForge 不再做 Prompt 大全，只保留少量适合真实工程场景的 GPT + Codex 协作工作流。",
        coreTitle: "核心工作流",
        coreDescription: "大多数真实开发任务，先从技术负责人工作流开始：判断需求边界、方案风险和是否需要 Codex 执行。",
        coreLabel: "CORE WORKFLOW",
        coreTitleOverride: "Tech Lead 技术负责人工作流",
        coreDescriptionOverride: "需求不清、方案不确定、担心过度设计或准备让 Codex 改代码前，先用它判断边界、风险和最小执行路径。",
        bestForLabel: "适合：",
        bestFor: "方案评估 · 复杂度控制 · Codex 任务拆分 · 结果审查",
        coreCta: "进入 Tech Lead",
        scenarioTitle: "常用开发场景",
        scenarioDescription: "当问题类型已经比较明确时，直接进入对应场景工作流。",
        methodTitle: "Codex + GPT 协作方式",
        methodDescription: "所有工作流都遵循：GPT 先判断边界和风险，需要执行时再生成 Codex 最小任务，最后把执行证据交回 GPT 审查。",
        methodCta: "查看协作方式",
        footerNote: "旧的细分 Prompt 已收口到主工作流中。先从高层工作流进入，再根据证据决定是否切换到更具体的排查、优化或评审步骤。",
      };

  const coreRecord = records.get(coreSlug);
  const methodRecord = records.get(methodSlug);
  const coreCard = getCard(coreRecord, coreSlug, lang);
  const methodCard = getCard(methodRecord, methodSlug, lang);
  const scenarioCards = renderScenarioCards(records, lang);

  return `<!DOCTYPE html>
<html lang="${labels.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(labels.title)}</title>
  <meta name="description" content="${escapeHtml(labels.meta)}">
  <link rel="icon" type="image/png" href="/favicon.png">

  <style>
    :root {
      color-scheme: light;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --muted: #475569;
      --subtle: #64748b;
      --border: #e2e8f0;
      --accent: #2563eb;
      --accent-soft: #dbeafe;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      line-height: 1.6;
    }
    a { color: inherit; }
    .page {
      max-width: 1040px;
      margin: 0 auto;
      padding: 28px 20px 48px;
    }
    .top-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 72px;
    }
    .brand {
      color: var(--text);
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0;
      text-decoration: none;
    }
    .language-link,
    .language-link a {
      color: var(--accent);
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
    }
    .hero {
      max-width: 820px;
      margin-bottom: 64px;
    }
    h1 {
      margin: 0 0 16px;
      font-size: 48px;
      line-height: 1.12;
      font-weight: 750;
      letter-spacing: 0;
    }
    .hero-subtitle {
      margin: 0 0 14px;
      color: var(--muted);
      font-size: 20px;
      line-height: 1.7;
    }
    .hero-description {
      max-width: 720px;
      margin: 0;
      color: var(--subtle);
      font-size: 15px;
      line-height: 1.8;
    }
    .section {
      margin-top: 58px;
    }
    .section:first-of-type {
      margin-top: 0;
    }
    .section-header {
      max-width: 760px;
      margin-bottom: 18px;
    }
    h2 {
      margin: 0 0 8px;
      font-size: 22px;
      line-height: 1.3;
      font-weight: 720;
      letter-spacing: 0;
    }
    .section-description {
      margin: 0;
      color: var(--subtle);
      font-size: 15px;
      line-height: 1.8;
    }
    .core-card {
      display: block;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      background: var(--surface);
      padding: 28px;
      color: inherit;
      text-decoration: none;
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
    }
    .core-card:hover {
      border-color: var(--accent);
      box-shadow: 0 18px 42px rgba(15, 23, 42, 0.1);
    }
    .core-label {
      display: inline-flex;
      align-items: center;
      margin-bottom: 16px;
      border: 1px solid var(--accent-soft);
      border-radius: 999px;
      background: #eff6ff;
      color: var(--accent);
      padding: 4px 9px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .core-title {
      display: block;
      margin-bottom: 10px;
      font-size: 25px;
      line-height: 1.35;
      font-weight: 760;
    }
    .core-description {
      display: block;
      max-width: 780px;
      color: var(--muted);
      font-size: 16px;
      line-height: 1.8;
    }
    .core-meta {
      display: block;
      margin-top: 18px;
      color: var(--subtle);
      font-size: 14px;
      line-height: 1.7;
    }
    .core-cta,
    .scenario-card em,
    .method-link {
      display: inline-flex;
      margin-top: 20px;
      color: var(--accent);
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      text-decoration: none;
    }
    .scenario-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .scenario-card {
      min-height: 190px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface);
      padding: 18px;
      color: inherit;
      text-decoration: none;
    }
    .scenario-card:hover {
      border-color: #93c5fd;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.07);
    }
    .scenario-card strong {
      display: block;
      margin-bottom: 10px;
      font-size: 16px;
      line-height: 1.45;
    }
    .scenario-card span {
      display: block;
      color: var(--subtle);
      font-size: 14px;
      line-height: 1.75;
    }
    .method-note {
      display: flex;
      justify-content: space-between;
      gap: 32px;
      align-items: center;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: #f1f5f9;
      padding: 22px 24px;
    }
    .method-note h2 {
      font-size: 19px;
    }
    .method-note p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.75;
    }
    .method-copy {
      max-width: 720px;
    }
    .method-link {
      flex: 0 0 auto;
      margin-top: 0;
      white-space: nowrap;
    }
    .footer-note {
      border-top: 1px solid var(--border);
      margin-top: 44px;
      padding-top: 20px;
      color: var(--subtle);
      font-size: 14px;
      line-height: 1.8;
    }
    @media (max-width: 860px) {
      .scenario-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .method-note { align-items: flex-start; flex-direction: column; gap: 12px; }
    }
    @media (max-width: 620px) {
      .page { padding: 22px 16px 40px; }
      .top-nav { margin-bottom: 48px; }
      .hero { margin-bottom: 46px; }
      h1 { font-size: 34px; }
      .hero-subtitle { font-size: 18px; }
      .core-card { padding: 22px; }
      .core-title { font-size: 22px; }
      .scenario-grid { grid-template-columns: 1fr; }
      .scenario-card { min-height: auto; }
      .method-link { white-space: normal; }
    }
  </style>
</head>

<body>
  <main class="page">
    <nav class="top-nav" aria-label="${escapeHtml(labels.navLabel)}">
      <a class="brand" href="${isEnglish ? "/en/" : "/"}">PromptForge</a>
      <span class="language-link">${labels.nav}</span>
    </nav>

    <section class="hero">
      <h1>${escapeHtml(labels.heroTitle)}</h1>
      <p class="hero-subtitle">${escapeHtml(labels.heroSubtitle)}</p>
      <p class="hero-description">${escapeHtml(labels.heroDescription)}</p>
    </section>

    <section class="section" aria-labelledby="core-workflow-title">
      <div class="section-header">
        <h2 id="core-workflow-title">${escapeHtml(labels.coreTitle)}</h2>
        <p class="section-description">${escapeHtml(labels.coreDescription)}</p>
      </div>
      <a class="core-card" href="${escapeHtml(hrefFor(coreSlug, isEnglish))}">
        <span class="core-label">${escapeHtml(labels.coreLabel)}</span>
        <strong class="core-title">${escapeHtml(labels.coreTitleOverride || coreCard.title)}</strong>
        <span class="core-description">${escapeHtml(labels.coreDescriptionOverride || coreCard.description)}</span>
        <span class="core-meta"><strong>${escapeHtml(labels.bestForLabel)}</strong> ${escapeHtml(labels.bestFor)}</span>
        <span class="core-cta">${escapeHtml(labels.coreCta)} &rarr;</span>
      </a>
    </section>

    <section class="section" aria-labelledby="scenario-workflows-title">
      <div class="section-header">
        <h2 id="scenario-workflows-title">${escapeHtml(labels.scenarioTitle)}</h2>
        <p class="section-description">${escapeHtml(labels.scenarioDescription)}</p>
      </div>
      <div class="scenario-grid">
${scenarioCards}
      </div>
    </section>

    <section class="section method-note" aria-labelledby="method-note-title">
      <div class="method-copy">
        <h2 id="method-note-title">${escapeHtml(labels.methodTitle || methodCard.title)}</h2>
        <p>${escapeHtml(labels.methodDescription || methodCard.description)}</p>
      </div>
      <a class="method-link" href="${escapeHtml(hrefFor(methodSlug, isEnglish))}">${escapeHtml(labels.methodCta)} &rarr;</a>
    </section>

    <p class="footer-note">${escapeHtml(labels.footerNote)}</p>
  </main>
</body>
</html>
`;
}

const records = readPrompts();
fs.writeFileSync(path.join(rootDir, "index.html"), renderPage(records, "zh"), "utf8");
fs.mkdirSync(path.join(rootDir, "en"), { recursive: true });
fs.writeFileSync(path.join(rootDir, "en", "index.html"), renderPage(records, "en"), "utf8");
console.log(`Generated home pages with core=${coreSlug}, scenarios=${scenarioSlugs.length}, method=${methodSlug}.`);
