import { NextResponse } from 'next/server';

// ─── Vetted Source Registry ───
// Only trusted, established news sources with editorial standards
const SOURCES = [
  { name: 'Reuters', url: 'https://feeds.reuters.com/reuters/worldNews', tier: 1, icon: '🔵' },
  { name: 'AP News', url: 'https://rsshub.app/apnews/topics/world-news', tier: 1, icon: '🔵' },
  { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', tier: 1, icon: '🔵' },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', tier: 1, icon: '🟡' },
  { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', tier: 1, icon: '🔵' },
  { name: 'NPR', url: 'https://feeds.npr.org/1004/rss.xml', tier: 1, icon: '🔵' },
];

// ─── Operation Keyword Sets ───
const OPERATION_KEYWORDS: Record<string, string[]> = {
  'OP-001-lumen': [
    'artificial intelligence', 'ai regulation', 'ai safety', 'ai ethics',
    'deepfake', 'disinformation', 'bot network', 'social media manipulation',
    'algorithmic', 'surveillance', 'censorship', 'digital rights',
    'anthropic', 'openai', 'meta ai', 'google ai',
  ],
  'OP-002-epstein-uncovered': [
    'epstein', 'ghislaine', 'maxwell', 'trafficking', 'bondi',
    'doj', 'fbi', 'oversight committee', 'deposition',
    'pedophile', 'abuse', 'coverup', 'cover-up', 'whistleblower',
    'sealed documents', 'client list', 'blackmail',
    'prince andrew', 'les wexner', 'jean-luc brunel',
  ],
  'OP-003-southern-cross': [
    'australia', 'australian government', 'pine gap', 'aukus',
    'five eyes', 'asio', 'afp', 'liberal party', 'labor party',
    'aboriginal', 'indigenous rights', 'great barrier reef',
    'pacific islands', 'south china sea',
  ],
  'GLOBAL': [
    'military', 'geopolitical', 'nato', 'conflict', 'war',
    'sanctions', 'nuclear', 'missile', 'invasion',
    'coup', 'protest', 'revolution', 'martial law',
    'intelligence agency', 'cia', 'mi6', 'mossad',
    'united nations', 'security council', 'human rights',
    'china', 'russia', 'iran', 'north korea', 'israel', 'palestine', 'gaza',
    'ukraine', 'taiwan', 'syria', 'yemen',
    'breaking news', 'developing',
  ],
};

interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  sourceTier: number;
  sourceIcon: string;
  pubDate: string;
  timestamp: number;
  relevance: {
    score: number;
    operations: string[];
    matchedKeywords: string[];
  };
  breaking: boolean;
}

function extractItems(xml: string, sourceName: string, sourceTier: number, sourceIcon: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = (itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1')?.trim() || '';
    const descRaw = (itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/) || [])[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1') || '';
    const desc = descRaw.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const link = (itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/) || [])[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1')?.trim() || '';
    const pubDate = (itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1]?.trim() || '';

    if (!title) continue;

    const text = `${title} ${desc}`.toLowerCase();
    const matchedOps: string[] = [];
    const matchedKw: string[] = [];
    let score = 0;

    for (const [op, keywords] of Object.entries(OPERATION_KEYWORDS)) {
      for (const kw of keywords) {
        if (text.includes(kw.toLowerCase())) {
          if (!matchedOps.includes(op)) matchedOps.push(op);
          if (!matchedKw.includes(kw)) matchedKw.push(kw);
          score += op === 'GLOBAL' ? 1 : 3; // Operation-specific matches score higher
        }
      }
    }

    // Tier 1 sources get a boost
    if (sourceTier === 1) score += 1;

    // Breaking/developing news boost
    const isBreaking = /breaking|developing|just in|urgent/i.test(title);
    if (isBreaking) score += 5;

    // Only include items with relevance > 0
    if (score > 0) {
      const timestamp = pubDate ? new Date(pubDate).getTime() : Date.now();
      items.push({
        id: Buffer.from(`${sourceName}-${title.slice(0, 50)}`).toString('base64').slice(0, 24),
        title: title.slice(0, 200),
        description: desc.slice(0, 300),
        link,
        source: sourceName,
        sourceTier,
        sourceIcon,
        pubDate,
        timestamp,
        relevance: {
          score,
          operations: matchedOps,
          matchedKeywords: matchedKw,
        },
        breaking: isBreaking,
      });
    }
  }

  return items;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ops = searchParams.get('operations')?.split(',') || ['ALL'];
  const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 50);

  try {
    // Fetch all RSS feeds in parallel
    const feedPromises = SOURCES.map(async (source) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(source.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'VIGIL-Intel-Feed/1.0' },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });
        clearTimeout(timeout);
        if (!res.ok) return [];
        const xml = await res.text();
        return extractItems(xml, source.name, source.tier, source.icon);
      } catch {
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    let allItems = results.flat();

    // Filter by selected operations if specified
    if (!ops.includes('ALL')) {
      allItems = allItems.filter(item =>
        item.relevance.operations.some(op => ops.includes(op) || op === 'GLOBAL')
      );
    }

    // Sort: breaking first, then by relevance score, then by recency
    allItems.sort((a, b) => {
      if (a.breaking && !b.breaking) return -1;
      if (!a.breaking && b.breaking) return 1;
      if (b.relevance.score !== a.relevance.score) return b.relevance.score - a.relevance.score;
      return b.timestamp - a.timestamp;
    });

    // Deduplicate by similar titles
    const seen = new Set<string>();
    allItems = allItems.filter(item => {
      const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({
      items: allItems.slice(0, limit),
      meta: {
        total: allItems.length,
        sources: SOURCES.map(s => s.name),
        fetchedAt: new Date().toISOString(),
        operations: ops,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Intel feed fetch failed', items: [], meta: { fetchedAt: new Date().toISOString() } },
      { status: 500 }
    );
  }
}
