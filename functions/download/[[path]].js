export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const filePath = url.pathname.replace(/^\/download\//, "");
  try {
    await env.DB
      .prepare(`
        INSERT INTO downloads (file, count, last_at)
        VALUES (?, 1, datetime('now'))
        ON CONFLICT(file) DO UPDATE SET
          count = count + 1,
          last_at = excluded.last_at
      `)
      .bind(filePath)
      .run();
  } catch (err) {
    console.error("Download counter error:", err);
  }
  const assetURL = new URL(request.url);
  assetURL.pathname = `/download/${filePath}`;
  return env.ASSETS.fetch(assetURL);
}