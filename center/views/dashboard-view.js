// center/views/dashboard-view.js
// Merkez Dashboard ana view orkestratörü
// center/dashboard.html tarafından yüklenir.
// Bağımlılıklar: ReservationService, HotelService, ReservationTable, Toast, DateUtils, FormatUtils

"use strict";

const DashboardView = (() => {
  let _currentDate = null;
  let _unsubscribe = null; // aktif realtime listener'ı temizlemek için

  function init(initialDate) {
    _currentDate = initialDate || DateUtils.todayISO();
    _subscribeDate(_currentDate);
  }

  // Tarih değiştirme — önceki listener kapatılır, yeni tarih dinlenir
  function changeDate(newDate) {
    if (!DateUtils.isValidISO(newDate)) return;
    if (_currentDate === newDate) return;
    if (typeof _unsubscribe === "function") _unsubscribe();
    _currentDate = newDate;
    _subscribeDate(newDate);
  }

  function _subscribeDate(date) {
    const container = document.getElementById("rezTableContainer");
    if (container) container.innerHTML = `<p style="color:#888;text-align:center;padding:20px">Yükleniyor...</p>`;
    _unsubscribe = ReservationService.subscribe(date, (rows) => {
      if (container) {
        ReservationTable.render(container, rows, {
          onEdit:    (id) => _handleEdit(id, rows),
          onDelete:  (id) => _handleDelete(date, id),
          onArchive: (id) => _handleArchive(date, id),
        });
      }
    });
  }

  async function _handleDelete(date, id) {
    if (!confirm("Bu rezervasyonu silmek istediğinizden emin misiniz?")) return;
    try {
      await ReservationService.remove(date, id);
      Toast.show("✅ Silindi");
    } catch(e) {
      Toast.show("❌ Silinemedi", "err");
      if (typeof reportClientError === "function") reportClientError("DashboardView:delete", e);
    }
  }

  async function _handleArchive(date, id) {
    if (!confirm("Rezervasyon arşive taşınsın mı?")) return;
    try {
      await ReservationService.archive(date, id);
      Toast.show("✅ Arşivlendi");
    } catch(e) {
      Toast.show("❌ Arşivlenemedi", "err");
      if (typeof reportClientError === "function") reportClientError("DashboardView:archive", e);
    }
  }

  function _handleEdit(id, rows) {
    // Edit modal — mevcut dashboard.html'deki modal mantığını çağır
    const rez = rows.find(r => (r.id || r._key) === id);
    if (!rez) return;
    if (typeof openEditModal === "function") openEditModal(rez);
  }

  return { init, changeDate };
})();

window.DashboardView = DashboardView;
