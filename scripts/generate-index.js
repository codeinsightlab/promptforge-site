const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data", "prompts");
const homepagePath = path.join(rootDir, "data", "homepage.json");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readPrompts() {
  const records = new Map();
  for (const file of fs.readdirSync(dataDir).filter((name) => name.endsWith(".json"))) {
    const record = readJson(path.join(dataDir, file));
    records.set(record.slug, record);
  }
  return records;
}

function contentFor(block, lang) {
  return block?.[lang] || {};
}

function hrefFor(slug, isEnglish) {
  return isEnglish ? `/en/${slug}/` : `/${slug}/`;
}

function validationStatusFor(status, lang) {
  const labels = {
    zh: {
      verified: "已验证",
      in_use: "使用中",
      unverified: "待验证",
    },
    en: {
      verified: "Verified",
      in_use: "In Use",
      unverified: "Unverified",
    },
  };

  return labels[lang]?.[status] || labels[lang]?.unverified || status;
}

function cardFor(item, record, lang) {
  const promptContent = contentFor(record, lang);
  const itemContent = contentFor(item, lang);
  return {
    title: itemContent.title || promptContent.cardTitle || promptContent.title || record.slug,
    description: itemContent.description || promptContent.cardDescription || promptContent.description || "",
    tags: Array.isArray(itemContent.tags)
      ? itemContent.tags.slice(0, 3)
      : Array.isArray(promptContent.tags)
        ? promptContent.tags.slice(0, 3)
        : [],
    cta: itemContent.cta,
    validationStatus: record.validationStatus,
    validationLabel: validationStatusFor(record.validationStatus, lang),
  };
}

function resolveItem(item, records, lang, sectionContent) {
  const record = records.get(item.slug);
  if (!record) {
    throw new Error(`Homepage item slug does not exist in data/prompts: ${item.slug}`);
  }

  const card = cardFor(item, record, lang);
  return {
    slug: item.slug,
    href: hrefFor(item.slug, lang === "en"),
    title: card.title,
    description: card.description,
    tags: card.tags,
    cta: card.cta || sectionContent.defaultCta || (lang === "en" ? "Open prompt" : "打开 Prompt"),
    validationStatus: card.validationStatus,
    validationLabel: card.validationLabel,
  };
}

function renderCard(item) {
  const tags = item.tags.length
    ? `          <div class="card-tags">
${item.tags.map((tag) => `            <span>${escapeHtml(tag)}</span>`).join("\n")}
          </div>`
    : "";

  return `        <a class="prompt-card" href="${escapeHtml(item.href)}">
          <span class="validation-badge validation-${escapeHtml(item.validationStatus)}">${escapeHtml(item.validationLabel)}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.description)}</p>
${tags}
          <em>${escapeHtml(item.cta)} &rarr;</em>
        </a>`;
}

function renderSection(section, records, lang) {
  const sectionContent = contentFor(section, lang);
  const rawItems = Array.isArray(section.items) ? section.items : [];

  if (rawItems.length === 0 && section.hideWhenEmpty === true) return "";

  const items = rawItems.map((item) => resolveItem(item, records, lang, sectionContent));
  if (items.length === 0) return "";

  return `    <section class="section" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-title">
      <div class="section-header">
        <h2 id="${escapeHtml(section.id)}-title">${escapeHtml(sectionContent.title || section.id)}</h2>
        <p class="section-description">${escapeHtml(sectionContent.description || "")}</p>
      </div>
      <div class="prompt-grid">
${items.map(renderCard).join("\n")}
      </div>
    </section>`;
}

function renderFeatured(featured, records, lang) {
  if (!featured) return "";
  const featuredContent = contentFor(featured, lang);
  const items = Array.isArray(featured.items) ? featured.items : [];
  if (items.length === 0) return "";

  const resolved = items.map((item) => resolveItem(item, records, lang, featuredContent));
  return `    <section class="section featured-section" id="${escapeHtml(featured.id || "featured")}" aria-labelledby="${escapeHtml(featured.id || "featured")}-title">
      <div class="section-header">
        <h2 id="${escapeHtml(featured.id || "featured")}-title">${escapeHtml(featuredContent.title || "Featured")}</h2>
        <p class="section-description">${escapeHtml(featuredContent.description || "")}</p>
      </div>
      <div class="featured-grid">
${resolved.map(renderCard).join("\n")}
      </div>
    </section>`;
}

function renderSections(homepage, records, lang) {
  return [
    renderFeatured(homepage.featured, records, lang),
    ...homepage.sections.map((section) => renderSection(section, records, lang)),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function renderValidationNote(homepage, lang) {
  const note = contentFor(homepage.validationNote, lang);
  if (typeof note.text !== "string" || note.text.trim() === "") return "";

  return `    <section class="validation-note" aria-label="${escapeHtml(note.label || (lang === "en" ? "Validation status" : "验证状态"))}">
      <p>${escapeHtml(note.text)}</p>
    </section>`;
}

function pageLabels(lang) {
  return lang === "en"
    ? {
        htmlLang: "en",
        title: "PromptForge - Ready-to-use AI prompt workflows",
        nav: '<a href="/">Chinese</a>',
        navLabel: "Language switch",
      }
    : {
        htmlLang: "zh-CN",
        title: "PromptForge - 开箱即用的 AI Prompt 工作流库",
        nav: '<a href="/en/">EN</a>',
        navLabel: "语言切换",
      };
}

function renderPage(homepage, records, lang) {
  const isEnglish = lang === "en";
  const hero = contentFor(homepage.hero, lang);
  const labels = pageLabels(lang);
  const sections = renderSections(homepage, records, lang);
  const validationNote = renderValidationNote(homepage, lang);

  return `<!DOCTYPE html>
<html lang="${labels.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(labels.title)}</title>
  <meta name="description" content="${escapeHtml(hero.meta || hero.subtitle || "")}">
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
      max-width: 1080px;
      margin: 0 auto;
      padding: 28px 20px 52px;
    }
    .top-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 68px;
    }
    .brand {
      color: var(--text);
      font-size: 15px;
      font-weight: 740;
      letter-spacing: 0;
      text-decoration: none;
    }
    .language-link,
    .language-link a {
      color: var(--accent);
      font-size: 14px;
      font-weight: 620;
      text-decoration: none;
    }
    .hero {
      max-width: 820px;
      margin-bottom: 56px;
    }
    .hero-brand {
      margin: 0 0 10px;
      color: var(--accent);
      font-size: 14px;
      font-weight: 760;
    }
    h1 {
      margin: 0 0 16px;
      font-size: 50px;
      line-height: 1.1;
      font-weight: 780;
      letter-spacing: 0;
    }
    .hero-subtitle {
      max-width: 780px;
      margin: 0;
      color: var(--muted);
      font-size: 19px;
      line-height: 1.75;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 24px;
    }
    .hero-button {
      display: inline-flex;
      align-items: center;
      min-height: 40px;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 14px;
      color: var(--text);
      background: var(--surface);
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
    }
    .validation-note {
      margin: -28px 0 46px;
      max-width: 820px;
      border-left: 3px solid var(--accent);
      padding-left: 14px;
    }
    .validation-note p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.75;
    }
    .hero-button.primary {
      border-color: var(--accent);
      background: var(--accent);
      color: #ffffff;
    }
    .section {
      margin-top: 50px;
    }
    .section:first-of-type {
      margin-top: 0;
    }
    .section-header {
      max-width: 760px;
      margin-bottom: 16px;
    }
    h2 {
      margin: 0 0 7px;
      font-size: 22px;
      line-height: 1.3;
      font-weight: 740;
      letter-spacing: 0;
    }
    .section-description {
      margin: 0;
      color: var(--subtle);
      font-size: 14px;
      line-height: 1.75;
    }
    .prompt-grid,
    .featured-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .featured-grid {
      grid-template-columns: minmax(0, 1fr);
    }
    .prompt-card {
      min-height: 164px;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface);
      padding: 16px;
      color: inherit;
      text-decoration: none;
    }
    .featured-section .prompt-card {
      min-height: 0;
      border-color: #bfdbfe;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
    }
    .prompt-card:hover {
      border-color: #93c5fd;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
    }
    .prompt-card strong {
      display: block;
      margin: 8px 0;
      font-size: 16px;
      line-height: 1.4;
    }
    .validation-badge {
      align-self: flex-start;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: #f8fafc;
      color: var(--muted);
      padding: 2px 7px;
      font-size: 12px;
      line-height: 1.45;
      font-weight: 680;
    }
    .validation-verified {
      border-color: #bbf7d0;
      background: #f0fdf4;
      color: #166534;
    }
    .validation-in_use {
      border-color: #bfdbfe;
      background: #eff6ff;
      color: #1d4ed8;
    }
    .validation-unverified {
      border-color: #fed7aa;
      background: #fff7ed;
      color: #9a3412;
    }
    .prompt-card p {
      margin: 0;
      color: var(--subtle);
      font-size: 14px;
      line-height: 1.65;
    }
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 12px;
    }
    .card-tags span {
      border: 1px solid var(--border);
      border-radius: 999px;
      background: #f8fafc;
      color: var(--muted);
      padding: 2px 7px;
      font-size: 12px;
      line-height: 1.5;
    }
    .prompt-card em {
      display: inline-flex;
      margin-top: auto;
      padding-top: 16px;
      color: var(--accent);
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      text-decoration: none;
    }
    @media (max-width: 860px) {
      .prompt-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 620px) {
      .page { padding: 22px 16px 42px; }
      .top-nav { margin-bottom: 44px; }
      .hero { margin-bottom: 42px; }
      .validation-note { margin: -18px 0 36px; }
      h1 { font-size: 34px; }
      .hero-subtitle { font-size: 17px; }
      .prompt-grid,
      .featured-grid { grid-template-columns: 1fr; }
      .prompt-card { min-height: auto; }
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
      <h1>${escapeHtml(hero.title)}</h1>
      <p class="hero-subtitle">${escapeHtml(hero.subtitle)}</p>
      <div class="hero-actions">
        <a class="hero-button primary" href="${escapeHtml(hero.primaryHref || "#technical-collaboration")}">${escapeHtml(hero.primaryCta || (isEnglish ? "Browse workflows" : "查看工作流"))}</a>
        <a class="hero-button" href="${escapeHtml(hero.secondaryHref || "#ai-collaboration")}">${escapeHtml(hero.secondaryCta || (isEnglish ? "View collaboration methods" : "查看协作方法"))}</a>
      </div>
    </section>

${validationNote}

${sections}
  </main>
</body>
</html>
`;
}

const homepage = readJson(homepagePath);
const records = readPrompts();
fs.writeFileSync(path.join(rootDir, "index.html"), renderPage(homepage, records, "zh"), "utf8");
fs.mkdirSync(path.join(rootDir, "en"), { recursive: true });
fs.writeFileSync(path.join(rootDir, "en", "index.html"), renderPage(homepage, records, "en"), "utf8");
console.log(`Generated home pages with sections=${homepage.sections.length}.`);
