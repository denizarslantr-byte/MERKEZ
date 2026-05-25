// Piano Deri — Mesajlaşma Modülü (merkez-1.4)
// ─────────────────────────────────────────────────────────────
// Her sayfaya <script src="../assets/messaging.js"></script> ile ekle
// Sayfa başında: initMessaging(role, identity, displayName) çağır
//   role:        "admin" | "merkez" | "otel"
//   identity:    "merkez" veya otel adı (otel için)
//   displayName: ekranda görünecek ad
//
// Entegre özellikler:
//   - _esc() XSS koruması (merkez-1.3'ten korundu)
//   - 3× retry + timeout handling + buton disable/enable (merged'den alındı)
//   - Hata loglaması reportClientError() ile entegre
// ─────────────────────────────────────────────────────────────

(function() {
  let _role = null, _identity = null, _displayName = null;
  let _unreadInterval = null;
  let _panelOpen = false;
  let _activeTab = "yeni"; // "yeni" | "gelen" | "giden"

  // ── Init ──────────────────────────────────────────────────
  window.initMessaging = function(role, identity, displayName) {
    _role = role;
    _identity = identity;
    _displayName = displayName || identity;
    _injectStyles();
    _buildWidget();
    _startUnreadPoll();
  };

  // ── CSS ───────────────────────────────────────────────────
  function _injectStyles() {
    if (document.getElementById("__msg_style__")) return;
    const s = document.createElement("style");
    s.id = "__msg_style__";
    s.textContent = `
      #__msgBtn__ {
        position:fixed; bottom:20px; right:20px; z-index:9000;
        width:52px; height:52px; border-radius:50%;
        background:linear-gradient(135deg,#d6a63f,#b8892e);
        border:none; cursor:pointer; box-shadow:0 4px 16px rgba(0,0,0,.5);
        display:flex; align-items:center; justify-content:center;
        font-size:22px; color:#fff; transition:transform .2s;
      }
      #__msgBtn__:hover { transform:scale(1.1); }
      #__msgBadge__ {
        position:absolute; top:-4px; right:-4px;
        background:#ef4444; color:#fff; border-radius:50%;
        font-size:10px; font-weight:700;
        min-width:18px; height:18px; line-height:18px;
        text-align:center; padding:0 4px; display:none;
      }
      #__msgPanel__ {
        position:fixed; bottom:82px; right:20px; z-index:9001;
        width:340px; max-height:500px;
        background:#1a1a1a; border:1px solid #333; border-radius:14px;
        box-shadow:0 8px 32px rgba(0,0,0,.7);
        display:none; flex-direction:column; overflow:hidden;
        font-family:inherit;
      }
      #__msgPanel__.open { display:flex; }
      .__msg_header__ {
        display:flex; align-items:center; justify-content:space-between;
        padding:12px 16px; background:#111;
        border-bottom:1px solid #2a2a2a;
      }
      .__msg_header__ span { color:#d6a63f; font-weight:700; font-size:14px; }
      .__msg_header__ button {
        background:none; border:none; color:#888; cursor:pointer;
        font-size:18px; line-height:1; padding:0;
      }
      .__msg_tabs__ {
        display:flex; border-bottom:1px solid #2a2a2a;
      }
      .__msg_tab__ {
        flex:1; padding:9px 4px; text-align:center; font-size:12px;
        font-weight:600; cursor:pointer; color:#666; border:none;
        background:none; transition:color .2s;
        border-bottom:2px solid transparent;
      }
      .__msg_tab__.active {
        color:#d6a63f; border-bottom-color:#d6a63f;
      }
      .__msg_body__ {
        flex:1; overflow-y:auto; padding:12px;
        display:flex; flex-direction:column; gap:8px;
      }
      .__msg_compose__ {
        display:flex; flex-direction:column; gap:8px;
      }
      .__msg_compose__ select,
      .__msg_compose__ textarea {
        background:#111; border:1px solid #333; border-radius:8px;
        color:#e5e5e5; padding:8px 10px; font-size:13px;
        font-family:inherit; resize:none; outline:none;
      }
      .__msg_compose__ select:focus,
      .__msg_compose__ textarea:focus { border-color:#d6a63f; }
      .__msg_send_btn__ {
        background:linear-gradient(135deg,#d6a63f,#b8892e);
        border:none; border-radius:8px; color:#111;
        font-weight:700; font-size:13px; padding:9px;
        cursor:pointer; transition:opacity .2s;
      }
      .__msg_send_btn__:hover { opacity:.85; }
      .__msg_send_btn__:disabled { opacity:.5; cursor:not-allowed; }
      .__msg_item__ {
        background:#111; border:1px solid #2a2a2a;
        border-radius:8px; padding:10px 12px;
      }
      .__msg_item__.unread { border-color:#d6a63f44; background:#1c1800; }
      .__msg_item_head__ { display:flex; justify-content:space-between; margin-bottom:4px; }
      .__msg_from__ { font-size:11px; font-weight:700; color:#d6a63f; }
      .__msg_time__ { font-size:10px; color:#555; }
      .__msg_text__ { font-size:13px; color:#ccc; line-height:1.4; }
      .__msg_to_lbl__ { font-size:10px; color:#666; margin-top:4px; }
      .__msg_empty__ { text-align:center; color:#555; font-size:13px; padding:24px 0; }
    `;
    document.head.appendChild(s);
  }

  // ── Widget ────────────────────────────────────────────────
  function _buildWidget() {
    const btn = document.createElement("button");
    btn.id = "__msgBtn__";
    btn.innerHTML = `💬<span id="__msgBadge__"></span>`;
    btn.onclick = _togglePanel;
    document.body.appendChild(btn);

    const panel = document.createElement("div");
    panel.id = "__msgPanel__";
    panel.innerHTML = `
      <div class="__msg_header__">
        <span>💬 MESAJLAR</span>
        <button onclick="document.getElementById('__msgPanel__').classList.remove('open')" title="Kapat">×</button>
      </div>
      <div class="__msg_tabs__">
        <button class="__msg_tab__ active" data-tab="yeni" onclick="__msgTab__(this,'yeni')">YENİ MESAJ</button>
        <button class="__msg_tab__" data-tab="gelen" onclick="__msgTab__(this,'gelen')">GELEN</button>
        <button class="__msg_tab__" data-tab="giden" onclick="__msgTab__(this,'giden')">GİDEN</button>
      </div>
      <div class="__msg_body__" id="__msgBody__">
        ${_buildComposeHtml()}
      </div>
    `;
    document.body.appendChild(panel);
  }

  function _buildComposeHtml() {
    const opts = _getTargetOptions();
    if (!opts.length) return `<div class="__msg_empty__">Bu rol mesaj gönderemez.</div>`;
    return `
      <div class="__msg_compose__">
        <select id="__msgTo__">
          ${opts.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}
        </select>
        <textarea id="__msgText__" rows="4" placeholder="Mesajınızı yazın..."></textarea>
        <button class="__msg_send_btn__" onclick="__msgSend__()">MESAJ GÖNDER</button>
      </div>
    `;
  }

  function _getTargetOptions() {
    if (_role === "admin") {
      return [
        { value:"merkez|merkez", label:"→ Merkez Operasyon" },
        { value:"all|otel",      label:"→ Tüm Oteller" },
      ];
    }
    if (_role === "merkez") {
      return [
        { value:"all|otel", label:"→ Tüm Oteller" },
      ];
    }
    if (_role === "otel") {
      return [
        { value:"merkez|merkez", label:"→ Merkez Operasyon" },
      ];
    }
    return [];
  }

  async function _fillHotelTargets() {
    if (_role !== "admin" && _role !== "merkez") return;
    const sel = document.getElementById("__msgTo__");
    if (!sel) return;
    try {
      const hotels = await getHotels();
      hotels.filter(h=>h.status==="ACTIVE").forEach(h => {
        const opt = document.createElement("option");
        opt.value = "otel:" + h.hotel + "|otel";
        opt.textContent = "→ Otel: " + h.hotel;
        sel.appendChild(opt);
      });
    } catch(e) {
      if (typeof reportClientError === "function") reportClientError("messaging:fillHotelTargets", e);
    }
  }

  // ── Tab değişimi ──────────────────────────────────────────
  window.__msgTab__ = async function(el, tab) {
    document.querySelectorAll(".__msg_tab__").forEach(t=>t.classList.remove("active"));
    el.classList.add("active");
    _activeTab = tab;
    const body = document.getElementById("__msgBody__");
    if (!body) return;
    if (tab === "yeni") {
      body.innerHTML = _buildComposeHtml();
      await _fillHotelTargets();
    } else {
      body.innerHTML = `<div class="__msg_empty__">Yükleniyor...</div>`;
      try {
        const msgs = await getMessages(_role, _identity);
        _renderMsgList(body, msgs[tab] || []);
        if (tab === "gelen") _markAllRead(msgs.gelen || []);
      } catch(e) {
        body.innerHTML = `<div class="__msg_empty__">Yüklenemedi.</div>`;
        if (typeof reportClientError === "function") reportClientError("messaging:loadTab", e);
      }
    }
  };

  // _esc() — XSS koruması (tüm kullanıcı verisini render etmeden önce geçir)
  function _esc(s) {
    return String(s)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#x27;");
  }

  function _renderMsgList(container, list) {
    if (!list.length) {
      container.innerHTML = `<div class="__msg_empty__">Mesaj yok.</div>`;
      return;
    }
    container.innerHTML = [...list].reverse().map(m => {
      const isUnread = !m.okundu && _activeTab === "gelen";
      const zaman = m.createdAt
        ? new Date(m.createdAt).toLocaleString("tr-TR",{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"2-digit"})
        : "";
      return `
        <div class="__msg_item__ ${isUnread?"unread":""}">
          <div class="__msg_item_head__">
            <span class="__msg_from__">${_esc(m.from||"?")}</span>
            <span class="__msg_time__">${zaman}</span>
          </div>
          <div class="__msg_text__">${_esc(m.text||"")}</div>
          <div class="__msg_to_lbl__">→ ${_esc(m.to||"")}</div>
        </div>`;
    }).join("");
  }

  async function _markAllRead(list) {
    const unread = list.filter(m => !m.okundu);
    for (const m of unread) {
      try { await markMessageRead(m.id); }
      catch(e) { if (typeof reportClientError === "function") reportClientError("messaging:markRead", e); }
    }
  }

  // ── Timeout yardımcısı — ağ donmalarına karşı koruma ──────────
  function _withTimeout(promise, ms, label) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error((label || "İşlem") + " zaman aşımına uğradı (" + ms + "ms)")), ms)
      )
    ]);
  }

  // ── Gönder — 3× retry + 10s timeout + buton disable/enable ───
  window.__msgSend__ = async function() {
    const sel    = document.getElementById("__msgTo__");
    const textEl = document.getElementById("__msgText__");
    const btnEl  = document.querySelector(".__msg_send_btn__");
    if (!sel || !textEl) return;

    const text = textEl.value.trim();
    if (!text) {
      if (typeof showToast === "function") showToast("Mesaj boş olamaz", "err");
      textEl.focus();
      return;
    }
    if (text.length > 1000) {
      if (typeof showToast === "function") showToast("Mesaj 1000 karakterden uzun olamaz", "err");
      return;
    }

    // Butonu devre dışı bırak — çift gönderimi önle
    if (btnEl) { btnEl.disabled = true; btnEl.textContent = "Gönderiliyor..."; }

    const [to, toRole] = sel.value.split("|");
    const fromId = _role === "otel" ? ("otel:" + _identity) : _role;

    let retries = 0;
    while (retries < 3) {
      try {
        await _withTimeout(sendMessage(fromId, _role, to, toRole, text), 10000, "Mesaj gönderimi");
        textEl.value = "";
        if (typeof showToast === "function") showToast("✅ Mesaj gönderildi");
        break;
      } catch(e) {
        retries++;
        if (retries >= 3) {
          if (typeof showToast === "function") showToast("❌ Gönderilemedi — bağlantıyı kontrol edin", "err");
          if (typeof reportClientError === "function")
            reportClientError("messaging:send", e || new Error("3 denemede gönderilemedi"));
        } else {
          // Exponential backoff: 800ms, 1600ms
          await new Promise(r => setTimeout(r, 800 * retries));
        }
      }
    }

    // Butonu her durumda geri etkinleştir
    if (btnEl) { btnEl.disabled = false; btnEl.textContent = "MESAJ GÖNDER"; }
  };

  // ── Okunmamış sayacı ─────────────────────────────────────
  function _startUnreadPoll() {
    _updateBadge();
    _unreadInterval = setInterval(_updateBadge, 30000);
  }

  async function _updateBadge() {
    try {
      const count = await getUnreadCount(_role, _identity);
      const badge = document.getElementById("__msgBadge__");
      if (!badge) return;
      if (count > 0) {
        badge.textContent = count > 99 ? "99+" : count;
        badge.style.display = "block";
      } else {
        badge.style.display = "none";
      }
    } catch(e) {
      if (typeof reportClientError === "function") reportClientError("messaging:badge", e);
    }
  }

  // ── Toggle ────────────────────────────────────────────────
  function _togglePanel() {
    const panel = document.getElementById("__msgPanel__");
    if (!panel) return;
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) {
      _fillHotelTargets();
      _updateBadge();
    }
  }
})();
