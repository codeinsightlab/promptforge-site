const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const outDir = path.join(rootDir, "data", "prompts");

const fieldHeadings = {
  zh: {
    scenario: ["场景"],
    prompt: ["角色 Prompt", "核心 Prompt", "核心 Prompt（GPT + Codex）"],
    exampleInput: ["你接下来可以这样输入", "下一条消息示例", "示例输入"],
    exampleOutput: ["GPT 会这样输出", "输出效果预览", "示例输出"],
    usage: ["使用说明", "使用流程"],
  },
  en: {
    scenario: ["Scenario"],
    prompt: ["Role Prompt", "Core Prompt", "Core Prompt (GPT + Codex)"],
    exampleInput: ["What to provide next", "Example Input"],
    exampleOutput: ["Expected output preview", "Example Output"],
    usage: ["Usage notes", "Usage", "Usage Flow"],
  },
};

const categoryBySlug = {
  "api-design-review": "api",
  "api-performance-analysis": "api",
  "api-security-design": "security",
  "cache-breakdown-avalanche-analysis": "cache",
  "cache-design": "cache",
  "codex-gpt-workflow": "dev-workflow",
  "concurrency-problem-analysis": "java-runtime",
  "data-consistency-design": "architecture",
  "database-table-design": "database",
  "deadlock-troubleshooting": "database",
  "distributed-architecture-design": "architecture",
  "distributed-transaction-solution": "architecture",
  "gateway-rate-limit-design": "api",
  "gc-problem-analysis": "java-runtime",
  "gray-release-plan": "architecture",
  "index-failure-analysis": "database",
  "jvm-parameter-tuning": "java-runtime",
  "logging-standard-design": "observability",
  "monitoring-alert-design": "observability",
  "mq-duplicate-consumption-handling": "messaging",
  "mq-message-loss-troubleshooting": "messaging",
  "permission-model-design": "security",
  "problem-cause-analysis": "bug-troubleshooting",
  "redis-bigkey-analysis": "cache",
  "redis-usage-review": "cache",
  "slow-sql-optimization": "database",
  "tech-lead-agent": "dev-workflow",
  "thread-pool-configuration-optimization": "java-runtime",
};

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, "")).trim();
}

function normalizeWhitespace(value) {
  return value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function getTitle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1[1]);

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? stripTags(title[1]) : "";
}

function getDescription(html) {
  const meta = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  if (meta) return decodeHtml(meta[1]).trim();

  const subtitle = html.match(/<p\s+class=["']subtitle["'][^>]*>([\s\S]*?)<\/p>/i);
  return subtitle ? stripTags(subtitle[1]) : "";
}

function getSections(html) {
  const sections = [];
  const sectionRegex = /<section[^>]*>\s*<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)<\/section>/gi;
  let match;

  while ((match = sectionRegex.exec(html))) {
    const heading = stripTags(match[1]);
    const body = match[2];
    const code = body.match(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/i);
    const paragraph = body.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const raw = code ? code[1] : paragraph ? paragraph[1] : body;

    sections.push({
      heading,
      text: normalizeWhitespace(code ? decodeHtml(raw) : stripTags(raw)),
    });
  }

  return sections;
}

function getSectionText(sections, headings) {
  for (const heading of headings) {
    const section = sections.find((item) => item.heading.toLowerCase() === heading.toLowerCase());
    if (section) return section.text;
  }

  return "";
}

function extractPage(filePath, lang) {
  if (!fs.existsSync(filePath)) {
    return emptyLang();
  }

  const html = fs.readFileSync(filePath, "utf8");
  const sections = getSections(html);
  const headings = fieldHeadings[lang];

  return {
    title: getTitle(html),
    description: getDescription(html),
    scenario: getSectionText(sections, headings.scenario),
    prompt: getSectionText(sections, headings.prompt),
    exampleInput: getSectionText(sections, headings.exampleInput),
    exampleOutput: getSectionText(sections, headings.exampleOutput),
    usage: getSectionText(sections, headings.usage),
  };
}

function emptyLang() {
  return {
    title: "",
    description: "",
    scenario: "",
    prompt: "",
    exampleInput: "",
    exampleOutput: "",
    usage: "",
  };
}

function getPromptSlugs() {
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !["data", "en", "scripts", "node_modules", ".git"].includes(name))
    .filter((name) => fs.existsSync(path.join(rootDir, name, "index.html")))
    .sort();
}

function getEmptyFields(record) {
  const missing = [];

  for (const lang of ["zh", "en"]) {
    for (const field of Object.keys(record[lang])) {
      if (!record[lang][field]) missing.push(`${lang}.${field}`);
    }
  }

  if (!record.category) missing.push("category");
  return missing;
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const slugs = getPromptSlugs();
  const stats = {
    total: slugs.length,
    matchedBilingual: 0,
    missingEnglish: [],
    emptyFields: {},
    files: [],
  };

  for (const slug of slugs) {
    const zhPath = path.join(rootDir, slug, "index.html");
    const enPath = path.join(rootDir, "en", slug, "index.html");
    const hasEnglish = fs.existsSync(enPath);

    if (hasEnglish) stats.matchedBilingual += 1;
    else stats.missingEnglish.push(slug);

    const record = {
      slug,
      category: categoryBySlug[slug] || "",
      zh: extractPage(zhPath, "zh"),
      en: hasEnglish ? extractPage(enPath, "en") : emptyLang(),
    };

    const outPath = path.join(outDir, `${slug}.json`);
    fs.writeFileSync(outPath, `${JSON.stringify(record, null, 2)}\n`);

    stats.files.push(path.relative(rootDir, outPath));
    const missing = getEmptyFields(record);
    if (missing.length > 0) stats.emptyFields[slug] = missing;
  }

  console.log(JSON.stringify(stats, null, 2));
}

main();
