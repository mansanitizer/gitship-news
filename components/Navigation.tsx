'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_SECTIONS } from '@/lib/types';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-ink-black sticky top-0 z-50 shadow-lg" role="navigation" aria-label="Main navigation">
      <ul className="max-w-newspaper mx-auto flex flex-wrap justify-center">
        {NAV_SECTIONS.map((section) => {
          const isActive = pathname === section.href || 
            (section.href !== '/' && pathname.startsWith(section.href));
          
          return (
            <li key={section.slug}>
              <Link
                href={section.href}
                className={`
                  block px-4 md:px-6 py-3 font-ui text-xs md:text-sm font-semibold uppercase tracking-wider
                  text-newsprint transition-all border-b-[3px]
                  ${isActive 
                    ? 'border-accent-gold bg-white/5' 
                    : 'border-transparent hover:bg-white/5 hover:border-accent-gold/50'
                  }
                `}
              >
                {section.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
