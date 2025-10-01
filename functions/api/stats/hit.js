// functions/api/stats/hit.js
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  // 1) parse input (POST JSON eller GET query)
  let file = 'unknown', event = 'download';
  if (method === 'POST') {
    try {
      const data = await request.json();
      if (data && typeof data === 'object') {
        if (data.file)  file  = String(data.file);
        if (data.event) event = String(data.event);
      }
    } catch (e) {
      return json({ ok: false, error: 'Invalid JSON body' }, 400);
    }
  } else if (method === 'GET') {
    file  = url.searchParams.get('file')  || file;
    event = url.searchParams.get('event') || event;
  } else {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  // 2) sanity checks
  if (!env.DB) return json({ ok: false, error: 'D1 binding "DB" not found' }, 500);

  // 3) ensure table exists (idempotent, let it run)
  try {
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS downloads (
        file TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0,
        last_at TEXT,
        event TEXT
      )
    `).run();
  } catch (e) {
    return json({ ok: false, error: 'Failed to ensure table', details: String(e) }, 500);
  }

  // 4) upsert
  const now = new Date().toISOString();
  try {
    const sql = `
      INSERT INTO downloads (file, count, last_at, event)
      VALUES (?, 1, ?, ?)
      ON CONFLICT(file) DO UPDATE SET
        count = count + 1,
        last_at = excluded.last_at,
        event = excluded.event
    `;
    await env.DB.prepare(sql).bind(file, now, event).run();
    return json({ ok: true, file, event, at: now });
  } catch (e) {
    return json({ ok: false, error: 'DB upsert failed', details: String(e) }, 500);
  }
}

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers }
  });
}
