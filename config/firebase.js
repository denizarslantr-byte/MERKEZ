// Piano Deri V7.0 — Firebase Konfigürasyon
// ⚠️  Bu dosyayı Git'e COMMIT ETMEYİN — .gitignore koruyor
// Proje: rezervasyon-3f1b7 (mevcut canlı proje)

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

// Mevcut proje anonim auth ile çalışıyor — true olarak bırak
// Firebase Email/Password geçişi yapıldığında false yap
const FIREBASE_ALLOW_ANONYMOUS_AUTH = true;
