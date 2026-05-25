// center/utils/format-utils.js
// String formatlama ve güvenli render yardımcıları

"use strict";

const FormatUtils = (() => {
  // XSS-güvenli HTML escape — UI render'dan önce MUTLAKA geçir
  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&#x27;");
  }

  // Yetişkin + çocuk sayısını kısa formatta göster: "2+1"
  function paxLabel(adult, child) {
    const a = parseInt(adult, 10) || 0;
    const c = parseInt(child,  10) || 0;
    if (c > 0) return `${a}+${c}`;
    return String(a);
  }

  // Durum badge rengi
  function statusColor(status) {
    const map = {
      CONFIRMED: "#22c55e",
      PENDING:   "#f59e0b",
      CANCELLED: "#ef4444",
      DONE:      "#6b7280"
    };
    return map[String(status).toUpperCase()] || "#6b7280";
  }

  return { esc, paxLabel, statusColor };
})();

window.FormatUtils = FormatUtils;
