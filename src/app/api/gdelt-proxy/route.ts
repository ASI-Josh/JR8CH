import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get the raw query and wrap OR terms in parentheses for GDELT
  let query = searchParams.get('query') || '(conflict OR war OR crisis OR military) sourcelang:english';
  if (query.includes(' OR ') && !query.includes('(')) {
    const langMatch = query.match(/(sourcelang:\w+)/);
    const lang = langMatch ? ` ${langMatch[1]}` : '';
    const baseQuery = query.replace(/sourcelang:\w+/, '').trim();
    query = `(${baseQuery})${lang}`;
  }

  const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=30&format=json&sort=datedesc&timespan=24h`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(gdeltUrl, { signal: controller.signal });
    clearTimeout(timeout);

    const text = await res.text();

    // GDELT sometimes returns plain text errors or HTML
    if (!text.startsWith('{') && !text.startsWith('[')) {
      return NextResponse.json({ articles: [] });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ articles: [] });
  }
}
