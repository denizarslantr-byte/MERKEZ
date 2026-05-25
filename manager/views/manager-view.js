// manager/views/manager-view.js
// Manager ekranı view orkestratörü

"use strict";

const ManagerView = (() => {
  let _currentDate = null;
  let _unsubscribe = null;

  function init(initialDate) {
    _currentDate = initialDate || new Date().toISOString().slice(0, 10);
    _subscribe();
  }

  function changeDate(newDate) {
    if (_currentDate === newDate) return;
    if (typeof _unsubscribe === "function") _unsubscribe();
    _currentDate = newDate;
    _subscribe();
  }

  function _subscribe() {
    const container = document.getElementById("managerResContainer");
    if (container) container.innerHTML = `<p style="color:#888;text-align:center;padding:20px">Yükleniyor...</p>`;
    _unsubscribe = ManagerService.subscribeDate(_currentDate, (rows) => {
      _render(container, rows || []);
    });
  }

  function _render(container, rows) {
    if (!container) return;
    if (!rows.length) {
      container.innerHTML = `<p style="color:#888;text-align:center;padding:20px">Rezervasyon bulunamadı.</p>`;
      return;
    }
    const esc = ManagerUtils.esc;
    container.innerHTML = `
      <table class="table" style="width:100%;border-collapse:collapse">
        <thead><tr>
          <th>Saat</th><th>Otel</th><th>Pax</th><th>Durum</th><th>Not</th>
        </tr></thead>
        <tbody>${rows.map(r => `
          <tr>
            <td>${esc(r.time)}</td>
            <td>${esc(r.hotel)}</td>
            <td>${(parseInt(r.adult)||0) + (parseInt(r.child)||0)}</td>
            <td>${esc(r.status||"")}</td>
            <td>${esc(r.notes||r.note||"")}</td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  }

  return { init, changeDate };
})();

window.ManagerView = ManagerView;
