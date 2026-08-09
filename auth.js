const AUTH_HASH = "14c28d58ec72d7ea13893b3007bcc01c7c69e8bdd98b89668a8e1c7a10351438";

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function isAuthed() {
  return sessionStorage.getItem("qm_auth") === "1";
}

function showGate() {
  document.body.style.visibility = "hidden";
  const overlay = document.createElement("div");
  overlay.id = "auth-gate";
  overlay.innerHTML = `
    <div style="position:fixed;inset:0;background:#0b1120;display:flex;align-items:center;justify-content:center;z-index:99999;font-family:-apple-system,Helvetica,Arial,sans-serif">
      <div style="background:#1e293b;padding:40px 48px;border-radius:16px;text-align:center;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,.5)">
        <div style="font-size:28px;font-weight:800;color:#60a5fa;margin-bottom:4px">Quantum Materials</div>
        <div style="font-size:14px;color:#94a3b8;margin-bottom:28px">Explorer — EPiQS 2026</div>
        <input id="auth-pw" type="password" placeholder="Enter password" autofocus
          style="width:100%;padding:12px 16px;font-size:15px;border:2px solid #334155;border-radius:8px;background:#0f172a;color:#e2e8f0;outline:none;margin-bottom:12px;box-sizing:border-box">
        <div id="auth-err" style="color:#ef4444;font-size:13px;height:20px;margin-bottom:8px"></div>
        <button id="auth-btn" style="width:100%;padding:12px;font-size:14px;font-weight:700;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;transition:opacity .15s">Enter</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.visibility = "visible";

  const pwInput = document.getElementById("auth-pw");
  const errDiv = document.getElementById("auth-err");
  const btn = document.getElementById("auth-btn");

  async function tryAuth() {
    const hash = await sha256(pwInput.value);
    if (hash === AUTH_HASH) {
      sessionStorage.setItem("qm_auth", "1");
      overlay.remove();
      document.body.style.visibility = "visible";
    } else {
      errDiv.textContent = "Incorrect password";
      pwInput.value = "";
      pwInput.focus();
    }
  }
  btn.addEventListener("click", tryAuth);
  pwInput.addEventListener("keydown", e => { if (e.key === "Enter") tryAuth(); });
}

if (!isAuthed()) showGate();
