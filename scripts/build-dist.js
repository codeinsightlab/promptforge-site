const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const rootFiles = ["index.html", "favicon.png", "sitemap.xml"];
const excludedDirs = new Set([".git", "data", "dist", "en", "node_modules", "scripts"]);
const promptDataDir = path.join(rootDir, "data", "prompts");

function copyFile(relativePath) {
  const source = path.join(rootDir, relativePath);
  const target = path.join(distDir, relativePath);

  if (!fs.existsSync(source)) return false;

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return true;
}

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function getPublicPromptSlugs() {
  return fs
    .readdirSync(promptDataDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(promptDataDir, file), "utf8")))
    .filter((record) => record.status === "keep")
    .map((record) => record.slug)
    .filter((slug) => fs.existsSync(path.join(rootDir, slug, "index.html")))
    .sort();
}

function main() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  const copiedRootFiles = rootFiles.filter(copyFile);

  copyFile(path.join("en", "index.html"));

  const pageDirs = getPublicPromptSlugs();
  for (const dir of pageDirs) {
    copyDirectory(path.join(rootDir, dir), path.join(distDir, dir));
    copyDirectory(path.join(rootDir, "en", dir), path.join(distDir, "en", dir));
  }

  console.log(
    JSON.stringify(
      {
        output: "dist",
        rootFiles: copiedRootFiles,
        copiedEnglishHome: true,
        promptPageDirectories: pageDirs.length,
        archivedPromptPageDirectories: fs
          .readdirSync(promptDataDir)
          .filter((file) => file.endsWith(".json"))
          .map((file) => JSON.parse(fs.readFileSync(path.join(promptDataDir, file), "utf8")))
          .filter((record) => record.status === "review").length,
        excludedDirectories: Array.from(excludedDirs).sort(),
      },
      null,
      2,
    ),
  );
}

main();
