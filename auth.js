/* Browser-level access gate. Static files remain public on GitHub Pages. */
(function() {
  'use strict';
  const AUTH_HASH = '14c28d58ec72d7ea13893b3007bcc01c7c69e8bdd98b89668a8e1c7a10351438';
  const KEY = 'qm_auth_v2';
  const SESSION_MS = 8 * 60 * 60 * 1000;
  let resolveReady;
  const ready = new Promise(resolve => { resolveReady = resolve; });
  const validSession = () => {
    try {
      const session = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      return session?.version === 2 && Number.isFinite(session.expires) && session.expires > Date.now() && session.expires <= Date.now() + SESSION_MS;
    } catch (_) { return false; }
  };
  function unlock() {
    document.getElementById('auth-gate')?.remove();
    document.documentElement.dataset.auth = 'unlocked';
    resolveReady();
  }
  function lock() {
    try { sessionStorage.removeItem(KEY); sessionStorage.removeItem('qm_auth'); } catch (_) {}
    location.reload();
  }
  window.QMAuth = {ready, lock};
  document.querySelectorAll('[data-lock-site]').forEach(button => button.addEventListener('click',lock));
  try { sessionStorage.removeItem('qm_auth'); } catch (_) {}
  if(validSession()) { unlock(); return; }
  const gate = document.createElement('div');
  gate.id = 'auth-gate';
  gate.innerHTML = `<form class="auth-card" aria-labelledby="auth-title">
    <div class="auth-eyebrow">EPiQS</div>
    <h1 id="auth-title">Quantum Materials Explorer</h1>
    <p>Enter the project password to continue.</p>
    <label for="auth-pw">Password</label>
    <input id="auth-pw" type="password" autocomplete="current-password" required>
    <p id="auth-err" role="alert" aria-live="polite"></p>
    <button id="auth-btn" type="submit">Unlock explorer</button>
  </form>`;
  document.body.appendChild(gate);
  const input = document.getElementById('auth-pw');
  const error = document.getElementById('auth-err');
  const button = document.getElementById('auth-btn');
  input.focus();
  gate.querySelector('form').addEventListener('submit',async event => {
    event.preventDefault();
    if(button.disabled) return;
    button.disabled = true; error.textContent = '';
    try {
      if(!globalThis.crypto?.subtle) throw new Error('secure-context');
      const bytes = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(input.value));
      const hash = Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
      if(hash !== AUTH_HASH) {
        error.textContent = 'Incorrect password. Please try again.';
        input.value = ''; input.focus();
        return;
      }
      try { sessionStorage.setItem(KEY,JSON.stringify({version:2,expires:Date.now()+SESSION_MS})); } catch (_) {}
      input.value = '';
      unlock();
      document.querySelector('main')?.focus({preventScroll:true});
    } catch (_) {
      error.textContent = 'Password verification is unavailable. Open this site over HTTPS or localhost and try again.';
    } finally { button.disabled = false; }
  });
})();
