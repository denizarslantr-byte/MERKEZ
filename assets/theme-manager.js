// Piano Deri Global Tema Sistemi V7.2
// Admin'de seçilen tema Firebase'e kaydedilir ve tüm ekranlarda otomatik uygulanır.
(function(){
  "use strict";
  const THEMES = [
    {id:"tema_01_altin_gece", name:"01 Altın Gece", img:"tema_01_altin_gece.png", vars:{gold:"#d6a63f", gold2:"#ffe58d", bg:"#07080f", bg2:"#0f1017", bg3:"#171923", card:"#181b27", border:"#3b2f18", text:"#f8f3df", text2:"#b8a978"}},
    {id:"tema_02_saf_beyaz", name:"02 Saf Beyaz", img:"tema_02_saf_beyaz.png", vars:{gold:"#3b82f6", gold2:"#2563eb", bg:"#f6f8fb", bg2:"#ffffff", bg3:"#eef2f7", card:"#ffffff", border:"#d7dee9", text:"#111827", text2:"#607084"}},
    {id:"tema_03_gece_mavisi", name:"03 Gece Mavisi", img:"tema_03_gece_mavisi.png", vars:{gold:"#60a5fa", gold2:"#bfdbfe", bg:"#06111f", bg2:"#0b1b2e", bg3:"#10253d", card:"#102033", border:"#1e4a78", text:"#eaf4ff", text2:"#93b5d6"}},
    {id:"tema_04_zumrut_yesil", fileId:"tema_04_zümrüt_yesil", name:"04 Zümrüt Yeşil", img:"tema_04_zümrüt_yesil.png", vars:{gold:"#34d399", gold2:"#a7f3d0", bg:"#04150f", bg2:"#082319", bg3:"#0d3326", card:"#0d2d22", border:"#176b4d", text:"#ecfdf5", text2:"#8fcbb6"}},
    {id:"tema_05_koral_turuncu", name:"05 Koral Turuncu", img:"tema_05_koral_turuncu.png", vars:{gold:"#fb923c", gold2:"#fed7aa", bg:"#170b07", bg2:"#24100a", bg3:"#32160d", card:"#2a140d", border:"#7c2d12", text:"#fff7ed", text2:"#fdba74"}},
    {id:"tema_06_mor_kristal", name:"06 Mor Kristal", img:"tema_06_mor_kristal.png", vars:{gold:"#c084fc", gold2:"#e9d5ff", bg:"#11071f", bg2:"#1d0f31", bg3:"#2a1746", card:"#24133d", border:"#6b21a8", text:"#faf5ff", text2:"#c4b5fd"}},
    {id:"tema_07_pembe_rose", name:"07 Pembe Rose", img:"tema_07_pembe_rose.png", vars:{gold:"#fb7185", gold2:"#fecdd3", bg:"#1d0710", bg2:"#2b0d18", bg3:"#3a1422", card:"#31111d", border:"#9f1239", text:"#fff1f2", text2:"#fda4af"}},
    {id:"tema_08_buz_mavisi", name:"08 Buz Mavisi", img:"tema_08_buz_mavis.png", vars:{gold:"#67e8f9", gold2:"#cffafe", bg:"#06181d", bg2:"#0b2931", bg3:"#113943", card:"#102f38", border:"#0e7490", text:"#ecfeff", text2:"#a5f3fc"}},
    {id:"tema_09_kahve_krem", name:"09 Kahve Krem", img:"tema_09_kahve_krem.png", vars:{gold:"#d6b078", gold2:"#f5e6c8", bg:"#140e0a", bg2:"#211812", bg3:"#302219", card:"#2a1d15", border:"#8b5e34", text:"#fff8ed", text2:"#d8c3a5"}},
    {id:"tema_10_neon_siber", name:"10 Neon Siber", img:"tema_10_neon_siber.png", vars:{gold:"#22d3ee", gold2:"#f0abfc", bg:"#05070e", bg2:"#0a1020", bg3:"#11182c", card:"#0e1426", border:"#155e75", text:"#f8fafc", text2:"#7dd3fc"}},
    {id:"tema_11_kirmizi_deri", name:"11 Kırmızı Deri", img:"tema_11_kirmizi_deri.png", vars:{gold:"#ef4444", gold2:"#fecaca", bg:"#160607", bg2:"#260b0d", bg3:"#3a1114", card:"#301014", border:"#991b1b", text:"#fff1f2", text2:"#fca5a5"}},
    {id:"tema_12_limon_taze", name:"12 Limon Taze", img:"tema_12_limon_taze.png", vars:{gold:"#84cc16", gold2:"#d9f99d", bg:"#101605", bg2:"#1a2409", bg3:"#25330d", card:"#202c0c", border:"#4d7c0f", text:"#f7fee7", text2:"#bef264"}},
    {id:"tema_13_lacivert_altin", name:"13 Lacivert Altın", img:"tema_13_lacivert_altin.png", vars:{gold:"#fbbf24", gold2:"#fde68a", bg:"#050b1a", bg2:"#081229", bg3:"#101d3b", card:"#0d1931", border:"#92400e", text:"#f8fafc", text2:"#cbd5e1"}},
    {id:"tema_14_gri_minimal", name:"14 Gri Minimal", img:"tema_14_gri_minimal.png", vars:{gold:"#a3a3a3", gold2:"#e5e5e5", bg:"#0c0c0d", bg2:"#171717", bg3:"#242424", card:"#1f1f1f", border:"#525252", text:"#f5f5f5", text2:"#a3a3a3"}},
    {id:"tema_15_okyanus_derin", name:"15 Okyanus Derin", img:"tema_15_okyanus_derin.png", vars:{gold:"#2dd4bf", gold2:"#99f6e4", bg:"#031513", bg2:"#082522", bg3:"#0d3632", card:"#0c302d", border:"#0f766e", text:"#f0fdfa", text2:"#5eead4"}},
    {id:"tema_16_altun_cami", name:"16 Altın Cami", img:"tema_16_altun_cami.png", vars:{gold:"#f59e0b", gold2:"#fde68a", bg:"#160f04", bg2:"#241907", bg3:"#33240b", card:"#2c200a", border:"#b45309", text:"#fffbeb", text2:"#fcd34d"}},
    {id:"tema_17_pastel_mint", name:"17 Pastel Mint", img:"tema_17_pastel_mint.png", vars:{gold:"#10b981", gold2:"#6ee7b7", bg:"#eefdf8", bg2:"#ffffff", bg3:"#dff8f0", card:"#ffffff", border:"#a7f3d0", text:"#064e3b", text2:"#047857"}},
    {id:"tema_18_karanlik_mor", fileId:"tema_18_karanlık_mor-3", name:"18 Karanlık Mor", img:"tema_18_karanlık_mor-3.png", vars:{gold:"#a78bfa", gold2:"#ddd6fe", bg:"#090516", bg2:"#120a27", bg3:"#1e123b", card:"#1a1033", border:"#5b21b6", text:"#f5f3ff", text2:"#c4b5fd"}},
    {id:"tema_19_turuncu_gunes", name:"19 Turuncu Güneş", img:"tema_19_turuncu_gunes-1.png", vars:{gold:"#f97316", gold2:"#ffedd5", bg:"#180b02", bg2:"#2a1205", bg3:"#3b1a07", card:"#331605", border:"#c2410c", text:"#fff7ed", text2:"#fdba74"}},
    {id:"tema_20_krom_metalik", name:"20 Krom Metalik", img:"tema_20_krom_metalik-1.png", vars:{gold:"#c0c7d1", gold2:"#f1f5f9", bg:"#090b0f", bg2:"#11151b", bg3:"#1d232b", card:"#171d25", border:"#64748b", text:"#f8fafc", text2:"#cbd5e1"}}
  ];
  const DEFAULT_THEME_ID = "tema_01_altin_gece";

  // V8 uyumluluğu: V8'de kullanılan kısa tema anahtarlarını V7.2 tema id'lerine bağlar.
  const LEGACY_THEME_ALIASES = {
    altin_gece:"tema_01_altin_gece", saf_beyaz:"tema_02_saf_beyaz", gece_mavisi:"tema_03_gece_mavisi", zumrut_yesil:"tema_04_zumrut_yesil",
    mor_kristal:"tema_06_mor_kristal", koral_turuncu:"tema_05_koral_turuncu", lacivert_altin:"tema_16_lacivert_altin", kirmizi_deri:"tema_11_kirmizi_deri",
    neon_siber:"tema_10_neon_siber", kahve_krem:"tema_09_kahve_krem", pembe_rose:"tema_07_pembe_rose", buz_mavisi:"tema_08_buz_mavisi",
    limon_taze:"tema_12_limon_taze", krom_metalik:"tema_20_krom_metalik", buz_celik:"tema_19_buz_celik", turuncu_gunes:"tema_18_turuncu_gunes"
  };
  const LEGACY_BY_ID = Object.fromEntries(Object.entries(LEGACY_THEME_ALIASES).map(([legacy,id]) => [id, legacy]));
  let currentThemeId = null;
  let unsubscribed = false;
  function themeById(id){ const normalized = LEGACY_THEME_ALIASES[id] || id; return THEMES.find(t => t.id === normalized || t.fileId === normalized) || THEMES[0]; }
  function cssVars(vars){
    return {
      "--gold":vars.gold,"--gold2":vars.gold2,"--bg":vars.bg,"--bg2":vars.bg2,"--bg3":vars.bg3,"--card":vars.card,"--card2":vars.bg3,
      "--border":vars.border,"--b":vars.border,"--text":vars.text,"--text2":vars.text2,"--muted":vars.text2,
      "--blue":vars.gold,"--green":"#22c55e","--red":"#ef4444","--warn":"#f59e0b"
    };
  }
  function applyTheme(id, saveLocal=true){
    const t=themeById(id||DEFAULT_THEME_ID); currentThemeId=t.id;
    document.documentElement.setAttribute("data-piano-theme", t.id);
    const map=cssVars(t.vars);
    Object.keys(map).forEach(k => document.documentElement.style.setProperty(k, map[k]));
    let meta=document.querySelector('meta[name="theme-color"]');
    if(!meta){ meta=document.createElement('meta'); meta.name='theme-color'; document.head.appendChild(meta); }
    meta.content=t.vars.bg;
    if(saveLocal) localStorage.setItem("pianoActiveTheme", t.id);
    window.dispatchEvent(new CustomEvent("piano-theme-applied", {detail:t}));
  }
  async function saveTheme(id){
    const t=themeById(id); applyTheme(t.id, true);
    try {
      const payload = {id:t.id, name:t.name, updatedAt:new Date().toISOString(), updatedBy:"admin"};
      if (window.fbSet) {
        await window.fbSet("system/theme", payload);
        // V8 uyumluluğu: eski/sade tema okuyucularının da seçimi görmesi için kısa anahtar yazılır.
        await window.fbSet("ayarlar/tema", LEGACY_BY_ID[t.id] || t.id);
      } else await directSetTheme(t);
      return {success:true};
    } catch(e){ console.warn("Tema Firebase kaydedilemedi, local uygulandı", e); return {success:false, message:e.message}; }
  }
  async function directSetTheme(t){
    if (!window.FIREBASE_CONFIG) throw new Error("Firebase config yok");
    const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getDatabase, ref, set } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js");
    const app = getApps().length ? getApps()[0] : initializeApp(window.FIREBASE_CONFIG || FIREBASE_CONFIG);
    const database = getDatabase(app);
    await set(ref(database, "system/theme"), {id:t.id,name:t.name,updatedAt:new Date().toISOString(),updatedBy:"admin"});
    await set(ref(database, "ayarlar/tema"), LEGACY_BY_ID[t.id] || t.id);
  }
  async function loadThemeOnce(){
    let id=localStorage.getItem("pianoActiveTheme") || DEFAULT_THEME_ID; applyTheme(id, false);
    try {
      let remote=null, legacy=null;
      if (window.fbGet) {
        remote = await window.fbGet("system/theme");
        if (!remote || !remote.id) legacy = await window.fbGet("ayarlar/tema");
      }
      if (remote && remote.id) applyTheme(remote.id, true);
      else if (legacy) applyTheme(legacy, true);
    } catch(e){ /* offline/local devam */ }
  }
  async function listenTheme(){
    try {
      if (!window.initFirebase || !window._fb) return;
      const database = await window.initFirebase();
      window._fb.onValue(window._fb.ref(database, "system/theme"), snap => {
        if(!snap.exists()) return; const val=snap.val(); if(val && val.id && val.id!==currentThemeId) applyTheme(val.id,true);
      });
      window._fb.onValue(window._fb.ref(database, "ayarlar/tema"), snap => {
        if(!snap.exists()) return; const val=snap.val(); const id = LEGACY_THEME_ALIASES[val] || val; if(id && id!==currentThemeId) applyTheme(id,true);
      });
    } catch(e){ /* sessiz: tema local kalır */ }
  }
  function renderThemeAdmin(containerId="themeGrid"){
    const el=document.getElementById(containerId); if(!el) return;
    el.innerHTML = THEMES.map(t => `<button type="button" class="theme-card" data-theme-id="${t.id}" onclick="PianoTheme.select('${t.id}')">
      <img src="../assets/themes/${t.img}" alt="${t.name}" loading="lazy">
      <span>${t.name}</span>
      <small>${t.id===currentThemeId?'Aktif tema':'Seç ve tüm ekranlara uygula'}</small>
    </button>`).join("");
  }
  async function select(id){
    const r=await saveTheme(id); renderThemeAdmin();
    const msg = r.success ? "✅ Tema tüm ekranlara uygulandı" : "⚠️ Tema bu ekranda uygulandı ama Firebase kaydı yapılamadı: "+r.message;
    if (window.showToast) showToast(msg, r.success?"ok":"err"); else alert(msg);
  }
  window.PianoTheme={themes:THEMES,apply:applyTheme,save:saveTheme,select,renderThemeAdmin,get current(){return currentThemeId}};
  document.addEventListener("DOMContentLoaded", async()=>{ await loadThemeOnce(); renderThemeAdmin(); setTimeout(listenTheme, 500); });
})();
