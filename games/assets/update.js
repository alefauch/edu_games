// Vérifie périodiquement si GitHub Pages a publié une nouvelle version.
(function () {
  const build = window.BUILD_INFO;
  if (!build || !build.version) return;
  const mainPage = /\/(?:index\.html)?$/.test(location.pathname);
  let pending = null;
  const banner = document.createElement('aside');
  banner.id = 'update-banner';
  banner.style.cssText = 'display:none;position:fixed;bottom:12px;left:12px;right:12px;max-width:560px;margin:auto;z-index:9999;background:#fff;border:2px solid #4f6bff;border-radius:12px;padding:12px;box-shadow:0 4px 20px #0003;text-align:center';
  banner.innerHTML = '<span>Une nouvelle version est disponible. </span><button type="button" class="btn primary">Actualiser</button>';
  const refresh = (version) => {
    const url = new URL(location.href);
    url.searchParams.set('v', version);
    location.replace(url.href);
  };
  banner.querySelector('button').addEventListener('click', () => refresh(pending));
  document.body.appendChild(banner);

  const label = document.getElementById('build-info');
  if (label) {
    const date = new Date(build.builtAt);
    label.textContent = 'Version ' + build.version.slice(0, 7) + ' · ' +
      new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'medium', timeStyle: 'short' }).format(date) +
      ' (Paris)';
  }

  async function check() {
    if (pending || document.hidden) return;
    try {
      const response = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) return;
      const latest = await response.json();
      if (!latest.version || latest.version === build.version) return;
      pending = true;
      if (mainPage) location.reload();
      else banner.style.display = 'block'; // Ne jamais interrompre une partie.
    } catch (_) { /* hors ligne : on réessaiera */ }
  }
  setInterval(check, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
})();
