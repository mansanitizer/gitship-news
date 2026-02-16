import Link from 'next/link';
import NewspaperLayout from '@/components/Layout';

export default function NotFound() {
  return (
    <NewspaperLayout>
      <div className="max-w-article mx-auto px-4 py-24 text-center">
        <span className="font-headline text-8xl font-black text-ink-light block mb-4">404</span>
        <h1 className="font-headline text-3xl font-bold uppercase mb-4">Page Not Found</h1>
        <p className="font-body text-ink-medium mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-block font-ui text-sm font-semibold uppercase tracking-wider px-6 py-3 bg-ink-black text-newsprint hover:bg-accent-red transition-colors"
        >
          Return to Front Page
        </Link>
      </div>
    </NewspaperLayout>
  );
}
