// admin/components/modal.js
// Yeniden kullanılabilir modal bileşeni
// Kullanım: Modal.open({ title, body, onConfirm, confirmLabel })

"use strict";

const Modal = (() => {
  function open({ title = "", body = "", onConfirm = null, confirmLabel = "Onayla", cancelLabel = "İptal" } = {}) {
    _cleanup();
    const overlay = document.createElement("div");
    overlay.id = "__modal_overlay__";
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <h3>${String(title)}</h3>
        <div id="__modal_body__">${body}</div>
        <div style="display:flex;gap:8px;margin-top:16px;justify-content:flex-end">
          <button class="btn-dark" onclick="Modal.close()">${cancelLabel}</button>
          ${onConfirm ? `<button class="btn-gold" id="__modal_confirm__">${confirmLabel}</button>` : ""}
        </div>
      </div>`;
    document.body.appendChild(overlay);
    if (onConfirm) {
      document.getElementById("__modal_confirm__").onclick = async () => {
        try { await onConfirm(); } catch(e) { /* caller handles */ }
      };
    }
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  }

  function close() { _cleanup(); }

  function _cleanup() {
    const el = document.getElementById("__modal_overlay__");
    if (el) el.remove();
  }

  return { open, close };
})();

window.Modal = Modal;
