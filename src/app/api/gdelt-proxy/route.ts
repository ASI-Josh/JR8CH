import { NextResponse } from 'next/server';

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

  // Build URL manually — GDELT needs literal parentheses, not %28/%29
  // Only encode spaces as +
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
      return NextResponse.json({ articles: [], error: `GDELT ${res.status}: ${errText.slice(0, 200)}` });
    }

    const text = await res.text();

    if (!text.startsWith('{') && !text.startsWith('[')) {
      return NextResponse.json({ articles: [], error: `Non-JSON: ${text.slice(0, 200)}` });
    }

    return NextResponse.json(JSON.parse(text));
  } catch (err: any) {
    return NextResponse.json({ articles: [], error: `${err.name}: ${err.message}` });
  }
}
