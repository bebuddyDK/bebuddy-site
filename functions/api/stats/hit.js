// functions/api/stats/hit.js
// Cloudflare Pages Function for POST /api/stats/hit
export async function onRequestPost({ request, env }) {
  let data = {};
  try { data = await request.json(); } catch {}
  const file  = (data.file  || "unknown").toString();
  const event = (data.event || "download").toString();
  const now = new Date().toISOString();

  const sql = `
    INSERT INTO downloads (file, count, last_at, event)
    VALUES (?, 1, ?, ?)
    ON CONFLICT(file) DO UPDATE SET
      count = count + 1,
      last_at = excluded.last_at,
      event = excluded.event
  `;
  await env.DB.prepare(sql).bind(file, now, event).run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
