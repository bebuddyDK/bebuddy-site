// get/bebuddy_count.js
// Counts a download in your backend (D1) and then navigates to the real asset.
// Usage: add data attributes on your links:
//   <a href="https://github.com/.../releases/tag/v2.0"
//      data-dl="bebuddy_v2.0.zip"
//      data-asset="https://github.com/.../releases/download/v2.0/bebuddy_v2.0.zip">
//      Download
//   </a>
// Include this script on your page: <script src="/get/bebuddy_count.js" defer></script>

(() => {
  const SELECTOR = 'a[data-dl]';
  const HIT_ENDPOINT = '/api/stats/hit'; // Same origin endpoint that increments D1

  function hitCounter(file, extra) {
    const payload = { file, event: 'download', ...extra };
    let sent = false;

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        sent = navigator.sendBeacon(HIT_ENDPOINT, blob);
      }
    } catch (_) {}

    if (!sent) {
      // Fallback using keepalive fetch
      fetch(HIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: 'same-origin',
        cache: 'no-store',
      }).catch(() => {
        // Last-resort GET fallback if POST not supported server-side
        const url = HIT_ENDPOINT + '?event=download&file=' + encodeURIComponent(file);
        fetch(url, {
          method: 'GET',
          keepalive: true,
          credentials: 'same-origin',
          cache: 'no-store',
        }).catch(() => {});
      });
    }
  }

  function onDownloadClick(e) {
    const a = e.currentTarget;
    const file = a.getAttribute('data-dl') || 'download.zip';
    const asset = a.getAttribute('data-asset') || a.href;

    // Count
    hitCounter(file, {
      path: location.pathname + location.search,
      ref: document.referrer || '',
    });

    // Navigate to the actual asset (same tab)
    e.preventDefault();
    // Small delay gives sendBeacon time to flush
    setTimeout(() => { window.location.href = asset; }, 40);
  }

  function init() {
    document.querySelectorAll(SELECTOR).forEach(a => {
      a.addEventListener('click', onDownloadClick, { passive: false });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();