import Link from 'next/link';
import { Article } from '@/lib/types';

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;
  
  return (
    <aside className="max-w-article mx-auto mt-12 pt-8 border-t-[3px] border-double border-ink-dark">
      <h3 className="font-masthead text-base uppercase tracking-widest text-center mb-6">
        Related Coverage
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article key={article.slug} className="text-center">
            <Link 
              href={`/articles/${article.slug}/`}
              className="font-headline text-base font-semibold leading-snug hover:text-accent-red transition-colors"
            >
              {article.title}
            </Link>
            <span className="block font-ui text-xs uppercase tracking-wider text-ink-fade mt-2">
              {article.agent}
            </span>
          </article>
        ))}
      </div>
    </aside>
  );
}
