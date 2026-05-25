// hotel/services/hotel-reservation-service.js
"use strict";

const HotelReservationService = (() => {

  function subscribeForHotel(date, hotelName, onData) {

    function _oneTimeLoad() {
      if (typeof getReservations !== "function") { onData([]); return; }
      getReservations(date)
        .then(rows => {
          onData((rows || []).filter(r =>
            r.hotel && r.hotel.toLowerCase() === (hotelName||"").toLowerCase()
          ));
        })
        .catch(() => onData([]));
    }

    if (typeof listenReservations !== "function") {
      _oneTimeLoad();
      return () => {};
    }

    let unsub = null;
    listenReservations(date, allRows => {
      const filtered = (allRows || []).filter(r =>
        r.hotel && r.hotel.toLowerCase() === (hotelName||"").toLowerCase()
      );

      // Realtime boş döndü + geçmiş tarih → arsiv'de olabilir, getReservations dene
      const today = new Date().toISOString().slice(0, 10);
      if (filtered.length === 0 && date < today) {
        _oneTimeLoad();
      } else {
        onData(filtered);
      }
    })
    .then(u => { unsub = u; })
    .catch(() => {
      // Realtime başarısız → tek seferlik yükleme
      _oneTimeLoad();
    });

    return () => { if (typeof unsub === "function") unsub(); };
  }

  // Düzeltildi: updateReservation(id, data) — 2 parametre imzası
  async function updateStatus(date, id, status) {
    if (typeof updateReservation !== "function") throw new Error("updateReservation bulunamadı");
    return await updateReservation(id, { date, status });
  }

  async function updateCheckout(date, id, ciktiSaati) {
    if (typeof updateReservation !== "function") throw new Error("updateReservation bulunamadı");
    return await updateReservation(id, { date, ciktiSaati });
  }

  return { subscribeForHotel, updateStatus, updateCheckout };
})();

window.HotelReservationService = HotelReservationService;
