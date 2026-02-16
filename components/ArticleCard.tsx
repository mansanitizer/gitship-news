import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/lib/types';
import { getArticleImage } from '@/lib/articles';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const imageUrl = getArticleImage(article.slug);
  
  if (featured) {
    return (
      <article className="grid md:grid-cols-2 gap-4 border-b-2 border-ink-dark pb-6">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={article.title}
            className="vintage-image aspect-[4/3]"
          />
        )}
        <div className="flex flex-col">
          <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-accent-red mb-1">
            {article.section}
          </span>
          
          <h3 className="font-headline text-xl md:text-2xl font-bold uppercase leading-tight mb-2">
            <Link href={`/articles/${article.slug}/`} className="hover:text-ink-fade transition-colors">
              {article.title}
            </Link>
          </h3>
          
          <p className="font-body text-sm text-ink-medium leading-relaxed mb-3 flex-grow">
            {article.excerpt}
          </p>
          
          <p className="font-ui text-[10px] uppercase tracking-wider text-ink-fade">
            <span className="font-semibold text-ink-dark">{article.agent}</span>
            {' · '}
            {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
          </p>
        </div>
      </article>
    );
  }
  
  return (
    <article className="flex flex-col border-b border-rule-light pb-5">
      <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-accent-red mb-1">
        {article.section}
      </span>
      
      <h3 className="font-headline text-lg md:text-xl font-bold uppercase leading-tight mb-2">
        <Link href={`/articles/${article.slug}/`} className="hover:text-ink-fade transition-colors">
          {article.title}
        </Link>
      </h3>
      
      <p className="font-body text-sm text-ink-medium leading-relaxed mb-3">
        {article.excerpt}
      </p>
      
      <p className="font-ui text-[10px] uppercase tracking-wider text-ink-fade">
        <span className="font-semibold text-ink-dark">{article.agent}</span>
        {' · '}
        {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
      </p>
    </article>
  );
}
