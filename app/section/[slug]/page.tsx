import NewspaperLayout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { getArticlesBySection, getAllArticles } from '@/lib/articles';
import { notFound } from 'next/navigation';

const VALID_SECTIONS = ['tech', 'business', 'security', 'culture', 'people'];

const SECTION_NAMES: Record<string, string> = {
  'tech': 'Technology',
  'business': 'Business',
  'security': 'Security',
  'culture': 'Culture',
  'people': 'People',
};

interface SectionPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return VALID_SECTIONS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SectionPageProps) {
  const sectionName = SECTION_NAMES[params.slug];
  
  if (!sectionName) {
    return { title: 'Section Not Found | GITSHIP NEWS' };
  }
  
  return {
    title: `${sectionName} | GITSHIP NEWS`,
    description: `Latest ${sectionName} news from GITSHIP NEWS.`,
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  if (!VALID_SECTIONS.includes(params.slug)) {
    notFound();
  }
  
  const sectionName = SECTION_NAMES[params.slug];
  const articles = await getArticlesBySection(sectionName);
  
  if (articles.length === 0) {
    return (
      <NewspaperLayout>
        <div className="max-w-newspaper mx-auto px-4 md:px-8 py-16 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase mb-4">{sectionName}</h1>
          <p className="text-ink-fade">No articles found in this section.</p>
        </div>
      </NewspaperLayout>
    );
  }
  
  return (
    <NewspaperLayout>
      <div className="max-w-newspaper mx-auto px-4 md:px-8 py-8">
        <header className="text-center mb-10 pb-6 border-b-2 border-ink-dark">
          <span className="font-ui text-xs font-bold uppercase tracking-widest text-accent-red mb-2 block">Section</span>
          <h1 className="font-headline text-4xl md:text-5xl font-black uppercase">{sectionName}</h1>
        </header>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </NewspaperLayout>
  );
}
