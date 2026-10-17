(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) { return; }

  var currentLanguage = script.dataset.currentLanguage;
  var isDefaultEntry = script.dataset.defaultEntry === 'true';
  var initialUrl = window.location.href;
  var preferenceKey = 'junguangjia-language';
  var countryKey = 'junguangjia-country';
  var languageLinks = document.querySelectorAll('a[data-site-language]');
  var targets = Object.create(null);
  var cancelled = false;

  Array.prototype.forEach.call(languageLinks, function (link) {
    var target = new URL(link.href, initialUrl);
    if (target.origin === window.location.origin) {
      targets[link.dataset.siteLanguage] = target.href;
    }
  });

  function readStorage(storageName, key) {
    try { return window[storageName].getItem(key); } catch (error) { return null; }
  }

  function writeStorage(storageName, key, value) {
    try { window[storageName].setItem(key, value); } catch (error) { /* Storage may be disabled. */ }
  }

  function rememberLanguage(language) {
    if (targets[language]) { writeStorage('localStorage', preferenceKey, language); }
  }

  function navigate(language, explicit) {
    if (!targets[language] || currentLanguage === language) { return; }
    var target = new URL(targets[language]);
    target.search = window.location.search;
    target.hash = window.location.hash;
    if (!explicit) { target.searchParams.delete('lang'); }
    window.location.replace(target.href);
  }

  /* Remember real choices, and never interrupt a visitor who has started navigating. */
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('a') : null;
    if (!link) { return; }
    cancelled = true;
    rememberLanguage(link.dataset.siteLanguage);
  }, true);

  var menu = document.querySelector('.lang-switch');
  if (menu) {
    menu.addEventListener('toggle', function () {
      if (menu.open) { cancelled = true; }
    });
  }

  /* The query also preserves an English choice when links open in a new tab or storage is blocked. */
  var explicitLanguage = new URL(initialUrl).searchParams.get('lang');
  if (targets[explicitLanguage]) {
    rememberLanguage(explicitLanguage);
    navigate(explicitLanguage, true);
    return;
  }

  /* Shared links to translated pages or English subpages keep their requested language. */
  if (!isDefaultEntry || currentLanguage !== 'en') { return; }

  var preference = readStorage('localStorage', preferenceKey);
  if (targets[preference]) {
    navigate(preference, false);
    return;
  }

  function applyCountry(country) {
    if (country === 'CN' && !cancelled && !(menu && menu.open) && window.location.href === initialUrl &&
        !targets[readStorage('localStorage', preferenceKey)]) {
      navigate('zh', false);
    }
  }

  var cached;
  try { cached = JSON.parse(readStorage('sessionStorage', countryKey)); } catch (error) { /* Ignore invalid cache. */ }
  if (cached && (cached.country === null || /^[A-Z]{2}$/.test(cached.country))) {
    var age = Date.now() - cached.at;
    var ttl = cached.country === null ? 5 * 60 * 1000 : 30 * 60 * 1000;
    if (age >= 0 && age < ttl) {
      applyCountry(cached.country);
      return;
    }
  }

  if (typeof window.fetch !== 'function') { return; }

  /* GitHub Pages has no request-country header. Read only Cloudflare's country code,
     with a hard deadline; never hide content or store the visitor's IP address. */
  (async function () {
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer;
    var country = null;
    try {
      var timeout = new Promise(function (resolve) {
        timer = window.setTimeout(function () {
          if (controller) { controller.abort(); }
          resolve(null);
        }, 1800);
      });
      var lookup = window.fetch('https://www.cloudflare.com/cdn-cgi/trace', {
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        signal: controller ? controller.signal : undefined
      }).then(function (response) {
        if (!response.ok) { return null; }
        return response.text().then(function (text) {
          var match = text.match(/^loc=([A-Z]{2})\r?$/m);
          return match && match[1] !== 'XX' ? match[1] : null;
        });
      }).catch(function () { return null; });
      country = await Promise.race([lookup, timeout]);
    } catch (error) { /* A failed lookup leaves the requested page usable. */ }
    finally { window.clearTimeout(timer); }
    writeStorage('sessionStorage', countryKey, JSON.stringify({ country: country, at: Date.now() }));
    applyCountry(country);
  })();
})();
