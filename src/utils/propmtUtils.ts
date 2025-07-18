import inquirer from "inquirer";

export const getTemplateName = async (templateNames: string[]) => {
  const namesWithoutExt = templateNames.map((name) =>
    name.replace(/\.md$/, "")
  );
  const { selectedTemplate } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTemplate",
      message: "適用するテンプレートを選んでください：",
      choices: namesWithoutExt,
    },
  ]);

  return selectedTemplate;
};

export const getArticleFile = async (articles: string[]) => {
  const { selectedFile } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedFile",
      message: "テンプレートを適用する記事を選んでください：",
      choices: articles,
    },
  ]);

  return selectedFile;
};
