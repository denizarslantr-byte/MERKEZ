// center/components/reservation-table.js
// Rezervasyon listesi tablo bileşeni
// Kullanım: ReservationTable.render(containerEl, reservations, options)

"use strict";

const ReservationTable = (() => {
  const _esc = (s) => FormatUtils ? FormatUtils.esc(s) : String(s ?? "");

  // Tabloyu bir DOM elementine render et
  // options: { onEdit, onDelete, onArchive, showHotel, showStatus }
  function render(container, reservations, options = {}) {
    if (!container) return;
    if (!reservations || !reservations.length) {
      container.innerHTML = `<p style="color:#888;text-align:center;padding:20px">Rezervasyon bulunamadı.</p>`;
      return;
    }

    const rows = reservations.map(r => _buildRow(r, options)).join("");
    container.innerHTML = `
      <table class="table" style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th>Saat</th>
            <th>Otel</th>
            <th>Pax</th>
            <th>Uyruk</th>
            <th>Personel</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function _buildRow(r, opts) {
    const statusColor = FormatUtils ? FormatUtils.statusColor(r.status) : "#888";
    const pax         = FormatUtils ? FormatUtils.paxLabel(r.adult, r.child) : (r.adult || "");
    const editBtn     = opts.onEdit    ? `<button class="btn-dark btn-sm" onclick="ReservationTable._edit('${_esc(r.id || r._key)}')">Düzenle</button>` : "";
    const delBtn      = opts.onDelete  ? `<button class="btn-red  btn-sm" onclick="ReservationTable._del('${_esc(r.id || r._key)}')">Sil</button>` : "";
    const archBtn     = opts.onArchive ? `<button class="btn-dark btn-sm" onclick="ReservationTable._arch('${_esc(r.id || r._key)}')">Arşiv</button>` : "";
    return `
      <tr>
        <td>${_esc(r.time)}</td>
        <td>${_esc(r.hotel)}</td>
        <td>${pax}</td>
        <td>${_esc(r.nation || r.nat || "")}</td>
        <td>${_esc([r.staff1,r.staff2,r.staff3,r.staff4].filter(Boolean).join(", "))}</td>
        <td><span style="color:${statusColor};font-weight:700">${_esc(r.status || "")}</span></td>
        <td class="action-cell" style="white-space:nowrap">${editBtn} ${delBtn} ${archBtn}</td>
      </tr>`;
  }

  // Callback kayıt — html onclick'ten erişmek için
  const _callbacks = {};
  function _register(key, fn) { _callbacks[key] = fn; }

  // _edit/_del/_arch burada closure içinde tanımlanır: TDZ yok, _callbacks erişilebilir
  return {
    render,
    _register,
    _edit:  (id) => _callbacks.onEdit    && _callbacks.onEdit(id),
    _del:   (id) => _callbacks.onDelete  && _callbacks.onDelete(id),
    _arch:  (id) => _callbacks.onArchive && _callbacks.onArchive(id),
  };
})();

window.ReservationTable = ReservationTable;
