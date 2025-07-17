import fs from "fs";
import path from "path";
import inquirer from "inquirer";

async function main() {
  const args = process.argv.slice(2);
  const templateArg = args.find((arg) => arg.startsWith("--template="));
  const overwriteArg = args.find((arg) => arg === "--overwrite");

  if (!templateArg) {
    console.error("❌ --template={テンプレート名}を指定してください。");
    process.exit(1);
  }

  const templateName = templateArg.split("=")[1];
  const templatePath = path.join(__dirname, "templates", `${templateName}.md`);

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ テンプレート ${templateName} が見つかりません。`);
    process.exit(1);
  }

  const articleDir = path.join(__dirname, "articles");
  const fileNames = await fs.promises.readdir(articleDir);
  const filesWithTime = await Promise.all(
    fileNames
      .filter((file) => file.endsWith(".md"))
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

  const sortedFileByLatest = filesWithTime
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    .map((entry) => entry.file);

  const { selectedFile } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedFile",
      message: "テンプレートを適用する記事を選んでください：",
      choices: sortedFileByLatest,
    },
  ]);

  const targetPath = path.join(articleDir, selectedFile);

  const originalContent = await fs.promises.readFile(targetPath, "utf-8");
  const templateContent = await fs.promises.readFile(templatePath, "utf-8");

  const newContent = overwriteArg
    ? templateContent
    : `${originalContent}\n${templateContent}`;

  await fs.promises.writeFile(targetPath, newContent);

  console.log(
    `✅ テンプレート ${templateName} を ${selectedFile} に適用しました！`
  );
}

main();
