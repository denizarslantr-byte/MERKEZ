// admin/services/auth-service.js
// Admin kimlik doğrulama servisi
// firebase-api.js verifyPin / setPin üzerinden PIN işlemlerini yönetir.

"use strict";

const AuthService = (() => {
  const SESSION_KEY = "adminAuth";

  // PIN ile giriş — adminAuth() firebase-api.js'deki verifyPin'i çağırır
  async function login(pin) {
    if (!pin) throw new Error("PIN boş olamaz");
    const ok = typeof adminAuth === "function"
      ? await adminAuth(pin)
      : await verifyPin(pin);
    if (!ok) throw new Error("Hatalı PIN");
    sessionStorage.setItem(SESSION_KEY, "ok");
    return true;
  }

  // Oturumu kapat
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("adminRemPin"); // legacy temizlik
  }

  // Oturum açık mı?
  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "ok";
  }

  // PIN değiştir (eski PIN doğrulandıktan sonra)
  async function changePin(oldPin, newPin) {
    if (!newPin || String(newPin).length < 4) throw new Error("PIN en az 4 karakter olmalı");
    const ok = typeof adminAuth === "function"
      ? await adminAuth(oldPin)
      : await verifyPin(oldPin);
    if (!ok) throw new Error("Mevcut PIN hatalı");
    if (typeof setPin !== "function") throw new Error("setPin bulunamadı");
    await setPin(newPin);
  }

  return { login, logout, isLoggedIn, changePin };
})();

window.AuthService = AuthService;
