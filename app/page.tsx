import NewspaperLayout from '@/components/Layout';
import HeroArticle from '@/components/HeroArticle';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';
import { getAllArticles, groupArticlesBySection } from '@/lib/articles';

export default async function HomePage() {
  const articles = await getAllArticles();
  
  const hero = articles[0];
  const featured = articles.slice(1, 4);
  const recent = articles.slice(4, 10);
  const archives = articles.slice(-3);
  
  const bySection = groupArticlesBySection(articles);
  
  return (
    <NewspaperLayout>
      <div className="max-w-newspaper mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div className="min-w-0">
            {/* Hero */}
            <HeroArticle article={hero} />
            
            {/* Featured */}
            <section className="mb-10">
              <h2 className="section-divider">Featured Stories</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {featured.map((article) => (
                  <ArticleCard key={article.slug} article={article} featured />
                ))}
              </div>
            </section>
            
            {/* Latest */}
            <section className="mb-10">
              <h2 className="section-divider">Latest Dispatches</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {recent.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
            
            {/* Section: Technology */}
            {bySection['Technology'] && (
              <section className="mb-10">
                <h2 className="section-divider">Technology</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {bySection['Technology'].slice(0, 3).map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </section>
            )}
            
            {/* Section: Business */}
            {bySection['Business'] && (
              <section className="mb-10">
                <h2 className="section-divider">Business</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {bySection['Business'].slice(0, 3).map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </section>
            )}
          </div>
          
          {/* Sidebar */}
          <Sidebar trending={articles} archives={archives} />
        </div>
      </div>
    </NewspaperLayout>
  );
}
