import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let query = searchParams.get('query') || '';

  // Default query if empty
  if (!query) query = '(conflict OR war OR crisis OR military) sourcelang:english';

  // GDELT requires parentheses around OR'd terms
  if (query.includes(' OR ') && !query.includes('(')) {
    const langMatch = query.match(/(sourcelang:\w+)/);
    const lang = langMatch ? ` ${langMatch[1]}` : '';
    const baseQuery = query.replace(/sourcelang:\w+/g, '').trim();
    query = `(${baseQuery})${lang}`;
  }

  // Build URL with URLSearchParams to handle encoding correctly
  const params = new URLSearchParams({
    query,
    mode: 'artlist',
    maxrecords: '30',
    format: 'json',
    sort: 'datedesc',
    timespan: '24h',
  });

  const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(gdeltUrl, { signal: controller.signal });
    clearTimeout(timeout);

    const text = await res.text();

    if (!text.startsWith('{') && !text.startsWith('[')) {
      console.error('[GDELT PROXY] Non-JSON response:', text.slice(0, 200));
      return NextResponse.json({ articles: [], error: text.slice(0, 200) });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[GDELT PROXY] Error:', err.message);
    return NextResponse.json({ articles: [], error: err.message });
  }
}
