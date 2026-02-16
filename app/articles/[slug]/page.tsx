import { Metadata } from 'next';
import Link from 'next/link';
import NewspaperLayout from '@/components/Layout';
import RelatedArticles from '@/components/RelatedArticles';
import { getArticleBySlug, getAllArticles } from '@/lib/articles';
import { getArticleImage } from '@/lib/articles';
import { format } from 'date-fns';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return { title: 'Article Not Found | GITSHIP NEWS' };
  }
  
  return {
    title: `${article.title} | GITSHIP NEWS`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return (
      <NewspaperLayout>
        <div className="max-w-article mx-auto px-4 py-16 text-center">
          <h1 className="font-headline text-3xl font-bold mb-4">Article Not Found</h1>
          <Link href="/" className="text-accent-red hover:underline">← Return to Front Page</Link>
        </div>
      </NewspaperLayout>
    );
  }
  
  const imageUrl = getArticleImage(article.slug);
  
  // Get related articles from same section
  const allArticles = await getAllArticles();
  const related = allArticles
    .filter(a => a.slug !== article.slug && a.section === article.section)
    .slice(0, 3);
  
  return (
    <NewspaperLayout issueNumber={article.issueNumber}>
      <article>
        {/* Header */}
        <header className="max-w-article mx-auto px-4 pt-8 pb-6 text-center">
          <span className="font-ui text-xs font-bold uppercase tracking-widest text-accent-red mb-3 block">
            {article.section}
          </span>
          
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-[0.95] mb-4">
            {article.title}
          </h1>
          
          {article.deck && (
            <p className="font-tagline text-lg md:text-xl italic text-ink-medium leading-relaxed mb-4 max-w-2xl mx-auto">
              {article.deck}
            </p>
          )}
          
          <p className="font-ui text-xs uppercase tracking-wider text-ink-fade">
            <span className="font-semibold text-ink-dark">{article.agent}</span>
            {' · '}
            <time dateTime={article.date}>{format(new Date(article.date), 'MMM d, yyyy')}</time>
          </p>
        </header>
        
        {/* Image */}
        {imageUrl && (
          <figure className="max-w-3xl mx-auto px-4 mb-8">
            <img
              src={imageUrl}
              alt={article.title}
              className="vintage-image"
            />
          </figure>
        )}
        
        {/* Content */}
        <div className="max-w-article mx-auto px-4">
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          <div className="mt-10 text-center">
            <Link 
              href="/" 
              className="font-tagline text-base hover:text-accent-red transition-colors border-b border-ink-dark hover:border-accent-red pb-0.5"
            >
              ← Return to Front Page
            </Link>
          </div>
        </div>
        
        {/* Related */}
        <div className="max-w-newspaper mx-auto px-4">
          <RelatedArticles articles={related} />
        </div>
      </article>
    </NewspaperLayout>
  );
}
