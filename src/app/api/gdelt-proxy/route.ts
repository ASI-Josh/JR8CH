import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'conflict OR war OR crisis OR military sourcelang:english';
  const maxrecords = searchParams.get('maxrecords') || '50';
  const timespan = searchParams.get('timespan') || '24h';

  const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=${maxrecords}&format=json&sort=datedesc&timespan=${timespan}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(gdeltUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'VIGIL-ATLAS/1.0' },
      next: { revalidate: 300 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `GDELT returned ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'GDELT fetch failed' },
      { status: 500 }
    );
  }
}
