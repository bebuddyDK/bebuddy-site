// /functions/get/bebuddy.js
export async function onRequestGet({ env }) {
  // Navn på "fil"/target i din D1 – skift gerne navnet, hvis du vil
  const target = 'google_drive_folder';

  // Tilpas evt. tabel/kolonnenavne her, hvis din gamle tabel ikke hedder 'downloads'
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
    // Vi logger, men lader stadig brugeren komme videre til Drive
    console.error('DB error in /get/bebuddy:', e);
  }

  // Redirect til din offentlige Google Drive-mappe
  const driveUrl = 'https://drive.google.com/drive/folders/19YViyy-D3kVVO572zeP0-pJYm-1EKYx-?usp=sharing';
  return Response.redirect(driveUrl, 302);
}
