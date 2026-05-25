// center/components/toast.js
// Hafif toast bildirim bileşeni
// Kullanım: Toast.show("Mesaj", "ok"|"err"|"info", 3000)
// window.showToast alias ile de çalışır (geriye uyumluluk)

"use strict";

const Toast = (() => {
  let _container = null;

  function _getContainer() {
    if (_container) return _container;
    _container = document.createElement("div");
    _container.style.cssText = "position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
    document.body.appendChild(_container);
    return _container;
  }

  function show(msg, type = "ok", duration = 3500) {
    const c = _getContainer();
    const el = document.createElement("div");
    const colors = {
      ok:   { bg: "rgba(20,83,45,.97)",  border: "rgba(34,197,94,.5)",  text: "#bbf7d0" },
      err:  { bg: "rgba(83,20,20,.97)",  border: "rgba(239,68,68,.5)",  text: "#fca5a5" },
      info: { bg: "rgba(20,40,83,.97)",  border: "rgba(99,179,255,.5)", text: "#bfdbfe" },
    };
    const col = colors[type] || colors.ok;
    el.style.cssText = `background:${col.bg};border:1px solid ${col.border};color:${col.text};
      padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;
      box-shadow:0 4px 16px rgba(0,0,0,.5);pointer-events:auto;opacity:1;transition:opacity .3s;`;
    el.textContent = msg;
    c.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 320);
    }, duration);
  }

  return { show };
})();

window.Toast = Toast;
// Geriye uyumluluk — eski showToast("msg") ve showToast("msg","err") çağrıları çalışmaya devam eder
window.showToast = (msg, type) => Toast.show(msg, type === "err" ? "err" : "ok");
