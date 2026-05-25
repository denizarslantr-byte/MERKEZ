// center/services/hotel-service.js
// Otel listesi ve personel verisi — cache'li statik yükleyici

"use strict";

const HotelService = (() => {
  let _hotelsCache = null;
  let _staffCache  = null;

  async function getHotelList(forceRefresh = false) {
    if (_hotelsCache && !forceRefresh) return _hotelsCache;
    if (typeof getHotels !== "function") throw new Error("getHotels bulunamadı");
    _hotelsCache = await getHotels();
    return _hotelsCache;
  }

  async function getStaffList(forceRefresh = false) {
    if (_staffCache && !forceRefresh) return _staffCache;
    if (typeof getStaff !== "function") throw new Error("getStaff bulunamadı");
    _staffCache = await getStaff();
    return _staffCache;
  }

  function invalidate() { _hotelsCache = null; _staffCache = null; }

  return { getHotelList, getStaffList, invalidate };
})();

window.HotelService = HotelService;
