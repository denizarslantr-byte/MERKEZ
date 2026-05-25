// manager/utils/manager-utils.js
// Manager ekranı yardımcıları

"use strict";

const ManagerUtils = (() => {
  function esc(s) {
    return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // Manager'ın yetkili olduğu otel adını oku
  function getManagerHotel() {
    return localStorage.getItem("managerHotel") || sessionStorage.getItem("managerHotel") || null;
  }

  function saveManagerHotel(name) {
    localStorage.setItem("managerHotel", name);
  }

  return { esc, getManagerHotel, saveManagerHotel };
})();

window.ManagerUtils = ManagerUtils;
