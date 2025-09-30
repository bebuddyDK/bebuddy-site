// /get/bebuddy_count.js
(() => {
  const HIT_ENDPOINT = '/api/stats/hit';
  const ATTR_FILE  = 'data-dl';
  const ATTR_ASSET = 'data-asset';

  function isDL(el) { return el && el.tagName === 'A' && el.hasAttribute(ATTR_FILE); }
  function findAnchor(el) { while (el && el !== document) { if (isDL(el)) return el; el = el.parentNode; } return null; }

  function hitCounter(file, extra) {
    const payload = { file, event: 'download', ...extra };
    let sent = false;
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        sent = navigator.sendBeacon(HIT_ENDPOINT, blob);
      }
    } catch {}
    if (!sent) {
      fetch(HIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: 'same-origin',
        cache: 'no-store',
      }).catch(() => {
        const url = `${HIT_ENDPOINT}?event=download&file=${encodeURIComponent(file)}`;
        fetch(url, { method: 'GET', keepalive: true }).catch(() => {});
      });
    }
  }

  function onClick(e) {
    const a = findAnchor(e.target);
    if (!a) return;
    const file  = a.getAttribute(ATTR_FILE)  || 'download.zip';
    const asset = a.getAttribute(ATTR_ASSET) || a.href;

    hitCounter(file, { path: location.pathname + location.search, ref: document.referrer || '' });

    e.preventDefault();
    setTimeout(() => { window.location.href = asset; }, 40);
  }

  document.addEventListener('click', onClick, { capture: true });
})();
