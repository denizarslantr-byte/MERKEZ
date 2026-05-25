# Güvenlik Notları — MERKEZ V10.0


## V10.0 Ek Güvenlik İyileştirmeleri

6. **reportClientError() tüm Firebase operasyonlarına entegre edildi**
   - fbGet, fbSet, fbPush, fbUpdate, fbRemove hataları logAction'a yazılıyor.
   - messaging.js gönderme ve badge hataları da loglanıyor.

7. **safeLogDetails + getCurrentUserLabel logAction'da aktif**
   - Tüm log kayıtlarında şifre/pin maskeleme otomatik uygulanıyor.
   - Otel kullanıcısı localStorage'dan, merkez/admin sessionStorage'dan tanımlanıyor.

8. **Firebase rules .validate kuralları eklendi**
   - Tarih formatı, saat formatı, otel adı, mesaj uzunluğu sunucu tarafında doğrulanıyor.
   - Hem firebase-rules.json hem firebase-rules-production-auth.json güncellendi.

9. **sanitizeRez() addReservation'da aktif + isIsoDate/isTimeHHMM ile çift doğrulama**
   - Client tarafında sanitize → Firebase'e gitmeden önce format kontrolü.
   - Server tarafında .validate → Firebase'e yazmadan önce format kontrolü.

10. **Tema sistemi çift yol (ayarlar/tema + system/theme)**
    - Her iki path'e de yazıyor ve her ikisini de dinliyor.
    - Geriye dönük uyumluluk korunuyor.

## Önceki Düzeltmeler

1. **Veri doğrulama eklendi**
   - Rezervasyon tarih formatı: `YYYY-MM-DD`
   - Saat formatı: `HH:MM`
   - Otel adı zorunlu
   - Mesaj boş olamaz
   - Mesaj maksimum 1000 karakter

2. **Firebase yazma/okuma hata logları eklendi**
   - `fbGet`, `fbSet`, `fbPush`, `fbUpdate`, `fbRemove` artık hata durumunda `reportClientError()` çağırır.

3. **Hassas log temizliği eklendi**
   - `password=...`, `pin=...`, `şifre=...` gibi ifadeler loglarda maskelenir.

4. **XSS azaltma yardımcıları eklendi**
   - `escapeHtml()`
   - `safeText()`
   - `normalizeText()`

5. **Firebase kural dosyaları güçlendirildi**
   - `config/firebase-rules.json`: mevcut şifresiz yapı ile uyumlu validation/index kuralları.
   - `config/firebase-rules-production-auth.json`: Firebase Authentication geçişi sonrası kullanılacak kapalı güvenli kural şablonu.

## Önemli Uyarı

Mevcut sistem tam anlamıyla backend-auth kullanmadığı için `firebase-rules.json` dosyasında `.read` ve `.write` açık bırakıldı. Bu, mevcut giriş ekranlarının bozulmaması içindir.

Gerçek canlı kullanımda önerilen yapı:

```text
Firebase Authentication
+ roles/{uid}/role
+ production-auth rules
```

Bu geçiş yapılmadan veritabanı URL'sini bilen biri teknik olarak veriye erişebilir.

## Sıradaki En Doğru Aşama

1. Firebase Authentication ekle.
2. Kullanıcıları UID bazlı role bağla.
3. `firebase-rules-production-auth.json` dosyasını Firebase Rules alanına yükle.
4. Admin/merkez/otel girişlerini Firebase Auth ile değiştir.
5. Mesajlaşmayı `onValue` realtime listener ile polling yerine canlı dinlemeye geçir.
