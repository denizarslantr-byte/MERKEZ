// Piano Deri V7.0 — Firebase API Katmanı
// YENİ YAPI: rezervasyonlar/{YYYY-MM-DD}/{id}
// Arşiv:    arsiv/{YYYY-MM}/{id}
// Mesajlar: mesajlar/{id}

let db = null;

async function initFirebase() {
  if (db) return db;
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const { getDatabase, ref, get, set, push, update, remove, query, orderByChild, equalTo, onValue, limitToLast } =
    await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js");
  const { getAuth, signInAnonymously, signInWithEmailAndPassword } =
    await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  const app = initializeApp(FIREBASE_CONFIG);
  db = getDatabase(app);
  window._fb = { ref, get, set, push, update, remove, query, orderByChild, equalTo, onValue, limitToLast };
  window._fbAuth = getAuth(app); // Auth geçişi için global referans

  // ⚠️  GÜVENLİK UYARISI — ANONIM AUTH GEÇİCİ ÇÖZÜMDÜR:
  // Mevcut sistem, Firebase rules'da "auth != null" kontrolünü karşılamak için
  // e-posta/şifre veya anonim giriş kullanır.
  // Anonim auth yeterli DEĞİLDİR: veritabanı URL'sini bilen herhangi biri
  // aynı yöntemi kullanarak tüm veriye erişebilir.
  //
  // 🎯  KALICI ÇÖZÜM (firebase-rules-production-auth.json hazır):
  //   1. Firebase Console → Authentication → Email/Password'u etkinleştir
  //   2. Her kullanıcıya UID → roles/{uid}/role: "admin"|"merkez"|"otel" ata
  //   3. Bu blokta signInAnonymously yerine signInWithEmailAndPassword kullan
  //   4. firebase-rules-production-auth.json'u Firebase Rules'a yükle
  //   5. giris/index.html ve hotel/login.html'i Firebase Auth ile güncelle
  //
  // Geçişe hazır olduğunda window._fbAuth üzerinden:
  //   await window._fbAuth.signInWithEmailAndPassword(email, pass)
  // ─────────────────────────────────────────────────────────────
  try {
    const auth = window._fbAuth;
    const allowAnonymous = typeof FIREBASE_ALLOW_ANONYMOUS_AUTH !== "undefined" && FIREBASE_ALLOW_ANONYMOUS_AUTH === true;
    const email    = sessionStorage.getItem("firebaseEmail")    || localStorage.getItem("firebaseEmail");
    const password = sessionStorage.getItem("firebasePassword");
    if (!auth.currentUser && email && password) {
      await signInWithEmailAndPassword(auth, email, password);
    } else if (!auth.currentUser && allowAnonymous) {
      await signInAnonymously(auth);
    } else if (!auth.currentUser && !allowAnonymous) {
      console.warn("Firebase Auth oturumu yok. Production rules için e-posta/şifre girişi gerekir.");
    }
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("firebaseAuth", err);
    else console.warn("Firebase Auth aktif edilemedi:", err && err.message ? err.message : err);
  }
  return db;
}

async function fbGet(path) {
  try {
    const database = await initFirebase();
    const snap = await window._fb.get(window._fb.ref(database, path));
    return snap.exists() ? snap.val() : null;
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("fbGet:" + path, err);
    throw err;
  }
}
async function fbSet(path, data) {
  try {
    const database = await initFirebase();
    await window._fb.set(window._fb.ref(database, path), data);
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("fbSet:" + path, err);
    throw err;
  }
}
async function fbPush(path, data) {
  try {
    const database = await initFirebase();
    const r = await window._fb.push(window._fb.ref(database, path), data);
    return r.key;
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("fbPush:" + path, err);
    throw err;
  }
}
async function fbUpdate(path, data) {
  try {
    const database = await initFirebase();
    await window._fb.update(window._fb.ref(database, path), data);
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("fbUpdate:" + path, err);
    throw err;
  }
}
async function fbRemove(path) {
  try {
    const database = await initFirebase();
    await window._fb.remove(window._fb.ref(database, path));
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("fbRemove:" + path, err);
    throw err;
  }
}

function _cleanString(v, max = 250) {
  return (typeof normalizeText === "function" ? normalizeText(v, max) : String(v ?? "").trim().slice(0, max));
}
function _safeInt(v, min = 0, max = 999) {
  return (typeof toIntSafe === "function" ? toIntSafe(v, min, max) : Math.min(max, Math.max(min, parseInt(v,10)||0)));
}
function validateReservation(rez = {}) {
  const date = _cleanString(rez.date || new Date().toISOString().slice(0,10), 10);
  const time = _cleanString(rez.time, 5);
  if (!(typeof isIsoDate === "function" ? isIsoDate(date) : /^\d{4}-\d{2}-\d{2}$/.test(date))) throw new Error("Geçersiz tarih");
  if (!(typeof isTimeHHMM === "function" ? isTimeHHMM(time) : /^([01]\d|2[0-3]):[0-5]\d$/.test(time))) throw new Error("Geçersiz saat");
  if (!_cleanString(rez.hotel, 120)) throw new Error("Otel adı zorunlu");
  return {
    ...rez,
    date, time,
    hotel: _cleanString(rez.hotel, 120),
    adult: _safeInt(rez.adult, 0, 999),
    child: _safeInt(rez.child, 0, 999),
    nation: _cleanString(rez.nation || rez.nat || "", 60),
    nat: _cleanString(rez.nat || rez.nation || "", 60),
    notes: _cleanString(rez.notes || rez.note || "", 500),
    staff1: _cleanString(rez.staff1 || "", 80),
    staff2: _cleanString(rez.staff2 || "", 80),
    staff3: _cleanString(rez.staff3 || "", 80),
    staff4: _cleanString(rez.staff4 || "", 80),
    plaka: _cleanString(rez.plaka || "", 30),
    kart: _cleanString(rez.kart || "", 60),
    status: _cleanString(rez.status || "PENDING", 30)
  };
}

function cleanReservationPatch(data = {}) {
  const out = { ...data };
  const strFields = { hotel:120, time:5, date:10, nation:60, nat:60, notes:500, staff1:80, staff2:80, staff3:80, staff4:80, plaka:30, kart:60, status:30, ciktiSaati:5, ayak:40 };
  Object.entries(strFields).forEach(([k,max]) => { if (out[k] !== undefined) out[k] = _cleanString(out[k], max); });
  if (out.date !== undefined && !(typeof isIsoDate === "function" ? isIsoDate(out.date) : /^\d{4}-\d{2}-\d{2}$/.test(out.date))) throw new Error("Geçersiz tarih");
  if (out.time !== undefined && !(typeof isTimeHHMM === "function" ? isTimeHHMM(out.time) : /^([01]\d|2[0-3]):[0-5]\d$/.test(out.time))) throw new Error("Geçersiz saat");
  if (out.adult !== undefined) out.adult = _safeInt(out.adult, 0, 999);
  if (out.child !== undefined) out.child = _safeInt(out.child, 0, 999);
  return out;
}

function validateMessage(text) {
  const clean = _cleanString(text, 1000);
  if (!clean) throw new Error("Mesaj boş olamaz");
  return clean;
}
function validateHotel(hotel = {}) {
  const name = _cleanString(hotel.hotel || hotel.name, 120);
  if (!name) throw new Error("Otel adı zorunlu");
  return { ...hotel, hotel:name, code:_cleanString(hotel.code,60), password:_cleanString(hotel.password,80), status:_cleanString(hotel.status || "ACTIVE", 20) };
}
function validateStaff(staff = {}) {
  const name = _cleanString(staff.name, 120);
  if (!name) throw new Error("Personel adı zorunlu");
  return { ...staff, name, status:_cleanString(staff.status || "ACTIVE", 20) };
}
function listenPath(path, cb) {
  return initFirebase().then(database => window._fb.onValue(window._fb.ref(database, path), snap => cb(snap.exists() ? snap.val() : null)));
}
function listenReservations(date, cb) {
  const d = date || new Date().toISOString().slice(0,10);
  return listenPath("rezervasyonlar/" + d, data => {
    const list = data ? Object.entries(data).map(([k,v]) => ({...v,_key:k})).sort((a,b)=>String(a.time).localeCompare(String(b.time))) : [];
    cacheSet("rez_" + d, list);
    cb(list);
  });
}

// ── PIN — SHA-256 Hash ile güvenli saklama ────────────────────
// PIN artık düz metin olarak değil, SHA-256 hash olarak saklanır.
// Yol: ayarlar/adminPinHash (64 karakter hex)
// Eski ayarlar/adminPin yolu Firebase rules'da kapatılmıştır.
// İlk setPin() çağrısında eski düz metin PIN otomatik migrate edilir.

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text)));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
// Geriye uyumluluk için alias
async function sha256Text(text) { return sha256(text); }
async function hashPin(pin)      { return "sha256$" + await sha256Text(pin); }
function isPinHash(value)        { return typeof value === "string" && value.startsWith("sha256$"); }

async function setPin(newPin) {
  // Yeni PIN her zaman hash olarak kaydedilir — ayarlar/adminPinHash yoluna
  const hashed = await sha256(String(newPin));
  await fbSet("ayarlar/adminPinHash", hashed);
  // Eski düz metin kaydını temizle (geçiş güvenliği)
  await fbRemove("ayarlar/adminPin").catch(() => {});
}

async function verifyPin(inputPin, _unused) {
  // Önce yeni hash sistemi
  const storedHash = await fbGet("ayarlar/adminPinHash");
  if (storedHash) {
    const inputHash = await sha256(String(inputPin));
    return inputHash === storedHash;
  }
  // Yedek: eski sha256$ prefix formatı (merkez-1.3 geçiş dönemi)
  const oldEntry = await fbGet("ayarlar/adminPin");
  if (oldEntry && isPinHash(oldEntry)) {
    const correct = oldEntry === await hashPin(inputPin);
    if (correct) await setPin(inputPin).catch(() => {}); // otomatik migrate
    return correct;
  }
  // Son yedek: düz metin PIN (ilk kurulum)
  const correct = String(inputPin) === String(oldEntry || DEFAULT_PIN);
  if (correct) await setPin(inputPin).catch(() => {}); // otomatik migrate
  return correct;
}

// ── SessionStorage Cache ──────────────────────────────────────
const CACHE_TTL_STATIC = 5 * 60 * 1000;  // 5 dk — oteller, personel
const CACHE_TTL_REZ    = 30 * 1000;       // 30 sn — rezervasyonlar
function cacheGet(key) {
  try {
    const item = JSON.parse(sessionStorage.getItem("fb_" + key));
    if (!item) return null;
    const ttl = key.startsWith("rez_") ? CACHE_TTL_REZ : CACHE_TTL_STATIC;
    if (Date.now() - item.ts > ttl) return null;
    return item.data;
  } catch { return null; }
}
function cacheSet(key, data) {
  try { sessionStorage.setItem("fb_" + key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}
function cacheClear(prefix) {
  try {
    Object.keys(sessionStorage).filter(k => k.startsWith("fb_" + prefix)).forEach(k => sessionStorage.removeItem(k));
  } catch {}
}

// ── Rezervasyonlar — YENİ YAPI ────────────────────────────────
// Yol: rezervasyonlar/{YYYY-MM-DD}/{id}
// Arşiv: arsiv/{YYYY-MM}/{id}

async function getReservations(date) {
  if (!date) date = typeof todayStr === "function" ? todayStr() : new Date().toISOString().slice(0,10);

  const cacheKey = "rez_" + date;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await fbGet("rezervasyonlar/" + date);
  let list = [];
  if (data) {
    list = Object.entries(data)
      .map(([key, val]) => ({ ...val, _key: key }))
      .sort((a, b) => String(a.time).localeCompare(String(b.time)));
  }
  cacheSet(cacheKey, list);
  return list;
}

// Tarih aralığı — arşiv + aktif birleşik okuma
async function getReservationsRange(startDate, endDate) {
  if (!startDate) startDate = new Date().toISOString().slice(0,10);
  if (!endDate)   endDate   = startDate;

  const today = new Date().toISOString().slice(0,10);
  const dates = [];
  let cur = new Date(startDate);
  const end = new Date(endDate);
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0,10));
    cur.setDate(cur.getDate() + 1);
  }

  const results = await Promise.all(dates.map(async d => {
    const cacheKey = "rez_" + d;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    // Aktif mi arşiv mi?
    const isActive = d >= today || await fbGet("rezervasyonlar/" + d + "/_exists");
    let path;
    if (d >= today) {
      path = "rezervasyonlar/" + d;
    } else {
      // Önce aktif yolda dene, yoksa arşivde
      const activeData = await fbGet("rezervasyonlar/" + d);
      if (activeData) {
        const list = Object.entries(activeData).map(([k,v])=>({...v,_key:k}));
        cacheSet(cacheKey, list);
        return list;
      }
      const month = d.slice(0,7);
      const archData = await fbGet("arsiv/" + month);
      if (!archData) return [];
      const list = Object.entries(archData)
        .filter(([,v]) => v.date === d)
        .map(([k,v]) => ({...v, _key:k}));
      cacheSet(cacheKey, list);
      return list;
    }
    const data = await fbGet(path);
    const list = data ? Object.entries(data).map(([k,v])=>({...v,_key:k})) : [];
    cacheSet(cacheKey, list);
    return list;
  }));

  return results.flat().sort((a,b)=>{
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return String(a.time).localeCompare(String(b.time));
  });
}

async function addReservation(rez) {
  // V10 uyumlu sanitize + merkez-1.1 validasyon sistemi birlikte çalışır.
  if (typeof sanitizeRez === "function") rez = sanitizeRez(rez);
  const id = Date.now() + Math.floor(Math.random() * 1000);
  const cleanRez = validateReservation(rez);
  const date = cleanRez.date || new Date().toISOString().slice(0,10);
  const data = { ...cleanRez, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  await fbSet("rezervasyonlar/" + date + "/" + id, data);
  cacheClear("rez_" + date);
  if (typeof auditLog === "function") auditLog("create", id, null, data, sessionStorage.getItem("pianoUser") || "").catch(()=>{});
  return id;
}

async function updateReservation(id, data) {
  // id ile tarihi bul — önce bugünden başlayarak yakın günlerde ara
  const date = data.date || await _findReservationDate(id);
  if (!date) throw new Error("Rezervasyon tarihi bulunamadı: " + id);
  await fbUpdate("rezervasyonlar/" + date + "/" + id, { ...cleanReservationPatch(data), updatedAt: new Date().toISOString() });
  cacheClear("rez_" + date);
}

async function deleteReservation(id) {
  const date = await _findReservationDate(id);
  if (!date) return;
  const before = await fbGet("rezervasyonlar/" + date + "/" + id);
  await fbRemove("rezervasyonlar/" + date + "/" + id);
  cacheClear("rez_" + date);
  if (typeof auditLog === "function") auditLog("delete", id, before, null, sessionStorage.getItem("pianoUser") || "").catch(()=>{});
}

// Yardımcı: ID'den tarihi bul (son 7 gün + bugün)
async function _findReservationDate(id) {
  const today = new Date();
  for (let i = 0; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i + 3); // -3..+3
    const dateStr = d.toISOString().slice(0,10);
    const exists = await fbGet("rezervasyonlar/" + dateStr + "/" + id);
    if (exists) return dateStr;
  }
  // Daha geniş ara
  const snap = await fbGet("rezervasyonlar");
  if (snap) {
    for (const [dateKey, dateVal] of Object.entries(snap)) {
      if (dateVal && dateVal[id]) return dateKey;
    }
  }
  return null;
}

// ── Arşivleme ─────────────────────────────────────────────────
// Belirtilen tarihten önceki aktif rezervasyonları arsiv/{YYYY-MM}/ altına taşır
async function archiveOldReservations(beforeDate) {
  if (!beforeDate) {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    beforeDate = d.toISOString().slice(0,10);
  }
  const snap = await fbGet("rezervasyonlar");
  if (!snap) return { moved: 0 };
  const updates = {};
  let moved = 0;
  for (const [dateKey, dateVal] of Object.entries(snap)) {
    if (dateKey < beforeDate && dateVal && typeof dateVal === "object") {
      const month = dateKey.slice(0,7);
      for (const [id, rez] of Object.entries(dateVal)) {
        updates["arsiv/" + month + "/" + id] = rez;
        updates["rezervasyonlar/" + dateKey + "/" + id] = null;
        moved++;
      }
    }
  }
  if (moved > 0) {
    const database = await initFirebase();
    await window._fb.update(window._fb.ref(database, "/"), updates);
    cacheClear("rez_");
  }
  return { moved };
}

// ── Oteller ──────────────────────────────────────────────────
async function getHotels() {
  const cached = cacheGet("oteller");
  if (cached) return cached;
  const data = await fbGet("oteller");
  const result = data
    ? Object.entries(data).map(([k,v])=>({...v,_key:k})).sort((a,b)=>String(a.hotel).localeCompare(String(b.hotel),"tr"))
    : [];
  cacheSet("oteller", result);
  return result;
}
async function addHotel(hotel) {
  const id = Date.now();
  await fbSet("oteller/" + id, { ...validateHotel(hotel), id, createdAt: new Date().toISOString() });
  cacheClear("oteller");
  return id;
}
async function updateHotel(id, data) {
  const key = (id && id.value !== undefined) ? id.value : id;
  if (!key || key === "undefined") throw new Error("Otel ID bulunamadı");
  await fbUpdate("oteller/" + key, data);
  cacheClear("oteller");
}
async function deleteHotel(id) {
  const key = (id && id.value !== undefined) ? id.value : id;
  if (!key || key === "undefined") throw new Error("Otel ID bulunamadı");
  await fbRemove("oteller/" + key);
  cacheClear("oteller");
}
async function loginHotel(code, password) {
  const hotels = await getHotels();
  return hotels.find(h =>
    h.status === "ACTIVE" &&
    String(h.code||"").toLowerCase() === String(code).toLowerCase() &&
    String(h.password||"") === String(password)
  ) || null;
}

// ── Personel ─────────────────────────────────────────────────
async function getStaff() {
  const cached = cacheGet("personel");
  if (cached) return cached;
  const data = await fbGet("personel");
  const result = data
    ? Object.entries(data).map(([k,v])=>({...v,_key:k})).sort((a,b)=>String(a.name).localeCompare(String(b.name),"tr"))
    : [];
  cacheSet("personel", result);
  return result;
}
async function addStaff(staff) {
  const id = Date.now();
  await fbSet("personel/" + id, { ...validateStaff(staff), id, createdAt: new Date().toISOString() });
  cacheClear("personel");
  return id;
}
async function updateStaff(id, data) {
  const key = (id && id.value !== undefined) ? id.value : id;
  if (!key || key === "undefined") throw new Error("Personel ID bulunamadı");
  await fbUpdate("personel/" + key, data);
  cacheClear("personel");
}
async function deleteStaff(id) {
  const key = (id && id.value !== undefined) ? id.value : id;
  if (!key || key === "undefined") throw new Error("Personel ID bulunamadı");
  await fbRemove("personel/" + key);
  cacheClear("personel");
}

// ── İzin ─────────────────────────────────────────────────────
async function getOffDates(staffName) {
  const data = await fbGet("izinler");
  if (!data) return [];
  return Object.values(data).filter(v=>v.personel===staffName).map(v=>v.tarih);
}
async function setStaffOff(staffName, date, off) {
  const data = await fbGet("izinler");
  const entries = data ? Object.entries(data) : [];
  const existing = entries.find(([,v])=>v.personel===staffName&&v.tarih===date);
  if (off) {
    if (!existing) await fbPush("izinler", { personel:staffName, tarih:date, durum:"AKTIF", createdAt:new Date().toISOString() });
  } else {
    if (existing) await fbRemove("izinler/" + existing[0]);
  }
}
async function getStaffWithOffDates() {
  const [staffList, izinData] = await Promise.all([getStaff(), fbGet("izinler")]);
  const izinler = izinData ? Object.values(izinData) : [];
  return staffList.map(s=>({
    ...s,
    offDates: izinler.filter(i=>i.personel===s.name).map(i=>i.tarih).join(",")
  }));
}

// ── Plakalar ─────────────────────────────────────────────────
async function getPlakalar() {
  const cached = cacheGet("plakalar");
  if (cached) return cached;
  const data = await fbGet("plakalar");
  const result = data
    ? Object.entries(data).map(([k,v])=>({...v,_key:k})).sort((a,b)=>String(a.plaka).localeCompare(String(b.plaka)))
    : [];
  cacheSet("plakalar", result);
  return result;
}
async function addPlaka(plaka, model) {
  const id = Date.now();
  await fbSet("plakalar/" + id, { id, plaka:plaka.toUpperCase(), model:model||"", status:"ACTIVE", createdAt:new Date().toISOString() });
  cacheClear("plakalar");
  return id;
}
async function deletePlaka(id) {
  await fbRemove("plakalar/" + id);
  cacheClear("plakalar");
}

// ── Log ──────────────────────────────────────────────────────
async function logAction(action, user, details) {
  await fbPush("logs", { action:_cleanString(action,80), user:_cleanString(user,120), details:(typeof safeLogDetails==="function"?safeLogDetails(details):String(details||"").slice(0,300)), date:new Date().toISOString() });
}


// Audit log — rezervasyon değişikliklerini izle
async function auditLog(action, rezId, before, after, user) {
  try {
    await fbPush("audit", {
      action,
      rezId: String(rezId || ""),
      user: String(user || (typeof getCurrentUserLabel === "function" ? getCurrentUserLabel() : "unknown")).slice(0, 50),
      before: before ? JSON.stringify(before).slice(0, 500) : null,
      after: after ? JSON.stringify(after).slice(0, 500) : null,
      date: new Date().toISOString()
    });
  } catch(e) { /* audit log yazılamazsa işlem engellenmez */ }
}
window.auditLog = auditLog;


// Global hata yakalayıcı — kritik hataları Firebase'e yaz
window.addEventListener("error", e => {
  if (typeof logAction === "function") logAction("JS_ERROR", typeof getCurrentUserLabel === "function" ? getCurrentUserLabel() : "unknown", `${e.message} @ ${e.filename}:${e.lineno}`, "ERROR").catch(()=>{});
});
window.addEventListener("unhandledrejection", e => {
  if (typeof logAction === "function") logAction("PROMISE_ERROR", typeof getCurrentUserLabel === "function" ? getCurrentUserLabel() : "unknown", String(e.reason?.message || e.reason || "").slice(0,300), "ERROR").catch(()=>{});
});

// ── Kullanıcılar ─────────────────────────────────────────────
async function getUsers() {
  const data = await fbGet("kullanicilar");
  if (!data) return [];
  return Object.entries(data).map(([k,v])=>({...v,_key:k})).sort((a,b)=>String(a.username||"").localeCompare(String(b.username||""),"tr"));
}
async function addUser(user) {
  const id = Date.now();
  await fbSet("kullanicilar/" + id, { ...user, id, status:user.status||"ACTIVE", createdAt:new Date().toISOString() });
  return id;
}
async function updateUser(id, data) {
  const key = (id && id.value!==undefined) ? id.value : id;
  if (!key||key==="undefined") throw new Error("Kullanıcı ID bulunamadı");
  await fbUpdate("kullanicilar/" + key, data);
}
async function deleteUser(id) {
  const key = (id && id.value!==undefined) ? id.value : id;
  if (!key||key==="undefined") throw new Error("Kullanıcı ID bulunamadı");
  await fbRemove("kullanicilar/" + key);
}
async function loginUser(username, password) {
  const users = await getUsers();
  return users.find(u =>
    u.status === "ACTIVE" &&
    String(u.username||"").toLowerCase() === String(username).toLowerCase() &&
    String(u.password||"") === String(password)
  ) || null;
}
async function adminAuth(pin) {
  return await verifyPin(pin);
}

// ── MESAJLAŞMA ───────────────────────────────────────────────
// Yapı: mesajlar/{id}
// Alan: { from, fromRole, to, toRole, text, tarih, okundu, createdAt }
// fromRole / toRole: "admin" | "merkez" | "otel"
// to: "merkez" | "otel:{hotelName}" | "all"

async function sendMessage(from, fromRole, to, toRole, text) {
  const id = Date.now() + Math.floor(Math.random()*1000);
  await fbSet("mesajlar/" + id, {
    id, from:_cleanString(from,120), fromRole:_cleanString(fromRole,30), to:_cleanString(to,140), toRole:_cleanString(toRole,30), text:validateMessage(text),
    tarih: new Date().toISOString().slice(0,10),
    createdAt: new Date().toISOString(),
    okundu: false
  });
  return id;
}

async function getMessages(role, identity) {
  // identity = "merkez" | otelName
  const data = await fbGet("mesajlar");
  if (!data) return { gelen: [], giden: [] };
  const all = Object.values(data).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));

  let gelen, giden;
  if (role === "admin") {
    gelen = all.filter(m => m.toRole === "admin" || m.to === "admin");
    giden = all.filter(m => m.fromRole === "admin");
  } else if (role === "merkez") {
    gelen = all.filter(m =>
      m.to === "merkez" || m.to === "all" || m.toRole === "merkez"
    );
    giden = all.filter(m => m.fromRole === "merkez" || m.from === "merkez");
  } else if (role === "otel") {
    gelen = all.filter(m =>
      m.to === "all" ||
      m.to === ("otel:" + identity) ||
      (m.toRole === "otel" && (m.to === "all" || m.to === ("otel:" + identity)))
    );
    giden = all.filter(m => m.from === ("otel:" + identity));
  } else {
    gelen = []; giden = [];
  }
  return { gelen, giden };
}

async function markMessageRead(id) {
  await fbUpdate("mesajlar/" + id, { okundu: true });
}

async function getUnreadCount(role, identity) {
  const { gelen } = await getMessages(role, identity);
  return gelen.filter(m => !m.okundu).length;
}

// ── apiGet / apiPost uyumluluk katmanı ───────────────────────
async function apiGet(action, params = {}) {
  try {
    if (action === "getReservations") {
      let list = await getReservations(params.date || "");
      if (params.hotel) list = list.filter(r => String(r.hotel||"") === String(params.hotel||""));
      return list;
    }
    if (action === "getReservationsRange") {
      let list = await getReservationsRange(params.startDate, params.endDate);
      if (params.hotel) list = list.filter(r => String(r.hotel||"") === String(params.hotel||""));
      return list;
    }
    if (action === "cancelReservation") {
      await updateReservation(params.id, { status:"CANCELLED", updatedAt:new Date().toISOString(), date: params.date });
      return { success: true };
    }
    if (action === "deleteReservation") {
      await deleteReservation(params.id);
      return { success: true };
    }
    if (action === "getHotels")   return await getHotels();
    if (action === "getStaff")    return await getStaff();
    if (action === "getPlakalar") return await getPlakalar();
    return [];
  } catch (err) {
    console.error("Firebase apiGet hata:", action, err);
    return { success: false, message: err.message || "Firebase okuma hatası" };
  }
}

async function apiPost(action, body = {}) {
  try {
    if (action === "addReservation") {
      const id = await addReservation(body);
      return { success: true, id };
    }
    if (action === "updateReservation") {
      const data = { ...body };
      const id = data.id; delete data.id;
      await updateReservation(id, data);
      return { success: true, id };
    }
    return { success: false, message: "Unknown action: " + action };
  } catch (err) {
    console.error("Firebase apiPost hata:", action, err);
    return { success: false, message: err.message || "Firebase yazma hatası" };
  }
}



// ── Otomatik Günlük Yedekleme ─────────────────────────────────
// V9'dan alınarak merkez-1.0 temeline eklendi.
// Admin panelinde veya konsolda manuel çağrı: backupToday()
// Son 7 günlük backup tutulur: yedek/{YYYY-MM-DD}/
async function backupToday() {
  const today = new Date().toISOString().slice(0, 10);
  let lastBackup = null;

  try {
    lastBackup = await fbGet("ayarlar/sonYedek");
  } catch (_) {
    lastBackup = null;
  }

  // Aynı gün zaten yedeklendiyse tekrar yazma.
  if (lastBackup === today) return { skipped: true, date: today };

  try {
    const [rezData, oteller, personel, plakalar, kullanicilar, systemTheme] = await Promise.all([
      fbGet("rezervasyonlar/" + today),
      fbGet("oteller"),
      fbGet("personel"),
      fbGet("plakalar"),
      fbGet("kullanicilar"),
      fbGet("system/theme")
    ]);

    const snapshot = {
      rezervasyonlar: rezData || {},
      oteller: oteller || {},
      personel: personel || {},
      plakalar: plakalar || {},
      kullanicilar: kullanicilar || {},
      system: { theme: systemTheme || null },
      meta: {
        tarih: today,
        rezSayisi: rezData ? Object.keys(rezData).length : 0,
        otelSayisi: oteller ? Object.keys(oteller).length : 0,
        personelSayisi: personel ? Object.keys(personel).length : 0,
        plakaSayisi: plakalar ? Object.keys(plakalar).length : 0,
        kullaniciSayisi: kullanicilar ? Object.keys(kullanicilar).length : 0,
        olusturuldu: new Date().toISOString(),
        kaynak: "merkez-1.0-v9-backup-merge"
      }
    };

    await fbSet("yedek/" + today, snapshot);
    await fbSet("ayarlar/sonYedek", today);

    await cleanupOldBackups(7);

    if (typeof logAction === "function") {
      logAction("BACKUP", "sistem", `Günlük yedek oluşturuldu: ${today}`, "INFO").catch(() => {});
    }
    return { success: true, date: today, meta: snapshot.meta };
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("backupToday", err);
    if (typeof logAction === "function") {
      logAction("BACKUP_ERROR", "sistem", err && err.message ? err.message : String(err), "ERROR").catch(() => {});
    }
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
}

async function cleanupOldBackups(daysToKeep = 7) {
  try {
    const yedekSnap = await fbGet("yedek");
    if (!yedekSnap) return { success: true, removed: 0 };

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(daysToKeep || 7));
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    let removed = 0;

    for (const dateKey of Object.keys(yedekSnap)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey) && dateKey < cutoffStr) {
        await fbRemove("yedek/" + dateKey);
        removed++;
      }
    }
    return { success: true, removed, cutoff: cutoffStr };
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("cleanupOldBackups", err);
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
}

// Her gün ilk yüklemede otomatik yedek al. Hata oluşursa uygulamayı durdurmaz.
(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (typeof fbGet === "function") await backupToday();
  } catch (err) {
    if (typeof reportClientError === "function") reportClientError("autoBackup:init", err);
  }
})();

window.backupToday = backupToday;
window.cleanupOldBackups = cleanupOldBackups;

// ── Global bağlantılar ────────────────────────────────────────
window._fbAddStaff    = addStaff;
window._fbDeleteStaff = deleteStaff;
window._fbAddPlaka    = addPlaka;
window._fbDeletePlaka = deletePlaka;
window._fbAPI = {
  addStaff, deleteStaff, addPlaka, deletePlaka,
  updateStaff, getStaff, getStaffWithOffDates, setStaffOff,
  addHotel, updateHotel, deleteHotel, getHotels,
  addReservation, updateReservation, deleteReservation, getReservations,
  getReservationsRange, archiveOldReservations,
  sendMessage, getMessages, markMessageRead, getUnreadCount, listenReservations, listenPath, backupToday, cleanupOldBackups
};
window.getUsers = getUsers; window.addUser = addUser;
window.updateUser = updateUser; window.deleteUser = deleteUser;
window.loginUser = loginUser;
window.getReservations = getReservations;
window.getReservationsRange = getReservationsRange;
window.addReservation = addReservation;
window.updateReservation = updateReservation;
window.deleteReservation = deleteReservation;
window.getHotels = getHotels;
window.addHotel = addHotel; window.updateHotel = updateHotel;
window.deleteHotel = deleteHotel; window.loginHotel = loginHotel;
window.getStaff = getStaff; window.addStaff = addStaff;
window.updateStaff = updateStaff; window.deleteStaff = deleteStaff;
window.getStaffWithOffDates = getStaffWithOffDates;
window.getPlakalar = getPlakalar;
window.sendMessage = sendMessage;
window.getMessages = getMessages;
window.markMessageRead = markMessageRead;
window.getUnreadCount = getUnreadCount;
window.listenReservations = listenReservations;
window.listenPath = listenPath;
window._firebaseApiGet = apiGet;
window._firebaseApiPost = apiPost;
window._firebaseApiReady = true;
window.apiGet = apiGet;
window.apiPost = apiPost;

window.verifyPin = verifyPin;
window.hashPin = hashPin;
