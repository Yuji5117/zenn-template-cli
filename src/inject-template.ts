#!/usr/bin/env node

import fs from "fs";
import path from "path";
import {
  ARTICLES_DIR,
  MARKDOWN_EXT,
  OVERWRITE_FLAG,
  TEMPLATE_ARG_PREFIX,
  TEMPLATE_DIR,
} from "./constants";
import { getArticleFile, getTemplateName } from "./utils/propmtUtils";

async function main() {
  const args = process.argv.slice(2);
  const templateArg = args.find((arg) => arg.startsWith(TEMPLATE_ARG_PREFIX));
  const isOverwrite = args.includes(OVERWRITE_FLAG);

  const templateNames = await fs.promises.readdir(TEMPLATE_DIR);

  const templateName = templateArg
    ? templateArg.split("=")[1]
    : await getTemplateName(templateNames);
  const templatePath = path.join(TEMPLATE_DIR, `${templateName}.md`);

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ テンプレート ${templateName} が見つかりません。`);
    process.exit(1);
  }

  const articleDir = ARTICLES_DIR;
  const fileNames = await fs.promises.readdir(articleDir);
  const filesWithTime = await Promise.all(
    fileNames
      .filter((file) => file.endsWith(MARKDOWN_EXT))
      .map(async (file) => {
        const fullPath = path.join(articleDir, file);
        const stat = await fs.promises.stat(fullPath);

        return {
          file,
          mtime: stat.mtime,
        };
      })
  );

  if (filesWithTime.length === 0) {
    console.error(`❌ 記事が1件も見つかりません。`);
    process.exit(1);
  }

  const sortedFilesByLatest = filesWithTime
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    .map((entry) => entry.file);

  const selectedArticle = await getArticleFile(sortedFilesByLatest);

  const targetPath = path.join(articleDir, selectedArticle);

  const originalContent = await fs.promises.readFile(targetPath, "utf-8");
  const templateContent = await fs.promises.readFile(templatePath, "utf-8");

  const newContent = isOverwrite
    ? templateContent
    : `${originalContent}\n${templateContent}`;

  await fs.promises.writeFile(targetPath, newContent);

  console.log(
    `✅ テンプレート ${templateName} を ${selectedArticle} に適用しました！`
  );
}

main();
