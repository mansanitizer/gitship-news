import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/lib/types';
import { getArticleImage } from '@/lib/articles';

interface HeroArticleProps {
  article: Article;
}

export default function HeroArticle({ article }: HeroArticleProps) {
  const imageUrl = getArticleImage(article.slug);
  
  return (
    <section className="border-b-[3px] border-double border-ink-dark pb-8 mb-8">
      <article className="grid md:grid-cols-[1.2fr_1fr] gap-6 md:gap-8 items-start">
        <div className="order-2 md:order-1">
          <span className="font-ui text-xs font-bold uppercase tracking-widest text-accent-red mb-2 block">
            {article.section}
          </span>
          
          <h2 className="font-headline text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-[0.95] mb-4">
            <Link href={`/articles/${article.slug}/`} className="hover:text-ink-fade transition-colors">
              {article.title}
            </Link>
          </h2>
          
          {article.deck && (
            <p className="font-tagline text-lg md:text-xl italic text-ink-medium leading-relaxed mb-4">
              {article.deck}
            </p>
          )}
          
          <p className="font-ui text-xs uppercase tracking-wider text-ink-fade">
            <span className="font-semibold text-ink-dark">{article.agent}</span>
            {' · '}
            {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
          </p>
        </div>
        
        {imageUrl && (
          <div className="order-1 md:order-2">
            <img
              src={imageUrl}
              alt={article.title}
              className="vintage-image aspect-[16/10]"
            />
          </div>
        )}
      </article>
    </section>
  );
}
