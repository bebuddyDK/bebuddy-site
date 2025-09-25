export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  const key = request.headers.get("x-admin-key") || url.searchParams.get("key");
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const file = url.searchParams.get("file"); // optional: only reset one file
  if (file) {
    await env.DB.prepare("UPDATE downloads SET count = 0, last_at = NULL WHERE file = ?").bind(file).run();
  } else {
    await env.DB.prepare("DELETE FROM downloads").run(); // reset all
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}