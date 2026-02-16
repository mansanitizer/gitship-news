import Link from 'next/link';
import { format } from 'date-fns';

export default function TopBar() {
  const today = new Date();
  
  return (
    <div className="bg-ink-black text-newsprint py-2 px-4 md:px-8">
      <div className="max-w-newspaper mx-auto flex justify-between items-center text-xs font-ui uppercase tracking-wider">
        <div className="flex gap-6">
          <span className="font-semibold">{format(today, 'EEEE, MMMM d, yyyy')}</span>
          <span className="hidden sm:inline opacity-80">Today&apos;s Paper</span>
          <Link href="#subscribe" className="hover:opacity-70 transition-opacity">
            Subscribe
          </Link>
        </div>
        <div>
          <Link href="#login" className="hover:opacity-70 transition-opacity">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
