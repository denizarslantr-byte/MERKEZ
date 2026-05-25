// hotel/services/hotel-reservation-service.js
// Otel Paneli — Rezervasyon Servis Katmanı
// listenReservations() otel adına göre filtreler ve realtime callback sağlar.

"use strict";

const HotelReservationService = (() => {

  // Otel adına göre filtrelenmiş realtime listener.
  // Dönüş: unsub() fonksiyonu
  function subscribeForHotel(date, hotelName, onData) {
    if (typeof listenReservations !== "function") {
      console.error("HotelReservationService: listenReservations bulunamadı");
      // Fallback: tek seferlik yükleme
      if (typeof getReservations === "function") {
        getReservations(date).then(rows => {
          const filtered = (rows || []).filter(r =>
            r.hotel && r.hotel.toLowerCase() === (hotelName||"").toLowerCase()
          );
          onData(filtered);
        }).catch(err => {
          if (typeof reportClientError === "function")
            reportClientError("HotelReservationService:fallback", err);
        });
      }
      return () => {};
    }

    let unsub = null;
    listenReservations(date, allRows => {
      const filtered = (allRows || []).filter(r =>
        r.hotel && r.hotel.toLowerCase() === (hotelName||"").toLowerCase()
      );
      onData(filtered);
    }).then(u => { unsub = u; })
      .catch(err => {
        if (typeof reportClientError === "function")
          reportClientError("HotelReservationService:subscribe", err);
      });

    return () => { if (typeof unsub === "function") unsub(); };
  }

  // Rezervasyon durumunu güncelle
  async function updateStatus(date, id, status) {
    if (typeof updateReservation !== "function") throw new Error("updateReservation bulunamadı");
    return await updateReservation(date, id, { status });
  }

  // Çıkış saatini kaydet
  async function updateCheckout(date, id, ciktiSaati) {
    if (typeof updateReservation !== "function") throw new Error("updateReservation bulunamadı");
    return await updateReservation(date, id, { ciktiSaati });
  }

  return { subscribeForHotel, updateStatus, updateCheckout };
})();

window.HotelReservationService = HotelReservationService;
