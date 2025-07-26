import grayMatter from 'gray-matter';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export async function convertMdToHtml(raw: string) {
  const { content, data } = grayMatter(raw);

  const file = await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(content);

  return {
    content: String(file),
    frontmatter: data as { date: string; description: string; title: string },
  };
}
