const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const rootFiles = ["index.html", "favicon.png", "sitemap.xml"];
const excludedDirs = new Set([".git", "data", "dist", "en", "node_modules", "scripts"]);

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

function getRootPageDirs() {
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !excludedDirs.has(name))
    .filter((name) => fs.existsSync(path.join(rootDir, name, "index.html")))
    .sort();
}

function main() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  const copiedRootFiles = rootFiles.filter(copyFile);

  copyDirectory(path.join(rootDir, "en"), path.join(distDir, "en"));

  const pageDirs = getRootPageDirs();
  for (const dir of pageDirs) {
    copyDirectory(path.join(rootDir, dir), path.join(distDir, dir));
  }

  console.log(
    JSON.stringify(
      {
        output: "dist",
        rootFiles: copiedRootFiles,
        copiedEnglishDirectory: true,
        promptPageDirectories: pageDirs.length,
        excludedDirectories: Array.from(excludedDirs).sort(),
      },
      null,
      2,
    ),
  );
}

main();
