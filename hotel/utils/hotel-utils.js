// hotel/utils/hotel-utils.js
// Otel paneli yardımcıları

"use strict";

const HotelUtils = (() => {
  // localStorage'dan kayıtlı otel adını oku
  function getSavedHotelName() {
    return localStorage.getItem("otelAdi") || sessionStorage.getItem("otelAdi") || null;
  }

  function saveHotelName(name) {
    localStorage.setItem("otelAdi", name);
  }

  // Rezervasyonları saate göre sırala
  function sortByTime(list) {
    return [...list].sort((a, b) => String(a.time).localeCompare(String(b.time)));
  }

  return { getSavedHotelName, saveHotelName, sortByTime };
})();

window.HotelUtils = HotelUtils;
