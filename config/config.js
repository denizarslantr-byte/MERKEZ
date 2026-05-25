// Piano Deri — Konfigürasyon
// ─────────────────────────────────────────────────────────────
// ⚠️  GÜVENLİK: Bu dosyayı Git'e COMMIT ETMEYİN.
//     .gitignore dosyasına ekleyin veya GitHub Secrets kullanın.
//
// API_KEY üç yoldan verilir (öncelik sırası):
//   1) Build-time injection: __PIANO_API_KEY__  (GitHub Actions / Cloudflare / Netlify)
//   2) Runtime window:       window.PIANO_API_KEY  (CDN deploy veya lokal test)
//   3) Sadece Firebase kullanılıyorsa boş bırakılabilir
//
// Önerilen dağıtım:
//   - GitHub Actions  → Environment Secret: PIANO_API_KEY
//   - Cloudflare Pages / Netlify → Environment Variables
//   - Lokal geliştirme → .env / local config, Git'e commit edilmez
// ─────────────────────────────────────────────────────────────

const API_URL = "https://script.google.com/macros/s/AKfycbxCTdPJ4P89KDDYOairoh0ClPZXwU2aDkrGMKUPilsRxMcTLN3EOg2NLZOionuavBM8Ug/exec";

const API_KEY =
  (typeof __PIANO_API_KEY__ !== "undefined" && __PIANO_API_KEY__) ? __PIANO_API_KEY__ :
  (typeof window !== "undefined" && window.PIANO_API_KEY ? window.PIANO_API_KEY : "");

// Firebase ayarları config/firebase.js içinde tanımlanır — buraya ekleme
