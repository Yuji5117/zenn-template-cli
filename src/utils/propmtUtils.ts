import inquirer from "inquirer";

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
