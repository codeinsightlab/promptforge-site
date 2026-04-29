const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const outputFile = path.join(rootDir, "index.html");

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, "");
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function extractTag(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? normalizeText(stripTags(match[1])) : "";
}

function extractScene(html) {
  const sectionMatch = html.match(/<section[^>]*>\s*<h2[^>]*>\s*场景\s*<\/h2>([\s\S]*?)<\/section>/i);
  if (!sectionMatch) {
    return "";
  }

  return normalizeText(stripTags(sectionMatch[1]));
}

function getPromptPages() {
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => {
      const slug = entry.name;
      const filePath = path.join(rootDir, slug, "index.html");

      if (!fs.existsSync(filePath)) {
        return null;
      }

      const html = fs.readFileSync(filePath, "utf8");
      const h1 = extractTag(html, "h1");
      const title = extractTag(html, "title");
      const scene = extractScene(html);

      return {
        slug,
        title: h1 || title || slug,
        scene,
        href: `${slug}/index.html`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function renderIndex(pages) {
  const items = pages
    .map((page) => `      <li class="prompt-item">
        <a href="${escapeHtml(page.href)}">${escapeHtml(page.title)}</a>
        <p>${escapeHtml(page.scene)}</p>
      </li>`)
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PromptForge</title>

  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      margin: 0;
      background: #ffffff;
      color: #0f172a;
    }

    .container {
      max-width: 720px;
      margin: 48px auto;
      padding: 0 16px;
    }

    h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
      line-height: 1.7;
    }

    section {
      margin-top: 32px;
    }

    .prompt-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .prompt-item {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #f9fafb;
      padding: 16px;
      margin-top: 12px;
    }

    .prompt-item a {
      color: #0f172a;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
    }

    .prompt-item a:hover {
      text-decoration: underline;
    }

    .prompt-item p {
      margin-top: 8px;
    }
  </style>
</head>

<body>

<div class="container">

  <h1>PromptForge</h1>
  <p>开发者常用 Prompt 工具页</p>

  <section>
    <h2>Prompt 页面列表</h2>
    <ul class="prompt-list">
${items}
    </ul>
  </section>

</div>

</body>
</html>
`;
}

const pages = getPromptPages();
fs.writeFileSync(outputFile, renderIndex(pages), "utf8");
console.log(`Generated index.html with ${pages.length} prompt pages.`);
