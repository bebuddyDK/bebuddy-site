export async function onRequestGet({ env }) {
  const { results } = await env.DB
    .prepare("SELECT file, count, last_at FROM downloads ORDER BY count DESC")
    .all();
  return new Response(JSON.stringify({ downloads: results || [] }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}