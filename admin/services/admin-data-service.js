// admin/services/admin-data-service.js
// Admin paneli — otel, personel ve kullanıcı veri işlemleri

"use strict";

const AdminDataService = (() => {

  async function getHotels()  { return typeof getHotels  === "function" ? getHotels()  : []; }
  async function getStaff()   { return typeof getStaff   === "function" ? getStaff()   : []; }

  async function addHotel(data) {
    if (typeof _fbAddHotel !== "function") throw new Error("_fbAddHotel bulunamadı");
    return await _fbAddHotel(data);
  }

  async function deleteHotel(id) {
    if (typeof _fbDeleteHotel !== "function") throw new Error("_fbDeleteHotel bulunamadı");
    return await _fbDeleteHotel(id);
  }

  async function addStaff(data) {
    if (typeof window._fbAddStaff !== "function") throw new Error("_fbAddStaff bulunamadı");
    return await window._fbAddStaff(data);
  }

  async function deleteStaff(id) {
    if (typeof window._fbDeleteStaff !== "function") throw new Error("_fbDeleteStaff bulunamadı");
    return await window._fbDeleteStaff(id);
  }

  return { getHotels, getStaff, addHotel, deleteHotel, addStaff, deleteStaff };
})();

window.AdminDataService = AdminDataService;
