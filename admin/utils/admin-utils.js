// admin/utils/admin-utils.js
// Admin paneli yardımcı fonksiyonları

"use strict";

const AdminUtils = (() => {
  // Tablo satırı render için XSS-güvenli escape
  function esc(s) {
    return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // Durum etiketi
  function statusBadge(status) {
    const map = {
      ACTIVE:    { label:"Aktif",    color:"#22c55e" },
      INACTIVE:  { label:"Pasif",    color:"#6b7280" },
      DELETED:   { label:"Silindi",  color:"#ef4444" },
    };
    const s = map[String(status).toUpperCase()] || { label: status, color: "#888" };
    return `<span style="color:${s.color};font-weight:700">${esc(s.label)}</span>`;
  }

  // Form değerini oku ve temizle
  function getFieldValue(id, maxLen = 200) {
    const el = document.getElementById(id);
    return el ? String(el.value || "").trim().slice(0, maxLen) : "";
  }

  return { esc, statusBadge, getFieldValue };
})();

window.AdminUtils = AdminUtils;
