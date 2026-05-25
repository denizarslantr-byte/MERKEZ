// manager/services/manager-service.js
// Manager ekranı servis katmanı — bölge/tarih bazlı rezervasyon dinleme

"use strict";

const ManagerService = (() => {

  function subscribeDate(date, onData) {
    if (typeof listenReservations !== "function") return () => {};
    let unsub = null;
    listenReservations(date, onData)
      .then(u => { unsub = u; })
      .catch(err => {
        if (typeof reportClientError === "function")
          reportClientError("ManagerService:subscribeDate", err);
      });
    return () => { if (typeof unsub === "function") unsub(); };
  }

  return { subscribeDate };
})();

window.ManagerService = ManagerService;
