import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Article, AGENT_NAMES, AGENT_SECTIONS, ARTICLE_IMAGES } from './types';

const NEWSROOM_PATH = '/root/.openclaw/workspace/newsroom-swarm';

export function getSectionFromAgent(agentDir: string): string {
  return AGENT_SECTIONS[agentDir] || 'News';
}

export function getAgentName(agentDir: string): string {
  return AGENT_NAMES[agentDir] || AGENT_NAMES.unknown;
}

export function getArticleImage(slug: string): string | undefined {
  const images = ARTICLE_IMAGES[slug];
  return images ? `/images/${images[0]}` : undefined;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function extractDeck(content: string): string | undefined {
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('*') && line.endsWith('*') && 
        !line.includes('By the') && 
        !line.includes('By GITSHIP') &&
        line.length > 10) {
      return line.replace(/\*/g, '').trim();
    }
  }
  return undefined;
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax
  let text = content
    .replace(/#+\s+/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1');
  
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 50);
  if (paragraphs.length === 0) return '';
  
  let excerpt = paragraphs[0].replace(/\n/g, ' ').trim();
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }
  return excerpt;
}

export async function getAllArticles(): Promise<Article[]> {
  const articles: Article[] = [];
  
  const agentDirs = fs.readdirSync(NEWSROOM_PATH)
    .filter(d => {
      const fullPath = path.join(NEWSROOM_PATH, d);
      return fs.statSync(fullPath).isDirectory() && 
             (d.endsWith('-agent') || d.endsWith('-desk'));
    });
  
  for (const agentDir of agentDirs) {
    const outputPath = path.join(NEWSROOM_PATH, agentDir, '04-final-outputs');
    if (!fs.existsSync(outputPath)) continue;
    
    const files = fs.readdirSync(outputPath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(outputPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter if exists, otherwise parse content
      const { data, content } = matter(fileContent);
      
      // Extract title from first H1
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
      
      const slug = slugify(title);
      const htmlContent = await markdownToHtml(content);
      
      articles.push({
        slug,
        title,
        deck: extractDeck(content),
        excerpt: data.excerpt || extractExcerpt(content),
        content: htmlContent,
        date: data.date || new Date().toISOString(),
        agent: getAgentName(agentDir),
        agentDir,
        section: getSectionFromAgent(agentDir),
        issueNumber: 0, // Will be assigned after sorting
        image: getArticleImage(slug),
      });
    }
  }
  
  // Sort by date and assign issue numbers
  articles.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  articles.forEach((article, index) => {
    article.issueNumber = index + 1;
  });
  
  return articles.reverse(); // Newest first
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find(a => a.slug === slug) || null;
}

export async function getArticlesBySection(section: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(a => a.section.toLowerCase() === section.toLowerCase());
}

export function groupArticlesBySection(articles: Article[]): Record<string, Article[]> {
  const grouped: Record<string, Article[]> = {};
  
  articles.forEach(article => {
    if (!grouped[article.section]) {
      grouped[article.section] = [];
    }
    grouped[article.section].push(article);
  });
  
  return grouped;
}
