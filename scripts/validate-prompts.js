const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data", "prompts");
const sitemapPath = path.join(rootDir, "sitemap.xml");
const siteUrl = "https://prompt.learnaiwithcode.com";

const allowedTypes = new Set(["standard-prompt", "workflow-prompt"]);
const allowedCategories = new Set([
  "api",
  "architecture",
  "bug-troubleshooting",
  "cache",
  "database",
  "dev-workflow",
  "java-runtime",
  "messaging",
  "observability",
  "security",
]);

const requiredFields = [
  "slug",
  "type",
  "category",
  "zh.title",
  "zh.description",
  "zh.scenario",
  "zh.prompt",
  "zh.exampleInput",
  "zh.exampleOutput",
  "zh.usage",
  "en.title",
  "en.description",
  "en.scenario",
  "en.prompt",
  "en.exampleInput",
  "en.exampleOutput",
  "en.usage",
];

const workflowRequiredFields = [
  "zh.whatYouGet",
  "zh.doNot",
  "zh.whyControlled",
  "zh.usageFlow",
  "en.whatYouGet",
  "en.doNot",
  "en.whyControlled",
  "en.usageFlow",
];

const workflowRequiredNonEmptyFields = [
  "zh.whatYouGet",
  "zh.doNot",
  "en.whatYouGet",
  "en.doNot",
];

function getValue(record, field) {
  return field.split(".").reduce((value, key) => (value == null ? undefined : value[key]), record);
}

function addError(errors, file, field, reason) {
  errors.push({ file, field, reason });
}

function validateDescription(errors, file, field, value, minLength, maxLength) {
  if (typeof value !== "string" || value.trim() === "") {
    addError(errors, file, field, "description must be non-empty");
    return;
  }

  if (value !== value.trim()) {
    addError(errors, file, field, "description must not have leading or trailing whitespace");
  }
  if (value.includes("\n") || value.includes("\r")) {
    addError(errors, file, field, "description must not contain line breaks");
  }
  if (/^\s*#/.test(value)) {
    addError(errors, file, field, "description must not be a Markdown heading");
  }
  if (value.length < minLength || value.length > maxLength) {
    addError(errors, file, field, `description length must be ${minLength}-${maxLength} characters`);
  }
}

function readPromptFiles(errors) {
  if (!fs.existsSync(dataDir)) {
    addError(errors, "data/prompts", "directory", "data/prompts directory does not exist");
    return [];
  }

  return fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith(".json"))
    .sort();
}

function readRecords(files, errors) {
  const records = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      records.push({
        file,
        record: JSON.parse(fs.readFileSync(filePath, "utf8")),
      });
    } catch (error) {
      addError(errors, file, "json", `invalid JSON: ${error.message}`);
    }
  }

  return records;
}

function validateRecord({ file, record }, errors, slugCounts) {
  for (const field of requiredFields) {
    const value = getValue(record, field);
    if (typeof value !== "string" || value.trim() === "") {
      addError(errors, file, field, "required string field is missing or empty");
    }
  }

  if (typeof record.slug === "string") {
    slugCounts.set(record.slug, (slugCounts.get(record.slug) || 0) + 1);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)) {
      addError(errors, file, "slug", "slug must use lowercase letters, numbers, and single hyphens");
    }
    if (file !== `${record.slug}.json`) {
      addError(errors, file, "slug", "JSON filename must equal {slug}.json");
    }
  }

  if (!allowedTypes.has(record.type)) {
    addError(errors, file, "type", "type must be standard-prompt or workflow-prompt");
  }

  if (!allowedCategories.has(record.category)) {
    addError(errors, file, "category", "category is not in the allowed category list");
  }

  if (record.type === "workflow-prompt") {
    const workflowFile = path.join("data", "prompts", file);

    for (const field of workflowRequiredFields) {
      if (typeof getValue(record, field) !== "string") {
        addError(errors, workflowFile, field, "field must exist for workflow-prompt");
      }
    }

    for (const field of workflowRequiredNonEmptyFields) {
      const value = getValue(record, field);
      if (typeof value !== "string" || value.trim() === "") {
        addError(errors, workflowFile, field, "is required for workflow-prompt");
      }
    }
  }

  validateDescription(errors, file, "zh.description", record.zh && record.zh.description, 20, 120);
  validateDescription(errors, file, "en.description", record.en && record.en.description, 20, 240);
}

function validateGeneratedFiles(records, errors) {
  for (const { file, record } of records) {
    if (!record.slug) continue;

    const zhPage = path.join(rootDir, record.slug, "index.html");
    const enPage = path.join(rootDir, "en", record.slug, "index.html");

    if (!fs.existsSync(zhPage)) {
      addError(errors, file, "generated.zhPage", "missing {slug}/index.html; run node scripts/generate-prompts.js");
    }
    if (!fs.existsSync(enPage)) {
      addError(errors, file, "generated.enPage", "missing en/{slug}/index.html; run node scripts/generate-prompts.js");
    }
  }
}

function readSitemapUrls(errors) {
  if (!fs.existsSync(sitemapPath)) {
    addError(errors, "sitemap.xml", "file", "sitemap.xml is missing; run node scripts/generate-prompts.js");
    return [];
  }

  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function validateSitemap(records, sitemapUrls, errors) {
  const urls = new Set(sitemapUrls);

  for (const { file, record } of records) {
    if (!record.slug) continue;

    const zhUrl = `${siteUrl}/${record.slug}/`;
    const enUrl = `${siteUrl}/en/${record.slug}/`;

    if (!urls.has(zhUrl)) {
      addError(errors, file, "sitemap.zhUrl", `missing sitemap URL: ${zhUrl}; run node scripts/generate-prompts.js`);
    }
    if (!urls.has(enUrl)) {
      addError(errors, file, "sitemap.enUrl", `missing sitemap URL: ${enUrl}; run node scripts/generate-prompts.js`);
    }
  }
}

function summarize(records, sitemapUrls) {
  const typeCounts = {};
  const categoryCounts = {};

  for (const { record } of records) {
    typeCounts[record.type] = (typeCounts[record.type] || 0) + 1;
    categoryCounts[record.category] = (categoryCounts[record.category] || 0) + 1;
  }

  return {
    jsonFiles: records.length,
    standardPrompt: typeCounts["standard-prompt"] || 0,
    workflowPrompt: typeCounts["workflow-prompt"] || 0,
    categoryCounts: Object.fromEntries(Object.entries(categoryCounts).sort(([a], [b]) => a.localeCompare(b))),
    sitemapUrls: sitemapUrls.length,
    status: "passed",
  };
}

function main() {
  const errors = [];
  const files = readPromptFiles(errors);
  const records = readRecords(files, errors);
  const slugCounts = new Map();

  for (const item of records) validateRecord(item, errors, slugCounts);

  for (const [slug, count] of slugCounts) {
    if (count > 1) {
      addError(errors, `${slug}.json`, "slug", "duplicate slug");
    }
  }

  validateGeneratedFiles(records, errors);
  const sitemapUrls = readSitemapUrls(errors);
  validateSitemap(records, sitemapUrls, errors);

  if (errors.length > 0) {
    console.error(JSON.stringify({ status: "failed", errors }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(summarize(records, sitemapUrls), null, 2));
}

main();
