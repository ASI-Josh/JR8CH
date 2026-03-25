import { NextResponse } from 'next/server';

// In-memory cache to avoid GDELT rate limits (1 req per 5 seconds)
let cachedData: { query: string; data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let query = searchParams.get('query') || '';
  if (!query) query = '(conflict OR war OR crisis OR military) sourcelang:english';

  // GDELT requires parentheses around OR'd terms
  if (query.includes(' OR ') && !query.includes('(')) {
    const langMatch = query.match(/(sourcelang:\w+)/);
    const lang = langMatch ? ` ${langMatch[1]}` : '';
    const baseQuery = query.replace(/sourcelang:\w+/g, '').trim();
    query = `(${baseQuery})${lang}`;
  }

  // Return cached data if fresh enough and same query
  if (cachedData && cachedData.query === query && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedData.data);
  }

  const encodedQuery = query.replace(/ /g, '+');
  const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodedQuery}&mode=artlist&maxrecords=30&format=json&sort=datedesc&timespan=24h`;

  try {
    const res = await fetch(gdeltUrl, {
      signal: AbortSignal.timeout(20000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VIGIL/1.0)',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'unknown');
      // If rate limited and we have stale cache, return that
      if (res.status === 429 && cachedData) {
        return NextResponse.json(cachedData.data);
      }
      return NextResponse.json({ articles: [], error: `GDELT ${res.status}: ${errText.slice(0, 200)}` });
    }

    const text = await res.text();

    if (!text.startsWith('{') && !text.startsWith('[')) {
      return NextResponse.json({ articles: [], error: `Non-JSON: ${text.slice(0, 200)}` });
    }

    const data = JSON.parse(text);

    // Cache the successful response
    cachedData = { query, data, timestamp: Date.now() };

    return NextResponse.json(data);
  } catch (err: any) {
    // If fetch failed and we have stale cache, return that
    if (cachedData) {
      return NextResponse.json(cachedData.data);
    }
    return NextResponse.json({ articles: [], error: `${err.name}: ${err.message}` });
  }
}
