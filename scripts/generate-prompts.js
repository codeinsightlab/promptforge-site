const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data", "prompts");
const siteUrl = "https://prompt.learnaiwithcode.com";

const promptHeadingOverrides = {
  "codex-gpt-workflow": {
    zh: {
      heading: "核心 Prompt（GPT + Codex）",
      copyLabel: "复制核心 Prompt",
    },
    en: {
      heading: "Core Prompt (GPT + Codex)",
      copyLabel: "Copy Core Prompt",
    },
  },
  "tech-lead-agent": {
    zh: {
      heading: "核心 Prompt",
      copyLabel: "复制核心 Prompt",
    },
    en: {
      heading: "Core Prompt",
      copyLabel: "Copy Core Prompt",
    },
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function promptHeading(slug, lang) {
  const override = promptHeadingOverrides[slug]?.[lang];
  if (override) return override;

  return lang === "zh"
    ? { heading: "角色 Prompt", copyLabel: "复制角色 Prompt" }
    : { heading: "Role Prompt", copyLabel: "Copy Role Prompt" };
}

function pageLabels(lang) {
  return lang === "zh"
    ? {
        scenario: "场景",
        exampleInput: "你接下来可以这样输入",
        exampleOutput: "GPT 会这样输出",
        usage: "使用说明",
        copied: "已复制",
      }
    : {
        scenario: "Scenario",
        exampleInput: "What to provide next",
        exampleOutput: "Expected output preview",
        usage: "Usage notes",
        copied: "Copied",
      };
}

function css(includeNav) {
  return `  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; margin: 0; background: #ffffff; color: #0f172a; }
    .container { max-width: 720px; margin: 48px auto; padding: 0 16px; }
${includeNav ? "    .nav { margin-bottom: 24px; }\n    .nav a { color: #2563eb; font-size: 14px; text-decoration: none; }\n" : ""}    h1 { font-size: 28px; font-weight: 600; margin-bottom: 8px; }
    h2 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
    p { font-size: 14px; color: #6b7280; margin: 0; line-height: 1.7; }
    .subtitle { color: #334155; margin-top: 4px; }
    section { margin-top: 32px; }
    .block { position: relative; border: 1px solid #e5e7eb; border-radius: 10px; background: #f9fafb; padding: 16px; }
    pre { margin: 0; font-size: 13px; line-height: 1.6; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; }
    code { font-family: inherit; }
    .action-bar { position: absolute; right: 12px; top: 10px; opacity: 0; transition: opacity 0.15s ease; }
    .block:hover .action-bar { opacity: 1; }
    .copy-action { font-size: 12px; color: #6b7280; cursor: pointer; padding: 2px 6px; border-radius: 6px; }
    .copy-action:hover { background: #f3f4f6; color: #111827; }
  </style>`;
}

function codeBlock(text) {
  return `<div class="block"><pre><code>${escapeHtml(text)}</code></pre></div>`;
}

function script(copiedText) {
  return `<script>
function copyPrompt(el) {
  const block = el.closest(".block");
  const text = block.querySelector("pre").innerText;
  const originalText = el.innerText;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
  el.innerText = "${escapeHtml(copiedText)}";
  setTimeout(() => { el.innerText = originalText; }, 1200);
}
</script>`;
}

function renderPage(record, lang) {
  const content = record[lang];
  const labels = pageLabels(lang);
  const prompt = promptHeading(record.slug, lang);
  const isEnglish = lang === "en";
  const htmlLang = isEnglish ? ' lang="en"' : "";
  const descriptionMeta = content.description
    ? `\n  <meta name="description" content="${escapeHtml(content.description)}">`
    : "";
  const subtitle = content.description && record.slug === "tech-lead-agent"
    ? `\n  <p class="subtitle">${escapeHtml(content.description)}</p>`
    : "";
  const nav = isEnglish ? '\n  <div class="nav"><a href="/en/">Back to English home</a></div>' : "";

  return `<!DOCTYPE html>
<html${htmlLang}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(content.title)}</title>${descriptionMeta}
  <link rel="icon" type="image/png" href="/favicon.png">
${css(isEnglish)}
</head>
<body>
<div class="container">${nav}
  <h1>${escapeHtml(content.title)}</h1>${subtitle}

  <section>
    <h2>${labels.scenario}</h2>
    <p>${escapeHtml(content.scenario)}</p>
  </section>

  <section>
    <h2>${escapeHtml(prompt.heading)}</h2>
    <div class="block">
      <div class="action-bar"><span class="copy-action" onclick="copyPrompt(this)">${escapeHtml(prompt.copyLabel)}</span></div>
      <pre><code id="${escapeHtml(record.slug)}-prompt">${escapeHtml(content.prompt)}</code></pre>
    </div>
  </section>

  <section>
    <h2>${labels.exampleInput}</h2>
    ${codeBlock(content.exampleInput)}
  </section>

  <section>
    <h2>${labels.exampleOutput}</h2>
    ${codeBlock(content.exampleOutput)}
  </section>

  <section>
    <h2>${labels.usage}</h2>
    ${codeBlock(content.usage)}
  </section>
</div>
${script(labels.copied)}
</body>
</html>
`;
}

function readPrompts() {
  return fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8")));
}

function writePrompt(record) {
  const zhDir = path.join(rootDir, record.slug);
  const enDir = path.join(rootDir, "en", record.slug);

  fs.mkdirSync(zhDir, { recursive: true });
  fs.mkdirSync(enDir, { recursive: true });

  fs.writeFileSync(path.join(zhDir, "index.html"), renderPage(record, "zh"));
  fs.writeFileSync(path.join(enDir, "index.html"), renderPage(record, "en"));
}

function renderSitemap(records) {
  const slugs = records.map((record) => record.slug).sort();
  const urls = [
    `${siteUrl}/`,
    `${siteUrl}/en/`,
    ...slugs.map((slug) => `${siteUrl}/${slug}/`),
    ...slugs.map((slug) => `${siteUrl}/en/${slug}/`),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeHtml(url)}</loc>
  </url>`).join("\n")}
</urlset>
`;
}

function writeSitemap(records) {
  fs.writeFileSync(path.join(rootDir, "sitemap.xml"), renderSitemap(records));
}

function main() {
  const records = readPrompts();
  const generated = [];
  const skipped = [];

  for (const record of records) {
    if (record.type === "workflow-prompt") {
      skipped.push(record.slug);
      continue;
    }

    if (record.type !== "standard-prompt") {
      throw new Error(`Unsupported prompt type for ${record.slug}: ${record.type}`);
    }

    writePrompt(record);
    generated.push(record.slug);
  }

  writeSitemap(records);

  console.log(
    JSON.stringify(
      {
        prompts: records.length,
        generatedStandardPrompt: generated.length,
        zhPages: generated.length,
        enPages: generated.length,
        skippedWorkflowPrompt: skipped,
        sitemapUrls: 2 + records.length * 2,
      },
      null,
      2,
    ),
  );
}

main();
