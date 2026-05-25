// center/services/reservation-service.js
// Merkez Operasyon — Rezervasyon Servis Katmanı
// firebase-api.js CRUD fonksiyonlarını saran modül.
// HTML sayfaları doğrudan firebase-api.js'i çağırmak yerine bu modülü kullanır.

"use strict";

const ReservationService = (() => {

  // Belirli bir gün için rezervasyonları realtime dinle.
  // onData(rows) — her Firebase değişiminde çağrılır.
  // Dönüş: unsub() fonksiyonu — listener'ı temizlemek için çağır.
  function subscribe(date, onData) {
    if (typeof listenReservations !== "function") {
      console.error("ReservationService: listenReservations bulunamadı");
      return () => {};
    }
    let unsub = null;
    listenReservations(date, onData)
      .then(u => { unsub = u; })
      .catch(err => {
        if (typeof reportClientError === "function")
          reportClientError("ReservationService:subscribe", err);
      });
    // Senkron unsub wrapper — Promise resolve'dan önce çağrılsa da güvenli
    return () => { if (typeof unsub === "function") unsub(); };
  }

  // Yeni rezervasyon ekle
  async function add(rezData) {
    if (typeof addReservation !== "function") throw new Error("addReservation bulunamadı");
    if (typeof sanitizeRez === "function") rezData = sanitizeRez(rezData);
    return await addReservation(rezData);
  }

  // Rezervasyon güncelle (kısmi patch)
  async function update(date, id, patch) {
    if (typeof updateReservation !== "function") throw new Error("updateReservation bulunamadı");
    if (typeof cleanReservationPatch === "function") patch = cleanReservationPatch(patch);
    return await updateReservation(date, id, patch);
  }

  // Rezervasyon sil
  async function remove(date, id) {
    if (typeof deleteReservation !== "function") throw new Error("deleteReservation bulunamadı");
    return await deleteReservation(date, id);
  }

  // Rezervasyonu arşive taşı
  async function archive(date, id) {
    if (typeof archiveReservation !== "function") throw new Error("archiveReservation bulunamadı");
    return await archiveReservation(date, id);
  }

  // Tek rezervasyon getir
  async function getByDate(date) {
    if (typeof getReservations !== "function") throw new Error("getReservations bulunamadı");
    return await getReservations(date);
  }

  return { subscribe, add, update, remove, archive, getByDate };
})();

window.ReservationService = ReservationService;
