// hotel/components/hotel-reservation-card.js
// Otel paneli rezervasyon kart listesi bileşeni
// Kullanım: HotelReservationCard.renderList(container, reservations, options)

"use strict";

const HotelReservationCard = (() => {
  function _esc(s) {
    return String(s ?? "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;");
  }

  // options: { onEdit, onCancel, onDelete }
  function renderList(container, reservations, options = {}) {
    if (!container) return;

    // Özet satırı
    const summaryEl = document.getElementById("listSummary");
    if (summaryEl) {
      const total  = reservations.length;
      const totalPax = reservations.reduce((s,r) => s + (Number(r.adult)||0) + (Number(r.child)||0), 0);
      const inside = reservations.filter(r => String(r.girdi).toUpperCase()==="TRUE" && String(r.cikti).toUpperCase()!=="TRUE").length;
      const done   = reservations.filter(r => String(r.cikti).toUpperCase()==="TRUE").length;
      summaryEl.innerHTML =
        `<span class="badge updated">${total} rezervasyon</span>` +
        `<span class="badge pending">${totalPax} kişi</span>` +
        (inside ? `<span class="badge entered">${inside} içeride</span>` : "") +
        (done   ? `<span class="badge exited">${done} tamamlandı</span>` : "");
    }

    if (!reservations || !reservations.length) {
      container.innerHTML = `
        <div style="text-align:center;color:var(--text2);padding:28px">
          <div style="font-size:32px;margin-bottom:8px">📭</div>
          Rezervasyon bulunamadı.
        </div>`;
      return;
    }

    container.innerHTML = reservations.map(r => _buildCard(r, options)).join("");
  }

  function _buildCard(r, opts) {
    const exited    = String(r.cikti).toUpperCase() === "TRUE";
    const inside    = String(r.girdi).toUpperCase() === "TRUE" && !exited;
    const cancelled = r.status === "CANCELLED";
    const totalPax  = (Number(r.adult)||0) + (Number(r.child)||0);

    // Merkez işlem yaptıysa otel düzenleyemez
    const hasCenterOp = inside || exited ||
      String(r.girdi).toUpperCase()==="TRUE" || String(r.cikti).toUpperCase()==="TRUE" ||
      [r.staff1,r.staff2,r.staff3,r.staff4,r.ayak,r.plaka,r.kart].some(Boolean);
    const canEdit   = !cancelled && !hasCenterOp;
    const canCancel = !cancelled && !hasCenterOp;
    const canDelete = !cancelled && !hasCenterOp;

    const borderColor = exited?"#35d979" : inside?"#f59e0b" : cancelled?"#555" : "#3a3f5c";
    let statusEl;
    if (exited)          statusEl = '<span class="badge exited">✅ TAMAMLANDI</span>';
    else if (inside)     statusEl = '<span class="badge entered">🟠 İÇERİDE</span>';
    else if (cancelled)  statusEl = '<span class="badge cancelled">❌ İPTAL</span>';
    else                 statusEl = '<span class="badge pending">⏳ BEKLİYOR</span>';

    const safeR = JSON.stringify(r).replace(/'/g,"&#39;");

    const editBtn   = canEdit   ? `<button class="btn-blue btn-sm" onclick='HotelReservationCard._edit(${safeR})'>✏️ Düzelt</button>` : "";
    const cancelBtn = canCancel ? `<button class="btn-red  btn-sm" onclick="HotelReservationCard._cancel('${_esc(r.id)}')">❌ İptal</button>` : "";
    const deleteBtn = canDelete
      ? `<button class="btn-red btn-sm" style="background:rgba(80,0,0,.9)" onclick="HotelReservationCard._delete('${_esc(r.id)}')">🗑 Sil</button>`
      : `<span class="badge entered">🔒 Merkez işlem yaptı</span>`;

    return `
      <div class="res-card" style="border-left:4px solid ${borderColor};${cancelled?"opacity:.55":""}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="res-time">${_esc(r.time)}</div>
            <div style="font-size:11px;color:var(--text2)">${_esc(r.date)}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${statusEl}</div>
        </div>
        <div style="font-size:14px;font-weight:700;margin-bottom:8px">
          👤 ${totalPax} kişi
          ${Number(r.child)>0?`<span style="font-size:12px;font-weight:400;color:var(--text2);margin-left:6px">(${_esc(r.adult)} yet. / ${_esc(r.child)} çoc.)</span>`:""}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <span style="background:rgba(255,255,255,.06);border-radius:6px;padding:4px 10px;font-size:12px">🌍 ${_esc(r.nation||"—")}</span>
          ${r.kart ? `<span style="background:rgba(255,255,255,.06);border-radius:6px;padding:4px 10px;font-size:12px">💳 ${_esc(r.kart)}</span>` : ""}
          ${r.ayak ? `<span style="background:rgba(255,255,255,.06);border-radius:6px;padding:4px 10px;font-size:12px">🚗 ${_esc(r.ayak)}</span>` : ""}
        </div>
        ${r.notes ? `<div class="res-detail" style="font-style:italic;margin-bottom:8px">📝 ${_esc(r.notes)}</div>` : ""}
        <div class="res-actions">${editBtn} ${cancelBtn} ${deleteBtn}</div>
      </div>`;
  }

  return { renderList };
})();

// Callback bridge — HTML onclick'ten global callback'e köprü
// (IIFE dışında olmalı: const TDZ hatası önlemek için)
HotelReservationCard._edit   = (r)  => window.editRes   && window.editRes(r);
HotelReservationCard._cancel = (id) => window.cancelRes && window.cancelRes(id);
HotelReservationCard._delete = (id) => window.deleteRes && window.deleteRes(id);

window.HotelReservationCard = HotelReservationCard;
