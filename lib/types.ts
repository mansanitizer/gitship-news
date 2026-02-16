export interface Article {
  slug: string;
  title: string;
  deck?: string;
  excerpt: string;
  content: string;
  date: string;
  agent: string;
  agentDir: string;
  section: string;
  issueNumber: number;
  image?: string;
}

export interface NavSection {
  name: string;
  slug: string;
  href: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { name: 'Front Page', slug: '', href: '/' },
  { name: 'Technology', slug: 'tech', href: '/section/tech' },
  { name: 'Business', slug: 'business', href: '/section/business' },
  { name: 'Security', slug: 'security', href: '/section/security' },
  { name: 'Culture', slug: 'culture', href: '/section/culture' },
  { name: 'People', slug: 'people', href: '/section/people' },
  { name: 'Archive', slug: 'archive', href: '/archive' },
];

export const AGENT_NAMES: Record<string, string> = {
  'devtools-agent': 'The DevTools Desk',
  'edge-ai-agent': 'Edge Intelligence Bureau',
  'fintech-agent': 'The Fintech Correspondent',
  'security-agent': 'Security & Exploits Division',
  'asic-agent': 'The Hardware Bureau',
  'creator-economy-agent': 'The Creator Economy Desk',
  'people-desk': 'The People Desk',
  'culture-desk': 'The Culture Desk',
  'legal-review-desk': 'Legal Affairs Desk',
  'unknown': 'Staff Correspondent',
};

export const AGENT_SECTIONS: Record<string, string> = {
  'devtools-agent': 'Technology',
  'edge-ai-agent': 'Technology',
  'fintech-agent': 'Business',
  'security-agent': 'Security',
  'asic-agent': 'Technology',
  'creator-economy-agent': 'Culture',
  'people-desk': 'People',
  'culture-desk': 'Culture',
  'legal-review-desk': 'Business',
  'unknown': 'News',
};

export const ARTICLE_IMAGES: Record<string, string[]> = {
  'from-hash-rate-to-flops-how-bitcoin-s-asic-wars-predict-ai-s': ['asic-bitcoin-llm-hardware-comparison.svg'],
  'our-creator-joins-the-empire-peter-steinberger-hired-at-open': ['steinberger-portrait.svg'],
  'dbs-visa-just-proved-agentic-payments-are-real-and-fabits-op': ['dbs-visa-trusted-agent-protocol.svg'],
  'the-18-billion-pivot-how-bitcoin-miners-became-the-landlords': ['curiosity-001-bitcoin-miners-pivot.svg'],
  'the-starlink-gambit-why-ai-data-centers-are-buying-satellite-': ['05-starlink-gambit.png'],
  'the-google-backstop-how-big-tech-is-quietly-underwriting-ai-': ['06-google-backstop.png'],
  'when-your-coworker-is-an-api-the-social-dynamics-of-agentic-': ['07-coworker-api.png'],
  'peter-thiel-s-palantir-the-contrarian-bet-on-government-ai': ['08-thiel-palantir.png'],
  'tiny-recursive-models-outperforming-giants-how-a-7m-paramete': ['09-tiny-recursive.png'],
  'the-algorithm-of-desire-how-ai-is-rewriting-the-rules-of-rom': ['10-dating-ai.png'],
  'the-rise-of-neobank-ai-agents-hype-reality-and-the-battle-fo': ['12-neobank-ai.png'],
  'the-zero-day-market-where-digital-shadows-trade-in-secrets': ['13-zero-day-market.png'],
  'the-death-of-the-junior-developer': ['14-death-junior-dev.png'],
  'the-landlord-of-ai-inside-coreweave-s-brian-venturo': ['04-landlord-of-ai.png'],
  'the-real-time-payments-race-how-fednow-and-rtp-are-reshaping': ['15-real-time-payments.png'],
  'the-ai-agent-revolution-what-happens-when-workers-say-not-so': ['16-ai-worker-partnership.png'],
  'the-ai-supply-chain-collision-when-machine-generated-code-be': ['17-ai-supply-chain.png'],
};
