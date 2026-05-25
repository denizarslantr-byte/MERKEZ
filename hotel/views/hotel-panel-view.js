// hotel/views/hotel-panel-view.js
// Otel Paneli ana view orkestratörü
// Bağımlılıklar: HotelReservationService, HotelReservationCard, HotelUtils

"use strict";

const HotelPanelView = (() => {
  let _hotelName   = null;
  let _currentDate = null;
  let _unsubscribe = null;

  // Başlat — hotel/mobile-hotel-panel.html DOMContentLoaded'dan çağrılır
  function init(hotelName, initialDate) {
    _hotelName   = hotelName || HotelUtils.getSavedHotelName();
    _currentDate = initialDate || new Date().toISOString().slice(0, 10);
    if (!_hotelName) { _showNoHotel(); return; }
    _subscribe(_currentDate);
  }

  // Tarih değiştir — önceki listener kapatılır, yeni dinleme başlar
  function changeDate(newDate) {
    if (!newDate || _currentDate === newDate) return;
    _currentDate = newDate;
    _subscribe(newDate);
  }

  function _subscribe(date) {
    if (typeof _unsubscribe === "function") _unsubscribe();

    const container = document.getElementById("hotelResContainer");
    if (container) container.innerHTML = `<div style="text-align:center;color:var(--text2);padding:20px">Yükleniyor...</div>`;

    _unsubscribe = HotelReservationService.subscribeForHotel(date, _hotelName, rows => {
      const sorted = HotelUtils.sortByTime(rows);
      if (container) {
        HotelReservationCard.renderList(container, sorted, {
          onEdit:   (r)  => window.editRes   && window.editRes(r),
          onCancel: (id) => window.cancelRes && window.cancelRes(id),
          onDelete: (id) => window.deleteRes && window.deleteRes(id),
        });
      }
    });
  }

  function _showNoHotel() {
    const container = document.getElementById("hotelResContainer");
    if (container) container.innerHTML =
      `<p style="color:#f59e0b;text-align:center;padding:20px">⚠️ Otel adı tanımlanmamış. Lütfen giriş yapın.</p>`;
  }

  return { init, changeDate };
})();

window.HotelPanelView = HotelPanelView;
