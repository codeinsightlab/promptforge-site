const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data", "prompts");

const featuredSlugs = [
  "problem-cause-analysis",
  "api-performance-analysis",
  "slow-sql-optimization",
  "redis-usage-review",
  "api-design-review",
  "distributed-architecture-design",
  "monitoring-alert-design",
  "tech-lead-agent",
  "codex-gpt-workflow",
];

const fallbackCards = {
  "slow-sql-optimization": {
    zh: {
      cardTitle: "SQL 与数据库优化",
      cardDescription: "围绕 SQL、EXPLAIN、索引、表结构和数据量判断最小优化路径。",
    },
    en: {
      cardTitle: "SQL and Database Optimization",
      cardDescription: "Use SQL, EXPLAIN, indexes, schema, and data volume to choose the smallest optimization path.",
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
      cardDescription: "评审服务边界、数据归属、调用链路、一致性、可用性和演进风险。",
    },
    en: {
      cardTitle: "Distributed System Design Review",
      cardDescription: "Review service boundaries, data ownership, call paths, consistency, availability, and evolution risks.",
    },
  },
  "monitoring-alert-design": {
    zh: {
      cardTitle: "发布与监控设计",
      cardDescription: "围绕发布节奏、观测指标、告警阈值、异常升级和回滚条件设计上线保护。",
    },
    en: {
      cardTitle: "Release and Monitoring Design",
      cardDescription: "Design rollout protection through metrics, alert thresholds, escalation paths, and rollback conditions.",
    },
  },
  "tech-lead-agent": {
    zh: {
      cardTitle: "Tech Lead 技术判断",
      cardDescription: "判断方案是否合理、是否过度设计，以及是否存在数据、状态或并发风险。",
    },
    en: {
      cardTitle: "Tech Lead Agent",
      cardDescription: "Evaluate whether a solution is reasonable, over-engineered, or risky for data, state, or concurrency.",
    },
  },
  "codex-gpt-workflow": {
    zh: {
      cardTitle: "Codex + GPT 开发协作流",
      cardDescription: "冻结需求边界，生成 Codex 执行任务，再把执行证据交回 GPT 审查。",
    },
    en: {
      cardTitle: "Codex + GPT Development Workflow",
      cardDescription: "Freeze scope, generate a Codex execution task, and return evidence to GPT for review.",
    },
  },
};

const cta = {
  zh: [
    "启动排查",
    "分析瓶颈",
    "优化查询",
    "评审缓存",
    "评审接口",
    "评审方案",
    "设计保护",
    "做技术判断",
    "组织协作",
  ],
  en: [
    "Start troubleshooting",
    "Analyze bottlenecks",
    "Optimize SQL",
    "Review cache",
    "Review API",
    "Review design",
    "Design safeguards",
    "Make a decision",
    "Coordinate work",
  ],
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

function renderPage(records, lang) {
  const isEnglish = lang === "en";
  const labels = isEnglish
    ? {
        htmlLang: "en",
        title: "PromptForge - AI Workflows for Developers",
        meta: "PromptForge offers a focused set of GPT + Codex workflows for troubleshooting production issues, reviewing APIs, analyzing bottlenecks, and coordinating AI-assisted development.",
        nav: '<a href="/">Chinese</a>',
        h1: "AI Workflows for Developers",
        subtitle: "PromptForge is no longer a prompt directory. It keeps a focused set of GPT + Codex workflows for real engineering work.",
        h2: "Featured Workflows",
        desc: "Choose the closest entry point, let GPT narrow facts, risks, and next actions, then create a minimal Codex task only when code inspection is needed.",
        note: "Older narrow troubleshooting entries have been merged into broader workflows. Start from a high-level workflow, then switch to a more specific database, cache, architecture, or release page only when evidence points there.",
      }
    : {
        htmlLang: "zh-CN",
        title: "PromptForge - 开发者 AI 工作流",
        meta: "PromptForge 提供少量高质量 GPT + Codex 开发工作流入口，帮助开发者排查线上问题、评审接口、分析性能瓶颈并组织 AI 协作。",
        nav: '<a href="/en/">English</a>',
        h1: "开发者 AI 工作流入口",
        subtitle: "PromptForge 不再做 Prompt 大全，只保留少量适合真实工程场景的 GPT + Codex 协作工作流。",
        h2: "精选工作流",
        desc: "先选最接近的问题入口，让 GPT 收敛事实、风险和下一步动作；需要查代码时，再生成可交给 Codex 的最小任务。",
        note: "旧的细分排查入口已收口到主工作流中。先从高层工作流进入，再根据证据决定是否切换到更具体的数据库、缓存、架构或发布类页面。",
      };

  const cards = featuredSlugs
    .map((slug, index) => {
      const record = records.get(slug);
      if (!record) return "";
      const card = getCard(record, slug, lang);
      const href = isEnglish ? `/en/${slug}/` : `/${slug}/`;
      return `        <a class="workflow-card" href="${escapeHtml(href)}">
          <strong>${escapeHtml(card.title)}</strong>
          <span>${escapeHtml(card.description)}</span>
          <em>${escapeHtml(cta[lang][index])}</em>
        </a>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="${labels.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(labels.title)}</title>
  <meta name="description" content="${escapeHtml(labels.meta)}">
  <link rel="icon" type="image/png" href="/favicon.png">

  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; margin: 0; background: #ffffff; color: #0f172a; }
    .container { max-width: 960px; margin: 48px auto; padding: 0 18px 56px; }
    .language-entry, .top-link { display: flex; justify-content: flex-end; gap: 16px; margin-bottom: 28px; }
    .language-entry a, .top-link a { color: #2563eb; font-size: 14px; text-decoration: none; }
    .hero { max-width: 780px; margin-bottom: 36px; }
    h1 { font-size: 40px; line-height: 1.15; margin: 0 0 12px; font-weight: 700; }
    .subtitle { font-size: 18px; color: #334155; line-height: 1.7; margin: 0; }
    h2 { font-size: 20px; margin: 0 0 10px; }
    .section-desc { color: #64748b; font-size: 14px; line-height: 1.7; margin: 0 0 18px; }
    .workflow-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .workflow-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-decoration: none; color: inherit; background: #ffffff; min-height: 138px; display: flex; flex-direction: column; justify-content: space-between; }
    .workflow-card:hover { border-color: #2563eb; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); }
    .workflow-card strong { display: block; font-size: 16px; line-height: 1.4; margin-bottom: 8px; }
    .workflow-card span { display: block; color: #64748b; font-size: 14px; line-height: 1.65; }
    .workflow-card em { color: #2563eb; font-size: 13px; font-style: normal; margin-top: 12px; }
    .note { border-top: 1px solid #e5e7eb; margin-top: 34px; padding-top: 20px; color: #64748b; font-size: 14px; line-height: 1.7; }
    @media (max-width: 860px) { .workflow-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 620px) { .container { margin: 34px auto; } h1 { font-size: 32px; } .workflow-grid { grid-template-columns: 1fr; } }
  </style>
</head>

<body>
  <main class="container">
    <nav class="${isEnglish ? "top-link" : "language-entry"}" aria-label="${isEnglish ? "Language switch" : "语言切换"}">
      ${labels.nav}
    </nav>

    <section class="hero">
      <h1>${escapeHtml(labels.h1)}</h1>
      <p class="subtitle">${escapeHtml(labels.subtitle)}</p>
    </section>

    <section>
      <h2>${escapeHtml(labels.h2)}</h2>
      <p class="section-desc">${escapeHtml(labels.desc)}</p>
      <div class="workflow-grid">
${cards}
      </div>
    </section>

    <p class="note">${escapeHtml(labels.note)}</p>
  </main>
</body>
</html>
`;
}

const records = readPrompts();
fs.writeFileSync(path.join(rootDir, "index.html"), renderPage(records, "zh"), "utf8");
fs.mkdirSync(path.join(rootDir, "en"), { recursive: true });
fs.writeFileSync(path.join(rootDir, "en", "index.html"), renderPage(records, "en"), "utf8");
console.log(`Generated focused home pages with ${featuredSlugs.length} workflow entries.`);
