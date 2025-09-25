# BeBuddy – Pages bundle (med admin-panel)

Upload denne ZIP til Cloudflare Pages (Direct Upload).

## Indhold
- `index.html` (one‑pager med logo, OFAT-tekst, admin-panel)
- `logo.png` (placeholder – erstat med dit logo)
- `download/bebuddy.zip` (dummy – erstat senere)
- `docs/lhs.pdf` og `docs/lhs.zip` (dummy – erstat senere)
- `functions/download/[[path]].js` (tæller downloads + serverer filen)
- `functions/api/stats.js` (JSON med downloadtal til admin-panelet)
- `migrations/0001_init.sql` (D1 database schema)

## For at tælle downloads
1) Cloudflare Dashboard → **D1** → *Create* → fx `bebuddy_db`.
2) Åbn DB → **Migrations** → indsæt `migrations/0001_init.sql`.
3) Gå til dit **Pages-projekt → Settings → Functions → D1 Databases → Add binding**:
   - Binding name: `DB`
   - Vælg databasen `bebuddy_db`.
4) Deploy igen (eller upload ZIP igen).

## Tjek downloads
- Besøg `/api/stats` (rå JSON) eller brug admin-panelet:
  - Åbn forsiden med `?admin=1` eller tryk **Shift+D** på forsiden.

Uploadtidspunkt: 2025-09-25T13:56:27.376309Z
