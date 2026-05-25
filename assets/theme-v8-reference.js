// Piano Deri V7.0 — Tema Sistemi
// Admin Firebase'e yazar → tüm sayfalar okur → CSS değişkenleri anında değişir

const TEMALAR = {
  altin_gece: {
    ad: "Altın & Gece", emoji: "🌑",
    "--bg":"#080808","--bg-grad1":"#1a1200","--bg-grad2":"#0d0a00",
    "--bg3":"rgba(30,31,36,.92)",
    "--gold":"#d8aa4b","--gold2":"#f1d48a","--gold3":"#a07830",
    "--border":"rgba(216,170,75,.35)","--b2":"rgba(255,255,255,.09)",
    "--text":"#f0f0f0","--text2":"#a0a0a0"
  },
  gece_mavisi: {
    ad: "Gece Mavisi", emoji: "🔵",
    "--bg":"#050d1a","--bg-grad1":"#071428","--bg-grad2":"#020810",
    "--bg3":"rgba(10,22,40,.95)",
    "--gold":"#4a9eff","--gold2":"#7bbfff","--gold3":"#1a6abf",
    "--border":"rgba(74,158,255,.3)","--b2":"rgba(255,255,255,.08)",
    "--text":"#e8f0ff","--text2":"#7090b0"
  },
  zumrut_yesil: {
    ad: "Zümrüt & Siyah", emoji: "💚",
    "--bg":"#050f0a","--bg-grad1":"#0a1f14","--bg-grad2":"#030a06",
    "--bg3":"rgba(8,24,16,.95)",
    "--gold":"#2ecc71","--gold2":"#52d98a","--gold3":"#1a8c4e",
    "--border":"rgba(46,204,113,.3)","--b2":"rgba(255,255,255,.08)",
    "--text":"#e0f8ec","--text2":"#6aab84"
  },
  mor_kristal: {
    ad: "Mor Kristal", emoji: "💜",
    "--bg":"#080510","--bg-grad1":"#130a22","--bg-grad2":"#05030a",
    "--bg3":"rgba(19,10,34,.95)",
    "--gold":"#9b59b6","--gold2":"#c39bd3","--gold3":"#6c3483",
    "--border":"rgba(155,89,182,.35)","--b2":"rgba(255,255,255,.08)",
    "--text":"#f5eeff","--text2":"#9070aa"
  },
  koral_turuncu: {
    ad: "Koral Turuncu", emoji: "🟠",
    "--bg":"#0f0a06","--bg-grad1":"#1f1206","--bg-grad2":"#0a0603",
    "--bg3":"rgba(31,18,6,.95)",
    "--gold":"#ff6b35","--gold2":"#ff9a6c","--gold3":"#cc4a1a",
    "--border":"rgba(255,107,53,.3)","--b2":"rgba(255,255,255,.08)",
    "--text":"#fff0ea","--text2":"#aa7060"
  },
  saf_beyaz: {
    ad: "Saf Beyaz", emoji: "⬜",
    "--bg":"#f8f8f8","--bg-grad1":"#ffffff","--bg-grad2":"#eeeeee",
    "--bg3":"rgba(255,255,255,.95)",
    "--gold":"#1a1a2e","--gold2":"#0d0d2b","--gold3":"#2a2a4e",
    "--border":"rgba(26,26,46,.15)","--b2":"rgba(0,0,0,.08)",
    "--text":"#1a1a1a","--text2":"#666677"
  },
  lacivert_altin: {
    ad: "Lacivert & Altın", emoji: "🌊",
    "--bg":"#010815","--bg-grad1":"#031228","--bg-grad2":"#010510",
    "--bg3":"rgba(3,18,40,.97)",
    "--gold":"#d4af37","--gold2":"#f0cc55","--gold3":"#a07820",
    "--border":"rgba(212,175,55,.3)","--b2":"rgba(255,255,255,.08)",
    "--text":"#f0f0e8","--text2":"#9090a0"
  },
  kirmizi_deri: {
    ad: "Kırmızı & Deri", emoji: "🔴",
    "--bg":"#0a0000","--bg-grad1":"#180505","--bg-grad2":"#060000",
    "--bg3":"rgba(24,5,5,.95)",
    "--gold":"#c0392b","--gold2":"#e74c3c","--gold3":"#922b21",
    "--border":"rgba(192,57,43,.3)","--b2":"rgba(255,255,255,.08)",
    "--text":"#ffe8e8","--text2":"#aa7070"
  },
  neon_siber: {
    ad: "Neon Siber", emoji: "⚡",
    "--bg":"#020408","--bg-grad1":"#040810","--bg-grad2":"#010204",
    "--bg3":"rgba(4,8,16,.97)",
    "--gold":"#00f5ff","--gold2":"#66f9ff","--gold3":"#00b8c4",
    "--border":"rgba(0,245,255,.25)","--b2":"rgba(0,245,255,.1)",
    "--text":"#e0ffff","--text2":"#4090a0"
  },
  kahve_krem: {
    ad: "Kahve & Krem", emoji: "☕",
    "--bg":"#1a1008","--bg-grad1":"#2a1c0e","--bg-grad2":"#100a04",
    "--bg3":"rgba(26,16,8,.95)",
    "--gold":"#c8965a","--gold2":"#e0b47a","--gold3":"#8c6030",
    "--border":"rgba(200,150,90,.35)","--b2":"rgba(255,255,255,.08)",
    "--text":"#fff8f0","--text2":"#aa8866"
  },
  okyanus_derin: {
    ad: "Okyanus Derin", emoji: "🌊",
    "--bg":"#020d1a","--bg-grad1":"#041828","--bg-grad2":"#010810",
    "--bg3":"rgba(4,24,40,.95)",
    "--gold":"#00bcd4","--gold2":"#4dd0e1","--gold3":"#00838f",
    "--border":"rgba(0,188,212,.3)","--b2":"rgba(255,255,255,.08)",
    "--text":"#e0f7fa","--text2":"#5090a0"
  },
  pastel_mint: {
    ad: "Pastel Mint", emoji: "🌿",
    "--bg":"#f0faf5","--bg-grad1":"#e0f5ea","--bg-grad2":"#d0f0e0",
    "--bg3":"rgba(255,255,255,.93)",
    "--gold":"#00897b","--gold2":"#26a69a","--gold3":"#005f56",
    "--border":"rgba(0,137,123,.2)","--b2":"rgba(0,0,0,.08)",
    "--text":"#0d2620","--text2":"#407060"
  },
  gri_minimal: {
    ad: "Gri Minimal", emoji: "⬛",
    "--bg":"#f5f5f5","--bg-grad1":"#eeeeee","--bg-grad2":"#e0e0e0",
    "--bg3":"rgba(255,255,255,.9)",
    "--gold":"#333333","--gold2":"#111111","--gold3":"#555555",
    "--border":"rgba(0,0,0,.1)","--b2":"rgba(0,0,0,.07)",
    "--text":"#111111","--text2":"#666666"
  },
  osmanlı_altun: {
    ad: "Osmanlı Altun", emoji: "🕌",
    "--bg":"#0c0800","--bg-grad1":"#1e1400","--bg-grad2":"#080500",
    "--bg3":"rgba(24,18,0,.97)",
    "--gold":"#c9a84c","--gold2":"#e8c96d","--gold3":"#8c7020",
    "--border":"rgba(201,168,76,.4)","--b2":"rgba(255,255,255,.09)",
    "--text":"#fff8e7","--text2":"#aa9060"
  },
  karanlik_mor: {
    ad: "Karanlık Mor", emoji: "🌙",
    "--bg":"#06030f","--bg-grad1":"#0e0620","--bg-grad2":"#030108",
    "--bg3":"rgba(14,6,32,.96)",
    "--gold":"#7c3aed","--gold2":"#a78bfa","--gold3":"#5b21b6",
    "--border":"rgba(124,58,237,.3)","--b2":"rgba(255,255,255,.08)",
    "--text":"#f0eaff","--text2":"#8060b0"
  },
  rose_gold: {
    ad: "Rose Gold", emoji: "🌸",
    "--bg":"#120808","--bg-grad1":"#200f0f","--bg-grad2":"#0a0404",
    "--bg3":"rgba(32,15,15,.95)",
    "--gold":"#e8a0a0","--gold2":"#f5c5c5","--gold3":"#c07070",
    "--border":"rgba(232,160,160,.35)","--b2":"rgba(255,255,255,.08)",
    "--text":"#fff0f0","--text2":"#aa8888"
  },
  buz_celik: {
    ad: "Buz & Çelik", emoji: "🧊",
    "--bg":"#f0f4f8","--bg-grad1":"#e2eaf2","--bg-grad2":"#d0dce8",
    "--bg3":"rgba(255,255,255,.92)",
    "--gold":"#2c5282","--gold2":"#1a365d","--gold3":"#3a6ea8",
    "--border":"rgba(44,82,130,.2)","--b2":"rgba(0,0,0,.07)",
    "--text":"#1a202c","--text2":"#4a6080"
  },
  turuncu_gunes: {
    ad: "Turuncu Güneş", emoji: "☀️",
    "--bg":"#fff8f0","--bg-grad1":"#fff0e0","--bg-grad2":"#ffe8cc",
    "--bg3":"rgba(255,252,245,.93)",
    "--gold":"#e65c00","--gold2":"#c44800","--gold3":"#f47a20",
    "--border":"rgba(230,92,0,.2)","--b2":"rgba(0,0,0,.07)",
    "--text":"#1a0a00","--text2":"#7a4020"
  },
  limon_taze: {
    ad: "Limon Taze", emoji: "🍋",
    "--bg":"#fafff0","--bg-grad1":"#f0fadc","--bg-grad2":"#e8f5c8",
    "--bg3":"rgba(255,255,250,.95)",
    "--gold":"#5d8a00","--gold2":"#3a6000","--gold3":"#78af00",
    "--border":"rgba(93,138,0,.2)","--b2":"rgba(0,0,0,.07)",
    "--text":"#1a2200","--text2":"#507020"
  },
  krom_metalik: {
    ad: "Krom Metalik", emoji: "🔩",
    "--bg":"#0d0d0d","--bg-grad1":"#1a1a1a","--bg-grad2":"#080808",
    "--bg3":"rgba(26,26,26,.97)",
    "--gold":"#9e9e9e","--gold2":"#cfcfcf","--gold3":"#757575",
    "--border":"rgba(158,158,158,.2)","--b2":"rgba(255,255,255,.07)",
    "--text":"#f5f5f5","--text2":"#888888"
  }
};

// ── Temayı uygula ──────────────────────────────────────────────
function temaUygula(temaAdi) {
  const tema = TEMALAR[temaAdi] || TEMALAR["altin_gece"];
  const root = document.documentElement.style;
  Object.entries(tema).forEach(([k, v]) => {
    if (k.startsWith("--")) root.setProperty(k, v);
  });
  // Arkaplan gradient güncelle
  const bg     = tema["--bg"]       || "#080808";
  const grad1  = tema["--bg-grad1"] || "#1a1200";
  const grad2  = tema["--bg-grad2"] || "#0d0a00";
  document.body.style.background =
    `radial-gradient(ellipse at 20% 0%,${grad1} 0%,${bg} 55%),` +
    `radial-gradient(ellipse at 80% 100%,${grad2} 0%,${bg} 55%)`;
  document.body.style.backgroundAttachment = "fixed";
}

// ── Sayfa açılışında Firebase'den temayı oku ──────────────────
async function temaYukle() {
  try {
    // firebase-api.js yüklenmemişse bekle (max 3 sn)
    let waited = 0;
    while (typeof fbGet !== "function" && waited < 3000) {
      await new Promise(r => setTimeout(r, 100));
      waited += 100;
    }
    if (typeof fbGet !== "function") return; // sessizce geç
    const kayitliTema = await fbGet("ayarlar/tema");
    if (kayitliTema && TEMALAR[kayitliTema]) {
      temaUygula(kayitliTema);
    }
  } catch(e) {
    // Bağlantı yoksa sessizce geç, varsayılan tema kalır
  }
}

// ── Sayfa yüklenince çalıştır ─────────────────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", temaYukle);
} else {
  temaYukle();
}

window.TEMALAR    = TEMALAR;
window.temaUygula = temaUygula;
window.temaYukle  = temaYukle;
