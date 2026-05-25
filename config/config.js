// Piano Deri — Konfigürasyon
// ─────────────────────────────────────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbxCTdPJ4P89KDDYOairoh0ClPZXwU2aDkrGMKUPilsRxMcTLN3EOg2NLZOionuavBM8Ug/exec";

const API_KEY =
  (typeof __PIANO_API_KEY__ !== "undefined" && __PIANO_API_KEY__) ? __PIANO_API_KEY__ :
  (typeof window !== "undefined" && window.PIANO_API_KEY ? window.PIANO_API_KEY : "");

// ─── Firebase ───────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAUJG2YGDwKqGcYZ7yhiS-_Jg7vdIyaCfs",
  authDomain:        "rezervasyon-3f1b7.firebaseapp.com",
  databaseURL:       "https://rezervasyon-3f1b7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "rezervasyon-3f1b7",
  storageBucket:     "rezervasyon-3f1b7.firebasestorage.app",
  messagingSenderId: "311071244350",
  appId:             "1:311071244350:web:c82f856965d15a676f516f"
};

const ADMIN_PIN_KEY = "adminPin";
const DEFAULT_PIN   = "1907";
const FIREBASE_ALLOW_ANONYMOUS_AUTH = true;
