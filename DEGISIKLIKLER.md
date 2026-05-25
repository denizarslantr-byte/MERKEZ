# Piano Deri — MERKEZ 1.4 Değişiklik Rehberi

**Temel:** `merkez-1.3`
**Cherry-pick kaynakları:** `merkez-final-merged`, `merkez-final-full`
**Yeni:** Frontend komponent mimarisi

---

## 📁 Değişen / Eklenen Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `assets/messaging.js` | 3× retry + exponential backoff + buton disable/enable + _esc() XSS |
| `assets/common.js` | `sanitizeRez()` — `ayak`, `ciktiSaati` alanları eklendi |
| `assets/firebase-api.js` | `window._fbAuth` global, güvenlik yorum bloğu, adminPinHash sistemi |
| `config/config.js` | `__PIANO_API_KEY__` ortam değişkeni pattern'i |
| `config/firebase.js.example` | **YENİ** — güvenli onboarding şablonu |
| `config/firebase-rules.json` | `adminPinHash` validate + `adminPin` kapatıldı |
| `.gitignore` | **YENİ** — secret leak koruması |
| `center/components/reservation-table.js` | **YENİ** — tablo bileşeni |
| `center/components/toast.js` | **YENİ** — toast bileşeni (showToast alias dahil) |
| `center/services/reservation-service.js` | **YENİ** — rezervasyon servis katmanı |
| `center/services/hotel-service.js` | **YENİ** — otel/personel servis katmanı |
| `center/views/dashboard-view.js` | **YENİ** — dashboard view orkestratörü |
| `center/utils/date-utils.js` | **YENİ** — tarih/saat yardımcıları |
| `center/utils/format-utils.js` | **YENİ** — format + XSS escape yardımcıları |
| `hotel/components/hotel-reservation-card.js` | **YENİ** — otel kart bileşeni |
| `hotel/services/hotel-reservation-service.js` | **YENİ** — otel rezervasyon servisi |
| `hotel/views/hotel-panel-view.js` | **YENİ** — otel panel view |
| `hotel/utils/hotel-utils.js` | **YENİ** — otel yardımcıları |
| `admin/components/modal.js` | **YENİ** — yeniden kullanılabilir modal |
| `admin/services/auth-service.js` | **YENİ** — admin PIN auth servisi |
| `admin/services/admin-data-service.js` | **YENİ** — admin CRUD servisi |
| `admin/utils/admin-utils.js` | **YENİ** — admin yardımcıları |
| `manager/components/manager-filter.js` | **YENİ** — tarih filtre bileşeni |
| `manager/services/manager-service.js` | **YENİ** — manager servis katmanı |
| `manager/views/manager-view.js` | **YENİ** — manager view orkestratörü |
| `manager/utils/manager-utils.js` | **YENİ** — manager yardımcıları |
| `MERKEZ_1_4_NOTLAR.txt` | **YENİ** — detaylı sürüm notları |

---

## 🔄 Messaging — Retry Akışı

```
Kullanıcı "MESAJ GÖNDER" tıklar
  → Buton devre dışı + "Gönderiliyor..."
  → sendMessage() dene (deneme 1)
    ✅ Başarı → metin temizle, toast göster, buton etkinleştir
    ❌ Hata   → 800ms bekle, tekrar (deneme 2)
               ❌ Hata → 1600ms bekle, tekrar (deneme 3)
               ❌ Hata → "Gönderilemedi" toast + reportClientError()
  → Her durumda buton etkinleştir
```

---

## 🏗️ Komponent Mimarisi

```
admin/
  components/  modal.js
  services/    auth-service.js, admin-data-service.js
  utils/       admin-utils.js

hotel/
  components/  hotel-reservation-card.js
  services/    hotel-reservation-service.js
  views/       hotel-panel-view.js
  utils/       hotel-utils.js

center/
  components/  reservation-table.js, toast.js
  services/    reservation-service.js, hotel-service.js
  views/       dashboard-view.js
  utils/       date-utils.js, format-utils.js

manager/
  components/  manager-filter.js
  services/    manager-service.js
  views/       manager-view.js
  utils/       manager-utils.js
```

Tüm modüller `window.*` üzerine export edilir; mevcut HTML sayfaları bozulmadan çalışmaya devam eder.

---

## 🔐 Admin PIN Geçiş Akışı

```
adminAuth(pin) çağrılır:
  1. ayarlar/adminPinHash var mı? → SHA-256 karşılaştır
  2. ayarlar/adminPin sha256$ prefix'li mi? → hash karşılaştır + adminPinHash'e migrate
  3. ayarlar/adminPin düz metin mi? → karşılaştır + adminPinHash'e migrate
```

---

## ⚠️ Dikkat Edilecekler

1. `config/firebase.js` dosyasını Git'e commit etmeyin — `.gitignore` korumakta.
2. `firebase.js.example` şablonunu kullanarak `firebase.js` oluşturun.
3. Admin PIN ilk girişte otomatik `adminPinHash`'e migrate edilir.
4. Komponent modülleri `<script>` olarak HTML'e eklenmeden aktif olmaz.
5. Realtime listener bellek sızıntısı: tarih değişiminde `_unsubscribe()` çağrısı zorunlu (View modülleri bunu otomatik yapar).
