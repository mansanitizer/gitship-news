import TopBar from '@/components/TopBar';
import Masthead from '@/components/Masthead';
import Navigation from '@/components/Navigation';
import EditionBar from '@/components/EditionBar';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  issueNumber?: number;
}

export default function NewspaperLayout({ children, issueNumber }: LayoutProps) {
  return (
    <>
      <TopBar />
      <Masthead />
      <Navigation />
      <EditionBar issueNumber={issueNumber} />
      
      <main>{children}</main>
      
      <Footer />
    </>
  );
}
