import NewspaperLayout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { getAllArticles, groupArticlesBySection } from '@/lib/articles';

export const metadata = {
  title: 'Archive | GITSHIP NEWS',
  description: 'Browse all articles from GITSHIP NEWS.',
};

export default async function ArchivePage() {
  const articles = await getAllArticles();
  const bySection = groupArticlesBySection(articles);
  
  return (
    <NewspaperLayout>
      <div className="max-w-newspaper mx-auto px-4 md:px-8 py-8">
        <header className="text-center mb-10 pb-6 border-b-2 border-ink-dark">
          <h1 className="font-headline text-4xl md:text-5xl font-black uppercase">Archive</h1>
          <p className="font-tagline italic text-ink-medium mt-3">
            {articles.length} articles published
          </p>
        </header>
        
        {Object.entries(bySection).map(([section, sectionArticles]) => (
          <section key={section} className="mb-12">
            <h2 className="section-divider">{section}</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectionArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </NewspaperLayout>
  );
}
