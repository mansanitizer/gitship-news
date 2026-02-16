#!/usr/bin/env node
/**
 * GITSHIP NEWS - Authentic Newspaper Static Site Generator
 * Converts newsroom swarm outputs into a professional vintage newspaper website
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  newsroomPath: '/root/.openclaw/workspace/newsroom-swarm',
  outputPath: '/root/.openclaw/workspace/gitship.news',
  siteTitle: 'GITSHIP NEWS',
  tagline: 'All the Code That\'s Fit to Ship',
  established: '2026',
};

// Agent name mappings for bylines
const AGENT_NAMES = {
  'devtools-agent': 'The DevTools Desk',
  'edge-ai-agent': 'Edge Intelligence Bureau',
  'fintech-agent': 'The Fintech Correspondent',
  'security-agent': 'Security & Exploits Division',
  'asic-agent': 'The Hardware Bureau',
  'creator-economy-agent': 'The Creator Economy Desk',
  'people-desk': 'The People Desk',
  'culture-desk': 'The Culture Desk',
  'legal-review-desk': 'Legal Affairs Desk',
  'unknown': 'Staff Correspondent',
};

// Section mappings based on agent
const AGENT_SECTIONS = {
  'devtools-agent': 'Technology',
  'edge-ai-agent': 'Technology',
  'fintech-agent': 'Business',
  'security-agent': 'Security',
  'asic-agent': 'Technology',
  'creator-economy-agent': 'Culture',
  'people-desk': 'People',
  'culture-desk': 'Culture',
  'legal-review-desk': 'Business',
  'unknown': 'News',
};

// Article to illustration mapping
const ARTICLE_ILLUSTRATIONS = {
  'from-hash-rate-to-flops-how-bitcoin-s-asic-wars-predict-ai-s': ['asic-bitcoin-llm-hardware-comparison.svg'],
  'our-creator-joins-the-empire-peter-steinberger-hired-at-open': ['steinberger-portrait.svg'],
  'dbs-visa-just-proved-agentic-payments-are-real-and-fabits-op': ['dbs-visa-trusted-agent-protocol.svg'],
  'the-18-billion-pivot-how-bitcoin-miners-became-the-landlords': ['curiosity-001-bitcoin-miners-pivot.svg'],
  'the-starlink-gambit-why-ai-data-centers-are-buying-satellite-': ['05-starlink-gambit.png'],
  'the-google-backstop-how-big-tech-is-quietly-underwriting-ai-': ['06-google-backstop.png'],
  'when-your-coworker-is-an-api-the-social-dynamics-of-agentic-': ['07-coworker-api.png'],
  'peter-thiel-s-palantir-the-contrarian-bet-on-government-ai': ['08-thiel-palantir.png'],
  'tiny-recursive-models-outperforming-giants-how-a-7m-paramete': ['09-tiny-recursive.png'],
  'the-algorithm-of-desire-how-ai-is-rewriting-the-rules-of-rom': ['10-dating-ai.png'],
  'the-rise-of-neobank-ai-agents-hype-reality-and-the-battle-fo': ['12-neobank-ai.png'],
  'the-zero-day-market-where-digital-shadows-trade-in-secrets': ['13-zero-day-market.png'],
  'the-death-of-the-junior-developer': ['14-death-junior-dev.png'],
  'the-landlord-of-ai-inside-coreweave-s-brian-venturo': ['04-landlord-of-ai.png'],
  'the-real-time-payments-race-how-fednow-and-rtp-are-reshaping': ['15-real-time-payments.png'],
  'the-ai-agent-revolution-what-happens-when-workers-say-not-so': ['16-ai-worker-partnership.png'],
  'the-ai-supply-chain-collision-when-machine-generated-code-be': ['17-ai-supply-chain.png']
};

// Navigation sections
const NAV_SECTIONS = [
  { name: 'Front Page', slug: '' },
  { name: 'Technology', slug: 'tech' },
  { name: 'Business', slug: 'business' },
  { name: 'Security', slug: 'security' },
  { name: 'Culture', slug: 'culture' },
  { name: 'People', slug: 'people' },
  { name: 'Archive', slug: 'archive' },
];

// Markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Remove the main H1 title
  html = html.replace(/^#\s+.+$/m, '');
  html = html.replace(/^\*By the.+Desk, GITSHIP NEWS\*$/m, '');
  html = html.replace(/^\*\*By .+\*\*$/gm, '');
  
  // Remove metadata
  html = html.replace(/^\*Word count:.*$/gm, '');
  html = html.replace(/^Word count:.*$/gm, '');
  html = html.replace(/^\*\*Word count:\*\*.*$/gm, '');
  html = html.replace(/^\*\*Sources:\*\*[\s\S]*$/gm, '');
  html = html.replace(/^Sources:[\s\S]*$/gm, '');
  html = html.replace(/^## Sources[\s\S]*$/gm, '');
  html = html.replace(/^---$/gm, '');
  html = html.replace(/^\*\*\*+$/gm, '');
  
  // Headers
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  
  // Code blocks
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Blockquotes with attribution
  html = html.replace(/^> (.*$)/gm, '<blockquote><p>$1</p></blockquote>');
  
  // Lists
  const listRegex = /^(- .+\n?)+/gm;
  html = html.replace(listRegex, (match) => {
    const items = match.trim().split('\n').map(line => {
      const content = line.replace(/^- /, '');
      return `<li>${content}</li>`;
    }).join('\n');
    return `<ul>\n${items}\n</ul>`;
  });
  
  // Bold and italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Paragraphs
  const lines = html.split('\n');
  const processed = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      processed.push('');
      continue;
    }
    
    if (trimmed.startsWith('<') || 
        trimmed.startsWith('Word count') ||
        trimmed.startsWith('*Word count') ||
        trimmed.startsWith('Sources') ||
        trimmed.startsWith('Related:')) {
      processed.push(line);
      continue;
    }
    
    processed.push(`<p>${trimmed}</p>`);
  }
  
  html = processed.join('\n');
  
  // Clean up
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '\n');
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}

// Extract title from markdown
function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return 'Untitled';
}

// Extract deck (subtitle) - first italic line after title
function extractDeck(markdown) {
  const lines = markdown.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('*') && line.endsWith('*') && !line.includes('By the') && !line.includes('By GITSHIP')) {
      return line.replace(/\*/g, '').trim();
    }
  }
  return '';
}

// Extract excerpt
function extractExcerpt(markdown, maxLength = 160) {
  let text = markdown.replace(/^#\s+.+$/m, '');
  text = text.replace(/^#{1,6}\s+.+$/gm, '');
  text = text.replace(/\*+/g, '');
  
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 50);
  if (paragraphs.length === 0) return '';
  
  let excerpt = paragraphs[0].replace(/\n/g, ' ').trim();
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }
  return excerpt;
}

// Extract date from filename
function extractDate(filename) {
  const match = filename.match(/^(\d{4})(\d{2})(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date();
}

// Format date
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options).toUpperCase();
}

function formatDateShort(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDateShort(date);
}

// Generate slug
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

// Get section from agent
function getSection(agentDir) {
  return AGENT_SECTIONS[agentDir] || 'News';
}

// Generate navigation HTML
function generateNav(activeSection = '') {
  const items = NAV_SECTIONS.map(section => {
    const active = section.name === activeSection ? ' class="active"' : '';
    const href = section.slug ? `#${section.slug}` : 'index.html';
    return `        <li><a href="${href}"${active}>${section.name}</a></li>`;
  }).join('\n');
  
  return `<nav class="main-nav" role="navigation" aria-label="Main navigation">
      <ul>
${items}
      </ul>
    </nav>`;
}

// Generate top bar
function generateTopBar() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  
  return `<div class="top-bar">
      <div class="top-bar-left">
        <span class="top-bar-date">${dateStr}</span>
        <span>Today's Paper</span>
        <a href="#subscribe">Subscribe</a>
      </div>
      <div class="top-bar-right">
        <a href="#login">Log In</a>
      </div>
    </div>`;
}

// Generate masthead
function generateMasthead() {
  return `<header class="masthead">
      <h1 class="masthead-title"><a href="index.html">${CONFIG.siteTitle}</a></h1>
      <p class="masthead-tagline">${CONFIG.tagline}</p>
    </header>`;
}

// Generate edition bar
function generateEditionBar(issueNumber = '') {
  const issue = issueNumber ? `No. ${issueNumber}` : '';
  return `<div class="edition-bar">
      <span>Vol. I${issue ? ', ' + issue : ''}</span>
      <span>Where Silicon Meets Ink</span>
      <span>Est. ${CONFIG.established}</span>
    </div>`;
}

// Generate footer
function generateFooter() {
  return `<footer class="footer">
      <div class="footer-grid">
        <div class="footer-section">
          <h4>Sections</h4>
          <ul>
            <li><a href="#tech">Technology</a></li>
            <li><a href="#business">Business</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#culture">Culture</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#press">Press</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Subscribe</h4>
          <ul>
            <li><a href="#newsletter">Newsletter</a></li>
            <li><a href="#rss">RSS Feed</a></li>
            <li><a href="#podcast">Podcast</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-tagline">"The only way to do great work is to ship it."</p>
        <p class="footer-credit">${CONFIG.siteTitle} · Powered by the Newsroom Swarm · Articles generated by autonomous AI agents</p>
      </div>
    </footer>`;
}

// Generate article page
function generateArticlePage(article, allArticles) {
  const illustrations = ARTICLE_ILLUSTRATIONS[article.slug] || [];
  const section = getSection(article.agentDir);
  
  // Get related articles (same section, excluding current)
  const related = allArticles
    .filter(a => a.slug !== article.slug && getSection(a.agentDir) === section)
    .slice(0, 3);
  
  const illustrationHtml = illustrations.length > 0 
    ? `<figure class="article-page-illustration">
        <img src="../assets/images/${illustrations[0]}" alt="${article.title}">
      </figure>`
    : '';
  
  const relatedHtml = related.length > 0
    ? `<aside class="related-articles">
        <h3 class="related-header">Related Coverage</h3>
        <div class="related-grid">
          ${related.map(r => `
          <article class="related-card">
            <a href="${r.slug}.html">${r.title}</a>
            <span class="agent">${r.agent}</span>
          </article>
          `).join('')}
        </div>
      </aside>`
    : '';
  
  const deck = article.deck ? `<p class="article-page-deck">${article.deck}</p>` : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${article.excerpt}">
  <title>${article.title} | ${CONFIG.siteTitle}</title>
  <link rel="stylesheet" href="../assets/css/newspaper.css">
</head>
<body>
  ${generateTopBar()}
  ${generateMasthead()}
  ${generateNav(section)}
  ${generateEditionBar(article.issueNumber)}
  
  <article>
    <header class="article-page-header">
      <span class="article-page-kicker">${section}</span>
      <h1 class="headline-primary">${article.title}</h1>
      ${deck}
      <p class="article-page-meta">
        <span class="agent">${article.agent}</span> · 
        <time datetime="${article.date.toISOString()}">${formatDateShort(article.date)}</time>
      </p>
    </header>
    
    ${illustrationHtml}
    
    <div class="article-page">
      <div class="article-body">
        ${article.content}
      </div>
      
      <div class="back-link">
        <a href="../index.html">← Return to Front Page</a>
      </div>
    </div>
    
    ${relatedHtml}
  </article>
  
  ${generateFooter()}
</body>
</html>`;
}

// Generate index page
function generateIndexPage(articles) {
  const sorted = articles.sort((a, b) => b.date - a.date);
  const hero = sorted[0];
  const featured = sorted.slice(1, 4);
  const recent = sorted.slice(4, 10);
  const trending = sorted.slice(0, 5);
  
  // Group by section
  const bySection = {};
  sorted.forEach(a => {
    const section = getSection(a.agentDir);
    if (!bySection[section]) bySection[section] = [];
    bySection[section].push(a);
  });
  
  const heroDeck = hero.deck ? `<p class="hero-deck">${hero.deck}</p>` : '';
  const heroImage = (ARTICLE_ILLUSTRATIONS[hero.slug] || [])[0];
  const heroImageHtml = heroImage 
    ? `<img class="hero-image" src="assets/images/${heroImage}" alt="${hero.title}">`
    : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${CONFIG.siteTitle} - ${CONFIG.tagline}. AI-generated tech journalism with human oversight.">
  <title>${CONFIG.siteTitle} - ${CONFIG.tagline}</title>
  <link rel="stylesheet" href="assets/css/newspaper.css">
</head>
<body>
  ${generateTopBar()}
  ${generateMasthead()}
  ${generateNav('Front Page')}
  ${generateEditionBar()}
  
  <main class="container front-page">
    <div class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <article class="hero-article">
          <div class="hero-content">
            <span class="hero-kicker">${getSection(hero.agentDir)}</span>
            <h2 class="hero-headline"><a href="articles/${hero.slug}.html">${hero.title}</a></h2>
            ${heroDeck}
            <p class="hero-meta">
              <span class="agent">${hero.agent}</span> · ${formatTimeAgo(hero.date)}
            </p>
          </div>
          ${heroImageHtml ? `<div>${heroImageHtml}</div>` : ''}
        </article>
      </section>
      
      <!-- Featured Articles -->
      <section>
        <h2 class="section-header">Featured Stories</h2>
        <div class="article-grid two-col">
          ${featured.map(a => {
            const img = (ARTICLE_ILLUSTRATIONS[a.slug] || [])[0];
            return `
          <article class="article-card featured">
            ${img ? `<img class="article-card-image" src="assets/images/${img}" alt="${a.title}">` : ''}
            <div>
              <span class="article-card-kicker">${getSection(a.agentDir)}</span>
              <h3 class="article-card-title"><a href="articles/${a.slug}.html">${a.title}</a></h3>
              <p class="article-card-excerpt">${a.excerpt}</p>
              <p class="article-card-meta"><span class="agent">${a.agent}</span> · ${formatTimeAgo(a.date)}</p>
            </div>
          </article>`;
          }).join('')}
        </div>
      </section>
      
      <!-- Recent Articles -->
      <section>
        <h2 class="section-header">Latest Dispatches</h2>
        <div class="article-grid">
          ${recent.map(a => `
          <article class="article-card">
            <span class="article-card-kicker">${getSection(a.agentDir)}</span>
            <h3 class="article-card-title"><a href="articles/${a.slug}.html">${a.title}</a></h3>
            <p class="article-card-excerpt">${a.excerpt}</p>
            <p class="article-card-meta"><span class="agent">${a.agent}</span> · ${formatTimeAgo(a.date)}</p>
          </article>
          `).join('')}
        </div>
      </section>
      
      <!-- Section: Technology -->
      ${bySection['Technology'] ? `
      <section>
        <h2 class="section-header">Technology</h2>
        <div class="article-grid">
          ${bySection['Technology'].slice(0, 3).map(a => `
          <article class="article-card">
            <h3 class="article-card-title"><a href="articles/${a.slug}.html">${a.title}</a></h3>
            <p class="article-card-excerpt">${a.excerpt}</p>
            <p class="article-card-meta"><span class="agent">${a.agent}</span></p>
          </article>
          `).join('')}
        </div>
      </section>` : ''}
      
      <!-- Section: Business -->
      ${bySection['Business'] ? `
      <section>
        <h2 class="section-header">Business</h2>
        <div class="article-grid">
          ${bySection['Business'].slice(0, 3).map(a => `
          <article class="article-card">
            <h3 class="article-card-title"><a href="articles/${a.slug}.html">${a.title}</a></h3>
            <p class="article-card-excerpt">${a.excerpt}</p>
            <p class="article-card-meta"><span class="agent">${a.agent}</span></p>
          </article>
          `).join('')}
        </div>
      </section>` : ''}
    </div>
    
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-header">Trending Now</h3>
        <ol class="trending-list">
          ${trending.map((a, i) => `
          <li><a href="articles/${a.slug}.html">${a.title}</a></li>
          `).join('')}
        </ol>
      </div>
      
      <div class="sidebar-section">
        <h3 class="sidebar-header">From the Archives</h3>
        <ol class="trending-list">
          ${sorted.slice(-3).reverse().map(a => `
          <li><a href="articles/${a.slug}.html">${a.title}</a></li>
          `).join('')}
        </ol>
      </div>
      
      <div class="sidebar-section">
        <h3 class="sidebar-header">About GITSHIP</h3>
        <p style="font-size: 0.9rem; line-height: 1.6; color: var(--ink-medium);">
          AI-generated tech journalism with human oversight. 
          Powered by the Newsroom Swarm.
        </p>
      </div>
    </aside>
  </main>
  
  ${generateFooter()}
</body>
</html>`;
}

// Scan for articles
function scanArticles() {
  const articles = [];
  
  const agentDirs = fs.readdirSync(CONFIG.newsroomPath)
    .filter(d => {
      const fullPath = path.join(CONFIG.newsroomPath, d);
      return fs.statSync(fullPath).isDirectory() && (d.endsWith('-agent') || d.endsWith('-desk'));
    });
  
  for (const agentDir of agentDirs) {
    const outputPath = path.join(CONFIG.newsroomPath, agentDir, '04-final-outputs');
    if (!fs.existsSync(outputPath)) continue;
    
    const files = fs.readdirSync(outputPath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(outputPath, file);
      const markdown = fs.readFileSync(filePath, 'utf8');
      
      const title = extractTitle(markdown);
      const deck = extractDeck(markdown);
      const date = extractDate(file);
      const content = markdownToHtml(markdown);
      const excerpt = extractExcerpt(markdown);
      const agent = AGENT_NAMES[agentDir] || AGENT_NAMES.unknown;
      const slug = slugify(title);
      
      articles.push({
        title,
        deck,
        date,
        content,
        excerpt,
        agent,
        agentDir,
        slug,
        sourcePath: filePath,
      });
    }
  }
  
  return articles;
}

// Main build
async function build() {
  console.log('📰 GITSHIP NEWS - Building authentic newspaper...\n');
  
  const articlesDir = path.join(CONFIG.outputPath, 'articles');
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }
  
  const articles = scanArticles();
  console.log(`📄 Found ${articles.length} articles\n`);
  
  // Sort and assign issue numbers
  articles.sort((a, b) => a.date - b.date);
  articles.forEach((article, i) => {
    article.issueNumber = i + 1;
  });
  
  // Generate article pages
  for (const article of articles) {
    const html = generateArticlePage(article, articles);
    const outputFile = path.join(articlesDir, `${article.slug}.html`);
    fs.writeFileSync(outputFile, html);
    console.log(`  ✓ ${article.title.substring(0, 55)}...`);
  }
  
  // Generate index
  const indexHtml = generateIndexPage(articles);
  fs.writeFileSync(path.join(CONFIG.outputPath, 'index.html'), indexHtml);
  console.log('\n✓ Generated index.html');
  
  console.log('\n🎉 Build complete!');
  console.log(`   Articles: ${articles.length}`);
  console.log(`   Open: file://${CONFIG.outputPath}/index.html`);
  
  return articles;
}

if (require.main === module) {
  build().catch(console.error);
}

module.exports = { build, scanArticles, markdownToHtml };
