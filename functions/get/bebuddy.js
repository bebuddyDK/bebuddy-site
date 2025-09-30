// /functions/get/bebuddy.js
// Simpelt og robust: tæller i D1 og laver en 302-redirect.
// Åbn i ny fane styres fra HTML med target="_blank".

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
    // Logger men redirecter uanset hvad
    console.error('DB error in /get/bebuddy:', e);
  }

  return Response.redirect(driveUrl, 302);
}
