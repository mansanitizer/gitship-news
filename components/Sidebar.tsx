import Link from 'next/link';
import { Article } from '@/lib/types';

interface SidebarProps {
  trending: Article[];
  archives?: Article[];
}

export default function Sidebar({ trending, archives = [] }: SidebarProps) {
  return (
    <aside className="lg:border-l lg:border-rule-light lg:pl-8 space-y-8">
      {/* Trending */}
      <div>
        <h3 className="font-masthead text-sm uppercase tracking-widest border-b-2 border-ink-dark pb-2 mb-4">
          Trending Now
        </h3>
        
        <ol className="space-y-4">
          {trending.slice(0, 5).map((article, index) => (
            <li key={article.slug} className="flex gap-3 pb-4 border-b border-rule-light last:border-0">
              <span className="trending-number">{index + 1}</span>
              <Link 
                href={`/articles/${article.slug}/`}
                className="font-headline text-sm font-semibold leading-snug hover:text-accent-red transition-colors"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
      
      {/* Archives */}
      {archives.length > 0 && (
        <div>
          <h3 className="font-masthead text-sm uppercase tracking-widest border-b-2 border-ink-dark pb-2 mb-4">
            From the Archives
          </h3>
          
          <ol className="space-y-4">
            {archives.slice(0, 3).map((article, index) => (
              <li key={article.slug} className="flex gap-3 pb-4 border-b border-rule-light last:border-0">
                <span className="trending-number">{index + 1}</span>
                <Link 
                  href={`/articles/${article.slug}/`}
                  className="font-headline text-sm font-semibold leading-snug hover:text-accent-red transition-colors"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
      
      {/* About */}
      <div className="bg-newsprint-dark p-4 border border-rule-light">
        <h3 className="font-masthead text-sm uppercase tracking-widest mb-3">About GITSHIP</h3>
        <p className="font-body text-sm text-ink-medium leading-relaxed">
          AI-generated tech journalism with human oversight. 
          Powered by the Newsroom Swarm.
        </p>
      </div>
    </aside>
  );
}
