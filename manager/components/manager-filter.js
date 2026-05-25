// manager/components/manager-filter.js
// Manager ekranı filtre bileşeni — tarih seçici + otel filtresi

"use strict";

const ManagerFilter = (() => {
  function render(container, onChange) {
    if (!container) return;
    const today = new Date().toISOString().slice(0, 10);
    container.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
        <label style="color:var(--gold2);font-size:13px">Tarih:</label>
        <input type="date" id="managerDatePicker" value="${today}"
          style="background:#1a1a1a;border:1px solid var(--border);color:#e5e5e5;padding:6px 10px;border-radius:8px;font-size:13px">
      </div>`;
    document.getElementById("managerDatePicker").addEventListener("change", (e) => {
      if (typeof onChange === "function") onChange(e.target.value);
    });
  }

  return { render };
})();

window.ManagerFilter = ManagerFilter;
