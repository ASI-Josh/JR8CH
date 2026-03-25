import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory token cache
let tokenCache: { token: string; expiresAt: number } | null = null;

// In-memory data cache (5 min TTL)
let dataCache: { query: string; data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

async function getToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (tokenCache && Date.now() < tokenCache.expiresAt - 300000) {
    return tokenCache.token;
  }

  const email = process.env.ACLED_EMAIL;
  const password = process.env.ACLED_PASSWORD;

  if (!email || !password) {
    throw new Error('ACLED credentials not configured');
  }

  const res = await fetch('https://acleddata.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: email,
      password: password,
      grant_type: 'password',
      client_id: 'acled',
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`ACLED auth failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const token = data.access_token;
  // Cache for 23 hours (tokens last 24h)
  tokenCache = { token, expiresAt: Date.now() + 23 * 60 * 60 * 1000 };
  return token;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || '';
  const country = searchParams.get('country') || '';
  const eventType = searchParams.get('event_type') || '';
  const limit = searchParams.get('limit') || '100';
  const days = searchParams.get('days') || '7';

  // Build cache key
  const cacheKey = `${region}|${country}|${eventType}|${limit}|${days}`;

  // Return cached data if fresh
  if (dataCache && dataCache.query === cacheKey && Date.now() - dataCache.timestamp < CACHE_TTL) {
    return NextResponse.json(dataCache.data);
  }

  try {
    const token = await getToken();

    // Calculate date range
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - parseInt(days) * 86400000).toISOString().split('T')[0];

    // Build ACLED query params
    const params = new URLSearchParams({
      _format: 'json',
      limit: limit,
      event_date: `${startDate}|${endDate}`,
      event_date_where: 'BETWEEN',
      order: 'event_date',
      sort: 'DESC',
    });

    if (region) params.set('region', region);
    if (country) params.set('country', country);
    if (eventType) params.set('event_type', eventType);

    const res = await fetch(`https://acleddata.com/api/acled/read?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      // If auth error, clear token cache
      if (res.status === 401 || res.status === 403) {
        tokenCache = null;
      }
      return NextResponse.json({
        events: [],
        error: `ACLED ${res.status}: ${text.slice(0, 200)}`,
        hint: res.status === 403 ? 'Josh may need to accept API terms at https://acleddata.com/myacled/' : undefined,
      });
    }

    const data = await res.json();
    const events = (data.data || []).map((e: Record<string, string>) => ({
      id: e.event_id_cnty || `acled-${Math.random().toString(36).slice(2)}`,
      event_date: e.event_date,
      event_type: e.event_type,
      sub_event_type: e.sub_event_type,
      country: e.country,
      region: e.region,
      latitude: parseFloat(e.latitude) || 0,
      longitude: parseFloat(e.longitude) || 0,
      fatalities: parseInt(e.fatalities) || 0,
      actor1: e.actor1,
      actor2: e.actor2,
      notes: e.notes,
      source: e.source,
    }));

    const result = {
      events,
      count: events.length,
      dateRange: { start: startDate, end: endDate },
      fetchedAt: new Date().toISOString(),
    };

    // Cache successful response
    dataCache = { query: cacheKey, data: result, timestamp: Date.now() };

    return NextResponse.json(result);
  } catch (err: any) {
    // Return stale cache if available
    if (dataCache) {
      return NextResponse.json({ ...dataCache.data as object, stale: true });
    }
    return NextResponse.json({ events: [], error: err.message });
  }
}
