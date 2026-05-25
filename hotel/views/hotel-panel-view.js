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

    // Fallback: getReservations ile tek seferlik yükleme (arsiv dahil)
    // Realtime listener başarısız olursa veya boş veri dönerse bu çalışır.
    function _fallbackLoad() {
      if (typeof getReservations !== "function") return;
      getReservations(date).then(rows => {
        const filtered = (rows || []).filter(r =>
          r.hotel && r.hotel.toLowerCase() === (_hotelName||"").toLowerCase()
        );
        _render(filtered);
      }).catch(err => {
        if (container) container.innerHTML =
          `<p style="color:#f87171;text-align:center;padding:20px">⚠️ Veri yüklenemedi. Lütfen sayfayı yenileyin.</p>`;
        if (typeof reportClientError === "function")
          reportClientError("HotelPanelView:fallbackLoad", err);
      });
    }

    // 8 saniye içinde veri gelmezse fallback'e düş
    const fallbackTimer = setTimeout(_fallbackLoad, 8000);

    _unsubscribe = HotelReservationService.subscribeForHotel(date, _hotelName, rows => {
      clearTimeout(fallbackTimer);

      // Realtime listener boş döndüyse ve geçmiş tarihse arsiv olabilir → fallback
      const today = new Date().toISOString().slice(0, 10);
      if ((!rows || rows.length === 0) && date < today) {
        _fallbackLoad();
        return;
      }

      _render(rows || []);
    });

    // Realtime abonelik hatası → fallback
    if (_unsubscribe && typeof _unsubscribe.catch === "function") {
      _unsubscribe.catch(() => {
        clearTimeout(fallbackTimer);
        _fallbackLoad();
      });
    }
  }

  function _render(rows) {
    const container = document.getElementById("hotelResContainer");
    if (!container) return;
    const sorted = HotelUtils.sortByTime(rows);
    HotelReservationCard.renderList(container, sorted, {
      onEdit:   (r)  => window.editRes   && window.editRes(r),
      onCancel: (id) => window.cancelRes && window.cancelRes(id),
      onDelete: (id) => window.deleteRes && window.deleteRes(id),
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
