import Link from 'next/link';

interface MastheadProps {
  tagline?: string;
}

export default function Masthead({ tagline = "All the Code That's Fit to Ship" }: MastheadProps) {
  return (
    <header className="text-center py-6 md:py-8 px-4 border-b-[3px] border-double border-ink-dark bg-gradient-to-b from-newsprint to-newsprint-dark">
      <h1 className="font-masthead text-4xl md:text-6xl lg:text-7xl tracking-wider leading-none">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          GITSHIP NEWS
        </Link>
      </h1>
      <p className="font-tagline italic text-base md:text-lg mt-3 tracking-wide text-ink-medium">
        {tagline}
      </p>
    </header>
  );
}
