const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(new URL('../assets/js/language-default.js', `file://${__filename}`), 'utf8');
const preferenceKey = 'junguangjia-language';
const countryKey = 'junguangjia-country';

function visit(options = {}) {
  const origin = 'https://junguangjia.github.io';
  const url = new URL(options.path || '/', origin);
  const current = options.current || 'en';
  const stored = new Map(Object.entries(options.preferences || {}));
  const cached = new Map(Object.entries(options.cache || {}));
  const listeners = {};
  const menuListeners = {};
  const redirects = [];
  const requests = [];
  const timers = new Map();
  const links = ['en', 'fr', 'ja', 'zh'].map(language => ({
    dataset: { siteLanguage: language },
    href: `${origin}${language === 'en' ? '/' : `/${language}/`}?lang=${language}`
  }));
  const storage = values => ({
    getItem(key) { if (options.blockStorage) throw new Error('blocked'); return values.get(key) ?? null; },
    setItem(key, value) { if (options.blockStorage) throw new Error('blocked'); values.set(key, value); }
  });
  const location = { href: url.href, origin, search: url.search, hash: url.hash,
    replace(target) { redirects.push(target); } };
  const menu = { open: false, addEventListener(name, listener) { menuListeners[name] = listener; } };
  const window = {
    location, localStorage: storage(stored), sessionStorage: storage(cached),
    setTimeout(callback) { const id = timers.size + 1; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    fetch(endpoint, settings) {
      requests.push({ endpoint, settings });
      if (options.fetch) return options.fetch(endpoint, settings);
      if (options.fail) return Promise.reject(new Error('offline'));
      return Promise.resolve({ ok: options.ok !== false,
        text: async () => options.body ?? `loc=${options.country || 'US'}\n` });
    }
  };
  const document = {
    currentScript: { dataset: { currentLanguage: current,
      defaultEntry: options.defaultEntry === false ? 'false' : 'true' } },
    querySelectorAll() { return links; },
    querySelector() { return menu; },
    addEventListener(name, listener) { listeners[name] = listener; }
  };
  vm.runInNewContext(source, { window, document, URL, AbortController, Date, Promise });
  return { redirects, requests, stored, cached, location, timers,
    click(language) { listeners.click({ target: { closest: () => links.find(link => link.dataset.siteLanguage === language) } }); },
    openMenu(dispatchToggle = true) { menu.open = true; if (dispatchToggle) menuListeners.toggle(); } };
}

async function settle() { await new Promise(resolve => setImmediate(resolve)); }

test('a mainland network defaults to the existing Chinese home, preserving query and anchor', async () => {
  const page = visit({ country: 'CN', path: '/?ref=cv#education' });
  await settle();
  assert.deepEqual(page.redirects, ['https://junguangjia.github.io/zh/?ref=cv#education']);
  assert.equal(page.requests[0].endpoint, 'https://www.cloudflare.com/cdn-cgi/trace');
  assert.equal(page.requests[0].settings.credentials, 'omit');
  assert.equal(page.requests[0].settings.cache, 'no-store');
  assert.equal(page.requests[0].settings.referrerPolicy, 'no-referrer');
  assert.deepEqual(JSON.parse(page.cached.get(countryKey)).country, 'CN');
  assert.equal(page.stored.size, 0, 'automatic location must not become a manual language choice');
});

test('a country outside mainland China retains the English home', async () => {
  for (const country of ['US', 'FR', 'HK', 'TW']) {
    const page = visit({ country });
    await settle();
    assert.deepEqual(page.redirects, []);
  }
});

test('a saved English preference takes precedence without any country request', async () => {
  const page = visit({ country: 'CN', preferences: { [preferenceKey]: 'en' } });
  await settle();
  assert.equal(page.requests.length, 0);
  assert.deepEqual(page.redirects, []);
});

test('a saved offered language is restored when returning to the neutral home', () => {
  const page = visit({ preferences: { [preferenceKey]: 'fr' } });
  assert.deepEqual(page.redirects, ['https://junguangjia.github.io/fr/']);
  assert.equal(page.requests.length, 0);
});

test('explicit English works with blocked storage, including a newly opened tab', async () => {
  const page = visit({ country: 'CN', path: '/?lang=en', blockStorage: true });
  await settle();
  assert.deepEqual(page.redirects, []);
  assert.equal(page.requests.length, 0);
});

test('an explicit language query changes page while retaining that explicit choice', () => {
  const page = visit({ path: '/zh/?lang=en', current: 'zh', defaultEntry: false, blockStorage: true });
  assert.deepEqual(page.redirects, ['https://junguangjia.github.io/?lang=en']);
  assert.equal(page.requests.length, 0);
});

test('direct translated links and English subpages are not automatically redirected', async () => {
  for (const [path, current] of [['/zh/', 'zh'], ['/fr/', 'fr'], ['/ja/', 'ja'], ['/research/', 'en']]) {
    const page = visit({ path, current, defaultEntry: false, country: 'CN' });
    await settle();
    assert.deepEqual(page.redirects, []);
    assert.equal(page.requests.length, 0);
  }
});

test('a cached country avoids another external lookup and stores no address', () => {
  const cached = JSON.stringify({ country: 'CN', at: Date.now() });
  const page = visit({ cache: { [countryKey]: cached } });
  assert.deepEqual(page.redirects, ['https://junguangjia.github.io/zh/']);
  assert.equal(page.requests.length, 0);
});

test('a failed, malformed, or unsuccessful lookup leaves the page usable', async () => {
  for (const option of [{ fail: true }, { ok: false }, { body: 'loc=XX\n' }, { body: '<html>blocked</html>' }]) {
    const page = visit(option);
    await settle();
    assert.deepEqual(page.redirects, []);
    assert.equal(JSON.parse(page.cached.get(countryKey)).country, null);
  }
});

test('the deadline prevents a late response from redirecting', async () => {
  let resolveRequest;
  const page = visit({ fetch: () => new Promise(resolve => { resolveRequest = resolve; }) });
  page.timers.values().next().value();
  await settle();
  resolveRequest({ ok: true, text: async () => 'loc=CN\n' });
  await settle();
  assert.deepEqual(page.redirects, []);
  assert.equal(JSON.parse(page.cached.get(countryKey)).country, null);
});

test('a manual language choice cancels a country lookup already in flight', async () => {
  let resolveRequest;
  const page = visit({ fetch: () => new Promise(resolve => { resolveRequest = resolve; }) });
  page.click('en');
  resolveRequest({ ok: true, text: async () => 'loc=CN\n' });
  await settle();
  assert.equal(page.stored.get(preferenceKey), 'en');
  assert.deepEqual(page.redirects, []);
});

test('opening the language menu does not get interrupted by a late automatic redirect', async () => {
  let resolveRequest;
  const page = visit({ fetch: () => new Promise(resolve => { resolveRequest = resolve; }) });
  page.openMenu();
  resolveRequest({ ok: true, text: async () => 'loc=CN\n' });
  await settle();
  assert.deepEqual(page.redirects, []);
});

test('an open language menu is respected before its asynchronous toggle event fires', async () => {
  let resolveRequest;
  const page = visit({ fetch: () => new Promise(resolve => { resolveRequest = resolve; }) });
  page.openMenu(false);
  resolveRequest({ ok: true, text: async () => 'loc=CN\n' });
  await settle();
  assert.deepEqual(page.redirects, []);
});

test('invalid or expired cached results trigger a fresh lookup', async () => {
  for (const cached of ['broken JSON', JSON.stringify({ country: 'CN', at: 1 })]) {
    const page = visit({ country: 'US', cache: { [countryKey]: cached } });
    await settle();
    assert.equal(page.requests.length, 1);
    assert.deepEqual(page.redirects, []);
  }
});
