import path from "path";

export const TEMPLATE_DIR = path.join(process.cwd(), "templates");
export const ARTICLES_DIR = path.join(process.cwd(), "articles");
export const MARKDOWN_EXT = ".md";
export const TEMPLATE_ARG_PREFIX = "--template=";
export const OVERWRITE_FLAG = "--overwrite";
