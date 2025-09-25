# Admin reset endpoint for BeBuddy (Cloudflare Pages)

Path: `/api/admin/reset` (POST)

## Security
- Add a **Secret** binding in Pages → Settings → Variables & Secrets:
  - Name: `ADMIN_KEY`
  - Value: (choose a strong passphrase)
- The function expects the key via header `x-admin-key` **or** `?key=` query string.

## Usage
- Reset all counters:
  ```bash
  curl -X POST https://<your>.pages.dev/api/admin/reset -H "x-admin-key: <SECRET>"
  ```
- Reset a single file (e.g. bebuddy.zip):
  ```bash
  curl -X POST "https://<your>.pages.dev/api/admin/reset?file=bebuddy.zip" -H "x-admin-key: <SECRET>"
  ```

## Frontend (optional)
Listen for Shift+P, prompt for the key, call the endpoint:
```html
<script>
document.addEventListener('keydown', async (e) => {
  if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
    if (!confirm('Nulstil downloadtælling?')) return;
    const key = prompt('Admin nøgle:');
    if (!key) return;
    const res = await fetch('/api/admin/reset', { method:'POST', headers: { 'x-admin-key': key } });
    if (res.ok) { alert('Tælling nulstillet.'); location.reload(); }
    else { alert('Fejl/ikke autoriseret.'); }
  }
});
</script>
```
