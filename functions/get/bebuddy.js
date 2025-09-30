// /functions/get/bebuddy.js
// Åbner Drive i en NY fane og sender den nuværende fane tilbage til forsiden.
// NOTE: Den sikreste måde at styre "ny fane" er at sætte target="_blank" på <a>-tagget.
// Denne server-side metode virker i de fleste browsere, men nogle popup-blokkere kan stoppe automatisk åbning.
// Vi viser derfor også et fallback-link.

export async function onRequestGet({ env }) {
  const target = 'google_drive_folder';
  const driveUrl = 'https://drive.google.com/drive/folders/19YViyy-D3kVVO572zeP0-pJYm-1EKYx-?usp=sharing';

  const sql = `
    INSERT INTO downloads (file, count, last_at)
    VALUES (?1, 1, datetime('now'))
    ON CONFLICT(file) DO UPDATE SET
      count = count + 1,
      last_at = datetime('now')
  `;

  try {
    await env.DB.prepare(sql).bind(target).run();
  } catch (e) {
    // Logger fejl, men fortsætter
    console.error('DB error in /get/bebuddy:', e);
  }

  const html = `<!doctype html>
<meta charset="utf-8">
<title>Åbner download…</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 24px;}
</style>
<script>
  (function(){
    try { window.open(${JSON.stringify(driveUrl)}, '_blank', 'noopener'); } catch(e) {}
    // Send den oprindelige fane tilbage til forsiden (kan ændres til en anden side hvis ønsket)
    try { window.location.replace('/'); } catch(e) {}
  })();
</script>
<p>Åbner download i en ny fane… Hvis intet sker, klik her:
  <a href="${driveUrl}" target="_blank" rel="noopener">Åbn manuelt</a>.
</p>`;

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}
