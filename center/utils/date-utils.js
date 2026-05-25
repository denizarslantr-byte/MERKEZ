// center/utils/date-utils.js
// Tarih/saat yardımcıları — tüm center ekranları paylaşır

"use strict";

const DateUtils = (() => {
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDisplay(isoDate) {
    if (!isoDate) return "";
    const [y, m, d] = isoDate.split("-");
    return `${d}.${m}.${y}`;
  }

  function isValidISO(val) {
    return /^\d{4}-\d{2}-\d{2}$/.test(val);
  }

  function isValidTime(val) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(val);
  }

  // Saat dilimi: "09:00" → dakika sayısı (sıralama için)
  function timeToMinutes(t) {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  }

  return { todayISO, formatDisplay, isValidISO, isValidTime, timeToMinutes };
})();

window.DateUtils = DateUtils;
