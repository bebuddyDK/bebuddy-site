// functions/api/admin/reset.js
// POST /api/admin/reset?key=...&file=... (file kan være "all")

export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  const key  = url.searchParams.get("key")  || "";
  const file = url.searchParams.get("file") || "";

  // Simpel "nøgle" – skift til din egen hemmelige streng
  const SECRET = "nulstil_tæller";
  if (key !== SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!env.DB) {
    return new Response("D1 binding 'DB' not found", { status: 500 });
  }

  // Understøt også JSON body som alternativ til query params
  if (!file) {
    try {
      const body = await request.json();
      if (body?.file) {
        url.searchParams.set("file", String(body.file));
      }
    } catch { /* ok hvis ingen JSON */ }
  }

  const target = url.searchParams.get("file") || file;
  if (!target) {
    return new Response("Missing 'file' (or use file=all)", { status: 400 });
  }

  try {
    if (target === "all") {
      await env.DB.prepare(
        "UPDATE downloads SET count = 0, last_at = NULL"
      ).run();
    } else {
      await env.DB.prepare(
        "UPDATE downloads SET count = 0, last_at = NULL WHERE file = ?"
      ).bind(target).run();
    }
    return new Response("OK");
  } catch (e) {
    return new Response("DB error: " + String(e), { status: 500 });
  }
}
